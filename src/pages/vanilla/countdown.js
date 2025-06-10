/**
 * Vanilla JavaScript Countdown Page - Anniversary Website v4.0.0
 * JavaScript-first implementation with romantic countdown timer
 */

class VanillaCountdownPage {
  constructor() {
    this.container = null;
    this.countdownTimer = null;
    this.targetDate = new Date('2024-07-01T00:00:00'); // Next special moment
    this.timeUnits = [];
    this.isVisible = true;
    
    // Animation settings
    this.pulseAnimation = null;
    this.particleSystem = null;
    
    this.init();
  }

  init() {
    this.bindMethods();
  }

  bindMethods() {
    this.updateCountdown = this.updateCountdown.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  async mount(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error('Countdown Page: Mount element not found:', selector);
      return;
    }

    // Clear container
    this.container.innerHTML = '';
    
    // Render page
    this.render();
    
    // Start countdown timer
    this.startCountdown();
    
    // Initialize animations
    this.initializeAnimations();
    
    // Initialize particle system
    this.initializeParticleSystem();
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Show welcome notification
    this.showCountdownNotification();
    
    console.log('⏰ Countdown Page mounted');
    return this;
  }

  render() {
    this.container.innerHTML = `
      <div class="vanilla-countdown-page">
        ${this.renderFloatingBubbles()}
        
        <div class="countdown-content">
          ${this.renderHeader()}
          ${this.renderCountdownDisplay()}
          ${this.renderMessage()}
          ${this.renderProgress()}
          ${this.renderNavigation()}
        </div>
      </div>
    `;
  }

  renderFloatingBubbles() {
    return `
      <div class="floating-bubbles">
        ${Array.from({ length: 12 }, (_, i) => `
          <div class="bubble bubble-${i + 1}" style="--delay: ${i * 0.3}s"></div>
        `).join('')}
      </div>
    `;
  }

  renderHeader() {
    return `
      <div class="countdown-header">
        <h1 class="countdown-title">
          <span class="icon pulse-animation">⏰</span>
          Countdown to Our Next Adventure
          <span class="icon pulse-animation">💕</span>
        </h1>
        <p class="countdown-subtitle">
          <span class="icon">✨</span>
          Our love story continues...
          <span class="icon">✨</span>
        </p>
      </div>
    `;
  }

  renderCountdownDisplay() {
    const timeLeft = this.calculateTimeLeft();
    
    return `
      <div class="countdown-display">
        <div class="time-units-grid">
          <div class="time-unit" data-unit="days">
            <div class="time-value" id="countdown-days">${timeLeft.days}</div>
            <div class="time-label">Days</div>
            <div class="time-unit-glow"></div>
          </div>
          
          <div class="time-unit" data-unit="hours">
            <div class="time-value" id="countdown-hours">${timeLeft.hours}</div>
            <div class="time-label">Hours</div>
            <div class="time-unit-glow"></div>
          </div>
          
          <div class="time-unit" data-unit="minutes">
            <div class="time-value" id="countdown-minutes">${timeLeft.minutes}</div>
            <div class="time-label">Minutes</div>
            <div class="time-unit-glow"></div>
          </div>
          
          <div class="time-unit" data-unit="seconds">
            <div class="time-value" id="countdown-seconds">${timeLeft.seconds}</div>
            <div class="time-label">Seconds</div>
            <div class="time-unit-glow"></div>
          </div>
        </div>
      </div>
    `;
  }

  renderMessage() {
    return `
      <div class="countdown-message">
        <h2 class="message-title">
          <span class="icon">🌟</span>
          Until Our Next Special Moment
        </h2>
        <div class="message-content">
          <p class="message-text">
            Every second brings us closer to another beautiful chapter in our love story.
            Time may pass, but our love only grows stronger with each moment we share.
          </p>
          <div class="romantic-quote">
            <span class="quote-icon">💕</span>
            "In your smile, I see something more beautiful than the stars."
            <span class="quote-icon">💕</span>
          </div>
        </div>
      </div>
    `;
  }

