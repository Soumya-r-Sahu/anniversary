#!/usr/bin/env node

/**
 * Code Sanitization Script - Anniversary Website v4.0.0
 * Removes duplicate navigation functions and optimizes codebase
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HTML_PAGES_DIR = path.join(PROJECT_ROOT, 'src', 'pages', 'html');

class CodeSanitizer {
  constructor() {
    this.processedFiles = [];
    this.duplicatesRemoved = 0;
    this.bytesRemoved = 0;
  }

  /**
   * Main sanitization process
   */
  async sanitize() {
    console.log('🧹 Starting code sanitization process...');
    
    try {
      // 1. Remove duplicate navigation functions from HTML files
      await this.removeDuplicateNavigation();
      
      // 2. Add unified navigation imports
      await this.addUnifiedNavigationImports();
      
      // 3. Clean up old/unused functions
      await this.removeUnusedFunctions();
      
      // 4. Generate cleanup report
      this.generateReport();
      
      console.log('✅ Code sanitization completed successfully!');
      
    } catch (error) {
      console.error('❌ Sanitization failed:', error);
      process.exit(1);
    }
  }

  /**
   * Remove duplicate navigation functions from HTML files
   */
  async removeDuplicateNavigation() {
    console.log('🧭 Removing duplicate navigation functions...');
    
    const htmlFiles = fs.readdirSync(HTML_PAGES_DIR)
      .filter(file => file.endsWith('.html'))
      .map(file => path.join(HTML_PAGES_DIR, file));

    for (const filePath of htmlFiles) {
      await this.processHTMLFile(filePath);
    }
  }

  /**
   * Process individual HTML file
   */
  async processHTMLFile(filePath) {
    const filename = path.basename(filePath);
    console.log(`  📝 Processing ${filename}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalSize = content.length;
    
    // Remove duplicate navigation script blocks
    content = this.removeDuplicateNavigationScripts(content);
    
    // Remove duplicate mobile menu handlers
    content = this.removeMobileMenuHandlers(content);
    
    // Remove duplicate page highlighting
    content = this.removePageHighlighting(content);
    
    // Remove duplicate smooth scrolling
    content = this.removeSmoothScrolling(content);
    
    // Remove duplicate Lucide icon initialization
    content = this.removeLucideInitialization(content);
    
    const newSize = content.length;
    const bytesRemoved = originalSize - newSize;
    
    if (bytesRemoved > 0) {
      fs.writeFileSync(filePath, content);
      this.processedFiles.push(filename);
      this.bytesRemoved += bytesRemoved;
      this.duplicatesRemoved++;
      
      console.log(`    ✅ Removed ${bytesRemoved} bytes of duplicate code`);
    } else {
      console.log(`    ℹ️  No duplicates found`);
    }
  }

  /**
   * Remove duplicate navigation script blocks
   */
  removeDuplicateNavigationScripts(content) {
    // Pattern to match the entire navigation script block
    const navScriptPattern = /<script>\s*document\.addEventListener\('DOMContentLoaded', function\(\) \{[\s\S]*?navToggle\.addEventListener[\s\S]*?\}\);\s*<\/script>/g;
    
    return content.replace(navScriptPattern, '<!-- Navigation script replaced with unified system -->');
  }

  /**
   * Remove mobile menu handlers
   */
  removeMobileMenuHandlers(content) {
    const patterns = [
      /navToggle\.addEventListener\('click', function\(\)[\s\S]*?\}\);/g,
      /\/\/ Mobile menu toggle[\s\S]*?\}\);/g,
      /\/\/ Close mobile menu when clicking outside[\s\S]*?\}\);/g,
      /\/\/ Close mobile menu when pressing Escape[\s\S]*?\}\);/g
    ];
    
    patterns.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    return content;
  }

  /**
   * Remove page highlighting code
   */
  removePageHighlighting(content) {
    const pattern = /\/\/ Highlight current page[\s\S]*?\}\);/g;
    return content.replace(pattern, '');
  }

  /**
   * Remove smooth scrolling code
   */
  removeSmoothScrolling(content) {
    const pattern = /\/\/ Smooth scroll for anchor links[\s\S]*?\}\);[\s\S]*?\}\);/g;
    return content.replace(pattern, '');
  }

  /**
   * Remove Lucide icon initialization
   */
  removeLucideInitialization(content) {
    const pattern = /\/\/ Initialize Lucide icons for navigation[\s\S]*?lucide\.createIcons\(\);[\s\S]*?\}/g;
    return content.replace(pattern, '');
  }

  /**
   * Add unified navigation imports to HTML files
   */
  async addUnifiedNavigationImports() {
    console.log('📦 Adding unified navigation imports...');
    
    const htmlFiles = fs.readdirSync(HTML_PAGES_DIR)
      .filter(file => file.endsWith('.html'))
      .map(file => path.join(HTML_PAGES_DIR, file));

    for (const filePath of htmlFiles) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if imports already exist
      if (!content.includes('unifiedNavigation.js')) {
        const fileName = path.basename(filePath, '.html');
        const unifiedImportForFile = `
<!-- Unified Navigation & Data Management System -->
<script type="module" src="../../utils/unifiedNavigation.js"></script>
<script type="module" src="../../utils/dataManager.js"></script>
<script type="module" src="../../utils/jsonDatabase.js"></script>
<script>
// Initialize unified systems when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Unified systems loaded for ${fileName}');
});
</script>`;
        
        // Add imports before closing body tag
        content = content.replace('</body>', `${unifiedImportForFile}\n</body>`);
        fs.writeFileSync(filePath, content);
        
        console.log(`  ✅ Added imports to ${path.basename(filePath)}`);
      }
    }
  }

  /**
   * Remove unused functions from JS files
   */
  async removeUnusedFunctions() {
    console.log('🗑️  Removing unused functions...');
    
    // Check for old navigation files that might be unused
    const possibleUnusedFiles = [
      path.join(PROJECT_ROOT, 'src', 'scripts', 'navigation.js'),
      path.join(PROJECT_ROOT, 'src', 'scripts', 'nav-handler.js'),
      path.join(PROJECT_ROOT, 'src', 'scripts', 'mobile-nav.js')
    ];
    
    for (const filePath of possibleUnusedFiles) {
      if (fs.existsSync(filePath)) {
        // Check if file is referenced anywhere
        const isReferenced = await this.isFileReferenced(filePath);
        
        if (!isReferenced) {
          fs.unlinkSync(filePath);
          console.log(`  🗑️  Removed unused file: ${path.basename(filePath)}`);
        }
      }
    }
  }

  /**
   * Check if a file is referenced in the codebase
   */
  async isFileReferenced(filePath) {
    const filename = path.basename(filePath);
    const searchDirs = [
      path.join(PROJECT_ROOT, 'src'),
      path.join(PROJECT_ROOT, 'public')
    ];
    
    for (const dir of searchDirs) {
      if (await this.searchInDirectory(dir, filename)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Search for file references in directory
   */
  async searchInDirectory(dir, filename) {
    if (!fs.existsSync(dir)) return false;
    
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        if (await this.searchInDirectory(fullPath, filename)) {
          return true;
        }
      } else if (file.isFile() && (file.name.endsWith('.html') || file.name.endsWith('.js') || file.name.endsWith('.ts'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(filename)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Generate cleanup report
   */
  generateReport() {
    const report = `# Code Sanitization Report - Anniversary Website v4.0.0

