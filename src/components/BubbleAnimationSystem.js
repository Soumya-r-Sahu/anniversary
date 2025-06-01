/**
 * Bubble Animation System
 * Manages all bubble animation functionality across the website
 * Version: 2.0.0 - Optimized and renamed for clarity
 */

class BubbleAnimationSystem {
    constructor(options = {}) {
        // Configuration
        this.config = {
            enableFloatingBubbles: options.enableFloatingBubbles !== false,
            enableBurstBubbles: options.enableBurstBubbles !== false,
            enableRandomBubbles: options.enableRandomBubbles !== false,
            bubbleDensity: options.bubbleDensity || 'medium', // 'low', 'medium', 'high'
            performance: options.performance || 'auto', // 'auto', 'high', 'low'
            pageType: options.pageType || 'default', // 'countdown', 'anniversary', 'love-story', 'gallery'
            maxBubbles: options.maxBubbles || 50,
            animationDuration: options.animationDuration || { min: 3, max: 9 },
            ...options
        };

        // State management
        this.state = {
            isRunning: false,
            bubbleCount: 0,
            isPageVisible: !document.hidden,
            performanceMode: this.detectPerformanceMode()
        };

        // Bubble color schemes based on page
        this.bubbleColors = this.getBubbleColorsByPage();

        // Animation containers
        this.containers = {
            floating: null,
            burst: null,
            random: null
        };

        // Animation intervals and timeouts
        this.intervals = new Set();
        this.timeouts = new Set();

        // Performance optimization
        this.performance = {
            throttledUpdate: this.throttle(this.updatePerformanceMetrics.bind(this), 1000),
            deferredCleanup: this.debounce(this.cleanupExpiredBubbles.bind(this), 5000)
        };

        // Event handlers
        this.boundHandlers = {
            onVisibilityChange: this.onVisibilityChange.bind(this),
            onClick: this.onDocumentClick.bind(this),
            onTouch: this.onDocumentTouch.bind(this),
            onResize: this.onWindowResize.bind(this)
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize the bubble animation system
     */
    init() {
        try {
            // Setup containers
            this.setupContainers();

            // Setup event listeners
            this.setupEventListeners();

            // Setup page visibility handling
            this.setupVisibilityHandling();

            // Start animations based on configuration
            this.startAnimations();

            console.log(`🫧 Bubble Animation System initialized for ${this.config.pageType} page`);
        } catch (error) {
            console.error('Failed to initialize bubble animation system:', error);
        }
    }

    /**
     * Setup animation containers
     */
    setupContainers() {
        // Create floating bubbles container
        if (this.config.enableFloatingBubbles || this.config.enableRandomBubbles) {
            this.containers.floating = this.createContainer('floating-bubbles-container', {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '5',
                overflow: 'hidden',
                contain: 'layout style paint'
            });
        }

        // Burst bubbles will be created dynamically
        this.containers.burst = document.body;
    }

    /**
     * Create animation container
     */
    createContainer(id, styles) {
        let container = document.getElementById(id);

        if (!container) {
            container = document.createElement('div');
            container.id = id;
            container.className = id.replace('-container', '');

            // Apply styles
            Object.assign(container.style, styles);

            document.body.appendChild(container);
        }

        return container;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Burst bubbles on click/touch
        if (this.config.enableBurstBubbles) {
            document.addEventListener('click', this.boundHandlers.onClick, { passive: true });
            document.addEventListener('touchend', this.boundHandlers.onTouch, { passive: true });
        }

        // Window resize handling
        window.addEventListener('resize', this.boundHandlers.onResize, { passive: true });
    }

    /**
     * Setup page visibility handling for performance
     */
    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', this.boundHandlers.onVisibilityChange, { passive: true });
    }

    /**
     * Start animations based on configuration
     */
    startAnimations() {
        this.state.isRunning = true;

        if (this.config.enableFloatingBubbles) {
            this.startFloatingBubbles();
        }

        if (this.config.enableRandomBubbles) {
            this.startRandomBubbles();
        }
    }

    /**
     * Start floating bubbles animation
     */
    startFloatingBubbles() {
        if (!this.containers.floating) return;

        const createBubble = () => {
            if (!this.state.isPageVisible || this.state.bubbleCount >= this.config.maxBubbles) return;

            this.createFloatingBubble();

            // Schedule next bubble
            const interval = this.getBubbleInterval();
            const timeoutId = setTimeout(createBubble, interval);
            this.timeouts.add(timeoutId);
        };

        // Start with initial delay
        const timeoutId = setTimeout(createBubble, 1000);
        this.timeouts.add(timeoutId);
    }

    /**
     * Start random bubbles animation
     */
    startRandomBubbles() {
        if (!this.containers.floating) return;

        const createRandomBubble = () => {
            if (!this.state.isPageVisible) return;

            // Create multiple bubbles for density
            const bubbleCount = this.getRandomBubbleCount();
            for (let i = 0; i < bubbleCount; i++) {
                setTimeout(() => this.createRandomBubble(), i * 200);
            }

            // Schedule next batch
            const interval = this.getRandomBubbleInterval();
            const timeoutId = setTimeout(createRandomBubble, interval);
            this.timeouts.add(timeoutId);
        };

        createRandomBubble();
    }

    /**
     * Create floating bubble
     */
    createFloatingBubble() {
        const bubble = this.createBubbleElement({
            type: 'floating',
            colors: this.getRandomBubbleColors(),
            size: this.getRandomSize(),
            position: this.getFloatingStartPosition(),
            duration: this.getRandomDuration(),
            animation: 'float'
        });

        this.animateFloatingBubble(bubble);
    }

    /**
     * Create random bubble with various animation patterns
     */
    createRandomBubble() {
        const animationPattern = this.getRandomAnimationPattern();
        const bubble = this.createBubbleElement({
            type: 'random',
            colors: this.getRandomBubbleColors(),
            size: this.getRandomSize(),
            position: this.getRandomStartPosition(animationPattern),
            duration: this.getRandomDuration(),
            animation: animationPattern
        });

        this.animateRandomBubble(bubble, animationPattern);
    }

    /**
     * Create bubble burst effect
     */
    createBubbleBurst(x, y, intensity = 10) {
        if (!this.config.enableBurstBubbles) return;

        const burstCount = Math.floor(Math.random() * intensity) + intensity;
        const bubbleColors = this.getPageSpecificBurstColors();

        for (let i = 0; i < burstCount; i++) {
            const bubble = this.createBubbleElement({
                type: 'burst',
                colors: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
                size: this.getRandomBurstSize(),
                position: { x, y },
                duration: this.getRandomBurstDuration(),
                animation: 'burst'
            });

            this.animateBurstBubble(bubble, x, y, i, burstCount);
        }
    }

    /**
     * Create bubble element with optimized properties
     */
    createBubbleElement(config) {
        const bubble = document.createElement('div');
        bubble.className = `bubble-${config.type}`;

        // Base styles for performance
        const baseStyles = {
            position: config.type === 'burst' ? 'fixed' : 'absolute',
            width: `${config.size}px`,
            height: `${config.size}px`,
            borderRadius: '50%',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: config.type === 'burst' ? '150' : '5',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
            background: config.colors.gradient,
            border: config.colors.border,
            backdropFilter: 'blur(2px)',
            boxShadow: config.colors.shadow
        };

        // Position-specific styles
        if (config.position) {
            baseStyles.left = `${config.position.x}px`;
            baseStyles.top = `${config.position.y}px`;
        }

        // Apply styles
        Object.assign(bubble.style, baseStyles);

        // Add to appropriate container
        const container = config.type === 'burst' ? this.containers.burst : this.containers.floating;
        container.appendChild(bubble);

        // Track bubble count
        this.state.bubbleCount++;

        // Schedule cleanup
        const cleanupTimeout = setTimeout(() => {
            this.removeBubble(bubble);
        }, config.duration * 1000 + 1000);
        this.timeouts.add(cleanupTimeout);

        return bubble;
    }

    /**
     * Animate floating bubble
     */
    animateFloatingBubble(bubble) {
        const startY = parseFloat(bubble.style.top);
        const endY = -100;
        const startX = parseFloat(bubble.style.left);
        const drift = (Math.random() - 0.5) * 200;
        const endX = startX + drift;

        const duration = parseFloat(bubble.getAttribute('data-duration')) || 6;
        const rotation = Math.random() * 360;

        // Apply animation
        bubble.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

        // Start animation
        requestAnimationFrame(() => {
            bubble.style.transform = `
                translate3d(${endX - startX}px, ${endY - startY}px, 0)
                rotate(${rotation}deg)
                scale(${Math.random() * 0.5 + 0.5})
            `;
            bubble.style.opacity = '0';
        });
    }

    /**
     * Animate random bubble with pattern
     */
    animateRandomBubble(bubble, pattern) {
        const duration = parseFloat(bubble.getAttribute('data-duration')) || 5;

        switch (pattern) {
            case 'spiral':
                this.animateSpiral(bubble, duration);
                break;
            case 'bounce':
                this.animateBounce(bubble, duration);
                break;
            case 'zigzag':
                this.animateZigzag(bubble, duration);
                break;
            case 'explosion':
                this.animateExplosion(bubble, duration);
                break;
            case 'teleport':
                this.animateTeleport(bubble, duration);
                break;
            default:
                this.animateLinear(bubble, duration);
        }
    }

    /**
     * Animate burst bubble
     */
    animateBurstBubble(bubble, centerX, centerY, index, total) {
        const angle = (Math.PI * 2 * index) / total + (Math.random() - 0.5) * 0.7;
        const velocity = Math.random() * 300 + 150;
        const duration = Math.random() * 2 + 1.5;
        const rotation = Math.random() * 720 + 360;
        const gravity = Math.random() * 300 + 200;

        const endX = centerX + Math.cos(angle) * velocity;
        const endY = centerY + Math.sin(angle) * velocity - 80;
        const finalY = centerY + gravity;

        // CSS custom properties for animation
        bubble.style.setProperty('--endX', `${endX}px`);
        bubble.style.setProperty('--endY', `${endY}px`);
        bubble.style.setProperty('--finalY', `${finalY}px`);
        bubble.style.setProperty('--rotation', `${rotation}deg`);

        // Apply burst animation
        bubble.style.animation = `bubbleBurstAnimation ${duration}s ease-out forwards`;
    }

    /**
     * Get bubble colors by page type
     */
    getBubbleColorsByPage() {
        const baseColors = [
            // Romantic Pink Gradient
            {
                gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 182, 193, 0.8), rgba(236, 72, 153, 0.7), rgba(219, 39, 119, 0.5))',
                border: '1px solid rgba(255, 182, 193, 0.4)',
                shadow: 'inset 0 0 25px rgba(255, 255, 255, 0.6), 0 0 30px rgba(236, 72, 153, 0.4)'
            },
            // Ocean Blue Gradient
            {
                gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(147, 197, 253, 0.8), rgba(59, 130, 246, 0.7), rgba(29, 78, 216, 0.5))',
                border: '1px solid rgba(147, 197, 253, 0.4)',
                shadow: 'inset 0 0 25px rgba(255, 255, 255, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
            },
            // Emerald Green Gradient
            {
                gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(167, 243, 208, 0.8), rgba(34, 197, 94, 0.7), rgba(21, 128, 61, 0.5))',
                border: '1px solid rgba(167, 243, 208, 0.4)',
                shadow: 'inset 0 0 25px rgba(255, 255, 255, 0.6), 0 0 30px rgba(34, 197, 94, 0.4)'
            }
        ];

        switch (this.config.pageType) {
            case 'countdown':
                return [...baseColors,
                    {
                        gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(254, 215, 170, 0.8), rgba(251, 191, 36, 0.7), rgba(245, 158, 11, 0.5))',
                        border: '1px solid rgba(254, 215, 170, 0.4)',
                        shadow: 'inset 0 0 25px rgba(255, 255, 255, 0.6), 0 0 30px rgba(251, 191, 36, 0.4)'
                    }
                ];
            case 'anniversary':
                return [...baseColors,
                    {
                        gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(252, 165, 165, 0.8), rgba(244, 63, 94, 0.7), rgba(225, 29, 72, 0.5))',
                        border: '1px solid rgba(252, 165, 165, 0.4)',
                        shadow: 'inset 0 0 25px rgba(255, 255, 255, 0.6), 0 0 30px rgba(244, 63, 94, 0.4)'
                    }
                ];
            default:
                return baseColors;
        }
    }

    /**
     * Utility methods
     */
    getRandomBubbleColors() {
        return this.bubbleColors[Math.floor(Math.random() * this.bubbleColors.length)];
    }

    getRandomSize() {
        const baseSizes = {
            low: { min: 10, max: 16 },
            medium: { min: 12, max: 20 },
            high: { min: 14, max: 24 }
        };

        const sizes = baseSizes[this.state.performanceMode] || baseSizes.medium;
        return Math.random() * (sizes.max - sizes.min) + sizes.min;
    }

    getRandomDuration() {
        const { min, max } = this.config.animationDuration;
        return Math.random() * (max - min) + min;
    }

    getFloatingStartPosition() {
        return {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50
        };
    }

    /**
     * Performance and utility methods
     */
    detectPerformanceMode() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isLowEnd = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;

        return isLowEnd || isLowMemory ? 'low' : 'high';
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            const context = this;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Clear all timeouts and intervals
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.intervals.forEach(interval => clearInterval(interval));
        this.timeouts.clear();
        this.intervals.clear();

        // Remove event listeners
        document.removeEventListener('click', this.boundHandlers.onClick);
        document.removeEventListener('touchend', this.boundHandlers.onTouch);
        document.removeEventListener('visibilitychange', this.boundHandlers.onVisibilityChange);
        window.removeEventListener('resize', this.boundHandlers.onResize);

        // Remove containers
        Object.values(this.containers).forEach(container => {
            if (container && container.parentNode && container !== document.body) {
                container.parentNode.removeChild(container);
            }
        });

        console.log('🫧 Bubble Animation System destroyed');
    }
}

// Export for module systems
export { BubbleAnimationSystem };

// Legacy export for backward compatibility
export { BubbleAnimationSystem as UnifiedBubbleAnimation };
