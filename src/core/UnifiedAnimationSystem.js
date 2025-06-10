/**
 * Anniversary Website v4.0.0 - Unified Animation System
 * Professional animation and particle system consolidation
 * Replaces multiple duplicate animation managers and effects
 */

import performanceUtils from '../utils/UnifiedPerformanceUtils.js';

class UnifiedAnimationSystem {
    constructor(options = {}) {
        this.version = '4.0.0';
        this.config = {
            enableAnimations: true,
            enableParticles: true,
            particleCount: 50,
            animationSpeed: 1,
            performance: 'auto', // 'high', 'medium', 'low', 'auto'
            ...options
        };

        // Animation state
        this.isInitialized = false;
        this.activeAnimations = new Map();
        this.particleSystems = new Map();
        this.animationControllers = new Map();
        
        // Performance monitoring
        this.performanceLevel = this.detectPerformanceLevel();
        this.frameCount = 0;
        this.lastFPSCheck = 0;
        this.currentFPS = 60;

        // Initialize animation system
        this.init();

        console.log('✨ Unified Animation System v4.0.0 initialized');
    }

    /**
     * Initialize animation system
     */
    init() {
        if (this.isInitialized) return;

        this.setupGlobalStyles();
        this.initializeHeartAnimations();
        this.initializeParticleSystem();
        this.setupPerformanceMonitoring();
        
        this.isInitialized = true;
    }

    /**
     * Detect device performance level
     */
    detectPerformanceLevel() {
        if (this.config.performance !== 'auto') {
            return this.config.performance;
        }

        // Basic performance detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'low';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Simple heuristics for performance level
        if (renderer.includes('Intel') || navigator.hardwareConcurrency < 4) {
            return 'medium';
        }
        
        return 'high';
    }

