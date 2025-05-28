/**
 * Unified Performance Monitor - Comprehensive performance tracking and optimization
 * Monitors and optimizes website performance across all components
 * Version: 2.0.0
 */

class UnifiedPerformanceMonitor {
  constructor(options = {}) {
    // Core configuration
    this.config = {
      enableMonitoring: options.enableMonitoring !== false,
      enableOptimization: options.enableOptimization !== false,
      enableLogging: options.enableLogging !== false,
      logInterval: options.logInterval || 30000, // 30 seconds
      performanceThresholds: {
        fps: options.minFPS || 30,
        memoryUsage: options.maxMemoryMB || 100,
        domNodes: options.maxDOMNodes || 1000,
        loadTime: options.maxLoadTimeMS || 3000,
        ...options.performanceThresholds,
      },
      optimizations: {
        autoReduceAnimations: options.autoReduceAnimations !== false,
        autoReduceParticles: options.autoReduceParticles !== false,
        autoReduceEffects: options.autoReduceEffects !== false,
        autoCleanupDOM: options.autoCleanupDOM !== false,
        ...options.optimizations,
      },
      ...options,
    };

    // Performance metrics
    this.metrics = {
      // Core Web Vitals
      fcp: 0, // First Contentful Paint
      lcp: 0, // Largest Contentful Paint
      fid: 0, // First Input Delay
      cls: 0, // Cumulative Layout Shift

      // Custom metrics
      fps: 0,
      averageFPS: 0,
      frameTime: 0,
      memoryUsage: 0,
      domNodes: 0,
      eventListeners: 0,

      // Performance counters
      frameCount: 0,
      totalFrameTime: 0,
      lastFrameTime: 0,

      // Component metrics
      musicManager: { cpu: 0, memory: 0 },
      heartAnimation: { cpu: 0, memory: 0 },
      particles: { cpu: 0, memory: 0 },
      gallery: { cpu: 0, memory: 0 },
    };

    // Performance state
    this.state = {
      isMonitoring: false,
      performanceMode: "auto", // 'high', 'medium', 'low', 'auto'
      isLowPowerDevice: this.detectLowPowerDevice(),
      isSlowConnection: this.detectSlowConnection(),
      batteryLevel: null,
      thermalState: null,
    };

    // Monitoring intervals
    this.intervals = {
      frameMonitor: null,
      metricsLogger: null,
      optimizationCheck: null,
    };

    // Performance observers
    this.observers = {
      performance: null,
      mutation: null,
      intersection: null,
    };

    // Component references for optimization
    this.components = {
      musicManager: null,
      heartAnimation: null,
      particles: null,
      gallery: null,
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    try {
      if (!this.config.enableMonitoring) return;

      // Setup device capability detection
      this.detectDeviceCapabilities();

      // Setup performance observers
      this.setupPerformanceObservers();

      // Setup frame monitoring
      this.setupFrameMonitoring();

      // Setup metric logging
      this.setupMetricLogging();

      // Setup optimization checks
      this.setupOptimizationChecks();

      // Setup battery and thermal monitoring
      this.setupBatteryMonitoring();

      // Start monitoring
      this.start();

      console.log("📊 Unified Performance Monitor initialized");
    } catch (error) {
      console.error("Failed to initialize performance monitor:", error);
    }
  }

  /**
   * Detect device capabilities
   */
  detectDeviceCapabilities() {
    // Hardware concurrency
    const cores = navigator.hardwareConcurrency || 1;

    // Device memory
    const memory = navigator.deviceMemory || 1;

    // Connection quality
    const connection = navigator.connection;

    // User agent analysis
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    // Determine performance mode
    if (cores <= 2 || memory <= 2 || isMobile) {
      this.state.performanceMode = "low";
    } else if (cores <= 4 || memory <= 4) {
      this.state.performanceMode = "medium";
    } else {
      this.state.performanceMode = "high";
    }

    console.log("📊 Device capabilities:", {
      cores,
      memory: memory + "GB",
      mode: this.state.performanceMode,
      mobile: isMobile,
      connection: connection?.effectiveType || "unknown",
    });
  }

  /**
   * Setup performance observers
   */
  setupPerformanceObservers() {
    // Performance Observer for Core Web Vitals
    if ("PerformanceObserver" in window) {
      try {
        this.observers.performance = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processPerformanceEntry(entry);
          }
        });

        // Observe various performance metrics
        this.observers.performance.observe({
          entryTypes: ["navigation", "paint", "layout-shift", "first-input"],
        });
      } catch (error) {
        console.warn("Performance Observer not supported:", error);
      }
    }

    // Mutation Observer for DOM changes
    if ("MutationObserver" in window) {
      this.observers.mutation = new MutationObserver((mutations) => {
        this.processDOMMutations(mutations);
      });

      this.observers.mutation.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: ["class", "style"],
      });
    }
  }

  /**
   * Setup frame monitoring
   */
  setupFrameMonitoring() {
    const frameMonitor = () => {
      const currentTime = performance.now();

      if (this.metrics.lastFrameTime > 0) {
        const frameTime = currentTime - this.metrics.lastFrameTime;
        this.metrics.frameTime = frameTime;
        this.metrics.totalFrameTime += frameTime;
        this.metrics.frameCount++;

        // Calculate FPS
        this.metrics.fps = 1000 / frameTime;
        this.metrics.averageFPS =
          this.metrics.frameCount / (currentTime / 1000);

        // Check for performance issues
        if (frameTime > 33.33) {
          // Below 30 FPS
          this.handlePerformanceIssue("low_fps", {
            fps: this.metrics.fps,
            frameTime,
          });
        }
      }

      this.metrics.lastFrameTime = currentTime;

      if (this.state.isMonitoring) {
        this.intervals.frameMonitor = requestAnimationFrame(frameMonitor);
      }
    };

    frameMonitor();
  }

  /**
   * Setup metric logging
   */
  setupMetricLogging() {
    if (!this.config.enableLogging) return;

    this.intervals.metricsLogger = setInterval(() => {
      this.collectMetrics();
      this.logMetrics();
    }, this.config.logInterval);
  }

  /**
   * Setup optimization checks
   */
  setupOptimizationChecks() {
    if (!this.config.enableOptimization) return;

    this.intervals.optimizationCheck = setInterval(() => {
      this.checkAndOptimize();
    }, 10000); // Check every 10 seconds
  }

  /**
   * Setup battery and thermal monitoring
   */
  setupBatteryMonitoring() {
    // Battery API
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        this.state.batteryLevel = battery.level;

        battery.addEventListener("levelchange", () => {
          this.state.batteryLevel = battery.level;
          this.adaptToLowBattery();
        });

        battery.addEventListener("chargingchange", () => {
          this.adaptToLowBattery();
        });
      });
    }

    // Thermal API (experimental)
    if ("thermal" in navigator) {
      navigator.thermal.addEventListener("change", (event) => {
        this.state.thermalState = event.state;
        this.adaptToThermalState();
      });
    }
  }

  /**
   * Start monitoring
   */
  start() {
    this.state.isMonitoring = true;
    console.log("📊 Performance monitoring started");
  }

  /**
   * Stop monitoring
   */
  stop() {
    this.state.isMonitoring = false;

    // Clear intervals
    if (this.intervals.frameMonitor) {
      cancelAnimationFrame(this.intervals.frameMonitor);
    }

    if (this.intervals.metricsLogger) {
      clearInterval(this.intervals.metricsLogger);
    }

    if (this.intervals.optimizationCheck) {
      clearInterval(this.intervals.optimizationCheck);
    }

    console.log("📊 Performance monitoring stopped");
  }

  /**
   * Process performance entries
   */
  processPerformanceEntry(entry) {
    switch (entry.entryType) {
      case "navigation":
        this.processNavigationEntry(entry);
        break;
      case "paint":
        this.processPaintEntry(entry);
        break;
      case "layout-shift":
        this.processLayoutShiftEntry(entry);
        break;
      case "first-input":
        this.processFirstInputEntry(entry);
        break;
    }
  }

  /**
   * Process navigation timing
   */
  processNavigationEntry(entry) {
    this.metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;

    if (this.metrics.loadTime > this.config.performanceThresholds.loadTime) {
      this.handlePerformanceIssue("slow_load", {
        loadTime: this.metrics.loadTime,
      });
    }
  }

  /**
   * Process paint timing
   */
  processPaintEntry(entry) {
    if (entry.name === "first-contentful-paint") {
      this.metrics.fcp = entry.startTime;
    }
  }

  /**
   * Process layout shift
   */
  processLayoutShiftEntry(entry) {
    this.metrics.cls += entry.value;

    if (this.metrics.cls > 0.1) {
      // CLS threshold
      this.handlePerformanceIssue("layout_shift", { cls: this.metrics.cls });
    }
  }

  /**
   * Process first input delay
   */
  processFirstInputEntry(entry) {
    this.metrics.fid = entry.processingStart - entry.startTime;

    if (this.metrics.fid > 100) {
      // FID threshold
      this.handlePerformanceIssue("input_delay", { fid: this.metrics.fid });
    }
  }

  /**
   * Process DOM mutations
   */
  processDOMMutations(mutations) {
    let nodeChanges = 0;

    mutations.forEach((mutation) => {
      nodeChanges += mutation.addedNodes.length;
    });

    if (nodeChanges > 10) {
      // Significant DOM changes
      setTimeout(() => this.collectDOMMetrics(), 100);
    }
  }

  /**
   * Collect all metrics
   */
  collectMetrics() {
    this.collectMemoryMetrics();
    this.collectDOMMetrics();
    this.collectComponentMetrics();
  }

  /**
   * Collect memory metrics
   */
  collectMemoryMetrics() {
    if ("memory" in performance) {
      const memory = performance.memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // MB

      if (
        this.metrics.memoryUsage > this.config.performanceThresholds.memoryUsage
      ) {
        this.handlePerformanceIssue("high_memory", {
          memoryUsage: this.metrics.memoryUsage,
        });
      }
    }
  }

  /**
   * Collect DOM metrics
   */
  collectDOMMetrics() {
    this.metrics.domNodes = document.querySelectorAll("*").length;

    if (this.metrics.domNodes > this.config.performanceThresholds.domNodes) {
      this.handlePerformanceIssue("dom_bloat", {
        domNodes: this.metrics.domNodes,
      });
    }
  }

  /**
   * Collect component-specific metrics
   */
  collectComponentMetrics() {
    // Collect metrics from registered components
    Object.entries(this.components).forEach(([name, component]) => {
      if (component && typeof component.getPerformanceMetrics === "function") {
        this.metrics[name] = component.getPerformanceMetrics();
      }
    });
  }

  /**
   * Handle performance issues
   */
  handlePerformanceIssue(type, data) {
    console.warn(`⚠️ Performance issue detected: ${type}`, data);

    if (this.config.enableOptimization) {
      this.applyOptimization(type, data);
    }
  }

  /**
   * Apply optimization based on issue type
   */
  applyOptimization(type, data) {
    switch (type) {
      case "low_fps":
        this.optimizeForLowFPS();
        break;
      case "high_memory":
        this.optimizeForHighMemory();
        break;
      case "dom_bloat":
        this.optimizeForDOMBloat();
        break;
      case "slow_load":
        this.optimizeForSlowLoad();
        break;
    }
  }

  /**
   * Optimize for low FPS
   */
  optimizeForLowFPS() {
    if (this.config.optimizations.autoReduceAnimations) {
      this.reduceAnimations();
    }

    if (this.config.optimizations.autoReduceParticles) {
      this.reduceParticleCount();
    }

    if (this.config.optimizations.autoReduceEffects) {
      this.reduceEffects();
    }
  }

  /**
   * Optimize for high memory usage
   */
  optimizeForHighMemory() {
    // Force garbage collection (if available)
    if (window.gc) {
      window.gc();
    }

    // Cleanup components
    this.cleanupComponents();

    // Reduce cache sizes
    this.reduceCacheSizes();
  }

  /**
   * Optimize for DOM bloat
   */
  optimizeForDOMBloat() {
    if (this.config.optimizations.autoCleanupDOM) {
      this.cleanupUnusedDOM();
    }
  }

  /**
   * Reduce animations
   */
  reduceAnimations() {
    // Reduce heart animation frequency
    if (this.components.heartAnimation) {
      this.components.heartAnimation.updateConfig({
        animationSpeed: "slow",
        heartCount: Math.floor(
          this.components.heartAnimation.config.heartCount * 0.5,
        ),
      });
    }

    // Disable CSS animations for low-performance devices
    if (this.state.performanceMode === "low") {
      const style = document.createElement("style");
      style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
      document.head.appendChild(style);
    }
  }

  /**
   * Reduce particle count
   */
  reduceParticleCount() {
    if (this.components.particles) {
      const currentCount = this.components.particles.config.particleCount;
      const newCount = Math.max(10, Math.floor(currentCount * 0.6));
      this.components.particles.updateConfig({ particleCount: newCount });
    }
  }

  /**
   * Reduce visual effects
   */
  reduceEffects() {
    // Disable blur effects
    const blurElements = document.querySelectorAll('[style*="blur"]');
    blurElements.forEach((el) => {
      el.style.filter = "none";
    });

    // Reduce shadows
    const style = document.createElement("style");
    style.textContent = `
            .low-performance * {
                box-shadow: none !important;
                text-shadow: none !important;
            }
        `;
    document.head.appendChild(style);
    document.body.classList.add("low-performance");
  }

  /**
   * Cleanup components
   */
  cleanupComponents() {
    Object.values(this.components).forEach((component) => {
      if (component && typeof component.cleanup === "function") {
        component.cleanup();
      }
    });
  }

  /**
   * Reduce cache sizes
   */
  reduceCacheSizes() {
    if (window.storageManager) {
      window.storageManager.performance.readCache.clear();
    }
  }

  /**
   * Cleanup unused DOM elements
   */
  cleanupUnusedDOM() {
    // Remove hidden elements that are not needed
    const hiddenElements = document.querySelectorAll(
      '[style*="display: none"], .hidden',
    );
    hiddenElements.forEach((el) => {
      if (!el.dataset.keepHidden) {
        el.remove();
      }
    });

    // Clean up event listeners
    this.cleanupEventListeners();
  }

  /**
   * Cleanup event listeners
   */
  cleanupEventListeners() {
    // This is a placeholder - in practice, components should manage their own cleanup
    console.log("🧹 Cleaning up event listeners");
  }

  /**
   * Adapt to low battery
   */
  adaptToLowBattery() {
    if (this.state.batteryLevel && this.state.batteryLevel < 0.2) {
      console.log("🔋 Low battery detected, reducing performance");
      this.state.performanceMode = "low";
      this.optimizeForLowFPS();
    }
  }

  /**
   * Adapt to thermal state
   */
  adaptToThermalState() {
    if (this.state.thermalState === "critical") {
      console.log("🌡️ High temperature detected, reducing performance");
      this.state.performanceMode = "low";
      this.optimizeForLowFPS();
    }
  }

  /**
   * Register component for monitoring
   */
  registerComponent(name, component) {
    this.components[name] = component;
    console.log(`📊 Registered component: ${name}`);
  }

  /**
   * Unregister component
   */
  unregisterComponent(name) {
    delete this.components[name];
    console.log(`📊 Unregistered component: ${name}`);
  }

  /**
   * Log metrics
   */
  logMetrics() {
    if (!this.config.enableLogging) return;

    const summary = {
      fps: Math.round(this.metrics.averageFPS),
      memory: Math.round(this.metrics.memoryUsage) + "MB",
      domNodes: this.metrics.domNodes,
      mode: this.state.performanceMode,
      battery: this.state.batteryLevel
        ? Math.round(this.state.batteryLevel * 100) + "%"
        : "unknown",
    };

    console.log("📊 Performance Summary:", summary);
  }

  /**
   * Get performance report
   */
  getReport() {
    return {
      metrics: { ...this.metrics },
      state: { ...this.state },
      thresholds: this.config.performanceThresholds,
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.averageFPS < this.config.performanceThresholds.fps) {
      recommendations.push("Consider reducing animations or particle count");
    }

    if (
      this.metrics.memoryUsage > this.config.performanceThresholds.memoryUsage
    ) {
      recommendations.push(
        "Memory usage is high, consider cleanup optimizations",
      );
    }

    if (this.metrics.domNodes > this.config.performanceThresholds.domNodes) {
      recommendations.push("DOM is bloated, consider removing unused elements");
    }

    if (this.state.performanceMode === "low") {
      recommendations.push(
        "Device capabilities are limited, enable low-power mode",
      );
    }

    return recommendations;
  }

  /**
   * Utility functions
   */
  detectLowPowerDevice() {
    return (
      navigator.hardwareConcurrency <= 2 ||
      navigator.deviceMemory <= 2 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }

  detectSlowConnection() {
    const connection = navigator.connection;
    return (
      connection &&
      (connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g" ||
        connection.downlink < 1)
    );
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    this.stop();

    // Disconnect observers
    if (this.observers.performance) {
      this.observers.performance.disconnect();
    }

    if (this.observers.mutation) {
      this.observers.mutation.disconnect();
    }

    // Clear component references
    this.components = {};

    console.log("📊 Unified Performance Monitor destroyed");
  }
}

// Global instance management
window.UnifiedPerformanceMonitor = UnifiedPerformanceMonitor;

// Create default instance
if (!window.performanceMonitor) {
  window.performanceMonitor = new UnifiedPerformanceMonitor();
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = UnifiedPerformanceMonitor;
}

// ES6 export
export { UnifiedPerformanceMonitor };
