import { readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const gameRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = resolve(gameRoot, '..');
const inputPath = resolve(projectRoot, 'assets/resources/night-drive.wav');
const outputPath = resolve(gameRoot, 'src/night-drive.generated.js');
const inputLabel = relative(projectRoot, inputPath).replaceAll('\\', '/');
const wav = await readFile(inputPath);

if (wav.toString('ascii', 0, 4) !== 'RIFF' || wav.toString('ascii', 8, 12) !== 'WAVE') {
  throw new Error(`Expected a RIFF/WAVE file: ${inputLabel}`);
}

let offset = 12;
let format = null;
let pcm = null;
while (offset + 8 <= wav.length) {
  const id = wav.toString('ascii', offset, offset + 4);
  const size = wav.readUInt32LE(offset + 4);
  const start = offset + 8;
  if (id === 'fmt ') {
    format = {
      type: wav.readUInt16LE(start),
      channels: wav.readUInt16LE(start + 2),
      sampleRate: wav.readUInt32LE(start + 4),
      bits: wav.readUInt16LE(start + 14),
    };
  }
  if (id === 'data') pcm = wav.subarray(start, start + size);
  offset = start + size + (size & 1);
}

if (!format || !pcm || format.type !== 1 || format.bits !== 16 || format.channels !== 1) {
  throw new Error('Only mono 16-bit PCM WAV input is supported.');
}

const moduleSource = `// Generated from ${inputLabel}. Do not edit by hand.
export const sampleRate = ${format.sampleRate};
export const pcmBase64 = '${pcm.toString('base64')}';
`;

await writeFile(outputPath, moduleSource, 'utf8');
console.log(`Embedded ${pcm.length / 2} PCM samples from ${inputLabel}.`);
