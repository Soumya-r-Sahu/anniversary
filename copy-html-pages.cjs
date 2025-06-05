const fs = require('fs');
const path = require('path');

console.log('📁 Copying HTML pages to dist directory...');

// Create directories
const distDir = path.join(__dirname, 'dist');
const srcPagesDir = path.join(__dirname, 'src', 'pages-html');
const distPagesDir = path.join(distDir, 'src', 'pages-html');
const srcStylesDir = path.join(__dirname, 'src', 'styles');
const distStylesDir = path.join(distDir, 'src', 'styles');
const srcScriptsDir = path.join(__dirname, 'src', 'scripts');
const distScriptsDir = path.join(distDir, 'src', 'scripts');

// Ensure directories exist
[distPagesDir, distStylesDir, distScriptsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Copy HTML pages and remove countdown links
if (fs.existsSync(srcPagesDir)) {
  const htmlFiles = fs.readdirSync(srcPagesDir).filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    const srcFile = path.join(srcPagesDir, file);
    const destFile = path.join(distPagesDir, file);

    // Read and process HTML content
    let content = fs.readFileSync(srcFile, 'utf8');

    // Remove countdown links from all pages except countdown.html
    if (file !== 'countdown.html') {
      // Remove countdown navigation links
      content = content.replace(
        /<li><a href="countdown\.html" class="nav-link">Countdown<\/a><\/li>/g,
        ''
      );

      // Remove countdown navigation cards
      content = content.replace(
        /<a href="countdown\.html"[^>]*>[\s\S]*?<div class="text-2xl mb-2">⏰<\/div>[\s\S]*?<div class="text-sm[^>]*>Countdown<\/div>[\s\S]*?<\/a>/g,
        ''
      );

      // Clean up any remaining countdown references
      content = content.replace(/countdown\.html/g, 'anniversary.html');
    }

    fs.writeFileSync(destFile, content);
    console.log(`📄 Copied and processed: ${file}`);
  });

  console.log(`✅ Copied ${htmlFiles.length} HTML pages (countdown links removed)`);
} else {
  console.log('❌ Source pages directory not found');
}

// Copy shared styles
if (fs.existsSync(srcStylesDir)) {
  const cssFiles = fs.readdirSync(srcStylesDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const srcFile = path.join(srcStylesDir, file);
    const destFile = path.join(distStylesDir, file);
    
    fs.copyFileSync(srcFile, destFile);
    console.log(`🎨 Copied: ${file}`);
  });
  
  console.log(`✅ Copied ${cssFiles.length} CSS files`);
} else {
  console.log('❌ Source styles directory not found');
}

// Copy shared scripts
if (fs.existsSync(srcScriptsDir)) {
  const jsFiles = fs.readdirSync(srcScriptsDir).filter(file => file.endsWith('.js'));
  
  jsFiles.forEach(file => {
    const srcFile = path.join(srcScriptsDir, file);
    const destFile = path.join(distScriptsDir, file);
    
    fs.copyFileSync(srcFile, destFile);
    console.log(`📜 Copied: ${file}`);
  });
  
  console.log(`✅ Copied ${jsFiles.length} JavaScript files`);
} else {
  console.log('❌ Source scripts directory not found');
}

// Create a simple index page for HTML endpoints
const htmlIndexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anniversary Website - HTML Endpoints</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #ff6b9d, #ffa8cc, #ffb3d6);
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            color: #be185d;
            text-align: center;
            margin-bottom: 2rem;
        }
        .links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .link {
            display: block;
            padding: 1rem;
            background: #ec4899;
            color: white;
            text-decoration: none;
            border-radius: 10px;
            text-align: center;
            transition: all 0.3s ease;
        }
        .link:hover {
            background: #db2777;
            transform: translateY(-2px);
        }
        .react-link {
            background: #3b82f6;
            font-size: 1.2rem;
            font-weight: bold;
        }
        .react-link:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💕 Anniversary Website - HTML Endpoints 💕</h1>
        <p style="text-align: center; color: #6b7280; margin-bottom: 2rem;">
            Choose your preferred way to experience our love story:
        </p>
        
        <a href="index.html" class="link react-link">
            🚀 React SPA Experience (Recommended)
        </a>
        
        <div class="links">
            <a href="src/pages-html/countdown.html" class="link">⏰ Countdown</a>
            <a href="src/pages-html/anniversary.html" class="link">🎉 Anniversary</a>
            <a href="src/pages-html/love-story.html" class="link">📖 Love Story</a>
            <a href="src/pages-html/photo-gallery.html" class="link">📸 Photo Gallery</a>
            <a href="src/pages-html/music-playlist.html" class="link">🎵 Music Playlist</a>
            <a href="src/pages-html/memory-book.html" class="link">📚 Memory Book</a>
            <a href="src/pages-html/special-dates.html" class="link">📅 Special Dates</a>
            <a href="src/pages-html/future-plans.html" class="link">🌟 Future Plans</a>
            <a href="src/pages-html/love-letters.html" class="link">💌 Love Letters</a>
            <a href="src/pages-html/challenges.html" class="link">🎮 Challenges</a>
            <a href="src/pages-html/wish-list.html" class="link">🌠 Wish List</a>
            <a href="src/pages-html/fireworks.html" class="link">🎆 Fireworks</a>
            <a href="src/pages-html/settings.html" class="link">⚙️ Settings</a>
        </div>
        
        <p style="text-align: center; color: #6b7280; margin-top: 2rem; font-size: 0.9rem;">
            Made with ❤️ for Jerry by Soumya
        </p>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'html-endpoints.html'), htmlIndexContent);
console.log('📄 Created html-endpoints.html');

console.log('\\n🎉 All files copied successfully!');
console.log('\\n📋 Available endpoints:');
console.log('- React SPA: dist/index.html');
console.log('- HTML Index: dist/html-endpoints.html');
console.log('- HTML Pages: dist/src/pages-html/*.html');
console.log('\\n🚀 Ready for GitHub Pages deployment!');
