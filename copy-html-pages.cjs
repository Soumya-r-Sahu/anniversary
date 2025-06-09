const fs = require('fs');
const path = require('path');

console.log('📁 Anniversary Website v4.0.0 - Copying HTML pages to dist directory...');

// Create directories for v4.0.0 structure
const distDir = path.join(__dirname, 'dist');
const srcPagesHtmlDir = path.join(__dirname, 'src', 'pages', 'html');
const distPagesHtmlDir = path.join(distDir, 'src', 'pages', 'html');
const srcPagesCssDir = path.join(__dirname, 'src', 'pages', 'css');
const distPagesCssDir = path.join(distDir, 'src', 'pages', 'css');
const srcPagesJsDir = path.join(__dirname, 'src', 'pages', 'js');
const distPagesJsDir = path.join(distDir, 'src', 'pages', 'js');
const srcStylesDir = path.join(__dirname, 'src', 'styles');
const distStylesDir = path.join(distDir, 'src', 'styles');
const srcUtilsDir = path.join(__dirname, 'src', 'utils');
const distUtilsDir = path.join(distDir, 'src', 'utils');

// Ensure directories exist
[distPagesHtmlDir, distPagesCssDir, distPagesJsDir, distStylesDir, distUtilsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Copy HTML pages with intelligent redirection updates
if (fs.existsSync(srcPagesHtmlDir)) {
  const htmlFiles = fs.readdirSync(srcPagesHtmlDir).filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    const srcFile = path.join(srcPagesHtmlDir, file);
    const destFile = path.join(distPagesHtmlDir, file);

    // Read and process HTML content
    let content = fs.readFileSync(srcFile, 'utf8');

    // Update paths for v4.0.0 structure
    content = content.replace(/src\/pages-html\//g, 'src/pages/html/');
    content = content.replace(/src\/styles\/pages\//g, 'src/pages/css/');
    content = content.replace(/src\/scripts\/pages\//g, 'src/pages/js/');

    // Update countdown behavior based on intelligent redirection
    if (file === 'countdown.html') {
      // Add countdown completion redirect logic
      content = content.replace(
        /<script>/,
        `<script>
        // v4.0.0 Countdown completion check
        function checkCountdownCompletion() {
          const targetDate = new Date('2025-06-16T00:00:00');
          const currentDate = new Date();
          if (currentDate >= targetDate) {
            // Countdown complete - redirect to anniversary
            setTimeout(() => {
              window.location.href = 'anniversary.html';
            }, 2000);
          }
        }
        
        // Check on page load
        document.addEventListener('DOMContentLoaded', checkCountdownCompletion);
        </script>
        <script>`
      );
    }

        fs.writeFileSync(destFile, content);
    console.log(`📄 Copied and processed: ${file}`);
  });

  console.log(`✅ Copied ${htmlFiles.length} HTML pages (v4.0.0 structure)`);
} else {
  console.log('❌ Source HTML pages directory not found');
}

// Copy page-specific CSS files
if (fs.existsSync(srcPagesCssDir)) {
  const cssFiles = fs.readdirSync(srcPagesCssDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const srcFile = path.join(srcPagesCssDir, file);
    const destFile = path.join(distPagesCssDir, file);
    
    fs.copyFileSync(srcFile, destFile);
    console.log(`🎨 Copied CSS: ${file}`);
  });
  
  console.log(`✅ Copied ${cssFiles.length} page-specific CSS files`);
}

// Copy page-specific JS files
if (fs.existsSync(srcPagesJsDir)) {
  const jsFiles = fs.readdirSync(srcPagesJsDir).filter(file => file.endsWith('.js'));
  
  jsFiles.forEach(file => {
    const srcFile = path.join(srcPagesJsDir, file);
    const destFile = path.join(distPagesJsDir, file);
    
    fs.copyFileSync(srcFile, destFile);
    console.log(`📜 Copied JS: ${file}`);
  });
  
  console.log(`✅ Copied ${jsFiles.length} page-specific JavaScript files`);
}

// Copy shared styles
if (fs.existsSync(srcStylesDir)) {
  const cssFiles = fs.readdirSync(srcStylesDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const srcFile = path.join(srcStylesDir, file);
    const destFile = path.join(distStylesDir, file);
    
    fs.copyFileSync(srcFile, destFile);
    console.log(`🎨 Copied shared CSS: ${file}`);
  });
  
  console.log(`✅ Copied ${cssFiles.length} shared CSS files`);
}

