/**
 * Anniversary Website v5.0.0 - Core JavaScript System
 * Magical romantic interactions and functionality 💕
 */

// Core Anniversary Application
class AnniversaryApp {
    constructor() {
        this.initialized = false;
        this.currentPage = 'home';
        this.music = null;
        this.particles = [];
        this.effects = [];
        this.config = {
            anniversaryDate: new Date('2024-06-16T00:00:00'), // Your anniversary date
            particleCount: 50,
            heartEmojis: ['💕', '💖', '💗', '💓', '💘', '💝', '💞', '💟', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🤎', '🖤'],
            romanticMessages: [
                "Every moment with you is magical ✨",
                "You make my heart skip a beat 💓",
                "Together forever, my love 💕",
                "You are my sunshine on cloudy days ☀️",
                "My heart belongs to you always 💖"
            ]
        };
        
        // Bind methods
        this.init = this.init.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.createParticle = this.createParticle.bind(this);
        this.updateCounter = this.updateCounter.bind(this);
    }

    // Initialize the application
    async init() {
        try {
            console.log('💕 Initializing Anniversary v5.0.0...');
            
            await this.setupDOM();
            this.initializeParticleSystem();
            this.initializeAuroraBackground();
            this.setupEventListeners();
            this.startHeartCounter();
            this.initializeNavigation();
            this.initializeMusicPlayer();
            
            this.initialized = true;
            console.log('✨ Anniversary app fully loaded! ✨');
            
            // Show romantic welcome message
            setTimeout(() => {
                this.showNotification(
                    this.config.romanticMessages[Math.floor(Math.random() * this.config.romanticMessages.length)],
                    'love'
                );
            }, 2000);
            
        } catch (error) {
            console.error('💔 Error initializing app:', error);
        }
    }

    // Setup DOM and initial elements
    async setupDOM() {
        // Add floating hearts container
        if (!document.getElementById('floating-hearts')) {
            const heartsContainer = document.createElement('div');
            heartsContainer.id = 'floating-hearts';
            heartsContainer.className = 'floating-hearts-container';
            document.body.appendChild(heartsContainer);
        }

        // Add notification container
        if (!document.getElementById('notifications')) {
            const notificationContainer = document.createElement('div');
            notificationContainer.id = 'notifications';
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Initialize particle system
    initializeParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) {
            console.warn('Particle canvas not found');
            return;
        }

        // Create floating particles
        setInterval(() => {
            this.createFloatingParticle();
        }, 2000);

        // Create magical sparkles on mouse move
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.1) { // 10% chance
                this.createSparkle(e.clientX, e.clientY);
            }
        });
    }

    // Create floating particle
    createFloatingParticle() {
        const container = document.getElementById('floating-hearts') || document.body;
        const particle = document.createElement('div');
        
        particle.className = 'floating-particle';
        particle.innerHTML = this.config.heartEmojis[Math.floor(Math.random() * this.config.heartEmojis.length)];
        
        // Random positioning and properties
        particle.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            bottom: -50px;
            font-size: ${Math.random() * 20 + 15}px;
            opacity: ${Math.random() * 0.8 + 0.2};
            pointer-events: none;
            z-index: 10;
            color: hsl(${Math.random() * 60 + 300}, 70%, 70%);
            animation: float-up ${Math.random() * 4 + 6}s linear forwards;
            text-shadow: 0 0 10px currentColor;
        `;
        
        container.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 10000);
    }

    // Create mouse sparkle effect
    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'mouse-sparkle';
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #fff, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: sparkle-fade 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }

    // Initialize aurora background
    initializeAuroraBackground() {
        const auroraLayers = document.querySelectorAll('.aurora-layer');
        auroraLayers.forEach((layer, index) => {
            layer.style.animationDelay = `${index * 2}s`;
            layer.style.animationDuration = `${15 + index * 5}s`;
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.handleResize);
        
        // Navigation cards
        document.querySelectorAll('.nav-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });

            // Add hover effects
            card.addEventListener('mouseenter', (e) => {
                this.addCardHoverEffect(e.currentTarget);
            });

            card.addEventListener('mouseleave', (e) => {
                this.removeCardHoverEffect(e.currentTarget);
            });
        });

        // Music player controls
        const playBtn = document.getElementById('music-play');
        const volumeSlider = document.getElementById('volume-slider');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggleMusic());
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
    }

    // Handle window resize
    handleResize() {
        // Update particle canvas size if needed
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            // Particle canvas sizing handled by CSS
        }
    }

    // Add hover effect to navigation cards
    addCardHoverEffect(card) {
        const glow = card.querySelector('.nav-card-glow');
        if (glow) {
            glow.style.opacity = '0.4';
        }
        
        // Add floating animation
        card.style.transform = 'translateY(-10px) scale(1.05)';
        card.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.3)';
        
        // Create mini sparkles around card
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const rect = card.getBoundingClientRect();
                this.createSparkle(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 100);
        }
    }

    // Remove hover effect from navigation cards
    removeCardHoverEffect(card) {
        const glow = card.querySelector('.nav-card-glow');
        if (glow) {
            glow.style.opacity = '0';
        }
        
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    // Start the anniversary counter
    startHeartCounter() {
        this.updateCounter();
        setInterval(this.updateCounter, 1000);
    }

    // Update anniversary counter
    updateCounter() {
        const now = new Date();
        const diff = now - this.config.anniversaryDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update counter displays
        const daysEl = document.getElementById('days-count');
        const hoursEl = document.getElementById('hours-count');
        const minutesEl = document.getElementById('minutes-count');
        const secondsEl = document.getElementById('seconds-count');
        
        if (daysEl) daysEl.textContent = days.toLocaleString();
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
    }

    // Initialize navigation system
    initializeNavigation() {
        // Navigation is handled by individual page transitions
        console.log('🗺️ Navigation system ready');
    }

    // Initialize music player
    initializeMusicPlayer() {
        // Create audio context for romantic background music
        this.music = {
            isPlaying: false,
            volume: 0.3,
            currentTrack: null
        };
        
        // Initialize visualizer
        this.initializeMusicVisualizer();
    }

    // Initialize music visualizer
    initializeMusicVisualizer() {
        const visualizerBars = document.querySelectorAll('.visualizer-bar');
        
        // Animate visualizer bars
        setInterval(() => {
            visualizerBars.forEach(bar => {
                const height = Math.random() * 30 + 5;
                bar.style.height = `${height}px`;
                bar.style.background = `hsl(${Math.random() * 60 + 300}, 70%, 70%)`;
            });
        }, 200);
    }

    // Toggle music playback
    toggleMusic() {
        const playBtn = document.getElementById('music-play');
        if (!playBtn) return;
        
        this.music.isPlaying = !this.music.isPlaying;
        
        if (this.music.isPlaying) {
            playBtn.innerHTML = '<i data-lucide="pause"></i>';
            this.showNotification('🎵 Music started - Our love song is playing', 'info');
        } else {
            playBtn.innerHTML = '<i data-lucide="play"></i>';
            this.showNotification('⏸️ Music paused', 'info');
        }
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Set music volume
    setVolume(volume) {
        this.music.volume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 Volume set to ${Math.round(this.music.volume * 100)}%`);
    }

    // Navigate to a specific page
    navigateToPage(pageName) {
        console.log(`💫 Navigating to: ${pageName}`);
        
        // Add loading effect
        this.showNotification(`Opening ${pageName}... ✨`, 'info');
        
        // In a real implementation, this would handle page transitions
        // For now, we'll just show a message
        setTimeout(() => {
            this.showNotification(`Welcome to ${pageName}! 💕`, 'love');
        }, 1000);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Get random romantic message
    getRandomMessage() {
        return this.config.romanticMessages[Math.floor(Math.random() * this.config.romanticMessages.length)];
    }
}

// Initialize the application
window.AnniversaryApp = new AnniversaryApp();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.AnniversaryApp.init();
    });
} else {
    window.AnniversaryApp.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnniversaryApp;
}
