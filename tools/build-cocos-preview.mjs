import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const project = resolve(import.meta.dirname, '..');
const web = join(project, 'native', 'engine', 'android', 'app', 'src', 'main', 'assets', 'mistbound');
const output = join(project, 'assets', 'resources', 'original', 'index.txt');
const html = await readFile(join(web, 'index.html'), 'utf8');
const scripts = (await readdir(join(web, 'assets'))).filter(name => name.endsWith('.js'));
if (scripts.length !== 1) throw new Error(`Expected one game script, found ${scripts.length}`);

let script = await readFile(join(web, 'assets', scripts[0]), 'utf8');
let replaced = 0;
for (const name of (await readdir(join(web, 'assets'))).filter(name => !name.endsWith('.js'))) {
  const mime = name.endsWith('.webp') ? 'image/webp' : name.endsWith('.png') ? 'image/png' : null;
  if (!mime) throw new Error(`Unsupported preview asset: ${name}`);
  const original = `new URL(\`${name}\`,document.currentScript&&document.currentScript.tagName.toUpperCase()===\`SCRIPT\`&&document.currentScript.src||document.baseURI).href`;
  if (!script.includes(original)) throw new Error(`Game script does not reference ${name}`);
  const data = await readFile(join(web, 'assets', name));
  script = script.replaceAll(original, JSON.stringify(`data:${mime};base64,${data.toString('base64')}`));
  replaced++;
}
if (script.includes('new URL(`')) throw new Error('Preview still contains relative asset URLs');
if (/<\/script/i.test(script)) throw new Error('Inline script would close its HTML tag');

// The original external script uses defer. An inline script in <head> would run
// before <body> exists, so place it after #root instead. Replacement callbacks
// preserve $&, $' and $` inside the minified bundle literally.
const withoutScript = html.replace(/<script defer src="[^"]+"><\/script>/, '');
if (withoutScript === html) throw new Error('Could not locate game script');
const inline = withoutScript.replace('</body>', () => `  <script>${script}</script>\n  </body>`);
if (inline === withoutScript) throw new Error('Could not inline game script');
if ((inline.match(/<\/script\s*>/gi) || []).length !== 1) {
  throw new Error('Preview HTML contains more than one closing script tag');
}
await mkdir(resolve(output, '..'), { recursive: true });
await writeFile(output, inline, 'utf8');
console.log(`Cocos preview ready: ${replaced} original images, ${Buffer.byteLength(inline)} bytes`);
