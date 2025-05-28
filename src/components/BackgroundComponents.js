/**
 * Unified Background Components System
 *
 * This module provides consistent background components across all pages:
 * - Particles.js background
 * - Unified bubble animation system
 * - Enhanced music player
 * - Performance optimizations
 *
 * Usage: BackgroundComponents.init(config)
 */

class BackgroundComponents {
  constructor() {
    this.particlesConfig = null;
    this.bubbleConfig = null;
    this.musicConfig = null;
    this.isInitialized = false;
    this.bubbleAnimation = null;
  } /**
   * Initialize all background components with optional configuration
   * @param {Object} config - Configuration options for components
   */
  init(config = {}) {
    if (this.isInitialized) return;

    this.particlesConfig = {
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ),
      ...config.particles,
    };

    this.bubbleConfig = {
      enableFloatingBubbles: true,
      enableBurstBubbles: true,
      enableRandomBubbles: true,
      bubbleDensity: config.bubbleDensity || "medium",
      pageType: config.pageType || "default",
      ...config.bubbles,
    };

    this.musicConfig = {
      enableMusicPlayer: true,
      autoplay: false,
      ...config.music,
    };

    this.createBackgroundStructure();
    this.initializeParticles();
    this.initializeBubbleSystem();
    this.initializeMusicPlayer();

