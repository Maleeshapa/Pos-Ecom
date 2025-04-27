// // vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     // BASE_URL: JSON.stringify("https://goldenaroma.kandyis.live"),
//     BASE_URL: JSON.stringify("https://goldenaroma.kandyis.live/e-commerce"),
//   },
//   server: {
//     port: 3000,
//     open: true,
    
//   },
//   build: {
//     outDir: 'dist',
//     minify: 'terser',
//     sourcemap: true,
//   },
// });




// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     BASE_URL: JSON.stringify("https://goldenaroma.kandyis.live/e-commerce"),
//   },
//   base: '/e-commerce/', // Base path for the app
//   build: {
//     outDir: 'dist', // Output directory for the build
//     minify: 'terser',
//     sourcemap: true, // Optional: Remove in production if not needed
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Golden Aroma E-Commerce',
        short_name: 'E-Commerce',
        description: 'The Golden Aroma',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/', // Start path for the app
        scope: '/', // Scope of the app
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA development mode
        type: 'module', 
      },
    }),
  ],
  
  base: '/', // Base path for the app
  build: {
    outDir: 'dist', // Output directory for the build
    minify: 'terser',
    sourcemap: true, // Optional: Remove in production if not needed
  },
});
