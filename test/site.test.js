'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { parseHTML } = require('linkedom');
const { build } = require('../scripts/build');
const { createPreview } = require('../scripts/preview');
const { redirects } = require('../src/content');
const { hostingConfig } = require('../src/hosting');
const ROOT = path.resolve(__dirname, '..');
let temp, built, server, base, baseline;
before(async () => {
  const privateFile = path.join(ROOT, 'data/applications.json');
  baseline = fs.existsSync(privateFile) ? crypto.createHash('sha256').update(fs.readFileSync(privateFile)).digest('hex') : null;
  temp = fs.mkdtempSync(path.join(os.tmpdir(), 'studentspace-test-'));
  built = await build({ output: temp, env: { SITE_INDEXABLE: 'true', SITE_URL: 'https://www.studentspace.com' } });
  server = createPreview(temp);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
});
after(async () => {
  if (server) await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
  // Only remove the exact temporary directory allocated by this test.
  if (temp && path.dirname(temp) === path.resolve(os.tmpdir()) && path.basename(temp).startsWith('studentspace-test-')) fs.rmSync(temp, { recursive: true, force: true });
});
function html(page) { return fs.readFileSync(path.join(temp, page.path === '/' ? 'index.html' : page.path.slice(1) + '.html'), 'utf8'); }
test('all generated routes have semantic content, unique SEO metadata and valid local references', () => {
  const titles = new Set(), descriptions = new Set();
  const routeSet = new Set(built.pages.map(p => p.path));
  for (const page of built.pages) {
    const source = html(page);
    const { document } = parseHTML(source);
    assert.equal(document.querySelectorAll('h1').length, 1, page.path);
    assert.equal(document.querySelectorAll('main').length, 1, page.path);
    assert.equal(document.documentElement.lang, 'en');
    const title = document.querySelector('title').textContent;
    const desc = document.querySelector('meta[name=description]').getAttribute('content');
    assert.ok(!titles.has(title), 'duplicate title: ' + page.path); titles.add(title);
    assert.ok(!descriptions.has(desc), 'duplicate description: ' + page.path); descriptions.add(desc);
    assert.equal(document.querySelector('link[rel=canonical]').href, 'https://www.studentspace.com' + (page.path === '/' ? '/' : page.path));
    assert.ok(document.querySelector('meta[property="og:image"]').content.endsWith('/assets/social.png'));
    assert.ok(document.querySelector('meta[name="twitter:card"]'));
    assert.doesNotThrow(() => JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent));
    const ids = new Set();
    for (const item of document.querySelectorAll('[id]')) { assert.ok(!ids.has(item.id), 'duplicate ID: ' + page.path); ids.add(item.id); }
    for (const heading of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) assert.ok(heading.textContent.trim());
    for (const image of document.querySelectorAll('img')) assert.ok(image.hasAttribute('alt') && image.hasAttribute('width') && image.hasAttribute('height'));
    for (const element of document.querySelectorAll('a[href],link[href],script[src],img[src]')) {
      const ref = element.getAttribute('href') || element.getAttribute('src');
      if (ref.startsWith('#')) { assert.ok(ids.has(ref.slice(1)), 'missing anchor ' + page.path + ref); continue; }
      if (!ref.startsWith('/')) continue;
      const url = new URL(ref, 'https://www.studentspace.com');
      const target = url.pathname;
      if (target.startsWith('/assets/')) assert.ok(fs.existsSync(path.join(temp, target.slice(1))), 'missing asset ' + target);
      else assert.ok(routeSet.has(target), 'broken internal link ' + target + ' in ' + page.path);
      if (url.hash && routeSet.has(target)) {
        const targetDocument = parseHTML(html(built.pages.find(p => p.path === target))).document;
        assert.ok(targetDocument.getElementById(url.hash.slice(1)), 'missing target anchor ' + ref);
      }
    }
    assert.doesNotMatch(source, /TODO:|\[Legal to confirm|Simulated - set|Stored in database|No cost\. No equity\. No catch\./);
  }
});
test('every page responds directly, and unknown paths return a genuine 404', async () => {
  for (const page of built.pages) {
    const response = await fetch(base + page.path);
    assert.equal(response.status, 200, page.path);
    assert.match(await response.text(), /<h1>/);
  }
  for (const missing of ['/not-a-page', '/data/applications.json', '/server.js', '/.env', '/assets/missing.js']) assert.equal((await fetch(base + missing)).status, 404);
});
test('legacy redirects preserve queries and end at existing pages without loops', async () => {
  const routeSet = new Set(built.pages.map(p => p.path));
  for (const [from, to] of Object.entries(redirects)) {
    assert.ok(routeSet.has(to), to);
    assert.ok(!redirects[to], 'redirect chain at ' + from);
    const response = await fetch(base + from + '?ref=legacy', { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), to + '?ref=legacy');
  }
});
test('Projects overview and native navigation preserve product destinations', async () => {
  const page = built.pages.find(p => p.path === '/projects');
  assert.ok(page);
  const { document } = parseHTML(html(page));
  const menu = document.querySelector('details.nav-projects');
  assert.equal(menu.querySelector('summary').textContent.trim(), 'Projects');
  assert.deepEqual([...menu.querySelectorAll('a')].map(a => a.getAttribute('href')), [
    '/projects', '/edplan', '/products/full-circle-tracking', '/products/school-view', '/products/assessment-of-student-learning'
  ]);
  assert.equal(document.querySelectorAll('.project-overview-card').length, 3);
  assert.match(document.querySelector('main').textContent, /code access and licensing are not available/);
  const response = await fetch(base + '/Projects', { redirect: 'manual' });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), '/projects');
});

