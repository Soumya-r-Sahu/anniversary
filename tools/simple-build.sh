#!/usr/bin/env bash

# Simplified build and prepare script for GitHub Pages
echo "🚀 Building Anniversary Website v4.0.0 for GitHub Pages..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy critical files
echo "📂 Copying critical files..."
cp index.html dist/
cp -r src/pages/vanilla dist/

# Create GitHub Pages specific files
echo "📄 Creating GitHub Pages configuration files..."
touch dist/.nojekyll

# Create simple 404 page
cat > dist/404.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anniversary Website - Page Not Found</title>
  <style>
    body {
      background: #2D1B2F;
      color: #FADCD9;
      font-family: 'Inter', sans-serif;
      text-align: center;
      padding: 50px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .glow-button {
      background: linear-gradient(135deg, #FF6B6B 0%, #650021 100%);
      color: #FADCD9;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      text-decoration: none;
      display: inline-block;
      margin-top: 20px;
      transition: all 0.3s ease;
    }
    .glow-button:hover {
      box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌟 Page Not Found</h1>
    <p>The page you're looking for doesn't exist, but our love story continues...</p>
    <a href="/anniversary-website/" class="glow-button">Return to Our Anniversary</a>
  </div>
  <script>
    // Auto-redirect to main site after 3 seconds
    setTimeout(() => {
      window.location.href = '/anniversary-website/';
    }, 3000);
  </script>
</body>
</html>
EOF

echo "✅ Build completed. Files prepared in the dist directory."
echo "🌐 Ready for deployment to GitHub Pages!"
