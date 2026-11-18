/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js + postprocessing form one ~1 MB (≈280 kB gzip) chunk that is
    // lazy-loaded only on /lab, so the default 500 kB warning isn't useful here.
    chunkSizeWarningLimit: 1100,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
