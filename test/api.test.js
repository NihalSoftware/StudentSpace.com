'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const http = require('node:http');
const { createServer, configuration, MAX_BYTES } = require('../server');
const ORIGIN = 'https://preview.studentspace.com';
const payload = { name: 'Test Builder', email: 'builder@example.com', intent: 'build', message: 'A synthetic inquiry for automated verification.', city: 'Santa Fe', project: 'full-circle-tracking' };
const config = () => configuration({ NODE_ENV: 'production', ALLOWED_ORIGINS: ORIGIN, RESEND_API_KEY: 'test-key-never-real', RESEND_FROM_EMAIL: 'website@example.com', NOTIFY_EMAIL: 'advisor@example.com' });
async function setup(t, options = {}) {
  const calls = [];
  const api = createServer({
    config: config(),
    fetchImpl: async (url, request) => { calls.push({ url, ...request }); return new Response(JSON.stringify({ id: 'test-provider-id' }), { status: 200 }); },
    ...options
  });
  await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { api.close(resolve); api.closeAllConnections(); }));
  const base = 'http://127.0.0.1:' + api.address().port;
  const post = (data = payload, extra = {}) => fetch(base + '/api/apply', {
    method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json', ...extra.headers },
    body: JSON.stringify(data), ...Object.fromEntries(Object.entries(extra).filter(([key]) => key !== 'headers'))
  });
  return { api, base, post, calls };
}
test('accepted messages route to the configured advisor, escape HTML and return provider acceptance', async t => {
  const { post, calls } = await setup(t);
  const response = await post({ ...payload, name: '<img src=x>', message: '<script>alert(1)</script>\nnext line' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, id: 'test-provider-id', message: 'Your message has been submitted.' });
  const sent = JSON.parse(calls[0].body);
  assert.deepEqual(sent.to, ['advisor@example.com']);
  assert.equal(sent.reply_to, payload.email);
  assert.match(sent.html, /&lt;script&gt;/);
  assert.doesNotMatch(sent.html, /<script>/);
  assert.match(sent.html, /<br>next line/);
});
test('all intents route to the configured advisor', async t => {
  const { post, calls } = await setup(t);
  for (const intent of ['edplan', 'educator', 'college', 'partner', 'other']) assert.equal((await post({ ...payload, intent })).status, 200);
  assert.ok(calls.every(call => JSON.parse(call.body).to[0] === 'advisor@example.com'));
});
test('existing reason values and URL-encoded submissions remain supported', async t => {
  const { post, calls } = await setup(t);
  for (const reason of ['give_back', 'edplan_school', 'media_partnership', 'other']) {
    const old = { name: payload.name, email: payload.email, message: payload.message, reason };
    const response = await post(old, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(old).toString() });
    assert.equal(response.status, 200);
  }
  assert.equal(calls.length, 4);
});
test('invalid types, missing fields, unknown intents and field limits are rejected before email', async t => {
  const { post, calls } = await setup(t, { rateLimit: 100 });
  const invalid = [[], null, {}, { ...payload, name: 42 }, { ...payload, email: {} }, { ...payload, email: 'bad' }, { ...payload, intent: 'invented' }, { ...payload, reason: 'invented' }, { ...payload, message: 'x'.repeat(5001) }, { ...payload, project: 'private-source' }, { ...payload, name: 'Name\r\nInjected: header' }];
  for (const data of invalid) assert.equal((await post(data)).status, 400);
  assert.equal(calls.length, 0);
});
test('inherited object names are not accepted as contact reasons', async t => {
  const { post, calls } = await setup(t);
  for (const reason of ['constructor', 'toString', '__proto__']) {
    const response = await post({ ...payload, reason });
    assert.equal(response.status, 400);
    assert.ok((await response.json()).errors.reason);
  }
  assert.equal(calls.length, 0);
});

