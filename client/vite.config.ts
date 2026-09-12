import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Resolve the shared package straight to its TS source so it doesn't
      // need to be built before Vite can run.
      '@cafefinder/shared': path.resolve(__dirname, '../shared/src/index.ts'),
      '@cafefinder/shared/': path.resolve(__dirname, '../shared/src/'),
    },
  },
  server: {
    port: 5173,
    // Proxy API calls to the Express server during local dev.
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});