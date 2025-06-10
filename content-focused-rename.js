#!/usr/bin/env node

/**
 * Anniversary Website v4.0.0 - Content-Focused Naming Script
 * Applies semantic, meaningful names to CSS classes and IDs in the built files
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, 'dist');

// Content-focused naming mappings (simplified version)
const CONTENT_NAMING_MAP = {
  // Container and Layout Elements
  'container': 'content-sanctuary',
  'wrapper': 'story-section', 
  'main-content': 'love-story-content',
  'content-area': 'narrative-space',
  'section': 'story-chapter',
  
  // Photo and Visual Elements
  'photo-gallery': 'captured-memories',
  'gallery': 'visual-story',
  'photo-item': 'treasured-photo',
  
  // Music and Entertainment
  'music-player': 'melody-heart',
  'playlist': 'romantic-soundtrack',
  'song-item': 'love-melody',
  
  // Navigation and Interface
  'nav': 'story-navigation',
  'navbar': 'love-story-nav',
  'menu': 'story-chapters',
  'header': 'story-opening',
  'footer': 'story-closing',
};

// Relationship-specific naming
const RELATIONSHIP_NAMING = {
  'jerry': 'jerry-beloved',
  'soumya': 'mankada-loving',
  'couple': 'eternal-duo'
};

/**
 * Rename CSS classes and IDs in HTML files
 */
function applyContentFocusedNaming() {
  console.log('🎨 Applying content-focused naming to built files...\n');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Dist directory not found');
    return;
  }
  
  // Process HTML files
  processDirectory(DIST_DIR, '.html');
  
  // Process CSS files
  processDirectory(DIST_DIR, '.css');
  
  // Process JS files
  processDirectory(DIST_DIR, '.js');
  
  console.log('\n✅ Content-focused naming applied successfully');
}

/**
 * Process all files of a specific extension in a directory recursively
 */
function processDirectory(dirPath, extension) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    
    if (fs.statSync(itemPath).isDirectory()) {
      // Recursively process subdirectories
      processDirectory(itemPath, extension);
    } else if (item.endsWith(extension)) {
      // Process file
      processFile(itemPath, extension);
    }
  }
}

/**
 * Process a single file
 */
function processFile(filePath, extension) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Apply naming transformations
  for (const [oldName, newName] of Object.entries(CONTENT_NAMING_MAP)) {
    const regex = new RegExp(`class="([^"]*)${oldName}([^"]*)"`, 'g');
    
    if (content.match(regex)) {
      content = content.replace(regex, `class="$1${newName}$2"`);
      modified = true;
    }
    
    // Replace IDs
    const idRegex = new RegExp(`id="([^"]*)${oldName}([^"]*)"`, 'g');
    
    if (content.match(idRegex)) {
      content = content.replace(idRegex, `id="$1${newName}$2"`);
      modified = true;
    }
  }
  
  // Apply relationship naming
  for (const [oldName, newName] of Object.entries(RELATIONSHIP_NAMING)) {
    const regex = new RegExp(`\\b${oldName}\\b`, 'gi');
    
    if (content.match(regex)) {
      content = content.replace(regex, newName);
      modified = true;
    }
  }
  
  // Save changes if modified
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`📄 Applied content-focused naming to ${path.basename(filePath)}`);
  }
}

// Run the rename process
applyContentFocusedNaming();
