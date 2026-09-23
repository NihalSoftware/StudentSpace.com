import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformWithOxc } from 'vite';
import preparation from './prepare.cjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directories = ['api', 'app', 'components', 'lib', 'scripts', 'src', 'test', 'e2e'];
const files = [];
async function collect(directory, recursive) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory() && recursive) await collect(file, true);
    else if (entry.isFile() && /\.(?:[cm]?js|jsx)$/.test(entry.name)) files.push(file);
    else if (entry.isFile() && /\.(?:[cm]?ts|tsx)$/.test(entry.name)) throw new Error('Use JavaScript or JSX for project source: ' + path.relative(root, file));
  }
}
preparation.prepare();
await collect(root, false);
for (const directory of directories) await collect(path.join(root, directory), true);
await Promise.all(files.map(async file => {
  await transformWithOxc(await fs.readFile(file, 'utf8'), file, {
    lang: file.endsWith('.jsx') ? 'jsx' : 'js', jsx: 'preserve',
  });
}));
console.log(`JavaScript/JSX syntax checks passed for ${files.length} project files.`);
