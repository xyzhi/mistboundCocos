import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const project = resolve(import.meta.dirname, '..');
const original = join(project, 'game');
const source = join(project, 'release-assets', 'taptap-icon-source.png');
const sharpModule = pathToFileURL(join(original, 'node_modules', 'sharp', 'lib', 'index.js')).href;
const { default: sharp } = await import(sharpModule);

for (const [density, size] of Object.entries({ mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 })) {
  const directory = join(project, 'native', 'engine', 'android', 'res', `mipmap-${density}`);
  await mkdir(directory, { recursive: true });
  await sharp(source).resize(size, size, { kernel: 'nearest' })
    .png().toFile(join(directory, 'ic_launcher.png'));
}
