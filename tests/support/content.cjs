'use strict';
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf8');
function view(id) {
  const match = html.match(new RegExp('<main id="' + id + '"[\\s\\S]*?</main>'));
  if (!match) throw new Error('Missing view: ' + id);
  return match[0];
}
module.exports = { html, view, footer: html.slice(html.indexOf('<footer>')) };
