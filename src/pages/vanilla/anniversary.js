/**
 * Anniversary Page - Vanilla JavaScript Implementation
 * Anniversary Website v4.0.0
 * 
 * Main anniversary celebration page with romantic design,
 * time calculator, love message, and navigation grid.
 */

import { VanillaTimeCalculator } from '../../components/vanilla/VanillaTimeCalculator.js';

export class AnniversaryPage {
  constructor() {
    this.container = null;
    this.timeCalculator = null;
    this.particles = [];
    this.animationId = null;
    this.isVisible = false;
    
    // Page configuration
    this.config = {
      particleCount: 30,
      animationSpeed: 0.02,
      navigationCards: [
        { 
          route: '/love-story', 
          icon: '📖', 
          title: 'Our Love Story', 
          subtitle: 'Journey together',
          color: 'from-pink-400 to-red-400'
        },
        { 
          route: '/photo-gallery', 
          icon: '📸', 
          title: 'Photo Gallery', 
          subtitle: 'Beautiful memories',
          color: 'from-purple-400 to-pink-400'
        },
        { 
          route: '/music-playlist', 
          icon: '🎵', 
          title: 'Our Playlist', 
          subtitle: 'Songs of love',
          color: 'from-blue-400 to-purple-400'
        },
        { 
          route: '/love-letters', 
          icon: '💌', 
          title: 'Love Letters', 
          subtitle: 'Heartfelt words',
          color: 'from-red-400 to-pink-400'
        },
        { 
          route: '/special-dates', 
          icon: '📅', 
          title: 'Special Dates', 
          subtitle: 'Important moments',
          color: 'from-green-400 to-blue-400'
        },
        { 
          route: '/fireworks', 
          icon: '🎆', 
          title: 'Celebration', 
          subtitle: 'Fireworks show',
          color: 'from-yellow-400 to-red-400'
        }
      ]
    };
  }

