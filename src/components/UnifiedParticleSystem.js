/**
 * Unified Particle System - Optimized particle effects for anniversary website
 * Replaces multiple particle implementations with a single, performance-optimized solution
 * Version: 2.0.0
 */

class UnifiedParticleSystem {
  constructor(options = {}) {
    // Core configuration
    this.config = {
      container: options.container || "particles-js",
      particleCount: options.particleCount || this.getOptimalParticleCount(),
      particleColor: options.particleColor || ["#ff6b9d", "#ffa8cc", "#ffb3d6"],
      particleSize: options.particleSize || { min: 1, max: 4 },
      particleSpeed: options.particleSpeed || { min: 0.5, max: 2 },
      particleOpacity: options.particleOpacity || { min: 0.1, max: 0.3 },
      enableInteraction: options.enableInteraction !== false,
      enableAnimation: options.enableAnimation !== false,
      performance: options.performance || "auto", // 'auto', 'high', 'low'
      animationFrameLimit: options.animationFrameLimit || 60,
      ...options,
    };

    // State management
    this.state = {
      isRunning: false,
      isPaused: false,
      isVisible: true,
      particleArray: [],
      mousePosition: { x: 0, y: 0 },
      isMouseInside: false,
      frameCount: 0,
      lastFrameTime: 0,
    };

    // Performance optimization
    this.performance = {
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ),
      isLowPower: this.detectLowPowerMode(),
      devicePixelRatio: window.devicePixelRatio || 1,
      preferredFPS: this.getPreferredFPS(),
      frameInterval: 1000 / (this.getPreferredFPS() || 60),
      shouldRender: true,
    };

    // Canvas and rendering
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.resizeTimeout = null;

    // Event handlers
    this.boundHandlers = {
      onResize: this.throttle(this.handleResize.bind(this), 250),
      onVisibilityChange: this.handleVisibilityChange.bind(this),
      onMouseMove: this.throttle(this.handleMouseMove.bind(this), 16),
      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this),
      onClick: this.handleClick.bind(this),
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize the particle system
   */
  init() {
    try {
      // Setup canvas
      this.setupCanvas();

      // Create particles
      this.createParticles();

      // Setup event listeners
      this.setupEventListeners();

      // Start animation
      this.start();

      console.log("✨ Unified Particle System initialized");
    } catch (error) {
      console.error("Failed to initialize particle system:", error);
      this.handleError(error);
    }
  }