// Copy unified systems (utils)
if (fs.existsSync(srcUtilsDir)) {
  const utilsFiles = fs.readdirSync(srcUtilsDir).filter(file => file.endsWith('.js'));
  
  utilsFiles.forEach(file => {
    const srcFile = path.join(srcUtilsDir, file);
    const destFile = path.join(distUtilsDir, file);
    
    fs.copyFileSync(srcFile, destFile);
    console.log(`🔧 Copied utils: ${file}`);
  });
  
  console.log(`✅ Copied ${utilsFiles.length} unified system files`);
}

// Create a simple index page for HTML endpoints (v4.0.0)
const htmlIndexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anniversary Website v4.0.0 - HTML Endpoints</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a0b2e, #2d1b3d, #8b5a8c);
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
            color: #f8e8ff;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            backdrop-filter: blur(20px);
        }
        h1 {
            color: #ec4899;
            text-align: center;
            margin-bottom: 2rem;
            text-shadow: 0 2px 10px rgba(236, 72, 153, 0.3);
        }
        .version-badge {
            background: #ec4899;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 1rem;
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
            background: rgba(236, 72, 153, 0.8);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .link:hover {
            background: rgba(236, 72, 153, 1);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(236, 72, 153, 0.3);
        }
        .react-link {
            background: rgba(59, 130, 246, 0.8);
            font-size: 1.2rem;
            font-weight: bold;
        }
        .react-link:hover {
            background: rgba(59, 130, 246, 1);
        }
        .countdown-notice {
            background: rgba(251, 191, 36, 0.2);
            border: 1px solid rgba(251, 191, 36, 0.5);
            border-radius: 10px;
            padding: 1rem;
            margin: 1rem 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="version-badge">v4.0.0 - Intelligent Redirection</div>
        <h1>💕 Anniversary Website - HTML Endpoints 💕</h1>
        <p style="text-align: center; color: #d1d5db; margin-bottom: 2rem;">
            Experience our love story with the new v4.0.0 intelligent redirection system:
        </p>
        
        <div class="countdown-notice">
            <strong>🎯 Intelligent Redirection Active</strong><br>
            The main site will automatically redirect based on the anniversary countdown status.
        </div>
        
        <a href="index.html" class="link react-link">
            🚀 React SPA Experience (Recommended)
        </a>
        
        <div class="links">
            <a href="src/pages/html/countdown.html" class="link">⏰ Countdown</a>
            <a href="src/pages/html/anniversary.html" class="link">🎉 Anniversary</a>
            <a href="src/pages/html/love-story.html" class="link">📖 Love Story</a>
            <a href="src/pages/html/photo-gallery.html" class="link">📸 Photo Gallery</a>
            <a href="src/pages/html/music-playlist.html" class="link">🎵 Music Playlist</a>
            <a href="src/pages/html/memory-book.html" class="link">📚 Memory Book</a>
            <a href="src/pages/html/special-dates.html" class="link">📅 Special Dates</a>
            <a href="src/pages/html/future-plans.html" class="link">🌟 Future Plans</a>
            <a href="src/pages/html/love-letters.html" class="link">💌 Love Letters</a>
            <a href="src/pages/html/challenges.html" class="link">🎮 Challenges</a>
            <a href="src/pages/html/wish-list.html" class="link">🌠 Wish List</a>
            <a href="src/pages/html/fireworks.html" class="link">🎆 Fireworks</a>
            <a href="src/pages/html/settings.html" class="link">⚙️ Settings</a>
        </div>
        
        <p style="text-align: center; color: #9ca3af; margin-top: 2rem; font-size: 0.9rem;">
            Made with ❤️ for Jerry by Soumya | v4.0.0 - Enhanced with Intelligent Redirection
        </p>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'html-endpoints.html'), htmlIndexContent);
console.log('📄 Created html-endpoints.html (v4.0.0)');

console.log('\\n🎉 Anniversary Website v4.0.0 - All files copied successfully!');
console.log('\\n📋 Available endpoints:');
console.log('- React SPA: dist/index.html (with intelligent redirection)');
console.log('- HTML Index: dist/html-endpoints.html');
console.log('- HTML Pages: dist/src/pages/html/*.html');
console.log('- Page CSS: dist/src/pages/css/*.css');
console.log('- Page JS: dist/src/pages/js/*.js');
console.log('- Unified Systems: dist/src/utils/*.js');
console.log('\\n🎯 v4.0.0 Features:');
console.log('- Intelligent redirection based on countdown status');
console.log('- Organized file structure by extension');
console.log('- Enhanced state management');
console.log('- Unified navigation and JSON database systems');
console.log('\\n🚀 Ready for GitHub Pages deployment!');
