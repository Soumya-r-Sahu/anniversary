/**
 * Unified Bubble Animation System
 * Consolidates all bubble animation functionality across the website
 * Version: 2.0.0 - Converted from Hearts to Bubbles
 */

class UnifiedBubbleAnimation {
  constructor(options = {}) {
    // Configuration
    this.config = {
      enableFloatingBubbles: options.enableFloatingBubbles !== false,
      enableBurstBubbles: options.enableBurstBubbles !== false,
      enableRandomBubbles: options.enableRandomBubbles !== false,
      bubbleDensity: options.bubbleDensity || "medium", // 'low', 'medium', 'high'
      performance: options.performance || "auto", // 'auto', 'high', 'low'
      pageType: options.pageType || "default", // 'countdown', 'anniversary', 'love-story', 'gallery'
      maxBubbles: options.maxBubbles || 50,
      animationDuration: options.animationDuration || { min: 3, max: 9 },
      ...options,
    };

    // State management
    this.state = {
      isRunning: false,
      bubbleCount: 0,
      isPageVisible: !document.hidden,
      performanceMode: this.detectPerformanceMode(),
    };

    // Bubble color schemes based on page
    this.bubbleColors = this.getBubbleColorsByPage();

    // Animation containers
    this.containers = {
      floating: null,
      burst: null,
      random: null,
    };

    // Animation intervals and timeouts
    this.intervals = new Set();
    this.timeouts = new Set(); // Performance optimization
    this.performance = {
      throttledUpdate: this.throttle(
        this.updatePerformanceMetrics.bind(this),
        1000,
      ),
      deferredCleanup: this.debounce(
        this.cleanupExpiredBubbles.bind(this),
        5000,
      ),
    };

    // Event handlers
    this.boundHandlers = {
      onVisibilityChange: this.onVisibilityChange.bind(this),
      onClick: this.onDocumentClick.bind(this),
      onResize: this.onWindowResize.bind(this),
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize the bubble animation system
   */
  init() {
    try {
      // Setup containers
      this.setupContainers();

      // Setup event listeners
      this.setupEventListeners();

      // Setup page visibility handling
      this.setupVisibilityHandling();

      // Start animations based on configuration
      this.startAnimations();

      console.log(
        `🫧 Unified Bubble Animation System initialized for ${this.config.pageType} page`,
      );
    } catch (error) {
      console.error("Failed to initialize bubble animation system:", error);
    }
  }

  /**
   * Setup animation containers
   */
  setupContainers() {
    // Create floating bubbles container
    if (this.config.enableFloatingBubbles || this.config.enableRandomBubbles) {
      this.containers.floating = this.createContainer(
        "floating-bubbles-container",
        {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: "5",
          overflow: "hidden",
          contain: "layout style paint",
        },
      );
    }

    // Burst bubbles will be created dynamically
    this.containers.burst = document.body;
  }

  /**
   * Create animation container
   */
  createContainer(id, styles) {
    let container = document.getElementById(id);

    if (!container) {
      container = document.createElement("div");
      container.id = id;
      container.className = id.replace("-container", "");

      // Apply styles
      Object.assign(container.style, styles);

      document.body.appendChild(container);
    }

    return container;
  }

  /**
         /**
     * Setup event listeners
     */
  setupEventListeners() {
    // Burst bubbles on click only (touch interactions removed for performance)
    if (this.config.enableBurstBubbles) {
      document.addEventListener("click", this.boundHandlers.onClick, {
        passive: true,
      });
    }

    // Window resize handling
    window.addEventListener("resize", this.boundHandlers.onResize, {
      passive: true,
    });
  }

  /**
   * Setup page visibility handling for performance
   */
  setupVisibilityHandling() {
    document.addEventListener(
      "visibilitychange",
      this.boundHandlers.onVisibilityChange,
      { passive: true },
    );
  }

  /**
   * Start animations based on configuration
   */
  startAnimations() {
    this.state.isRunning = true;

    if (this.config.enableFloatingBubbles) {
      this.startFloatingBubbles();
    }

    if (this.config.enableRandomBubbles) {
      this.startRandomBubbles();
    }
  }

  /**
   * Start floating bubbles animation
   */
  startFloatingBubbles() {
    if (!this.containers.floating) return;

    const createBubble = () => {
      if (
        !this.state.isPageVisible ||
        this.state.bubbleCount >= this.config.maxBubbles
      )
        return;

      this.createFloatingBubble();

      // Schedule next bubble
      const interval = this.getBubbleInterval();
      const timeoutId = setTimeout(createBubble, interval);
      this.timeouts.add(timeoutId);
    };

    // Start with initial delay
    const timeoutId = setTimeout(createBubble, 1000);
    this.timeouts.add(timeoutId);
  }

  /**
   * Start random bubbles animation
   */
  startRandomBubbles() {
    if (!this.containers.floating) return;

    const createRandomBubble = () => {
      if (!this.state.isPageVisible) return;

      // Create multiple bubbles for density
      const bubbleCount = this.getRandomBubbleCount();
      for (let i = 0; i < bubbleCount; i++) {
        setTimeout(() => this.createRandomBubble(), i * 200);
      }

      // Schedule next batch
      const interval = this.getRandomBubbleInterval();
      const timeoutId = setTimeout(createRandomBubble, interval);
      this.timeouts.add(timeoutId);
    };

    createRandomBubble();
  }

  /**
   * Create floating bubble
   */
  createFloatingBubble() {
    const bubble = this.createBubbleElement({
      type: "floating",
      colors: this.getRandomBubbleColors(),
      size: this.getRandomSize(),
      position: this.getFloatingStartPosition(),
      duration: this.getRandomDuration(),
      animation: "float",
    });

    this.animateFloatingBubble(bubble);
  }

  /**
   * Create random bubble with various animation patterns
   */
  createRandomBubble() {
    const animationPattern = this.getRandomAnimationPattern();
    const bubble = this.createBubbleElement({
      type: "random",
      colors: this.getRandomBubbleColors(),
      size: this.getRandomSize(),
      position: this.getRandomStartPosition(animationPattern),
      duration: this.getRandomDuration(),
      animation: animationPattern,
    });

    this.animateRandomBubble(bubble, animationPattern);
  }

  /**
   * Create bubble burst effect
   */
  createBubbleBurst(x, y, intensity = 10) {
    if (!this.config.enableBurstBubbles) return;

    const burstCount = Math.floor(Math.random() * intensity) + intensity;
    const bubbleColors = this.getPageSpecificBurstColors();

    for (let i = 0; i < burstCount; i++) {
      const bubble = this.createBubbleElement({
        type: "burst",
        colors: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        size: this.getRandomBurstSize(),
        position: { x, y },
        duration: this.getRandomBurstDuration(),
        animation: "burst",
      });

      this.animateBurstBubble(bubble, x, y, i, burstCount);
    }
  }

  /**
   * Create bubble element with optimized properties
   */
  createBubbleElement(config) {
    const bubble = document.createElement("div");
    bubble.className = `bubble-${config.type}`;

    // Base styles for performance
    const baseStyles = {
      position: config.type === "burst" ? "fixed" : "absolute",
      width: `${config.size}px`,
      height: `${config.size}px`,
      borderRadius: "50%",
      pointerEvents: "none",
      userSelect: "none",
      zIndex: config.type === "burst" ? "150" : "5",
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
      transform: "translate3d(0, 0, 0)", // Force hardware acceleration
      background: config.colors.gradient,
      border: config.colors.border,
      backdropFilter: "blur(2px)",
      boxShadow: config.colors.shadow,
    };

    // Position-specific styles
    if (config.position) {
      baseStyles.left = `${config.position.x}px`;
      baseStyles.top = `${config.position.y}px`;
    }

    // Apply styles
    Object.assign(bubble.style, baseStyles);

    // Add to appropriate container
    const container =
      config.type === "burst"
        ? this.containers.burst
        : this.containers.floating;
    container.appendChild(bubble);

    // Track bubble count
    this.state.bubbleCount++;

    // Schedule cleanup
    const cleanupTimeout = setTimeout(
      () => {
        this.removeBubble(bubble);
      },
      config.duration * 1000 + 1000,
    );
    this.timeouts.add(cleanupTimeout);

    return bubble;
  }

  /**
   * Animate floating bubble
   */
  animateFloatingBubble(bubble) {
    const startY = parseFloat(bubble.style.top);
    const endY = -100;
    const startX = parseFloat(bubble.style.left);
    const drift = (Math.random() - 0.5) * 200;
    const endX = startX + drift;

    const duration = parseFloat(bubble.getAttribute("data-duration")) || 6;
    const rotation = Math.random() * 360;

    // Apply animation
    bubble.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    // Start animation
    requestAnimationFrame(() => {
      bubble.style.transform = `
                translate3d(${endX - startX}px, ${endY - startY}px, 0)
                rotate(${rotation}deg)
                scale(${Math.random() * 0.5 + 0.5})
            `;
      bubble.style.opacity = "0";
    });
  }

  /**
   * Animate random bubble with pattern
   */
  animateRandomBubble(bubble, pattern) {
    const duration = parseFloat(bubble.getAttribute("data-duration")) || 5;

    switch (pattern) {
      case "spiral":
        this.animateSpiral(bubble, duration);
        break;
      case "bounce":
        this.animateBounce(bubble, duration);
        break;
      case "zigzag":
        this.animateZigzag(bubble, duration);
        break;
      case "explosion":
        this.animateExplosion(bubble, duration);
        break;
      case "teleport":
        this.animateTeleport(bubble, duration);
        break;
      default:
        this.animateLinear(bubble, duration);
    }
  }

  /**
   * Animate burst bubble
   */
  animateBurstBubble(bubble, centerX, centerY, index, total) {
    const angle = (Math.PI * 2 * index) / total + (Math.random() - 0.5) * 0.7;
    const velocity = Math.random() * 300 + 150;
    const duration = Math.random() * 2 + 1.5;
    const rotation = Math.random() * 720 + 360;
    const gravity = Math.random() * 300 + 200;

    const endX = centerX + Math.cos(angle) * velocity;
    const endY = centerY + Math.sin(angle) * velocity - 80;
    const finalY = centerY + gravity;

    // CSS custom properties for animation
    bubble.style.setProperty("--endX", `${endX}px`);
    bubble.style.setProperty("--endY", `${endY}px`);
    bubble.style.setProperty("--finalY", `${finalY}px`);
    bubble.style.setProperty("--rotation", `${rotation}deg`);

    // Apply burst animation
    bubble.style.animation = `bubbleBurstAnimation ${duration}s ease-out forwards`;
  }

  /**
   * Animation pattern implementations
   */
  animateSpiral(bubble, duration) {
    const steps = 100;
    const stepDuration = (duration * 1000) / steps;
    let currentStep = 0;

    const startX = parseFloat(bubble.style.left);
    const startY = parseFloat(bubble.style.top);
    const endX = Math.random() * window.innerWidth;
    const endY = Math.random() * window.innerHeight;

    const animate = () => {
      if (currentStep >= steps || !bubble.parentNode) return;

      const progress = currentStep / steps;
      const angle = progress * Math.PI * 4;
      const radius = 50 * (1 - progress);

      const currentX =
        startX + (endX - startX) * progress + Math.cos(angle) * radius;
      const currentY =
        startY + (endY - startY) * progress + Math.sin(angle) * radius;
      const rotation = 720 * progress;

      bubble.style.transform = `
                translate3d(${currentX - startX}px, ${currentY - startY}px, 0)
                rotate(${rotation}deg)
                scale(${1 - progress * 0.5})
            `;
      bubble.style.opacity = 1 - progress;

      currentStep++;
      setTimeout(animate, stepDuration);
    };

    animate();
  }

  animateBounce(bubble, duration) {
    const startX = parseFloat(bubble.style.left);
    const startY = parseFloat(bubble.style.top);
    const endX = Math.random() * window.innerWidth;
    const endY = Math.random() * window.innerHeight;

    bubble.style.transition = `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;

    requestAnimationFrame(() => {
      bubble.style.transform = `
                translate3d(${endX - startX}px, ${endY - startY}px, 0)
                rotate(${Math.random() * 360}deg)
                scale(0.8)
            `;
      bubble.style.opacity = "0";
    });
  }

  animateZigzag(bubble, duration) {
    const steps = 8;
    const stepDuration = (duration * 1000) / steps;
    let currentStep = 0;

    const startX = parseFloat(bubble.style.left);
    const startY = parseFloat(bubble.style.top);
    const endX = Math.random() * window.innerWidth;
    const endY = Math.random() * window.innerHeight;

    const animate = () => {
      if (currentStep >= steps || !bubble.parentNode) return;

      const progress = currentStep / steps;
      const zigzagOffset = Math.sin(progress * Math.PI * 3) * 80;

      const currentX = startX + (endX - startX) * progress + zigzagOffset;
      const currentY = startY + (endY - startY) * progress;
      const rotation = 360 * progress;
      const scale = 0.8 + Math.sin(progress * Math.PI * 2) * 0.3;

      bubble.style.transform = `
                translate3d(${currentX - startX}px, ${currentY - startY}px, 0)
                rotate(${rotation}deg)
                scale(${scale})
            `;
      bubble.style.opacity = 1 - progress;

      currentStep++;
      setTimeout(animate, stepDuration);
    };

    animate();
  }

  animateExplosion(bubble, duration) {
    const startX = parseFloat(bubble.style.left);
    const startY = parseFloat(bubble.style.top);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 300 + 200;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;

    bubble.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    requestAnimationFrame(() => {
      bubble.style.transform = `
                translate3d(${endX - startX}px, ${endY - startY}px, 0)
                rotate(${Math.random() * 720}deg)
                scale(${Math.random() * 1.5 + 0.5})
            `;
      bubble.style.opacity = "0";
    });
  }

  animateTeleport(bubble, duration) {
    const endX = Math.random() * window.innerWidth;
    const endY = Math.random() * window.innerHeight;

    // Fade out
    bubble.style.transition = "opacity 0.3s ease-in-out";
    bubble.style.opacity = "0";

    setTimeout(() => {
      bubble.style.left = endX + "px";
      bubble.style.top = endY + "px";
      bubble.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.75})`;
      bubble.style.transition = `opacity ${duration - 0.6}s ease-in-out`;
      bubble.style.opacity = "1";

      setTimeout(
        () => {
          bubble.style.opacity = "0";
        },
        (duration - 0.6) * 1000,
      );
    }, 300);
  }