## Summary
- **Files processed:** ${this.processedFiles.length}
- **Duplicate functions removed:** ${this.duplicatesRemoved}
- **Total bytes removed:** ${this.bytesRemoved.toLocaleString()}
- **Cleanup completed:** ${new Date().toISOString()}

## Changes Made

### 1. Navigation Function Cleanup
- Removed duplicate \`navToggle.addEventListener\` functions from ${this.duplicatesRemoved} HTML files
- Replaced with unified navigation system
- Added imports for \`unifiedNavigation.js\`, \`dataManager.js\`, and \`jsonDatabase.js\`

### 2. Code Deduplication
- Mobile menu handlers: Unified into single system
- Page highlighting: Centralized logic
- Smooth scrolling: Single implementation
- Lucide icon initialization: Optimized loading

### 3. Performance Improvements
- Reduced code duplication by ~${Math.round(this.bytesRemoved / 1024)}KB
- Faster page load times
- Better maintainability
- Consistent behavior across all pages

## Files Modified
${this.processedFiles.map(file => `- ${file}`).join('\\n')}

## Next Steps
1. Test all pages to ensure navigation works correctly
2. Verify mobile menu functionality
3. Check page highlighting and smooth scrolling
4. Monitor performance improvements

---
Generated by Code Sanitization Script v4.0.0
`;

    const reportPath = path.join(PROJECT_ROOT, 'Documentation', 'CODE_SANITIZATION_REPORT.md');
    fs.writeFileSync(reportPath, report);
    
    console.log('📋 Generated cleanup report:', reportPath);
    console.log('\\n' + report);
  }
}

// Run sanitization if called directly
if (require.main === module) {
  const sanitizer = new CodeSanitizer();
  sanitizer.sanitize().catch(console.error);
}

module.exports = CodeSanitizer;
