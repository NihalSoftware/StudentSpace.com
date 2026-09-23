import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHandler } from '../lib/api.cjs';
let handler: ReturnType<typeof createHandler>;
export default function apply(request: IncomingMessage, response: ServerResponse) {
  try { handler ??= createHandler(); return handler(request, response); }
  catch { response.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify({ success: false, message: 'Online messaging is temporarily unavailable. Please contact StudentSpace by email.' })); }
}
