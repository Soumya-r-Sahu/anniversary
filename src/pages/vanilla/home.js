/**
 * Vanilla JavaScript Home Page - Anniversary Website v4.0.0
 * Pure JavaScript implementation replacing React HomePage
 */

class VanillaHomePage {
  constructor() {
    this.currentMessageIndex = 0;
    this.typedText = '';
    this.isTyping = true;
    this.typewriterTimer = null;
    this.timeCalculator = null;
    this.animations = new Set();
    
    this.messages = [
      "From June 16, 2024 to forever... ✨",
      "Every moment with you is magical.. 🌟",
      "You are my greatest blessing 💕",
      "My sweet Jerry, my everything ❤️",
      "Together we create beautiful memories 📸",
      "Our love story continues to unfold 📖"
    ];

    this.navigationItems = [
      {
        id: 'love-story',
        title: 'Our Love Story',
        description: 'Journey through our beautiful story',
        icon: '📖',
        color: 'from-pink-500 to-rose-500',
        delay: 0.1
      },
      {
        id: 'photo-gallery',
        title: 'Photo Gallery',
        description: 'Cherished memories captured',
        icon: '📷',
        color: 'from-purple-500 to-pink-500',
        delay: 0.2
      },
      {
        id: 'anniversary',
        title: 'Anniversary',
        description: 'Celebrating our special day',
        icon: '💕',
        color: 'from-red-500 to-pink-500',
        delay: 0.3
      },
      {
        id: 'music-playlist',
        title: 'Our Songs',
        description: 'Music that tells our story',
        icon: '🎵',
        color: 'from-indigo-500 to-purple-500',
        delay: 0.4
      },
      {
        id: 'countdown',
        title: 'Countdown',
        description: 'Time since we found each other',
        icon: '📅',
        color: 'from-emerald-500 to-teal-500',
        delay: 0.5
      },
      {
        id: 'special-dates',
        title: 'Special Dates',
        description: 'Milestones in our journey',
        icon: '✨',
        color: 'from-yellow-500 to-orange-500',
        delay: 0.6
      }
    ];
    
    this.init();
  }

  init() {
    this.bindMethods();
  }

  bindMethods() {
    this.typewriterEffect = this.typewriterEffect.bind(this);
    this.handleJourneyStart = this.handleJourneyStart.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  async mount(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error('Home Page: Mount element not found:', selector);
      return;
    }

    // Clear container
    this.container.innerHTML = '';
    
    // Render page
    this.render();
    
    // Initialize typewriter effect
    this.startTypewriter();
    
    // Initialize time calculator
    this.initTimeCalculator();
    
    // Start animations
    this.startAnimations();
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Show welcome notification
    this.showWelcomeNotification();
    
    console.log('🏠 Home Page mounted');
    return this;
  }

  render() {
    this.container.innerHTML = `
      <div class="vanilla-home-page">
        ${this.renderFloatingBubbles()}
        
        <div class="home-content">
          ${this.renderWelcomeSection()}
          ${this.renderTimeCalculatorSection()}
          ${this.renderNavigationCards()}
          ${this.renderFooter()}
        </div>
      </div>
    `;
  }

  renderFloatingBubbles() {
    return `
      <div class="floating-bubbles">
        ${Array.from({ length: 8 }, (_, i) => `
          <div class="bubble bubble-${i + 1}" style="--delay: ${i * 0.5}s"></div>
        `).join('')}
      </div>
    `;
  }

  renderWelcomeSection() {
    return `
      <section class="welcome-section">
        <div class="welcome-content">
          <h1 class="main-title">
            <span class="heart-icon">💕</span>
            For My Sweet Jerry
            <span class="heart-icon">💕</span>
          </h1>
          
          <h2 class="subtitle">
            My Dearest <span class="highlight-name">Pujuu (Jerry)</span> 🐭
          </h2>
          
          <div class="typewriter-container">
            <span class="typewriter-text" id="typewriter-text"></span>
            <span class="typewriter-cursor">|</span>
          </div>
          
          <div class="cta-container">
            <button class="journey-button" id="journey-button">
              <span class="button-icon">✨</span>
              Start Our Anniversary Journey
              <span class="button-icon">📅</span>
            </button>
          </div>
          
          <p class="author-signature">
            With all my love, Your Mankada (Soumya) 💖
          </p>
        </div>
      </section>
    `;
  }

