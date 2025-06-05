/**
 * Surprise Flow Manager - Handles the surprise system logic
 */
class SurpriseFlowManager {
  constructor() {
    this.stages = {
      ENTRY: 'entry',           // surprise.html
      COUNTDOWN: 'countdown',   // countdown.html
      LOADING: 'loading',       // loading.html
      MAIN: 'main'             // index.html
    };
    this.storageKey = 'anniversary-surprise-completed';
    this.init();
  }
  init() {
    this.checkSurpriseStatus();
    this.setupEventListeners();
  }
  // Check if surprise has been completed
  isSurpriseCompleted() {
    return localStorage.getItem(this.storageKey) === 'true';
  }
  // Mark surprise as completed
  completeSurprise() {
    localStorage.setItem(this.storageKey, 'true');
    this.updateIndexPage();
  }
  // Check current surprise status and redirect if needed
  checkSurpriseStatus() {
    const currentPath = window.location.pathname;
    const isCompleted = this.isSurpriseCompleted();
    // If accessing main site without completing surprise, redirect to surprise
    if (currentPath.includes('index.html') && !isCompleted) {
      window.location.href = 'surprise.html';
      return;
    }
    // If surprise is completed and on surprise page, redirect to main
    if (currentPath.includes('surprise.html') && isCompleted) {
      window.location.href = 'index.html';
      return;
    }
  }
  // Update index page content after surprise completion
  updateIndexPage() {
    if (typeof document !== 'undefined') {
      // Add special class to body to indicate surprise completion
      document.body.classList.add('surprise-completed');
      // Update page title
      document.title = '💕 Happy Anniversary - Jerry & Soumya 💕';
      // Show special welcome message
      this.showWelcomeMessage();
    }
  }
  // Show welcome message after surprise completion
  showWelcomeMessage() {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'surprise-welcome-message';
    welcomeMessage.innerHTML = `
      <div class="glassmorphism p-6 rounded-2xl text-center max-w-md mx-auto mb-8">
        <div class="text-3xl mb-3">🎉</div>
        <h2 class="text-xl font-dancing text-pink-600 mb-2">
          Welcome to Our Love Story!
        </h2>
        <p class="text-gray-600 text-sm">
          The surprise has been revealed - enjoy exploring our beautiful memories together!
        </p>
      </div>
    `;
    // Insert at the top of main content
    const mainContent = document.querySelector('main') || document.body;
    const firstChild = mainContent.firstChild;
    mainContent.insertBefore(welcomeMessage, firstChild);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      welcomeMessage.style.opacity = '0';
      welcomeMessage.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (welcomeMessage.parentNode) {
          welcomeMessage.parentNode.removeChild(welcomeMessage);
        }
      }, 500);
    }, 5000);
  }
  // Setup event listeners
  setupEventListeners() {
    // Listen for storage changes (cross-tab synchronization)
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.checkSurpriseStatus();
      }
    });
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkSurpriseStatus();
      }
    });
  }
  // Reset surprise (for testing purposes)
  resetSurprise() {
    localStorage.removeItem(this.storageKey);
    window.location.href = 'surprise.html';
  }
  // Get current stage based on URL
  getCurrentStage() {
    const path = window.location.pathname;
    if (path.includes('surprise.html')) return this.stages.ENTRY;
    if (path.includes('countdown.html')) return this.stages.COUNTDOWN;
    if (path.includes('loading.html')) return this.stages.LOADING;
    if (this.isSurpriseCompleted()) return this.stages.MAIN;
    return this.stages.ENTRY;
  }
  // Navigate to next stage
  nextStage() {
    const currentStage = this.getCurrentStage();
    switch (currentStage) {
      case this.stages.ENTRY:
        window.location.href = 'src/pages-html/countdown.html';
        break;
      case this.stages.COUNTDOWN:
        window.location.href = 'loading.html';
        break;
      case this.stages.LOADING:
        this.completeSurprise();
        window.location.href = 'index.html';
        break;
    }
  }
}
// Enhanced Countdown Manager for surprise flow
class SurpriseCountdownManager {
  constructor() {
    this.targetDate = new Date('2025-06-16T00:00:00');
    this.redirectThreshold = 5; // seconds
    this.isRedirecting = false;
    this.surpriseFlow = new SurpriseFlowManager();
  }
  start(callback) {
    this.updateInterval = setInterval(() => {
      const timeData = this.getTimeRemaining();
      // Check for redirect condition
      if (timeData.totalSeconds <= this.redirectThreshold && !this.isRedirecting) {
        this.initiateRedirect();
      }
      callback(timeData);
    }, 1000);
  }
  getTimeRemaining() {
    const now = new Date();
    const timeLeft = this.targetDate.getTime() - now.getTime();
    if (timeLeft <= 0) {
      return { expired: true, totalSeconds: 0 };
    }
    return {
      expired: false,
      days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
      totalSeconds: Math.floor(timeLeft / 1000)
    };
  }
  initiateRedirect() {
    this.isRedirecting = true;
    // Hide navigation elements
    this.hideNavigationElements();
    // Show redirect message
    this.showRedirectMessage();
    // Redirect after delay
    setTimeout(() => {
      this.surpriseFlow.nextStage();
    }, 2000);
  }
  hideNavigationElements() {
    const elements = document.querySelectorAll('#navigationLinks, .nav-links, .quick-nav');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.9)';
      setTimeout(() => {
        el.style.display = 'none';
      }, 300);
    });
  }
  showRedirectMessage() {
    const redirectMsg = document.getElementById('redirectMessage');
    if (redirectMsg) {
      redirectMsg.style.display = 'block';
      redirectMsg.style.opacity = '0';
      redirectMsg.style.transform = 'scale(0.9)';
      setTimeout(() => {
        redirectMsg.style.opacity = '1';
        redirectMsg.style.transform = 'scale(1)';
        redirectMsg.style.transition = 'all 0.5s ease';
      }, 100);
    }
  }
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}
// Initialize surprise flow manager
let surpriseFlowManager;
let surpriseCountdownManager;
// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  surpriseFlowManager = new SurpriseFlowManager();
  surpriseCountdownManager = new SurpriseCountdownManager();
  });
// Export for global access
if (typeof window !== 'undefined') {
  window.surpriseFlowManager = surpriseFlowManager;
  window.surpriseCountdownManager = surpriseCountdownManager;
  // Add reset function for testing
  window.resetSurprise = () => {
    if (surpriseFlowManager) {
      surpriseFlowManager.resetSurprise();
    }
  };
}