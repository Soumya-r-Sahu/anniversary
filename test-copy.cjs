#!/usr/bin/env node

console.log('Test copy script starting...');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname);
console.log('Project root:', PROJECT_ROOT);

const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
console.log('Dist directory:', DIST_DIR);

// Check if dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  console.log('Creating dist directory');
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Create a test file
fs.writeFileSync(path.join(DIST_DIR, 'test.txt'), 'Test file created by test-copy.cjs');

console.log('Test copy script completed successfully');
