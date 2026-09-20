import { stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const project = resolve(import.meta.dirname, '..');
const sharpPath = join(project, '..', 'mistbound', 'node_modules', 'sharp', 'lib', 'index.js');
const { default: sharp } = await import(pathToFileURL(sharpPath).href);
const assets = join(project, 'release-assets');
const source = join(assets, 'taptap-promo-character-background.png');
const output = join(assets, 'taptap-promo-character-1920x1080.jpg');

const title = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#071727" stop-opacity="0.42"/>
      <stop offset="0.48" stop-color="#071727" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#071727" flood-opacity="0.78"/>
    </filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#shade)"/>
  <g fill="#fff4df" font-family="Noto Serif SC, SimSun, serif" font-weight="700"
     font-size="150" letter-spacing="6" filter="url(#shadow)">
    <text x="130" y="250">下一站，</text>
    <text x="130" y="425">晚安</text>
  </g>
</svg>`);

await sharp(source)
  .resize(1920, 1080, { fit: 'cover' })
  .composite([{ input: title }])
  .jpeg({ quality: 91, mozjpeg: true })
  .toFile(output);

const result = await stat(output);
if (result.size > 4 * 1024 * 1024) throw new Error('TapTap promotional image exceeds 4 MB');
console.log(`${output} (${result.size} bytes)`);
