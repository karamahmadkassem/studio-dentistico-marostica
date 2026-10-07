import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: 'nested',
    includedRoutes(paths: string[]) {
      return paths.filter(
        (path) =>
          !path.includes('*') &&
          !path.includes('admin') &&
          !path.includes('reviews/submit'),
      );
    },
  },
});
