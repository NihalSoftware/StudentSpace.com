import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import api from '../lib/api.cjs';
import preview from './preview.js';
import content from '../src/content.js';
import settings from '../lib/build-config.cjs';
import preparation from './prepare.cjs';
try { process.loadEnvFile(); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const port = Number(process.env.PORT || 5173);
const productionPreview = process.argv.includes('--preview');
if (productionPreview && !fs.existsSync('dist/index.html')) throw new Error('Run npm run build before npm run preview.');
preparation.prepare();
const handler = api.createHandler();
const staticServer = productionPreview ? preview.createPreview() : null;
const vite = productionPreview ? null : await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
const config = { ...settings.publicConfig(), scripts: ['/app/entry-client.jsx'], styles: [] };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/') || url.pathname === '/healthz') { handler(req, res); return; }
  if (productionPreview) { staticServer.emit('request', req, res); return; }
  if (content.redirects[url.pathname]) { res.writeHead(308, { Location: content.redirects[url.pathname] + url.search }); res.end(); return; }
  if (url.pathname !== '/' && url.pathname.endsWith('/')) { res.writeHead(308, { Location: url.pathname.replace(/\/+$/, '') + url.search }); res.end(); return; }
  if (url.pathname.startsWith('/assets/')) {
    const assetRoot = path.resolve('public/assets');
    const target = path.resolve('public', '.' + url.pathname);
    if (target.startsWith(assetRoot + path.sep) && fs.existsSync(target) && fs.statSync(target).isFile()) {
      res.setHeader('Content-Type', target.endsWith('.svg') ? 'image/svg+xml' : 'image/png'); fs.createReadStream(target).pipe(res); return;
    }
  }
  vite.middlewares(req, res, async () => {
    try {
      const app = await vite.ssrLoadModule('/app/entry-server.jsx');
      const status = app.pages.some(page => page.path === url.pathname) ? 200 : 404;
      const transformed = await vite.transformIndexHtml(req.url, app.render(req.url, config));
      // Vite injects development scripts with whitespace text nodes into <head>.
      // Keep the document hydration boundary identical to React's head markup.
      const html = transformed.replace(/<head>([\s\S]*?)<\/head>/, (_match, head) => '<head>' + head.trim().replace(/>\s+</g, '><') + '</head>');
      res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' }); res.end(html);
    } catch (error) { vite.ssrFixStacktrace(error); console.error(error); res.writeHead(500); res.end('Development rendering failed. See the terminal.'); }
  });
});
server.listen(port, '127.0.0.1', () => console.log(`StudentSpace: http://127.0.0.1:${port} (${productionPreview ? 'production build' : 'Vite development'})`));
async function close() { server.closeAllConnections(); server.close(); await vite?.close(); }
process.on('SIGTERM', close); process.on('SIGINT', close);
