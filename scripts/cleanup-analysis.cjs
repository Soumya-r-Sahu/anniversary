#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🧹 Anniversary Website v4.0.0 - Comprehensive File Cleanup Analysis');
console.log('================================================================================');

const baseDir = path.dirname(__dirname);
const excludeDirs = ['.git', 'node_modules', 'dist', '.github', 'Documentation'];
const analysis = {
    duplicates: [],
    obsolete: [],
    large: [],
    empty: [],
    stats: {
        totalFiles: 0,
        totalSize: 0,
        duplicateSize: 0,
        obsoleteSize: 0,
        emptyFiles: 0
    }
};

// File content hash map for duplicate detection
const fileHashes = new Map();

// Known obsolete patterns
const obsoletePatterns = [
    /\.old$/,
    /\.backup$/,
    /\.tmp$/,
    /-old\./,
    /-backup\./,
    /-duplicate\./,
    /-copy\./,
    /test-/,
    /legacy-/,
    /deprecated-/
];

// Known duplicate file pairs to check
const potentialDuplicates = [
    // Script duplicates
    ['scripts/reorganize-files.cjs', 'scripts/reorganize-files.js'],
    
    // Time calculator duplicates
    ['src/utils/timeCalculator.ts', 'src/utils/timeCalculator.js'],
    
    // Data manager duplicates
    ['src/utils/dataManager.js', 'src/utils/data-manager.js'],
    
    // Style duplicates between pages/css and styles/pages
    ['src/pages/css/anniversary.css', 'src/styles/pages/anniversary.css'],
    ['src/pages/css/countdown.css', 'src/styles/pages/countdown.css'],
    ['src/pages/css/fireworks.css', 'src/styles/pages/fireworks.css'],
    ['src/pages/css/memory-book.css', 'src/styles/pages/memory-book.css'],
    ['src/pages/css/photo-gallery.css', 'src/styles/pages/photo-gallery.css'],
    ['src/pages/css/music-playlist.css', 'src/styles/pages/music-playlist.css'],
    ['src/pages/css/love-story.css', 'src/styles/pages/love-story.css'],
    ['src/pages/css/challenges.css', 'src/styles/pages/challenges.css'],
    ['src/pages/css/special-dates.css', 'src/styles/pages/special-dates.css'],
    ['src/pages/css/settings.css', 'src/styles/pages/settings.css'],
    ['src/pages/css/wish-list.css', 'src/styles/pages/wish-list.css'],
    ['src/pages/css/future-plans.css', 'src/styles/pages/future-plans.css'],
    ['src/pages/css/love-letters.css', 'src/styles/pages/love-letters.css'],
    
    // JS script duplicates
    ['src/pages/js/wish-list.js', 'src/scripts/pages/wish-list.js'],
    ['src/pages/js/future-plans.js', 'src/scripts/pages/future-plans.js'],
    ['src/pages/js/music-playlist.js', 'src/scripts/pages/music-playlist.js'],
    ['src/pages/js/special-dates.js', 'src/scripts/pages/special-dates.js'],
    ['src/pages/js/photo-gallery.js', 'src/scripts/pages/photo-gallery.js'],
    ['src/pages/js/memory-book.js', 'src/scripts/pages/memory-book.js'],
    ['src/pages/js/settings.js', 'src/scripts/pages/settings.js'],
    ['src/pages/js/love-story.js', 'src/scripts/pages/love-story.js'],
    ['src/pages/js/challenges.js', 'src/scripts/pages/challenges.js'],
    ['src/pages/js/love-letters.js', 'src/scripts/pages/love-letters.js']
];

// Calculate file hash
function calculateFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
        return null;
    }
}

// Get file size
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

// Format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if file is obsolete
function isObsolete(filePath) {
    const fileName = path.basename(filePath);
    return obsoletePatterns.some(pattern => pattern.test(fileName));
}

