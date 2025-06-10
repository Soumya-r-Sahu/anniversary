/**
 * Vanilla JavaScript Photo Gallery Page - Anniversary Website v4.0.0
 * JavaScript-first implementation with advanced photo management
 */

class VanillaPhotoGalleryPage {
  constructor() {
    this.container = null;
    this.photos = [];
    this.currentCategory = 'all';
    this.isLightboxOpen = false;
    this.currentPhotoIndex = 0;
    this.particleSystem = null;
    this.filterAnimationTimeout = null;
    
    // Photo data
    this.initializePhotoData();
    
    this.init();
  }

  init() {
    this.bindMethods();
  }

  bindMethods() {
    this.handleResize = this.handleResize.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
  }

  initializePhotoData() {
    this.photos = [
      { 
        id: 'first-date', 
        category: 'dates', 
        title: 'Our First Date', 
        date: '2024-06-16',
        description: 'The moment everything began. Coffee turned into hours of conversation.',
        location: 'Cozy Café Downtown',
        mood: 'nervous-excited'
      },
      { 
        id: 'romantic-dinner', 
        category: 'dates', 
        title: 'Romantic Dinner', 
        date: '2024-07-20',
        description: 'Candlelight, soft music, and the most beautiful company.',
        location: 'Bella Vista Restaurant',
        mood: 'romantic'
      },
      { 
        id: 'beach-getaway', 
        category: 'travel', 
        title: 'Beach Getaway', 
        date: '2024-08-15',
        description: 'Sand between our toes, endless horizon, and pure bliss.',
        location: 'Sunset Beach',
        mood: 'adventurous'
      },
      { 
        id: 'mountain-hike', 
        category: 'travel', 
        title: 'Mountain Adventure', 
        date: '2024-09-10',
        description: 'Reaching new heights together, literally and figuratively.',
        location: 'Pine Ridge Trail',
        mood: 'adventurous'
      },
      { 
        id: 'lazy-morning', 
        category: 'candid', 
        title: 'Lazy Sunday Morning', 
        date: '2024-10-05',
        description: 'Perfect in pajamas, coffee in bed, nowhere to be.',
        location: 'Home Sweet Home',
        mood: 'cozy'
      },
      { 
        id: 'birthday-surprise', 
        category: 'special', 
        title: 'Birthday Surprise', 
        date: '2024-11-25',
        description: 'The look of pure joy when surprises work perfectly.',
        location: 'Secret Garden',
        mood: 'joyful'
      },
      { 
        id: 'holiday-magic', 
        category: 'special', 
        title: 'Holiday Magic', 
        date: '2024-12-24',
        description: 'Twinkling lights, warm cocoa, and even warmer hearts.',
        location: 'Winter Wonderland',
        mood: 'magical'
      },
      { 
        id: 'new-year-kiss', 
        category: 'special', 
        title: 'New Year\'s Kiss', 
        date: '2025-01-01',
        description: 'Starting the year right with the perfect kiss at midnight.',
        location: 'City Rooftop',
        mood: 'celebratory'
      }
    ];
  }

  async mount(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error('Photo Gallery Page: Mount element not found:', selector);
      return;
    }

    // Clear container
    this.container.innerHTML = '';
    
    // Render page
    this.render();
    
    // Initialize gallery features
    this.initializeGallery();
    
    // Initialize particle system
    this.initializeParticleSystem();
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Start animations
    this.startAnimations();
    
    // Show welcome notification
    this.showGalleryNotification();
    
