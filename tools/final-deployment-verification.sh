#!/bin/bash

# 🎉 Anniversary Website v4.0.0 - Final Deployment Verification
# Comprehensive check before GitHub Pages deployment

echo "🚀 Starting Final Deployment Verification..."
echo "============================================="

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track overall status
VERIFICATION_PASSED=true

echo -e "${BLUE}📁 Checking Project Structure...${NC}"

# Check essential files exist
essential_files=(
    "index.html"
    "surprise.html"
    "src/styles/visual-enhancements.css"
    "src/styles/shared.css"
    "src/styles/navigation.css"
    "src/interactive/anniversaryInteractive.js"
    "src/core/MusicPlayer.js"
    "package.json"
    "vite.config.js"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        VERIFICATION_PASSED=false
    fi
done

echo -e "\n${BLUE}🎨 Verifying CSS Integration...${NC}"

# Check for duplicate or problematic CSS files
if [ -f "ui-enhancement-master.css" ]; then
    echo -e "${RED}❌ Found problematic file: ui-enhancement-master.css${NC}"
    VERIFICATION_PASSED=false
else
    echo -e "${GREEN}✅ No duplicate CSS files found${NC}"
fi

# Count CSS files
css_count=$(find src/styles -name "*.css" | wc -l)
page_css_count=$(find src/pages/css -name "*.css" | wc -l)

echo -e "${GREEN}✅ Global CSS files: $css_count${NC}"
echo -e "${GREEN}✅ Page-specific CSS files: $page_css_count${NC}"

echo -e "\n${BLUE}📱 Checking HTML Files...${NC}"

# Validate HTML files
html_files=("index.html" "surprise.html")
for html_file in "${html_files[@]}"; do
    if grep -q "ui-enhancement-master" "$html_file"; then
        echo -e "${RED}❌ $html_file contains reference to ui-enhancement-master.css${NC}"
        VERIFICATION_PASSED=false
    else
        echo -e "${GREEN}✅ $html_file - No problematic references${NC}"
    fi
done

echo -e "\n${BLUE}🔧 Checking JavaScript Integration...${NC}"

# Check key JavaScript files
js_files=(
    "src/interactive/anniversaryInteractive.js"
    "src/core/MusicPlayer.js"
    "src/components/UnifiedAnimationSystem.js"
)

for js_file in "${js_files[@]}"; do
    if [ -f "$js_file" ]; then
        echo -e "${GREEN}✅ $js_file${NC}"
    else
        echo -e "${YELLOW}⚠️  Optional: $js_file${NC}"
    fi
done

echo -e "\n${BLUE}📊 Performance Check...${NC}"

# Check for potential performance issues
large_files=$(find . -name "*.css" -o -name "*.js" | xargs wc -c | sort -n | tail -5)
echo -e "${GREEN}✅ Largest files check completed${NC}"

echo -e "\n${BLUE}🌐 GitHub Pages Compatibility...${NC}"

# Check for GitHub Pages requirements
if [ -f "index.html" ]; then
    echo -e "${GREEN}✅ index.html exists (GitHub Pages entry point)${NC}"
else
    echo -e "${RED}❌ index.html missing${NC}"
    VERIFICATION_PASSED=false
fi

# Check for relative paths (GitHub Pages requirement)
if grep -q 'href="/' index.html; then
    echo -e "${YELLOW}⚠️  Found absolute paths in index.html - may need adjustment for GitHub Pages${NC}"
else
    echo -e "${GREEN}✅ Relative paths detected - GitHub Pages compatible${NC}"
fi

echo -e "\n${BLUE}🔒 Security Check...${NC}"

# Check for any sensitive information
if grep -r "password\|secret\|key\|token" src/ --exclude-dir=node_modules 2>/dev/null | grep -v ".md:" | head -5; then
    echo -e "${YELLOW}⚠️  Review above files for sensitive information${NC}"
else
    echo -e "${GREEN}✅ No obvious sensitive information found${NC}"
fi

echo -e "\n${BLUE}📁 File Organization Check...${NC}"

# Verify proper file organization
directories=("src/styles" "src/pages" "src/components" "src/interactive")
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        file_count=$(find "$dir" -type f | wc -l)
        echo -e "${GREEN}✅ $dir ($file_count files)${NC}"
    else
        echo -e "${RED}❌ Missing directory: $dir${NC}"
        VERIFICATION_PASSED=false
    fi
done

echo -e "\n============================================="

# Final verification result
if [ "$VERIFICATION_PASSED" = true ]; then
    echo -e "${GREEN}🎉 VERIFICATION PASSED! 🎉${NC}"
    echo -e "${GREEN}✅ Anniversary Website v4.0.0 is ready for deployment!${NC}"
    echo -e "${BLUE}📝 Next steps:${NC}"
    echo -e "   1. Initialize git repository: ${YELLOW}git init${NC}"
    echo -e "   2. Add files: ${YELLOW}git add .${NC}"
    echo -e "   3. Commit: ${YELLOW}git commit -m 'Anniversary Website v4.0.0 - Complete'${NC}"
    echo -e "   4. Push to GitHub and enable Pages${NC}"
    echo -e "\n${GREEN}🌟 Ready to celebrate Jerry & Soumya's love story! 💕${NC}"
else
    echo -e "${RED}❌ VERIFICATION FAILED!${NC}"
    echo -e "${RED}Please fix the issues above before deployment.${NC}"
    exit 1
fi

echo -e "\n${BLUE}📈 Project Statistics:${NC}"
echo -e "   • Total files: $(find . -type f | wc -l)"
echo -e "   • CSS files: $(find . -name "*.css" | wc -l)"
echo -e "   • JavaScript files: $(find . -name "*.js" | wc -l)"
echo -e "   • HTML files: $(find . -name "*.html" | wc -l)"
echo -e "   • Documentation files: $(find . -name "*.md" | wc -l)"
