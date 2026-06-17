import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600 // Increase warning limit to 1.6MB to suppress the warning without risking chunking crashes
  }
});
