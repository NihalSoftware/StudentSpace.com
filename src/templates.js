'use strict';

const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const link = (href, label, cls = '') => '<a href="' + escape(href) + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + escape(label) + '</a>';
const tag = (label, cls = '') => '<span class="status ' + cls + '">' + escape(label) + '</span>';
const list = items => '<ul class="plain-list">' + items.map(x => '<li>' + escape(x) + '</li>').join('') + '</ul>';
const para = text => '<p>' + escape(text) + '</p>';
function section(title, body, options = {}) {
  return '<section class="section ' + (options.className || '') + '"' + (options.id ? ' id="' + options.id + '"' : '') + '><div class="wrap">' +
    (title ? '<div class="section-heading"><h2>' + escape(title) + '</h2>' + (options.intro ? para(options.intro) : '') + '</div>' : '') + body + '</div></section>';
}
function hero(title, description, label = '', actions = '') {
  return '<section class="page-hero"><div class="wrap">' + (label ? '<p class="section-label">' + escape(label) + '</p>' : '') +
    '<h1>' + escape(title) + '</h1><p class="lede">' + escape(description) + '</p>' + (actions ? '<div class="actions">' + actions + '</div>' : '') + '</div></section>';
}
function cta(title = 'There’s a next chapter to build.', text = 'Tell us what you’re thinking about. A conversation is a good place to start.', href = '/apply', label = 'Start a conversation') {
  return '<section class="cta-section"><div class="wrap cta-row"><div><h2>' + escape(title) + '</h2>' + para(text) + '</div>' + link(href, label, 'button button-light') + '</div></section>';
}
function projectCard(p, legacy = false) {
  return '<article class="project-card" data-library-item data-category="' + escape(p.category) + '" data-search="' + escape([p.name, p.category, p.summary].join(' ').toLowerCase()) + '">' +
    '<div class="card-top">' + tag(legacy ? 'Historical product' : p.status) + '<span class="card-symbol" aria-hidden="true">' + ({ 'Student support': '◎', 'Institutional insight': '▥', 'Learning outcomes': '◇' }[p.category]) + '</span></div>' +
    '<p class="card-category">' + escape(p.category) + '</p><h3>' + link(legacy ? p.legacyPath : '/technology/' + p.slug, p.name) + '</h3>' + para(p.summary) +
    link(legacy ? p.legacyPath : '/technology/' + p.slug, legacy ? 'Explore the product history' : 'View project', 'text-link') + '</article>';
}
function ideaCard(p) {
  return '<article class="idea-card" data-library-item data-category="' + escape(p.category) + '" data-search="' + escape([p.name, p.category, p.summary].join(' ').toLowerCase()) + '">' +
    '<p class="card-category">' + escape(p.category) + '</p><h3>' + link('/ideas/' + p.slug, p.name) + '</h3>' + para(p.summary) + link('/ideas/' + p.slug, 'Explore this idea', 'text-link') + '</article>';
}
function filterBar(categories, noun) {
  return '<form class="filter-bar" data-filter-form role="search"><div class="field"><label for="library-search">Search ' + noun + '</label><input type="search" id="library-search" name="q" placeholder="Search by name or topic" autocomplete="off"></div>' +
    '<div class="field"><label for="library-category">Topic</label><select id="library-category" name="category"><option value="">All topics</option>' + categories.map(c => '<option>' + escape(c) + '</option>').join('') + '</select></div>' +
    '<button class="button button-outline" type="reset">Clear filters</button></form><p class="filter-count" data-filter-count role="status" aria-live="polite"></p><p class="empty-state" data-filter-empty hidden>No matches yet. Try another word or clear the filters.</p><noscript><p>All entries are listed below. Search and filtering require JavaScript.</p></noscript>';
}
function steps(items) {
  return '<ol class="steps">' + items.map((x, i) => '<li><span class="step-number" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span><div><h3>' + escape(x[0]) + '</h3>' + para(x[1]) + '</div></li>').join('') + '</ol>';
}
function faqList(items) {
  return '<div class="faq-list">' + items.map(f => '<details><summary>' + escape(f.q) + '</summary><div>' + para(f.a) + (f.href ? link(f.href, f.link, 'text-link') : '') + '</div></details>').join('') + '</div>';
}
function contactForm() { return '<form data-contact-form></form>'; }
module.exports = { escape, link, tag, list, para, section, hero, cta, projectCard, ideaCard, filterBar, steps, faqList, contactForm };
