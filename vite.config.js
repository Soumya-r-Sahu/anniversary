import { defineConfig } from 'vite';

export default defineConfig({
  // Base configuration for GitHub Pages
  base: './',
  root: '.',
  publicDir: 'public',

  // Build configuration  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',

    // Rollup options for vanilla JavaScript + HTML pages
    rollupOptions: {
      input: {
        main: 'index.html',
        surprise: 'surprise.html'
      },
      output: {
        // Asset naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },

    // Build optimizations
    cssCodeSplit: true,
    reportCompressedSize: false
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    host: true,
    hmr: {
      overlay: false
    }
  },

  // CSS processing
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true
  },

  // File handling
  assetsInclude: ['**/*.m4a', '**/*.mp3', '**/*.wav'],

  // Optimization
  optimizeDeps: {
    include: [],
    exclude: []
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify('4.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  // Path resolution
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@assets': '/public/assets'
    }
  }
});