    this.isInitialized = true;
    console.log(
      "🎨 Background Components initialized successfully with unified bubble system",
    );
  } /**
   * Create the basic HTML structure for background components
   */
  createBackgroundStructure() {
    // Create particles container if it doesn't exist
    if (!document.getElementById("particles-js")) {
      const particlesContainer = document.createElement("div");
      particlesContainer.id = "particles-js";
      particlesContainer.className = "fixed inset-0 z-0";
      document.body.prepend(particlesContainer);
    }

    // Create enhanced music player
    if (
      !document.querySelector(".enhanced-music-player") &&
      this.musicConfig.enableMusicPlayer
    ) {
      const musicPlayer = document.createElement("div");
      musicPlayer.className = "enhanced-music-player";
      musicPlayer.innerHTML = `
                <button id="music-toggle" class="music-control-btn" aria-label="Toggle Background Music">
                    <span id="music-icon">🎵</span>
                    <div class="music-visualizer" id="music-visualizer" style="display: none;">
                        <div class="music-bar"></div>
                        <div class="music-bar"></div>
                        <div class="music-bar"></div>
                        <div class="music-bar"></div>
                    </div>
                </button>
            `;
      document.body.appendChild(musicPlayer);
    }
  }

  /**
   * Initialize particles.js with optimized settings
   */
  initializeParticles() {
    if (typeof particlesJS === "undefined") {
      console.warn(
        "🔺 Particles.js not loaded, skipping particle initialization",
      );
      return;
    }

    const config = {
      particles: {
        number: {
          value: this.particlesConfig.isMobile ? 10 : 18,
          density: {
            enable: true,
            value_area: 1200,
          },
        },
        color: {
          value: ["#ff6b9d", "#ffa8cc", "#ffb3d6"],
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ff6b9d",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: this.particlesConfig.isMobile ? 0.5 : 1,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: !this.particlesConfig.isMobile,
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    };

    particlesJS("particles-js", config);
  } /**
   * Initialize unified bubble animation system
   */
  initializeBubbleSystem() {
    if (
      !this.bubbleConfig.enableFloatingBubbles &&
      !this.bubbleConfig.enableBurstBubbles
    )
      return;

    // Load UnifiedBubbleAnimation if not already loaded
    if (typeof UnifiedBubbleAnimation === "undefined") {
      this.loadBubbleAnimationScript();
      return;
    }

    // Initialize bubble animation system
    this.bubbleAnimation = new UnifiedBubbleAnimation(this.bubbleConfig);
    console.log("🫧 Unified bubble animation system initialized");
  }

  /**
   * Load UnifiedBubbleAnimation script dynamically
   */
  loadBubbleAnimationScript() {
    const script = document.createElement("script");
    script.src = "./src/components/UnifiedBubbleAnimation.js";
    script.onload = () => {
      this.bubbleAnimation = new UnifiedBubbleAnimation(this.bubbleConfig);
      console.log("🫧 Unified bubble animation system loaded and initialized");
    };
    script.onerror = () => {
      console.warn("Failed to load UnifiedBubbleAnimation script");
    };
    document.head.appendChild(script);
  } /**
   * Initialize music player integration
   */
  initializeMusicPlayer() {
    if (!this.musicConfig.enableMusicPlayer) return;

    // Initialize unified music manager integration
    document.addEventListener("DOMContentLoaded", () => {
      // Wait for UnifiedMusicManager to be available
      if (
        typeof window.musicManager !== "undefined" ||
        typeof window.UnifiedMusicManager !== "undefined"
      ) {
        // Initialize unified music manager if not already done
        if (!window.musicManager && window.UnifiedMusicManager) {
          window.musicManager = new window.UnifiedMusicManager();
        }

        // Music manager is available, integrate with controls
        const musicToggle = document.getElementById("music-toggle");
        if (musicToggle && window.musicManager) {
          musicToggle.addEventListener("click", () => {
            window.musicManager.toggle();
          });
        }
      } else {
        // Retry after a short delay
        setTimeout(() => this.initializeMusicPlayer(), 100);
      }
    });
  } /**
   * Page-specific configuration presets
   */
  static getPageConfig(pageName) {
    const configs = {
      index: {
        particles: {
          isMobile:
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent,
            ),
        },
        bubbles: {
          enableFloatingBubbles: true,
          enableBurstBubbles: true,
          enableRandomBubbles: true,
          bubbleDensity: "medium",
          pageType: "default",
        },
        music: { enableMusicPlayer: true, autoplay: false },
      },
      anniversary: {
        particles: {
          isMobile:
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent,
            ),
        },
        bubbles: {
          enableFloatingBubbles: true,
          enableBurstBubbles: true,
          enableRandomBubbles: true,
          bubbleDensity: "high",
          pageType: "anniversary",
        },
        music: { enableMusicPlayer: true, autoplay: false },
      },
      countdown: {
        particles: {
          isMobile:
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent,
            ),
        },
        bubbles: {
          enableFloatingBubbles: true,
          enableBurstBubbles: true,
          enableRandomBubbles: true,
          bubbleDensity: "high",
          pageType: "countdown",
        },
        music: { enableMusicPlayer: true, autoplay: false },
      },
      "love-story": {
        particles: {
          isMobile:
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent,
            ),
        },
        bubbles: {
          enableFloatingBubbles: true,
          enableBurstBubbles: true,
          enableRandomBubbles: false,
          bubbleDensity: "medium",
          pageType: "love-story",
        },
        music: { enableMusicPlayer: true, autoplay: false },
      },
      "photo-gallery": {
        particles: { enabled: false }, // Disable particles for photo gallery as it has its own background
        bubbles: {
          enableFloatingBubbles: false,
          enableBurstBubbles: true,
          enableRandomBubbles: false,
          bubbleDensity: "low",
          pageType: "gallery",
        },
        music: { enableMusicPlayer: true, autoplay: false },
      },
    };

    return configs[pageName] || configs.index;
  } /**
   * Cleanup method for page transitions
   */
  cleanup() {
    // Cleanup bubble animation system
    if (
      this.bubbleAnimation &&
      typeof this.bubbleAnimation.destroy === "function"
    ) {
      this.bubbleAnimation.destroy();
    }

    // Remove event listeners to prevent memory leaks
    // (In a production app, you'd want to store references to remove specific listeners)

    this.isInitialized = false;
    console.log("🫧 Background Components cleaned up");
  }
}

// Create a global instance
window.BackgroundComponents = new BackgroundComponents();

// Auto-initialize based on page type if data attribute is present
document.addEventListener("DOMContentLoaded", () => {
  const pageType = document.body.getAttribute("data-page-type");
  if (pageType) {
    const config = BackgroundComponents.getPageConfig(pageType);
    window.BackgroundComponents.init(config);
  }
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = BackgroundComponents;
}

// ES6 export
export { BackgroundComponents };
