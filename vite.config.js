import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Base configuration for GitHub Pages
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

    // Rollup options for React SPA + Surprise pages
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
    postcss: './postcss.config.js',
    devSourcemap: true
  },

  // Asset optimization
  assetsInclude: ['**/*.webp', '**/*.avif'],
  // Plugins
  plugins: [
    // React plugin
    react()
  ],

  // Optimization
  optimizeDeps: {
    include: [],
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