    console.log('📸 Photo Gallery Page mounted');
    return this;
  }

  render() {
    this.container.innerHTML = `
      <div class="vanilla-photo-gallery-page">
        ${this.renderFloatingBubbles()}
        
        <div class="gallery-content">
          ${this.renderHeader()}
          ${this.renderStats()}
          ${this.renderFilters()}
          ${this.renderPhotoGrid()}
          ${this.renderUploadArea()}
          ${this.renderNavigation()}
        </div>
      </div>
    `;
  }

  renderFloatingBubbles() {
    return `
      <div class="floating-bubbles">
        ${Array.from({ length: 10 }, (_, i) => `
          <div class="bubble bubble-${i + 1}" style="--delay: ${i * 0.4}s"></div>
        `).join('')}
      </div>
    `;
  }

  renderHeader() {
    return `
      <div class="gallery-header">
        <h1 class="gallery-title">
          <span class="icon pulse-animation">📸</span>
          Our Photo Gallery
          <span class="icon pulse-animation">💕</span>
        </h1>
        <p class="gallery-subtitle">
          <span class="icon">✨</span>
          Beautiful memories captured in time
          <span class="icon">✨</span>
        </p>
      </div>
    `;
  }

  renderStats() {
    const stats = this.calculateStats();
    
    return `
      <div class="gallery-stats">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value" id="total-photos">${stats.totalPhotos}</div>
            <div class="stat-label">Precious Moments</div>
            <div class="stat-icon">📷</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value" id="favorite-memories">${stats.favoriteMemories}</div>
            <div class="stat-label">Favorite Memories</div>
            <div class="stat-icon">⭐</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value" id="months-documented">${stats.monthsDocumented}</div>
            <div class="stat-label">Months Documented</div>
            <div class="stat-icon">📅</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value" id="special-occasions">${stats.specialOccasions}</div>
            <div class="stat-label">Special Occasions</div>
            <div class="stat-icon">🎉</div>
          </div>
        </div>
      </div>
    `;
  }

  renderFilters() {
    const categories = [
      { id: 'all', label: 'All Photos', icon: '🌟', count: this.photos.length },
      { id: 'dates', label: 'Date Nights', icon: '💕', count: this.photos.filter(p => p.category === 'dates').length },
      { id: 'travel', label: 'Adventures', icon: '🗺️', count: this.photos.filter(p => p.category === 'travel').length },
      { id: 'candid', label: 'Candid Moments', icon: '📱', count: this.photos.filter(p => p.category === 'candid').length },
      { id: 'special', label: 'Special Events', icon: '🎊', count: this.photos.filter(p => p.category === 'special').length }
    ];

    return `
      <div class="gallery-filters">
        <h3 class="filters-title">
          <span class="icon">🎨</span>
          Browse by Category
        </h3>
        <div class="filter-buttons">
          ${categories.map(category => `
            <button class="filter-button ${category.id === 'all' ? 'active' : ''}" 
                    data-category="${category.id}">
              <span class="filter-icon">${category.icon}</span>
              <span class="filter-label">${category.label}</span>
              <span class="filter-count">${category.count}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderPhotoGrid() {
    return `
      <div class="photo-grid-container">
        <div class="photo-grid" id="photo-grid">
          ${this.photos.map((photo, index) => this.renderPhotoCard(photo, index)).join('')}
        </div>
      </div>
    `;
  }

  renderPhotoCard(photo, index) {
    const moodColors = {
      'nervous-excited': 'from-pink-400 to-purple-400',
      'romantic': 'from-red-400 to-pink-400',
      'adventurous': 'from-blue-400 to-green-400',
      'cozy': 'from-orange-400 to-yellow-400',
      'joyful': 'from-yellow-400 to-pink-400',
      'magical': 'from-purple-400 to-blue-400',
      'celebratory': 'from-gold to-orange-400'
    };

    return `
      <div class="photo-card" 
           data-category="${photo.category}" 
           data-index="${index}"
           style="--animation-delay: ${index * 0.1}s">
        <div class="photo-placeholder">
          <div class="photo-mood-bg" style="background: linear-gradient(135deg, ${moodColors[photo.mood] || 'from-gray-400 to-gray-600'})"></div>
          <div class="photo-content">
            <div class="photo-icon">📸</div>
            <h4 class="photo-title">${photo.title}</h4>
            <p class="photo-description">${photo.description}</p>
            <div class="photo-meta">
              <div class="photo-date">
                <span class="icon">📅</span>
                ${this.formatDate(photo.date)}
              </div>
              <div class="photo-location">
                <span class="icon">📍</span>
                ${photo.location}
              </div>
            </div>
          </div>
          <div class="photo-overlay">
            <button class="photo-action-button view-button" data-photo-id="${photo.id}">
              <span class="icon">👁️</span>
              View
            </button>
            <button class="photo-action-button favorite-button" data-photo-id="${photo.id}">
              <span class="icon">⭐</span>
              Favorite
            </button>
          </div>
        </div>
        <div class="photo-glow"></div>
      </div>
    `;
  }

  renderUploadArea() {
    return `
      <div class="upload-section">
        <h3 class="upload-title">
          <span class="icon">📤</span>
          Add New Memories
        </h3>
        <div class="upload-area" id="upload-area">
          <div class="upload-content">
            <div class="upload-icon">📸</div>
            <h4>Drag & Drop Photos Here</h4>
            <p>Or click to browse your beautiful memories</p>
            <button class="upload-button">
              <span class="icon">🌟</span>
              Choose Photos
            </button>
          </div>
          <input type="file" id="photo-upload" multiple accept="image/*" style="display: none;">
        </div>
      </div>
    `;
  }

  renderNavigation() {
    return `
      <div class="gallery-navigation">
        <button class="nav-button primary" id="back-home">
          <span class="button-icon">🏠</span>
          Back to Home
        </button>
        <button class="nav-button secondary" id="create-album">
          <span class="button-icon">📚</span>
          Create Album
        </button>
      </div>
    `;
  }

  calculateStats() {
    const uniqueMonths = new Set(
      this.photos.map(photo => photo.date.substring(0, 7))
    ).size;

    return {
      totalPhotos: this.photos.length,
      favoriteMemories: Math.floor(this.photos.length * 0.6), // Simulated favorites
      monthsDocumented: uniqueMonths,
      specialOccasions: this.photos.filter(p => p.category === 'special').length
    };
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  initializeGallery() {
    // Initialize photo interactions
    this.initializePhotoInteractions();
    
    // Initialize filter system
    this.initializeFilters();
    
    // Initialize upload functionality
    this.initializeUpload();
    
    // Initialize lightbox
    this.initializeLightbox();
  }

  initializePhotoInteractions() {
    const photoCards = this.container.querySelectorAll('.photo-card');
    
    photoCards.forEach(card => {
      // Hover effects
      card.addEventListener('mouseenter', () => {
        this.createPhotoHoverEffect(card);
      });
      
      // View button
      const viewButton = card.querySelector('.view-button');
      if (viewButton) {
        viewButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const photoId = viewButton.dataset.photoId;
          this.openLightbox(photoId);
        });
      }
      
      // Favorite button
      const favoriteButton = card.querySelector('.favorite-button');
      if (favoriteButton) {
        favoriteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleFavorite(card);
        });
      }
      
      // Double-click to view
      card.addEventListener('dblclick', () => {
        const photoId = card.querySelector('.view-button').dataset.photoId;
        this.openLightbox(photoId);
      });
    });
  }

  initializeFilters() {
    const filterButtons = this.container.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        this.filterPhotos(category);
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Add click animation
        this.addButtonClickEffect(button);
      });
    });
  }

  filterPhotos(category) {
    this.currentCategory = category;
    const photoCards = this.container.querySelectorAll('.photo-card');
    
    // Clear previous timeout
    if (this.filterAnimationTimeout) {
      clearTimeout(this.filterAnimationTimeout);
    }
    
    photoCards.forEach((card, index) => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === 'all' || cardCategory === category;
      
      // Staggered animation
      setTimeout(() => {
        if (shouldShow) {
          card.classList.remove('filtered-out');
          card.classList.add('filtered-in');
          card.style.display = 'block';
        } else {
          card.classList.remove('filtered-in');
          card.classList.add('filtered-out');
          
          setTimeout(() => {
            if (card.classList.contains('filtered-out')) {
              card.style.display = 'none';
            }
          }, 300);
        }
      }, index * 50);
    });
    
    // Update stats
    this.updateFilteredStats(category);
  }

  updateFilteredStats(category) {
    const filteredPhotos = category === 'all' ? 
      this.photos : 
      this.photos.filter(photo => photo.category === category);
    
    const totalPhotosEl = this.container.querySelector('#total-photos');
    if (totalPhotosEl) {
      this.animateNumber(totalPhotosEl, filteredPhotos.length);
    }
  }

  initializeUpload() {
    const uploadArea = this.container.querySelector('#upload-area');
    const uploadButton = this.container.querySelector('.upload-button');
    const fileInput = this.container.querySelector('#photo-upload');
    
    if (!uploadArea || !uploadButton || !fileInput) return;
    
    // Click to upload
    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });
    
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      this.handleFileUpload(Array.from(e.dataTransfer.files));
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      this.handleFileUpload(Array.from(e.target.files));
    });
  }

  handleFileUpload(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      this.showNotification('error', 'No Images Found', 'Please select image files only.');
      return;
    }
    
    imageFiles.forEach((file, index) => {
      setTimeout(() => {
        this.processPhotoUpload(file);
      }, index * 200);
    });
  }

  processPhotoUpload(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const newPhoto = {
        id: 'upload_' + Date.now(),
        category: 'candid',
        title: file.name.replace(/\.[^/.]+$/, ''),
        date: new Date().toISOString().split('T')[0],
        description: 'A beautiful new memory added to our collection',
        location: 'Memory Lane',
        mood: 'joyful'
      };
      
      this.addPhotoToGallery(newPhoto);
      this.showNotification('success', 'Photo Added! 📸', `${file.name} has been added to your gallery`);
    };
    
    reader.readAsDataURL(file);
  }

  addPhotoToGallery(photo) {
    this.photos.unshift(photo);
    
    // Re-render photo grid
    const photoGrid = this.container.querySelector('#photo-grid');
    if (photoGrid) {
      photoGrid.innerHTML = this.photos.map((p, index) => this.renderPhotoCard(p, index)).join('');
      this.initializePhotoInteractions();
    }
    
    // Update stats
    this.updateStats();
  }

  initializeLightbox() {
    // ESC key to close
    document.addEventListener('keydown', this.handleKeydown);
  }

  openLightbox(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;
    
    this.currentPhotoIndex = this.photos.findIndex(p => p.id === photoId);
    this.isLightboxOpen = true;
    
    const lightbox = document.createElement('div');
    lightbox.className = 'photo-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close">&times;</button>
        <div class="lightbox-photo">
          <div class="lightbox-placeholder">
            <div class="lightbox-icon">📸</div>
            <h3 class="lightbox-title">${photo.title}</h3>
            <p class="lightbox-description">${photo.description}</p>
            <div class="lightbox-meta">
              <div class="lightbox-date">
                <span class="icon">📅</span>
                ${this.formatDate(photo.date)}
              </div>
              <div class="lightbox-location">
                <span class="icon">📍</span>
                ${photo.location}
              </div>
            </div>
            <div class="lightbox-actions">
              <button class="lightbox-action-button favorite">
                <span class="icon">⭐</span>
                Add to Favorites
              </button>
              <button class="lightbox-action-button share">
                <span class="icon">📤</span>
                Share Memory
              </button>
            </div>
          </div>
        </div>
        <div class="lightbox-navigation">
          <button class="lightbox-nav-button prev" id="lightbox-prev">‹</button>
          <button class="lightbox-nav-button next" id="lightbox-next">›</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Add event listeners
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const prevBtn = lightbox.querySelector('#lightbox-prev');
    const nextBtn = lightbox.querySelector('#lightbox-next');
    
    closeBtn.addEventListener('click', this.closeLightbox);
    backdrop.addEventListener('click', this.closeLightbox);
    prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    nextBtn.addEventListener('click', () => this.navigateLightbox(1));
    
    // Animate appearance
    setTimeout(() => {
      lightbox.classList.add('show');
    }, 10);
  }

  navigateLightbox(direction) {
    const newIndex = this.currentPhotoIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.photos.length) {
      this.currentPhotoIndex = newIndex;
      this.closeLightbox();
      setTimeout(() => {
        this.openLightbox(this.photos[this.currentPhotoIndex].id);
      }, 300);
    }
  }

  closeLightbox() {
    const lightbox = document.querySelector('.photo-lightbox');
    if (lightbox) {
      lightbox.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(lightbox);
        this.isLightboxOpen = false;
      }, 300);
    }
  }

  handleKeydown(e) {
    if (!this.isLightboxOpen) return;
    
    switch (e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.navigateLightbox(-1);
        break;
      case 'ArrowRight':
        this.navigateLightbox(1);
        break;
    }
  }

  createPhotoHoverEffect(card) {
    const sparkles = ['✨', '💫', '⭐', '🌟'];
    const sparkle = document.createElement('div');
    sparkle.className = 'photo-sparkle';
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.position = 'absolute';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.fontSize = '1.5rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '20';
    sparkle.style.animation = 'sparkle-float 2s ease-out forwards';
    
    card.appendChild(sparkle);
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 2000);
  }

  toggleFavorite(card) {
    card.classList.toggle('favorite');
    
    if (card.classList.contains('favorite')) {
      this.showNotification('success', 'Added to Favorites! ⭐', 'This memory is now in your favorites');
      this.createFavoriteEffect(card);
    } else {
      this.showNotification('info', 'Removed from Favorites', 'Memory removed from favorites');
    }
  }

  createFavoriteEffect(card) {
    const hearts = ['💕', '❤️', '💖', '💗'];
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'favorite-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.top = '50%';
        heart.style.left = '50%';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '25';
        heart.style.animation = 'heart-burst 1.5s ease-out forwards';
        heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
        
        card.appendChild(heart);
        
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }, 1500);
      }, i * 100);
    }
  }

  addButtonClickEffect(button) {
    button.classList.add('clicked');
    setTimeout(() => {
      button.classList.remove('clicked');
    }, 200);
  }

  initializeParticleSystem() {
    const particles = ['📸', '💕', '✨', '📱', '🎨', '💫', '🌟', '📷'];
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'gallery-particle';
      particle.textContent = particles[Math.floor(Math.random() * particles.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
      particle.style.animationDelay = Math.random() * 3 + 's';
      
      this.container.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 10000);
    };
    
    this.particleSystem = setInterval(createParticle, 2000);
  }

  attachEventListeners() {
    // Navigation buttons
    const backHomeButton = this.container.querySelector('#back-home');
    const createAlbumButton = this.container.querySelector('#create-album');
    
    if (backHomeButton) {
      backHomeButton.addEventListener('click', () => {
        this.navigateToPage('home');
      });
    }
    
    if (createAlbumButton) {
      createAlbumButton.addEventListener('click', () => {
        this.showNotification('info', 'Album Creator Coming Soon! 📚', 'We\'re working on this feature');
      });
    }
    
    // Window resize
    window.addEventListener('resize', this.handleResize);
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleResize() {
    // Adjust grid layout for mobile
    const photoGrid = this.container.querySelector('.photo-grid');
    const isMobile = window.innerWidth < 768;
    
    if (photoGrid) {
      if (isMobile) {
        photoGrid.classList.add('mobile-layout');
      } else {
        photoGrid.classList.remove('mobile-layout');
      }
    }
  }

  startAnimations() {
    // Animate stats on entry
    setTimeout(() => {
      this.animateStats();
    }, 500);
    
    // Animate photo cards
    setTimeout(() => {
      this.animatePhotoCards();
    }, 800);
  }

  animateStats() {
    const stats = this.calculateStats();
    
    this.animateNumber(this.container.querySelector('#total-photos'), stats.totalPhotos);
    this.animateNumber(this.container.querySelector('#favorite-memories'), stats.favoriteMemories);
    this.animateNumber(this.container.querySelector('#months-documented'), stats.monthsDocumented);
    this.animateNumber(this.container.querySelector('#special-occasions'), stats.specialOccasions);
  }

  animatePhotoCards() {
    const photoCards = this.container.querySelectorAll('.photo-card');
    photoCards.forEach(card => {
      card.classList.add('animate-entry');
    });
  }

  animateNumber(element, targetValue, duration = 1500) {
    if (!element) return;
    
    const startValue = 0;
    const startTime = performance.now();
    
    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };
    
    requestAnimationFrame(updateNumber);
  }

  updateStats() {
    const stats = this.calculateStats();
    
    // Update filter counts
    const filterButtons = this.container.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
      const category = button.dataset.category;
      const countEl = button.querySelector('.filter-count');
      if (countEl) {
        if (category === 'all') {
          countEl.textContent = this.photos.length;
        } else {
          countEl.textContent = this.photos.filter(p => p.category === category).length;
        }
      }
    });
    
    // Animate stats update
    this.animateStats();
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

  showGalleryNotification() {
    this.showNotification('success', '📸 Gallery Loaded!', 'Browse through our beautiful memories together');
  }

  destroy() {
    // Stop particle system
    if (this.particleSystem) {
      clearInterval(this.particleSystem);
      this.particleSystem = null;
    }
    
    // Clear timeouts
    if (this.filterAnimationTimeout) {
      clearTimeout(this.filterAnimationTimeout);
    }
    
    // Remove event listeners
    this.removeEventListeners();
    
    // Close lightbox if open
    if (this.isLightboxOpen) {
      this.closeLightbox();
    }
    
    console.log('📸 Photo Gallery Page destroyed');
  }
}

