const { createHandler } = require('../lib/api.cjs');
let handler;

module.exports = function apply(request, response) {
  try {
    handler ??= createHandler();
    return handler(request, response);
  } catch {
    response.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify({ success: false, message: 'Online messaging is temporarily unavailable. Please contact StudentSpace by email.' }));
  }
};
