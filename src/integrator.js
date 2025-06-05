// Enhanced integration logic and removed unused imports
import { PhotoGalleryManager } from './components/PhotoGalleryManager.js';
import { HeartAnimationSystem } from './components/HeartAnimationSystem.js';
import { PerformanceMonitor } from './core/PerformanceMonitor.js';
import { BackgroundEffectsManager } from './components/BackgroundEffectsManager.js';
import { LazyLoader } from './utils/lazyLoader.js';

class AnniversaryWebsiteIntegrator {
  constructor() {
    this.components = new Map();
    this.performanceMonitor = null;
    this.lazyLoader = null;
    this.initialized = false;
    this.frameRate = 90; // Target 90fps
    this.lastFrameTime = 0;

    console.log('🎉 Anniversary Website Integrator loaded - Target: 90fps');
  }

  async init() {
    if (this.initialized) return;

    try {
      console.log('🚀 Initializing Anniversary Website Integration for 90fps...');

      this.enableHighPerformanceMode();

      this.performanceMonitor = new PerformanceMonitor({
        targetFPS: 90,
        enableGPUAcceleration: true,
        optimizeAnimations: true,
      });
      this.performanceMonitor.init();

      this.lazyLoader = new LazyLoader({
        rootMargin: '50px',
        enableWebP: true,
        enablePlaceholder: true,
        preloadStrategy: 'aggressive',
      });

      await this.initializeBackgroundComponents();
      await this.initializePageComponents();

      this.setupOptimizedListeners();
      this.setupOptimizedThemeSystem();
    } catch (error) {
      console.error('Failed to initialize integrator:', error);
    }
  }

  destroy() {
    console.log('🛑 Destroying Anniversary Website Integrator');
    this.components.clear();
    this.performanceMonitor = null;
    this.lazyLoader = null;
    this.initialized = false;
  }
}

export { AnniversaryWebsiteIntegrator };