/**
 * Unified Background Components System
 *
 * This module provides consistent background components across all pages:
 * - Particles.js background
 * - Floating hearts container
 * - Enhanced music player
 * - CSS floating hearts pattern
 *
 * Usage: BackgroundComponents.init(config)
 */

class BackgroundComponents {
    constructor() {
        this.particlesConfig = null;
        this.heartsConfig = null;
        this.musicConfig = null;
        this.isInitialized = false;
    }

    /**
     * Initialize all background components with optional configuration
     * @param {Object} config - Configuration options for components
     */
    init(config = {}) {
        if (this.isInitialized) return;

        this.particlesConfig = {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            ...config.particles
        };

        this.heartsConfig = {
            enableFloatingHearts: true,
            enableBurstHearts: true,
            ...config.hearts
        };

        this.musicConfig = {
            enableMusicPlayer: true,
            autoplay: false,
            ...config.music
        };

        this.createBackgroundStructure();
        this.initializeParticles();
        this.initializeHearts();
        this.initializeMusicPlayer();

        this.isInitialized = true;
        console.log('🎨 Background Components initialized successfully');
    }

    /**
     * Create the basic HTML structure for background components
     */
    createBackgroundStructure() {
        // Create particles container if it doesn't exist
        if (!document.getElementById('particles-js')) {
            const particlesContainer = document.createElement('div');
            particlesContainer.id = 'particles-js';
            particlesContainer.className = 'fixed inset-0 z-0';
            document.body.prepend(particlesContainer);
        }

        // Create floating hearts container for burst effects
        if (!document.getElementById('floating-hearts-container')) {
            const heartsContainer = document.createElement('div');
            heartsContainer.id = 'floating-hearts-container';
            heartsContainer.className = 'fixed inset-0 pointer-events-none z-50';
            document.body.appendChild(heartsContainer);
        }

        // Create CSS floating hearts pattern
        if (!document.querySelector('.floating-hearts')) {
            const cssHeartsContainer = document.createElement('div');
            cssHeartsContainer.className = 'floating-hearts';
            cssHeartsContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            `;

            // Add floating heart elements
            for (let i = 0; i < 5; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.style.cssText = `
                    left: ${10 + i * 20}%;
                    animation-delay: ${i}s;
                    animation-duration: ${6 + i % 2}s;
                `;
                cssHeartsContainer.appendChild(heart);
            }

            document.body.appendChild(cssHeartsContainer);
        }

        // Create enhanced music player
        if (!document.querySelector('.enhanced-music-player') && this.musicConfig.enableMusicPlayer) {
            const musicPlayer = document.createElement('div');
            musicPlayer.className = 'enhanced-music-player';
            musicPlayer.innerHTML = `
                <button id="music-toggle" class="music-control-btn" aria-label="Toggle Background Music">
                    <span id="music-icon">🎵</span>
                    <div class="music-visualizer" id="music-visualizer" style="display: none;">
                        <div class="music-bar"></div>
                        <div class="music-bar"></div>
                        <div class="music-bar"></div>
                        <div class="music-bar"></div>
                    </div>
                </button>
            `;
            document.body.appendChild(musicPlayer);
        }
    }

    /**
     * Initialize particles.js with optimized settings
     */
    initializeParticles() {
        if (typeof particlesJS === 'undefined') {
            console.warn('🔺 Particles.js not loaded, skipping particle initialization');
            return;
        }

        const config = {
            particles: {
                number: {
                    value: this.particlesConfig.isMobile ? 10 : 18,
                    density: {
                        enable: true,
                        value_area: 1200
                    }
                },
                color: {
                    value: ["#ff6b9d", "#ffa8cc", "#ffb3d6"]
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ff6b9d",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: this.particlesConfig.isMobile ? 0.5 : 1,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: !this.particlesConfig.isMobile,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        };

        particlesJS('particles-js', config);
    }

    /**
     * Initialize heart animation system
     */
    initializeHearts() {
        if (!this.heartsConfig.enableFloatingHearts) return;

        // Add heart burst event listeners
        if (this.heartsConfig.enableBurstHearts) {
            this.addHeartBurstEvents();
        }
    }

    /**
     * Add heart burst effects to click and touch events
     */
    addHeartBurstEvents() {
        // Click event listener for heart burst
        document.addEventListener('click', (e) => {
            // Don't create burst if clicking on buttons or interactive elements
            if (e.target.tagName === 'BUTTON' ||
                e.target.closest('button') ||
                e.target.closest('.enhanced-music-player') ||
                e.target.closest('a') ||
                e.target.closest('.control-panel') ||
                e.target.closest('.home-nav')) {
                return;
            }
            this.createHeartBurst(e.clientX, e.clientY);
        });

        // Touch event listener for mobile
        document.addEventListener('touchend', (e) => {
            if (e.target.tagName === 'BUTTON' ||
                e.target.closest('button') ||
                e.target.closest('.enhanced-music-player') ||
                e.target.closest('a') ||
                e.target.closest('.control-panel') ||
                e.target.closest('.home-nav')) {
                return;
            }
            if (e.changedTouches && e.changedTouches[0]) {
                this.createHeartBurst(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        });
    }

    /**
     * Create heart burst effect at given coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} intensity - Burst intensity (number of hearts)
     */
    createHeartBurst(x, y, intensity = 10) {
        const heartsContainer = document.getElementById('floating-hearts-container');
        if (!heartsContainer) return;

        const burstHeartEmojis = ['💕', '💖', '💝', '💗', '💘', '❤️', '💞', '💓', '❣️', '🧡', '💛', '💚', '💙', '💜', '🤍'];
        const burstCount = Math.random() * intensity + intensity;

        for (let i = 0; i < burstCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'burst-heart';
            heart.textContent = burstHeartEmojis[Math.floor(Math.random() * burstHeartEmojis.length)];

            // Heart burst properties
            const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.7;
            const velocity = Math.random() * 30 + 15;
            const size = Math.random() * 24 + 14;
            const duration = Math.random() * 2 + 1.5;
            const rotation = Math.random() * 720 + 360;
            const gravity = Math.random() * 300 + 200;

            const endX = x + Math.cos(angle) * velocity;
            const endY = y + Math.sin(angle) * velocity - 80;
            const finalY = y + gravity;

            heart.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: ${size}px;
                pointer-events: none;
                z-index: 150;
                animation: burstAnimation ${duration}s ease-out forwards;
                --endX: ${endX}px;
                --endY: ${endY}px;
                --finalY: ${finalY}px;
                --rotation: ${rotation}deg;
                filter: drop-shadow(0 0 15px rgba(255, 107, 157, 1)) hue-rotate(${Math.random() * 60 - 30}deg);
            `;

            heartsContainer.appendChild(heart);

            // Remove heart after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, duration * 1000 + 200);
        }

        // Add burst animation styles if not already present
        this.addBurstStyles();
    }

