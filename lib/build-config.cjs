const { company } = require('../src/content');
function publicOrigin(value, name = 'SITE_URL', allowLocal = false) {
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error(name + ' must be a plain origin.');
  if (url.protocol !== 'https:' && !(allowLocal && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error(name + ' must use HTTPS.');
  return url.origin;
}
function publicConfig(env = process.env) {
  return { siteUrl: publicOrigin(env.SITE_URL || company.siteUrl), noindex: env.VERCEL_ENV ? env.VERCEL_ENV !== 'production' : env.SITE_INDEXABLE !== 'true', year: new Date().getUTCFullYear(), scripts: [], styles: [] };
}
module.exports = { publicOrigin, publicConfig };
