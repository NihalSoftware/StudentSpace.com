// Local compatibility entry point. Vercel uses api/apply.js and api/healthz.js.
const api = require('./lib/api.cjs');
if (require.main === module) {
  try { process.loadEnvFile(); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  api.createServer().listen(Number(process.env.PORT || 4318), '127.0.0.1', () => console.log('StudentSpace local API ready.'));
}
module.exports = api;
