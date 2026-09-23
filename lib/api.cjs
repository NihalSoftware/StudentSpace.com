'use strict';
const http = require('node:http');
const crypto = require('node:crypto');
const { isIP } = require('node:net');
const { intents, projects } = require('../src/content');

const MAX_BYTES = 16 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const REASONS = { give_back: 'build', edplan_school: 'edplan', media_partnership: 'partner', other: 'other' };
const INTENTS = new Set(intents.map(item => item[0]));
const PROJECTS = new Set(projects.map(item => item.slug));
const escapeHtml = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function configuration(env = process.env) {
  const origins = (env.ALLOWED_ORIGINS || (env.NODE_ENV === 'production' ? '' : 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173')).split(',').map(x => x.trim()).filter(Boolean);
  if (env.SITE_URL && env.VERCEL_ENV !== 'preview') origins.push(env.SITE_URL);
  if (env.VERCEL === '1') {
    for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL]) if (host) origins.push('https://' + host);
  }
  for (const origin of origins) {
    const parsed = new URL(origin);
    if (parsed.origin !== origin || !['https:', 'http:'].includes(parsed.protocol)) throw new Error('ALLOWED_ORIGINS must contain exact HTTP(S) origins.');
    if (env.NODE_ENV === 'production' && parsed.protocol !== 'https:') throw new Error('Production origins must use HTTPS.');
  }
  return {
    apiKey: env.RESEND_API_KEY || '',
    from: env.RESEND_FROM_EMAIL || '',
    to: env.VERCEL_ENV === 'preview' ? (env.PREVIEW_NOTIFY_EMAIL || '') : (env.NOTIFY_EMAIL || 'advisor@studentspace.com'),
    preview: env.VERCEL_ENV === 'preview',
    productionTo: env.NOTIFY_EMAIL || 'advisor@studentspace.com',
    allowedOrigins: new Set(origins),
    production: env.NODE_ENV === 'production',
    vercel: env.VERCEL === '1',
    edgeRateLimitConfigured: env.EDGE_RATE_LIMIT_CONFIGURED === 'true'
  };
}
function ready(config) {
  return Boolean(config.apiKey && EMAIL.test(config.from) && !/[\r\n]/.test(config.from) &&
    EMAIL.test(config.to) && !/[\r\n]/.test(config.to) && config.allowedOrigins.size &&
    (!config.preview || ![config.productionTo, 'advisor@studentspace.com', 'givingback@studentspace.com', 'sales@studentspace.com', 'support@studentspace.com'].some(value => value.toLowerCase() === config.to.toLowerCase())) &&
    (!config.vercel || config.edgeRateLimitConfigured));
}
function validate(input) {
  if (!input || Array.isArray(input) || typeof input !== 'object') return { errors: { form: 'Expected a JSON object.' } };
  const errors = {}, data = {};
  const limits = { name: 120, email: 254, reason: 80, intent: 40, city: 120, organization: 160, project: 80, message: 5000, website: 200 };
  for (const [key, max] of Object.entries(limits)) {
    const value = input[key];
    if (value === undefined) { data[key] = ''; continue; }
    if (typeof value !== 'string') { errors[key] = 'Use text for this field.'; continue; }
    data[key] = value.trim();
    if (value.length > max) errors[key] = 'Use ' + max + ' characters or fewer.';
    if (key !== 'message' && /[\r\n\u0000]/.test(value)) errors[key] = 'Use a single line of text.';
    if (key === 'message' && /\u0000/.test(value)) errors[key] = 'Remove invalid characters.';
  }
  if (!data.intent && typeof data.reason === 'string') data.intent = Object.hasOwn(REASONS, data.reason) ? REASONS[data.reason] : (INTENTS.has(data.reason) ? data.reason : '');
  if (!data.name && !errors.name) errors.name = 'Enter your full name.';
  if ((!data.email || !EMAIL.test(data.email)) && !errors.email) errors.email = 'Enter a valid email address.';
  if (!INTENTS.has(data.intent) && !errors.intent) errors.intent = 'Choose a valid reason for contacting us.';
  if (!data.message && !errors.message) errors.message = 'Enter a short message.';
  if (data.project && !PROJECTS.has(data.project)) errors.project = 'Choose an available product.';
  if (data.reason && !Object.hasOwn(REASONS, data.reason) && !INTENTS.has(data.reason)) errors.reason = 'Choose a valid reason for contacting us.';
  return { data, errors };
}

