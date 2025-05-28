/**
 * Index Page Specific Logic
 * Handles page-specific functionality for the main index page
 * Version: 2.0.0
 */

class IndexPage {
  constructor() {
    this.config = {
      enableTypewriter: true,
      enableCountdown: true,
      enableAnimations: true,
      autoplayMusic: false,
    };

    this.state = {
      initialized: false,
      animationsComplete: false,
      userInteracted: false,
    };

    this.init();
  }

  /**
   * Initialize index page
   */
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        await new Promise((resolve) =>
          document.addEventListener("DOMContentLoaded", resolve, {
            once: true,
          }),
        );
      }

      // Initialize components
      await this.initializeComponents();

      // Setup page-specific interactions
      this.setupInteractions();

      // Initialize animations
      if (this.config.enableAnimations) {
        this.initializeAnimations();
      }

      this.state.initialized = true;
      console.log("🏠 Index page initialized");
    } catch (error) {
      console.error("Failed to initialize index page:", error);
    }
  }

  /**
   * Initialize page components
   */
  async initializeComponents() {
    // Initialize background components (already handled by BackgroundComponents.js)

    // Initialize typewriter effect if present
    if (this.config.enableTypewriter) {
      this.initializeTypewriter();
    }

    // Initialize countdown timer if present
    if (this.config.enableCountdown) {
      this.initializeCountdown();
    }

    // Initialize navigation highlights
    this.initializeNavigation();
  }

  /**
   * Initialize typewriter effect
   */
  initializeTypewriter() {
    const typewriterElements = document.querySelectorAll(
      ".typewriter, [data-typewriter]",
    );

    typewriterElements.forEach((element) => {
      const text = element.dataset.typewriter || element.textContent;
      const speed = parseInt(element.dataset.speed) || 50;

      this.createTypewriterEffect(element, text, speed);
    });
  }

  /**
   * Create typewriter effect
   */
  createTypewriterEffect(element, text, speed) {
    element.textContent = "";
    element.style.borderRight = "2px solid";
    element.style.animation = "blink 1s infinite";

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(timer);
        // Remove cursor after completion
        setTimeout(() => {
          element.style.borderRight = "none";
          element.style.animation = "none";
        }, 1000);
      }
    }, speed);

    // Add CSS for blinking cursor
    if (!document.querySelector("#typewriter-styles")) {
      const style = document.createElement("style");
      style.id = "typewriter-styles";
      style.textContent = `
                @keyframes blink {
                    0%, 50% { border-color: transparent; }
                    51%, 100% { border-color: currentColor; }
                }
            `;
      document.head.appendChild(style);
    }
  }

  /**
   * Initialize countdown timer
   */
  initializeCountdown() {
    const countdownElement = document.querySelector(
      "#countdown-timer, .countdown-timer",
    );
    if (!countdownElement) return;

    const targetDate = this.getAnniversaryDate();
    if (!targetDate) return;

    this.updateCountdown(countdownElement, targetDate);

    // Update every second
    setInterval(() => {
      this.updateCountdown(countdownElement, targetDate);
    }, 1000);
  }

  /**
   * Get anniversary date
   */
  getAnniversaryDate() {
    // Check for data attribute first
    const countdownElement = document.querySelector(
      "#countdown-timer, .countdown-timer",
    );
    if (countdownElement?.dataset.targetDate) {
      return new Date(countdownElement.dataset.targetDate);
    }

    // Default to next anniversary (adjust as needed)
    const currentYear = new Date().getFullYear();
    let anniversaryDate = new Date(currentYear, 4, 20); // May 20th (month is 0-indexed)

    // If anniversary has passed this year, use next year
    if (anniversaryDate < new Date()) {
      anniversaryDate = new Date(currentYear + 1, 4, 20);
    }

    return anniversaryDate;
  }

  /**
   * Update countdown display
   */
  updateCountdown(element, targetDate) {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      element.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
    } else {
      element.innerHTML =
        '<div class="countdown-complete">🎉 Happy Anniversary! 🎉</div>';
    }
  }

  /**
   * Initialize navigation
   */
  initializeNavigation() {
    // Highlight current page
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("nav a, .nav a");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href === currentPage ||
        (currentPage === "" && href === "index.html")
      ) {
        link.classList.add("active");
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  /**
   * Initialize page animations
   */
  initializeAnimations() {
    // Fade in animation for main content
    const mainContent = document.querySelector(
      "main, .main-content, .container",
    );
    if (mainContent) {
      mainContent.style.opacity = "0";
      mainContent.style.transform = "translateY(20px)";
      mainContent.style.transition = "opacity 0.8s ease, transform 0.8s ease";

      // Trigger animation
      setTimeout(() => {
        mainContent.style.opacity = "1";
        mainContent.style.transform = "translateY(0)";
      }, 100);
    }

    // Staggered animation for cards/sections
    const cards = document.querySelectorAll(".card, .section, .feature");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";

      setTimeout(
        () => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        },
        200 + index * 100,
      );
    });

    // Mark animations as complete
    setTimeout(() => {
      this.state.animationsComplete = true;
    }, 1000);
  }

  /**
   * Setup page interactions
   */
  setupInteractions() {
    // CTA button interactions
    const ctaButtons = document.querySelectorAll(".cta-button, .btn-primary");
    ctaButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.state.userInteracted = true;
        this.handleCTAClick(button);
      });
    });

    // Heart click interactions
    document.addEventListener("click", (e) => {
      if (e.target.closest(".heart, .heart-button")) {
        this.triggerHeartBurst(e.clientX, e.clientY);
      }
    });

    // Scroll interactions
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Handle CTA button clicks
   */
  handleCTAClick(button) {
    // Add ripple effect
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = rect.width / 2 - size / 2 + "px";
    ripple.style.top = rect.height / 2 - size / 2 + "px";

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    // Add ripple animation CSS if not exists
    if (!document.querySelector("#ripple-styles")) {
      const style = document.createElement("style");
      style.id = "ripple-styles";
      style.textContent = `
                @keyframes ripple {
                    to { transform: scale(4); opacity: 0; }
                }
            `;
      document.head.appendChild(style);
    }

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Trigger heart burst effect
   */
  triggerHeartBurst(x, y) {
    if (
      window.BackgroundComponents &&
      window.BackgroundComponents.triggerHeartBurst
    ) {
      window.BackgroundComponents.triggerHeartBurst(x, y);
    }
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Parallax effect for hero section
    const hero = document.querySelector(".hero, .banner");
    if (hero) {
      hero.style.transform = `translateY(${rate}px)`;
    }

    // Show/hide scroll-to-top button
    const scrollTop = document.querySelector(".scroll-to-top");
    if (scrollTop) {
      if (scrolled > 300) {
        scrollTop.style.opacity = "1";
        scrollTop.style.pointerEvents = "auto";
      } else {
        scrollTop.style.opacity = "0";
        scrollTop.style.pointerEvents = "none";
      }
    }
  }

  /**
   * Cleanup page resources
   */
  cleanup() {
    // Clear any intervals or timeouts
    // Remove event listeners if needed
    console.log("🏠 Index page cleanup completed");
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.indexPage = new IndexPage();
  });
} else {
  window.indexPage = new IndexPage();
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = IndexPage;
}
