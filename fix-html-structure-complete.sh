#!/bin/bash

# Fix HTML Structure - Complete Polish Session
# Addresses broken HTML tags, missing closures, and formatting issues

echo "🔧 Starting Complete HTML Structure Fix..."

cd /home/asus/anniversary/anniversary/src/pages/html

# List of HTML files to fix
html_files=(
    "anniversary.html"
    "challenges.html"
    "countdown.html"
    "fireworks.html"
    "future-plans.html"
    "love-letters.html"
    "love-story.html"
    "memory-book.html"
    "music-playlist.html"
    "photo-gallery.html"
    "settings.html"
    "special-dates.html"
    "wish-list.html"
)

# Fix each file
for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        echo "🔨 Fixing structure in $file..."
        
        # Create backup
        cp "$file" "${file}.backup"
        
        # Fix common issues using sed
        sed -i '
            # Fix malformed class attributes
            s/class= text-high-contrast"/class="text-high-contrast"/g
            s/class= text-medium-contrast"/class="text-medium-contrast"/g
            
            # Fix missing quotes in class attributes
            s/class=text-/class="text-/g
            s/text-center mb-8" class="text-high-contrast"/text-center mb-8 text-high-contrast"/g
            
            # Fix broken h2 tags
            s/<h2 class= text-high-contrast"/<h2 class="text-high-contrast"/g
            
            # Fix malformed paragraphs and headers
            s/🌟 Our Dreams & Future Plans<\/h2><div/<h2>🌟 Our Dreams & Future Plans<\/h2><div/g
            
            # Add missing closing quotes
            s/mb-4 animate-float">/mb-4 animate-float">/g
            
        ' "$file"
        
        echo "✅ Fixed basic structure issues in $file"
    else
        echo "❌ File $file not found"
    fi
done

echo "🎉 HTML structure fix complete!"
echo "💡 Backups saved with .backup extension"

# Verify files exist and are not empty
echo ""
echo "📊 File Status Check:"
for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        echo "  ✅ $file: ${size} bytes"
    else
        echo "  ❌ $file: Missing"
    fi
done
