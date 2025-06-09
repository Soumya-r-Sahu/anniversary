#!/bin/bash

# Fix Remaining HTML Structure Issues
# Targeted fix for countdown.html, love-letters.html, memory-book.html, music-playlist.html, navigation.html

echo "🔧 Fixing remaining HTML structure issues..."

cd /home/asus/anniversary/anniversary/src/pages/html

files_to_fix=(
    "countdown.html"
    "love-letters.html" 
    "memory-book.html"
    "music-playlist.html"
    "navigation.html"
)

for file in "${files_to_fix[@]}"; do
    if [ -f "$file" ]; then
        echo "🔨 Processing $file..."
        
        # Create backup
        cp "$file" "${file}.structure-backup"
        
        # For navigation.html (special case - it's just a template)
        if [ "$file" = "navigation.html" ]; then
            echo "  ✅ $file is navigation template - structure is intentionally different"
            continue
        fi
        
        # Check if file has proper head/body structure
        if ! grep -q "</head>" "$file" || ! grep -q "<body" "$file"; then
            echo "  🔧 Adding missing head/body structure to $file..."
            
            # Find where styles end and add proper structure
            # This is a more sophisticated approach using sed to find style blocks
            
            # Create a temporary file with proper structure
            temp_file="${file}.temp"
            
            # Extract everything before </style>
            sed -n '1,/^<\/style>/p' "$file" > "$temp_file"
            
            # Add proper closing tags if not present
            if ! grep -q "</head>" "$temp_file"; then
                echo '<link rel="stylesheet" href="../styles/unified-navigation.css">' >> "$temp_file"
                echo '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='"'"'http://www.w3.org/2000/svg'"'"' viewBox='"'"'0 0 100 100'"'"'%3E%3Ctext y='"'"'.9em'"'"' font-size='"'"'90'"'"'%3E💖%3C/text%3E%3C/svg%3E">' >> "$temp_file"
                echo '</head>' >> "$temp_file"
                echo '<body style="padding-top: 90px;">' >> "$temp_file"
                echo '<!-- Navigation will be loaded dynamically -->' >> "$temp_file"
            fi
            
            # Extract everything after </style> but skip any existing head/body tags
            sed -n '/^<\/style>/,$p' "$file" | sed '1d' | grep -v "^</head>$" | grep -v "^<body" >> "$temp_file"
            
            # Replace original file
            mv "$temp_file" "$file"
            
            echo "  ✅ Fixed structure for $file"
        else
            echo "  ✅ $file already has proper structure"
        fi
    else
        echo "  ❌ $file not found"
    fi
done

echo ""
echo "🎉 HTML structure fixes complete!"
echo "📋 Summary:"
for file in "${files_to_fix[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "</head>" "$file" && grep -q "<body" "$file"; then
            echo "  ✅ $file: Fixed"
        else
            echo "  ⚠️  $file: May need manual review"
        fi
    fi
done
