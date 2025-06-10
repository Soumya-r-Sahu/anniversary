/**
 * Special Dates Page - Vanilla JavaScript Implementation
 * Anniversary Website v4.0.0
 * 
 * Interactive calendar page showcasing important dates,
 * milestones, and special memories in our relationship.
 */

export class SpecialDatesPage {
  constructor() {
    this.container = null;
    this.currentDate = new Date();
    this.selectedDate = null;
    this.specialDates = [];
    this.particles = [];
    this.animationId = null;
    this.isVisible = false;
    this.currentView = 'timeline'; // 'timeline' | 'calendar' | 'grid'
    
    // Page configuration
    this.config = {
      particleCount: 20,
      relationshipStart: new Date('2024-06-16'),
      categories: [
        { id: 'all', label: 'All Dates', icon: '📅', color: 'from-purple-400 to-pink-400' },
        { id: 'milestone', label: 'Milestones', icon: '🎯', color: 'from-blue-400 to-purple-400' },
        { id: 'romantic', label: 'Romantic', icon: '💕', color: 'from-pink-400 to-red-400' },
        { id: 'celebration', label: 'Celebrations', icon: '🎉', color: 'from-yellow-400 to-orange-400' },
        { id: 'memory', label: 'Special Memories', icon: '✨', color: 'from-green-400 to-blue-400' }
      ]
    };
  }

