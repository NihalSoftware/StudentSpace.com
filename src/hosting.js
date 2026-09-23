'use strict';
const { redirects } = require('./content');
function hostingConfig(env = process.env) {
  const csp = "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'";
  const headers = [
    { source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: csp }
    ] },
    { source: '/assets/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' }] }
  ];
  const noindex = env.VERCEL_ENV ? env.VERCEL_ENV !== 'production' : env.SITE_INDEXABLE !== 'true';
  if (noindex) headers.push({ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] });
  return {
    framework: 'vite',
    buildCommand: env.VERCEL_ENV === 'production' ? 'npm run check:release && npm run build' : 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm ci', cleanUrls: true, trailingSlash: false,
    functions: { 'api/*.ts': { maxDuration: 20, excludeFiles: '{data,docs,test,artifacts}/**' } },
    rewrites: [{ source: '/healthz', destination: '/api/healthz' }],
    redirects: Object.entries(redirects).map(([source, destination]) => ({ source, destination, permanent: true })),
    headers
  };
}
module.exports = { hostingConfig };
