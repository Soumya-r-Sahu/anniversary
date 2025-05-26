# 💕 Love Anniversary Website

> **🚀 Status: PRODUCTION READY** | **🎵 Music System: 100% Operational** | **📱 GitHub Pages: Ready to Deploy**

A beautiful, romantic anniversary website celebrating your love story with animations, music, and heartfelt messages. Built with modern web technologies and optimized for performance.

## 🚀 Quick Deploy to GitHub Pages
1. **Push to GitHub**: Upload this repository to GitHub
2. **Enable Pages**: Go to Settings → Pages → Source: "GitHub Actions"
3. **Live in Minutes**: Your site deploys automatically!
4. **Your URL**: `https://[username].github.io/[repo-name]/`

*See [GITHUB_PAGES_READY.md](GITHUB_PAGES_READY.md) for detailed setup instructions.*

## 🏗️ Architecture Overview

This project features a **modular, unified architecture** that eliminates code duplication and provides optimal performance:

### **Core Components**
- **Unified Music Manager**: Single source of truth for all audio functionality
- **Unified Heart Animation**: Reusable heart effects across all pages  
- **Unified Gallery**: Universal photo gallery with lightbox and slideshow
- **Unified Particle System**: Custom particle effects replacing particles.js
- **Performance Monitor**: Real-time performance tracking and optimization

### **Modern Features**
- 🔧 **Progressive Web App (PWA)** - Installable with offline support
- 🚀 **Service Worker** - Advanced caching and background sync
- 📱 **Responsive Design** - CSS Grid and Flexbox layouts
- ⚡ **Lazy Loading** - Optimized image and resource loading
- 🎨 **CSS Custom Properties** - Dynamic theming and dark mode
- 🔍 **SEO Optimized** - Structured data and meta tags
- ♿ **Accessibility** - WCAG 2.1 compliant with screen reader support

## 🎵 Featured Music

The website includes **local background music** with smart playlist system:
- **Queue System**: Different music queues for different pages (waiting vs celebration)
- **Main Song**: `song1.m4a` - Beautiful romantic background music
- **Auto-play**: Music starts automatically on all pages (respects browser restrictions)
- **User Controls**: Floating music toggle button on every page
- **Seamless Experience**: Music continues as you navigate between pages
- **Smart Playlists**: `queue_waiting/` for anticipation, `queue_song/` for celebration

## ✨ Features

- 🌹 **Romantic Design** - Soft pastels, elegant typography, and loving touches
- 💬 **Heartfelt Messages** - Personal love letter and anniversary wishes
- 🎶 **Background Music** - Local music files with smart queue system
- 💞 **Animations** - Floating hearts, smooth scrolling, and fade-in effects
- 📸 **Photo Gallery** - Responsive slideshow of your precious memories
- 📱 **Mobile Friendly** - Optimized for phones, tablets, and desktop
- 🎉 **Interactive Features** - Confetti effects and surprise messages
- ⚡ **Fast Loading** - Optimized performance and smooth animations
- ⏰ **Countdown Timer** - Special countdown to anniversary date

## 🚀 Quick Start