  /**
   * Create and return the page HTML structure
   */
  render() {
    const html = `
      <div class="special-dates-page min-h-screen relative">
        <!-- Particle Canvas -->
        <canvas id="dates-particles" class="fixed inset-0 pointer-events-none z-0"></canvas>
        
        <!-- Floating Hearts -->
        <div class="floating-hearts-container"></div>
        
        <!-- Main Content -->
        <div class="relative z-10 px-4 py-8">
          <div class="max-w-6xl mx-auto">
            
            <!-- Header Section -->
            <div class="text-center mb-12">
              <div class="calendar-icon-container mb-6">
                <div class="calendar-icon text-6xl md:text-7xl animate-pulse">📅</div>
              </div>
              <h1 class="dates-title text-4xl md:text-6xl font-bold gradient-text mb-4 font-dancing">
                📅 Our Special Dates 📅
              </h1>
              <p class="dates-subtitle text-xl text-pink-700 font-dancing mb-8">
                Important moments in our beautiful journey together 💕
              </p>
              
              <!-- Relationship Counter -->
              <div class="relationship-counter glassmorphism rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <div class="text-center">
                  <div class="counter-title text-lg font-semibold text-pink-600 mb-2">Together Since</div>
                  <div class="counter-date text-2xl font-dancing text-purple-600 mb-4">June 16, 2024</div>
                  <div class="counter-stats grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="stat-item">
                      <div class="stat-number" id="daysTogether">0</div>
                      <div class="stat-label">Days</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number" id="weeksTogether">0</div>
                      <div class="stat-label">Weeks</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number" id="monthsTogether">0</div>
                      <div class="stat-label">Months</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number" id="memoriesMade">∞</div>
                      <div class="stat-label">Memories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- View Toggle -->
            <div class="view-toggle-section mb-8">
              <div class="view-toggles">
                <button class="view-toggle active" data-view="timeline">
                  📊 Timeline View
                </button>
                <button class="view-toggle" data-view="calendar">
                  📅 Calendar View
                </button>
                <button class="view-toggle" data-view="grid">
                  🗂️ Grid View
                </button>
              </div>
            </div>

            <!-- Category Filters -->
            <div class="category-section mb-8">
              <h2 class="text-xl font-dancing text-purple-600 mb-4 text-center">Filter by Category</h2>
              <div class="category-filters">
                ${this.renderCategoryButtons()}
              </div>
            </div>

            <!-- Main Content Area -->
            <div class="content-area mb-12">
              
              <!-- Timeline View -->
              <div id="timelineView" class="view-content active">
                <div class="timeline-container">
                  <div class="timeline-line"></div>
                  <div class="timeline-items" id="timelineItems">
                    <!-- Timeline items will be rendered here -->
                  </div>
                </div>
              </div>

              <!-- Calendar View -->
              <div id="calendarView" class="view-content">
                <div class="calendar-container">
                  <div class="calendar-header">
                    <button class="calendar-nav" id="prevMonth">‹</button>
                    <h3 class="calendar-month" id="calendarMonth">December 2024</h3>
                    <button class="calendar-nav" id="nextMonth">›</button>
                  </div>
                  <div class="calendar-grid" id="calendarGrid">
                    <!-- Calendar will be rendered here -->
                  </div>
                </div>
              </div>

              <!-- Grid View -->
              <div id="gridView" class="view-content">
                <div class="dates-grid" id="datesGrid">
                  <!-- Grid items will be rendered here -->
                </div>
              </div>

            </div>

            <!-- Add New Date Section -->
            <div class="add-date-section mb-12">
              <div class="glassmorphism rounded-2xl p-8">
                <h2 class="text-2xl font-dancing text-purple-600 mb-6 text-center">
                  Add a Special Date
                </h2>
                <form class="add-date-form" id="addDateForm">
                  <div class="form-row">
                    <input type="text" placeholder="Event Title" class="date-input" name="title" required>
                    <input type="date" class="date-input" name="date" required>
                  </div>
                  <div class="form-row">
                    <select class="date-select" name="category" required>
                      <option value="">Select Category</option>
                      <option value="milestone">🎯 Milestone</option>
                      <option value="romantic">💕 Romantic</option>
                      <option value="celebration">🎉 Celebration</option>
                      <option value="memory">✨ Special Memory</option>
                    </select>
                    <input type="text" placeholder="Location (optional)" class="date-input" name="location">
                  </div>
                  <textarea placeholder="Describe this special moment..." class="date-textarea" name="description" rows="3"></textarea>
                  <button type="submit" class="add-date-btn">Add Special Date 📅</button>
                </form>
              </div>
            </div>

            <!-- Upcoming Dates -->
            <div class="upcoming-section mb-12">
              <h2 class="text-2xl font-dancing text-purple-600 mb-6 text-center">
                Upcoming Special Dates
              </h2>
              <div class="upcoming-dates" id="upcomingDates">
                <!-- Upcoming dates will be rendered here -->
              </div>
            </div>

            <!-- Back to Home -->
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
   * Render category filter buttons
   */
  renderCategoryButtons() {
    return this.config.categories.map(category => `
      <button class="category-btn ${category.id === 'all' ? 'active' : ''}" 
              data-category="${category.id}">
        <span class="category-icon">${category.icon}</span>
        <span class="category-label">${category.label}</span>
        <div class="category-glow bg-gradient-to-r ${category.color} opacity-0"></div>
      </button>
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
    this.loadSpecialDates();
    this.setupEventListeners();
    this.initializeParticleSystem();
    this.initializeFloatingHearts();
    this.calculateRelationshipStats();
    this.renderCurrentView();
    this.renderUpcomingDates();
    this.startAnimations();

    console.log('Special Dates page initialized');
  }

