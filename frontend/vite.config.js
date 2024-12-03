import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@': '/src', 
    },
  },
  server: {
    host: '0.0.0.0', 
    port: 5173,       
  },
});
