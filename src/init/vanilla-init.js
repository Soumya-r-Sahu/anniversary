/**
 * Vanilla JavaScript Initialization Script - Anniversary Website v4.0.0
 * Bootstrap script for JavaScript-first architecture
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    enableVanillaFirst: true,
    fallbackToReact: true,
    debugMode: process.env.NODE_ENV === 'development',
    coreSystemTimeout: 10000
  };

  // Core systems loading status
  const coreSystemsStatus = {
    dataManager: false,
    audioSystem: false,
    animationSystem: false,
    performanceUtils: false,
    stateManager: false,
    router: false,
    core: false
  };

  // Initialize vanilla JavaScript systems
  async function initVanillaSystems() {
    try {
      console.log('🚀 Initializing Vanilla JavaScript Systems...');

      // Load core dependencies first
      await loadCoreDependencies();

      // Initialize state manager
      await initializeStateManager();

      // Initialize router
      await initializeRouter();

      // Initialize core system
      await initializeCore();

      // Set up global error handling
      setupGlobalErrorHandling();

      // Set up performance monitoring
      setupPerformanceMonitoring();

      // Mark systems as ready
      markSystemsReady();

      console.log('✅ Vanilla JavaScript Systems initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Vanilla JavaScript Systems:', error);
      
      if (config.fallbackToReact) {
        console.log('🔄 Falling back to React mode...');
        initializeReactFallback();
      }
    }
  }

  async function loadCoreDependencies() {
    const dependencies = [
      '/src/core/StateManager.js',
      '/src/core/VanillaRouter.js',
      '/src/core/VanillaCore.js',
      '/src/components/vanilla/VanillaTimeCalculator.js',
      '/src/pages/vanilla/home.js'
    ];

    for (const dep of dependencies) {
      try {
        await loadScript(dep);
        if (config.debugMode) {
          console.log(`✅ Loaded: ${dep}`);
        }
      } catch (error) {
        console.error(`❌ Failed to load: ${dep}`, error);
        throw error;
      }
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function initializeStateManager() {
    if (typeof window.StateManager === 'undefined') {
      throw new Error('StateManager not available');
    }

    // Create global state manager
    window.globalState = new window.StateManager({
      // Initial state
      'app:version': '4.0.0',
      'app:mode': 'vanilla',
      'app:initialized': false,
      'theme:current': 'dark',
      'audio:enabled': true,
      'audio:volume': 0.7,
      'animations:enabled': true,
      'user:preferences': {}
    });

    // Add useful middlewares
    window.globalState.addMiddleware(window.StateManager.middlewares.logger);
    window.globalState.addMiddleware(window.StateManager.middlewares.autoPersist);

    // Try to restore saved state
    window.globalState.restore();

    coreSystemsStatus.stateManager = true;
    console.log('✅ State Manager initialized');
  }

  async function initializeRouter() {
    if (typeof window.VanillaRouter === 'undefined') {
      throw new Error('VanillaRouter not available');
    }

    // Create global router
    window.anniversaryRouter = new window.VanillaRouter({
      hashMode: true,
      animateTransitions: true,
      scrollToTop: true
    });

    // Add global middlewares
    window.anniversaryRouter.addMiddleware(window.VanillaRouter.middleware.loading);
    window.anniversaryRouter.addMiddleware(window.VanillaRouter.middleware.analytics);
    window.anniversaryRouter.addMiddleware(window.VanillaRouter.middleware.meta);

    coreSystemsStatus.router = true;
    console.log('✅ Router initialized');
  }

  async function initializeCore() {
    // Wait for existing core systems to be available
    await waitForCoreSystems();

    if (typeof window.AnniversaryCore === 'undefined') {
      throw new Error('AnniversaryCore not available');
    }

    // The core will auto-initialize when available
    // Just wait for it to be ready
    await waitForCoreReady();

    coreSystemsStatus.core = true;
    console.log('✅ Anniversary Core initialized');
  }

  async function waitForCoreSystems() {
    const maxWait = config.coreSystemTimeout;
    const startTime = Date.now();

    while (!window.dataManager || !window.audioSystem || !window.animationSystem) {
      if (Date.now() - startTime > maxWait) {
        throw new Error('Core systems failed to load within timeout period');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    coreSystemsStatus.dataManager = true;
    coreSystemsStatus.audioSystem = true;
    coreSystemsStatus.animationSystem = true;
    coreSystemsStatus.performanceUtils = true;
  }

  async function waitForCoreReady() {
    const maxWait = 5000;
    const startTime = Date.now();

    while (!window.anniversaryCore || !window.anniversaryCore.isInitialized) {
      if (Date.now() - startTime > maxWait) {
        throw new Error('Anniversary Core failed to initialize within timeout period');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  function setupGlobalErrorHandling() {
    // Global error handler for unhandled errors
    window.addEventListener('error', (event) => {
      console.error('Global Error:', event.error);
      
      // Track error in state
      if (window.globalState) {
        window.globalState.setState('error:last', {
          message: event.error.message,
          stack: event.error.stack,
          timestamp: Date.now()
        });
      }
      
      // Show user-friendly error message
      showErrorNotification('An unexpected error occurred. Please refresh the page.');
    });

    // Global promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      // Track error in state
      if (window.globalState) {
        window.globalState.setState('error:promise', {
          reason: event.reason,
          timestamp: Date.now()
        });
      }
    });
  }

  function setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (window.globalState) {
            window.globalState.setState(`performance:${entry.entryType}`, {
              value: entry.value || entry.startTime,
              timestamp: Date.now()
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'cumulative-layout-shift'] });
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        if (window.globalState) {
          window.globalState.setState('performance:memory', {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit,
            timestamp: Date.now()
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  function markSystemsReady() {
    // Update state
    if (window.globalState) {
      window.globalState.setState('app:initialized', true);
      window.globalState.setState('app:initTime', Date.now());
    }

    // Dispatch ready event
    const readyEvent = new CustomEvent('anniversary:vanilla-ready', {
      detail: {
        version: '4.0.0',
        mode: 'vanilla',
        systems: coreSystemsStatus,
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(readyEvent);

    // Show success notification
    if (config.debugMode) {
      showSuccessNotification('Vanilla JavaScript mode activated! 🚀');
    }
  }

  function initializeReactFallback() {
    // Set fallback mode
    if (window.globalState) {
      window.globalState.setState('app:mode', 'react-fallback');
    }

    // Let React take over
    console.log('React mode will handle initialization');
    
    // Dispatch fallback event
    const fallbackEvent = new CustomEvent('anniversary:react-fallback', {
      detail: {
        reason: 'Vanilla initialization failed',
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(fallbackEvent);
  }

  function showErrorNotification(message) {
    // Simple error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent-1, #8B2635);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  function showSuccessNotification(message) {
    // Simple success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--glow-romantic, #FF7B8A);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Enhanced page loader
  function createPageLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-base, #1A0D1F);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 1;
      transition: opacity 0.3s ease;
    `;
    
    loader.innerHTML = `
      <div class="loader-content" style="text-align: center; color: var(--text-primary, #FFF8F6);">
        <div class="loader-hearts" style="font-size: 3rem; margin-bottom: 1rem;">
          <span style="animation: heartbeat 1s infinite;">💕</span>
        </div>
        <h2 style="margin-bottom: 0.5rem; font-family: 'Dancing Script', cursive;">Loading Our Love Story...</h2>
        <p style="color: var(--text-secondary, #D4C4D8);">JavaScript-First Mode</p>
        <div class="progress-bar" style="width: 200px; height: 4px; background: rgba(255, 255, 255, 0.2); border-radius: 2px; margin: 1rem auto; overflow: hidden;">
          <div class="progress-fill" style="width: 0%; height: 100%; background: var(--gradient-romantic, linear-gradient(135deg, #8B2635, #FF7B8A)); transition: width 0.3s ease; animation: loadingProgress 2s ease-in-out infinite;"></div>
        </div>
      </div>
      
      <style>
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes loadingProgress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      </style>
    `;
    
    document.body.appendChild(loader);
    return loader;
  }

  // Initialization sequence
  function startInitialization() {
    // Show loading screen
    const loader = createPageLoader();

    // Check if vanilla mode is enabled
    if (!config.enableVanillaFirst) {
      console.log('Vanilla mode disabled, using React');
      loader.remove();
      return;
    }

    // Start vanilla initialization
    initVanillaSystems()
      .then(() => {
        // Hide loader after successful initialization
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.remove();
          }, 300);
        }, 1000); // Show loader for at least 1 second
      })
      .catch((error) => {
        console.error('Vanilla initialization failed:', error);
        loader.remove();
      });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInitialization);
  } else {
    startInitialization();
  }

  // Export debug utilities to global scope
  if (config.debugMode) {
    window.anniversaryDebug = {
      config,
      coreSystemsStatus,
      showErrorNotification,
      showSuccessNotification,
      reloadVanillaSystems: () => {
        location.reload();
      }
    };
  }

})();