  renderProgress() {
    const progress = this.calculateProgress();
    
    return `
      <div class="countdown-progress">
        <h3 class="progress-title">
          <span class="icon">📈</span>
          Journey Progress
        </h3>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
            <div class="progress-glow"></div>
          </div>
          <div class="progress-label">${progress.toFixed(1)}% of this chapter completed</div>
        </div>
      </div>
    `;
  }

  renderNavigation() {
    return `
      <div class="countdown-navigation">
        <button class="nav-button primary" id="back-home">
          <span class="button-icon">🏠</span>
          Back to Home
        </button>
        <button class="nav-button secondary" id="view-memories">
          <span class="button-icon">📸</span>
          View Memories
        </button>
      </div>
    `;
  }

  calculateTimeLeft() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;
    
    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  }

  calculateProgress() {
    const startDate = new Date('2024-06-16T00:00:00'); // Our beginning
    const now = new Date().getTime();
    const total = this.targetDate.getTime() - startDate.getTime();
    const elapsed = now - startDate.getTime();
    
    return Math.min((elapsed / total) * 100, 100);
  }

  updateCountdown() {
    if (!this.isVisible) return;
    
    const timeLeft = this.calculateTimeLeft();
    const progress = this.calculateProgress();
    
    // Update time values with animation
    this.updateTimeValue('countdown-days', timeLeft.days);
    this.updateTimeValue('countdown-hours', timeLeft.hours);
    this.updateTimeValue('countdown-minutes', timeLeft.minutes);
    this.updateTimeValue('countdown-seconds', timeLeft.seconds);
    
    // Update progress bar
    const progressFill = this.container.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress.toFixed(1)}%`;
    }
    
    const progressLabel = this.container.querySelector('.progress-label');
    if (progressLabel) {
      progressLabel.textContent = `${progress.toFixed(1)}% of this chapter completed`;
    }
    
    // Check if countdown reached zero
    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      this.celebrateCountdownComplete();
    }
  }

  updateTimeValue(elementId, newValue) {
    const element = this.container.querySelector(`#${elementId}`);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent);
    if (currentValue !== newValue) {
      // Add update animation
      element.classList.add('value-changing');
      setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove('value-changing');
      }, 150);
    }
  }

  startCountdown() {
    // Initial update
    this.updateCountdown();
    
    // Start interval
    this.countdownTimer = setInterval(this.updateCountdown, 1000);
  }

  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  initializeAnimations() {
    // Animate time units on entry
    const timeUnits = this.container.querySelectorAll('.time-unit');
    timeUnits.forEach((unit, index) => {
      setTimeout(() => {
        unit.classList.add('animate-entry');
      }, index * 200);
    });
    
    // Pulse animation for icons
    const icons = this.container.querySelectorAll('.pulse-animation');
    icons.forEach(icon => {
      icon.classList.add('pulse');
    });
  }

  initializeParticleSystem() {
    // Create romantic particles
    const particles = ['💕', '✨', '🌟', '💫', '❤️', '💖', '🎀', '🌸'];
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'countdown-particle';
      particle.textContent = particles[Math.floor(Math.random() * particles.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      
      this.container.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 10000);
    };
    
    // Create particles periodically
    this.particleSystem = setInterval(createParticle, 3000);
  }

  attachEventListeners() {
    // Navigation buttons
    const backHomeButton = this.container.querySelector('#back-home');
    const viewMemoriesButton = this.container.querySelector('#view-memories');
    
    if (backHomeButton) {
      backHomeButton.addEventListener('click', () => {
        this.navigateToPage('home');
      });
    }
    
    if (viewMemoriesButton) {
      viewMemoriesButton.addEventListener('click', () => {
        this.navigateToPage('photo-gallery');
      });
    }
    
    // Visibility change handling
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Window resize
    window.addEventListener('resize', this.handleResize);
    
    // Time unit interactions
    const timeUnits = this.container.querySelectorAll('.time-unit');
    timeUnits.forEach(unit => {
      unit.addEventListener('click', () => {
        this.celebrateTimeUnit(unit);
      });
    });
  }

  removeEventListeners() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('resize', this.handleResize);
  }

  handleVisibilityChange() {
    this.isVisible = !document.hidden;
    if (this.isVisible) {
      this.updateCountdown();
    }
  }

  handleResize() {
    // Adjust layout for mobile
    const isMobile = window.innerWidth < 768;
    const timeUnitsGrid = this.container.querySelector('.time-units-grid');
    
    if (timeUnitsGrid) {
      if (isMobile) {
        timeUnitsGrid.classList.add('mobile-layout');
      } else {
        timeUnitsGrid.classList.remove('mobile-layout');
      }
    }
  }

  celebrateTimeUnit(unit) {
    // Add celebration effect
    unit.classList.add('celebrating');
    
    // Create sparkle effect
    const sparkles = ['✨', '🌟', '💫'];
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'time-unit-sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        
        unit.appendChild(sparkle);
        
        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
          }
        }, 1000);
      }, i * 100);
    }
    
    setTimeout(() => {
      unit.classList.remove('celebrating');
    }, 1000);
  }

  celebrateCountdownComplete() {
    // Stop the countdown
    this.stopCountdown();
    
    // Show celebration
    const celebration = document.createElement('div');
    celebration.className = 'countdown-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <h2>🎉 The Moment Has Arrived! 🎉</h2>
        <p>Our next beautiful adventure begins now!</p>
        <div class="celebration-hearts">
          💕 ❤️ 💖 💕 ❤️ 💖 💕
        </div>
      </div>
    `;
    
    this.container.appendChild(celebration);
    
    setTimeout(() => {
      celebration.classList.add('show');
    }, 100);
  }

  navigateToPage(pageId) {
    // Add navigation effect
    this.container.classList.add('page-exit');
    
    setTimeout(() => {
      if (window.anniversaryCore?.router) {
        window.anniversaryCore.router.navigate(`/${pageId}`);
      } else {
        window.location.hash = `#/${pageId}`;
      }
    }, 300);
  }

  showCountdownNotification() {
    if (window.globalState?.notificationSystem) {
      window.globalState.notificationSystem.show({
        type: 'success',
        title: '⏰ Countdown Started!',
        message: 'Watching time until our next special moment...',
        duration: 3000
      });
    }
  }

  destroy() {
    // Stop countdown timer
    this.stopCountdown();
    
    // Stop particle system
    if (this.particleSystem) {
      clearInterval(this.particleSystem);
      this.particleSystem = null;
    }
    
    // Remove event listeners
    this.removeEventListeners();
    
    console.log('⏰ Countdown Page destroyed');
  }
}

