import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: {
    fs: {
      // The H5 source lives in game/, while shared runtime art/audio lives
      // in the repository-level assets/ directory.
      allow: [resolve(import.meta.dirname, '..')],
    },
  },
});
