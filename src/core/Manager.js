/**
 * Base Manager Class - Foundation for all manager classes
 * Provides common functionality, event handling, and lifecycle management
 */

import globalConfig from '../config/globalConfig.js';

class Manager {
  constructor(options = {}) {
    this.config = {
      ...this.getDefaultConfig(),
      ...options
    };
    
    this.state = {
      isInitialized: false,
      isDestroyed: false,
      ...this.getDefaultState()
    };
    
    this.events = new Map();
    this.boundHandlers = {};
    this.performance = {
      startTime: Date.now(),
      metrics: {
        initTime: 0,
        operations: 0,
        errors: 0
      }
    };
    
    // Auto-bind common handlers
    this.bindHandlers();
  }

  /**
   * Default configuration - to be overridden by subclasses
   */
  getDefaultConfig() {
    return {
      storagePrefix: globalConfig.siteName,
      enablePerformanceMonitoring: true,
      enableErrorHandling: true,
      enableEventEmission: true
    };
  }

  /**
   * Default state - to be overridden by subclasses
   */
  getDefaultState() {
    return {};
  }

  /**
   * Bind common event handlers
   */
  bindHandlers() {
    this.boundHandlers = {
      onError: this.onError.bind(this),
      onDestroy: this.onDestroy.bind(this),
      ...this.getCustomHandlers()
    };
  }

  /**
   * Get custom handlers - to be overridden by subclasses
   */
  getCustomHandlers() {
    return {};
  }

  /**
   * Initialize the manager
   */
  async init() {
    if (this.state.isInitialized) return;

    try {
      const initStart = performance.now();
      
      await this.beforeInit();
      await this.doInit();
      await this.afterInit();
      
      this.state.isInitialized = true;
      this.performance.metrics.initTime = performance.now() - initStart;
      
      this.emit('initialized', this);
      console.log(`✅ ${this.constructor.name} initialized in ${this.performance.metrics.initTime.toFixed(2)}ms`);
    } catch (error) {
      this.handleError('Initialization failed', error);
      throw error;
    }
  }

  /**
   * Pre-initialization hook
   */
  async beforeInit() {
    // Override in subclasses
  }

  /**
   * Main initialization logic - to be implemented by subclasses
   */
  async doInit() {
    throw new Error('doInit must be implemented by subclass');
  }

  /**
   * Post-initialization hook
   */
  async afterInit() {
    // Override in subclasses
  }

  /**
   * Event emission
   */
  emit(eventName, data) {
    if (!this.config.enableEventEmission) return;
    
    const handlers = this.events.get(eventName) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        this.handleError(`Event handler error for ${eventName}`, error);
      }
    });
  }

  /**
   * Event subscription
   */
  on(eventName, handler) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(handler);
  }

  /**
   * Event unsubscription
   */
  off(eventName, handler) {
    const handlers = this.events.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Error handling
   */
  handleError(message, error) {
    this.performance.metrics.errors++;
    
    if (this.config.enableErrorHandling) {
      console.error(`${this.constructor.name}: ${message}`, error);
      this.emit('error', { message, error });
    }
  }

  /**
   * Error event handler
   */
  onError(data) {
    // Override in subclasses for custom error handling
  }

  /**
   * Performance monitoring
   */
  trackOperation(operationName, operation) {
    if (!this.config.enablePerformanceMonitoring) {
      return operation();
    }

    const start = performance.now();
    try {
      const result = operation();
      this.performance.metrics.operations++;
      const duration = performance.now() - start;
      
      if (duration > 100) { // Log slow operations
        console.warn(`Slow operation ${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      this.handleError(`Operation ${operationName} failed`, error);
      throw error;
    }
  }

  /**
   * Throttle utility
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Debounce utility
   */
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Destroy handler
   */
  onDestroy() {
    // Override in subclasses
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    if (this.state.isDestroyed) return;

    try {
      this.onDestroy();
      this.events.clear();
      this.state.isDestroyed = true;
      
      console.log(`🗑️ ${this.constructor.name} destroyed`);
    } catch (error) {
      this.handleError('Destruction failed', error);
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.performance.metrics,
      uptime: Date.now() - this.performance.startTime,
      className: this.constructor.name
    };
  }
}

export { Manager };
export default Manager;