  animateLinear(bubble, duration) {
    const startX = parseFloat(bubble.style.left);
    const startY = parseFloat(bubble.style.top);
    const endX = Math.random() * window.innerWidth;
    const endY = Math.random() * window.innerHeight;
    const curveX = (Math.random() - 0.5) * 300;
    const curveY = (Math.random() - 0.5) * 150;

    bubble.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    requestAnimationFrame(() => {
      bubble.style.transform = `
                translate3d(${endX - startX + curveX}px, ${endY - startY + curveY}px, 0)
                rotate(${Math.random() * 720}deg)
                scale(${Math.random() * 0.8 + 0.6})
            `;
      bubble.style.opacity = "0";
    });
  }

  /**
   * Event handlers
   */
  onDocumentClick(event) {
    // Don't create burst if clicking on interactive elements
    if (this.isInteractiveElement(event.target)) return;
    this.createBubbleBurst(
      event.clientX,
      event.clientY,
      this.getBurstIntensity(),
    );
  }

  onVisibilityChange() {
    this.state.isPageVisible = !document.hidden;

    if (document.hidden) {
      this.pauseAnimations();
    } else {
      this.resumeAnimations();
    }
  }

  onWindowResize() {
    // Cleanup bubbles that are now outside viewport
    this.performance.deferredCleanup();
  }

