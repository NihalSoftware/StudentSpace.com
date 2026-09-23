import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  server: { fs: { deny: ['**/.env', '**/.env.*', '**/.git/**', '**/data/**', '**/docs/**', '**/artifacts/**', '**/*.{crt,pem}'] } },
  build: {
    manifest: true, outDir: 'dist', emptyOutDir: true,
    rollupOptions: { input: 'app/entry-client.tsx' }
  },
});
