import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/yomilines/' : '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/kuromoji/dict/*',
          dest: 'dict'
        }
      ]
    })
  ],
  build: {
    sourcemap: true,
    target: 'es2022'
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true
  }
});
