// Verification fixture: local-only mock transport. Never imported by deployed code.
const http = require('node:http');
const { createPreview } = require('./preview');
const { configuration, createHandler } = require('../lib/api.cjs');
const port = 5174;
const config = configuration({ ALLOWED_ORIGINS:'http://127.0.0.1:' + port, RESEND_API_KEY:'mock-only', RESEND_FROM_EMAIL:'sender@example.com', NOTIFY_EMAIL:'test@example.com' });
const attempts = new Map();
const handler = createHandler({ config, rateLimit:1000, emailTimeoutMs:300, fetchImpl:async (_url, request) => {
  const key = request.headers['Idempotency-Key'];
  const previous = attempts.get(key);
  if (previous && previous !== request.body) return new Response('{}', { status:409 });
  attempts.set(key, request.body);
  if (request.body.includes('FIXTURE_RETRY') && !previous) return new Response('{}', { status:503 });
  if (request.body.includes('FIXTURE_TIMEOUT') && !previous) return new Promise(() => {});
  return new Response(JSON.stringify({ id:'mock-email-id' }));
}});
const preview = createPreview();
http.createServer((req, res) => req.url.startsWith('/api/') ? handler(req,res) : preview.emit('request',req,res)).listen(port,'127.0.0.1',() => console.log('Mock-only browser fixture: http://127.0.0.1:' + port));
