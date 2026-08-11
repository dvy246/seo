// Beta signup API for SerpCraft Release Guard beta waitlist
// POST /api/beta-signup
// Stores signup in KV with email as key for deduplication

import { cors, json, checkRateLimit, sha1 } from '../_shared/guard';

interface Env {
  AUDIT_KV: KVNamespace;
}

interface BetaSignup {
  name: string;
  email: string;
  company: string;
  stagingUrl: string;
  productionUrl: string;
  useCase: string;
  timestamp: string;
  id: string;
}

export async function onRequestPost(context: { request: Request; env: { AUDIT_KV: KVNamespace } }): Promise<Response> {
  const { request, env } = context;

  // Rate limit: 5 signups/hour/IP
  const rateLimited = await checkRateLimit(env, new Request(new Request(request.url, request)), {
    limit: 5,
    windowSeconds: 3600,
    scope: 'beta-signup',
  });
  if (rateLimited) return new Response(null, { status: rateLimited.status, headers: { ...rateLimited.headers } });

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { name, email, company, stagingUrl, productionUrl, useCase } = body as Record<string, string>;

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !company?.trim() || !stagingUrl?.trim() || !productionUrl?.trim()) {
    return json({ error: 'All fields are required' }, 400);
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email format' }, 400);
  }

  // Validate URLs
  try {
    new URL(stagingUrl);
    new URL(productionUrl);
  } catch {
    return json({ error: 'Invalid URL format' }, 400);
  }

  // Check if email already signed up
  const emailHash = await sha1(email.toLowerCase());
  const existing = await env.AUDIT_KV.get(`beta:${emailHash}`);
  if (existing) {
    return json({ error: 'This email is already on the waitlist' }, 409);
  }

  // Create signup record
  const signup: Record<string, string> = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    company: company.trim(),
    stagingUrl: stagingUrl.trim(),
    productionUrl: productionUrl.trim(),
    useCase: useCase || 'staging-vs-prod',
    timestamp: new Date().toISOString(),
    id: await sha1(`${email}:${Date.now()}`),
  };

  // Store in KV with 1 year TTL
  await env.AUDIT_KV.put(`beta:${emailHash}`, JSON.stringify(signup), { expirationTtl: 31536000 });
  await env.AUDIT_KV.put(`beta:list:${signup.id}`, JSON.stringify(signup), { expirationTtl: 31536000 });

  return json({ success: true, message: 'Successfully joined the beta waitlist!' });
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: cors() });
}