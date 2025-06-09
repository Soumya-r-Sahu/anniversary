#!/bin/bash

# Comprehensive Polish Verification Script
# Final check for Anniversary Website v4.0.0

echo "🔍 COMPREHENSIVE POLISH VERIFICATION - Anniversary Website v4.0.0"
echo "================================================================"

cd /home/asus/anniversary/anniversary

# 1. Verify Directory Structure
echo ""
echo "📂 DIRECTORY STRUCTURE VERIFICATION:"
echo "------------------------------------"

directories=(
    "src/pages/html"
    "src/pages/css" 
    "src/pages/js"
    "src/styles"
    "src/scripts"
    "src/utils"
    "src/components"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        count=$(ls -1 "$dir" | wc -l)
        echo "  ✅ $dir: $count files"
    else
        echo "  ❌ $dir: Missing"
    fi
done

# 2. Check HTML Files Structure
echo ""
echo "🌐 HTML FILES VERIFICATION:"
echo "---------------------------"

html_files=(
    "src/pages/html/anniversary.html"
    "src/pages/html/challenges.html"
    "src/pages/html/countdown.html"
    "src/pages/html/fireworks.html"
    "src/pages/html/future-plans.html"
    "src/pages/html/love-letters.html"
    "src/pages/html/love-story.html"
    "src/pages/html/memory-book.html"
    "src/pages/html/music-playlist.html"
    "src/pages/html/navigation.html"
    "src/pages/html/photo-gallery.html"
    "src/pages/html/settings.html"
    "src/pages/html/special-dates.html"
    "src/pages/html/wish-list.html"
)

for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        # Check if file has proper structure
        if grep -q "</head>" "$file" && grep -q "<body" "$file"; then
            echo "  ✅ $file: Proper structure"
        else
            echo "  ⚠️  $file: Structure needs review"
        fi
    else
        echo "  ❌ $file: Missing"
    fi
done

# 3. Check Navigation System
echo ""
echo "🧭 NAVIGATION SYSTEM VERIFICATION:"
echo "----------------------------------"

if [ -f "src/scripts/navigation-loader.js" ]; then
    echo "  ✅ Navigation loader exists"
else
    echo "  ❌ Navigation loader missing"
fi

if [ -f "src/pages/html/navigation.html" ]; then
    echo "  ✅ Navigation template exists"
else
    echo "  ❌ Navigation template missing"
fi

# Check if navigation loader is referenced in HTML files
nav_loader_count=$(grep -l "navigation-loader.js" src/pages/html/*.html | wc -l)
echo "  📊 Navigation loader referenced in $nav_loader_count HTML files"

# 4. Check Import Paths
echo ""
echo "🔗 IMPORT PATHS VERIFICATION:"
echo "-----------------------------"

# Check for broken CSS imports
broken_css=$(grep -r "styles/pages/" src/pages/html/ 2>/dev/null | wc -l)
if [ $broken_css -eq 0 ]; then
    echo "  ✅ No broken CSS import paths found"
else
    echo "  ❌ Found $broken_css broken CSS import paths"
fi

# Check for broken JS imports  
broken_js=$(grep -r "scripts/pages/" src/pages/html/ 2>/dev/null | wc -l)
if [ $broken_js -eq 0 ]; then
    echo "  ✅ No broken JS import paths found"
else
    echo "  ❌ Found $broken_js broken JS import paths"
fi

# 5. Utils Directory Check
echo ""
echo "🛠️  UTILS DIRECTORY VERIFICATION:"
echo "--------------------------------"

utils_files=(
    "src/utils/dataManager.js"
    "src/utils/dataManagerAdvanced.js"
    "src/utils/jsonDatabase.js"
    "src/utils/timeCalculator.js"
    "src/utils/unifiedNavigation.js"
)

for file in "${utils_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        echo "  ✅ $file: ${size} bytes"
    else
        echo "  ❌ $file: Missing"
    fi
done

# Check for duplicates
if [ -f "src/utils/timeCalculator.ts" ]; then
    echo "  ⚠️  Duplicate timeCalculator.ts found (should be removed)"
else
    echo "  ✅ No duplicate timeCalculator files"
fi

# 6. Styles Directory Check
echo ""
echo "🎨 STYLES DIRECTORY VERIFICATION:"
echo "--------------------------------"

css_count=$(ls -1 src/styles/*.css 2>/dev/null | wc -l)
echo "  📊 Total CSS files: $css_count"

key_styles=(
    "src/styles/shared.css"
    "src/styles/unified-navigation.css"
    "src/styles/variables.css"
)

for file in "${key_styles[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file: Available"
    else
        echo "  ❌ $file: Missing"
    fi
done

# 7. Version Consistency Check
echo ""
echo "📋 VERSION CONSISTENCY:"
echo "----------------------"

package_version=$(grep '"version"' package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
echo "  📦 package.json version: $package_version"

# Check if version is consistent in comments
version_comments=$(grep -r "Version.*4.0.0" src/ 2>/dev/null | wc -l)
echo "  📝 Files with v4.0.0 in comments: $version_comments"

# 8. GitHub Pages Readiness Check
echo ""
echo "🚀 GITHUB PAGES READINESS:"
echo "-------------------------"

if [ -f "index.html" ]; then
    echo "  ✅ Root index.html exists"
else
    echo "  ❌ Root index.html missing"
fi

if [ -f "public/manifest.json" ]; then
    echo "  ✅ PWA manifest exists"
else
    echo "  ❌ PWA manifest missing"
fi

if [ -f "public/sw.js" ]; then
    echo "  ✅ Service worker exists"
else
    echo "  ❌ Service worker missing"
fi

# 9. Performance Check
echo ""
echo "⚡ PERFORMANCE INDICATORS:"
echo "------------------------"

total_html_size=$(find src/pages/html -name "*.html" -exec wc -c {} + | tail -1 | awk '{print $1}')
echo "  📊 Total HTML size: $total_html_size bytes"

total_css_size=$(find src/styles -name "*.css" -exec wc -c {} + | tail -1 | awk '{print $1}')
echo "  📊 Total CSS size: $total_css_size bytes"

total_js_size=$(find src/scripts -name "*.js" -exec wc -c {} + | tail -1 | awk '{print $1}')
echo "  📊 Total JS size: $total_js_size bytes"

echo ""
echo "🎉 VERIFICATION COMPLETE!"
echo "========================"
echo ""
echo "💡 Next Steps:"
echo "  1. Review any ❌ or ⚠️  items above"
echo "  2. Test navigation system"
echo "  3. Run build process: npm run build"
echo "  4. Deploy to GitHub Pages"
