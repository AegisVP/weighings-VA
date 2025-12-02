import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { normalizePath } from 'vite';
import path from 'path';
/** @type {import('vite').UserConfig} */

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, './'),
  plugins: [
    react(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, 'src/assets')),
          dest: '../public/',
        },
        {
          src: normalizePath(path.resolve(__dirname, 'src/assets/favicon*')),
          dest: '../public',
        },
        {
          src: normalizePath(path.resolve(__dirname, 'src/assets/manifest.json')),
          dest: '../public',
        },
      ],
    }),
  ],
  build: {
    outDir: path.resolve(__dirname, '../public'),
    emptyOutDir: true,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2048,
  },
});
