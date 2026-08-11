// Cloudflare Pages Function: OG Image Checker.
// POST /api/og-image  body: { "url": "https://example.com/og.png" }
//
// Fetches the image server-side and verifies it meets Open Graph best
// practices: loadable, valid format, 1200x630+ dimensions, ~1.91:1 aspect,
// reasonable file size. Browsers cannot do this reliably client-side
// (CORS), so this is a genuine differentiator.
//
// - SSRF guard (shared) + rate limit 30/hr/IP + 24h cache via AUDIT_KV.

import { json, cors, checkRateLimit, cacheGet, cachePut, isPrivateHost, looksSuspiciousUrl, sha1 } from '../_shared/guard';
import type { AuditCheck } from '../../src/lib/validator';

interface Env {
  AUDIT_KV?: KVNamespace;
}

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h
const MAX_BYTES = 10 * 1024 * 1024; // reject > 10MB
const HEAD_BYTES = 262144; // read up to 256KB of headers to identify format

// --- Image header parsing (pure byte parsing, no dependencies) --------------

interface ImageInfo {
  format: string | null;
  width: number | null;
  height: number | null;
}

function parsePng(buf: Uint8Array): ImageInfo {
  if (buf.length < 24) return { format: 'png', width: null, height: null };
  const dv = new DataView(buf.buffer, buf.byteOffset, 24);
  return { format: 'png', width: dv.getUint32(16), height: dv.getUint32(20) };
}

function parseJpeg(buf: Uint8Array): ImageInfo {
  if (buf.length < 8) return { format: 'jpeg', width: null, height: null };
  let off = 2;
  while (off + 9 < buf.length) {
    if (buf[off] !== 0xff) {
      off++;
      continue;
    }
    const marker = buf[off + 1];
    // SOF0-SOF15 (skip DHT=C4, JPG=C8, DAC=CC)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = (buf[off + 5] << 8) | buf[off + 6];
      const width = (buf[off + 7] << 8) | buf[off + 8];
      return { format: 'jpeg', width, height };
    }
    const segLen = (buf[off + 2] << 8) | buf[off + 3];
    if (segLen < 2) break;
    off += 2 + segLen;
  }
  return { format: 'jpeg', width: null, height: null };
}

function parseWebp(buf: Uint8Array): ImageInfo {
  if (buf.length < 30) return { format: 'webp', width: null, height: null };
  const dv = new DataView(buf.buffer, buf.byteOffset, 30);
  const chunk = String.fromCharCode(buf[12], buf[13], buf[14], buf[15]);
  if (chunk === 'VP8X' && buf.length >= 30) {
    return { format: 'webp', width: dv.getUint32(24, true) + 1, height: dv.getUint32(28, true) + 1 };
  }
  if (chunk === 'VP8 ' && buf.length >= 30) {
    return { format: 'webp', width: dv.getUint16(26, true) & 0x3fff, height: dv.getUint16(28, true) & 0x3fff };
  }
  if (chunk === 'VP8L' && buf.length >= 25) {
    const b = buf.slice(21, 25);
    const width = (b[0] | ((b[1] & 0x3f) << 8)) + 1;
    const height = ((b[1] >> 6) | ((b[2] & 0x3f) << 2) | ((b[3] & 0x0f) << 10)) + 1;
    return { format: 'webp', width, height };
  }
  return { format: 'webp', width: null, height: null };
}

function parseGif(buf: Uint8Array): ImageInfo {
  if (buf.length < 10) return { format: 'gif', width: null, height: null };
  const dv = new DataView(buf.buffer, buf.byteOffset, 10);
  return { format: 'gif', width: dv.getUint16(6, true), height: dv.getUint16(8, true) };
}

function parseBmp(buf: Uint8Array): ImageInfo {
  if (buf.length < 26) return { format: 'bmp', width: null, height: null };
  const dv = new DataView(buf.buffer, buf.byteOffset, 26);
  return { format: 'bmp', width: dv.getUint32(18, true), height: Math.abs(dv.getInt32(22, true)) };
}

