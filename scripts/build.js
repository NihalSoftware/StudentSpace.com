const { publicOrigin } = require('../lib/build-config.cjs');
async function build(options) { return (await import('./build.mjs')).build(options); }
module.exports = { build, publicOrigin };
if (require.main === module) build();
