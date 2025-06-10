#!/usr/bin/env node

/**
 * Anniversary Website v4.0.0 - HTML Pages Copier
 * Copies HTML pages and their assets to the dist directory
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname);
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

class HTMLPagesCopier {
  constructor() {
    this.copiedFiles = [];
    this.warnings = [];
  }

  /**
   * Copy HTML pages and their assets
   */
  copy() {
    console.log('📋 Anniversary Website v4.0.0 - Copying HTML Pages...\n');
    
    try {
      // Ensure directories exist
      this.ensureDirectories();
      
      // Copy HTML pages
      this.copyHTMLPages();
      
      // Copy CSS files
      this.copyCSS();
      
      // Copy JS files
      this.copyJS();
      
      // Copy assets
      this.copyAssets();
      
      // Create HTML endpoints index
      this.createHTMLEndpointsIndex();
      
      console.log(`✅ Copied ${this.copiedFiles.length} files successfully!\n`);
      
      if (this.warnings.length > 0) {
        console.log('⚠️ Warnings:');
        this.warnings.forEach(warning => console.log(`  - ${warning}`));
        console.log('');
      }
      
    } catch (error) {
      console.error('❌ HTML page copying failed:', error);
      process.exit(1);
    }
  }
  
  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const requiredDirs = [
      path.join(DIST_DIR, 'src', 'pages', 'html'),
      path.join(DIST_DIR, 'src', 'pages', 'css'),
      path.join(DIST_DIR, 'src', 'pages', 'js'),
      path.join(DIST_DIR, 'src', 'styles'),
      path.join(DIST_DIR, 'src', 'utils'),
      path.join(DIST_DIR, 'assets', 'images'),
      path.join(DIST_DIR, 'assets', 'sounds')
    ];
    
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }
  }
  
  /**
   * Copy HTML pages
   */
  copyHTMLPages() {
    const htmlDir = path.join(SRC_DIR, 'pages', 'html');
    
    if (!fs.existsSync(htmlDir)) {
      this.warnings.push('HTML pages directory not found');
      return;
    }
    
    const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
    
    for (const file of htmlFiles) {
      const srcPath = path.join(htmlDir, file);
      const destPath = path.join(DIST_DIR, 'src', 'pages', 'html', file);
      
      fs.copyFileSync(srcPath, destPath);
      this.copiedFiles.push(destPath);
      console.log(`📄 Copied HTML: ${file}`);
    }
  }
  
  /**
   * Copy CSS files
   */
  copyCSS() {
    const cssDir = path.join(SRC_DIR, 'pages', 'css');
    const stylesDir = path.join(SRC_DIR, 'styles');
    
    // Copy page-specific CSS
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
      
      for (const file of cssFiles) {
        const srcPath = path.join(cssDir, file);
        const destPath = path.join(DIST_DIR, 'src', 'pages', 'css', file);
        
        fs.copyFileSync(srcPath, destPath);
        this.copiedFiles.push(destPath);
        console.log(`📄 Copied CSS: ${file}`);
      }
    }
    
    // Copy global styles
    if (fs.existsSync(stylesDir)) {
      const styleFiles = fs.readdirSync(stylesDir).filter(file => file.endsWith('.css'));
      
      for (const file of styleFiles) {
        const srcPath = path.join(stylesDir, file);
        const destPath = path.join(DIST_DIR, 'src', 'styles', file);
        
        fs.copyFileSync(srcPath, destPath);
        this.copiedFiles.push(destPath);
        console.log(`📄 Copied Style: ${file}`);
      }
    }
  }
  
  /**
   * Copy JS files
   */
  copyJS() {
    const jsDir = path.join(SRC_DIR, 'pages', 'js');
    const utilsDir = path.join(SRC_DIR, 'utils');
    const vanillaDir = path.join(SRC_DIR, 'pages', 'vanilla');
    
    // Copy page-specific JS
    if (fs.existsSync(jsDir)) {
      const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
      
      for (const file of jsFiles) {
        const srcPath = path.join(jsDir, file);
        const destPath = path.join(DIST_DIR, 'src', 'pages', 'js', file);
        
        fs.copyFileSync(srcPath, destPath);
        this.copiedFiles.push(destPath);
        console.log(`📄 Copied JS: ${file}`);
      }
    }
    
    // Copy utility JS
    if (fs.existsSync(utilsDir)) {
      const utilFiles = fs.readdirSync(utilsDir).filter(file => file.endsWith('.js'));
      
      for (const file of utilFiles) {
        const srcPath = path.join(utilsDir, file);
        const destPath = path.join(DIST_DIR, 'src', 'utils', file);
        
        fs.copyFileSync(srcPath, destPath);
        this.copiedFiles.push(destPath);
        console.log(`📄 Copied Utility: ${file}`);
      }
    }
    
    // Copy vanilla JS implementations
    if (fs.existsSync(vanillaDir)) {
      // Create vanilla directory if it doesn't exist
      const destVanillaDir = path.join(DIST_DIR, 'src', 'pages', 'vanilla');
      if (!fs.existsSync(destVanillaDir)) {
        fs.mkdirSync(destVanillaDir, { recursive: true });
      }
      
      const vanillaFiles = fs.readdirSync(vanillaDir).filter(file => file.endsWith('.js'));
      
      for (const file of vanillaFiles) {
        const srcPath = path.join(vanillaDir, file);
        const destPath = path.join(destVanillaDir, file);
        
        fs.copyFileSync(srcPath, destPath);
        this.copiedFiles.push(destPath);
        console.log(`📄 Copied Vanilla JS: ${file}`);
      }
    }
  }
  
  /**
   * Copy assets (images, sounds, etc.)
   */
  copyAssets() {
    const assetsDirs = [
      { src: path.join(SRC_DIR, 'assets', 'images'), dest: path.join(DIST_DIR, 'assets', 'images') },
      { src: path.join(SRC_DIR, 'assets', 'sounds'), dest: path.join(DIST_DIR, 'assets', 'sounds') }
    ];
    
    for (const { src, dest } of assetsDirs) {
      if (!fs.existsSync(src)) continue;
      
      // Create destination directory if it doesn't exist
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const files = fs.readdirSync(src);
      
      for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        // Skip if it's a directory
        if (fs.statSync(srcPath).isDirectory()) continue;
        
        fs.copyFileSync(srcPath, destPath);
        this.copiedFiles.push(destPath);
        console.log(`📄 Copied Asset: ${file}`);
      }
    }
  }
  
  /**
   * Create HTML endpoints index
   */
  createHTMLEndpointsIndex() {
    const htmlDir = path.join(DIST_DIR, 'src', 'pages', 'html');
    
    if (!fs.existsSync(htmlDir)) {
      this.warnings.push('HTML pages directory not found for creating endpoints index');
      return;
    }
    
    const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
    
    // Create HTML content
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anniversary Website - HTML Endpoints</title>
  <style>
    body {
      background: #2D1B2F;
      color: #FADCD9;
      font-family: 'Inter', sans-serif;
      text-align: center;
      padding: 50px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      margin-bottom: 30px;
      font-size: 2.5rem;
      background: linear-gradient(135deg, #FF6B6B 0%, #FADCD9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .endpoints {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 40px;
    }
    .endpoint {
      background: rgba(101, 0, 33, 0.3);
      border: 1px solid #650021;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    .endpoint:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      background: rgba(101, 0, 33, 0.5);
    }
    a {
      color: #FF6B6B;
      text-decoration: none;
      font-weight: bold;
      display: block;
      padding: 10px;
      transition: color 0.3s ease;
    }
    a:hover {
      color: #FADCD9;
    }
    .back-button {
      background: linear-gradient(135deg, #650021 0%, #FF6B6B 100%);
      color: #FADCD9;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      text-decoration: none;
      display: inline-block;
      margin-top: 40px;
      transition: all 0.3s ease;
    }
    .back-button:hover {
      box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
      transform: translateY(-2px);
    }
    .version {
      margin-top: 40px;
      font-size: 0.8rem;
      color: #AAA2BF;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌟 Anniversary Website HTML Endpoints</h1>
    <p>Direct access to individual features and pages</p>
    
    <div class="endpoints">
      ${htmlFiles.map(file => `
      <div class="endpoint">
        <a href="src/pages/html/${file}" target="_blank">${file.replace('.html', '')}</a>
      </div>
      `).join('')}
    </div>
    
    <a href="index.html" class="back-button">Return to Main Site</a>
    
    <div class="version">Anniversary Website v4.0.0</div>
  </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(DIST_DIR, 'html-endpoints.html'), content);
    console.log('📄 Created HTML endpoints index');
    this.copiedFiles.push(path.join(DIST_DIR, 'html-endpoints.html'));
  }
}

// Run copying process if called directly
if (require.main === module) {
  const copier = new HTMLPagesCopier();
  copier.copy();
}

module.exports = HTMLPagesCopier;
