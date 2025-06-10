/**
 * Vanilla JavaScript Love Story Page - Anniversary Website v4.0.0
 * JavaScript-first implementation with interactive timeline
 */

class VanillaLoveStoryPage {
  constructor() {
    this.container = null;
    this.storyMilestones = [];
    this.currentChapter = 0;
    this.isAutoPlaying = false;
    this.autoPlayInterval = null;
    this.timelineAnimation = null;
    this.particleSystem = null;
    
    // Initialize story data
    this.initializeStoryData();
    
    this.init();
  }

  init() {
    this.bindMethods();
  }

  bindMethods() {
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.autoAdvanceStory = this.autoAdvanceStory.bind(this);
  }

  initializeStoryData() {
    this.storyMilestones = [
      {
        id: 'first-meeting',
        title: 'The Day We Met',
        date: '2024-06-16',
        chapter: 1,
        icon: '✨',
        mood: 'magical',
        story: 'It was a Sunday afternoon when our eyes first met. In that crowded café, time seemed to stop. Your smile lit up the entire room, and I knew instantly that my life was about to change forever.',
        emotion: 'nervous-excitement',
        quote: '"Sometimes the heart sees what is invisible to the eye." - H. Jackson Brown Jr.',
        details: {
          location: 'Moonbeam Café, Downtown',
          weather: 'Sunny with scattered clouds',
          song: 'Perfect by Ed Sheeran',
          feeling: 'Like the world suddenly made sense'
        }
      },
      {
        id: 'first-date',
        title: 'Our First Official Date',
        date: '2024-06-23',
        chapter: 2,
        icon: '💕',
        mood: 'romantic',
        story: 'One week later, I gathered the courage to ask you out properly. We talked for hours about everything and nothing. Your laugh became my favorite sound in the universe.',
        emotion: 'growing-connection',
        quote: '"Being deeply loved by someone gives you strength, while loving someone deeply gives you courage." - Lao Tzu',
        details: {
          location: 'Starlight Restaurant',
          weather: 'Perfect evening breeze',
          song: 'All of Me by John Legend',
          feeling: 'Like coming home to someone I\'d never met'
        }
      },
      {
        id: 'becoming-official',
        title: 'Becoming Us',
        date: '2024-07-14',
        chapter: 3,
        icon: '❤️',
        mood: 'joyful',
        story: 'Under the summer stars, we decided to make it official. You said yes when I asked you to be mine, and the whole world seemed to celebrate with us.',
        emotion: 'pure-happiness',
        quote: '"I have found the one whom my soul loves." - Song of Solomon 3:4',
        details: {
          location: 'Riverside Park, under the old oak tree',
          weather: 'Clear starry night',
          song: 'Can\'t Help Myself by Four Tops',
          feeling: 'Like all the stars aligned just for us'
        }
      },
      {
        id: 'first-adventure',
        title: 'Our First Adventure',
        date: '2024-08-20',
        chapter: 4,
        icon: '🗺️',
        mood: 'adventurous',
        story: 'We took our first trip together to the mountains. Getting lost became an adventure, and every wrong turn led us to beautiful views and even more beautiful conversations.',
        emotion: 'shared-discovery',
        quote: '"Life is either a daring adventure or nothing at all." - Helen Keller',
        details: {
          location: 'Blue Ridge Mountains',
          weather: 'Misty morning, golden afternoon',
          song: 'Road Trippin\' by Red Hot Chili Peppers',
          feeling: 'Like we could conquer the world together'
        }
      },
      {
        id: 'first-challenge',
        title: 'Weathering the Storm',
        date: '2024-09-15',
        chapter: 5,
        icon: '💪',
        mood: 'resilient',
        story: 'We faced our first real challenge together. Instead of pulling us apart, it brought us closer. We learned that love isn\'t just about the good times - it\'s about choosing each other every day.',
        emotion: 'deeper-understanding',
        quote: '"The best love is the kind that awakens the soul." - Nicholas Sparks',
        details: {
          location: 'Home, in each other\'s arms',
          weather: 'Stormy outside, warm inside',
          song: 'Stand by You by Rachel Platten',
          feeling: 'Like we could weather any storm together'
        }
      },
      {
        id: 'growing-deeper',
        title: 'Love Deepening',
        date: '2024-10-31',
        chapter: 6,
        icon: '💖',
        mood: 'intimate',
        story: 'By autumn, our love had grown deeper than the changing leaves. We started talking about forever, and it didn\'t scare us - it excited us. We were building something beautiful.',
        emotion: 'committed-love',
        quote: '"True love stories never have endings." - Richard Bach',
        details: {
          location: 'Cozy apartment, making dinner together',
          weather: 'Crisp fall evening',
          song: 'Thinking Out Loud by Ed Sheeran',
          feeling: 'Like home had become a person, not a place'
        }
      },
      {
        id: 'present-moment',
        title: 'Our Story Continues',
        date: '2025-06-10',
        chapter: 7,
        icon: '🌟',
        mood: 'eternal',
        story: 'Today, as I write this, our love story is still being written. Every day brings new chapters, new adventures, new reasons to fall deeper in love with you. This is just the beginning.',
        emotion: 'endless-love',
        quote: '"In all the world, there is no heart for me like yours." - Maya Angelou',
        details: {
          location: 'Wherever we are together',
          weather: 'Perfect, because you\'re here',
          song: 'At Last by Etta James',
          feeling: 'Like every day is a new page in our fairytale'
        }
      }
    ];
  }

