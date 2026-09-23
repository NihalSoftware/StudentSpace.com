// Vercel frontend and Node API configuration.
const { hostingConfig } = require('./src/hosting');
exports.config = hostingConfig(process.env);
