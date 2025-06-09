#!/bin/bash

# HTML Structure Restoration Script
# Fixes the broken HTML structure after navigation cleanup

echo "🔧 Restoring HTML structure..."

# Array of files and their icons
declare -A files_icons=(
    ["challenges.html"]="🎯"
    ["wish-list.html"]="🎁"
    ["photo-gallery.html"]="📸"
    ["love-story.html"]="💕"
    ["future-plans.html"]="🌟"
    ["love-letters.html"]="💌"
    ["special-dates.html"]="📅"
    ["music-playlist.html"]="🎵"
    ["memory-book.html"]="📖"
    ["fireworks.html"]="🎆"
    ["countdown.html"]="⏰"
)

base_dir="/home/asus/anniversary/anniversary/src/pages/html"

for file in "${!files_icons[@]}"; do
    echo "🔧 Fixing $file..."
    icon="${files_icons[$file]}"
    
    # Find the line that has the broken structure (usually contains an icon and text)
    # and add the proper closing tags before it
    
    # Create temp file with proper structure
    temp_file=$(mktemp)
    
    # Process the file line by line
    while IFS= read -r line; do
        # Check if this line contains the start of content (usually has an icon)
        if [[ "$line" =~ $icon ]]; then
            # Add the missing closing tags before the content
            echo "</style>" >> "$temp_file"
            echo "<link rel=\"stylesheet\" href=\"../styles/unified-navigation.css\">" >> "$temp_file"
            echo "<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E$icon%3C/text%3E%3C/svg%3E\">" >> "$temp_file"
            echo "</head>" >> "$temp_file"
            echo "<body style=\"padding-top: 90px;\">" >> "$temp_file"
            echo "<!-- Navigation will be loaded dynamically -->" >> "$temp_file"
        fi
        echo "$line" >> "$temp_file"
    done < "$base_dir/$file"
    
    # Replace the original file
    mv "$temp_file" "$base_dir/$file"
    
    echo "✅ Fixed $file"
done

echo "🎉 HTML structure restoration completed!"
