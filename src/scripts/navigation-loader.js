/**
 * Navigation Loader for GitHub Pages
 * Dynamically loads navigation.html into pages
 * Version: 1.0.0
 */

async function loadNavigation() {
  try {
    // Fetch the navigation HTML
    const response = await fetch('./navigation.html');
    if (!response.ok) {
      throw new Error(`Failed to load navigation: ${response.status}`);
    }
    
    const navigationHTML = await response.text();
    
    // Insert navigation at the beginning of body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = navigationHTML;
    const navElement = tempDiv.querySelector('nav');
    
    if (navElement) {
      document.body.insertBefore(navElement, document.body.firstChild);
      console.log('✅ Navigation loaded successfully');
      
      // Initialize navigation functionality
      if (window.UnifiedNavigationManager) {
        new window.UnifiedNavigationManager();
      }
      
      // Initialize Lucide icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    } else {
      console.error('❌ No navigation element found in navigation.html');
    }
  } catch (error) {
    console.error('❌ Failed to load navigation:', error);
    
    // Fallback: Create basic navigation
    createFallbackNavigation();
  }
}

function createFallbackNavigation() {
  const nav = document.createElement('nav');
  nav.className = 'unified-nav';
  nav.innerHTML = `
    <div class="nav-container">
      <a href="../../index.html" class="nav-brand nav-glow">💕 Jerry & Soumya</a>
      <ul class="nav-menu">
        <li class="nav-item"><a href="anniversary.html" class="nav-link">Anniversary</a></li>
        <li class="nav-item"><a href="photo-gallery.html" class="nav-link">Gallery</a></li>
        <li class="nav-item"><a href="settings.html" class="nav-link">Settings</a></li>
      </ul>
    </div>
  `;
  
  document.body.insertBefore(nav, document.body.firstChild);
  console.log('⚠️ Fallback navigation created');
}

// Auto-load when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
  loadNavigation();
}

export { loadNavigation };