// Scan directory recursively
function scanDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativeItemPath = path.join(relativePath, item);
        
        // Skip excluded directories
        if (excludeDirs.includes(item)) continue;
        
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            scanDirectory(fullPath, relativeItemPath);
        } else if (stats.isFile()) {
            analysis.stats.totalFiles++;
            analysis.stats.totalSize += stats.size;
            
            // Check for empty files
            if (stats.size === 0) {
                analysis.empty.push({
                    path: relativeItemPath,
                    size: stats.size
                });
                analysis.stats.emptyFiles++;
            }
            
            // Check for large files (over 1MB)
            if (stats.size > 1024 * 1024) {
                analysis.large.push({
                    path: relativeItemPath,
                    size: stats.size,
                    sizeFormatted: formatBytes(stats.size)
                });
            }
            
            // Check for obsolete files
            if (isObsolete(fullPath)) {
                analysis.obsolete.push({
                    path: relativeItemPath,
                    size: stats.size,
                    sizeFormatted: formatBytes(stats.size),
                    reason: 'Obsolete pattern match'
                });
                analysis.stats.obsoleteSize += stats.size;
            }
            
            // Calculate hash for duplicate detection
            const hash = calculateFileHash(fullPath);
            if (hash) {
                if (fileHashes.has(hash)) {
                    const existing = fileHashes.get(hash);
                    analysis.duplicates.push({
                        original: existing.path,
                        duplicate: relativeItemPath,
                        size: stats.size,
                        sizeFormatted: formatBytes(stats.size),
                        hash: hash
                    });
                    analysis.stats.duplicateSize += stats.size;
                } else {
                    fileHashes.set(hash, {
                        path: relativeItemPath,
                        size: stats.size
                    });
                }
            }
        }
    }
}

// Check specific potential duplicates
function checkKnownDuplicates() {
    console.log('\n🔍 Checking Known Potential Duplicates...');
    
    for (const [file1, file2] of potentialDuplicates) {
        const path1 = path.join(baseDir, file1);
        const path2 = path.join(baseDir, file2);
        
        if (fs.existsSync(path1) && fs.existsSync(path2)) {
            const hash1 = calculateFileHash(path1);
            const hash2 = calculateFileHash(path2);
            const size1 = getFileSize(path1);
            const size2 = getFileSize(path2);
            
            if (hash1 === hash2) {
                console.log(`  ✅ DUPLICATE CONFIRMED: ${file1} === ${file2} (${formatBytes(size1)})`);
                
                // Add to duplicates if not already there
                const exists = analysis.duplicates.some(d => 
                    (d.original === file1 && d.duplicate === file2) || 
                    (d.original === file2 && d.duplicate === file1)
                );
                
                if (!exists) {
                    analysis.duplicates.push({
                        original: file1,
                        duplicate: file2,
                        size: size1,
                        sizeFormatted: formatBytes(size1),
                        hash: hash1,
                        confirmed: true
                    });
                }
            } else {
                console.log(`  ❌ Different: ${file1} !== ${file2}`);
            }
        } else {
            if (!fs.existsSync(path1)) console.log(`  ⚠️  Missing: ${file1}`);
            if (!fs.existsSync(path2)) console.log(`  ⚠️  Missing: ${file2}`);
        }
    }
}

// Identify obsolete directories
function checkObsoleteDirectories() {
    console.log('\n📁 Checking for Obsolete Directories...');
    
    const obsoleteDirectories = [
        'src/styles/pages', // Replaced by src/pages/css
        'src/scripts/pages', // Replaced by src/pages/js  
        'dump',
        '_data',
        '_layouts',
        'backup',
        'old'
    ];
    
    for (const dir of obsoleteDirectories) {
        const dirPath = path.join(baseDir, dir);
        if (fs.existsSync(dirPath)) {
            const stats = fs.statSync(dirPath);
            if (stats.isDirectory()) {
                console.log(`  🗑️  OBSOLETE DIRECTORY: ${dir}`);
                analysis.obsolete.push({
                    path: dir,
                    size: 0,
                    sizeFormatted: 'Directory',
                    reason: 'Obsolete directory - functionality moved'
                });
            }
        }
    }
}

// Generate cleanup recommendations
function generateRecommendations() {
    console.log('\n📋 Cleanup Recommendations:');
    console.log('================================================================================');
    
    if (analysis.duplicates.length > 0) {
        console.log(`\n🔄 DUPLICATE FILES (${analysis.duplicates.length} files, ${formatBytes(analysis.stats.duplicateSize)} savings):`);
        analysis.duplicates.forEach((duplicate, index) => {
            console.log(`  ${index + 1}. DELETE: ${duplicate.duplicate}`);
            console.log(`     KEEP: ${duplicate.original}`);
            console.log(`     SIZE: ${duplicate.sizeFormatted}`);
            console.log('');
        });
    }
    
    if (analysis.obsolete.length > 0) {
        console.log(`\n🗑️  OBSOLETE FILES/DIRECTORIES (${analysis.obsolete.length} items, ${formatBytes(analysis.stats.obsoleteSize)} savings):`);
        analysis.obsolete.forEach((obsolete, index) => {
            console.log(`  ${index + 1}. DELETE: ${obsolete.path}`);
            console.log(`     REASON: ${obsolete.reason}`);
            console.log(`     SIZE: ${obsolete.sizeFormatted}`);
            console.log('');
        });
    }
    
    if (analysis.empty.length > 0) {
        console.log(`\n📄 EMPTY FILES (${analysis.empty.length} files):`);
        analysis.empty.forEach((empty, index) => {
            console.log(`  ${index + 1}. DELETE: ${empty.path}`);
        });
    }
    
    if (analysis.large.length > 0) {
        console.log(`\n📦 LARGE FILES (${analysis.large.length} files > 1MB):`);
        analysis.large.forEach((large, index) => {
            console.log(`  ${index + 1}. REVIEW: ${large.path} (${large.sizeFormatted})`);
        });
    }
}

