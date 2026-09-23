'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { redirects } = require('../src/content');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
function createPreview(root = path.resolve(__dirname, '../dist')) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400); res.end(); return; }
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    if (redirects[pathname]) { res.writeHead(308, { Location: redirects[pathname] + url.search }); res.end(); return; }
    if (pathname !== '/' && pathname.endsWith('/')) { res.writeHead(308, { Location: pathname.replace(/\/+$/, '') + url.search }); res.end(); return; }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1) + (path.extname(pathname) ? '' : '.html');
    let file = path.resolve(root, relative);
    let status = 200;
    if (!file.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { file = path.join(root, '404.html'); status = 404; }
    res.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(file).pipe(res);
  });
}
if (require.main === module) createPreview().listen(Number(process.env.PREVIEW_PORT || 4173), '127.0.0.1', () => console.log('StudentSpace preview: http://127.0.0.1:' + (process.env.PREVIEW_PORT || 4173)));
module.exports = { createPreview };