  /**
   * Create and return the page HTML structure
   */
  render() {
    const html = `
      <div class="anniversary-page min-h-screen relative">
        <!-- Particle Canvas -->
        <canvas id="anniversary-particles" class="fixed inset-0 pointer-events-none z-0"></canvas>
        
        <!-- Floating Bubbles -->
        <div class="floating-bubbles-container"></div>
        
        <!-- Main Content -->
        <div class="relative z-10 px-4 py-8">
          <div class="max-w-4xl mx-auto">
            
            <!-- Header Section -->
            <div class="text-center mb-12">
              <h1 class="anniversary-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6 font-dancing leading-tight">
                💕 Happy Anniversary, My Sweet Jerry 💕
              </h1>
              <h2 class="anniversary-subtitle text-xl sm:text-2xl md:text-3xl text-pink-700 mb-8 font-dancing leading-relaxed">
                To my dearest <span class="text-red-500 font-semibold">Pujuu (Champi)</span>, my sweet <span class="text-pink-600 font-semibold">Jerry</span> 💕
              </h2>
            </div>

            <!-- Time Calculator Section -->
            <div class="time-calculator-section mb-12">
              <div id="anniversary-time-calculator"></div>
            </div>

            <!-- Love Message Section -->
            <div class="love-message-section mb-12">
              <div class="glassmorphism rounded-2xl p-8 love-message-card">
                <h3 class="text-2xl font-dancing text-pink-600 mb-4 text-center">
                  💌 A Message From My Heart
                </h3>
                <div class="love-message-content text-lg text-gray-700 leading-relaxed space-y-4">
                  <p class="message-paragraph fade-in-up">
                    My dearest Jerry, from the moment we started talking on June 16, 2024, 
                    my world became brighter, warmer, and filled with endless joy.
                  </p>
                  <p class="message-paragraph fade-in-up" style="animation-delay: 0.2s;">
                    Every day with you feels like a beautiful dream that I never want to wake up from. 
                    Your sweet messages, caring nature, and the way you make me smile even on the hardest days - 
                    these are the treasures I hold closest to my heart.
                  </p>
                  <p class="message-paragraph fade-in-up" style="animation-delay: 0.4s;">
                    Thank you for being my Jerry, my Pujuu, my everything. 
                    Here's to many more months and years of love, laughter, and beautiful memories together.
                  </p>
                  <p class="message-signature text-center font-dancing text-xl text-pink-600 fade-in-up" style="animation-delay: 0.6s;">
                    Forever yours, Mankada (Soumya) 💖
                  </p>
                </div>
              </div>
            </div>

            <!-- Navigation Grid Section -->
            <div class="navigation-section mb-12">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4" id="navigation-grid">
                ${this.renderNavigationCards()}
              </div>
            </div>

            <!-- Back to Home Section -->
            <div class="text-center">
              <button class="home-button bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                🏠 Back to Home
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Render navigation cards
   */
  renderNavigationCards() {
    return this.config.navigationCards.map((card, index) => `
      <div class="navigation-card glassmorphism p-6 rounded-xl text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
           data-route="${card.route}"
           style="animation-delay: ${index * 0.1}s;">
        <div class="card-icon text-3xl mb-3">${card.icon}</div>
        <div class="card-title font-medium text-pink-700">${card.title}</div>
        <div class="card-subtitle text-sm text-gray-600 mt-1">${card.subtitle}</div>
        <div class="card-glow absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 rounded-xl transition-opacity duration-300"></div>
      </div>
    `).join('');
  }

  /**
   * Initialize the page
   */
  async init(container) {
    this.container = container;
    this.container.innerHTML = this.render();
    this.isVisible = true;

    // Initialize components
    await this.initializeTimeCalculator();
    this.initializeParticleSystem();
    this.initializeFloatingBubbles();
    this.setupEventListeners();
    this.startAnimations();

    console.log('Anniversary page initialized');
  }

  /**
   * Initialize the time calculator component
   */
  async initializeTimeCalculator() {
    const calculatorContainer = this.container.querySelector('#anniversary-time-calculator');
    if (calculatorContainer) {
      this.timeCalculator = new VanillaTimeCalculator();
      await this.timeCalculator.init(calculatorContainer);
    }
  }

  /**
   * Initialize particle system
   */
  initializeParticleSystem() {
    const canvas = this.container.querySelector('#anniversary-particles');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    // Create particles
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: `hsl(${Math.random() * 60 + 300}, 70%, 70%)` // Pink to purple hues
      });
    }

    // Animation loop
    const animateParticles = () => {
      if (!this.isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      this.animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /**
   * Initialize floating bubbles
   */
  initializeFloatingBubbles() {
    const container = this.container.querySelector('.floating-bubbles-container');
    if (!container) return;

    // Create floating bubbles
    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'floating-bubble';
      bubble.style.cssText = `
        position: absolute;
        width: ${Math.random() * 20 + 10}px;
        height: ${Math.random() * 20 + 10}px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3));
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        animation: float-up ${Math.random() * 10 + 10}s infinite linear;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 5}s;
        backdrop-filter: blur(10px);
      `;
      container.appendChild(bubble);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Navigation card clicks
    const navigationCards = this.container.querySelectorAll('.navigation-card');
    navigationCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const route = e.currentTarget.dataset.route;
        this.handleNavigation(route);
      });

      // Add hover effects
      card.addEventListener('mouseenter', (e) => {
        const glow = e.currentTarget.querySelector('.card-glow');
        if (glow) {
          glow.style.opacity = '0.1';
        }
      });

      card.addEventListener('mouseleave', (e) => {
        const glow = e.currentTarget.querySelector('.card-glow');
        if (glow) {
          glow.style.opacity = '0';
        }
      });
    });

    // Home button click
    const homeButton = this.container.querySelector('.home-button');
    if (homeButton) {
      homeButton.addEventListener('click', () => {
        this.handleNavigation('/');
      });
    }

    // Love message animations on scroll
    this.setupScrollAnimations();
  }

  /**
   * Setup scroll-based animations
   */
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe message paragraphs
    const messageParagraphs = this.container.querySelectorAll('.message-paragraph');
    messageParagraphs.forEach(paragraph => {
      observer.observe(paragraph);
    });

    // Observe navigation cards
    const navigationCards = this.container.querySelectorAll('.navigation-card');
    navigationCards.forEach(card => {
      observer.observe(card);
    });
  }

  /**
   * Start page animations
   */
  startAnimations() {
    // Animate title
    const title = this.container.querySelector('.anniversary-title');
    if (title) {
      title.classList.add('animate-float');
    }

    // Animate subtitle
    const subtitle = this.container.querySelector('.anniversary-subtitle');
    if (subtitle) {
      setTimeout(() => {
        subtitle.classList.add('fade-in-up');
      }, 300);
    }

    // Animate love message card
    const messageCard = this.container.querySelector('.love-message-card');
    if (messageCard) {
      setTimeout(() => {
        messageCard.classList.add('scale-in');
      }, 600);
    }

    // Animate navigation cards with stagger
    const navigationCards = this.container.querySelectorAll('.navigation-card');
    navigationCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('slide-in-up');
      }, 900 + (index * 100));
    });
  }

  /**
   * Handle navigation
   */
  handleNavigation(route) {
    if (window.VanillaCore && window.VanillaCore.router) {
      window.VanillaCore.router.navigate(route);
    } else {
      // Fallback navigation
      window.location.hash = route;
    }
  }

  /**
   * Cleanup when page is destroyed
   */
  destroy() {
    this.isVisible = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.timeCalculator) {
      this.timeCalculator.destroy();
      this.timeCalculator = null;
    }

    this.particles = [];
    
    if (this.container) {
      this.container.innerHTML = '';
    }

    console.log('Anniversary page destroyed');
  }

  /**
   * Handle page resize
   */
  handleResize() {
    const canvas = this.container?.querySelector('#anniversary-particles');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }
}

// CSS Styles for the anniversary page
const anniversaryStyles = `
  .anniversary-page {
    background: linear-gradient(135deg, #fef7f0 0%, #fdf2f8 50%, #fef7f0 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  .anniversary-title {
    background: linear-gradient(135deg, #ec4899, #ef4444, #f97316);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
  }

  .anniversary-subtitle {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .love-message-card {
    backdrop-filter: blur(20px);
    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.6s ease-out;
  }

  .love-message-card.scale-in {
    transform: translateY(0);
    opacity: 1;
  }

  .message-paragraph {
    transform: translateY(30px);
    opacity: 0;
    transition: all 0.6s ease-out;
  }

  .message-paragraph.animate-in {
    transform: translateY(0);
    opacity: 1;
  }

  .navigation-card {
    position: relative;
    backdrop-filter: blur(20px);
    box-shadow: 0 10px 30px rgba(236, 72, 153, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transform: translateY(30px);
    opacity: 0;
    transition: all 0.6s ease-out;
    overflow: hidden;
  }

  .navigation-card.slide-in-up {
    transform: translateY(0);
    opacity: 1;
  }

  .navigation-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.2);
  }

  .card-glow {
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .home-button:hover {
    box-shadow: 0 15px 35px rgba(236, 72, 153, 0.4);
  }

  .floating-bubble {
    pointer-events: none;
    z-index: 1;
  }

  /* Animations */
  @keyframes float-up {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes animate-float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-float {
    animation: animate-float 3s ease-in-out infinite;
  }

  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .anniversary-title {
      font-size: 2.5rem !important;
    }
    
    .anniversary-subtitle {
      font-size: 1.25rem !important;
    }
    
    .navigation-card {
      padding: 1rem;
    }
    
    .love-message-card {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .anniversary-title {
      font-size: 2rem !important;
    }
    
    .anniversary-subtitle {
      font-size: 1rem !important;
    }
  }
`;

// Inject styles
if (!document.getElementById('anniversary-page-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'anniversary-page-styles';
  styleSheet.textContent = anniversaryStyles;
  document.head.appendChild(styleSheet);
}

export default AnniversaryPage;