  renderTimeCalculatorSection() {
    return `
      <section class="time-calculator-section">
        <div id="home-time-calculator"></div>
      </section>
    `;
  }

  renderNavigationCards() {
    return `
      <section class="navigation-section">
        <div class="navigation-grid">
          ${this.navigationItems.map(item => `
            <div class="nav-card" data-page="${item.id}" data-delay="${item.delay}">
              <div class="nav-card-inner">
                <div class="nav-card-front">
                  <div class="card-icon">${item.icon}</div>
                  <h3 class="card-title">${item.title}</h3>
                  <p class="card-description">${item.description}</p>
                  <div class="card-hover-overlay"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  renderFooter() {
    return `
      <footer class="home-footer">
        <p class="footer-quote">
          "Every love story is beautiful, but ours is my favorite" 💕
        </p>
        <div class="footer-credits">
          <span class="heart-icon">💕</span>
          <span>Made with love for Jerry</span>
          <span class="heart-icon">💕</span>
        </div>
      </footer>
    `;
  }

  startTypewriter() {
    this.typewriterEffect();
  }

  typewriterEffect() {
    const textElement = document.getElementById('typewriter-text');
    if (!textElement) return;
    
    const currentMessage = this.messages[this.currentMessageIndex];
    
    if (this.isTyping) {
      if (this.typedText.length < currentMessage.length) {
        this.typedText = currentMessage.slice(0, this.typedText.length + 1);
        textElement.textContent = this.typedText;
        this.typewriterTimer = setTimeout(this.typewriterEffect, 50);
      } else {
        this.typewriterTimer = setTimeout(() => {
          this.isTyping = false;
          this.typewriterEffect();
        }, 2000);
      }
    } else {
      if (this.typedText.length > 0) {
        this.typedText = this.typedText.slice(0, -1);
        textElement.textContent = this.typedText;
        this.typewriterTimer = setTimeout(this.typewriterEffect, 30);
      } else {
        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
        this.isTyping = true;
        this.typewriterTimer = setTimeout(this.typewriterEffect, 500);
      }
    }
  }

  initTimeCalculator() {
    // Import and initialize the VanillaTimeCalculator
    const calculator = new window.VanillaTimeCalculator({
      showMilestones: true,
      showAnalytics: true,
      className: 'home-time-calculator'
    });
    
    calculator.mount('#home-time-calculator');
    this.timeCalculator = calculator;
  }

  startAnimations() {
    // Animate welcome section
    this.animateWelcomeSection();
    
    // Animate navigation cards
    this.animateNavigationCards();
    
    // Animate floating bubbles
    this.animateFloatingBubbles();
  }

  animateWelcomeSection() {
    const welcomeSection = this.container.querySelector('.welcome-section');
    if (welcomeSection) {
      welcomeSection.classList.add('animate-fade-in');
    }
    
    // Stagger animation for welcome elements
    const welcomeElements = [
      '.main-title',
      '.subtitle',
      '.typewriter-container',
      '.cta-container',
      '.author-signature'
    ];
    
    welcomeElements.forEach((selector, index) => {
      const element = this.container.querySelector(selector);
      if (element) {
        element.style.animationDelay = `${index * 0.2}s`;
        element.classList.add('animate-slide-up');
      }
    });
  }

  animateNavigationCards() {
    const navCards = this.container.querySelectorAll('.nav-card');
    navCards.forEach((card, index) => {
      const delay = parseFloat(card.getAttribute('data-delay'));
      card.style.animationDelay = `${delay}s`;
      card.classList.add('animate-card-entry');
    });
  }

  animateFloatingBubbles() {
    const bubbles = this.container.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
      bubble.classList.add('animate-float');
    });
  }

  attachEventListeners() {
    // Journey button
    const journeyButton = this.container.querySelector('#journey-button');
    if (journeyButton) {
      journeyButton.addEventListener('click', this.handleJourneyStart);
    }
    
    // Navigation cards
    const navCards = this.container.querySelectorAll('.nav-card');
    navCards.forEach(card => {
      card.addEventListener('click', (event) => {
        const pageId = card.getAttribute('data-page');
        this.navigateToPage(pageId, event);
      });
      
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
    
    // Window resize
    window.addEventListener('resize', this.handleResize);
  }

  removeEventListeners() {
    const journeyButton = this.container.querySelector('#journey-button');
    if (journeyButton) {
      journeyButton.removeEventListener('click', this.handleJourneyStart);
    }
    
    window.removeEventListener('resize', this.handleResize);
  }

  handleJourneyStart() {
    // Add click animation
    const button = this.container.querySelector('#journey-button');
    if (button) {
      button.classList.add('clicked');
      setTimeout(() => button.classList.remove('clicked'), 300);
    }
    
    // Show notification
    this.showJourneyNotification();
    
    // Navigate to countdown page
    setTimeout(() => {
      this.navigateToPage('countdown');
    }, 500);
  }

  navigateToPage(pageId, event = null) {
    if (event) {
      this.addRippleEffect(event.currentTarget, event);
    }
    
    // Use the router to navigate
    if (window.anniversaryCore?.router) {
      window.anniversaryCore.router.navigate(`/${pageId}`);
    } else {
      // Fallback to hash navigation
      window.location.hash = pageId;
    }
  }

  addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  showWelcomeNotification() {
    // Show welcome notification if notification system is available
    if (window.anniversaryCore?.getState) {
      const state = window.anniversaryCore.getState();
      state.setState('notification:show', {
        type: 'love',
        title: 'Welcome to Our Love Story! 🎉',
        message: 'Welcome to our beautiful anniversary website, my sweet Jerry! 💕',
        duration: 5000
      });
    }
  }

  showJourneyNotification() {
    if (window.anniversaryCore?.getState) {
      const state = window.anniversaryCore.getState();
      state.setState('notification:show', {
        type: 'love',
        title: 'Journey Started! 🎉',
        message: 'Welcome to our beautiful love story, my sweet Jerry! 💕',
        duration: 3000
      });
    }
  }

  handleResize() {
    // Handle responsive changes
    const isMobile = window.innerWidth < 768;
    this.container.classList.toggle('mobile-layout', isMobile);
  }

  destroy() {
    // Stop typewriter
    if (this.typewriterTimer) {
      clearTimeout(this.typewriterTimer);
    }
    
    // Destroy time calculator
    if (this.timeCalculator) {
      this.timeCalculator.destroy();
    }
    
    // Remove event listeners
    this.removeEventListeners();
    
    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    console.log('🏠 Home Page destroyed');
  }
}

// CSS styles for the home page
const homePageStyles = `
  .vanilla-home-page {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    background: var(--bg-base);
    color: var(--text-primary);
  }

  .floating-bubbles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .bubble {
    position: absolute;
    background: radial-gradient(circle, rgba(255, 123, 138, 0.3) 0%, rgba(255, 123, 138, 0.1) 70%);
    border-radius: 50%;
    animation: float 8s infinite ease-in-out;
  }

  .bubble-1 { width: 60px; height: 60px; left: 10%; animation-delay: 0s; }
  .bubble-2 { width: 40px; height: 40px; left: 20%; animation-delay: 1s; }
  .bubble-3 { width: 80px; height: 80px; left: 35%; animation-delay: 2s; }
  .bubble-4 { width: 50px; height: 50px; right: 30%; animation-delay: 3s; }
  .bubble-5 { width: 70px; height: 70px; right: 15%; animation-delay: 4s; }
  .bubble-6 { width: 45px; height: 45px; left: 60%; animation-delay: 5s; }
  .bubble-7 { width: 65px; height: 65px; left: 75%; animation-delay: 6s; }
  .bubble-8 { width: 55px; height: 55px; right: 45%; animation-delay: 7s; }

  .home-content {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .welcome-section {
    text-align: center;
    padding: 4rem 0;
    margin-bottom: 3rem;
  }

  .main-title {
    font-size: 4rem;
    font-weight: bold;
    background: var(--gradient-romantic);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .heart-icon {
    color: var(--glow-romantic);
    margin: 0 1rem;
    display: inline-block;
    animation: heartbeat 2s infinite;
  }

  .subtitle {
    font-size: 2rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .highlight-name {
    color: var(--glow-romantic);
    font-weight: bold;
  }

  .typewriter-container {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 2rem;
    margin: 2rem auto;
    max-width: 600px;
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-romantic);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .typewriter-text {
    font-size: 1.25rem;
    color: var(--text-primary);
    min-height: 1.5em;
    display: inline-block;
  }

  .typewriter-cursor {
    color: var(--glow-romantic);
    animation: blink 1s infinite;
    font-weight: bold;
  }

  .cta-container {
    margin: 3rem 0;
  }

  .journey-button {
    background: var(--gradient-romantic);
    color: var(--text-primary);
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px var(--shadow-romantic);
    position: relative;
    overflow: hidden;
  }

  .journey-button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 24px var(--shadow-glow);
  }

  .journey-button.clicked {
    transform: scale(0.95);
  }

  .button-icon {
    margin: 0 0.5rem;
  }

  .author-signature {
    font-size: 1.1rem;
    color: var(--text-accent);
    font-style: italic;
    margin-top: 2rem;
  }

  .time-calculator-section {
    margin: 4rem 0;
  }

  .navigation-section {
    margin: 4rem 0;
  }

  .navigation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .nav-card {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 16px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .nav-card:hover,
  .nav-card.hovered {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
    border-color: var(--accent-2);
  }

  .card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .card-description {
    color: var(--text-secondary);
    text-align: center;
    line-height: 1.5;
  }

  .card-hover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-heart);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .nav-card:hover .card-hover-overlay {
    opacity: 0.1;
  }

  .home-footer {
    text-align: center;
    padding: 3rem 0;
    margin-top: 4rem;
    border-top: 1px solid var(--border-subtle);
  }

  .footer-quote {
    font-size: 1.25rem;
    color: var(--text-accent);
    margin-bottom: 1rem;
    font-style: italic;
  }

  .footer-credits {
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 248, 246, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }

  /* Animations */
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
    }
    25% {
      transform: translateY(-20px) translateX(10px);
    }
    50% {
      transform: translateY(-40px) translateX(-5px);
    }
    75% {
      transform: translateY(-20px) translateX(-10px);
    }
  }

  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes card-entry {
    from {
      opacity: 0;
      transform: translateY(50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 1s ease-out forwards;
  }

  .animate-slide-up {
    animation: slide-up 0.8s ease-out forwards;
    opacity: 0;
  }

  .animate-card-entry {
    animation: card-entry 0.6s ease-out forwards;
    opacity: 0;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .home-content {
      padding: 1rem;
    }

    .main-title {
      font-size: 2.5rem;
    }

    .subtitle {
      font-size: 1.5rem;
    }

    .typewriter-container {
      padding: 1.5rem;
      margin: 1.5rem auto;
    }

    .typewriter-text {
      font-size: 1rem;
    }

    .journey-button {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
    }

    .navigation-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .nav-card {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.25rem;
    }

    .welcome-section {
      padding: 2rem 0;
    }
  }

  @media (max-width: 480px) {
    .main-title {
      font-size: 2rem;
    }

    .heart-icon {
      margin: 0 0.5rem;
    }

    .nav-card {
      padding: 1rem;
    }

    .card-icon {
      font-size: 2.5rem;
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = homePageStyles;
document.head.appendChild(styleElement);

// Make VanillaHomePage globally available
window.VanillaHomePage = VanillaHomePage;

export default VanillaHomePage;
