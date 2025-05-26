import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
// import eslint from 'vite-plugin-eslint';

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
        // Code splitting strategy
        manualChunks: {
          // Core libraries
          'core': [
            './src/core/UnifiedMusicManager.js',
            './src/core/UnifiedStorageManager.js',
            './src/core/UnifiedPerformanceMonitor.js'
          ],
          // UI components
          'components': [
            './src/components/UnifiedHeartAnimation.js',
            './src/components/UnifiedGallery.js',
            './src/components/UnifiedParticleSystem.js',
            './src/components/BackgroundComponents.js'
          ],
          // Utilities
          'utils': [
            './src/utils/performance.js',
            './src/utils/lazyLoader.js',
            './src/utils/throttle.js'
          ],
          // Page controllers
          'pages': [
            './src/pages/index.js',
            './src/pages/anniversary.js',
            './src/pages/countdown.js',
            './src/pages/love-story.js',
            './src/pages/photo-gallery.js'
          ]
        },
        // Asset naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },

    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
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

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.css";`
      }
    }
  },

  // Asset optimization
  assetsInclude: ['**/*.webp', '**/*.avif'],

  // Plugins
  plugins: [
    // ESLint integration disabled for build
    // eslint({
    //   cache: false,
    //   include: ['src/**/*.js'],
    //   exclude: ['node_modules', 'dist']
    // }),

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
          },
          {
            src: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E💕%3C/text%3E%3C/svg%3E',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],

  // Optimization
  optimizeDeps: {
    include: ['workbox-window'],
    exclude: []
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@core': '/src/core',
      '@utils': '/src/utils',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
      '@templates': '/src/templates'
    }
  }
});
