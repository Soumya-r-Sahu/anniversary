import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        anniversary: 'anniversary.html',
        countdown: 'countdown.html',
        'love-story': 'love-story.html',
        'photo-gallery': 'photo-gallery.html'
      }
    }
  }
});