  /**
   * Setup canvas element
   */
  setupCanvas() {
    const container = document.getElementById(this.config.container);
    if (!container) {
      throw new Error(`Container element '${this.config.container}' not found`);
    }

    // Create canvas if doesn't exist
    this.canvas = container.querySelector("canvas");
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      container.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      powerPreference: this.performance.isLowPower
        ? "low-power"
        : "high-performance",
    });

    // Setup canvas properties
    this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: ${this.config.enableInteraction ? "auto" : "none"};
            z-index: 1;
        `;

    // Set canvas size
    this.updateCanvasSize();
  }

  /**
   * Update canvas size
   */
  updateCanvasSize() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();

    // Use device pixel ratio for sharp rendering
    const ratio = this.performance.devicePixelRatio;
    this.canvas.width = rect.width * ratio;
    this.canvas.height = rect.height * ratio;

    // Scale context to ensure correct drawing operations
    this.ctx.scale(ratio, ratio);

    // Set CSS size
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";
  }

  /**
   * Create particle array
   */
  createParticles() {
    this.state.particleArray = [];

    for (let i = 0; i < this.config.particleCount; i++) {
      this.state.particleArray.push(this.createParticle());
    }
  }

  /**
   * Create a single particle
   */
  createParticle() {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * this.config.particleSpeed.max,
      vy: (Math.random() - 0.5) * this.config.particleSpeed.max,
      size:
        Math.random() *
          (this.config.particleSize.max - this.config.particleSize.min) +
        this.config.particleSize.min,
      opacity:
        Math.random() *
          (this.config.particleOpacity.max - this.config.particleOpacity.min) +
        this.config.particleOpacity.min,
      color:
        this.config.particleColor[
          Math.floor(Math.random() * this.config.particleColor.length)
        ],
      life: 1,
      decay: Math.random() * 0.02 + 0.005,
      originalOpacity: null,
    };
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Window events
    window.addEventListener("resize", this.boundHandlers.onResize, {
      passive: true,
    });
    document.addEventListener(
      "visibilitychange",
      this.boundHandlers.onVisibilityChange,
      { passive: true },
    );

    // Mouse/touch events for interaction
    if (this.config.enableInteraction && this.canvas) {
      this.canvas.addEventListener(
        "mousemove",
        this.boundHandlers.onMouseMove,
        { passive: true },
      );
      this.canvas.addEventListener(
        "mouseenter",
        this.boundHandlers.onMouseEnter,
        { passive: true },
      );
      this.canvas.addEventListener(
        "mouseleave",
        this.boundHandlers.onMouseLeave,
        { passive: true },
      );
      this.canvas.addEventListener("click", this.boundHandlers.onClick, {
        passive: true,
      });
    }
  }

  /**
   * Start particle animation
   */
  start() {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.lastFrameTime = performance.now();

    this.animate();
  }

  /**
   * Pause particle animation
   */
  pause() {
    this.state.isPaused = true;
  }

  /**
   * Resume particle animation
   */
  resume() {
    this.state.isPaused = false;
    if (!this.state.isRunning) {
      this.start();
    }
  }

  /**
   * Stop particle animation
   */
  stop() {
    this.state.isRunning = false;
    this.state.isPaused = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.state.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.state.lastFrameTime;

    // Frame rate limiting
    if (deltaTime >= this.performance.frameInterval) {
      if (
        !this.state.isPaused &&
        this.state.isVisible &&
        this.performance.shouldRender
      ) {
        this.update();
        this.render();
      }

      this.state.lastFrameTime = currentTime;
      this.state.frameCount++;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Update particles
   */
  update() {
    const rect = this.canvas.getBoundingClientRect();

    this.state.particleArray.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary collision
      if (particle.x < 0 || particle.x > rect.width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(rect.width, particle.x));
      }

      if (particle.y < 0 || particle.y > rect.height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(rect.height, particle.y));
      }

      // Mouse interaction
      if (this.config.enableInteraction && this.state.isMouseInside) {
        this.updateParticleInteraction(particle);
      }

      // Update life and opacity
      particle.life -= particle.decay;
      if (particle.life <= 0) {
        // Reset particle
        Object.assign(particle, this.createParticle());
      }
    });
  }

  /**
   * Update particle interaction with mouse
   */
  updateParticleInteraction(particle) {
    const dx = this.state.mousePosition.x - particle.x;
    const dy = this.state.mousePosition.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 100;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      const angle = Math.atan2(dy, dx);

      // Repulsion effect
      particle.vx -= Math.cos(angle) * force * 0.5;
      particle.vy -= Math.sin(angle) * force * 0.5;

      // Opacity change
      particle.opacity = Math.min(1, particle.opacity + force * 0.1);
    }
  }

  /**
   * Render particles
   */
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render each particle
    this.state.particleArray.forEach((particle) => {
      this.renderParticle(particle);
    });

    // Draw connections if enabled
    if (this.config.enableConnections && !this.performance.isLowPower) {
      this.renderConnections();
    }
  }

  /**
   * Render a single particle
   */
  renderParticle(particle) {
    this.ctx.save();

    // Set opacity
    this.ctx.globalAlpha = particle.opacity * particle.life;

    // Set color
    this.ctx.fillStyle = particle.color;

    // Draw particle
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  /**
   * Render connections between nearby particles
   */
  renderConnections() {
    const maxDistance = 120;

    for (let i = 0; i < this.state.particleArray.length; i++) {
      for (let j = i + 1; j < this.state.particleArray.length; j++) {
        const particleA = this.state.particleArray[i];
        const particleB = this.state.particleArray[j];

        const dx = particleA.x - particleB.x;
        const dy = particleA.y - particleB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = ((maxDistance - distance) / maxDistance) * 0.1;

          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          this.ctx.strokeStyle = "#ff6b9d";
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(particleA.x, particleA.y);
          this.ctx.lineTo(particleB.x, particleB.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

  /**
   * Add burst effect at position
   */
  addBurst(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = Math.random() * 3 + 2;

      const particle = {
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.random() * 3 + 2,
        opacity: 0.8,
        color:
          this.config.particleColor[
            Math.floor(Math.random() * this.config.particleColor.length)
          ],
        life: 1,
        decay: 0.02,
      };

      this.state.particleArray.push(particle);
    }

    // Remove excess particles to maintain performance
    if (this.state.particleArray.length > this.config.particleCount * 2) {
      this.state.particleArray.splice(0, count);
    }
  }

  /**
   * Event Handlers
   */
  handleResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.updateCanvasSize();
      this.createParticles(); // Recreate particles for new size
    }, 250);
  }

  handleVisibilityChange() {
    this.state.isVisible = !document.hidden;

    if (this.state.isVisible) {
      this.resume();
    } else {
      this.pause();
    }
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.state.mousePosition.x = event.clientX - rect.left;
    this.state.mousePosition.y = event.clientY - rect.top;
  }

  handleMouseEnter() {
    this.state.isMouseInside = true;
  }

  handleMouseLeave() {
    this.state.isMouseInside = false;
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.addBurst(x, y, 8);
  }

  /**
   * Utility functions
   */
  getOptimalParticleCount() {
    if (this.performance.isLowPower) return 25;
    if (this.performance.isMobile) return 40;
    return 60;
  }

  getPreferredFPS() {
    if (this.performance.isLowPower) return 30;
    if (this.performance.isMobile) return 45;
    return 60;
  }

  detectLowPowerMode() {
    return (
      navigator.hardwareConcurrency <= 2 ||
      navigator.deviceMemory <= 2 ||
      navigator.connection?.effectiveType === "slow-2g" ||
      navigator.connection?.effectiveType === "2g" ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }

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

  /**
   * Error handling
   */
  handleError(error) {
    console.error("Particle system error:", error);

    // Fallback to simple particle effect
    this.config.particleCount = Math.min(this.config.particleCount, 20);
    this.config.enableInteraction = false;
    this.config.enableConnections = false;
  }

  /**
   * Performance monitoring
   */
  getPerformanceStats() {
    return {
      fps: Math.round(this.state.frameCount / (performance.now() / 1000)),
      particleCount: this.state.particleArray.length,
      isLowPower: this.performance.isLowPower,
      isMobile: this.performance.isMobile,
      canvasSize: {
        width: this.canvas?.width || 0,
        height: this.canvas?.height || 0,
      },
    };
  }

  /**
   * Configuration updates
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);

    // Recreate particles if count changed
    if (newConfig.particleCount !== undefined) {
      this.createParticles();
    }
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    // Stop animation
    this.stop();

    // Remove event listeners
    window.removeEventListener("resize", this.boundHandlers.onResize);
    document.removeEventListener(
      "visibilitychange",
      this.boundHandlers.onVisibilityChange,
    );

    if (this.canvas) {
      this.canvas.removeEventListener(
        "mousemove",
        this.boundHandlers.onMouseMove,
      );
      this.canvas.removeEventListener(
        "mouseenter",
        this.boundHandlers.onMouseEnter,
      );
      this.canvas.removeEventListener(
        "mouseleave",
        this.boundHandlers.onMouseLeave,
      );
      this.canvas.removeEventListener("click", this.boundHandlers.onClick);
    }

    // Clear references
    this.state.particleArray = [];
    this.canvas = null;
    this.ctx = null;

    console.log("✨ Unified Particle System destroyed");
  }
}

// Global instance management
window.UnifiedParticleSystem = UnifiedParticleSystem;

// Backwards compatibility with particles.js
window.particlesJS = function (containerId, config) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container '${containerId}' not found for particles.js`);
    return;
  }

  // Convert particles.js config to UnifiedParticleSystem config
  const unifiedConfig = {
    container: containerId,
    particleCount: config.particles?.number?.value || 50,
    particleColor: config.particles?.color?.value || [
      "#ff6b9d",
      "#ffa8cc",
      "#ffb3d6",
    ],
    particleSize: {
      min: config.particles?.size?.value
        ? config.particles.size.value * 0.5
        : 1,
      max: config.particles?.size?.value || 4,
    },
    particleSpeed: {
      min: config.particles?.move?.speed
        ? config.particles.move.speed * 0.5
        : 0.5,
      max: config.particles?.move?.speed || 2,
    },
    enableInteraction: config.interactivity?.events?.onhover?.enable || false,
    enableConnections: config.particles?.line_linked?.enable || false,
  };

  return new UnifiedParticleSystem(unifiedConfig);
};

// Auto-initialize when DOM is ready (if particles-js container exists)
document.addEventListener("DOMContentLoaded", function () {
  const particlesContainer = document.getElementById("particles-js");
  if (particlesContainer && !window.particlesInstance) {
    window.particlesInstance = new UnifiedParticleSystem({
      container: "particles-js",
    });
  }
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = UnifiedParticleSystem;
}

// ES6 export
export { UnifiedParticleSystem };