test('forms are labeled and point only to the configured public API', () => {
  for (const route of ['/contact', '/apply']) {
    const { document } = parseHTML(html(built.pages.find(p => p.path === route)));
    assert.equal(document.querySelector('form').getAttribute('action'), '/api/apply');
    assert.equal(document.querySelector('form').getAttribute('method'), 'post', 'Never leak unenhanced forms into URL query strings');
    assert.ok(document.querySelector('button[type=submit]').hasAttribute('disabled'), 'JavaScript enables submission only when configured');
    for (const input of document.querySelectorAll('input,select,textarea')) {
      assert.ok(document.querySelector('label[for="' + input.id + '"]'), input.id);
      if (input.getAttribute('aria-describedby')) for (const id of input.getAttribute('aria-describedby').split(' ')) assert.ok(document.getElementById(id));
    }
  }
});
test('build output is restricted to public artifacts and preserves the private record', () => {
  function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.relative(temp, path.join(dir, entry.name))]); }
  const files = walk(temp);
  assert.ok(files.every(file => /\.(html|css|js|svg|png|xml|txt)$/.test(file)));
  assert.ok(!files.some(file => /applications|server|\.env|docs|test/.test(file)));
  if (baseline) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'data/applications.json'))).digest('hex'), baseline);
  const png = fs.readFileSync(path.join(temp, 'assets/social.png'));
  assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
  assert.match(fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8'), /data\//);
  assert.match(fs.readFileSync(path.join(ROOT, '.vercelignore'), 'utf8'), /data\//);
});
test('sitemap excludes 404 and production robots permit indexing', () => {
  const sitemap = fs.readFileSync(path.join(temp, 'sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, built.pages.length - 1);
  assert.doesNotMatch(sitemap, /\/404</);
  assert.match(fs.readFileSync(path.join(temp, 'robots.txt'), 'utf8'), /Allow: \//);
});
test('preview builds and hosting headers prevent indexing', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'studentspace-test-preview-'));
  try {
    await build({ output: dir, env: { VERCEL_ENV: 'preview', VERCEL: '1', SITE_INDEXABLE: 'true' } });
    assert.match(fs.readFileSync(path.join(dir, 'index.html'), 'utf8'), /noindex, nofollow/);
    assert.match(fs.readFileSync(path.join(dir, 'robots.txt'), 'utf8'), /Disallow: \//);
  } finally {
    if (path.dirname(dir) === path.resolve(os.tmpdir()) && path.basename(dir).startsWith('studentspace-test-preview-')) fs.rmSync(dir, { recursive: true });
  }
  const config = hostingConfig({ VERCEL_ENV: 'preview', SITE_INDEXABLE: 'true', SITE_URL: 'https://www.studentspace.com' });
  assert.ok(config.headers.some(rule => rule.headers.some(h => h.key === 'X-Robots-Tag')));
  const csp = config.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
  assert.match(csp, /connect-src 'self';/);
  assert.equal(config.redirects.length, Object.keys(redirects).length);
  assert.equal(config.outputDirectory, 'dist');
  const production = hostingConfig({ VERCEL_ENV: 'production', SITE_URL: 'https://www.studentspace.com' });
  assert.equal(production.buildCommand, 'npm run check:release && npm run build');
  assert.ok(!production.headers.some(rule => rule.headers.some(h => h.key === 'X-Robots-Tag')));
});
test('unsafe public build origins fail instead of leaking credentials', () => {
  for (const origin of ['https://name:secret@example.com', 'javascript:alert(1)', 'https://example.com/?token=secret', 'http://remote.example.com']) {
    assert.throws(() => require('../lib/build-config.cjs').publicOrigin(origin));
  }
});
