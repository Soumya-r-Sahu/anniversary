#!/bin/bash

# Anniversary Website v5.0.0 - Dashboard Setup Script
# Automated setup for music management dashboard

echo "🎵 Anniversary Music Dashboard v5.0.0 Setup"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Copy dashboard package.json to package.json for installation
if [ -f "dashboard-package.json" ]; then
    cp dashboard-package.json package-dashboard.json
    echo "📦 Dashboard package configuration ready"
else
    echo "❌ dashboard-package.json not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dashboard dependencies..."
npm install --package-lock-only=false express multer cors nodemon

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create music directories
echo "📁 Creating music directory structure..."
mkdir -p public/assets/music/{pages,playlists/{romantic-hindi,romantic-odia,romantic-sambalpuri,celebration-mixed,slow-mixed,cultural-mixed},legacy/{hindi-classics,odia-modern,sambalpuri-folk},uploads}

echo "✅ Music directories created"

# Create a simple launcher script
cat > launch-dashboard.sh << 'EOF'
#!/bin/bash
echo "🎵 Starting Anniversary Music Dashboard v5.0.0..."
echo "Dashboard will be available at: http://localhost:3001/dashboard"
echo "Press Ctrl+C to stop the server"
echo ""
node dashboard-server.js
EOF

chmod +x launch-dashboard.sh

# Create a Windows batch file
cat > launch-dashboard.bat << 'EOF'
@echo off
echo 🎵 Starting Anniversary Music Dashboard v5.0.0...
echo Dashboard will be available at: http://localhost:3001/dashboard
echo Press Ctrl+C to stop the server
echo.
node dashboard-server.js
pause
EOF

echo "🚀 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: ./launch-dashboard.sh (Linux/Mac) or launch-dashboard.bat (Windows)"
echo "2. Open: http://localhost:3001/dashboard in your browser"
echo "3. Start uploading and managing your music collection!"
echo ""
echo "🎵 Features available:"
echo "   - Upload music files (MP3, M4A, WAV, FLAC)"
echo "   - Organize by language (Hindi, Odia, Sambalpuri)"
echo "   - Edit song metadata"
echo "   - Preview and manage collection"
echo "   - Export music data"
echo ""
echo "💡 Keyboard shortcuts:"
echo "   - Ctrl+U: Upload files"
echo "   - Ctrl+E: Edit song info"
echo "   - Ctrl+R: Refresh library"
echo ""
echo "✨ Ready to enhance your Anniversary Website music collection!"
