import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Base configuration
  base: './',
  root: '.',
  publicDir: 'public',

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    target: 'es2015',

    // Rollup options for advanced optimization
    rollupOptions: {
      input: {
        main: 'index.html',
        anniversary: 'anniversary.html',
        countdown: 'countdown.html',
        'love-story': 'love-story.html',
        'photo-gallery': 'photo-gallery.html'
      },
      output: {
        // Asset naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },

    // CSS code splitting
    cssCodeSplit: true,

    // Chunk size warning limit
    chunkSizeWarningLimit: 500
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    cors: true,
    host: true
  },

  // Preview server
  preview: {
    port: 3000,
    open: true
  },

  // Plugins
  plugins: [
    // Progressive Web App - Simplified configuration
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,m4a}']
      },
      manifest: {
        name: 'Anniversary Love Website',
        short_name: 'Anniversary',
        description: 'A romantic anniversary website celebrating our love story',
        theme_color: '#ec4899',
        background_color: '#fdf2f8',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E💕%3C/text%3E%3C/svg%3E',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],

  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@core': '/src/core',
      '@utils': '/src/utils',
      '@pages': '/src/pages',
      '@styles': '/src/styles'
    }
  }
});
