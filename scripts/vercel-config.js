'use strict';
const { hostingConfig } = require('../src/hosting');
console.log(JSON.stringify(hostingConfig(process.env), null, 2));
