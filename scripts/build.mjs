import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as viteBuild, createServer } from 'vite';
import preparation from './prepare.cjs';
import settings from '../lib/build-config.cjs';
import templates from '../src/templates.js';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function build(options = {}) {
  const config = settings.publicConfig(options.env || process.env);
  const output = path.resolve(options.output || path.join(ROOT, 'dist'));
  if (output !== path.join(ROOT, 'dist') && fs.existsSync(output) && fs.readdirSync(output).length) throw new Error('Alternate output must be empty.');
  preparation.prepare();
  await viteBuild({ root: ROOT, build: { outDir: output, emptyOutDir: output === path.join(ROOT, 'dist') } });
  const manifest = JSON.parse(fs.readFileSync(path.join(output, '.vite/manifest.json'), 'utf8'));
  const entry = manifest['app/entry-client.tsx'];
  config.scripts = ['/' + entry.file];
  config.styles = entry.css.map(file => '/' + file);
  const renderer = await createServer({ root: ROOT, server: { middlewareMode: true, ws: false }, appType: 'custom', logLevel: 'error' });
  let pages;
  try {
    const app = await renderer.ssrLoadModule('/app/entry-server.tsx');
    pages = app.pages;
    for (const page of pages) {
      const file = path.join(output, page.path === '/' ? 'index.html' : page.path.slice(1) + '.html');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, app.render(page.path, config));
    }
  } finally { await renderer.close(); }
  for (const name of fs.readdirSync(path.join(ROOT, 'public/assets'))) {
    if (!/\.(svg|png|webp|avif|jpg|ico)$/.test(name)) throw new Error('Unexpected public asset.');
    fs.copyFileSync(path.join(ROOT, 'public/assets', name), path.join(output, 'assets', name));
  }
  fs.writeFileSync(path.join(output, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.filter(p => !p.noindex).map(p => '<url><loc>' + templates.escape(config.siteUrl + p.path) + '</loc></url>').join('') + '</urlset>');
  fs.writeFileSync(path.join(output, 'robots.txt'), config.noindex ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\nSitemap: ' + config.siteUrl + '/sitemap.xml\n');
  // The Vite manifest is build metadata, not a public artifact.
  fs.unlinkSync(path.join(output, '.vite/manifest.json'));
  fs.rmdirSync(path.join(output, '.vite'));
  console.log(`Prerendered ${pages.length} React documents. Indexing ${config.noindex ? 'disabled' : 'enabled'}.`);
  return { pages, config, output };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