  /**
   * Utility functions
   */
  isInteractiveElement(element) {
    const interactiveTypes = ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"];
    return (
      interactiveTypes.includes(element.tagName) ||
      element.closest(
        "button, a, .music-player, .control-panel, .gallery-navigation",
      )
    );
  }

  getBubbleColorsByPage() {
    const baseColors = [
      {
        gradient:
          "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.4))",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        shadow:
          "inset 0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)",
      },
      {
        gradient:
          "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(59, 130, 246, 0.6), rgba(99, 102, 241, 0.4))",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        shadow:
          "inset 0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)",
      },
      {
        gradient:
          "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(16, 185, 129, 0.6), rgba(5, 150, 105, 0.4))",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        shadow:
          "inset 0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)",
      },
    ];

    switch (this.config.pageType) {
      case "countdown":
        return [
          ...baseColors,
          {
            gradient:
              "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(251, 191, 36, 0.6), rgba(245, 158, 11, 0.4))",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            shadow:
              "inset 0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(251, 191, 36, 0.3)",
          },
        ];
      case "anniversary":
        return [
          ...baseColors,
          {
            gradient:
              "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(244, 63, 94, 0.6), rgba(225, 29, 72, 0.4))",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            shadow:
              "inset 0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(244, 63, 94, 0.3)",
          },
        ];
      default:
        return baseColors;
    }
  }

