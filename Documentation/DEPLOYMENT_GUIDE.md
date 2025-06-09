# Anniversary Website v4.0.0 - Deployment Guide

## 🚀 GitHub Pages Deployment

### Prerequisites
- Repository with GitHub Pages enabled
- Build artifacts in `dist/` directory
- Custom domain (optional)

### Deployment Steps

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   # Option 1: Deploy dist folder
   git add dist/
   git commit -m "Deploy Anniversary Website v4.0.0"
   git push origin main
   
   # Option 2: Use subtree for gh-pages branch
   git subtree push --prefix dist origin gh-pages
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` or `main`
   - Folder: `/ (root)` or `/dist`

### URL Structure
- **Main Site**: `https://username.github.io/anniversary/`
- **HTML Pages**: `https://username.github.io/anniversary/src/pages/html/[page].html`
- **Direct Access**: `https://username.github.io/anniversary/html-endpoints.html`

## 🎨 v4.0.0 Features

### System-Wide Color Palette
```css
--bg-base: #2D1B2F           /* Background base */
--accent-1: #650021          /* Accent 1 */
--accent-2: #D4A5A5          /* Accent 2 */
--highlight-text: #FADCD9    /* Highlight Text */
--glow-active: #FF6B6B       /* Glow/Active Button */
--secondary-text: #AAA2BF    /* Secondary Text */
--music-player-bg: #1C1427   /* Music player background */
--firework-video-bg: #121212 /* Firework/video background */
```

### Intelligent Redirection
- Automatically redirects between countdown and anniversary pages
- Target date: 2025-06-16T00:00:00
- State management with localStorage
- Analytics tracking

### Natural Scenery (Fireworks Page)
- CSS-only mountain ranges with depth
- Pine and deciduous tree silhouettes
- Animated mist and twinkling stars
- Responsive design for mobile

### Unified Systems
- Single navigation system replacing 13+ duplicate functions
- JSON database with fast response caching
- Comprehensive data management
- Performance optimization

## 🔧 Configuration

### Custom Domain (Optional)
Create `dist/CNAME` file:
```
yourdomain.com
```

### Environment Variables
Set in GitHub repository settings:
```
ANNIVERSARY_DATE=2025-06-16T00:00:00
GIRL_NAME=Soumya
BOY_NAME=Jerry
```

## 📊 Performance Metrics
- **Main Bundle**: 313.75 kB (101.56 kB gzipped)
- **Optimized Chunks**: 21 chunks
- **HTML Pages**: 13 pages with unified systems
- **Build Time**: ~16 seconds
- **Load Time**: <2 seconds on 3G

## 🐛 Troubleshooting

### Common Issues
1. **404 Errors**: Ensure `.nojekyll` file exists
2. **CSS Not Loading**: Check relative paths in HTML
3. **JS Modules**: Verify MIME types are correct
4. **Mobile Issues**: Test viewport settings

### Debug Mode
Add `?debug=true` to any URL for enhanced logging.

## 📱 Mobile Optimization
- Responsive design for all screen sizes
- Touch-friendly navigation
- Optimized animations for 60fps
- Progressive Web App features

---
Generated for Anniversary Website v4.0.0 deployment
Last updated: 2025-06-09T09:32:55.212Z
