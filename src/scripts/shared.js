/**
 * Anniversary Website v3.0.0 - Shared JavaScript for HTML Pages
 * Common functionality across all static HTML pages
 */

// Anniversary start date
const ANNIVERSARY_START_DATE = new Date('2024-06-16T00:00:00');

// Theme management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('anniversary-theme') || 'auto';
    this.init();
  }

  init() {
    this.updateTheme();
    this.setupToggle();
    
    // Listen for system theme changes
    if (this.theme === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => this.updateTheme());
    }
  }

  updateTheme() {
    const root = document.documentElement;
    const body = document.body;
    
    let actualTheme = this.theme;
    if (this.theme === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    if (actualTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualTheme === 'dark' ? '#1a1a2e' : '#ec4899');
    }
  }

  toggle() {
    if (this.theme === 'light') {
      this.theme = 'dark';
    } else if (this.theme === 'dark') {
      this.theme = 'auto';
    } else {
      this.theme = 'light';
    }
    
    localStorage.setItem('anniversary-theme', this.theme);
    this.updateTheme();
  }

  setupToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
      
      // Update button icon based on current theme
      this.updateToggleIcon(toggleBtn);
    }
  }

  updateToggleIcon(btn) {
    const icons = {
      light: '☀️',
      dark: '🌙',
      auto: '🌓'
    };
    btn.textContent = icons[this.theme] || '🌓';
  }
}

// Time Calculator
class TimeCalculator {
  constructor() {
    this.startDate = ANNIVERSARY_START_DATE;
    this.updateInterval = null;
  }

  calculateTime(currentDate = new Date()) {
    const now = currentDate;
    const totalMs = now.getTime() - this.startDate.getTime();
    
    if (totalMs < 0) {
      return {
        totalDays: 0,
        totalHours: 0,
        totalMinutes: 0,
        totalSeconds: 0,
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        percentage: 0
      };
    }
    
    const totalSeconds = Math.floor(totalMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    
    const years = now.getFullYear() - this.startDate.getFullYear();
    let months = now.getMonth() - this.startDate.getMonth();
    if (months < 0) months += 12;
    
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    
    // Calculate percentage of current year together
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
    const yearTotal = yearEnd.getTime() - yearStart.getTime();
    const yearTogether = Math.max(0, now.getTime() - Math.max(this.startDate.getTime(), yearStart.getTime()));
    const percentage = Math.min(100, (yearTogether / yearTotal) * 100);
    
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
      percentage: Math.round(percentage * 100) / 100
    };
  }

  startRealTimeUpdates(callback) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Update immediately
    callback(this.calculateTime());
    
    // Update every second
    this.updateInterval = setInterval(() => {
      callback(this.calculateTime());
    }, 1000);
  }

  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Notification System
class NotificationManager {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.init();
  }

  init() {
    // Create notification container
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full';
    document.body.appendChild(this.container);
  }

  show(type, title, message, duration = 5000) {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = this.createNotification(id, type, title, message);
    
    this.container.appendChild(notification);
    this.notifications.push({ id, element: notification });
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 10);
    
    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
    
    return id;
  }

  createNotification(id, type, title, message) {
    const notification = document.createElement('div');
    notification.id = `notification-${id}`;
    notification.className = `
      glassmorphism p-4 rounded-xl shadow-lg transform translate-x-full opacity-0
      transition-all duration-300 ease-out relative overflow-hidden
      ${this.getTypeClasses(type)}
    `;
    
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0 mt-0.5">
          ${this.getTypeIcon(type)}
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-gray-800 mb-1">${title}</h4>
          ${message ? `<p class="text-sm text-gray-600">${message}</p>` : ''}
        </div>
        <button onclick="notificationManager.remove('${id}')" 
                class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
          ✕
        </button>
      </div>
    `;
    
    return notification;
  }

  getTypeClasses(type) {
    const classes = {
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200',
      love: 'bg-pink-50 border-pink-200'
    };
    return classes[type] || classes.info;
  }

  getTypeIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      love: '💕'
    };
    return icons[type] || icons.info;
  }

  remove(id) {
    const notification = document.getElementById(`notification-${id}`);
    if (notification) {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 300);
    }
  }
}

// Music Player
class MusicPlayer {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.volume = 0.5;
    this.init();
  }

  init() {
    // Create audio element
    this.audio = document.createElement('audio');
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = 'auto';
    
    // Add music source
    const source = document.createElement('source');
    source.src = '../../public/assets/music/Arijitsingh.m4a';
    source.type = 'audio/mp4';
    this.audio.appendChild(source);
    
    document.body.appendChild(this.audio);
    
    this.setupControls();
  }

  setupControls() {
    const playBtn = document.getElementById('music-play');
    const volumeSlider = document.getElementById('music-volume');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => this.toggle());
    }
    
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
      volumeSlider.value = this.volume;
    }
  }

  async toggle() {
    try {
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        await this.audio.play();
        this.isPlaying = true;
      }
      this.updatePlayButton();
    } catch (error) {
      console.log('Audio play failed:', error);
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.volume;
  }

  updatePlayButton() {
    const playBtn = document.getElementById('music-play');
    if (playBtn) {
      playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }
  }
}

// Global Error Handling
window.addEventListener('error', (event) => {
    console.error('Global Error:', event.message);
    const errorToast = document.createElement('div');
    errorToast.className = 'notification-toast error show';
    errorToast.innerText = 'An unexpected error occurred. Please try again later.';
    document.body.appendChild(errorToast);
    setTimeout(() => errorToast.remove(), 5000);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    const errorToast = document.createElement('div');
    errorToast.className = 'notification-toast error show';
    errorToast.innerText = 'A network error occurred. Please check your connection.';
    document.body.appendChild(errorToast);
    setTimeout(() => errorToast.remove(), 5000);
});

// Initialize global instances
let themeManager, timeCalculator, notificationManager, musicPlayer;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  themeManager = new ThemeManager();
  timeCalculator = new TimeCalculator();
  notificationManager = new NotificationManager();
  musicPlayer = new MusicPlayer();
  
  console.log('🚀 Anniversary Website v3.0.0 - HTML Mode Initialized');
  console.log('💕 Made with love for Jerry');
});

// Make available globally
if (typeof window !== 'undefined') {
  window.themeManager = themeManager;
  window.timeCalculator = timeCalculator;
  window.notificationManager = notificationManager;
  window.musicPlayer = musicPlayer;
}
