import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2
      },
      mangle: true
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
            return 'pdf';
          }
          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'map';
          }
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts';
          }
          if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('react-hot-toast')) {
            return 'ui';
          }
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) {
            return 'vendor';
          }
          if (id.includes('axios')) {
            return 'http';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  }
});