  /**
   * Load default special dates
   */
  loadSpecialDates() {
    this.specialDates = [
      {
        id: 1,
        title: "First Time We Talked",
        date: new Date('2024-06-16'),
        category: "milestone",
        location: "Online",
        description: "The magical day when Jerry and Soumya first started talking. The beginning of our beautiful love story.",
        isImportant: true
      },
      {
        id: 2,
        title: "One Week Together",
        date: new Date('2024-06-23'),
        category: "celebration",
        location: "",
        description: "Celebrating our first week of talking and getting to know each other.",
        isImportant: false
      },
      {
        id: 3,
        title: "One Month Anniversary",
        date: new Date('2024-07-16'),
        category: "romantic",
        location: "",
        description: "Our first month together - filled with sweet messages and growing love.",
        isImportant: true
      },
      {
        id: 4,
        title: "First 'I Love You'",
        date: new Date('2024-07-25'),
        category: "romantic",
        location: "Text Message",
        description: "The day we first said those three special words to each other.",
        isImportant: true
      },
      {
        id: 5,
        title: "100 Days Together",
        date: new Date('2024-09-24'),
        category: "milestone",
        location: "",
        description: "Celebrating 100 beautiful days of love, laughter, and growing closer.",
        isImportant: true
      },
      {
        id: 6,
        title: "First Halloween Together",
        date: new Date('2024-10-31'),
        category: "celebration",
        location: "",
        description: "Our first Halloween as a couple - sweet and spooky memories.",
        isImportant: false
      },
      {
        id: 7,
        title: "6 Month Anniversary",
        date: new Date('2024-12-16'),
        category: "romantic",
        location: "",
        description: "Half a year of pure love and happiness together.",
        isImportant: true
      },
      {
        id: 8,
        title: "New Year Together",
        date: new Date('2025-01-01'),
        category: "celebration",
        location: "",
        description: "Starting the new year with love and hopes for our future.",
        isImportant: true
      },
      {
        id: 9,
        title: "One Year Anniversary",
        date: new Date('2025-06-16'),
        category: "milestone",
        location: "",
        description: "Our first year anniversary - a celebration of 365 days of love.",
        isImportant: true
      }
    ];

    // Sort dates chronologically
    this.specialDates.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // View toggles
    const viewToggles = this.container.querySelectorAll('.view-toggle');
    viewToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        this.switchView(view);
      });
    });

    // Category filters
    const categoryBtns = this.container.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.filterByCategory(category);
      });

      // Hover effects
      btn.addEventListener('mouseenter', (e) => {
        const glow = e.currentTarget.querySelector('.category-glow');
        if (glow) glow.style.opacity = '0.1';
      });

      btn.addEventListener('mouseleave', (e) => {
        const glow = e.currentTarget.querySelector('.category-glow');
        if (glow) glow.style.opacity = '0';
      });
    });

    // Calendar navigation
    const prevMonth = this.container.querySelector('#prevMonth');
    const nextMonth = this.container.querySelector('#nextMonth');
    if (prevMonth) prevMonth.addEventListener('click', () => this.navigateCalendar(-1));
    if (nextMonth) nextMonth.addEventListener('click', () => this.navigateCalendar(1));

    // Add date form
    const addDateForm = this.container.querySelector('#addDateForm');
    if (addDateForm) {
      addDateForm.addEventListener('submit', (e) => this.addSpecialDate(e));
    }

    // Home button
    const homeButton = this.container.querySelector('.home-button');
    if (homeButton) {
      homeButton.addEventListener('click', () => this.handleNavigation('/'));
    }
  }

  /**
   * Initialize particle system
   */
  initializeParticleSystem() {
    const canvas = this.container.querySelector('#dates-particles');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    // Create calendar-themed particles
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.4 + 0.2,
        color: `hsl(${Math.random() * 60 + 300}, 70%, 70%)`,
        shape: Math.random() > 0.5 ? 'circle' : 'square'
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
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        if (particle.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
        }
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
   * Initialize floating hearts
   */
  initializeFloatingHearts() {
    const container = this.container.querySelector('.floating-hearts-container');
    if (!container) return;

    const hearts = ['💕', '💖', '💗', '💘', '💙', '💜'];
    
    // Create floating hearts
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 15 + 10}px;
        animation: float-heart ${Math.random() * 12 + 18}s infinite linear;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 8}s;
        pointer-events: none;
        z-index: 1;
      `;
      container.appendChild(heart);
    }
  }

  /**
   * Calculate relationship statistics
   */
  calculateRelationshipStats() {
    const now = new Date();
    const start = this.config.relationshipStart;
    const diffTime = Math.abs(now - start);
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44); // Average days per month

    // Animate counters
    this.animateCounter('daysTogether', days);
    this.animateCounter('weeksTogether', weeks);
    this.animateCounter('monthsTogether', months);
  }

  /**
   * Animate counter
   */
  animateCounter(elementId, target) {
    const element = this.container.querySelector(`#${elementId}`);
    if (!element) return;
    
    let current = 0;
    const increment = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current;
    }, 30);
  }

  /**
   * Switch between views
   */
  switchView(view) {
    this.currentView = view;

    // Update toggle buttons
    this.container.querySelectorAll('.view-toggle').forEach(toggle => {
      toggle.classList.remove('active');
    });
    this.container.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Show/hide view content
    this.container.querySelectorAll('.view-content').forEach(content => {
      content.classList.remove('active');
    });
    this.container.querySelector(`#${view}View`).classList.add('active');

    // Render current view
    this.renderCurrentView();
  }

  /**
   * Render current view
   */
  renderCurrentView() {
    switch (this.currentView) {
      case 'timeline':
        this.renderTimelineView();
        break;
      case 'calendar':
        this.renderCalendarView();
        break;
      case 'grid':
        this.renderGridView();
        break;
    }
  }

  /**
   * Render timeline view
   */
  renderTimelineView() {
    const timelineItems = this.container.querySelector('#timelineItems');
    if (!timelineItems) return;

    const filteredDates = this.getFilteredDates();
    
    timelineItems.innerHTML = filteredDates.map((date, index) => {
      const isLeft = index % 2 === 0;
      const daysPassed = Math.floor((new Date() - new Date(date.date)) / (1000 * 60 * 60 * 24));
      const isUpcoming = daysPassed < 0;
      
      return `
        <div class="timeline-item ${isLeft ? 'left' : 'right'} ${isUpcoming ? 'upcoming' : ''}" 
             style="animation-delay: ${index * 0.1}s;">
          <div class="timeline-content">
            <div class="timeline-date">
              ${new Date(date.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <h3 class="timeline-title">${date.title}</h3>
            ${date.location ? `<p class="timeline-location">📍 ${date.location}</p>` : ''}
            <p class="timeline-description">${date.description}</p>
            <div class="timeline-category">
              ${this.getCategoryIcon(date.category)} ${this.getCategoryLabel(date.category)}
            </div>
            ${date.isImportant ? '<div class="timeline-important">⭐ Important</div>' : ''}
            ${isUpcoming ? `<div class="timeline-countdown">In ${Math.abs(daysPassed)} days</div>` : 
              `<div class="timeline-ago">${daysPassed} days ago</div>`}
          </div>
          <div class="timeline-marker"></div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render calendar view
   */
  renderCalendarView() {
    const calendarGrid = this.container.querySelector('#calendarGrid');
    const calendarMonth = this.container.querySelector('#calendarMonth');
    if (!calendarGrid || !calendarMonth) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    calendarMonth.textContent = new Date(year, month).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate calendar grid
    let calendarHTML = '';
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
      calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarHTML += '<div class="calendar-day empty"></div>';
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const hasEvents = this.specialDates.some(d => 
        new Date(d.date).toISOString().split('T')[0] === dateStr
      );
      
      const isToday = date.toDateString() === new Date().toDateString();
      
      calendarHTML += `
        <div class="calendar-day ${hasEvents ? 'has-events' : ''} ${isToday ? 'today' : ''}" 
             data-date="${dateStr}">
          <span class="day-number">${day}</span>
          ${hasEvents ? '<div class="event-indicator"></div>' : ''}
        </div>
      `;
    }

    calendarGrid.innerHTML = calendarHTML;

    // Add click handlers for calendar days
    this.container.querySelectorAll('.calendar-day[data-date]').forEach(day => {
      day.addEventListener('click', (e) => {
        const date = e.currentTarget.dataset.date;
        this.showDateDetails(date);
      });
    });
  }

  /**
   * Render grid view
   */
  renderGridView() {
    const datesGrid = this.container.querySelector('#datesGrid');
    if (!datesGrid) return;

    const filteredDates = this.getFilteredDates();
    
    datesGrid.innerHTML = filteredDates.map((date, index) => `
      <div class="date-card" style="animation-delay: ${index * 0.05}s;">
        <div class="date-card-header">
          <div class="date-card-date">
            ${new Date(date.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div class="date-card-category">
            ${this.getCategoryIcon(date.category)}
          </div>
        </div>
        <h3 class="date-card-title">${date.title}</h3>
        ${date.location ? `<p class="date-card-location">📍 ${date.location}</p>` : ''}
        <p class="date-card-description">${date.description}</p>
        ${date.isImportant ? '<div class="date-card-important">⭐ Important</div>' : ''}
      </div>
    `).join('');
  }

  /**
   * Navigate calendar months
   */
  navigateCalendar(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendarView();
  }

  /**
   * Get filtered dates based on current category
   */
  getFilteredDates() {
    const activeCategory = this.container.querySelector('.category-btn.active')?.dataset.category || 'all';
    
    if (activeCategory === 'all') {
      return this.specialDates;
    }
    
    return this.specialDates.filter(date => date.category === activeCategory);
  }

  /**
   * Filter dates by category
   */
  filterByCategory(category) {
    // Update active button
    this.container.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    this.container.querySelector(`[data-category="${category}"]`).classList.add('active');

    // Re-render current view
    this.renderCurrentView();
  }

  /**
   * Render upcoming dates
   */
  renderUpcomingDates() {
    const upcomingContainer = this.container.querySelector('#upcomingDates');
    if (!upcomingContainer) return;

    const now = new Date();
    const upcoming = this.specialDates
      .filter(date => new Date(date.date) > now)
      .slice(0, 3);

    if (upcoming.length === 0) {
      upcomingContainer.innerHTML = `
        <div class="no-upcoming">
          <p class="text-center text-gray-600">No upcoming special dates. Add some!</p>
        </div>
      `;
      return;
    }

    upcomingContainer.innerHTML = upcoming.map((date, index) => {
      const daysUntil = Math.ceil((new Date(date.date) - now) / (1000 * 60 * 60 * 24));
      
      return `
        <div class="upcoming-card" style="animation-delay: ${index * 0.1}s;">
          <div class="upcoming-countdown">${daysUntil} days</div>
          <div class="upcoming-info">
            <h3 class="upcoming-title">${date.title}</h3>
            <p class="upcoming-date">
              ${new Date(date.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div class="upcoming-category">
              ${this.getCategoryIcon(date.category)} ${this.getCategoryLabel(date.category)}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Add a new special date
   */
  addSpecialDate(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newDate = {
      id: this.specialDates.length + 1,
      title: formData.get('title'),
      date: new Date(formData.get('date')),
      category: formData.get('category'),
      location: formData.get('location') || '',
      description: formData.get('description') || '',
      isImportant: false
    };
    
    this.specialDates.push(newDate);
    this.specialDates.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Re-render current view and upcoming dates
    this.renderCurrentView();
    this.renderUpcomingDates();
    
    // Reset form
    event.target.reset();
    
    this.showNotification('Special date added! 📅');
  }

  /**
   * Show date details
   */
  showDateDetails(dateStr) {
    const dateEvents = this.specialDates.filter(d => 
      new Date(d.date).toISOString().split('T')[0] === dateStr
    );
    
    if (dateEvents.length > 0) {
      // Show details modal or highlight events
      this.showNotification(`${dateEvents.length} event(s) on this date!`);
    }
  }

  /**
   * Utility methods
   */
  getCategoryIcon(category) {
    const categoryConfig = this.config.categories.find(c => c.id === category);
    return categoryConfig ? categoryConfig.icon : '📅';
  }

  getCategoryLabel(category) {
    const categoryConfig = this.config.categories.find(c => c.id === category);
    return categoryConfig ? categoryConfig.label : 'Unknown';
  }

  /**
   * Start page animations
   */
  startAnimations() {
    // Animate timeline items
    const timelineItems = this.container.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
      }, index * 100);
    });

    // Animate date cards
    const dateCards = this.container.querySelectorAll('.date-card');
    dateCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('slide-in-up');
      }, index * 50);
    });
  }

  /**
   * Show notification
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #9333ea, #ec4899);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 10px 30px rgba(147, 51, 234, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Handle navigation
   */
  handleNavigation(route) {
    if (window.VanillaCore && window.VanillaCore.router) {
      window.VanillaCore.router.navigate(route);
    } else {
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

    this.particles = [];
    
    if (this.container) {
      this.container.innerHTML = '';
    }

    console.log('Special Dates page destroyed');
  }
}