async function sendEmail(data, key, config, fetchImpl = fetch, timeoutMs = 10000) {
  const label = intents.find(item => item[0] === data.intent)[1];
  const to = config.to;
  const lines = [
    ['Name', data.name], ['Email', data.email], ['Intent', label],
    ['City / New Mexico connection', data.city || 'Not supplied'],
    ['Organization', data.organization || 'Not supplied'], ['Product interest', data.project || 'Not supplied'],
    ['Message', data.message]
  ];
  // The body must stay identical on retry; do not insert timestamps or random IDs here.
  const payload = {
    from: 'StudentSpace <' + config.from + '>', to: [to], reply_to: data.email,
    subject: 'StudentSpace inquiry: ' + label,
    text: lines.map(([name, value]) => name + ': ' + value).join('\n\n'),
    html: '<h2>StudentSpace inquiry</h2>' + lines.map(([name, value]) => '<p><strong>' + escapeHtml(name) + '</strong><br>' + escapeHtml(value).replace(/\n/g, '<br>') + '</p>').join('')
  };
  const controller = new AbortController();
  let timer;
  try {
    const result = await Promise.race([
      (async () => {
        const response = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST', headers: { Authorization: 'Bearer ' + config.apiKey, 'Content-Type': 'application/json', 'Idempotency-Key': 'studentspace/' + key },
          body: JSON.stringify(payload), signal: controller.signal
        });
        if (!response.ok) return { success: false, conflict: response.status === 409 };
        const body = await response.json();
        if (typeof body.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(body.id)) return { success: false };
        return { success: true, id: body.id };
      })(),
      new Promise(resolve => { timer = setTimeout(() => { controller.abort(); resolve({ success: false }); }, timeoutMs); })
    ]);
    return result;
  } catch { return { success: false }; }
  finally { clearTimeout(timer); }
}

