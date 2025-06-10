/**
 * Vanilla JavaScript Core System - Anniversary Website v4.0.0
 * JavaScript-First Architecture for Maximum Performance
 */

class AnniversaryCore {
  constructor() {
    this.version = '4.0.0';
    this.isInitialized = false;
    this.components = new Map();
    this.eventListeners = new Map();
    this.state = new StateManager();
    
    // Core systems
    this.dataManager = null;
    this.audioSystem = null;
    this.animationSystem = null;
    this.performanceUtils = null;
    
    this.init();
  }

  async init() {
    try {
      console.log(`🚀 Anniversary Core v${this.version} - JavaScript First Mode`);
      
      // Wait for core systems to be available
      await this.waitForCoreSystems();
      
      // Initialize core systems
      this.initializeCoreSystems();
      
      // Setup global event handling
      this.setupGlobalEvents();
      
      // Initialize router
      this.router = new VanillaRouter();
      this.setupRoutes();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Dispatch ready event
      this.dispatchEvent('anniversary:ready', {
        version: this.version,
        timestamp: Date.now()
      });
      
      console.log('💕 Anniversary Core initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Anniversary Core:', error);
      this.handleInitializationError(error);
    }
  }

  async waitForCoreSystems() {
    const maxWait = 10000; // 10 seconds
    const startTime = Date.now();
    
    while (!window.dataManager || !window.audioSystem || !window.animationSystem) {
      if (Date.now() - startTime > maxWait) {
        throw new Error('Core systems failed to load within timeout period');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  initializeCoreSystems() {
    this.dataManager = window.dataManager;
    this.audioSystem = window.audioSystem;
    this.animationSystem = window.animationSystem;
    this.performanceUtils = window.performanceUtils || window.UnifiedPerformanceUtils;
    
    // Set up cross-system communication
    this.setupSystemCommunication();
  }

  setupSystemCommunication() {
    // Allow systems to communicate through core
    this.state.subscribe('audio:volume', (volume) => {
      this.audioSystem?.setVolume?.(volume);
    });
    
    this.state.subscribe('animation:enabled', (enabled) => {
      this.animationSystem?.toggleAnimations?.(enabled);
    });
    
    this.state.subscribe('theme:changed', (theme) => {
      this.handleThemeChange(theme);
    });
  }

  setupGlobalEvents() {
    // Performance monitoring
    this.setupPerformanceMonitoring();
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Touch gestures for mobile
    this.setupTouchGestures();
    
    // Visibility change handling
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
    
    // Window resize handling
    window.addEventListener('resize', this.performanceUtils?.throttle(() => {
      this.handleResize();
    }, 250) || (() => this.handleResize()));
  }

  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.state.setState('performance:lcp', entry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = entry.processingStart - entry.startTime;
          this.state.setState('performance:fid', fid);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Space: Play/Pause audio
      if (event.code === 'Space' && !this.isInputFocused()) {
        event.preventDefault();
        this.audioSystem?.togglePlayback?.();
      }
      
      // Arrow keys: Navigate
      if (event.code === 'ArrowLeft' && event.ctrlKey) {
        event.preventDefault();
        this.router?.navigateBack?.();
      }
      
      if (event.code === 'ArrowRight' && event.ctrlKey) {
        event.preventDefault();
        this.router?.navigateForward?.();
      }
      
      // Escape: Close modals
      if (event.code === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Swipe detection
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
    }, { passive: true });
  }

  setupRoutes() {
    const routes = [
      { path: '/', handler: () => this.loadPage('home') },
      { path: '/countdown', handler: () => this.loadPage('countdown') },
      { path: '/anniversary', handler: () => this.loadPage('anniversary') },
      { path: '/love-story', handler: () => this.loadPage('love-story') },
      { path: '/photo-gallery', handler: () => this.loadPage('photo-gallery') },
      { path: '/music-playlist', handler: () => this.loadPage('music-playlist') },
      { path: '/memory-book', handler: () => this.loadPage('memory-book') },
      { path: '/special-dates', handler: () => this.loadPage('special-dates') },
      { path: '/future-plans', handler: () => this.loadPage('future-plans') },
      { path: '/love-letters', handler: () => this.loadPage('love-letters') },
      { path: '/challenges', handler: () => this.loadPage('challenges') },
      { path: '/wish-list', handler: () => this.loadPage('wish-list') },
      { path: '/fireworks', handler: () => this.loadPage('fireworks') },
      { path: '/settings', handler: () => this.loadPage('settings') }
    ];
    
    routes.forEach(route => {
      this.router.addRoute(route.path, route.handler);
    });
  }

  async loadPage(pageName) {
    try {
      // Show loading state
      this.showPageLoader();
      
      // Clean up current page
      this.cleanupCurrentPage();
      
      // Get main content container
      const mainContent = document.getElementById('main-content');
      if (!mainContent) {
        throw new Error('Main content container not found');
      }
      
      // Try to load vanilla JavaScript version first
      try {
        const { default: VanillaPage } = await import(`../pages/vanilla/${pageName}.js`);
        const pageInstance = new VanillaPage();
        
        // Initialize the page with the container
        await pageInstance.init(mainContent);
        this.currentPage = pageInstance;
        
        console.log(`✅ Loaded vanilla JavaScript page: ${pageName}`);
      } catch (vanillaError) {
        // Fallback to React version if vanilla doesn't exist
        console.log(`Vanilla page not found for ${pageName}, using React fallback`);
        await this.loadReactPage(pageName);
      }
      
      // Hide loading state
      this.hidePageLoader();
      
      // Update navigation
      this.updateNavigationState(pageName);
      
      // Track page view
      this.trackPageView(pageName);
      
    } catch (error) {
      console.error(`Failed to load page: ${pageName}`, error);
      this.showErrorPage(error);
    }
  }

  async loadReactPage(pageName) {
    // Fallback to React implementation
    const reactPageMap = {
      'home': () => import('../pages/react/HomePage'),
      'countdown': () => import('../pages/react/CountdownPage'),
      'anniversary': () => import('../pages/react/AnniversaryPage'),
      'love-story': () => import('../pages/react/LoveStoryPage'),
      'photo-gallery': () => import('../pages/react/PhotoGalleryPage'),
      'music-playlist': () => import('../pages/react/MusicPlaylistPage'),
      'memory-book': () => import('../pages/react/MemoryBookPage'),
      'special-dates': () => import('../pages/react/SpecialDatesPage'),
      'future-plans': () => import('../pages/react/FuturePlansPage'),
      'love-letters': () => import('../pages/react/LoveLettersPage'),
      'challenges': () => import('../pages/react/ChallengesPage'),
      'wish-list': () => import('../pages/react/WishListPage'),
      'fireworks': () => import('../pages/react/FireworksPage'),
      'settings': () => import('../pages/react/SettingsPage')
    };
    
    const loader = reactPageMap[pageName];
    if (loader) {
      const { default: ReactComponent } = await loader();
      // Mount React component using ReactDOM.render or portal
      this.mountReactComponent(ReactComponent);
    }
  }

  mountReactComponent(Component) {
    // This would use ReactDOM.render for the specific component
    // For now, we'll let the existing React router handle this
    console.log('Mounting React component:', Component.name);
  }

  cleanupCurrentPage() {
    if (this.currentPage && typeof this.currentPage.destroy === 'function') {
      this.currentPage.destroy();
    }
    
    // Clear any active intervals or timeouts
    this.clearPageTimers();
    
    // Remove page-specific event listeners
    this.removePageEventListeners();
  }

  clearPageTimers() {
    // Implementation for clearing timers
    if (this.pageTimers) {
      this.pageTimers.forEach(timer => clearInterval(timer));
      this.pageTimers.clear();
    }
  }

  removePageEventListeners() {
    // Implementation for removing event listeners
    if (this.pageEventListeners) {
      this.pageEventListeners.forEach((listener, element) => {
        element.removeEventListener(listener.event, listener.handler);
      });
      this.pageEventListeners.clear();
    }
  }

  showPageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.display = 'flex';
      loader.style.opacity = '1';
    }
  }

  hidePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }
  }

  updateNavigationState(pageName) {
    // Update active navigation item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }
  }

  trackPageView(pageName) {
    // Track page views for analytics
    this.state.setState('analytics:pageView', {
      page: pageName,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
  }

  showErrorPage(error) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="error-page">
          <div class="error-content">
            <h1>💔 Oops! Something went wrong</h1>
            <p>Don't worry, our love story continues!</p>
            <button class="love-action-primary" onclick="window.location.reload()">
              Try Again
            </button>
          </div>
        </div>
      `;
    }
  }

  handleThemeChange(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.animationSystem?.updateTheme?.(theme);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden - pause animations, reduce timers
      this.animationSystem?.pause?.();
      this.audioSystem?.fadeOut?.();
    } else {
      // Page is visible - resume operations
      this.animationSystem?.resume?.();
      this.audioSystem?.fadeIn?.();
    }
  }

  handleResize() {
    // Update responsive components
    this.components.forEach(component => {
      if (typeof component.handleResize === 'function') {
        component.handleResize();
      }
    });
    
    // Update layout
    this.updateResponsiveLayout();
  }

  updateResponsiveLayout() {
    const width = window.innerWidth;
    const breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1440
    };
    
    let currentBreakpoint = 'desktop';
    if (width < breakpoints.mobile) {
      currentBreakpoint = 'mobile';
    } else if (width < breakpoints.tablet) {
      currentBreakpoint = 'tablet';
    }
    
    document.body.setAttribute('data-breakpoint', currentBreakpoint);
    this.state.setState('responsive:breakpoint', currentBreakpoint);
  }

  handleSwipeLeft() {
    // Navigate to next page or close sidebar
    this.router?.navigateNext?.();
  }

  handleSwipeRight() {
    // Navigate to previous page or open sidebar
    this.router?.navigatePrevious?.();
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  handleInitializationError(error) {
    // Show fallback UI
    document.body.innerHTML = `
      <div class="initialization-error">
        <h1>💔 Failed to Load</h1>
        <p>There was an issue loading the Anniversary Website.</p>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>
    `;
  }

  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  // Public API methods
  registerComponent(name, component) {
    this.components.set(name, component);
  }

  getComponent(name) {
    return this.components.get(name);
  }

  getState() {
    return this.state;
  }

  destroy() {
    // Cleanup all components
    this.components.forEach(component => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // Clear state
    this.state.destroy?.();
    
    // Remove global event listeners
    this.removeGlobalEventListeners();
  }

  removeGlobalEventListeners() {
    // Implementation for cleanup
    this.eventListeners.forEach((listener, element) => {
      element.removeEventListener(listener.event, listener.handler);
    });
    this.eventListeners.clear();
  }
}

// Make AnniversaryCore globally available
window.AnniversaryCore = AnniversaryCore;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.anniversaryCore = new AnniversaryCore();
  });
} else {
  window.anniversaryCore = new AnniversaryCore();
}

export default AnniversaryCore;