    /**
     * Setup global animation styles
     */
    setupGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Unified Animation System CSS */
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            @keyframes glow {
                0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
                50% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.6); }
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

            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .love-animation {
                animation: heartbeat 2s ease-in-out infinite;
            }

            .float-animation {
                animation: float 3s ease-in-out infinite;
            }

            .glow-animation {
                animation: glow 2s ease-in-out infinite;
            }

            .fade-in-up {
                animation: fadeInUp 0.8s ease-out forwards;
            }

            .slide-in-left {
                animation: slideInLeft 0.6s ease-out forwards;
            }

            .particle-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }

            .heart-particle {
                position: absolute;
                font-size: 20px;
                color: #ec4899;
                pointer-events: none;
                user-select: none;
            }

            .reduced-motion {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Initialize heart animations for romantic elements
     */
    initializeHeartAnimations() {
        if (!this.config.enableAnimations) return;

        // Add heart animation to elements with love-related classes
        const heartElements = document.querySelectorAll('.love-button, .heart-icon, .romantic-element');
        
        heartElements.forEach(element => {
            element.classList.add('love-animation');
            
            // Add interactive hover effects
            const addHoverGlow = () => element.classList.add('glow-animation');
            const removeHoverGlow = () => element.classList.remove('glow-animation');
            
            element.addEventListener('mouseenter', addHoverGlow);
            element.addEventListener('mouseleave', removeHoverGlow);
        });
    }

    /**
     * Initialize particle system for romantic effects
     */
    initializeParticleSystem() {
        if (!this.config.enableParticles || this.performanceLevel === 'low') return;

        const particleCount = this.getOptimalParticleCount();
        
        // Create particle container
        const container = document.createElement('div');
        container.className = 'particle-container';
        container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(container);

        // Create heart particles
        for (let i = 0; i < particleCount; i++) {
            this.createHeartParticle(container);
        }

        // Store particle system
        this.particleSystems.set('hearts', {
            container,
            particleCount,
            type: 'hearts'
        });
    }

    /**
     * Get optimal particle count based on performance
     */
    getOptimalParticleCount() {
        const baseCount = this.config.particleCount;
        
        switch (this.performanceLevel) {
            case 'high': return baseCount;
            case 'medium': return Math.floor(baseCount * 0.6);
            case 'low': return Math.floor(baseCount * 0.3);
            default: return baseCount;
        }
    }

    /**
     * Create animated heart particle
     */
    createHeartParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.textContent = Math.random() > 0.5 ? '💖' : '💕';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        
        container.appendChild(particle);
        
        // Animate particle
        this.animateParticle(particle);
    }

    /**
     * Animate individual particle
     */
    animateParticle(particle) {
        const duration = 5000 + Math.random() * 3000; // 5-8 seconds
        const horizontalDrift = (Math.random() - 0.5) * 200; // -100px to 100px
        
        const animation = particle.animate([
            {
                transform: 'translateY(0px) translateX(0px) scale(0)',
                opacity: 0
            },
            {
                transform: `translateY(-20px) translateX(${horizontalDrift * 0.2}px) scale(1)`,
                opacity: 1,
                offset: 0.1
            },
            {
                transform: `translateY(-${window.innerHeight + 100}px) translateX(${horizontalDrift}px) scale(0.8)`,
                opacity: 0
            }
        ], {
            duration,
            easing: 'ease-out',
            fill: 'forwards'
        });

        // Restart particle when animation completes
        animation.addEventListener('finish', () => {
            particle.style.left = Math.random() * 100 + '%';
            this.animateParticle(particle);
        });

        return animation;
    }

    /**
     * Create romantic entrance animation for elements
     */
    animateEntranceElements() {
        const elements = document.querySelectorAll('[data-animate="entrance"]');
        
        elements.forEach((element, index) => {
            // Stagger animations
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 100);
        });
    }

    /**
     * Create scroll-triggered animations
     */
    setupScrollAnimations() {
        if (this.performanceLevel === 'low') return;

        const observer = performanceUtils.createIntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.scrollAnimation || 'fade-in-up';
                    element.classList.add(animationType);
                }
            });
        });

        // Observe elements with scroll animations
        const scrollElements = document.querySelectorAll('[data-scroll-animation]');
        scrollElements.forEach(element => observer.observe(element));

        return observer;
    }

    /**
     * Create smooth page transition
     */
    createPageTransition(type = 'fade') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #ec4899, #8b5cf6);
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s ease-in-out;
            `;

            document.body.appendChild(overlay);

            // Trigger fade in
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
            });

            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, 500);
            }, 300);
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        const monitorController = performanceUtils.createAnimationController();
        
        monitorController.start(() => {
            this.frameCount++;
            const now = performance.now();
            
            if (now - this.lastFPSCheck >= 1000) {
                this.currentFPS = this.frameCount;
                this.frameCount = 0;
                this.lastFPSCheck = now;
                
                // Adjust performance if FPS drops
                this.adjustPerformance();
            }
        });

        this.animationControllers.set('monitor', monitorController);
    }

    /**
     * Adjust performance based on FPS
     */
    adjustPerformance() {
        if (this.currentFPS < 30 && this.performanceLevel !== 'low') {
            console.log('🔧 Reducing animation performance due to low FPS');
            this.setPerformanceLevel('low');
        } else if (this.currentFPS > 50 && this.performanceLevel === 'low') {
            console.log('🚀 Increasing animation performance due to good FPS');
            this.setPerformanceLevel('medium');
        }
    }

    /**
     * Set performance level dynamically
     */
    setPerformanceLevel(level) {
        this.performanceLevel = level;
        
        // Adjust particle count
        const heartSystem = this.particleSystems.get('hearts');
        if (heartSystem) {
            const newCount = this.getOptimalParticleCount();
            this.adjustParticleCount(heartSystem, newCount);
        }

        // Adjust animation speeds
        this.adjustAnimationSpeeds(level);
    }

    /**
     * Adjust particle count dynamically
     */
    adjustParticleCount(system, newCount) {
        const currentCount = system.container.children.length;
        
        if (newCount > currentCount) {
            // Add particles
            for (let i = currentCount; i < newCount; i++) {
                this.createHeartParticle(system.container);
            }
        } else if (newCount < currentCount) {
            // Remove particles
            for (let i = currentCount - 1; i >= newCount; i--) {
                const particle = system.container.children[i];
                if (particle) {
                    particle.remove();
                }
            }
        }
        
        system.particleCount = newCount;
    }

    /**
     * Adjust animation speeds based on performance
     */
    adjustAnimationSpeeds(level) {
        const speedMultiplier = {
            'high': 1,
            'medium': 0.8,
            'low': 0.5
        }[level] || 1;

        document.documentElement.style.setProperty('--animation-speed', speedMultiplier);
    }

    /**
     * Respect user's motion preferences
     */
    respectMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
            this.config.enableAnimations = false;
            this.config.enableParticles = false;
        }
    }

    /**
     * Get animation performance metrics
     */
    getMetrics() {
        return {
            performanceLevel: this.performanceLevel,
            currentFPS: this.currentFPS,
            activeAnimations: this.activeAnimations.size,
            particleSystems: this.particleSystems.size,
            particleCount: Array.from(this.particleSystems.values())
                .reduce((total, system) => total + system.particleCount, 0)
        };
    }

    /**
     * Cleanup animation system
     */
    destroy() {
        // Stop all animation controllers
        this.animationControllers.forEach(controller => {
            if (controller.stop) controller.stop();
        });

        // Remove particle systems
        this.particleSystems.forEach(system => {
            if (system.container && system.container.parentNode) {
                system.container.parentNode.removeChild(system.container);
            }
        });

        // Clear maps
        this.activeAnimations.clear();
        this.particleSystems.clear();
        this.animationControllers.clear();

        console.log('✨ Unified Animation System destroyed');
    }
}

// Create global instance
const animationSystem = new UnifiedAnimationSystem();

// Global access
window.animationSystem = animationSystem;
window.UnifiedAnimationSystem = UnifiedAnimationSystem;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        animationSystem.respectMotionPreferences();
        animationSystem.animateEntranceElements();
        animationSystem.setupScrollAnimations();
    });
} else {
    animationSystem.respectMotionPreferences();
    animationSystem.animateEntranceElements();
    animationSystem.setupScrollAnimations();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedAnimationSystem;
}

export { UnifiedAnimationSystem };
export default animationSystem;
