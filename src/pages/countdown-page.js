/**
 * Countdown Page JavaScript
 * Extracted from countdown.html embedded scripts
 */

// Enhanced Music Integration with Cross-Page Sync
function setupEnhancedMusic() {
  // Enhanced Music Integration - simplified without test button
  if (typeof window.musicManager === "undefined") {
    setTimeout(setupEnhancedMusic, 100);
    return;
  }

  console.log("🎵 Enhanced music integration setup complete");
}

// Initialize particles.js with mobile detection
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

// Initialize Particles.js (same configuration as index.html for consistency)
if (typeof particlesJS !== "undefined") {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: isMobile ? 10 : 18,
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
        value: 0.4,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 2.5,
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
        distance: 120,
        color: "#ff6b9d",
        opacity: 0.3,
        width: 0.8,
      },
      move: {
        enable: true,
        speed: isMobile ? 0.6 : 1.2,
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
          particles_nb: 3,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  });
}

// Enhanced Countdown Logic with Dynamic Box Removal
class EnhancedCountdown {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate);
    this.elements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };
    this.containers = {
      days: document.getElementById("days").closest(".countdown-item"),
      hours: document.getElementById("hours").closest(".countdown-item"),
      minutes: document.getElementById("minutes").closest(".countdown-item"),
      seconds: document.getElementById("seconds").closest(".countdown-item"),
    };
    this.interval = null;
    this.removedBoxes = [];
    this.start();
  }

  start() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.onComplete();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update countdown numbers with animation
    this.animateNumber(this.elements.days, days);
    this.animateNumber(this.elements.hours, hours);
    this.animateNumber(this.elements.minutes, minutes);
    this.animateNumber(this.elements.seconds, seconds);

    // Handle dynamic box removal
    this.handleBoxRemoval(days, hours, minutes, seconds);

    // Update grid layout based on visible boxes (smooth version for regular updates)
    this.updateGridLayout();
  }

  handleBoxRemoval(days, hours, minutes, seconds) {
    // Remove days box when it reaches 0
    if (
      days === 0 &&
      !this.removedBoxes.includes("days") &&
      this.containers.days
    ) {
      this.removeBox("days");
    }

    // Remove hours box when it reaches 0 and days box is already removed
    if (
      hours === 0 &&
      days === 0 &&
      !this.removedBoxes.includes("hours") &&
      this.containers.hours
    ) {
      this.removeBox("hours");
    }

    // Remove minutes box when it reaches 0 and both days and hours boxes are removed
    if (
      minutes === 0 &&
      days === 0 &&
      hours === 0 &&
      !this.removedBoxes.includes("minutes") &&
      this.containers.minutes
    ) {
      this.removeBox("minutes");
    }
  }

  removeBox(boxType) {
    const container = this.containers[boxType];

    // Check if box is already removed or doesn't exist
    if (!container || this.removedBoxes.includes(boxType)) {
      console.log(`⚠️ Box ${boxType} already removed or doesn't exist`);
      return;
    }

    // Mark as removed immediately to prevent duplicate calls
    this.removedBoxes.push(boxType);
    console.log(
      `🎯 Marking ${boxType} box for removal. Removed boxes: [${this.removedBoxes.join(", ")}]`,
    );

    // Create blast particles before animation
    this.createBlastParticles(container);

    // Add enhanced blast animation class
    container.classList.add("removing");

    // Create additional visual effects
    this.createBlastRipple(container);

    setTimeout(() => {
      container.style.display = "none";
      console.log(`💥 Removed ${boxType} box with blast animation!`);

      // Trigger layout update with smooth transition
      this.updateGridLayoutSmooth();
    }, 1000); // Increased timeout to match blast animation duration
  }

  createBlastParticles(container) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create 12 blast particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "blast-particle";

      // Calculate particle direction
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 80 + Math.random() * 40; // 80-120px
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      particle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --dx: ${dx}px;
                --dy: ${dy}px;
                background: radial-gradient(circle,
                    hsl(${320 + Math.random() * 40}, 80%, 65%),
                    hsl(${300 + Math.random() * 60}, 70%, 55%)
                );
                animation-delay: ${Math.random() * 0.2}s;
            `;

      document.body.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1500);
    }
  }

  createBlastRipple(container) {
    const ripple = document.createElement("div");
    const rect = container.getBoundingClientRect();

    ripple.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(236, 72, 153, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 102;
            animation: rippleBlast 1s ease-out forwards;
        `;

    document.body.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 1000);
  }

  updateGridLayoutSmooth() {
    const countdownGrid = document.querySelector(".countdown-container .grid");
    if (countdownGrid) {
      // Calculate visible boxes, ensuring it's never negative
      const visibleBoxes = Math.max(0, 4 - this.removedBoxes.length);
      const isMobile = window.innerWidth <= 768;

      console.log(
        `🔄 Grid Layout Update: ${visibleBoxes} boxes, Mobile: ${isMobile}, Removed: [${this.removedBoxes.join(", ")}]`,
      );

      // Don't update if no boxes are visible
      if (visibleBoxes === 0) {
        console.log(`⚠️ No visible boxes remaining, skipping grid update`);
        return;
      }

      // Add transition for smooth layout change
      countdownGrid.style.transition = "all 0.5s ease-in-out";

      // Clear existing grid classes
      countdownGrid.className = countdownGrid.className.replace(
        /grid-cols-\d+/g,
        "",
      );
      countdownGrid.className = countdownGrid.className.replace(
        /md:grid-cols-\d+/g,
        "",
      );

      // Apply new grid classes based on visible boxes
      if (visibleBoxes === 4) {
        // 4 boxes: 2x2 on mobile, 1x4 on desktop
        countdownGrid.classList.add("grid-cols-2", "md:grid-cols-4");
      } else if (visibleBoxes === 3) {
        // 3 boxes: 1x3 row on mobile, 1x3 on desktop
        countdownGrid.classList.add("grid-cols-3", "md:grid-cols-3");
      } else if (visibleBoxes === 2) {
        // 2 boxes: 1x2 row on both mobile and desktop
        countdownGrid.classList.add("grid-cols-2", "md:grid-cols-2");
      } else if (visibleBoxes === 1) {
        // 1 box: centered on both mobile and desktop
        countdownGrid.classList.add("grid-cols-1", "md:grid-cols-1");
      }

      // Add mobile-specific class for special handling
      if (isMobile) {
        countdownGrid.classList.add("mobile-layout");
        console.log(`📱 Mobile layout applied: ${countdownGrid.className}`);
      } else {
        countdownGrid.classList.remove("mobile-layout");
        console.log(`🖥️ Desktop layout applied: ${countdownGrid.className}`);
      }

      // Remove transition after layout change
      setTimeout(() => {
        countdownGrid.style.transition = "";
      }, 500);
    }
  }

  updateGridLayout() {
    const countdownGrid = document.querySelector(".countdown-container .grid");
    if (countdownGrid) {
      // Calculate visible boxes, ensuring it's never negative
      const visibleBoxes = Math.max(0, 4 - this.removedBoxes.length);
      const isMobile = window.innerWidth <= 768;

      // Don't update if no boxes are visible
      if (visibleBoxes === 0) {
        return;
      }

      // Update grid classes based on visible boxes
      countdownGrid.className = countdownGrid.className.replace(
        /grid-cols-\d+/g,
        "",
      );
      countdownGrid.className = countdownGrid.className.replace(
        /md:grid-cols-\d+/g,
        "",
      );

      if (visibleBoxes === 4) {
        // 4 boxes: 2x2 on mobile, 1x4 on desktop
        countdownGrid.classList.add("grid-cols-2", "md:grid-cols-4");
      } else if (visibleBoxes === 3) {
        // 3 boxes: 1x3 row on mobile, 1x3 on desktop
        countdownGrid.classList.add("grid-cols-3", "md:grid-cols-3");
      } else if (visibleBoxes === 2) {
        // 2 boxes: 1x2 row on both mobile and desktop
        countdownGrid.classList.add("grid-cols-2", "md:grid-cols-2");
      } else if (visibleBoxes === 1) {
        // 1 box: centered on both mobile and desktop
        countdownGrid.classList.add("grid-cols-1", "md:grid-cols-1");
      }

      // Add mobile-specific class for special handling
      if (isMobile) {
        countdownGrid.classList.add("mobile-layout");
      } else {
        countdownGrid.classList.remove("mobile-layout");
      }
    }
  }

  animateNumber(element, newValue) {
    if (!element) return;

    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== newValue) {
      element.classList.add("updating");

      setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove("updating");
      }, 150);
    }
  }

  createExtraConfetti() {
    // Create more intense confetti for final countdown
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        this.createConfetti();
      }, i * 50);
    }
  }

  createConfetti() {
    const colors = [
      "#ff6b9d",
      "#ffa8cc",
      "#ffb3d6",
      "#ff8fab",
      "#a855f7",
      "#06b6d4",
    ];
    const confetti = document.createElement("div");

    confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 6}px;
            height: ${Math.random() * 8 + 6}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 9999;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
            animation: enhanced-confetti-fall ${Math.random() * 2 + 2}s linear forwards;
            box-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
        `;

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }

  onComplete() {
    console.log("🎊 Countdown Complete!");

    // Stop the countdown interval
    this.stop();

    // Update all displays to show zeros
    this.animateNumber(this.elements.days, 0);
    this.animateNumber(this.elements.hours, 0);
    this.animateNumber(this.elements.minutes, 0);
    this.animateNumber(this.elements.seconds, 0);

    // Show completion celebration
    this.showCompletionCelebration();

    // Start redirect countdown
    this.startRedirectCountdown();
  }

  showCompletionCelebration() {
    // Create full-screen celebration overlay
    const overlay = document.createElement("div");
    overlay.className = "completion-celebration";
    overlay.innerHTML = `
            <div class="celebration-content">
                <h1>🎉 Happy Anniversary! 🎉</h1>
                <p>The day has finally arrived!</p>
                <div class="celebration-hearts"></div>
                <div class="redirect-info">
                    <p>Redirecting to anniversary page in <span id="redirect-countdown">5</span> seconds...</p>
                    <button id="redirect-now" class="redirect-button">Go Now! 💕</button>
                </div>
            </div>
        `;

    // Add styles for the celebration overlay
    const style = document.createElement("style");
    style.textContent = `
            .completion-celebration {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #ff6b9d, #c44569, #f8b500);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: celebrationFadeIn 0.5s ease-out;
            }

            .celebration-content {
                text-align: center;
                color: white;
                max-width: 600px;
                padding: 2rem;
            }

            .celebration-content h1 {
                font-size: 3rem;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                animation: bounce 1s infinite alternate;
            }

            .celebration-content p {
                font-size: 1.5rem;
                margin-bottom: 2rem;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }

            .redirect-info {
                background: rgba(255,255,255,0.2);
                padding: 1.5rem;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                margin-top: 2rem;
            }

            .redirect-info p {
                font-size: 1.2rem;
                margin-bottom: 1rem;
            }

            #redirect-countdown {
                font-weight: bold;
                font-size: 1.5em;
                color: #ffeb3b;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }

            .redirect-button {
                background: linear-gradient(45deg, #ff4081, #e91e63);
                color: white;
                border: none;
                padding: 12px 30px;
                font-size: 1.1rem;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }

            .redirect-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                background: linear-gradient(45deg, #e91e63, #ad1457);
            }

            @keyframes celebrationFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }

            @keyframes bounce {
                from { transform: translateY(0); }
                to { transform: translateY(-10px); }
            }
        `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Setup immediate redirect button
    const redirectButton = overlay.querySelector("#redirect-now");
    if (redirectButton) {
      redirectButton.addEventListener("click", () => {
        this.redirectToAnniversary();
      });
    }

    // Trigger celebration effects
    this.triggerMassiveCelebration();
  }

  startRedirectCountdown() {
    let redirectSeconds = 5;
    const redirectCountdownElement =
      document.getElementById("redirect-countdown");

    // Update countdown display immediately
    if (redirectCountdownElement) {
      redirectCountdownElement.textContent = redirectSeconds;
    }

    // Start countdown interval
    const redirectInterval = setInterval(() => {
      redirectSeconds--;

      if (redirectCountdownElement) {
        redirectCountdownElement.textContent = redirectSeconds;

        // Add visual emphasis for last 3 seconds
        if (redirectSeconds <= 3) {
          redirectCountdownElement.style.animation = "pulse 0.5s ease-in-out";
          redirectCountdownElement.style.color = "#ff5722";
        }
      }

      // Redirect when countdown reaches 0
      if (redirectSeconds <= 0) {
        clearInterval(redirectInterval);
        this.redirectToAnniversary();
      }
    }, 1000);
  }

  redirectToAnniversary() {
    console.log("🎊 Redirecting to anniversary page...");

    // Add fade out effect before redirect
    const overlay = document.querySelector(".completion-celebration");
    if (overlay) {
      overlay.style.transition = "opacity 0.5s ease-out";
      overlay.style.opacity = "0";
    }

    // Perform redirect with fallback
    setTimeout(() => {
      try {
        // Try to use the history API for smoother transition
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, "anniversary.html");
          window.location.reload();
        } else {
          // Fallback to direct navigation
          window.location.href = "anniversary.html";
        }
      } catch (error) {
        console.error("Redirect error:", error);
        // Ultimate fallback
        window.location.replace("anniversary.html");
      }
    }, 500);
  }

  triggerMassiveCelebration() {
    // Create massive bubble burst at center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    createCountdownBubbleBurst(centerX, centerY);

    // Multiple bursts with delays using unified system
    const burstConfig = { bubbleDensity: "high" };
    setTimeout(
      () =>
        window.BackgroundComponents?.bubbleAnimation?.createBubbleBurst(
          centerX - 100,
          centerY - 50,
          8,
        ),
      200,
    );
    setTimeout(
      () =>
        window.BackgroundComponents?.bubbleAnimation?.createBubbleBurst(
          centerX + 100,
          centerY - 50,
          8,
        ),
      400,
    );
    setTimeout(
      () =>
        window.BackgroundComponents?.bubbleAnimation?.createBubbleBurst(
          centerX,
          centerY + 100,
          8,
        ),
      600,
    );
    setTimeout(
      () =>
        window.BackgroundComponents?.bubbleAnimation?.createBubbleBurst(
          centerX - 50,
          centerY + 50,
          8,
        ),
      800,
    );
    setTimeout(
      () =>
        window.BackgroundComponents?.bubbleAnimation?.createBubbleBurst(
          centerX + 50,
          centerY - 100,
          8,
        ),
      1000,
    );

    // Create extra confetti
    this.createExtraConfetti();
  }
}

// Global variable to store countdown instance
let countdownInstance = null;

// Initialize countdown when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Initialize unified integrator
  if (typeof AnniversaryWebsiteIntegrator !== "undefined") {
    const integrator = new AnniversaryWebsiteIntegrator();
    await integrator.init();
  } else {
    // Fallback initialization
    // Set target date (June 16, 2025 for anniversary)
    const targetDate = "June 16, 2025 00:00:00";
    countdownInstance = new EnhancedCountdown(targetDate);

    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });

    // Setup enhanced music
    setupEnhancedMusic();

    // Initialize typewriter effect
    setTimeout(function () {
      if (typeof Typed !== "undefined") {
        new Typed("#typed-text", {
          strings: [
            "Every second ⏳ draws us closer to our day 💑",
            "Time slows 🕰️ when love ❤️ is near",
            "Each moment ⌛ counts on the way to forever ♾️",
            "Our hearts 💓 beat with the countdown ⏰",
          ],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 2000,
          startDelay: 500,
          loop: true,
          showCursor: true,
          cursorChar: "|",
          autoInsertCss: true,
        });
      }
    }, 1000);
  }

  // Add resize handler for responsive layout
  window.addEventListener("resize", function () {
    if (countdownInstance) {
      // Debounce resize events
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        countdownInstance.updateGridLayout();
      }, 250);
    }
  });

  console.log("🎯 Enhanced Countdown Initialized with unified systems!");
});
