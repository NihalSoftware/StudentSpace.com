const { configuration, ready } = require('../lib/api.cjs');
const { publicOrigin } = require('../lib/build-config.cjs');
let configured = false;
try { configured = ready(configuration()); } catch {}
const checks = [['SITE_URL', Boolean(process.env.SITE_URL)], ['email and abuse protection configured', configured], ['approved public policy content', process.env.CONTENT_APPROVED === 'true']];
try { publicOrigin(process.env.SITE_URL); } catch { checks.push(['valid HTTPS site origin', false]); }
for (const [label, passed] of checks) console.log((passed ? 'PASS ' : 'REQUIRED ') + label);
if (checks.some(([, passed]) => !passed)) process.exitCode = 1;
