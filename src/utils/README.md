# Utils Directory - Utility Scripts 🛠️

This directory contains all utility scripts used across the Anniversary Website project.

## Files Overview:

### 🎵 **music-manager.js** 
- **Purpose**: Manages background music playback across all pages
- **Features**: 
  - Cross-page music synchronization
  - LocalStorage state persistence
  - Auto-resume functionality
  - Volume control
- **Usage**: Automatically loaded on pages with music functionality

### ✨ **smooth-transitions.js**
- **Purpose**: Universal smooth page transitions and animations
- **Features**:
  - Page entrance/exit animations
  - Intersection Observer animations
  - Button hover effects
  - Image loading transitions
- **Usage**: Loaded on all pages for enhanced UX

### ⚡ **performance.js**
- **Purpose**: Performance monitoring and optimization utilities
- **Features**: Performance metrics collection and reporting

### 🔄 **lazyLoader.js**
- **Purpose**: Lazy loading implementation for images and components
- **Features**: Improves page load performance

### 🎯 **throttle.js**
- **Purpose**: Function throttling utilities
- **Features**: Prevents excessive function calls during scroll/resize events

## Integration:

### **HTML Pages**: 
All utility scripts are included via script tags:
```html
<script src="src/utils/music-manager.js"></script>
<script src="src/utils/smooth-transitions.js"></script>
```

### **Vite Build System**:
Utilities are bundled together for optimization:
```javascript
'utils': [
  './src/utils/music-manager.js',
  './src/utils/smooth-transitions.js',
  './src/utils/performance.js',
  './src/utils/lazyLoader.js',
  './src/utils/throttle.js'
]
```

## File Locations Updated:

✅ **Moved from root** → **src/utils/**
- `music-manager.js` → `src/utils/music-manager.js`
- `smooth-transitions.js` → `src/utils/smooth-transitions.js`

✅ **Updated References in:**
- `index.html`
- `countdown.html` 
- `anniversary.html`
- `love-story.html`
- `photo-gallery.html`
- `vite.config.js`
- `GITHUB_PAGES_READY.md`

Your anniversary website now has a perfectly organized utility structure! 💕
