/**
 * Unified Navigation Script - Anniversary Website v4.0.0
 * Single source for all navigation functionality
 * Replaces 13+ duplicate navigation functions
 */

class UnifiedNavigationManager {
  constructor() {
    this.isInitialized = false;
    this.mobileMenuActive = false;
    this.currentPage = this.getCurrentPage();
    this.init();
  }

  /**
   * Initialize the navigation system
   */
  init() {
    if (this.isInitialized) return;

    try {
      this.setupMobileNavigation();
      this.setupPageHighlighting();
      this.setupSmoothScrolling();
      this.setupKeyboardNavigation();
      this.setupAccessibility();
      this.initializeLucideIcons();
      
      this.isInitialized = true;
      console.log('🧭 Unified Navigation initialized successfully');
    } catch (error) {
      console.error('❌ Navigation initialization failed:', error);
    }
  }

  /**
   * Get current page name
   */
  getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  /**
   * Setup mobile navigation functionality
   */
  setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) {
      console.warn('Navigation elements not found on this page');
      return;
    }

    // Mobile menu toggle
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu(navToggle, navMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        this.closeMobileMenu(navToggle, navMenu);
      }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.mobileMenuActive) {
        this.closeMobileMenu(navToggle, navMenu);
      }
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu(toggle, menu) {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    toggle.setAttribute('aria-expanded', !isExpanded);
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    
    this.mobileMenuActive = !isExpanded;

    // Prevent body scroll when menu is open
    if (this.mobileMenuActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(toggle, menu) {
    if (!this.mobileMenuActive) return;

    toggle.classList.remove('active');
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    
    this.mobileMenuActive = false;
    document.body.style.overflow = '';
  }

  /**
   * Setup page highlighting
   */
  setupPageHighlighting() {
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes(this.currentPage) || 
          (this.currentPage === 'index.html' && href.includes('index.html')))) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Close mobile menu when pressing Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.mobileMenuActive) {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        this.closeMobileMenu(navToggle, navMenu);
      }
    });

    // Navigate with arrow keys (when menu is focused)
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    navLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % navLinks.length;
          navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
          navLinks[prevIndex].focus();
        }
      });
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add skip link if not present
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Ensure proper ARIA labels
    const navToggle = document.getElementById('navToggle');
    if (navToggle && !navToggle.getAttribute('aria-label')) {
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    }
  }

  /**
   * Initialize Lucide icons
   */
  initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  /**
   * Add smooth page transitions
   */
  addPageTransition(href) {
    if (!href || href.startsWith('#') || href.includes('javascript:')) return;

    // Add loading class to body
    document.body.classList.add('page-transitioning');

    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #ff6b9d, #c44569);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center; color: white;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">💕</div>
        <div>Loading...</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animate overlay in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    // Navigate after animation
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  }

  /**
   * Update navigation state
   */
  updateNavigationState() {
    this.currentPage = this.getCurrentPage();
    this.setupPageHighlighting();
  }

  /**
   * Get navigation analytics
   */
  getAnalytics() {
    return {
      currentPage: this.currentPage,
      mobileMenuActive: this.mobileMenuActive,
      isInitialized: this.isInitialized,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Destroy navigation (cleanup)
   */
  destroy() {
    // Remove event listeners and cleanup
    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
      navToggle.replaceWith(navToggle.cloneNode(true));
    }
    
    this.isInitialized = false;
    this.mobileMenuActive = false;
    
    console.log('🧭 Navigation destroyed');
  }
}

// Auto-initialize when DOM is ready
function initializeUnifiedNavigation() {
  if (window.unifiedNav) {
    console.log('🧭 Navigation already initialized');
    return;
  }

  window.unifiedNav = new UnifiedNavigationManager();

  // Add page transition listeners to navigation links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.startsWith('#') && 
        !link.href.includes('javascript:') && 
        link.hostname === window.location.hostname &&
        !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      
      // Check if it's an external link or download
      if (!link.download && !link.target === '_blank') {
        e.preventDefault();
        window.unifiedNav.addPageTransition(link.href);
      }
    }
  });
}

// Initialize based on document state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUnifiedNavigation);
} else {
  initializeUnifiedNavigation();
}

// Reinitialize on page changes (for SPAs)
window.addEventListener('popstate', () => {
  if (window.unifiedNav) {
    window.unifiedNav.updateNavigationState();
  }
});

// Export for global access
window.UnifiedNavigationManager = UnifiedNavigationManager;

export { UnifiedNavigationManager };