  async mount(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error('Love Story Page: Mount element not found:', selector);
      return;
    }

    // Clear container
    this.container.innerHTML = '';
    
    // Render page
    this.render();
    
    // Initialize story features
    this.initializeStory();
    
    // Initialize particle system
    this.initializeParticleSystem();
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Start animations
    this.startAnimations();
    
    // Show welcome notification
    this.showStoryNotification();
    
    console.log('💕 Love Story Page mounted');
    return this;
  }

  render() {
    this.container.innerHTML = `
      <div class="vanilla-love-story-page">
        ${this.renderFloatingBubbles()}
        
        <div class="story-content">
          ${this.renderHeader()}
          ${this.renderStoryControls()}
          ${this.renderTimeline()}
          ${this.renderStoryViewer()}
          ${this.renderNavigation()}
        </div>
      </div>
    `;
  }

  renderFloatingBubbles() {
    return `
      <div class="floating-bubbles">
        ${Array.from({ length: 15 }, (_, i) => `
          <div class="bubble bubble-${i + 1}" style="--delay: ${i * 0.2}s"></div>
        `).join('')}
      </div>
    `;
  }

  renderHeader() {
    return `
      <div class="story-header">
        <h1 class="story-title">
          <span class="icon pulse-animation">📖</span>
          Our Love Story
          <span class="icon pulse-animation">💕</span>
        </h1>
        <p class="story-subtitle">
          <span class="icon">✨</span>
          Every love story is beautiful, but ours is my favorite
          <span class="icon">✨</span>
        </p>
        <div class="story-stats">
          <div class="story-stat">
            <span class="stat-number">${this.storyMilestones.length}</span>
            <span class="stat-label">Chapters</span>
          </div>
          <div class="story-stat">
            <span class="stat-number">${this.calculateDaysOfLove()}</span>
            <span class="stat-label">Days of Love</span>
          </div>
          <div class="story-stat">
            <span class="stat-number">∞</span>
            <span class="stat-label">More to Come</span>
          </div>
        </div>
      </div>
    `;
  }

  renderStoryControls() {
    return `
      <div class="story-controls">
        <button class="control-button" id="auto-play-btn">
          <span class="button-icon">▶️</span>
          Auto Play Story
        </button>
        <button class="control-button" id="restart-story-btn">
          <span class="button-icon">🔄</span>
          Restart
        </button>
        <div class="chapter-indicator">
          Chapter <span id="current-chapter">1</span> of ${this.storyMilestones.length}
        </div>
      </div>
    `;
  }

  renderTimeline() {
    return `
      <div class="story-timeline">
        <div class="timeline-line" id="timeline-line"></div>
        <div class="timeline-milestones">
          ${this.storyMilestones.map((milestone, index) => `
            <div class="timeline-milestone ${index === 0 ? 'active' : ''}" 
                 data-index="${index}"
                 style="--delay: ${index * 0.2}s">
              <div class="milestone-icon">${milestone.icon}</div>
              <div class="milestone-date">${this.formatDate(milestone.date)}</div>
              <div class="milestone-title">${milestone.title}</div>
              <div class="milestone-glow"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderStoryViewer() {
    const currentMilestone = this.storyMilestones[this.currentChapter];
    
    return `
      <div class="story-viewer">
        <div class="story-card" id="story-card">
          ${this.renderMilestoneCard(currentMilestone)}
        </div>
        <div class="story-navigation-arrows">
          <button class="arrow-button prev" id="prev-chapter" ${this.currentChapter === 0 ? 'disabled' : ''}>
            <span class="arrow">‹</span>
          </button>
          <button class="arrow-button next" id="next-chapter" ${this.currentChapter === this.storyMilestones.length - 1 ? 'disabled' : ''}>
            <span class="arrow">›</span>
          </button>
        </div>
      </div>
    `;
  }

  renderMilestoneCard(milestone) {
    const moodColors = {
      'magical': 'from-purple-500 to-pink-500',
      'romantic': 'from-red-500 to-pink-500',
      'joyful': 'from-yellow-500 to-orange-500',
      'adventurous': 'from-blue-500 to-green-500',
      'resilient': 'from-gray-500 to-blue-500',
      'intimate': 'from-pink-500 to-red-500',
      'eternal': 'from-gold to-purple-500'
    };

    return `
      <div class="milestone-card" data-mood="${milestone.mood}">
        <div class="milestone-header">
          <div class="milestone-icon-large">${milestone.icon}</div>
          <div class="milestone-info">
            <h2 class="milestone-title">${milestone.title}</h2>
            <div class="milestone-date-full">${this.formatDateFull(milestone.date)}</div>
            <div class="milestone-chapter">Chapter ${milestone.chapter}</div>
          </div>
        </div>
        
        <div class="milestone-mood-bar" style="background: linear-gradient(90deg, ${moodColors[milestone.mood]})"></div>
        
        <div class="milestone-story">
          <p class="story-text">${milestone.story}</p>
        </div>
        
        <div class="milestone-quote">
          <div class="quote-mark">"</div>
          <div class="quote-text">${milestone.quote}</div>
          <div class="quote-mark">"</div>
        </div>
        
        <div class="milestone-details">
          <h3 class="details-title">
            <span class="icon">📝</span>
            Chapter Details
          </h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-icon">📍</span>
              <span class="detail-label">Location:</span>
              <span class="detail-value">${milestone.details.location}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🌤️</span>
              <span class="detail-label">Weather:</span>
              <span class="detail-value">${milestone.details.weather}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🎵</span>
              <span class="detail-label">Our Song:</span>
              <span class="detail-value">${milestone.details.song}</span>
            </div>
            <div class="detail-item feeling-item">
              <span class="detail-icon">💭</span>
              <span class="detail-label">How it Felt:</span>
              <span class="detail-value">${milestone.details.feeling}</span>
            </div>
          </div>
        </div>
        
        <div class="milestone-actions">
          <button class="milestone-action-button favorite">
            <span class="icon">⭐</span>
            Favorite Chapter
          </button>
          <button class="milestone-action-button share">
            <span class="icon">💕</span>
            Share Memory
          </button>
        </div>
      </div>
    `;
  }

  renderNavigation() {
    return `
      <div class="story-navigation">
        <button class="nav-button primary" id="back-home">
          <span class="button-icon">🏠</span>
          Back to Home
        </button>
        <button class="nav-button secondary" id="create-memory">
          <span class="button-icon">✍️</span>
          Add Memory
        </button>
      </div>
    `;
  }

  calculateDaysOfLove() {
    const startDate = new Date('2024-06-16');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateFull(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  initializeStory() {
    // Initialize timeline interactions
    this.initializeTimeline();
    
    // Initialize story navigation
    this.initializeStoryNavigation();
    
    // Initialize auto-play
    this.initializeAutoPlay();
  }

  initializeTimeline() {
    const milestones = this.container.querySelectorAll('.timeline-milestone');
    
    milestones.forEach((milestone, index) => {
      milestone.addEventListener('click', () => {
        this.navigateToChapter(index);
      });
    });
  }

  initializeStoryNavigation() {
    const prevButton = this.container.querySelector('#prev-chapter');
    const nextButton = this.container.querySelector('#next-chapter');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        this.navigateToChapter(this.currentChapter - 1);
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        this.navigateToChapter(this.currentChapter + 1);
      });
    }
  }

  initializeAutoPlay() {
    const autoPlayButton = this.container.querySelector('#auto-play-btn');
    const restartButton = this.container.querySelector('#restart-story-btn');
    
    if (autoPlayButton) {
      autoPlayButton.addEventListener('click', () => {
        this.toggleAutoPlay();
      });
    }
    
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        this.restartStory();
      });
    }
  }

  navigateToChapter(index) {
    if (index < 0 || index >= this.storyMilestones.length) return;
    
    this.currentChapter = index;
    
    // Update timeline
    this.updateTimeline();
    
    // Update story card with animation
    this.updateStoryCard();
    
    // Update navigation buttons
    this.updateNavigationButtons();
    
    // Update chapter indicator
    this.updateChapterIndicator();
    
    // Create transition effect
    this.createChapterTransition();
  }

  updateTimeline() {
    const milestones = this.container.querySelectorAll('.timeline-milestone');
    const timelineLine = this.container.querySelector('#timeline-line');
    
    milestones.forEach((milestone, index) => {
      if (index <= this.currentChapter) {
        milestone.classList.add('active');
      } else {
        milestone.classList.remove('active');
      }
      
      if (index === this.currentChapter) {
        milestone.classList.add('current');
      } else {
        milestone.classList.remove('current');
      }
    });
    
    // Animate timeline progress
    if (timelineLine) {
      const progress = (this.currentChapter / (this.storyMilestones.length - 1)) * 100;
      timelineLine.style.setProperty('--progress', `${progress}%`);
    }
  }

  updateStoryCard() {
    const storyCard = this.container.querySelector('#story-card');
    if (!storyCard) return;
    
    // Fade out
    storyCard.classList.add('transitioning');
    
    setTimeout(() => {
      // Update content
      const currentMilestone = this.storyMilestones[this.currentChapter];
      storyCard.innerHTML = this.renderMilestoneCard(currentMilestone);
      
      // Initialize card interactions
      this.initializeCardInteractions();
      
      // Fade in
      storyCard.classList.remove('transitioning');
    }, 300);
  }

  initializeCardInteractions() {
    const favoriteButton = this.container.querySelector('.milestone-action-button.favorite');
    const shareButton = this.container.querySelector('.milestone-action-button.share');
    
    if (favoriteButton) {
      favoriteButton.addEventListener('click', () => {
        this.toggleFavoriteChapter();
      });
    }
    
    if (shareButton) {
      shareButton.addEventListener('click', () => {
        this.shareChapter();
      });
    }
  }

  updateNavigationButtons() {
    const prevButton = this.container.querySelector('#prev-chapter');
    const nextButton = this.container.querySelector('#next-chapter');
    
    if (prevButton) {
      prevButton.disabled = this.currentChapter === 0;
    }
    
    if (nextButton) {
      nextButton.disabled = this.currentChapter === this.storyMilestones.length - 1;
    }
  }

  updateChapterIndicator() {
    const chapterIndicator = this.container.querySelector('#current-chapter');
    if (chapterIndicator) {
      chapterIndicator.textContent = this.currentChapter + 1;
    }
  }

  createChapterTransition() {
    // Create romantic particles for chapter transition
    const particles = ['💕', '✨', '💖', '🌟', '💫'];
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'chapter-transition-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = 'chapter-particle 1.5s ease-out forwards';
        
        this.container.appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 1500);
      }, i * 50);
    }
  }

  toggleAutoPlay() {
    const autoPlayButton = this.container.querySelector('#auto-play-btn');
    
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
      autoPlayButton.innerHTML = '<span class="button-icon">▶️</span>Auto Play Story';
    } else {
      this.startAutoPlay();
      autoPlayButton.innerHTML = '<span class="button-icon">⏸️</span>Pause Story';
    }
  }

  startAutoPlay() {
    this.isAutoPlaying = true;
    this.autoPlayInterval = setInterval(this.autoAdvanceStory, 5000);
    this.showNotification('info', 'Auto-Play Started', 'Sit back and enjoy our love story');
  }

  stopAutoPlay() {
    this.isAutoPlaying = false;
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  autoAdvanceStory() {
    if (this.currentChapter < this.storyMilestones.length - 1) {
      this.navigateToChapter(this.currentChapter + 1);
    } else {
      // Restart from beginning
      this.navigateToChapter(0);
      this.showNotification('success', 'Story Complete!', 'Starting from the beginning again...');
    }
  }

  restartStory() {
    this.stopAutoPlay();
    this.navigateToChapter(0);
    this.showNotification('info', 'Story Restarted', 'Back to where it all began...');
  }

  toggleFavoriteChapter() {
    const favoriteButton = this.container.querySelector('.milestone-action-button.favorite');
    const currentMilestone = this.storyMilestones[this.currentChapter];
    
    favoriteButton.classList.toggle('favorited');
    
    if (favoriteButton.classList.contains('favorited')) {
      favoriteButton.innerHTML = '<span class="icon">⭐</span>Favorited!';
      this.showNotification('success', 'Chapter Favorited!', `"${currentMilestone.title}" added to favorites`);
      this.createFavoriteEffect();
    } else {
      favoriteButton.innerHTML = '<span class="icon">⭐</span>Favorite Chapter';
      this.showNotification('info', 'Removed from Favorites', 'Chapter removed from favorites');
    }
  }

  createFavoriteEffect() {
    const hearts = ['💕', '❤️', '💖', '💗', '💝'];
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'favorite-heart-effect';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animation = 'heart-float 2s ease-out forwards';
        
        this.container.appendChild(heart);
        
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }, 2000);
      }, i * 100);
    }
  }

  shareChapter() {
    const currentMilestone = this.storyMilestones[this.currentChapter];
    this.showNotification('info', 'Sharing Feature Coming Soon!', `Ready to share "${currentMilestone.title}"`);
  }

  initializeParticleSystem() {
    const particles = ['📖', '💕', '✨', '📝', '💫', '🌟', '💖', '💑'];
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'story-particle';
      particle.textContent = particles[Math.floor(Math.random() * particles.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 4 + 8) + 's';
      particle.style.animationDelay = Math.random() * 3 + 's';
      
      this.container.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 12000);
    };
    
    this.particleSystem = setInterval(createParticle, 3000);
  }

  attachEventListeners() {
    // Navigation buttons
    const backHomeButton = this.container.querySelector('#back-home');
    const createMemoryButton = this.container.querySelector('#create-memory');
    
    if (backHomeButton) {
      backHomeButton.addEventListener('click', () => {
        this.navigateToPage('home');
      });
    }
    
    if (createMemoryButton) {
      createMemoryButton.addEventListener('click', () => {
        this.showNotification('info', 'Memory Creator Coming Soon!', 'We\'re working on this feature');
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.navigateToChapter(this.currentChapter - 1);
      } else if (e.key === 'ArrowRight') {
        this.navigateToChapter(this.currentChapter + 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        this.toggleAutoPlay();
      }
    });
    
    // Window events
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleResize() {
    // Adjust layout for mobile
    const timeline = this.container.querySelector('.story-timeline');
    const isMobile = window.innerWidth < 768;
    
    if (timeline) {
      if (isMobile) {
        timeline.classList.add('mobile-layout');
      } else {
        timeline.classList.remove('mobile-layout');
      }
    }
  }

  handleScroll() {
    // Parallax effect for floating bubbles
    const scrollY = window.scrollY;
    const bubbles = this.container.querySelectorAll('.bubble');
    
    bubbles.forEach((bubble, index) => {
      const speed = (index % 3 + 1) * 0.1;
      bubble.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  startAnimations() {
    // Animate timeline milestones
    setTimeout(() => {
      const milestones = this.container.querySelectorAll('.timeline-milestone');
      milestones.forEach(milestone => {
        milestone.classList.add('animate-entry');
      });
    }, 500);
    
    // Animate story card
    setTimeout(() => {
      const storyCard = this.container.querySelector('#story-card');
      if (storyCard) {
        storyCard.classList.add('animate-entry');
      }
    }, 800);
  }

  navigateToPage(pageId) {
    this.container.classList.add('page-exit');
    
    setTimeout(() => {
      if (window.anniversaryCore?.router) {
        window.anniversaryCore.router.navigate(`/${pageId}`);
      } else {
        window.location.hash = `#/${pageId}`;
      }
    }, 300);
  }

  showNotification(type, title, message) {
    if (window.globalState?.notificationSystem) {
      window.globalState.notificationSystem.show({
        type,
        title,
        message,
        duration: 3000
      });
    }
  }

  showStoryNotification() {
    this.showNotification('success', '📖 Love Story Loaded!', 'Journey through our beautiful chapters together');
  }

  destroy() {
    // Stop auto-play
    this.stopAutoPlay();
    
    // Stop particle system
    if (this.particleSystem) {
      clearInterval(this.particleSystem);
      this.particleSystem = null;
    }
    
    // Remove event listeners
    this.removeEventListeners();
    
    console.log('📖 Love Story Page destroyed');
  }
}

// CSS styles for the love story page
const loveStoryPageStyles = `
  .vanilla-love-story-page {
    min-height: 100vh;
    position: relative;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
  }

  .story-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 10;
  }

  .story-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .story-title {
    font-size: 3rem;
    font-weight: 700;
    background: var(--gradient-romantic);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(236, 72, 153, 0.3);
  }

  .story-subtitle {
    font-size: 1.5rem;
    color: var(--text-secondary);
    font-weight: 300;
    margin-bottom: 2rem;
  }

  .story-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 2rem;
  }

  .story-stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--glow-romantic);
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .story-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }

  .control-button {
    background: var(--gradient-romantic);
    border: none;
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .control-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px var(--shadow-glow);
  }

  .chapter-indicator {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    color: var(--text-secondary);
    font-weight: 600;
  }

  .story-timeline {
    margin: 3rem 0;
    position: relative;
  }

  .timeline-line {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      to right,
      var(--glow-romantic) var(--progress, 0%),
      rgba(255, 255, 255, 0.2) var(--progress, 0%)
    );
    border-radius: 2px;
    z-index: 1;
    transition: --progress 0.6s ease;
  }

  .timeline-milestones {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  .timeline-milestone {
    background: var(--card-bg);
    border: 2px solid var(--border-romantic);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s ease;
    position: relative;
    opacity: 0;
    transform: translateY(30px) scale(0.8);
    animation-delay: var(--delay);
  }

  .timeline-milestone.animate-entry {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .timeline-milestone.active {
    border-color: var(--accent-romantic);
    background: var(--gradient-romantic);
    transform: scale(1.1);
  }

  .timeline-milestone.current {
    animation: milestone-pulse 2s ease-in-out infinite;
  }

  .timeline-milestone:hover {
    transform: scale(1.2);
    box-shadow: 0 8px 24px var(--shadow-glow);
  }

  .milestone-icon {
    font-size: 1.5rem;
  }

  .milestone-date,
  .milestone-title {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .milestone-date {
    font-size: 0.8rem;
    color: var(--text-secondary);
    top: 70px;
  }

  .milestone-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    top: 85px;
  }

  .timeline-milestone:hover .milestone-date,
  .timeline-milestone:hover .milestone-title {
    opacity: 1;
  }

  .milestone-glow {
    position: absolute;
    inset: -4px;
    background: var(--gradient-romantic);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    filter: blur(8px);
  }

  .timeline-milestone.active .milestone-glow {
    opacity: 0.4;
  }

  .story-viewer {
    margin: 4rem 0;
    position: relative;
  }

  .story-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }

  .story-card.animate-entry {
    opacity: 1;
    transform: translateY(0);
  }

  .story-card.transitioning {
    opacity: 0;
    transform: translateY(-20px);
  }

  .milestone-card {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
  }

  .milestone-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .milestone-icon-large {
    font-size: 4rem;
    opacity: 0.9;
  }

  .milestone-info h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--glow-romantic);
    margin-bottom: 0.5rem;
  }

  .milestone-date-full {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .milestone-chapter {
    color: var(--accent-romantic);
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .milestone-mood-bar {
    height: 4px;
    border-radius: 2px;
    margin-bottom: 2rem;
    opacity: 0.8;
  }

  .milestone-story {
    margin-bottom: 2rem;
  }

  .story-text {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--text-primary);
    text-align: justify;
  }

  .milestone-quote {
    background: rgba(255, 255, 255, 0.05);
    border-left: 4px solid var(--accent-romantic);
    border-radius: 0 8px 8px 0;
    padding: 1.5rem;
    margin: 2rem 0;
    position: relative;
    font-style: italic;
  }

  .quote-mark {
    font-size: 3rem;
    color: var(--accent-romantic);
    opacity: 0.3;
    line-height: 1;
  }

  .quote-text {
    font-size: 1.1rem;
    color: var(--text-accent);
    margin: 0.5rem 0;
    text-align: center;
  }

  .milestone-details {
    margin: 2rem 0;
  }

  .details-title {
    font-size: 1.3rem;
    color: var(--glow-romantic);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .detail-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .detail-item.feeling-item {
    grid-column: 1 / -1;
  }

  .detail-icon {
    font-size: 1.2rem;
    opacity: 0.8;
  }

  .detail-label {
    font-weight: 600;
    color: var(--text-secondary);
    min-width: 70px;
  }

  .detail-value {
    color: var(--text-primary);
    flex: 1;
  }

  .milestone-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .milestone-action-button {
    background: var(--gradient-romantic);
    border: none;
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .milestone-action-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px var(--shadow-glow);
  }

  .milestone-action-button.favorited {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #333;
  }

  .story-navigation-arrows {
    position: absolute;
    top: 50%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .arrow-button {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    pointer-events: all;
    backdrop-filter: blur(10px);
  }

  .arrow-button:not(:disabled):hover {
    background: var(--gradient-romantic);
    border-color: var(--accent-romantic);
    transform: scale(1.1);
    box-shadow: 0 4px 16px var(--shadow-glow);
  }

  .arrow-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .arrow {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .story-navigation {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 4rem;
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
    width: 15px;
    height: 15px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
    border-radius: 50%;
    animation: float-bubble 15s infinite linear;
    animation-delay: var(--delay);
  }

  .story-particle {
    position: absolute;
    font-size: 1.5rem;
    opacity: 0.5;
    pointer-events: none;
    z-index: 5;
    animation: particle-float 12s linear infinite;
  }

  .chapter-transition-particle {
    position: absolute;
    font-size: 1.5rem;
    pointer-events: none;
    z-index: 15;
  }

  .favorite-heart-effect {
    position: absolute;
    font-size: 1.5rem;
    pointer-events: none;
    z-index: 20;
  }

  /* Animations */
  @keyframes float-bubble {
    0% {
      transform: translateY(100vh) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 0.3;
      transform: translateY(90vh) scale(1);
    }
    90% {
      opacity: 0.3;
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

  .pulse-animation {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes milestone-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
    }
  }

  @keyframes particle-float {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.5;
    }
    90% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-10vh) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes chapter-particle {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1.5) rotate(180deg);
      opacity: 0.8;
    }
    100% {
      transform: scale(0) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes heart-float {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1.2) rotate(180deg);
      opacity: 0.8;
    }
    100% {
      transform: scale(0) rotate(360deg);
      opacity: 0;
    }
  }

  .page-exit {
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.3s ease;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .story-content {
      padding: 1rem;
    }

    .story-title {
      font-size: 2rem;
    }

    .story-stats {
      gap: 1.5rem;
    }

    .story-controls {
      flex-direction: column;
      align-items: center;
    }

    .control-button,
    .chapter-indicator {
      width: 100%;
      max-width: 250px;
      justify-content: center;
    }

    .timeline-milestones {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .timeline-line {
      top: 0;
      left: 50%;
      right: auto;
      width: 4px;
      height: 100%;
      transform: translateX(-50%);
      background: linear-gradient(
        to bottom,
        var(--glow-romantic) var(--progress, 0%),
        rgba(255, 255, 255, 0.2) var(--progress, 0%)
      );
    }

    .milestone-date,
    .milestone-title {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      opacity: 1;
      margin-top: 0.5rem;
      text-align: center;
    }

    .milestone-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .milestone-icon-large {
      font-size: 3rem;
    }

    .milestone-info h2 {
      font-size: 1.5rem;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .detail-item.feeling-item {
      grid-column: 1;
    }

    .milestone-actions {
      flex-direction: column;
      align-items: center;
    }

    .milestone-action-button {
      width: 100%;
      max-width: 200px;
      justify-content: center;
    }

    .story-navigation-arrows {
      position: relative;
      margin-top: 2rem;
      justify-content: center;
      gap: 2rem;
    }

    .story-navigation {
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
    .story-title {
      font-size: 1.8rem;
    }

    .milestone-card {
      padding: 1.5rem;
    }

    .story-text {
      font-size: 1.1rem;
    }

    .quote-text {
      font-size: 1rem;
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = loveStoryPageStyles;
document.head.appendChild(styleElement);

// Make VanillaLoveStoryPage globally available
window.VanillaLoveStoryPage = VanillaLoveStoryPage;

export default VanillaLoveStoryPage;
