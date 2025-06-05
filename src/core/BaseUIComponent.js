/**
 * Base UI Component - Foundation for all UI components
 * Provides common UI functionality, event handling, and lifecycle management
 */

import { BaseManager } from './BaseManager.js';

class BaseUIComponent extends BaseManager {
  constructor(options = {}) {
    super(options);
    
    this.element = null;
    this.container = options.container || null;
    this.template = options.template || this.getDefaultTemplate();
    this.cssClasses = {
      ...this.getDefaultCssClasses(),
      ...options.cssClasses
    };
  }

  /**
   * Default configuration for UI components
   */
  getDefaultConfig() {
    return {
      ...super.getDefaultConfig(),
      enableResponsive: true,
      enableAccessibility: true,
      enableAnimations: true,
      renderOnInit: true
    };
  }

  /**
   * Default CSS classes
   */
  getDefaultCssClasses() {
    return {
      component: 'ui-component',
      container: 'ui-container',
      loading: 'ui-loading',
      error: 'ui-error',
      hidden: 'ui-hidden'
    };
  }

  /**
   * Default template - to be overridden by subclasses
   */
  getDefaultTemplate() {
    return '<div class="ui-component">Component content</div>';
  }

  /**
   * Main initialization for UI components
   */
  async doInit() {
    await this.setupContainer();
    
    if (this.config.renderOnInit) {
      await this.render();
    }
    
    this.setupEventListeners();
    this.setupAccessibility();
    this.setupResponsiveDesign();
  }

  /**
   * Setup container element
   */
  async setupContainer() {
    if (!this.container) {
      this.container = document.body;
    }
    
    if (typeof this.container === 'string') {
      this.container = document.querySelector(this.container);
    }
    
    if (!this.container) {
      throw new Error('Container element not found');
    }
  }

  /**
   * Render the component
   */
  async render() {
    try {
      this.element = this.createElement();
      this.container.appendChild(this.element);
      
      await this.afterRender();
      this.emit('rendered', this.element);
    } catch (error) {
      this.handleError('Render failed', error);
      this.showError();
    }
  }

  /**
   * Create element from template
   */
  createElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template.trim();
    const element = wrapper.firstChild;
    
    // Add CSS classes
    element.classList.add(this.cssClasses.component);
    
    return element;
  }

  /**
   * Post-render hook
   */
  async afterRender() {
    // Override in subclasses
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.element) return;
    
    // Mobile touch events
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  /**
   * Touch event handlers for mobile compatibility
   */
  handleTouchStart(event) {
    this.emit('touchStart', event);
  }

  handleTouchMove(event) {
    this.emit('touchMove', event);
  }

  handleTouchEnd(event) {
    this.emit('touchEnd', event);
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    if (!this.config.enableAccessibility || !this.element) return;
    
    // Add ARIA attributes
    if (!this.element.hasAttribute('role')) {
      this.element.setAttribute('role', 'region');
    }
    
    // Add keyboard navigation
    if (!this.element.hasAttribute('tabindex')) {
      this.element.setAttribute('tabindex', '0');
    }
    
    // Add focus handling
    this.element.addEventListener('focus', this.handleFocus.bind(this));
    this.element.addEventListener('blur', this.handleBlur.bind(this));
  }

  /**
   * Focus event handlers
   */
  handleFocus(event) {
    this.element.classList.add('focused');
    this.emit('focus', event);
  }

  handleBlur(event) {
    this.element.classList.remove('focused');
    this.emit('blur', event);
  }

  /**
   * Setup responsive design
   */
  setupResponsiveDesign() {
    if (!this.config.enableResponsive) return;
    
    // Add responsive classes based on viewport
    this.updateResponsiveClasses();
    
    // Listen for viewport changes
    window.addEventListener('resize', this.throttle(this.updateResponsiveClasses.bind(this), 250));
  }

  /**
   * Update responsive CSS classes
   */
  updateResponsiveClasses() {
    if (!this.element) return;
    
    const viewport = this.getViewportSize();
    
    // Remove existing responsive classes
    this.element.classList.remove('mobile', 'tablet', 'desktop');
    
    // Add appropriate class
    if (viewport.width <= 768) {
      this.element.classList.add('mobile');
    } else if (viewport.width <= 1024) {
      this.element.classList.add('tablet');
    } else {
      this.element.classList.add('desktop');
    }
  }

  /**
   * Get viewport size
   */
  getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (this.element) {
      this.element.classList.add(this.cssClasses.loading);
      this.emit('loadingStart');
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    if (this.element) {
      this.element.classList.remove(this.cssClasses.loading);
      this.emit('loadingEnd');
    }
  }

  /**
   * Show error state
   */
  showError(message = 'An error occurred') {
    if (this.element) {
      this.element.classList.add(this.cssClasses.error);
      this.element.innerHTML = `<div class="error-message">${message}</div>`;
      this.emit('errorShown', message);
    }
  }

  /**
   * Hide component
   */
  hide() {
    if (this.element) {
      this.element.classList.add(this.cssClasses.hidden);
      this.emit('hidden');
    }
  }

  /**
   * Show component
   */
  show() {
    if (this.element) {
      this.element.classList.remove(this.cssClasses.hidden);
      this.emit('shown');
    }
  }

  /**
   * Update component content
   */
  update(newContent) {
    if (this.element && newContent) {
      this.element.innerHTML = newContent;
      this.emit('updated', newContent);
    }
  }

  /**
   * Destroy UI component
   */
  onDestroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.updateResponsiveClasses);
    
    super.onDestroy();
  }
}

export { BaseUIComponent };
