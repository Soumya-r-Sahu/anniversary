#!/bin/bash

# Comprehensive HTML Structure Fix Script
# Repairs broken HTML after navigation cleanup

echo "🔧 Starting comprehensive HTML structure repair..."

# File configurations: filename -> emoji
declare -A file_configs=(
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

for file in "${!file_configs[@]}"; do
    echo "🔧 Processing $file..."
    emoji="${file_configs[$file]}"
    file_path="$base_dir/$file"
    
    # Create a backup
    cp "$file_path" "$file_path.backup"
    
    # Use sed to fix the structure
    # 1. Find lines that contain "Navigate" followed by Bootstrap dropdown
    # 2. Replace with proper closing tags and body opening
    
    sed -i '/Navigate$/,/<\/div><div class="[^"]*-hero">/{
        # Remove the Navigate dropdown block
        /Navigate$/,/<\/div><div class="[^"]*-hero">/{
            # Keep only the div that starts with class ending in "-hero"
            /<div class="[^"]*-hero">/{
                # Insert proper closing tags before the hero div
                i\</style>\
<link rel="stylesheet" href="../styles/unified-navigation.css">\
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='\''http://www.w3.org/2000/svg'\'' viewBox='\''0 0 100 100'\''%3E%3Ctext y='\''.9em'\'' font-size='\''90'\''%3E'$emoji'%3C/text%3E%3C/svg%3E">\
</head>\
<body style="padding-top: 90px;">\
<!-- Navigation will be loaded dynamically -->
                # Print the hero div line
                p
                # Skip to next file
                b end
            }
            # Delete other lines in the range
            d
        }
        : end
    }' "$file_path"
    
    # Add navigation loader script before the unified navigation script
    sed -i '/<!-- Unified Navigation & Data Management System -->/i\<!-- Navigation Loader -->\
<script type="module" src="../scripts/navigation-loader.js"></script>' "$file_path"
    
    echo "✅ Fixed $file"
done

echo "🎉 HTML structure repair completed!"
echo "📋 Summary:"
echo "   • Fixed HTML structure for ${#file_configs[@]} files"
echo "   • Added proper closing tags (</style>, </head>, <body>)"
echo "   • Removed Bootstrap dropdown menus"
echo "   • Added navigation loader scripts"
echo "   • Backups created with .backup extension"
