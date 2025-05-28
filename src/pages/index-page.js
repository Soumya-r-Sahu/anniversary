/**
 * Index Page JavaScript
 * Extracted from index.html embedded scripts
 */

// Initialize AOS (Animate On Scroll) with mobile optimizations
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

// ✨ PAGE TRANSITION CONFIGURATION ✨
const TRANSITION_CONFIG = {
  navigationDelay: 2000, // Delay before navigation (milliseconds)
  fadeOutDuration: 500, // Fade out animation duration (milliseconds)
  sparkleInterval: 200, // Interval between sparkle effects (milliseconds)
  burstIntensity: 15, // Number of bubbles in click burst
  hoverBurstIntensity: 5, // Number of bubbles in hover burst
};

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: isMobile ? 600 : 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false,
    offset: isMobile ? 50 : 120,
    delay: isMobile ? 50 : 100,
  });
});

// Initialize Particles.js with Performance Optimization
if (typeof particlesJS !== "undefined") {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: isMobile ? 10 : 18, // Optimized for 60+ FPS
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
        speed: isMobile ? 0.6 : 1.2, // Reduced speed for smoother performance
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
          enable: !isMobile,
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
  });
}

// Enhanced Music Integration with Cross-Page Sync
function setupEnhancedMusic() {
  // Wait for unified music manager to be available
  if (
    typeof window.musicManager === "undefined" &&
    typeof window.UnifiedMusicManager === "undefined"
  ) {
    setTimeout(setupEnhancedMusic, 100);
    return;
  }

  // Initialize unified music manager if not already done
  if (!window.musicManager && window.UnifiedMusicManager) {
    window.musicManager = new window.UnifiedMusicManager();
  }

  console.log("🎵 Enhanced music integration setup complete");
}

// Setup Bubble Burst Effects and Delayed Navigation for "Open Your Surprise" Button
function setupBubbleBurstEffects() {
  const surpriseButton = document.querySelector('a[href="countdown.html"]');

  if (surpriseButton) {
    // Remove default href to prevent immediate navigation
    const originalHref = surpriseButton.href;
    surpriseButton.removeAttribute("href");
    surpriseButton.style.cursor = "pointer";

    surpriseButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Visual feedback - button animation
      this.style.transform = "scale(0.95)";
      this.style.transition = "all 0.3s ease";

      const rect = this.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Use unified bubble system for burst effect
      if (
        window.BackgroundComponents &&
        window.BackgroundComponents.bubbleAnimation
      ) {
        window.BackgroundComponents.bubbleAnimation.createBubbleBurst(
          x,
          y,
          TRANSITION_CONFIG.burstIntensity,
        );
      }

      // Show loading message
      const originalText = this.innerHTML;
      this.innerHTML = "✨ Opening surprise... ✨";
      this.style.background = "linear-gradient(45deg, #ff6b9d, #ffa8cc)";

      // Add sparkle effects during delay
      const sparkleInterval = setInterval(() => {
        if (
          window.BackgroundComponents &&
          window.BackgroundComponents.bubbleAnimation
        ) {
          window.BackgroundComponents.bubbleAnimation.createBubbleBurst(
            rect.left + Math.random() * rect.width,
            rect.top + Math.random() * rect.height,
            3,
          );
        }
      }, TRANSITION_CONFIG.sparkleInterval);

      // Navigate after delay
      setTimeout(() => {
        clearInterval(sparkleInterval);

        // Fade out effect before navigation
        document.body.style.transition = `opacity ${TRANSITION_CONFIG.fadeOutDuration}ms ease-out`;
        document.body.style.opacity = "0";

        setTimeout(() => {
          window.location.href = originalHref;
        }, TRANSITION_CONFIG.fadeOutDuration);
      }, TRANSITION_CONFIG.navigationDelay);
    });

    // Also trigger on hover for extra magic
    surpriseButton.addEventListener("mouseenter", function (e) {
      const rect = this.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (
        window.BackgroundComponents &&
        window.BackgroundComponents.bubbleAnimation
      ) {
        window.BackgroundComponents.bubbleAnimation.createBubbleBurst(
          x,
          y,
          TRANSITION_CONFIG.hoverBurstIntensity,
        );
      }
    });
  }
}

// Typed.js initialization
function initTypedText() {
  if (typeof Typed !== "undefined" && document.getElementById("typed-text")) {
    new Typed("#typed-text", {
      strings: [
        "From June 16, 2024 to forever...",
        "Every moment with you is magical..",
        "You are my greatest blessing 💕",
        "My sweet Jerry, my everything ❤️",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Initialize unified integrator
  if (typeof AnniversaryWebsiteIntegrator !== "undefined") {
    const integrator = new AnniversaryWebsiteIntegrator();
    await integrator.init();
  } else {
    // Fallback initialization
    setTimeout(initTypedText, 1000);

    // Initialize unified background components
    if (typeof BackgroundComponents !== "undefined") {
      const config = BackgroundComponents.getPageConfig("index");
      BackgroundComponents.init(config);
    }

    // Setup enhanced features
    setupEnhancedMusic();
    setupBubbleBurstEffects();
  }

  console.log(
    "💕 Enhanced anniversary index page loaded with unified systems! 💕",
  );
});
