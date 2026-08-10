// Shared security helpers for MetaForge Pages Functions (functions/api/*).
// Imported via relative paths (Pages Functions bundle with esbuild).

export interface RateLimitOptions {
  limit: number; // requests per window
  windowSeconds: number;
  scope: string; // e.g. 'audit', 'og-image'
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export function cors(): Record<string, string> {
  return CORS;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: CORS });
}

// --- SSRF guard -------------------------------------------------------------

export function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, '');
  if (h === 'localhost' || h === '::1' || h === '0.0.0.0') return true;
  if (h.endsWith('.local') || h.endsWith('.internal') || h.endsWith('.lan')) return true;
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(h);
  if (isIp) {
    const parts = h.split('.').map(Number);
    if (parts.some((p) => p > 255)) return true;
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 198 && (b === 18 || b === 19)) return true;
  }
  return false;
}

export function looksSuspiciousUrl(raw: string): boolean {
  const lower = raw.toLowerCase();
  if (lower.startsWith('file:') || lower.startsWith('gopher:') || lower.startsWith('ftp:')) return true;
  return false;
}

export function normalizeHttpUrl(raw: string): { url: string } | { error: string; status: number } {
  const trimmed = raw.trim();
  let u: URL;
  try {
    u = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
  } catch {
    return { error: 'Invalid URL format.', status: 400 };
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return { error: 'URL scheme not allowed.', status: 400 };
  if (isPrivateHost(u.hostname)) return { error: 'URL points to a private or local address.', status: 400 };
  return { url: u.toString() };
}

// --- KV rate limiting --------------------------------------------------------

// Returns an error Response if rate-limited, otherwise null.
export async function checkRateLimit(
  env: { AUDIT_KV?: KVNamespace },
  request: Request,
  opts: RateLimitOptions
): Promise<Response | null> {
  if (!env.AUDIT_KV) return null; // no binding → allow (local dev)
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rl:${opts.scope}:${ip}`;
  const count = Number((await env.AUDIT_KV.get(key)) || '0');
  if (count >= opts.limit) {
    return json({ error: `Rate limit reached (${opts.limit} requests per ${Math.round(opts.windowSeconds / 60)} minutes). Please try again later.` }, 429);
  }
  await env.AUDIT_KV.put(key, String(count + 1), { expirationTtl: opts.windowSeconds });
  return null;
}

export async function cacheGet<T>(env: { AUDIT_KV?: KVNamespace }, key: string): Promise<T | null> {
  if (!env.AUDIT_KV) return null;
  try {
    return (await env.AUDIT_KV.get(key, 'json')) as T | null;
  } catch {
    return null;
  }
}

export async function cachePut(env: { AUDIT_KV?: KVNamespace }, key: string, value: unknown, ttlSeconds: number): Promise<void> {
  if (!env.AUDIT_KV) return;
  await env.AUDIT_KV.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds });
}

export async function sha1(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(input));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}
