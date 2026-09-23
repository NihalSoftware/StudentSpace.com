const fs = require('node:fs');
const path = require('node:path');
const { makePages } = require('../src/pages');
const { company, intents, projects, ideas } = require('../src/content');
// Only approved public page content crosses this build boundary. No source notes,
// unpublished entries, environment variables or private files are serialized.
function prepare() {
  const pages = makePages({ apiBase: '' });
  const output = path.resolve(__dirname, '../lib/generated-pages.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify({ pages, company, intents, catalogs: { '/technology': projects.map(p => ({ category: p.category, search: [p.name, p.category, p.summary].join(' ').toLowerCase() })), '/ideas': ideas.map(p => ({ category: p.category, search: [p.name, p.category, p.summary].join(' ').toLowerCase() })) } }));
  return pages;
}
if (require.main === module) prepare();
module.exports = { prepare };
