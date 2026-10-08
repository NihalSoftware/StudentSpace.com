'use strict';
const { readdirSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');
// This plain JavaScript project has no existing linter: check syntax and conflicts.
function check(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'data'].includes(item.name)) continue;
    const file = join(dir, item.name);
    if (item.isDirectory()) check(file);
    else if (/\.(?:js|cjs)$/.test(file)) {
      const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      if (result.status !== 0) { process.stderr.write(result.stderr); process.exitCode = 1; }
      if (/^(?:<<<<<<<|=======|>>>>>>>)/m.test(readFileSync(file, 'utf8'))) {
        console.error('Conflict marker: ' + file); process.exitCode = 1;
      }
    }
  }
}
check(join(__dirname, '..'));
if (!process.exitCode) console.log('JavaScript syntax and conflict-marker checks passed.');
