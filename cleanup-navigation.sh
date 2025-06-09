#!/bin/bash

# Navigation Cleanup Script for Anniversary Website v4.0.0
# Removes duplicate navigation menus from all HTML files

echo "🧹 Starting navigation cleanup..."

# Array of HTML files to clean
files=(
    "challenges.html"
    "wish-list.html" 
    "photo-gallery.html"
    "love-story.html"
    "settings.html"
    "future-plans.html"
    "love-letters.html"
    "special-dates.html"
    "music-playlist.html"
    "memory-book.html"
    "fireworks.html"
    "countdown.html"
)

# Base directory
base_dir="/home/asus/anniversary/anniversary/src/pages/html"

for file in "${files[@]}"; do
    echo "📄 Processing $file..."
    
    # Use sed to remove the navigation block and Bootstrap dropdown
    # This removes everything from <nav class="unified-nav" to </nav><!-- Navigation script replaced with unified system -->
    sed -i '/<nav class="unified-nav"/,/<!-- Navigation script replaced with unified system -->/d' "$base_dir/$file"
    
    # Also remove any standalone Bootstrap dropdown menus
    sed -i '/<div class="dropdown"><button.*dropdown-toggle/,/<\/div>/d' "$base_dir/$file"
    
    echo "✅ Cleaned $file"
done

echo "🎉 Navigation cleanup completed!"
echo "📋 Summary:"
echo "   • Removed duplicate navigation from ${#files[@]} files"
echo "   • Removed Bootstrap dropdown menus"
echo "   • Files are ready for dynamic navigation loading"
