/**
 * Performance Utilities - Common performance optimization functions
 * Shared utilities for throttling, debouncing, and performance monitoring
 * Version: 2.0.0
 */

class PerformanceUtils {
  /**
   * Throttle function execution
   */
  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce function execution
   */
  static debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
  }

  /**
   * RAF throttle for animations
   */
  static rafThrottle(func) {
    let rafId = null;
    return function (...args) {
      const context = this;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          func.apply(context, args);
          rafId = null;
        });
      }
    };
  }

  /**
   * Device capability detection
   */
  static detectDeviceCapabilities() {
    return {
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ),
      isLowPower: this.detectLowPowerMode(),
      hasTouch: "ontouchstart" in window,
      devicePixelRatio: window.devicePixelRatio || 1,
      memoryLimit: navigator.deviceMemory || 4,
      connectionType: navigator.connection?.effectiveType || "unknown",
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
    };
  }

  /**
   * Detect low power mode
   */
  static detectLowPowerMode() {
    // Check for reduced motion preference
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return true;
    }

    // Check for low memory devices
    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
      return true;
    }

    // Check for slow connections
    if (
      navigator.connection?.effectiveType === "slow-2g" ||
      navigator.connection?.effectiveType === "2g"
    ) {
      return true;
    }

    // Check for battery status (if available)
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        return battery.level < 0.2; // Low battery
      });
    }

    return false;
  }

  /**
   * Frame rate monitor
   */
  static createFPSMonitor() {
    let fps = 60;
    let lastTime = performance.now();
    let frameCount = 0;

    function updateFPS() {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(updateFPS);
    }

    updateFPS();

    return {
      getFPS: () => fps,
      isLowFPS: () => fps < 30,
    };
  }

  /**
   * Memory usage monitor
   */
  static getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
        usagePercentage: Math.round(
          (performance.memory.usedJSHeapSize /
            performance.memory.jsHeapSizeLimit) *
            100,
        ),
      };
    }
    return null;
  }

  /**
   * DOM complexity monitor
   */
  static getDOMComplexity() {
    return {
      elementCount: document.querySelectorAll("*").length,
      depth: this.getMaxDOMDepth(),
      eventListeners: this.estimateEventListeners(),
    };
  }

  /**
   * Calculate maximum DOM depth
   */
  static getMaxDOMDepth(element = document.body, depth = 0) {
    let maxDepth = depth;

    if (element.children) {
      for (const child of element.children) {
        const childDepth = this.getMaxDOMDepth(child, depth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
    }

    return maxDepth;
  }

  /**
   * Estimate event listeners (approximation)
   */
  static estimateEventListeners() {
    const elementsWithEvents = document.querySelectorAll(
      "*[onclick], *[onload], *[onmouseover]",
    );
    return elementsWithEvents.length;
  }

  /**
   * Intersection Observer for lazy loading
   */
  static createLazyLoader(options = {}) {
    const defaults = {
      rootMargin: "50px",
      threshold: 0.1,
    };

    const config = { ...defaults, ...options };

    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          // Lazy load images
          if (target.dataset.src) {
            target.src = target.dataset.src;
            target.removeAttribute("data-src");
          }

          // Lazy load background images
          if (target.dataset.bgSrc) {
            target.style.backgroundImage = `url(${target.dataset.bgSrc})`;
            target.removeAttribute("data-bg-src");
          }

          // Execute lazy load callback
          if (
            target.dataset.lazyCallback &&
            window[target.dataset.lazyCallback]
          ) {
            window[target.dataset.lazyCallback](target);
          }

          // Remove from observer
          this.unobserve(target);
        }
      });
    }, config);
  }

  /**
   * Resource hints for optimization
   */
  static addResourceHints() {
    const head = document.head;

    // DNS prefetch for external resources
    this.addLink("dns-prefetch", "//fonts.googleapis.com");
    this.addLink("dns-prefetch", "//cdnjs.cloudflare.com");

    // Preconnect for critical resources
    this.addLink("preconnect", "https://fonts.gstatic.com", true);

    // Prefetch likely next pages
    this.addLink("prefetch", "./anniversary.html");
    this.addLink("prefetch", "./photo-gallery.html");
  }

  /**
   * Add link element
   */
  static addLink(rel, href, crossorigin = false) {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    if (crossorigin) link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }

  /**
   * Critical CSS inliner
   */
  static inlineCriticalCSS(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.insertBefore(style, document.head.firstChild);
  }

  /**
   * Load non-critical CSS asynchronously
   */
  static loadCSS(href) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = href;
    link.onload = function () {
      this.onload = null;
      this.rel = "stylesheet";
    };
    document.head.appendChild(link);
  }

  /**
   * Service Worker registration
   */
  static registerServiceWorker(swPath = "/sw.js") {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(swPath)
        .then((registration) => {
          console.log("SW registered:", registration);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    }
  }

  /**
   * Web Vitals measurement
   */
  static measureWebVitals() {
    const vitals = {};

    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          vitals.fcp = entry.startTime;
          console.log("FCP:", entry.startTime);
        }
      }
    }).observe({ type: "paint", buffered: true });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitals.lcp = lastEntry.startTime;
      console.log("LCP:", lastEntry.startTime);
    }).observe({ type: "largest-contentful-paint", buffered: true });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        vitals.fid = entry.processingStart - entry.startTime;
        console.log("FID:", vitals.fid);
      }
    }).observe({ type: "first-input", buffered: true });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let cumulativeScore = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          cumulativeScore += entry.value;
        }
      }
      vitals.cls = cumulativeScore;
      console.log("CLS:", cumulativeScore);
    }).observe({ type: "layout-shift", buffered: true });

    return vitals;
  }
}

// Global utility functions
window.PerformanceUtils = PerformanceUtils;

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = PerformanceUtils;
}

// ES6 export
export { PerformanceUtils };
