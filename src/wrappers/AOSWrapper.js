/**
 * AOS (Animate On Scroll) Wrapper with Romantic Enhancements
 * Enhanced with custom romantic animations for our anniversary website
 */

class AOSWrapper {
    constructor() {
        this.isInitialized = false;
        this.customAnimations = {};
        this.romanticConfig = {
            duration: 1200,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom',
            offset: 100
        };
        
        this.init();
    }

    /**
     * Initialize AOS with romantic configurations
     */
    init() {
        if (this.isInitialized || typeof AOS === 'undefined') {
            return;
        }

        // Add custom romantic CSS animations
        this.addCustomAnimations();

        // Initialize AOS with our romantic config
        AOS.init({
            ...this.romanticConfig,
            disable: false,
            startEvent: 'DOMContentLoaded',
            initClassName: 'aos-init',
            animatedClassName: 'aos-animate',
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99,
        });

        this.isInitialized = true;
        console.log('🌹 AOS Romantic Wrapper initialized with custom animations');
    }

    /**
     * Add custom romantic animations to the page
     */
    addCustomAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            /* Romantic Custom AOS Animations */
            
            /* Heart Float Animation */
            [data-aos="heart-float"] {
                opacity: 0;
                transform: translateY(50px) scale(0.8);
                transition-property: transform, opacity;
            }
            [data-aos="heart-float"].aos-animate {
                opacity: 1;
                transform: translateY(0) scale(1);
                animation: heartFloat 3s ease-in-out infinite;
            }
            
            @keyframes heartFloat {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-10px) scale(1.05); }
            }

            /* Love Pulse Animation */
            [data-aos="love-pulse"] {
                opacity: 0;
                transform: scale(0.5);
                transition-property: transform, opacity;
            }
            [data-aos="love-pulse"].aos-animate {
                opacity: 1;
                transform: scale(1);
                animation: lovePulse 2s ease-in-out infinite;
            }
            
            @keyframes lovePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            /* Romantic Slide In */
            [data-aos="romantic-slide-up"] {
                opacity: 0;
                transform: translateY(100px) rotateX(20deg);
                transition-property: transform, opacity;
            }
            [data-aos="romantic-slide-up"].aos-animate {
                opacity: 1;
                transform: translateY(0) rotateX(0);
            }

            [data-aos="romantic-slide-left"] {
                opacity: 0;
                transform: translateX(-100px) rotateY(20deg);
                transition-property: transform, opacity;
            }
            [data-aos="romantic-slide-left"].aos-animate {
                opacity: 1;
                transform: translateX(0) rotateY(0);
            }

            [data-aos="romantic-slide-right"] {
                opacity: 0;
                transform: translateX(100px) rotateY(-20deg);
                transition-property: transform, opacity;
            }
            [data-aos="romantic-slide-right"].aos-animate {
                opacity: 1;
                transform: translateX(0) rotateY(0);
            }

            /* Romantic Zoom */
            [data-aos="romantic-zoom"] {
                opacity: 0;
                transform: scale(0.3) rotate(-10deg);
                transition-property: transform, opacity;
            }
            [data-aos="romantic-zoom"].aos-animate {
                opacity: 1;
                transform: scale(1) rotate(0);
            }

            /* Love Letter Unfold */
            [data-aos="love-letter-unfold"] {
                opacity: 0;
                transform: perspective(1000px) rotateX(-90deg);
                transform-origin: top center;
                transition-property: transform, opacity;
            }
            [data-aos="love-letter-unfold"].aos-animate {
                opacity: 1;
                transform: perspective(1000px) rotateX(0);
            }

            /* Heart Bounce */
            [data-aos="heart-bounce"] {
                opacity: 0;
                transform: translateY(-100px) rotate(-180deg);
                transition-property: transform, opacity;
            }
            [data-aos="heart-bounce"].aos-animate {
                opacity: 1;
                transform: translateY(0) rotate(0);
                animation: heartBounce 1s ease-out;
            }
            
            @keyframes heartBounce {
                0% { transform: translateY(-100px) rotate(-180deg); }
                60% { transform: translateY(-15px) rotate(10deg); }
                80% { transform: translateY(-5px) rotate(-5deg); }
                100% { transform: translateY(0) rotate(0); }
            }

            /* Romantic Glow */
            [data-aos="romantic-glow"] {
                opacity: 0;
                transform: scale(0.8);
                transition-property: transform, opacity, box-shadow;
            }
            [data-aos="romantic-glow"].aos-animate {
                opacity: 1;
                transform: scale(1);
                box-shadow: 0 0 30px rgba(236, 72, 153, 0.3);
                animation: romanticGlow 3s ease-in-out infinite;
            }
            
            @keyframes romanticGlow {
                0%, 100% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.3); }
                50% { box-shadow: 0 0 50px rgba(255, 23, 68, 0.5); }
            }

            /* Performance optimizations */
            [data-aos] {
                will-change: transform, opacity;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Apply romantic animation to element
     */
    applyAnimation(element, animationType, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        const config = {
            ...this.romanticConfig,
            ...options
        };

        element.setAttribute('data-aos', animationType);
        
        // Apply additional attributes
        Object.keys(config).forEach(key => {
            if (key !== 'duration' && key !== 'delay' && key !== 'easing') return;
            element.setAttribute(`data-aos-${key}`, config[key]);
        });

        // Refresh AOS to apply new elements
        if (this.isInitialized && typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    /**
     * Create animated love letter effect
     */
    createLoveLetterAnimation(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            this.applyAnimation(element, 'love-letter-unfold', {
                delay: index * 200,
                duration: 1000
            });
        });
    }

    /**
     * Create heart cascade effect
     */
    createHeartCascade(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            this.applyAnimation(element, 'heart-bounce', {
                delay: index * 150,
                duration: 800
            });
        });
    }

    /**
     * Create romantic timeline animation
     */
    createRomanticTimeline(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            const isEven = index % 2 === 0;
            this.applyAnimation(element, isEven ? 'romantic-slide-left' : 'romantic-slide-right', {
                delay: index * 100,
                duration: 1000
            });
        });
    }

    /**
     * Apply staggered romantic animations
     */
    staggerAnimation(selector, animationType, staggerDelay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            this.applyAnimation(element, animationType, {
                delay: index * staggerDelay
            });
        });
    }

    /**
     * Refresh AOS (useful after dynamic content changes)
     */
    refresh() {
        if (this.isInitialized && typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    /**
     * Get romantic animation presets
     */
    getPresets() {
        return {
            gentle: {
                duration: 1500,
                easing: 'ease-out',
                once: true
            },
            passionate: {
                duration: 800,
                easing: 'ease-out-back',
                once: false
            },
            dreamy: {
                duration: 2000,
                easing: 'ease-in-out',
                once: true,
                mirror: true
            },
            playful: {
                duration: 600,
                easing: 'ease-out-bounce',
                once: false
            }
        };
    }

    /**
     * Apply preset configuration
     */
    usePreset(presetName) {
        const presets = this.getPresets();
        if (presets[presetName]) {
            this.romanticConfig = { ...this.romanticConfig, ...presets[presetName] };
            if (this.isInitialized && typeof AOS !== 'undefined') {
                AOS.init(this.romanticConfig);
            }
        }
    }

    /**
     * Destroy AOS instance
     */
    destroy() {
        if (this.isInitialized && typeof AOS !== 'undefined') {
            AOS.refreshHard();
        }
        this.isInitialized = false;
    }
}

// Create global instance
window.RomanticAOS = new AOSWrapper();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AOSWrapper;
}