test('honeypot blocks email rather than pretending to send', async t => {
  const { post, calls } = await setup(t);
  const response = await post({ ...payload, website: 'spam.example' });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).success, false);
  assert.equal(calls.length, 0);
});
test('origin allowlist is exact and no-origin requests are rejected', async t => {
  const { post, base, calls } = await setup(t);
  for (const origin of ['https://attacker.example', ORIGIN + '.attacker.example', 'null']) {
    const response = await post(payload, { headers: { Origin: origin } });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  }
  const missing = await fetch(base + '/api/apply', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
  assert.equal(missing.status, 403);
  assert.equal(calls.length, 0);
});
test('preflight permits only supported methods and headers on the submission route', async t => {
  const { base } = await setup(t);
  const response = await fetch(base + '/api/apply', { method: 'OPTIONS', headers: { Origin: ORIGIN } });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  assert.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type, Idempotency-Key');
  assert.equal(response.headers.get('Vary'), 'Origin');
});
test('API never serves stored applications, assets or arbitrary files', async t => {
  const { base } = await setup(t);
  for (const path of ['/api/applications', '/data/applications.json', '/server.js', '/.env', '/', '/missing']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal((await response.json()).success, false);
  }
  assert.equal((await fetch(base + '/api/apply', { headers: { Origin: ORIGIN } })).status, 405);
});
test('unconfigured email fails health and submission honestly', async t => {
  const missing = { ...config(), apiKey: '' };
  const { post, base, calls } = await setup(t, { config: missing });
  assert.equal((await fetch(base + '/healthz')).status, 503);
  const response = await post();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
  assert.equal(calls.length, 0);
});
test('health checks expose only a generic readiness status', async t => {
  const { base } = await setup(t);
  const response = await fetch(base + '/healthz');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
test('provider rejection, invalid response and network failures never return success', async t => {
  for (const fetchImpl of [
    async () => new Response('provider-secret-error', { status: 401 }),
    async () => new Response('{}', { status: 200 }),
    async () => new Response('invalid', { status: 200 }),
    async () => { throw new Error('sensitive provider detail'); }
  ]) {
    const { post } = await setup(t, { fetchImpl });
    const response = await post();
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /provider-secret|sensitive provider/);
  }
});
test('provider timeout is bounded and retryable', async t => {
  const { post } = await setup(t, { fetchImpl: () => new Promise(() => {}), emailTimeoutMs: 20 });
  const response = await post();
  assert.equal(response.status, 503);
});
test('identical retries forward the same provider key and body', async t => {
  const { post, calls } = await setup(t);
  const key = crypto.randomUUID();
  await post(payload, { headers: { 'Idempotency-Key': key } });
  await post(payload, { headers: { 'Idempotency-Key': key } });
  assert.equal(calls[0].headers['Idempotency-Key'], 'studentspace/' + key);
  assert.equal(calls[0].body, calls[1].body);
  assert.equal(calls[0].headers['Idempotency-Key'], calls[1].headers['Idempotency-Key']);
});
test('invalid keys fail validation; provider idempotency conflicts remain visible', async t => {
  const { post, calls } = await setup(t);
  assert.equal((await post(payload, { headers: { 'Idempotency-Key': 'bad-key' } })).status, 400);
  assert.equal(calls.length, 0);
  const conflict = await setup(t, { fetchImpl: async () => new Response('{}', { status: 409 }) });
  assert.equal((await conflict.post()).status, 409);
});
test('rate limits use a bounded window and reset', async t => {
  let clock = 1000;
  const { post, calls } = await setup(t, { rateLimit: 2, rateWindow: 100, now: () => clock });
  assert.equal((await post()).status, 200);
  assert.equal((await post()).status, 200);
  const rejected = await post();
  assert.equal(rejected.status, 429);
  assert.ok(rejected.headers.get('Retry-After'));
  clock += 101;
  assert.equal((await post()).status, 200);
  assert.equal(calls.length, 3);
});
test('untrusted forwarded addresses cannot bypass local rate limiting', async t => {
  const { post } = await setup(t, { rateLimit: 1 });
  assert.equal((await post(payload, { headers: { 'X-Forwarded-For': '1.2.3.4' } })).status, 200);
  assert.equal((await post(payload, { headers: { 'X-Forwarded-For': '5.6.7.8' } })).status, 429);
});
test('unsupported content and malformed JSON fail cleanly', async t => {
  const { post } = await setup(t);
  assert.equal((await post(payload, { headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal((await post(payload, { body: '{broken' })).status, 400);
});
test('oversized declared and chunked bodies return 413 without email', async t => {
  const { post, base, calls } = await setup(t);
  assert.equal((await post({ ...payload, message: 'a'.repeat(MAX_BYTES + 1) })).status, 413);
  const code = await new Promise((resolve, reject) => {
    const request = http.request(base + '/api/apply', { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'Transfer-Encoding': 'chunked' } }, response => { response.resume(); response.on('end', () => resolve(response.statusCode)); });
    request.on('error', reject);
    request.write('{"message":"'); request.write('b'.repeat(MAX_BYTES + 1)); request.end('"}');
  });
  assert.equal(code, 413);
  assert.equal(calls.length, 0);
});
test('production origin configuration refuses wildcards and insecure origins', () => {
  assert.throws(() => configuration({ NODE_ENV: 'production', ALLOWED_ORIGINS: '*' }));
  assert.throws(() => configuration({ NODE_ENV: 'production', ALLOWED_ORIGINS: 'http://example.com' }));
  assert.throws(() => configuration({ ALLOWED_ORIGINS: 'https://example.com/path' }));
});

test('Vercel previews require a separate test recipient and edge protection', () => {
  const { ready } = require('../server');
  const env = { NODE_ENV: 'production', VERCEL: '1', VERCEL_ENV: 'preview', VERCEL_URL: 'test-deployment.vercel.app', RESEND_API_KEY: 'mock-key', RESEND_FROM_EMAIL: 'sender@example.com' };
  assert.equal(ready(configuration(env)), false);
  for (const recipient of ['advisor@studentspace.com', 'ADVISOR@studentSpace.com', 'sales@studentspace.com', '']) assert.equal(ready(configuration({ ...env, PREVIEW_NOTIFY_EMAIL: recipient, EDGE_RATE_LIMIT_CONFIGURED: 'true' })), false);
  const safe = configuration({ ...env, PREVIEW_NOTIFY_EMAIL: 'delivered@resend.dev', EDGE_RATE_LIMIT_CONFIGURED: 'true' });
  assert.equal(ready(safe), true);
  assert.ok(safe.allowedOrigins.has('https://test-deployment.vercel.app'));
  assert.equal(safe.to, 'delivered@resend.dev');
  assert.equal(configuration({}).to, 'advisor@studentspace.com');
});

test('concurrent retries use provider deduplication, and changed payload conflicts', async t => {
  const accepted = new Map();
  let sends = 0;
  const { post } = await setup(t, { fetchImpl: async (_url, request) => {
    const key = request.headers['Idempotency-Key'];
    if (accepted.has(key) && accepted.get(key) !== request.body) return new Response('{}', { status: 409 });
    if (!accepted.has(key)) { accepted.set(key, request.body); sends++; }
    return new Response(JSON.stringify({ id: 'one-accepted-email' }));
  }});
  const headers = { 'Idempotency-Key': crypto.randomUUID() };
  const replies = await Promise.all([post(payload, { headers }), post(payload, { headers })]);
  assert.deepEqual(replies.map(r => r.status), [200,200]);
  assert.equal(sends, 1);
  assert.equal((await post({ ...payload, message: 'Changed content' }, { headers })).status, 409);
  assert.equal(sends, 1);
});

test('Vercel pre-parsed request bodies share validation and limits', async t => {
  const { createHandler } = require('../server');
  let sends = 0;
  const handler = createHandler({ config: config(), fetchImpl: async () => { sends++; return new Response('{"id":"parsed-id"}'); } });
  const server = http.createServer(async (req, res) => {
    const chunks = []; for await (const chunk of req) chunks.push(chunk);
    req.body = JSON.parse(Buffer.concat(chunks).toString());
    handler(req, res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const post = body => fetch('http://127.0.0.1:' + server.address().port + '/api/apply', { method:'POST', headers:{ Origin:ORIGIN, 'Content-Type':'application/json' }, body:JSON.stringify(body) });
  assert.equal((await post(payload)).status, 200);
  assert.equal((await post({})).status, 400);
  assert.equal((await post({ ...payload, message:'x'.repeat(MAX_BYTES) })).status, 413);
  assert.equal(sends, 1);
});