function parseSvg(buf: Uint8Array): ImageInfo {
  const text = new TextDecoder().decode(buf.slice(0, 8192)).slice(0, 4096);
  const wAttr = text.match(/width=["'](\d+(?:\.\d+)?)/i);
  const hAttr = text.match(/height=["'](\d+(?:\.\d+)?)/i);
  if (wAttr && hAttr) return { format: 'svg', width: Math.round(parseFloat(wAttr[1])), height: Math.round(parseFloat(hAttr[1])) };
  const vb = text.match(/viewBox=["'](-?[\d.]+)[\s,]+(-?[\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)["']/i);
  if (vb) return { format: 'svg', width: Math.round(parseFloat(vb[3])), height: Math.round(parseFloat(vb[4])) };
  return { format: 'svg', width: null, height: null };
}

function parseImage(buf: Uint8Array): ImageInfo {
  const sig = String.fromCharCode(buf[0] || 0, buf[1] || 0, buf[2] || 0, buf[3] || 0, buf[4] || 0, buf[5] || 0, buf[6] || 0, buf[7] || 0);
  if (sig.startsWith('\x89PNG')) return parsePng(buf);
  if (buf[0] === 0xff && buf[1] === 0xd8) return parseJpeg(buf);
  if (sig.slice(0, 4) === 'RIFF' && sig.slice(8, 12) === 'WEBP') return parseWebp(buf);
  if (sig.startsWith('GIF87a') || sig.startsWith('GIF89a')) return parseGif(buf);
  if (sig.startsWith('BM')) return parseBmp(buf);
  if (sig.includes('<svg') || sig.includes('<?xml')) return parseSvg(buf);
  return { format: null, width: null, height: null };
}

// --- Checks ----------------------------------------------------------------

function buildImageChecks(info: ImageInfo, sizeBytes: number, httpStatus: number): AuditCheck[] {
  const checks: AuditCheck[] = [];

  if (httpStatus >= 200 && httpStatus < 300) checks.push({ category: 'Social', label: 'Image Loadable', status: 'pass', message: `Image fetched successfully (HTTP ${httpStatus}).`, impact: 'high' });
  else checks.push({ category: 'Social', label: 'Image Loadable', status: 'error', message: `Image could not be fetched (HTTP ${httpStatus}).`, impact: 'high' });

  if (!info.format) checks.push({ category: 'Social', label: 'Image Format', status: 'error', message: 'Unrecognized image format.', impact: 'high' });
  else if (info.format === 'gif' || info.format === 'bmp' || info.format === 'svg') checks.push({ category: 'Social', label: 'Image Format', status: 'warning', message: `${info.format.toUpperCase()} is supported but JPG/PNG/WebP are recommended for Open Graph.`, impact: 'high' });
  else checks.push({ category: 'Social', label: 'Image Format', status: 'pass', message: `${info.format.toUpperCase()} — recommended format.`, impact: 'high' });

  if (info.width && info.height) {
    if (info.width >= 1200 && info.height >= 630) checks.push({ category: 'Social', label: 'Image Dimensions', status: 'pass', message: `${info.width}×${info.height} — meets the 1200×630 minimum.`, impact: 'high' });
    else if (info.width >= 600 && info.height >= 315) checks.push({ category: 'Social', label: 'Image Dimensions', status: 'warning', message: `${info.width}×${info.height} — usable, but 1200×630 is recommended for sharp previews.`, impact: 'high' });
    else checks.push({ category: 'Social', label: 'Image Dimensions', status: 'error', message: `${info.width}×${info.height} — too small, social platforms will upscale it poorly.`, impact: 'high' });

    const ratio = info.width / info.height;
    if (ratio >= 1.7 && ratio <= 2.2) checks.push({ category: 'Social', label: 'Aspect Ratio', status: 'pass', message: `Ratio 1:${(info.width / info.height).toFixed(2)} — close to the recommended 1.91:1.`, impact: 'medium' });
    else checks.push({ category: 'Social', label: 'Aspect Ratio', status: 'warning', message: `Ratio 1:${(info.width / info.height).toFixed(2)} — Facebook/LinkedIn crop to 1.91:1.`, impact: 'medium' });
  } else {
    checks.push({ category: 'Social', label: 'Image Dimensions', status: 'warning', message: 'Dimensions could not be parsed from the image header.', impact: 'high' });
  }

  const mb = sizeBytes / (1024 * 1024);
  if (sizeBytes <= 2 * 1024 * 1024) checks.push({ category: 'Social', label: 'File Size', status: 'pass', message: `${mb.toFixed(1)} MB — loads fast.`, impact: 'low' });
  else if (sizeBytes <= 5 * 1024 * 1024) checks.push({ category: 'Social', label: 'File Size', status: 'warning', message: `${mb.toFixed(1)} MB — under 2 MB is recommended for fast social fetching.`, impact: 'low' });
  else checks.push({ category: 'Social', label: 'File Size', status: 'error', message: `${mb.toFixed(1)} MB — too large, some platforms will refuse or time out.`, impact: 'low' });

  return checks;
}

// --- Handler ----------------------------------------------------------------

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }
  const rawUrl = typeof body?.url === 'string' ? body.url.trim() : '';
  if (!rawUrl) return json({ error: 'url is required.' }, 400);
  if (looksSuspiciousUrl(rawUrl)) return json({ error: 'URL scheme not allowed.' }, 400);

  let normalizedUrl: string;
  try {
    const u = new URL(rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl}`);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad scheme');
    if (isPrivateHost(u.hostname)) return json({ error: 'URL points to a private or local address.' }, 400);
    normalizedUrl = u.toString();
  } catch {
    return json({ error: 'Invalid URL format.' }, 400);
  }

  const rateLimited = await checkRateLimit(env, request, { limit: 30, windowSeconds: 3600, scope: 'og-image' });
  if (rateLimited) return rateLimited;

  const cacheKey = `og-image:cache:${await sha1(normalizedUrl)}`;
  const cached = await cacheGet<Record<string, unknown>>(env, cacheKey);
  if (cached) return json({ ...cached, cached: true });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(normalizedUrl, {
      headers: { 'User-Agent': 'SerpCraft-Auditor/1.0 (+https://metaforge.app)', Accept: 'image/*,image/svg+xml' },
      redirect: 'follow',
      signal: controller.signal,
    });

    const contentType = res.headers.get('Content-Type') || '';
    const contentLength = Number(res.headers.get('Content-Length') || '0');
    if (contentLength > MAX_BYTES) return json({ error: 'Image is larger than 10 MB.' }, 413);
    if (!res.ok) return json({ error: `Failed to fetch image (HTTP ${res.status}).` }, 502);

    // Read at most HEAD_BYTES to identify the format + dimensions.
    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    if (reader) {
      while (total < HEAD_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        total += value.length;
      }
      await reader.cancel().catch(() => undefined);
    }
    const head = new Uint8Array(total);
    let pos = 0;
    for (const c of chunks) {
      head.set(c, pos);
      pos += c.length;
    }

    const info = parseImage(head);
    const sizeBytes = contentLength || total;
    const checks = buildImageChecks(info, sizeBytes, res.status);
    const pass = checks.every((c) => c.status === 'pass');
    const payload = { url: normalizedUrl, resolvedUrl: res.url, contentType, format: info.format, width: info.width, height: info.height, sizeBytes, checks, pass, cached: false };

    await cachePut(env, cacheKey, payload, CACHE_TTL_SECONDS);
    return json(payload);
  } catch (err) {
    const msg = err instanceof Error && err.name === 'AbortError' ? 'Request timed out (8s).' : 'Image check failed. Please try again.';
    return json({ error: msg }, 500);
  } finally {
    clearTimeout(timer);
  }
};

export const onRequest: PagesFunction<Env> = async ({ request }) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  return json({ error: 'Method not allowed. Use POST.' }, 405);
};