// Generate cleanup script
function generateCleanupScript() {
    const cleanupScript = [];
    cleanupScript.push('#!/usr/bin/env node');
    cleanupScript.push('');
    cleanupScript.push('const fs = require(\'fs\');');
    cleanupScript.push('const path = require(\'path\');');
    cleanupScript.push('');
    cleanupScript.push('console.log(\'🧹 Anniversary Website v4.0.0 - Executing File Cleanup...\');');
    cleanupScript.push('console.log(\'================================================================================\');');
    cleanupScript.push('');
    cleanupScript.push('const baseDir = path.dirname(__dirname);');
    cleanupScript.push('let deletedCount = 0;');
    cleanupScript.push('let savedSpace = 0;');
    cleanupScript.push('');
    cleanupScript.push('function safeDelete(filePath) {');
    cleanupScript.push('  const fullPath = path.join(baseDir, filePath);');
    cleanupScript.push('  if (fs.existsSync(fullPath)) {');
    cleanupScript.push('    try {');
    cleanupScript.push('      const stats = fs.statSync(fullPath);');
    cleanupScript.push('      if (stats.isDirectory()) {');
    cleanupScript.push('        fs.rmSync(fullPath, { recursive: true, force: true });');
    cleanupScript.push('        console.log(`✅ Deleted directory: ${filePath}`);');
    cleanupScript.push('      } else {');
    cleanupScript.push('        savedSpace += stats.size;');
    cleanupScript.push('        fs.unlinkSync(fullPath);');
    cleanupScript.push('        console.log(`✅ Deleted file: ${filePath} (${(stats.size / 1024).toFixed(2)} KB)`);');
    cleanupScript.push('      }');
    cleanupScript.push('      deletedCount++;');
    cleanupScript.push('    } catch (error) {');
    cleanupScript.push('      console.log(`❌ Failed to delete ${filePath}: ${error.message}`);');
    cleanupScript.push('    }');
    cleanupScript.push('  } else {');
    cleanupScript.push('    console.log(`⚠️  File not found: ${filePath}`);');
    cleanupScript.push('  }');
    cleanupScript.push('}');
    cleanupScript.push('');
    cleanupScript.push('// Delete duplicate files');
    cleanupScript.push('console.log(\'\\n🔄 Deleting Duplicate Files...\');');
    
    analysis.duplicates.forEach(duplicate => {
        cleanupScript.push(`safeDelete('${duplicate.duplicate}'); // Keep: ${duplicate.original}`);
    });
    
    cleanupScript.push('');
    cleanupScript.push('// Delete obsolete files and directories');
    cleanupScript.push('console.log(\'\\n🗑️  Deleting Obsolete Files...\');');
    
    analysis.obsolete.forEach(obsolete => {
        cleanupScript.push(`safeDelete('${obsolete.path}'); // ${obsolete.reason}`);
    });
    
    cleanupScript.push('');
    cleanupScript.push('// Delete empty files');
    cleanupScript.push('console.log(\'\\n📄 Deleting Empty Files...\');');
    
    analysis.empty.forEach(empty => {
        cleanupScript.push(`safeDelete('${empty.path}'); // Empty file`);
    });
    
    cleanupScript.push('');
    cleanupScript.push('console.log(\'\\n🎉 Cleanup Complete!\');');
    cleanupScript.push('console.log(`✅ Deleted ${deletedCount} files/directories`);');
    cleanupScript.push('console.log(`💾 Saved ${(savedSpace / 1024 / 1024).toFixed(2)} MB of space`);');
    cleanupScript.push('console.log(\'\\n🚀 Anniversary Website v4.0.0 is now clean and optimized!\');');
    
    const scriptPath = path.join(baseDir, 'scripts', 'execute-cleanup.cjs');
    fs.writeFileSync(scriptPath, cleanupScript.join('\n'));
    console.log(`\n📝 Generated cleanup script: ${scriptPath}`);
}

