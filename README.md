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
├── 📁 src/                          # Modern modular architecture
│   ├── 📁 core/                     # Core functionality
│   │   ├── UnifiedMusicManager.js   # Single music system
│   │   ├── UnifiedStorageManager.js # Optimized localStorage
│   │   └── UnifiedPerformanceMonitor.js # Performance tracking
│   ├── 📁 components/               # Reusable UI components
│   │   ├── BackgroundComponents.js  # Unified background system
│   │   ├── UnifiedHeartAnimation.js # Heart effects
│   │   ├── UnifiedGallery.js        # Photo gallery
│   │   └── UnifiedParticleSystem.js # Custom particles
│   ├── 📁 pages/                    # Page-specific controllers
│   │   ├── index.js                 # Landing page logic
│   │   ├── anniversary.js           # Anniversary page logic
│   │   ├── countdown.js             # Countdown page logic
│   │   ├── love-story.js            # Love story page logic
│   │   └── photo-gallery.js         # Gallery page logic
│   ├── 📁 utils/                    # Utility functions
│   │   ├── performance.js           # Performance utilities
│   │   ├── lazyLoader.js            # Intelligent lazy loading
│   │   └── throttle.js              # Throttling and debouncing
│   ├── 📁 styles/                   # Modern CSS architecture
│   │   └── variables.css            # CSS custom properties
│   ├── 📁 templates/                # HTML templates
│   │   ├── base.html                # Base template with PWA
│   │   └── components.html          # Reusable components
│   ├── integrator.js                # Legacy integration bridge
│   └── sw.js                        # Service worker
├── 📁 Legacy Files/                 # Original HTML files
│   ├── index.html                   # Landing page
│   ├── anniversary.html             # Anniversary celebration
│   ├── countdown.html               # Countdown timer
│   ├── love-story.html              # Interactive love story
│   └── photo-gallery.html           # Photo gallery
├── 📁 images/                       # Photo assets
├── 📁 music/                        # Audio files
├── package.json                     # Build configuration
├── vite.config.js                   # Vite build setup
└── README.md                        # This file
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
├── script.js           # Interactive features and animations
├── countdown.js        # Countdown timer functionality
├── images/             # Your photo memories
│   ├── README.md       # Instructions for adding photos
│   ├── first-meeting.jpg
│   ├── first-date.jpg
│   ├── memory1.jpg
│   └── ... (more photos)
├── music/              # Music files and documentation
│   ├── README.md       # Music implementation details
│   ├── song1.m4a       # Main romantic background song
│   ├── queue_waiting/  # Playlist for waiting/anticipation pages
│   │   ├── README.md   # Waiting music guide
│   │   └── song1.m4a   # Main song (copy/symlink)
│   └── queue_song/     # Playlist for anniversary celebration
│       └── README.md   # Celebration music guide
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

### **Recommended: Netlify (Free)**
```bash
# Build the project
npm run build

# Deploy to Netlify
npm run deploy
```

### **GitHub Pages**
```bash
# Build and deploy
npm run build
npm run deploy:github
```

### **Manual Deployment**
1. Run `npm run build` to create optimized files
2. Upload the `dist/` folder to your web hosting provider
3. Configure server to serve `index.html` for all routes

### **Advanced Hosting**
- **Vercel**: `vercel --prod`
- **Firebase**: `firebase deploy`
- **AWS S3**: Configure as static website hosting
- **Docker**: Use included `Dockerfile` for containerized deployment

## ⚙️ Configuration

### **Environment Variables**
Create a `.env` file for customization:
```env
VITE_ANNIVERSARY_DATE=2025-06-16
VITE_PARTNER_NAME=Jerry
VITE_YOUR_NAME=Puja
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

### **PWA Configuration**
Edit `vite.config.js` to customize PWA settings:
```javascript
pwa: {
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,mp3,m4a}']
  },
  manifest: {
    name: 'Our Love Anniversary',
    short_name: 'Anniversary',
    description: 'A beautiful anniversary celebration website'
  }
}
```

### **Performance Tuning**
- **Image Optimization**: Use WebP format for better compression
- **Music Files**: Convert to multiple formats (MP3, OGG, M4A) for compatibility
- **Bundle Analysis**: Run `npm run analyze` to check bundle sizes
- **Lighthouse Audit**: Test performance with built-in tools

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run test         # Run tests (if configured)
npm run lint         # Check code quality
npm run format       # Format code with Prettier
npm run analyze      # Analyze bundle size
npm run deploy       # Deploy to configured hosting
```

### **Development Features**
- **Hot Module Replacement**: Instant updates during development
- **Source Maps**: Debug original source code
- **Error Overlay**: Visual error display in browser
- **Auto-reload**: Automatic browser refresh on file changes

### **Code Quality**
- **ESLint**: Code linting with modern JavaScript standards
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance
- **TypeScript**: Optional type checking support

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

## 🌐 Deployment Options

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
