import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// server.host exposes the dev server on the LAN so a real phone can load it
// (the Phase 0 "validate 60fps on real Android" deliverable).
export default defineConfig({
  plugins: [react()],
  server: { host: true },
});