// CSS Styles for the special dates page
const specialDatesStyles = `
  .special-dates-page {
    background: linear-gradient(135deg, #fef7f0 0%, #fdf2f8 25%, #f3e8ff 50%, #fdf2f8 75%, #fef7f0 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  .dates-title {
    background: linear-gradient(135deg, #9333ea, #ec4899, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(147, 51, 234, 0.3);
  }

  .relationship-counter {
    backdrop-filter: blur(20px);
    box-shadow: 0 15px 35px rgba(147, 51, 234, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .counter-stats {
    gap: 1rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #9333ea;
    font-family: 'Dancing Script', cursive;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .view-toggles {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .view-toggle {
    padding: 0.75rem 1.5rem;
    background: rgba(147, 51, 234, 0.1);
    border: 1px solid rgba(147, 51, 234, 0.3);
    border-radius: 2rem;
    color: #9333ea;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .view-toggle:hover,
  .view-toggle.active {
    background: rgba(147, 51, 234, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(147, 51, 234, 0.3);
  }

  .category-filters {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .category-btn {
    position: relative;
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(147, 51, 234, 0.2);
    border-radius: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-btn:hover,
  .category-btn.active {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(147, 51, 234, 0.2);
  }

  .category-btn.active {
    background: rgba(147, 51, 234, 0.15);
    border-color: rgba(147, 51, 234, 0.4);
  }

  .category-glow {
    position: absolute;
    inset: 0;
    border-radius: 2rem;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .view-content {
    display: none;
  }

  .view-content.active {
    display: block;
  }

  /* Timeline View Styles */
  .timeline-container {
    position: relative;
    max-width: 4xl;
    margin: 0 auto;
  }

  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #9333ea, #ec4899);
    transform: translateX(-50%);
    border-radius: 2px;
  }

  .timeline-item {
    position: relative;
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }

  .timeline-item.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  .timeline-item.left .timeline-content {
    margin-right: calc(50% + 2rem);
    text-align: right;
  }

  .timeline-item.right .timeline-content {
    margin-left: calc(50% + 2rem);
    text-align: left;
  }

  .timeline-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(147, 51, 234, 0.2);
    box-shadow: 0 10px 30px rgba(147, 51, 234, 0.1);
  }

  .timeline-item.upcoming .timeline-content {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.3);
  }

  .timeline-marker {
    position: absolute;
    left: 50%;
    top: 1.5rem;
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #9333ea, #ec4899);
    border-radius: 50%;
    transform: translateX(-50%);
    border: 3px solid white;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.3);
  }

  .timeline-date {
    font-size: 0.875rem;
    color: #9333ea;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .timeline-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .timeline-location {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .timeline-description {
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .timeline-category {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(147, 51, 234, 0.1);
    border-radius: 1rem;
    font-size: 0.75rem;
    color: #9333ea;
    font-weight: 600;
  }

  .timeline-important {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(255, 215, 0, 0.2);
    border-radius: 1rem;
    font-size: 0.75rem;
    color: #d97706;
    font-weight: 600;
    margin-left: 0.5rem;
  }

  .timeline-countdown,
  .timeline-ago {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  /* Calendar View Styles */
  .calendar-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid rgba(147, 51, 234, 0.2);
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .calendar-nav {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(147, 51, 234, 0.1);
    border: 1px solid rgba(147, 51, 234, 0.3);
    color: #9333ea;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .calendar-nav:hover {
    background: rgba(147, 51, 234, 0.2);
    transform: scale(1.1);
  }

  .calendar-month {
    font-size: 1.5rem;
    font-weight: 600;
    color: #9333ea;
    font-family: 'Dancing Script', cursive;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: rgba(147, 51, 234, 0.1);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .calendar-day-header {
    background: rgba(147, 51, 234, 0.2);
    padding: 0.75rem;
    text-align: center;
    font-weight: 600;
    color: #9333ea;
    font-size: 0.875rem;
  }

  .calendar-day {
    background: rgba(255, 255, 255, 0.8);
    padding: 0.75rem;
    min-height: 3rem;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .calendar-day:hover {
    background: rgba(147, 51, 234, 0.1);
  }

  .calendar-day.today {
    background: rgba(147, 51, 234, 0.15);
    color: #9333ea;
    font-weight: 600;
  }

  .calendar-day.has-events {
    background: rgba(236, 72, 153, 0.1);
  }

  .calendar-day.empty {
    background: rgba(0, 0, 0, 0.05);
    cursor: default;
  }

  .event-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    background: #ec4899;
    border-radius: 50%;
  }

  /* Grid View Styles */
  .dates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .date-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(147, 51, 234, 0.2);
    transition: all 0.3s ease;
    transform: translateY(20px);
    opacity: 0;
  }

  .date-card.slide-in-up {
    transform: translateY(0);
    opacity: 1;
  }

  .date-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(147, 51, 234, 0.2);
  }

  .date-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .date-card-date {
    font-weight: 600;
    color: #9333ea;
  }

  .date-card-category {
    font-size: 1.25rem;
  }

  .date-card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .date-card-location {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .date-card-description {
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .date-card-important {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(255, 215, 0, 0.2);
    border-radius: 1rem;
    font-size: 0.75rem;
    color: #d97706;
    font-weight: 600;
  }

  /* Add Date Form Styles */
  .add-date-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .date-input,
  .date-select,
  .date-textarea {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(147, 51, 234, 0.3);
    border-radius: 0.75rem;
    color: #374151;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .date-input:focus,
  .date-select:focus,
  .date-textarea:focus {
    outline: none;
    border-color: rgba(147, 51, 234, 0.5);
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }

  .add-date-btn {
    background: linear-gradient(135deg, #9333ea, #ec4899);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-date-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(147, 51, 234, 0.3);
  }

  /* Upcoming Dates Styles */
  .upcoming-dates {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .upcoming-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(147, 51, 234, 0.2);
    transition: all 0.3s ease;
    transform: translateX(-20px);
    opacity: 0;
  }

  .upcoming-card {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .upcoming-countdown {
    background: linear-gradient(135deg, #9333ea, #ec4899);
    color: white;
    padding: 1rem;
    border-radius: 1rem;
    text-align: center;
    font-weight: 600;
    min-width: 80px;
  }

  .upcoming-info {
    flex: 1;
  }

  .upcoming-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .upcoming-date {
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .upcoming-category {
    font-size: 0.875rem;
    color: #9333ea;
    font-weight: 600;
  }

  /* Floating Hearts Animation */
  @keyframes float-heart {
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

  @keyframes slideInLeft {
    from {
      transform: translateX(-30px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .timeline-line {
      left: 2rem;
    }

    .timeline-item.left .timeline-content,
    .timeline-item.right .timeline-content {
      margin-left: 4rem;
      margin-right: 0;
      text-align: left;
    }

    .timeline-marker {
      left: 2rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .upcoming-card {
      flex-direction: column;
      text-align: center;
    }

    .view-toggles {
      flex-wrap: wrap;
    }

    .category-filters {
      justify-content: center;
    }

    .dates-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .dates-title {
      font-size: 2.5rem !important;
    }

    .counter-stats {
      grid-template-columns: 2fr 2fr;
      gap: 0.75rem;
    }

    .stat-number {
      font-size: 1.5rem;
    }
  }
`;

// Inject styles
if (!document.getElementById('special-dates-page-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'special-dates-page-styles';
  styleSheet.textContent = specialDatesStyles;
  document.head.appendChild(styleSheet);
}

export default SpecialDatesPage;
