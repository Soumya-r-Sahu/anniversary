/**
 * Master Romantic Wrappers
 * Unified interface for all romantic enhancements
 */

class RomanticMaster {
    constructor() {
        this.wrappers = {
            tailwind: null,
            aos: null,
            particles: null,
            typed: null
        };
        
        this.isInitialized = false;
        this.initCallbacks = [];
        
        this.init();
    }

    /**
     * Initialize all wrappers
     */
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initWrappers());
            } else {
                this.initWrappers();
            }
        } catch (error) {
            console.error('💔 Error initializing Romantic Master:', error);
        }
    }

    /**
     * Initialize individual wrappers
     */
    initWrappers() {
        // Initialize TailwindWrapper
        if (window.RomanticTailwind) {
            this.wrappers.tailwind = window.RomanticTailwind;
            console.log('✅ TailwindWrapper initialized');
        }

        // Initialize AOSWrapper
        if (window.RomanticAOS) {
            this.wrappers.aos = window.RomanticAOS;
            console.log('✅ AOSWrapper initialized');
        }

        // Initialize ParticlesWrapper
        if (window.RomanticParticles) {
            this.wrappers.particles = window.RomanticParticles;
            console.log('✅ ParticlesWrapper initialized');
        }

        // Initialize TypedWrapper
        if (window.RomanticTyped) {
            this.wrappers.typed = window.RomanticTyped;
            console.log('✅ TypedWrapper initialized');
        }

        this.isInitialized = true;
        
        // Execute any pending callbacks
        this.initCallbacks.forEach(callback => {
            try {
                callback(this);
            } catch (error) {
                console.error('💔 Error in init callback:', error);
            }
        });
        
        console.log('💖 Romantic Master fully initialized');
    }

    /**
     * Execute callback when all wrappers are ready
     */
    ready(callback) {
        if (this.isInitialized) {
            callback(this);
        } else {
            this.initCallbacks.push(callback);
        }
    }

    /**
     * Get specific wrapper
     */
    getWrapper(name) {
        return this.wrappers[name];
    }

    /**
     * Create a complete romantic page setup
     */
    createRomanticPage(config = {}) {
        this.ready((master) => {
            const {
                particles = { type: 'hearts', element: 'particles-bg' },
                animations = { preset: 'gentle' },
                typing = null,
                styling = { theme: 'romantic' }
            } = config;

            // Setup particles background
            if (particles && master.wrappers.particles) {
                if (document.getElementById(particles.element)) {
                    master.wrappers.particles.create(particles.element, particles.type);
                }
            }

            // Setup AOS animations
            if (animations && master.wrappers.aos) {
                if (animations.preset) {
                    master.wrappers.aos.usePreset(animations.preset);
                }
                
                // Apply common animations
                master.wrappers.aos.staggerAnimation('.card', 'romantic-slide-up', 150);
                master.wrappers.aos.staggerAnimation('.memory-item', 'love-letter-unfold', 200);
                master.wrappers.aos.applyAnimation('.hero-title', 'romantic-zoom', { duration: 1500 });
            }

            // Setup typing effects
            if (typing && master.wrappers.typed) {
                Object.entries(typing).forEach(([selector, typeConfig]) => {
                    if (document.querySelector(selector)) {
                        master.wrappers.typed.create(selector, typeConfig.strings, typeConfig.options);
                    }
                });
            }

            // Apply styling theme
            if (styling && master.wrappers.tailwind) {
                master.wrappers.tailwind.applyTheme(styling.theme);
            }

            console.log('🌹 Romantic page setup complete');
        });
    }

    /**
     * Create love letter page
     */
    createLoveLetterPage(elementId, content) {
        this.ready((master) => {
            // Particles background
            if (master.wrappers.particles) {
                master.wrappers.particles.createHearts('particles-bg', { count: 30 });
            }

            // Typing effect for letter content
            if (master.wrappers.typed) {
                master.wrappers.typed.createLoveLetter(elementId, content);
            }

            // Animations for letter elements
            if (master.wrappers.aos) {
                master.wrappers.aos.applyAnimation('.letter-container', 'love-letter-unfold', { duration: 2000 });
                master.wrappers.aos.staggerAnimation('.letter-line', 'romantic-slide-left', 100);
            }
        });
    }

    /**
     * Create memory timeline page
     */
    createMemoryTimeline(timelineSelector) {
        this.ready((master) => {
            // Constellation background
            if (master.wrappers.particles) {
                master.wrappers.particles.createConstellation('particles-bg');
            }

            // Timeline animations
            if (master.wrappers.aos) {
                master.wrappers.aos.createRomanticTimeline(timelineSelector);
                master.wrappers.aos.staggerAnimation('.timeline-date', 'romantic-glow', 200);
            }

            // Apply timeline styling
            if (master.wrappers.tailwind) {
                const elements = document.querySelectorAll(timelineSelector);
                elements.forEach(el => {
                    master.wrappers.tailwind.addClass(el, 'card-love');
                });
            }
        });
    }

    /**
     * Create countdown page
     */
    createCountdownPage(countdownSelector, targetDate) {
        this.ready((master) => {
            // Bubbles background
            if (master.wrappers.particles) {
                master.wrappers.particles.createBubbles('particles-bg');
            }

            // Countdown typing
            if (master.wrappers.typed) {
                master.wrappers.typed.createCountdown(countdownSelector, targetDate);
            }

            // Countdown animations
            if (master.wrappers.aos) {
                master.wrappers.aos.applyAnimation('.countdown-container', 'heart-bounce');
                master.wrappers.aos.staggerAnimation('.time-unit', 'romantic-zoom', 100);
            }
        });
    }

    /**
     * Create music playlist page
     */
    createMusicPage() {
        this.ready((master) => {
            // Snow particles for dreamy effect
            if (master.wrappers.particles) {
                master.wrappers.particles.create('particles-bg', 'snow');
            }

            // Music-related animations
            if (master.wrappers.aos) {
                master.wrappers.aos.staggerAnimation('.song-item', 'heart-float', 150);
                master.wrappers.aos.applyAnimation('.playlist-header', 'romantic-glow');
            }

            // Apply music theme styling
            if (master.wrappers.tailwind) {
                master.wrappers.tailwind.applyTheme('music');
            }
        });
    }

    /**
     * Create photo gallery page
     */
    createGalleryPage() {
        this.ready((master) => {
            // Gentle particles
            if (master.wrappers.particles) {
                master.wrappers.particles.create('particles-bg', 'romantic');
            }

            // Gallery animations
            if (master.wrappers.aos) {
                master.wrappers.aos.staggerAnimation('.photo-item', 'romantic-zoom', 100);
                master.wrappers.aos.createHeartCascade('.photo-grid .photo');
            }
        });
    }

    /**
     * Apply performance optimizations across all wrappers
     */
    optimizePerformance() {
        this.ready((master) => {
            // Reduce particles on mobile
            if (window.innerWidth < 768) {
                Object.values(master.wrappers.particles?.instances || {}).forEach(instance => {
                    if (instance.config?.particles?.number?.value) {
                        instance.config.particles.number.value = Math.floor(instance.config.particles.number.value * 0.5);
                    }
                });
            }

            // Optimize AOS for performance
            if (master.wrappers.aos) {
                master.wrappers.aos.romanticConfig.throttleDelay = 99;
                master.wrappers.aos.romanticConfig.debounceDelay = 50;
            }

            // Pause typing on visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && master.wrappers.typed) {
                    master.wrappers.typed.instances.forEach((instance, id) => {
                        master.wrappers.typed.pause(id);
                    });
                } else if (!document.hidden && master.wrappers.typed) {
                    master.wrappers.typed.instances.forEach((instance, id) => {
                        master.wrappers.typed.resume(id);
                    });
                }
            });

            console.log('⚡ Performance optimizations applied');
        });
    }

    /**
     * Cleanup all wrappers
     */
    cleanup() {
        Object.values(this.wrappers).forEach(wrapper => {
            if (wrapper && typeof wrapper.destroy === 'function') {
                wrapper.destroy();
            } else if (wrapper && typeof wrapper.destroyAll === 'function') {
                wrapper.destroyAll();
            }
        });
        
        console.log('🧹 Romantic wrappers cleaned up');
    }

    /**
     * Get initialization status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            wrappers: Object.keys(this.wrappers).reduce((status, key) => {
                status[key] = !!this.wrappers[key];
                return status;
            }, {}),
            pendingCallbacks: this.initCallbacks.length
        };
    }
}

// Create global master instance
window.RomanticMaster = new RomanticMaster();

// Convenience method for quick setup
window.initRomanticPage = function(config) {
    window.RomanticMaster.createRomanticPage(config);
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RomanticMaster;
}

// Auto-optimize performance
window.addEventListener('load', () => {
    window.RomanticMaster.optimizePerformance();
});
