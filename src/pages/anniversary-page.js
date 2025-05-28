/**
 * Anniversary Page JavaScript
 * Extracted from anniversary.html embedded scripts
 */

// Function to redirect to love story page with smooth transition
function redirectToLoveStory() {
  // Add a smooth transition effect before redirecting
  document.body.style.transition = "opacity 0.5s ease-out";
  document.body.style.opacity = "0.7";

  // Show a brief "Redirecting to Love Story..." message
  const redirectMessage = document.createElement("div");
  redirectMessage.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(236, 72, 153, 0.3);
            border-radius: 20px;
            padding: 30px 40px;
            box-shadow: 0 20px 40px rgba(236, 72, 153, 0.2);
            z-index: 9999;
            text-align: center;
            animation: fadeInScale 0.3s ease-out forwards;
        ">
            <div style="font-size: 2rem; margin-bottom: 10px;">💖</div>
            <div style="font-size: 1.2rem; color: #ec4899; font-weight: 600; margin-bottom: 5px;">
                Redirecting to Love Story...
            </div>
            <div style="font-size: 0.9rem; color: #666;">
                Preparing your romantic journey ✨
            </div>
        </div>
    `;

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
  document.head.appendChild(style);
  document.body.appendChild(redirectMessage);

  // Redirect after a brief delay for smooth UX
  setTimeout(() => {
    window.location.href = "love-story.html";
  }, 1200);
}

// Gallery navigation functions
function previousSlide() {
  // Implementation for previous slide
  console.log("Previous slide clicked");
}

function nextSlide() {
  // Implementation for next slide
  console.log("Next slide clicked");
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎯 Anniversary page loaded with unified systems");

  // Initialize unified integrator
  if (typeof AnniversaryWebsiteIntegrator !== "undefined") {
    const integrator = new AnniversaryWebsiteIntegrator();
    integrator
      .init()
      .then(() => {
        console.log("🎵 Unified systems initialized successfully");
      })
      .catch((error) => {
        console.error("Failed to initialize unified systems:", error);
        // Fallback initialization
        initFallbackSystems();
      });
  } else {
    // Fallback initialization
    initFallbackSystems();
  }

  function initFallbackSystems() {
    // Initialize AOS if available
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
      });
    }

    // Initialize Typed.js for text animation
    initTypedAnimation();

    // Initialize unified background components
    if (typeof BackgroundComponents !== "undefined") {
      const config = BackgroundComponents.getPageConfig("anniversary");
      BackgroundComponents.init(config);
    }
  }

  function initTypedAnimation() {
    if (typeof Typed !== "undefined") {
      new Typed("#typed-text", {
        strings: [
          "From that first smile emoji to endless memories... 😁💕",
          "Every moment with you feels like magic ✨",
          "Thank you for being my Jerry, my everything 🐒❤️",
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

  // Surprise button functionality
  const surpriseBtn = document.getElementById("surprise-btn");
  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", function () {
      // Trigger bubble burst effect if available
      if (
        window.unifiedBubbleAnimation &&
        window.unifiedBubbleAnimation.triggerBubbleBurst
      ) {
        window.unifiedBubbleAnimation.triggerBubbleBurst(this);
      }

      // Show surprise message
      alert(
        "🎉 Surprise! You are the most amazing person in my life, Puja! 💕",
      );
    });
  }
});

// Optional: Auto-redirect when scrolling to where the love story section would be
let hasAutoRedirected = false;

function checkScrollForRedirect() {
  if (hasAutoRedirected) return;

  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;

  // If user scrolls past 40% of the page (where love story section would be)
  if (scrollPosition > windowHeight * 0.4) {
    hasAutoRedirected = true;

    // Show a subtle popup asking if they want to see the love story
    const popup = document.createElement("div");
    popup.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, rgba(236, 72, 153, 0.95), rgba(239, 68, 68, 0.95));
                backdrop-filter: blur(10px);
                color: white;
                padding: 16px 24px;
                border-radius: 50px;
                box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3);
                z-index: 1000;
                text-align: center;
                animation: slideUpBounce 0.5s ease-out forwards;
                cursor: pointer;
                min-width: 300px;
            " onclick="redirectToLoveStory()">
                <div style="font-size: 1rem; font-weight: 600; margin-bottom: 4px;">
                    💖 Want to see our complete love story?
                </div>
                <div style="font-size: 0.85rem; opacity: 0.9;">
                    Click here for enhanced timeline with music! ✨
                </div>
            </div>
        `;

    // Add slide-up animation
    const slideStyle = document.createElement("style");
    slideStyle.textContent = `
            @keyframes slideUpBounce {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
    document.head.appendChild(slideStyle);
    document.body.appendChild(popup);

    // Auto-remove popup after 5 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.style.animation = "slideUpBounce 0.3s ease-out reverse forwards";
        setTimeout(() => popup.remove(), 300);
      }
    }, 5000);
  }
}

// Add scroll listener for auto-redirect suggestion
window.addEventListener("scroll", checkScrollForRedirect, { passive: true });
