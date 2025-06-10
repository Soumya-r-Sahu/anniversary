/**
 * Vanilla JavaScript Time Calculator - Anniversary Website v4.0.0
 * Pure JavaScript implementation without React dependencies
 */

class VanillaTimeCalculator {
  constructor(options = {}) {
    this.options = {
      targetDate: '2024-06-16T00:00:00',
      updateInterval: 1000,
      showMilestones: true,
      showAnalytics: true,
      compact: false,
      className: '',
      ...options
    };
    
    this.targetDate = new Date(this.options.targetDate);
    this.updateTimer = null;
    this.element = null;
    this.currentStats = null;
    this.lastMilestone = 0;
    this.animations = new Set();
    
    this.init();
  }

  init() {
    this.currentStats = this.calculateTimeStats();
    this.bindMethods();
  }

  bindMethods() {
    this.update = this.update.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  mount(selector) {
    this.element = document.querySelector(selector);
    if (!this.element) {
      console.error('Time Calculator: Mount element not found:', selector);
      return;
    }
    
    this.render();
    this.startUpdating();
    this.attachEventListeners();
    
    console.log('💕 Time Calculator mounted');
    return this;
  }

  calculateTimeStats() {
    const now = new Date();
    const timeDiff = now.getTime() - this.targetDate.getTime();
    
    // Basic calculations
    const totalSeconds = Math.floor(timeDiff / 1000);
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Detailed breakdown
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Milestones
    const nextMilestone = this.calculateNextMilestone(totalDays);
    
    // Special messages
    const specialMessages = this.getSpecialMessages(totalDays, totalHours);
    
    // Progress percentage (to 1 year)
    const yearProgress = (totalDays / 365) * 100;
    
    return {
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      nextMilestone,
      specialMessages,
      yearProgress,
      timeDiff,
      timestamp: now.getTime()
    };
  }

  calculateNextMilestone(totalDays) {
    const milestones = [
      { days: 100, name: '100 Days', emoji: '💯' },
      { days: 365, name: '1 Year', emoji: '🎂' },
      { days: 500, name: '500 Days', emoji: '🎊' },
      { days: 730, name: '2 Years', emoji: '💍' },
      { days: 1000, name: '1000 Days', emoji: '🎆' },
      { days: 1095, name: '3 Years', emoji: '👑' },
      { days: 1460, name: '4 Years', emoji: '💎' },
      { days: 1825, name: '5 Years', emoji: '🏆' }
    ];
    
    for (const milestone of milestones) {
      if (totalDays < milestone.days) {
        const daysRemaining = milestone.days - totalDays;
        const progress = ((milestone.days - daysRemaining) / milestone.days) * 100;
        
        return {
          ...milestone,
          daysRemaining,
          progress
        };
      }
    }
    
    return null;
  }

  getSpecialMessages(totalDays, totalHours) {
    const messages = [];
    
    // Daily milestones
    if (totalDays % 100 === 0 && totalDays > 0) {
      messages.push(`🎉 ${totalDays} days of pure love!`);
    }
    
    // Weekly milestones
    if (totalDays % 7 === 0 && totalDays > 0) {
      const weeks = Math.floor(totalDays / 7);
      messages.push(`💕 ${weeks} weeks of beautiful memories!`);
    }
    
    // Monthly milestones (approximate)
    if (totalDays % 30 === 0 && totalDays > 0) {
      const months = Math.floor(totalDays / 30);
      messages.push(`🌟 ${months} months of growing stronger together!`);
    }
    
    // Special time patterns
    if (totalHours % 1000 === 0 && totalHours > 0) {
      messages.push(`⏰ ${totalHours.toLocaleString()} hours of togetherness!`);
    }
    
    return messages;
  }

  render() {
    if (!this.element) return;
    
    const stats = this.currentStats;
    const isMobile = window.innerWidth < 768;
    
    this.element.innerHTML = `
      <div class="vanilla-time-calculator ${this.options.className}">
        ${this.renderHeader()}
        ${this.renderMainStats(stats, isMobile)}
        ${!this.options.compact ? this.renderDetailedBreakdown(stats, isMobile) : ''}
        ${this.options.showMilestones && stats.nextMilestone ? this.renderNextMilestone(stats.nextMilestone) : ''}
        ${this.options.showAnalytics ? this.renderYearProgress(stats.yearProgress) : ''}
        ${stats.specialMessages.length > 0 ? this.renderSpecialMessages(stats.specialMessages) : ''}
      </div>
    `;
    
    this.attachCardEventListeners();
    this.startAnimations();
  }

  renderHeader() {
    return `
      <div class="time-calculator-header">
        <h2 class="time-calculator-title">
          <span class="icon">⏰</span>
          Our Time Together
          <span class="icon">💕</span>
        </h2>
        <p class="time-calculator-subtitle">
          <span class="icon">📅</span>
          Since June 16, 2024
        </p>
      </div>
    `;
  }

  renderMainStats(stats, isMobile) {
    const statsToShow = [
      { value: stats.totalDays, label: 'Days', icon: '📅', color: 'pink' },
      { value: stats.totalHours, label: 'Hours', icon: '⏰', color: 'purple' },
      { value: stats.totalMinutes, label: 'Minutes', icon: '📊', color: 'red' },
      { value: stats.totalSeconds, label: 'Seconds', icon: '✨', color: 'orange' }
    ];
    
    if (isMobile) {
      statsToShow.splice(3, 1); // Remove seconds on mobile
    }
    
    return `
      <div class="main-stats-grid">
        ${statsToShow.map((stat, index) => `
          <div class="stat-card stat-card-${stat.color}" data-index="${index}">
            <div class="stat-icon">${stat.icon}</div>
            <div class="stat-value" data-value="${stat.value}">
              ${stat.value.toLocaleString()}
            </div>
            <div class="stat-label">${stat.label}</div>
            ${stat.value % 100 === 0 && stat.value > 0 ? '<div class="milestone-indicator">🎉</div>' : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  renderDetailedBreakdown(stats, isMobile) {
    const breakdownItems = [
      { value: stats.years, label: 'Year', show: stats.years > 0 },
      { value: stats.months, label: 'Month', show: stats.months > 0 },
      { value: Math.floor(stats.totalDays / 7), label: 'Week', show: true },
      { value: stats.days, label: 'Day', show: true },
      { value: stats.hours, label: 'Hour', show: true },
      { value: stats.minutes, label: 'Minute', show: !isMobile }
    ].filter(item => item.show);
    
    return `
      <div class="detailed-breakdown">
        <h3 class="breakdown-title">
          <span class="icon">📊</span>
          Detailed Breakdown
        </h3>
        <div class="breakdown-grid">
          ${breakdownItems.map((item, index) => `
            <div class="breakdown-item" data-index="${index}">
              <div class="breakdown-value">${item.value}</div>
              <div class="breakdown-label">${item.label}${item.value !== 1 ? 's' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderNextMilestone(milestone) {
    return `
      <div class="next-milestone">
        <h3 class="milestone-title">
          <span class="icon">🎯</span>
          Next Milestone
        </h3>
        <div class="milestone-content">
          <div class="milestone-info">
            <div class="milestone-name">${milestone.emoji} ${milestone.name}</div>
            <div class="milestone-remaining">${milestone.daysRemaining} days remaining</div>
          </div>
          <div class="milestone-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${milestone.progress}%"></div>
            </div>
            <div class="progress-text">${Math.round(milestone.progress)}% complete</div>
          </div>
        </div>
      </div>
    `;
  }

  renderYearProgress(yearProgress) {
    return `
      <div class="year-progress">
        <div class="progress-info">
          <span class="icon">📈</span>
          This year together: ${Math.min(yearProgress, 100).toFixed(1)}%
        </div>
        <div class="progress-bar">
          <div class="progress-fill year-fill" style="width: ${Math.min(yearProgress, 100)}%"></div>
        </div>
      </div>
    `;
  }

  renderSpecialMessages(messages) {
    return `
      <div class="special-messages">
        <h3 class="messages-title">
          <span class="icon pulse-animation">✨</span>
          Special Moment!
        </h3>
        <div class="messages-list">
          ${messages.map((message, index) => `
            <div class="special-message" data-index="${index}">
              ${message}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachCardEventListeners() {
    // Add hover effects to stat cards
    const statCards = this.element.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
    
    // Add click effects
    const clickableElements = this.element.querySelectorAll('.stat-card, .breakdown-item');
    clickableElements.forEach(element => {
      element.addEventListener('click', (event) => {
        this.addRippleEffect(event.currentTarget, event);
      });
    });
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

  startAnimations() {
    // Animate stat cards entry
    const statCards = this.element.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-slide-up');
    });
    
    // Animate breakdown items
    const breakdownItems = this.element.querySelectorAll('.breakdown-item');
    breakdownItems.forEach((item, index) => {
      item.style.animationDelay = `${0.5 + index * 0.05}s`;
      item.classList.add('animate-fade-in');
    });
    
    // Animate progress bars
    setTimeout(() => {
      const progressFills = this.element.querySelectorAll('.progress-fill');
      progressFills.forEach(fill => {
        fill.classList.add('animate-width');
      });
    }, 800);
  }

  update() {
    const newStats = this.calculateTimeStats();
    
    // Check for significant changes
    const hasSignificantChange = this.hasSignificantChange(this.currentStats, newStats);
    
    this.currentStats = newStats;
    
    if (hasSignificantChange) {
      this.render();
    } else {
      // Just update the dynamic values
      this.updateDynamicValues(newStats);
    }
    
    // Check for milestones
    this.checkMilestones(newStats);
  }

  hasSignificantChange(oldStats, newStats) {
    if (!oldStats) return true;
    
    return (
      oldStats.totalDays !== newStats.totalDays ||
      oldStats.totalHours !== newStats.totalHours ||
      oldStats.specialMessages.length !== newStats.specialMessages.length
    );
  }

  updateDynamicValues(stats) {
    // Update stat values that change frequently
    const statElements = this.element.querySelectorAll('[data-value]');
    statElements.forEach(element => {
      const currentValue = parseInt(element.getAttribute('data-value'));
      const statType = element.closest('.stat-card').querySelector('.stat-label').textContent.toLowerCase();
      
      let newValue;
      switch (statType) {
        case 'seconds':
          newValue = stats.totalSeconds;
          break;
        case 'minutes':
          newValue = stats.totalMinutes;
          break;
        case 'hours':
          newValue = stats.totalHours;
          break;
        case 'days':
          newValue = stats.totalDays;
          break;
        default:
          return;
      }
      
      if (currentValue !== newValue) {
        element.textContent = newValue.toLocaleString();
        element.setAttribute('data-value', newValue);
        
        // Add update animation
        element.classList.add('value-updated');
        setTimeout(() => {
          element.classList.remove('value-updated');
        }, 300);
      }
    });
  }

  checkMilestones(stats) {
    // Check for milestone achievements
    const milestones = [100, 365, 500, 730, 1000];
    
    milestones.forEach(milestone => {
      if (stats.totalDays >= milestone && this.lastMilestone < milestone) {
        this.celebrateMilestone(milestone);
        this.lastMilestone = milestone;
      }
    });
  }

  celebrateMilestone(milestone) {
    // Dispatch milestone event
    const event = new CustomEvent('milestone:achieved', {
      detail: {
        days: milestone,
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(event);
    
    // Add celebration animation
    this.element.classList.add('milestone-celebration');
    setTimeout(() => {
      this.element.classList.remove('milestone-celebration');
    }, 2000);
  }

  startUpdating() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
    
    this.updateTimer = setInterval(this.update, this.options.updateInterval);
  }

  stopUpdating() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  attachEventListeners() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleResize() {
    // Debounce resize handling
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.render();
    }, 250);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.stopUpdating();
    } else {
      this.startUpdating();
    }
  }

  destroy() {
    this.stopUpdating();
    this.removeEventListeners();
    
    if (this.element) {
      this.element.innerHTML = '';
    }
    
    // Clear any pending timeouts
    clearTimeout(this.resizeTimeout);
    
    console.log('💔 Time Calculator destroyed');
  }
}

// CSS styles for the time calculator
const timeCalculatorStyles = `
  .vanilla-time-calculator {
    background: var(--card-bg);
    border: 1px solid var(--border-romantic);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 2px 8px var(--shadow-romantic);
    transition: all 0.3s ease;
  }

  .time-calculator-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .time-calculator-title {
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .time-calculator-subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .main-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--border-romantic);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .stat-card:hover,
  .stat-card.hovered {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 24px var(--shadow-glow);
    border-color: var(--accent-2);
  }

  .stat-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
  }

  .stat-value.value-updated {
    transform: scale(1.1);
    color: var(--glow-romantic);
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .milestone-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    animation: bounce 2s infinite;
  }

  .detailed-breakdown {
    margin-bottom: 2rem;
  }

  .breakdown-title {
    color: var(--text-primary);
    margin-bottom: 1rem;
    text-align: center;
  }

  .breakdown-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }

  .breakdown-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .breakdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .breakdown-value {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--glow-romantic);
    margin-bottom: 0.25rem;
  }

  .breakdown-label {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }

  .next-milestone,
  .year-progress {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .milestone-title,
  .progress-info {
    color: var(--text-primary);
    margin-bottom: 1rem;
    text-align: center;
  }

  .milestone-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .milestone-info {
    flex: 1;
  }

  .milestone-name {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--glow-romantic);
    margin-bottom: 0.25rem;
  }

  .milestone-remaining {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .milestone-progress {
    flex: 1;
  }

  .progress-bar {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    height: 8px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    background: var(--gradient-romantic);
    height: 100%;
    border-radius: 10px;
    transition: width 1s ease;
  }

  .progress-fill.animate-width {
    animation: fillProgress 1s ease-out;
  }

  .year-fill {
    background: var(--gradient-golden);
  }

  .progress-text {
    color: var(--text-secondary);
    font-size: 0.8rem;
    text-align: center;
  }

  .special-messages {
    background: rgba(255, 207, 158, 0.1);
    border: 1px solid var(--border-golden);
    border-radius: 12px;
    padding: 1.5rem;
  }

  .messages-title {
    color: var(--glow-golden);
    margin-bottom: 1rem;
    text-align: center;
  }

  .special-message {
    color: var(--text-accent);
    margin-bottom: 0.5rem;
    animation: fadeInUp 0.5s ease-out forwards;
  }

  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 248, 246, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }

  .pulse-animation {
    animation: pulse 2s infinite;
  }

  .milestone-celebration {
    animation: celebration 2s ease-out;
  }

  .animate-slide-up {
    animation: slideUp 0.5s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  /* Animations */
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fillProgress {
    from {
      width: 0;
    }
  }

  @keyframes celebration {
    0%, 100% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.05);
    }
    50% {
      transform: scale(1.1);
    }
    75% {
      transform: scale(1.05);
    }
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .vanilla-time-calculator {
      padding: 1rem;
    }

    .main-stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .stat-card {
      padding: 1rem;
    }

    .stat-value {
      font-size: 1.5rem;
    }

    .breakdown-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .milestone-content {
      flex-direction: column;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .time-calculator-title {
      font-size: 1.5rem;
    }

    .breakdown-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = timeCalculatorStyles;
document.head.appendChild(styleElement);

// Make VanillaTimeCalculator globally available
window.VanillaTimeCalculator = VanillaTimeCalculator;

export default VanillaTimeCalculator;