// CSS styles for the countdown page
const countdownPageStyles = `
  .vanilla-countdown-page {
    min-height: 100vh;
    position: relative;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
  }

  .countdown-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 10;
  }

  .countdown-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .countdown-title {
    font-size: 3rem;
    font-weight: 700;
    background: var(--gradient-romantic);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(236, 72, 153, 0.3);
  }

  .countdown-subtitle {
    font-size: 1.5rem;
    color: var(--text-secondary);
    font-weight: 300;
  }

  .countdown-display {
    margin: 4rem 0;
  }

  .time-units-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .time-unit {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 16px;
    padding: 2rem 1rem;
    text-align: center;
    position: relative;
    cursor: pointer;
    transition: all 0.4s ease;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }

  .time-unit.animate-entry {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .time-unit:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
    border-color: var(--accent-romantic);
  }

  .time-unit.celebrating {
    animation: celebrate 1s ease-in-out;
  }

  .time-value {
    font-size: 3rem;
    font-weight: 700;
    color: var(--glow-romantic);
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
  }

  .time-value.value-changing {
    transform: scale(1.2);
    color: var(--accent-romantic);
  }

  .time-label {
    font-size: 1rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
  }

  .time-unit-glow {
    position: absolute;
    inset: -1px;
    background: var(--gradient-romantic);
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  .time-unit:hover .time-unit-glow {
    opacity: 0.2;
  }

  .countdown-message {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 16px;
    padding: 2rem;
    margin: 3rem 0;
    text-align: center;
    backdrop-filter: blur(20px);
  }

  .message-title {
    font-size: 2rem;
    color: var(--glow-romantic);
    margin-bottom: 1.5rem;
  }

  .message-text {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .romantic-quote {
    font-size: 1.2rem;
    font-style: italic;
    color: var(--text-accent);
    padding: 1rem;
    border-left: 3px solid var(--accent-romantic);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .countdown-progress {
    margin: 3rem 0;
  }

  .progress-title {
    text-align: center;
    font-size: 1.5rem;
    color: var(--glow-romantic);
    margin-bottom: 1rem;
  }

  .progress-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: var(--gradient-romantic);
    border-radius: 4px;
    transition: width 1s ease;
    position: relative;
  }

  .progress-glow {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--gradient-romantic);
    border-radius: 6px;
    opacity: 0.3;
    filter: blur(4px);
    z-index: -1;
  }

  .progress-label {
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .countdown-navigation {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;
  }

  .nav-button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-button.primary {
    background: var(--gradient-romantic);
    color: var(--text-primary);
    box-shadow: 0 4px 16px var(--shadow-romantic);
  }

  .nav-button.secondary {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-romantic);
  }

  .nav-button:hover {
    transform: translateY(-3px) scale(1.05);
  }

  .nav-button.primary:hover {
    box-shadow: 0 8px 24px var(--shadow-glow);
  }

  .nav-button.secondary:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent-romantic);
  }

  .floating-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .bubble {
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    border-radius: 50%;
    animation: float-bubble 10s infinite linear;
    animation-delay: var(--delay);
  }

  .countdown-particle {
    position: absolute;
    font-size: 1.5rem;
    opacity: 0.7;
    pointer-events: none;
    z-index: 5;
    animation: particle-float 10s linear infinite;
  }

  .time-unit-sparkle {
    position: absolute;
    font-size: 1rem;
    opacity: 1;
    pointer-events: none;
    z-index: 20;
    animation: sparkle-burst 1s ease-out forwards;
  }

  .countdown-celebration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .countdown-celebration.show {
    opacity: 1;
  }

  .celebration-content {
    text-align: center;
    color: white;
    padding: 2rem;
  }

  .celebration-hearts {
    font-size: 2rem;
    margin-top: 1rem;
    animation: celebration-bounce 1s ease-in-out infinite;
  }

  /* Animations */
  @keyframes float-bubble {
    0% {
      transform: translateY(100vh) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
      transform: translateY(90vh) scale(1);
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-10vh) scale(0);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }

  .pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes celebrate {
    0%, 100% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.1) rotate(-5deg);
    }
    50% {
      transform: scale(1.2) rotate(0deg);
    }
    75% {
      transform: scale(1.1) rotate(5deg);
    }
  }

  @keyframes particle-float {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(-10vh) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes sparkle-burst {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1) rotate(180deg);
      opacity: 0.8;
    }
    100% {
      transform: scale(0) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes celebration-bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .page-exit {
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.3s ease;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .countdown-content {
      padding: 1rem;
    }

    .countdown-title {
      font-size: 2rem;
    }

    .countdown-subtitle {
      font-size: 1.2rem;
    }

    .time-units-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .time-unit {
      padding: 1.5rem 1rem;
    }

    .time-value {
      font-size: 2rem;
    }

    .countdown-navigation {
      flex-direction: column;
      align-items: center;
    }

    .nav-button {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .time-units-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .time-value {
      font-size: 2.5rem;
    }

    .countdown-title {
      font-size: 1.8rem;
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = countdownPageStyles;
document.head.appendChild(styleElement);

// Make VanillaCountdownPage globally available
window.VanillaCountdownPage = VanillaCountdownPage;

export default VanillaCountdownPage;
