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
safeDelete('final-deployment-verification.sh'); // Keep: cleanup-archive/temp-files/FINAL_CLEANUP_INTEGRATION_COMPLETE.md
safeDelete('src/data/UnifiedDataManager.js'); // Keep: src/data/DataManager.js
safeDelete('surprise.html'); // Keep: src/pages/html/surprises.html

// Delete obsolete files and directories
console.log('\n🗑️  Deleting Obsolete Files...');
safeDelete('cleanup-archive/temp-cleanup-v5-backup.tar.gz'); // Obsolete pattern match
safeDelete('cleanup-archive/temp-files/index-corrupted-backup.html'); // Obsolete pattern match

// Delete empty files
console.log('\n📄 Deleting Empty Files...');
safeDelete('cleanup-archive/temp-files/FINAL_CLEANUP_INTEGRATION_COMPLETE.md'); // Empty file
safeDelete('final-deployment-verification.sh'); // Empty file

console.log('\n🎉 Cleanup Complete!');
console.log(`✅ Deleted ${deletedCount} files/directories`);
console.log(`💾 Saved ${(savedSpace / 1024 / 1024).toFixed(2)} MB of space`);
console.log('\n🚀 Anniversary Website v4.0.0 is now clean and optimized!');