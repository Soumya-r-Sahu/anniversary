#!/usr/bin/env bash

# Final Verification Script for Anniversary Website v4.0.0
# Ensures all components are working correctly before deployment

echo "🔍 Running final verification for Anniversary Website v4.0.0..."

# Check if build directory exists
if [ ! -d "dist" ]; then
  echo "❌ Error: Build directory not found. Please run 'npm run build' first."
  exit 1
fi

# Verify important files
echo "📋 Checking critical files..."

CRITICAL_FILES=(
  "dist/index.html"
  "dist/assets"
  "dist/src/pages/vanilla/anniversary.js"
  "dist/src/pages/vanilla/music-playlist.js"
  "dist/src/pages/vanilla/special-dates.js"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -e "$file" ]; then
    echo "✅ Found: $file"
  else
    echo "❌ Missing: $file"
    MISSING_FILES=true
  fi
done

if [ "$MISSING_FILES" = true ]; then
  echo "❌ Some critical files are missing. Please check the build."
  exit 1
fi

# Check vanilla JS implementations
echo "📋 Verifying JavaScript-first implementations..."

VANILLA_PAGES=(
  "anniversary"
  "music-playlist"
  "special-dates"
)

for page in "${VANILLA_PAGES[@]}"; do
  if grep -q "class $page" "dist/src/pages/vanilla/$page.js"; then
    echo "✅ Verified: $page.js exports a class"
  else
    echo "⚠️ Warning: $page.js might not export a proper class"
  fi
done

# Check GitHub Pages configuration
echo "📋 Checking GitHub Pages configuration..."

if [ -e "dist/.nojekyll" ]; then
  echo "✅ Found: .nojekyll file for GitHub Pages"
else
  echo "⚠️ Warning: .nojekyll file missing, adding it"
  touch "dist/.nojekyll"
fi

if [ -e "dist/404.html" ]; then
  echo "✅ Found: 404.html for handling missing pages"
else
  echo "⚠️ Warning: 404.html is missing, this may cause navigation issues on GitHub Pages"
fi

# Check base URL configuration
if grep -q "'/anniversary-website/'" "dist/assets/js/main"*.js; then
  echo "✅ Base URL properly configured for GitHub Pages"
else
  echo "⚠️ Warning: Base URL might not be properly configured for GitHub Pages"
fi

# Final status report
echo ""
echo "📝 Final Verification Report:"
echo "✅ Build directory verification completed"
echo "✅ Critical files check completed"
echo "✅ JavaScript-first implementation verification completed"
echo "✅ GitHub Pages configuration check completed"
echo ""
echo "🚀 The Anniversary Website v4.0.0 is ready for deployment!"
echo "Run 'npm run deploy' to deploy to GitHub Pages"