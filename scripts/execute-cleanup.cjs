#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Anniversary Website v4.0.0 - Executing File Cleanup...');
console.log('================================================================================');

const baseDir = path.dirname(__dirname);
let deletedCount = 0;
let savedSpace = 0;

function safeDelete(filePath) {
  const fullPath = path.join(baseDir, filePath);
  if (fs.existsSync(fullPath)) {
    try {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Deleted directory: ${filePath}`);
      } else {
        savedSpace += stats.size;
        fs.unlinkSync(fullPath);
        console.log(`✅ Deleted file: ${filePath} (${(stats.size / 1024).toFixed(2)} KB)`);
      }
      deletedCount++;
    } catch (error) {
      console.log(`❌ Failed to delete ${filePath}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

// Delete duplicate files
console.log('\n🔄 Deleting Duplicate Files...');
safeDelete('scripts/reorganize-files.js'); // Keep: scripts/reorganize-files.cjs
safeDelete('src/scripts/pages/challenges.js'); // Keep: src/pages/js/challenges.js
safeDelete('src/scripts/pages/future-plans.js'); // Keep: src/pages/js/future-plans.js
safeDelete('src/scripts/pages/love-letters.js'); // Keep: src/pages/js/love-letters.js
safeDelete('src/scripts/pages/love-story.js'); // Keep: src/pages/js/love-story.js
safeDelete('src/scripts/pages/memory-book.js'); // Keep: src/pages/js/memory-book.js
safeDelete('src/scripts/pages/music-playlist.js'); // Keep: src/pages/js/music-playlist.js
safeDelete('src/scripts/pages/photo-gallery.js'); // Keep: src/pages/js/photo-gallery.js
safeDelete('src/scripts/pages/settings.js'); // Keep: src/pages/js/settings.js
safeDelete('src/scripts/pages/special-dates.js'); // Keep: src/pages/js/special-dates.js
safeDelete('src/scripts/pages/wish-list.js'); // Keep: src/pages/js/wish-list.js
safeDelete('src/styles/pages/anniversary.css'); // Keep: src/pages/css/anniversary.css
safeDelete('src/styles/pages/challenges.css'); // Keep: src/pages/css/challenges.css
safeDelete('src/styles/pages/countdown.css'); // Keep: src/pages/css/countdown.css
safeDelete('src/styles/pages/fireworks.css'); // Keep: src/pages/css/fireworks.css
safeDelete('src/styles/pages/future-plans.css'); // Keep: src/pages/css/future-plans.css
safeDelete('src/styles/pages/love-letters.css'); // Keep: src/pages/css/love-letters.css
safeDelete('src/styles/pages/love-story.css'); // Keep: src/pages/css/love-story.css
safeDelete('src/styles/pages/memory-book.css'); // Keep: src/pages/css/memory-book.css
safeDelete('src/styles/pages/music-playlist.css'); // Keep: src/pages/css/music-playlist.css
safeDelete('src/styles/pages/photo-gallery.css'); // Keep: src/pages/css/photo-gallery.css
safeDelete('src/styles/pages/settings.css'); // Keep: src/pages/css/settings.css
safeDelete('src/styles/pages/special-dates.css'); // Keep: src/pages/css/special-dates.css
safeDelete('src/styles/pages/wish-list.css'); // Keep: src/pages/css/wish-list.css

// Delete obsolete files and directories
console.log('\n🗑️  Deleting Obsolete Files...');
safeDelete('test-music-system.js'); // Obsolete pattern match
safeDelete('src/styles/pages'); // Obsolete directory - functionality moved
safeDelete('src/scripts/pages'); // Obsolete directory - functionality moved

// Delete empty files
console.log('\n📄 Deleting Empty Files...');
safeDelete('Prd.md'); // Empty file

console.log('\n🎉 Cleanup Complete!');
console.log(`✅ Deleted ${deletedCount} files/directories`);
console.log(`💾 Saved ${(savedSpace / 1024 / 1024).toFixed(2)} MB of space`);
console.log('\n🚀 Anniversary Website v4.0.0 is now clean and optimized!');