// CSS styles for the photo gallery page
const photoGalleryPageStyles = `
  .vanilla-photo-gallery-page {
    min-height: 100vh;
    position: relative;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
  }

  .gallery-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 10;
  }

  .gallery-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .gallery-title {
    font-size: 3rem;
    font-weight: 700;
    background: var(--gradient-romantic);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(236, 72, 153, 0.3);
  }

  .gallery-subtitle {
    font-size: 1.5rem;
    color: var(--text-secondary);
    font-weight: 300;
  }

  .gallery-stats {
    margin-bottom: 3rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .stat-card {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 16px;
    padding: 2rem 1rem;
    text-align: center;
    position: relative;
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
    border-color: var(--accent-romantic);
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--glow-romantic);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: var(--text-secondary);
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .stat-icon {
    font-size: 1.5rem;
    opacity: 0.7;
  }

  .gallery-filters {
    margin-bottom: 3rem;
  }

  .filters-title {
    text-align: center;
    font-size: 1.5rem;
    color: var(--glow-romantic);
    margin-bottom: 1.5rem;
  }

  .filter-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filter-button {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
  }

  .filter-button.active,
  .filter-button:hover {
    background: var(--gradient-romantic);
    color: var(--text-primary);
    border-color: var(--accent-romantic);
    transform: translateY(-2px);
  }

  .filter-button.clicked {
    transform: scale(0.95);
  }

  .filter-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .photo-grid-container {
    margin: 3rem 0;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .photo-card {
    position: relative;
    opacity: 0;
    transform: translateY(30px) scale(0.9);
    transition: all 0.6s ease;
    animation-delay: var(--animation-delay);
  }

  .photo-card.animate-entry {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .photo-card.filtered-in {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .photo-card.filtered-out {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }

  .photo-placeholder {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 16px;
    padding: 2rem;
    position: relative;
    cursor: pointer;
    transition: all 0.4s ease;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .photo-card:hover .photo-placeholder {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  }

  .photo-mood-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    opacity: 0.8;
  }

  .photo-content {
    position: relative;
    z-index: 2;
  }

  .photo-icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .photo-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .photo-description {
    color: var(--text-secondary);
    text-align: center;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .photo-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-top: 1px solid var(--border-romantic);
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .photo-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 16px;
    z-index: 10;
  }

  .photo-card:hover .photo-overlay {
    opacity: 1;
  }

  .photo-action-button {
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

  .photo-action-button:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 16px var(--shadow-glow);
  }

  .photo-glow {
    position: absolute;
    inset: -2px;
    background: var(--gradient-romantic);
    border-radius: 18px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    filter: blur(8px);
  }

  .photo-card:hover .photo-glow {
    opacity: 0.2;
  }

  .photo-card.favorite {
    position: relative;
  }

  .photo-card.favorite::after {
    content: '⭐';
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    z-index: 15;
    animation: favorite-sparkle 2s ease-in-out infinite;
  }

  .upload-section {
    margin: 4rem 0;
  }

  .upload-title {
    text-align: center;
    font-size: 1.5rem;
    color: var(--glow-romantic);
    margin-bottom: 2rem;
  }

  .upload-area {
    background: var(--card-bg);
    border: 2px dashed var(--border-romantic);
    border-radius: 16px;
    padding: 3rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    max-width: 600px;
    margin: 0 auto;
  }

  .upload-area:hover,
  .upload-area.drag-over {
    border-color: var(--accent-romantic);
    background: rgba(255, 255, 255, 0.05);
    transform: scale(1.02);
  }

  .upload-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .upload-button {
    background: var(--gradient-romantic);
    border: none;
    border-radius: 50px;
    padding: 1rem 2rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    margin-top: 1rem;
  }

  .upload-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px var(--shadow-glow);
  }

  .gallery-navigation {
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
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    border-radius: 50%;
    animation: float-bubble 12s infinite linear;
    animation-delay: var(--delay);
  }

  .gallery-particle {
    position: absolute;
    font-size: 1.5rem;
    opacity: 0.6;
    pointer-events: none;
    z-index: 5;
    animation: particle-float 10s linear infinite;
  }

  .photo-sparkle {
    animation: sparkle-float 2s ease-out forwards;
  }

  .favorite-heart {
    animation: heart-burst 1.5s ease-out forwards;
  }

  /* Lightbox styles */
  .photo-lightbox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .photo-lightbox.show {
    opacity: 1;
  }

  .lightbox-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .lightbox-content {
    position: relative;
    width: 90%;
    max-width: 800px;
    margin: 5% auto;
    transform: scale(0.8);
    transition: transform 0.3s ease;
  }

  .photo-lightbox.show .lightbox-content {
    transform: scale(1);
  }

  .lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    background: none;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    z-index: 10;
  }

  .lightbox-close:hover {
    opacity: 1;
  }

  .lightbox-photo {
    background: var(--card-bg);
    border-radius: 16px;
    overflow: hidden;
    backdrop-filter: blur(20px);
  }

  .lightbox-placeholder {
    padding: 3rem;
    text-align: center;
    color: white;
  }

  .lightbox-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .lightbox-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .lightbox-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .lightbox-meta {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .lightbox-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .lightbox-action-button {
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
  }

  .lightbox-action-button:hover {
    transform: scale(1.05);
  }

  .lightbox-navigation {
    position: absolute;
    top: 50%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .lightbox-nav-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    pointer-events: all;
    transition: all 0.3s ease;
  }

  .lightbox-nav-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
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

  .pulse-animation {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes particle-float {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-10vh) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes sparkle-float {
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

  @keyframes heart-burst {
    0% {
      transform: translate(-50%, -50%) scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(0) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes favorite-sparkle {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1.2) rotate(180deg);
      opacity: 0.7;
    }
  }

  .page-exit {
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.3s ease;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .gallery-content {
      padding: 1rem;
    }

    .gallery-title {
      font-size: 2rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .stat-card {
      padding: 1.5rem 1rem;
    }

    .stat-value {
      font-size: 2rem;
    }

    .filter-buttons {
      gap: 0.5rem;
    }

    .filter-button {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .photo-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .photo-placeholder {
      padding: 1.5rem;
    }

    .photo-meta {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .upload-area {
      padding: 2rem;
    }

    .upload-icon {
      font-size: 3rem;
    }

    .gallery-navigation {
      flex-direction: column;
      align-items: center;
    }

    .nav-button {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }

    .lightbox-content {
      width: 95%;
      margin: 10% auto;
    }

    .lightbox-placeholder {
      padding: 2rem;
    }

    .lightbox-title {
      font-size: 1.5rem;
    }

    .lightbox-meta {
      flex-direction: column;
      gap: 1rem;
    }

    .lightbox-actions {
      flex-direction: column;
      align-items: center;
    }
  }

  @media (max-width: 480px) {
    .gallery-title {
      font-size: 1.8rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .filter-buttons {
      flex-direction: column;
      align-items: center;
    }

    .filter-button {
      width: 100%;
      max-width: 250px;
      justify-content: center;
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = photoGalleryPageStyles;
document.head.appendChild(styleElement);

// Make VanillaPhotoGalleryPage globally available
window.VanillaPhotoGalleryPage = VanillaPhotoGalleryPage;

export default VanillaPhotoGalleryPage;
