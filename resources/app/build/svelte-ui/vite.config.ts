import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  root: path.resolve(__dirname, 'src'),
  base: './',
  build: {
    outDir: path.resolve(__dirname, '..', 'svelte'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.ts'),
      output: {
        entryFileNames: 'app.svelte.js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: (info) => {
          if (info.name?.endsWith('.css')) return 'app.svelte.css';
          return 'assets/[name].[hash][extname]';
        },
      },
    },
    target: 'es2020',
    minify: true,
    sourcemap: false,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