    /**
     * Add CSS styles for heart burst animation
     */
    addBurstStyles() {
        if (document.querySelector('#burst-animation-styles')) return;

        const burstStyle = document.createElement('style');
        burstStyle.id = 'burst-animation-styles';
        burstStyle.textContent = `
            @keyframes burstAnimation {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(0.5);
                    opacity: 1;
                }
                40% {
                    transform: translate(calc(var(--endX) - 50vw), calc(var(--endY) - 50vh)) rotate(calc(var(--rotation) * 0.4)) scale(1.3);
                    opacity: 1;
                }
                80% {
                    opacity: 0.7;
                }
                100% {
                    transform: translate(calc(var(--endX) - 50vw), calc(var(--finalY) - 50vh)) rotate(var(--rotation)) scale(0.1);
                    opacity: 0;
                }
            }

            .burst-heart {
                user-select: none;
                will-change: transform, opacity;
            }
        `;
        document.head.appendChild(burstStyle);
    }

    /**
     * Initialize music player integration
     */
    initializeMusicPlayer() {
        if (!this.musicConfig.enableMusicPlayer) return;

        // Initialize music manager integration
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof window.musicManager !== 'undefined') {
                // Music manager is available, integrate with controls
                const musicToggle = document.getElementById('music-toggle');
                if (musicToggle) {
                    musicToggle.addEventListener('click', () => {
                        window.musicManager.toggle();
                    });
                }
            }
        });
    }

    /**
     * Page-specific configuration presets
     */
    static getPageConfig(pageName) {
        const configs = {
            index: {
                particles: { isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) },
                hearts: { enableFloatingHearts: true, enableBurstHearts: true },
                music: { enableMusicPlayer: true, autoplay: false }
            },
            anniversary: {
                particles: { isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) },
                hearts: { enableFloatingHearts: true, enableBurstHearts: true },
                music: { enableMusicPlayer: true, autoplay: false }
            },
            countdown: {
                particles: { isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) },
                hearts: { enableFloatingHearts: true, enableBurstHearts: true },
                music: { enableMusicPlayer: true, autoplay: false }
            },
            'love-story': {
                particles: { isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) },
                hearts: { enableFloatingHearts: true, enableBurstHearts: true },
                music: { enableMusicPlayer: true, autoplay: false }
            },
            'photo-gallery': {
                particles: { enabled: false }, // Disable particles for photo gallery as it has its own background
                hearts: { enableFloatingHearts: false, enableBurstHearts: false }, // Has its own heart system
                music: { enableMusicPlayer: true, autoplay: false }
            }
        };

        return configs[pageName] || configs.index;
    }

    /**
     * Cleanup method for page transitions
     */
    cleanup() {
        // Clear any running intervals
        if (this.heartInterval) {
            clearInterval(this.heartInterval);
        }

        // Remove event listeners to prevent memory leaks
        // (In a production app, you'd want to store references to remove specific listeners)

        this.isInitialized = false;
    }
}

// Create a global instance
window.BackgroundComponents = new BackgroundComponents();

// Auto-initialize based on page type if data attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.getAttribute('data-page-type');
    if (pageType) {
        const config = BackgroundComponents.getPageConfig(pageType);
        window.BackgroundComponents.init(config);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundComponents;
}

// ES6 export
export { BackgroundComponents };