function createServer(options = {}) {
  const config = options.config || configuration();
  const fetchImpl = options.fetchImpl || fetch;
  const now = options.now || Date.now;
  const buckets = new Map();
  const rateLimit = options.rateLimit || 5;
  const rateWindow = options.rateWindow || 10 * 60 * 1000;
  const maxBuckets = options.maxBuckets || 10000;

  function clientAddress(req) {
    // Only trust the platform-overwritten header on Vercel, not arbitrary proxies.
    const forwarded = req.headers['x-vercel-forwarded-for'];
    if (config.vercel && typeof forwarded === 'string') {
      const address = forwarded.trim();
      if (isIP(address)) return address;
    }
    return req.socket.remoteAddress || 'unknown';
  }
  function limited(req) {
    const time = now();
    for (const [key, entry] of buckets) if (entry.reset <= time) buckets.delete(key);
    const key = clientAddress(req);
    let entry = buckets.get(key);
    if (!entry) {
      if (buckets.size >= maxBuckets) return true;
      entry = { count: 0, reset: time + rateWindow }; buckets.set(key, entry);
    }
    entry.count++;
    return entry.count > rateLimit;
  }
  function respond(res, code, body, extra = {}) {
    if (res.writableEnded || res.destroyed) return;
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', ...extra });
    res.end(JSON.stringify(body));
  }
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Vary', 'Origin');
    let pathname;
    try { pathname = new URL(req.url, 'http://api.local').pathname; }
    catch { respond(res, 400, { success: false, message: 'Invalid request.' }); return; }
    const origin = req.headers.origin;
    if (origin && config.allowedOrigins.has(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    if (['/healthz', '/api/healthz'].includes(pathname) && ['GET', 'HEAD'].includes(req.method)) {
      respond(res, ready(config) ? 200 : 503, { status: ready(config) ? 'ok' : 'unconfigured' }); return;
    }
    if (pathname !== '/api/apply') { respond(res, 404, { success: false, message: 'Not found.' }); return; }
    if (!origin || !config.allowedOrigins.has(origin)) { respond(res, 403, { success: false, message: 'This website is not permitted to submit messages.' }); return; }
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Idempotency-Key', 'Access-Control-Max-Age': '600' }); res.end(); return;
    }
    if (req.method !== 'POST') { respond(res, 405, { success: false, message: 'Method not allowed.' }, { Allow: 'POST, OPTIONS' }); return; }
    if (limited(req)) { respond(res, 429, { success: false, message: 'Too many messages. Please wait a few minutes or contact us by email.' }, { 'Retry-After': String(Math.ceil(rateWindow / 1000)) }); return; }
    const type = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (!['application/json', 'application/x-www-form-urlencoded'].includes(type)) { respond(res, 415, { success: false, message: 'Unsupported request format.' }); req.resume(); return; }
    const declaredLength = Number(req.headers['content-length'] || 0);
    if (declaredLength > MAX_BYTES) { respond(res, 413, { success: false, message: 'Your message is too large.' }); req.resume(); return; }
    async function submit(input) {
      const { data, errors } = validate(input);
      if (Object.keys(errors).length) { respond(res, 400, { success: false, message: 'Please check the highlighted fields.', errors }); return; }
      if (data.website) { respond(res, 400, { success: false, message: 'Unable to submit this message.' }); return; }
      const suppliedKey = req.headers['idempotency-key'];
      if (suppliedKey && (typeof suppliedKey !== 'string' || !UUID.test(suppliedKey))) { respond(res, 400, { success: false, message: 'Invalid submission identifier. Please reload the form.' }); return; }
      const key = suppliedKey || crypto.randomUUID();
      if (!ready(config)) { respond(res, 503, { success: false, message: 'Online messaging is temporarily unavailable. Please contact StudentSpace by email.' }); return; }
      const result = await sendEmail(data, key, config, fetchImpl, options.emailTimeoutMs);
      if (result.success) respond(res, 200, { success: true, id: result.id, message: 'Your message has been submitted.' });
      else if (result.conflict) respond(res, 409, { success: false, message: 'This submission is already being processed or has changed. Wait briefly, then retry the same message.' });
      else respond(res, 503, { success: false, message: 'We could not confirm submission. Your entries have been kept. Try again with the same message or contact us by email.' });
    }
    const parse = raw => type === 'application/json' ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw));
    // Vercel may have parsed the request; local HTTP uses the bounded stream below.
    if (req.body !== undefined) {
      try {
        const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        if (Buffer.byteLength(raw) > MAX_BYTES) { respond(res, 413, { success: false, message: 'Your message is too large.' }); return; }
        await submit(typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : parse(raw));
      } catch { respond(res, 400, { success: false, message: 'Invalid request format.' }); }
      return;
    }
    const chunks = [];
    let length = 0;
    req.setTimeout(15000, () => { respond(res, 408, { success: false, message: 'Request timed out.' }); req.destroy(); });
    req.on('data', chunk => {
      length += chunk.length;
      if (length > MAX_BYTES) { chunks.length = 0; respond(res, 413, { success: false, message: 'Your message is too large.' }); }
      else if (!res.writableEnded) chunks.push(chunk);
    });
    req.on('error', () => respond(res, 400, { success: false, message: 'Incomplete request.' }));
    req.on('end', async () => {
      req.setTimeout(0);
      if (res.writableEnded) return;
      let input;
      try { input = parse(Buffer.concat(chunks).toString('utf8')); }
      catch { respond(res, 400, { success: false, message: 'Invalid request format.' }); return; }
      await submit(input);
    });
  });
  server.requestTimeout = 20000;
  server.headersTimeout = 15000;
  server.keepAliveTimeout = 5000;
  return server;
}
if (require.main === module) {
  try { process.loadEnvFile(); } catch (err) { if (err.code !== 'ENOENT') throw err; }
  const server = createServer();
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
  server.listen(Number(process.env.PORT || 4318), host, () => console.log('StudentSpace API listening on configured port.'));
  process.on('SIGTERM', () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 15000).unref(); });
}
function createHandler(options = {}) { return createServer(options).listeners('request')[0]; }
module.exports = { createServer, createHandler, configuration, validate, ready, sendEmail, MAX_BYTES };
