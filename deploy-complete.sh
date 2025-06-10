#!/usr/bin/env bash

# Anniversary Website v4.0.0 - Complete Deployment Script
# Handles build, content-focused naming, and GitHub Pages deployment

echo "🚀 Starting Anniversary Website v4.0.0 deployment process..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Pre-deployment checks
echo "🔍 Step 1: Pre-deployment verification..."
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Are you in the right directory?"
  exit 1
fi

if [ ! -d "src/pages/vanilla" ]; then
  echo "❌ Error: Vanilla JavaScript pages directory not found."
  exit 1
fi

echo "✅ Pre-deployment checks passed"

# Step 2: Clean previous build
echo "🧹 Step 2: Cleaning previous build..."
rm -rf dist
echo "✅ Previous build cleaned"

# Step 3: Build the project
echo "🏗️ Step 3: Building the project..."
npm run build:full
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please check the errors above."
  exit 1
fi
echo "✅ Build completed successfully"

# Step 4: Apply content-focused naming
echo "🎨 Step 4: Applying content-focused naming..."
node content-focused-enhance.js
echo "✅ Content-focused naming applied"

# Step 5: Create additional GitHub Pages files
echo "📄 Step 5: Creating GitHub Pages configuration..."

# Ensure .nojekyll exists
touch dist/.nojekyll

# Create CNAME file for custom domain (optional)
if [ -n "$CUSTOM_DOMAIN" ]; then
  echo "$CUSTOM_DOMAIN" > dist/CNAME
  echo "✅ CNAME file created for $CUSTOM_DOMAIN"
fi

# Create robots.txt
cat > dist/robots.txt << 'EOF'
User-agent: *
Allow: /

Sitemap: https://yourusername.github.io/anniversary-website/sitemap.xml
EOF

echo "✅ GitHub Pages configuration completed"

# Step 6: Final verification
echo "🔍 Step 6: Final verification..."
./final-verification.sh
echo "✅ Final verification completed"

# Step 7: Deploy to GitHub Pages
echo "🚀 Step 7: Deploying to GitHub Pages..."
npm run deploy:gh-pages
if [ $? -ne 0 ]; then
  echo "❌ GitHub Pages deployment failed. Please check your gh-pages setup."
  exit 1
fi

echo "✅ Deployment to GitHub Pages completed"

# Step 8: Success message
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎊 SUCCESS! Anniversary Website v4.0.0 deployed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your website is now live at:"
echo "   https://yourusername.github.io/anniversary-website/"
echo ""
echo "🎯 Key Features Deployed:"
echo "   ✅ JavaScript-First Architecture"
echo "   ✅ Vanilla JS implementations (anniversary, music-playlist, special-dates)"
echo "   ✅ Intelligent date-based redirection"
echo "   ✅ Content-focused semantic naming"
echo "   ✅ GitHub Pages optimization"
echo ""
echo "💕 The Anniversary Website v4.0.0 is ready for Jerry!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
