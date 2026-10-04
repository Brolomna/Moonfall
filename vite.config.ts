import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev` starts this on :5173 and the room server on :3000.
// Phones on the same Wi-Fi open http://<your-computer-ip>:5173 — the server prints the exact link.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/socket.io': { target: 'http://localhost:3000', ws: true },
      '/api': 'http://localhost:3000',
    },
  },
});