  getPageSpecificBurstColors() {
    return this.bubbleColors.slice(0, Math.min(this.bubbleColors.length, 6));
  }

  getRandomBubbleColors() {
    return this.bubbleColors[
      Math.floor(Math.random() * this.bubbleColors.length)
    ];
  }

  getRandomSize() {
    const baseSizes = {
      low: { min: 10, max: 16 },
      medium: { min: 12, max: 20 },
      high: { min: 14, max: 24 },
    };

    const sizes = baseSizes[this.state.performanceMode] || baseSizes.medium;
    return Math.random() * (sizes.max - sizes.min) + sizes.min;
  }

  getRandomBurstSize() {
    return Math.random() * 16 + 12; // 12-28px
  }

  getRandomDuration() {
    const { min, max } = this.config.animationDuration;
    return Math.random() * (max - min) + min;
  }

  getRandomBurstDuration() {
    return Math.random() * 1.5 + 1.2; // 1.2-2.7 seconds
  }

  getFloatingStartPosition() {
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 50,
    };
  }

  getRandomStartPosition(pattern) {
    switch (pattern) {
      case "explosion":
        return {
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
          y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
        };
      case "teleport":
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        };
      default:
        const side = Math.floor(Math.random() * 4);
        switch (side) {
          case 0: // top
            return { x: Math.random() * window.innerWidth, y: -50 };
          case 1: // right
            return {
              x: window.innerWidth + 50,
              y: Math.random() * window.innerHeight,
            };
          case 2: // bottom
            return {
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            };
          case 3: // left
            return { x: -50, y: Math.random() * window.innerHeight };
        }
    }
  }

  getRandomAnimationPattern() {
    const patterns = [
      "linear",
      "spiral",
      "bounce",
      "zigzag",
      "explosion",
      "teleport",
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  getBubbleInterval() {
    const intervals = {
      low: { min: 3000, max: 6000 },
      medium: { min: 1500, max: 3000 },
      high: { min: 800, max: 1500 },
    };

    const range = intervals[this.config.bubbleDensity] || intervals.medium;
    return Math.random() * (range.max - range.min) + range.min;
  }

  getRandomBubbleInterval() {
    return Math.random() * 2000 + 1000; // 1-3 seconds
  }

  getRandomBubbleCount() {
    const counts = {
      low: 1,
      medium: Math.floor(Math.random() * 2) + 1,
      high: Math.floor(Math.random() * 3) + 2,
    };

    return counts[this.config.bubbleDensity] || counts.medium;
  }

  getBurstIntensity() {
    const intensities = {
      low: 6,
      medium: 10,
      high: 15,
    };

    return intensities[this.config.bubbleDensity] || intensities.medium;
  }

  detectPerformanceMode() {
    if (this.config.performance !== "auto") {
      return this.config.performance;
    }

    // Auto-detect based on device capabilities
    const isLowPower =
      navigator.hardwareConcurrency <= 2 ||
      navigator.deviceMemory <= 2 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    return isLowPower ? "low" : "medium";
  }

  /**
   * Performance utilities
   */
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  updatePerformanceMetrics() {
    // Monitor bubble count and performance
    if (this.state.bubbleCount > this.config.maxBubbles * 1.5) {
      this.cleanupExpiredBubbles();
    }
  }

  cleanupExpiredBubbles() {
    const bubbles = document.querySelectorAll(
      ".bubble-floating, .bubble-random, .bubble-burst",
    );
    let cleaned = 0;

    bubbles.forEach((bubble) => {
      const rect = bubble.getBoundingClientRect();
      const isOutsideViewport =
        rect.bottom < -100 ||
        rect.top > window.innerHeight + 100 ||
        rect.right < -100 ||
        rect.left > window.innerWidth + 100;

      if (isOutsideViewport || parseFloat(bubble.style.opacity) < 0.1) {
        this.removeBubble(bubble);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired bubbles`);
    }
  }

  removeBubble(bubble) {
    if (bubble && bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
      this.state.bubbleCount = Math.max(0, this.state.bubbleCount - 1);
    }
  }

  /**
   * Animation control
   */
  pauseAnimations() {
    // Clear all intervals and timeouts
    this.intervals.forEach((interval) => clearInterval(interval));
    this.timeouts.forEach((timeout) => clearTimeout(timeout));

    // Pause CSS animations
    const bubbles = document.querySelectorAll(
      ".bubble-floating, .bubble-random, .bubble-burst",
    );
    bubbles.forEach((bubble) => {
      bubble.style.animationPlayState = "paused";
    });
  }

  resumeAnimations() {
    // Resume CSS animations
    const bubbles = document.querySelectorAll(
      ".bubble-floating, .bubble-random, .bubble-burst",
    );
    bubbles.forEach((bubble) => {
      bubble.style.animationPlayState = "running";
    });

    // Restart animations if they were running
    if (this.state.isRunning) {
      this.startAnimations();
    }
  }

  /**
   * Public API
   */
  start() {
    this.state.isRunning = true;
    this.startAnimations();
  }

  stop() {
    this.state.isRunning = false;
    this.pauseAnimations();
    this.intervals.clear();
    this.timeouts.clear();
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    // Stop all animations
    this.stop();

    // Remove event listeners
    document.removeEventListener("click", this.boundHandlers.onClick);
    document.removeEventListener("touchend", this.boundHandlers.onTouch);
    document.removeEventListener(
      "visibilitychange",
      this.boundHandlers.onVisibilityChange,
    );
    window.removeEventListener("resize", this.boundHandlers.onResize);

    // Remove all bubbles
    const bubbles = document.querySelectorAll(
      ".bubble-floating, .bubble-random, .bubble-burst",
    );
    bubbles.forEach((bubble) => this.removeBubble(bubble));

    // Remove containers
    Object.values(this.containers).forEach((container) => {
      if (container && container.id && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });

    console.log("🫧 Bubble Animation System destroyed");
  }
}

// Add required CSS for burst animations
const addBubbleAnimationStyles = () => {
  if (document.getElementById("bubble-animation-styles")) return;

  const style = document.createElement("style");
  style.id = "bubble-animation-styles";
  style.textContent = `
        @keyframes bubbleBurstAnimation {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(0.5);
                opacity: 1;
            }
            40% {
                transform: translate(calc(var(--endX) - 50vw), calc(var(--endY) - 50vh)) rotate(calc(var(--rotation) * 0.4)) scale(1.3);
                opacity: 1;
            }
            80% {
                opacity: 0.7;
            }
            100% {
                transform: translate(calc(var(--endX) - 50vw), calc(var(--finalY) - 50vh)) rotate(var(--rotation)) scale(0.3);
                opacity: 0;
            }
        }

        .bubble-floating, .bubble-random, .bubble-burst {
            contain: layout style paint;
            will-change: transform, opacity;
            backface-visibility: hidden;
        }
    `;
  document.head.appendChild(style);
};

// Auto-add styles when class is loaded
addBubbleAnimationStyles();

// Global export
window.UnifiedBubbleAnimation = UnifiedBubbleAnimation;

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = UnifiedBubbleAnimation;
}

// ES6 export
export { UnifiedBubbleAnimation };