// Main analysis function
function runAnalysis() {
    console.log('\n🔍 Scanning for files...');
    scanDirectory(baseDir);
    
    checkKnownDuplicates();
    checkObsoleteDirectories();
    
    console.log('\n📊 Analysis Summary:');
    console.log('================================================================================');
    console.log(`Total Files: ${analysis.stats.totalFiles}`);
    console.log(`Total Size: ${formatBytes(analysis.stats.totalSize)}`);
    console.log(`Duplicate Files: ${analysis.duplicates.length} (${formatBytes(analysis.stats.duplicateSize)} potential savings)`);
    console.log(`Obsolete Items: ${analysis.obsolete.length} (${formatBytes(analysis.stats.obsoleteSize)} potential savings)`);
    console.log(`Empty Files: ${analysis.stats.emptyFiles}`);
    console.log(`Large Files: ${analysis.large.length}`);
    console.log(`Total Potential Savings: ${formatBytes(analysis.stats.duplicateSize + analysis.stats.obsoleteSize)}`);
    
    generateRecommendations();
    generateCleanupScript();
    
    // Save analysis report
    const reportPath = path.join(baseDir, 'Documentation', 'CLEANUP_ANALYSIS_REPORT.md');
    saveAnalysisReport(reportPath);
}

// Save detailed analysis report
function saveAnalysisReport(reportPath) {
    const report = [];
    report.push('# 🧹 Anniversary Website v4.0.0 - File Cleanup Analysis Report');
    report.push('');
    report.push('Generated: ' + new Date().toISOString());
    report.push('');
    report.push('## 📊 Analysis Summary');
    report.push('');
    report.push(`- **Total Files**: ${analysis.stats.totalFiles}`);
    report.push(`- **Total Size**: ${formatBytes(analysis.stats.totalSize)}`);
    report.push(`- **Duplicate Files**: ${analysis.duplicates.length}`);
    report.push(`- **Obsolete Items**: ${analysis.obsolete.length}`);
    report.push(`- **Empty Files**: ${analysis.stats.emptyFiles}`);
    report.push(`- **Large Files**: ${analysis.large.length}`);
    report.push(`- **Potential Space Savings**: ${formatBytes(analysis.stats.duplicateSize + analysis.stats.obsoleteSize)}`);
    report.push('');
    
    if (analysis.duplicates.length > 0) {
        report.push('## 🔄 Duplicate Files');
        report.push('');
        analysis.duplicates.forEach((duplicate, index) => {
            report.push(`### ${index + 1}. ${duplicate.duplicate}`);
            report.push(`- **Original**: ${duplicate.original}`);
            report.push(`- **Size**: ${duplicate.sizeFormatted}`);
            report.push(`- **Action**: Delete duplicate, keep original`);
            report.push('');
        });
    }
    
    if (analysis.obsolete.length > 0) {
        report.push('## 🗑️ Obsolete Files/Directories');
        report.push('');
        analysis.obsolete.forEach((obsolete, index) => {
            report.push(`### ${index + 1}. ${obsolete.path}`);
            report.push(`- **Reason**: ${obsolete.reason}`);
            report.push(`- **Size**: ${obsolete.sizeFormatted}`);
            report.push(`- **Action**: Safe to delete`);
            report.push('');
        });
    }
    
    if (analysis.empty.length > 0) {
        report.push('## 📄 Empty Files');
        report.push('');
        analysis.empty.forEach((empty, index) => {
            report.push(`${index + 1}. ${empty.path}`);
        });
        report.push('');
    }
    
    if (analysis.large.length > 0) {
        report.push('## 📦 Large Files (>1MB)');
        report.push('');
        analysis.large.forEach((large, index) => {
            report.push(`${index + 1}. ${large.path} (${large.sizeFormatted})`);
        });
        report.push('');
    }
    
    report.push('## 🎯 Recommended Actions');
    report.push('');
    report.push('1. **Execute cleanup script**: `node scripts/execute-cleanup.cjs`');
    report.push('2. **Verify build**: `npm run build`');
    report.push('3. **Test functionality**: `npm run test`');
    report.push('4. **Commit changes**: Clean, organized codebase');
    report.push('');
    report.push('---');
    report.push('*Report generated by Anniversary Website v4.0.0 Cleanup Analysis*');
    
    fs.writeFileSync(reportPath, report.join('\n'));
    console.log(`\n📋 Detailed report saved: ${reportPath}`);
}

// Run the analysis
runAnalysis();
