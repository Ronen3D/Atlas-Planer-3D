import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: './src',
  publicDir: 'assets',
  server: { port: 5173 },
  
  build: {
    outDir: '../build',
    lib: {
      entry: path.resolve(__dirname, 'src/ap3d/Manager.ts'),
      name: 'ap3d',
      fileName: (format) => `ap3d.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE'
        }
      }
    }
  }
});
