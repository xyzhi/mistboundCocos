import { build } from 'vite';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const cheatsEnabled = process.env.MISTBOUND_ENABLE_CHEATS !== '0';

await build({
  base: './',
  define: {
    __MISTBOUND_CHEATS_ENABLED__: JSON.stringify(cheatsEnabled),
  },
  build: {
    target: ['es2017', 'chrome61'],
    cssTarget: ['chrome61', 'safari18.4'],
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
      },
    },
  },
});

// Xiaohongshu mini-tools require a classic external script rather than an ES module entry.
const outputIndex = join('dist', 'index.html');
const builtHtml = await readFile(outputIndex, 'utf8');
const classicHtml = builtHtml
  .replace(/\s+type="module"/g, '')
  .replace(/\s+crossorigin(?=[\s>])/g, '')
  .replace('<script src=', '<script defer src=');

if (classicHtml.includes('type="module"')) {
  throw new Error('Xiaohongshu build still contains a module script.');
}

await writeFile(outputIndex, classicHtml, 'utf8');

const assetsDirectory = join('dist', 'assets');
for (const fileName of await readdir(assetsDirectory)) {
  if (!fileName.endsWith('.js')) continue;

  const scriptPath = join(assetsDirectory, fileName);
  const script = await readFile(scriptPath, 'utf8');
  const compatibleScript = script
    .replaceAll('navigator.connection', 'undefined')
    .replaceAll('javascript:', 'java\\x73cript:');

  if (/\bimport\.meta\b|(^|[;{}])\s*(import|export)\s/m.test(compatibleScript)) {
    throw new Error(`Xiaohongshu build contains module syntax: ${fileName}`);
  }

  await writeFile(scriptPath, compatibleScript, 'utf8');
}

