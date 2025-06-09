#!/bin/bash

# Automated HTML Structure Fix Script - Batch Processing
# Fixes all remaining broken HTML files efficiently

echo "🚀 Starting automated HTML structure fixes..."

# Define file patterns and their emojis
declare -A files=(
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

for file in "${!files[@]}"; do
    echo "🔧 Processing $file..."
    emoji="${files[$file]}"
    
    # Find the line with "Navigate" and fix the structure
    temp_file=$(mktemp)
    fixed=false
    
    while IFS= read -r line; do
        if [[ "$line" == "Navigate" ]]; then
            # Found the broken point, add proper structure
            echo "</style>" >> "$temp_file"
            echo "<link rel=\"stylesheet\" href=\"../styles/unified-navigation.css\">" >> "$temp_file"
            echo "<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E$emoji%3C/text%3E%3C/svg%3E\">" >> "$temp_file"
            echo "</head>" >> "$temp_file"
            echo "<body style=\"padding-top: 90px;\">" >> "$temp_file"
            echo "<!-- Navigation will be loaded dynamically -->" >> "$temp_file"
            
            # Skip until we find the main content (after dropdown)
            while IFS= read -r skip_line; do
                if [[ "$skip_line" =~ \<(main|section|div).*class.*hero ]]; then
                    echo "$skip_line" >> "$temp_file"
                    break
                fi
            done
            fixed=true
        elif [[ "$fixed" == false ]]; then
            echo "$line" >> "$temp_file"
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$base_dir/$file"
    
    # Replace original file
    mv "$temp_file" "$base_dir/$file"
    
    # Add navigation loader script
    sed -i '/<!-- Unified Navigation & Data Management System -->/i\<!-- Navigation Loader -->\
<script type="module" src="../scripts/navigation-loader.js"></script>' "$base_dir/$file"
    
    echo "✅ Fixed $file"
done

echo "🎉 All HTML files have been repaired!"
echo "📋 Fixed files: ${!files[@]}"
