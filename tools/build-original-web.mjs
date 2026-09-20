import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const project = resolve(import.meta.dirname, '..');
const source = resolve(project, '..', 'mistbound');
const output = join(project, 'native', 'engine', 'android', 'app', 'src', 'main', 'assets', 'mistbound');
const viteModule = pathToFileURL(join(source, 'node_modules', 'vite', 'dist', 'node', 'index.js')).href;
const { build } = await import(viteModule);

await build({
  root: source,
  base: './',
  define: { __MISTBOUND_CHEATS_ENABLED__: 'false' },
  build: {
    target: ['es2017', 'chrome61'],
    cssTarget: ['chrome61', 'safari18.4'],
    outDir: output,
    emptyOutDir: true,
    assetsInlineLimit: 0,
    modulePreload: false,
    rollupOptions: { output: { format: 'iife' } },
  },
});

const htmlFile = join(output, 'index.html');
const html = (await readFile(htmlFile, 'utf8'))
  .replace(/\s+type="module"/g, '')
  .replace(/\s+crossorigin(?=[\s>])/g, '')
  .replace('<script src=', '<script defer src=');
if (html.includes('type="module"')) throw new Error('WebView build contains a module script');
await writeFile(htmlFile, html, 'utf8');

for (const filename of await readdir(join(output, 'assets'))) {
  if (!filename.endsWith('.js')) continue;
  const file = join(output, 'assets', filename);
  const script = (await readFile(file, 'utf8'))
    .replaceAll('navigator.connection', 'undefined')
    .replaceAll('javascript:', 'java\\x73cript:');
  if (/\bimport\.meta\b|(^|[;{}])\s*(import|export)\s/m.test(script)) {
    throw new Error(`WebView build contains module syntax: ${filename}`);
  }
  await writeFile(file, script, 'utf8');
}

console.log(`Original game packaged for Android WebView: ${output}`);