### **Development Mode**
```bash
# Clone the repository
git clone <repository-url>
cd anniversary-website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Simple Setup**
1. **Download/Clone** this repository
2. **Add Photos**: Replace placeholder images in the `images/` folder
3. **Customize**: Edit names, dates, and messages in the HTML files
4. **Test**: Open `index.html` in a web browser
5. **Deploy**: Upload to GitHub Pages, Netlify, or any web hosting

## 🏗️ Project Architecture

### **Directory Structure**
```
anniversary-website/
├── 📁 config/                    # JSON configurations
│   ├── eslint.json              # Code quality rules
│   ├── prettier.json            # Code formatting rules
│   └── README.md               # Config documentation
├── 📁 .vscode/                   # VS Code workspace settings
│   └── settings.json            # Points to new config locations
├── 📁 src/                      # Modern modular architecture
│   ├── 📁 core/                 # Core functionality
│   │   ├── UnifiedMusicManager.js
│   │   ├── UnifiedStorageManager.js
│   │   └── UnifiedPerformanceMonitor.js
│   ├── 📁 components/           # Reusable UI components
│   │   ├── BackgroundComponents.js
│   │   ├── UnifiedHeartAnimation.js
│   │   ├── UnifiedGallery.js
│   │   └── UnifiedParticleSystem.js
│   ├── 📁 pages/                # Page-specific controllers
│   │   ├── index.js
│   │   ├── anniversary.js
│   │   ├── countdown.js
│   │   ├── love-story.js
│   │   └── photo-gallery.js
│   ├── 📁 utils/                # Utility functions
│   │   ├── music-manager.js
│   │   ├── smooth-transitions.js
│   │   ├── performance.js
│   │   ├── lazyLoader.js
│   │   ├── throttle.js
│   │   └── README.md
│   ├── 📁 styles/               # Modern CSS architecture
│   │   └── variables.css
│   └── sw.js                    # Service worker
├── 📁 images/                   # Photo assets
├── 📁 music/                    # Audio files
├── package.json                 # Build configuration
├── vite.config.js               # Vite build setup
└── README.md                    # This file
```

### **Key Architectural Improvements**

#### **🔄 Unified Systems**
- **Single Music Manager**: Replaced 3 conflicting music systems
- **Unified Components**: Consolidated duplicate gallery, heart, and particle systems
- **Consistent APIs**: Standardized interfaces across all components
- **Memory Management**: Proper cleanup and resource management

#### **⚡ Performance Optimizations**
- **Lazy Loading**: Images and resources load on demand
- **Code Splitting**: Modular loading based on page requirements
- **Caching Strategy**: Service worker with multiple cache layers
- **Throttled Operations**: Debounced DOM updates and localStorage writes
- **Web Vitals**: Real-time performance monitoring

#### **🎨 Modern CSS Architecture**
- **CSS Custom Properties**: Dynamic theming and dark mode support
- **Grid & Flexbox**: Responsive layouts without media query complexity
- **Component-based Styles**: Isolated CSS for each component
- **Progressive Enhancement**: Graceful degradation for older browsers

#### **🔌 Integration Bridge**
- **Backwards Compatibility**: Works with existing HTML files
- **Auto-initialization**: Components load based on page detection
- **Progressive Enhancement**: New features enhance existing functionality
- **Zero Breaking Changes**: Maintains current user experience

## 📱 Page Flow

The website consists of three main pages:

1. **`index.html`** - Beautiful landing page with entrance
   - Welcome message for Jerry (Puja)
   - "Open Your Surprise" button
   - Floating hearts and sparkle animations
   - Background music with controls

2. **`countdown.html`** - Countdown to anniversary date
   - Live countdown timer to June 16th, 2025
   - Celebration when date arrives
   - Fireworks and confetti effects
   - Same background music continues

3. **`anniversary.html`** - Main celebration page
   - Complete anniversary website
   - Photo gallery, timeline, love letter
   - Interactive features and animations
   - Consistent music experience

## 📁 File Structure

```
anniversary-website/
├── index.html          # Landing page with entrance
├── countdown.html      # Countdown timer to anniversary date
├── anniversary.html    # Main anniversary celebration page
├── style.css           # Custom styles and animations
├── src/utils/          # Utility scripts
│   ├── music-manager.js
│   └── smooth-transitions.js
├── images/             # Your photo memories
├── music/              # Music files and documentation
└── README.md           # This file
```

## 🎨 Customization

### Changing Names and Messages:
1. Open `index.html`
2. Search for "Puja" and "Jerry" to replace with your names
3. Update the love letter content in the message section
4. Modify timeline dates and milestones

### Adding Your Photos:
1. Place your photos in the `images/` folder
2. Use the exact filenames listed in `images/README.md`
3. Recommended size: 800x600px or larger

### Changing Colors:
1. Edit the CSS custom properties in `style.css`
2. Update Tailwind classes in `index.html`
3. Modify gradient colors throughout

## 🚀 Deployment Options

### GitHub Pages (Free):
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings → Pages
4. Set source to "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Your site will be live at: `https://yourusername.github.io/repository-name`

### Netlify (Free):
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your site will be live instantly!

### Other Hosting:
- Vercel
- GitHub Pages
- Any web hosting service

## 💡 Tips

- **Mobile First**: The design is optimized for mobile viewing
- **Image Optimization**: Compress photos for faster loading
- **Personal Touch**: Add your own memories and inside jokes
- **Music**: Volume controls are available for user preference
- **Sharing**: Perfect for sharing with your partner or on social media

## 🛠️ Technologies Used

- **HTML5** - Structure and content
- **CSS3** - Styling and animations
- **JavaScript** - Interactive features
- **Tailwind CSS** - Utility-first styling
- **AOS.js** - Scroll animations
- **Particles.js** - Background effects
- **Typed.js** - Text animations

## 💖 Special Features

- **Floating Hearts**: Animated hearts floating across the screen
- **Timeline**: Beautiful journey of your relationship milestones
- **Confetti Effect**: Surprise button triggers celebration animation
- **Responsive Gallery**: Touch-friendly photo slideshow
- **Love Letter**: Heartfelt message section with beautiful styling
- **Music Integration**: Background music with volume controls

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎉 Special Thanks



---

**Made with ❤️ for celebrating love stories**

*Happy Anniversary! May your love story continue to be filled with joy, laughter, and endless monkey business!* 🐒💕
