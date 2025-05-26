/**
 * Unified Bubble Animation System
 * Consolidates all bubble animation functionality across the website
 * Version: 2.0.0
 */

class UnifiedBubbleAnimation {
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

        // Bubble types based on page
        this.bubbleTypes = this.getBubbleTypesByPage();

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
    }    /**
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

            console.log(`🫧 Unified Bubble Animation System initialized for ${this.config.pageType} page`);
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
    }    /**
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
        if (this.config.enableFloatingHearts) {
            this.startFloatingHearts();
        }

        if (this.config.enableRandomHearts) {
            this.startRandomHearts();
        }
    }

    /**
     * Start floating hearts animation
     */
    startFloatingHearts() {
        if (!this.containers.floating) return;

        const createHeart = () => {
            if (!this.state.isPageVisible || this.state.heartCount >= this.config.maxHearts) return;

            this.createFloatingHeart();

            // Schedule next heart
            const interval = this.getHeartInterval();
            const timeoutId = setTimeout(createHeart, interval);
            this.timeouts.add(timeoutId);
        };

        // Start with initial delay
        const timeoutId = setTimeout(createHeart, 1000);
        this.timeouts.add(timeoutId);
    }

    /**
     * Start random hearts animation
     */
    startRandomHearts() {
        if (!this.containers.floating) return;

        const createRandomHeart = () => {
            if (!this.state.isPageVisible) return;

            // Create multiple hearts for density
            const heartCount = this.getRandomHeartCount();
            for (let i = 0; i < heartCount; i++) {
                setTimeout(() => this.createRandomHeart(), i * 200);
            }

            // Schedule next batch
            const interval = this.getRandomHeartInterval();
            const timeoutId = setTimeout(createRandomHeart, interval);
            this.timeouts.add(timeoutId);
        };

        createRandomHeart();
    }

    /**
     * Create floating heart
     */
    createFloatingHeart() {
        const heart = this.createHeartElement({
            type: 'floating',
            emoji: this.getRandomHeartEmoji(),
            size: this.getRandomSize(),
            position: this.getFloatingStartPosition(),
            duration: this.getRandomDuration(),
            animation: 'float'
        });

        this.animateFloatingHeart(heart);
    }

    /**
     * Create random heart with various animation patterns
     */
    createRandomHeart() {
        const animationPattern = this.getRandomAnimationPattern();
        const heart = this.createHeartElement({
            type: 'random',
            emoji: this.getRandomHeartEmoji(),
            size: this.getRandomSize(),
            position: this.getRandomStartPosition(animationPattern),
            duration: this.getRandomDuration(),
            animation: animationPattern
        });

        this.animateRandomHeart(heart, animationPattern);
    }

    /**
     * Create heart burst effect
     */
    createHeartBurst(x, y, intensity = 10) {
        if (!this.config.enableBurstHearts) return;

        const burstCount = Math.floor(Math.random() * intensity) + intensity;
        const heartEmojis = this.getPageSpecificBurstHearts();

        for (let i = 0; i < burstCount; i++) {
            const heart = this.createHeartElement({
                type: 'burst',
                emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
                size: this.getRandomBurstSize(),
                position: { x, y },
                duration: this.getRandomBurstDuration(),
                animation: 'burst'
            });

            this.animateBurstHeart(heart, x, y, i, burstCount);
        }
    }

    /**
     * Create heart element with optimized properties
     */
    createHeartElement(config) {
        const heart = document.createElement('div');
        heart.className = `heart-${config.type}`;
        heart.textContent = config.emoji;

        // Base styles for performance
        const baseStyles = {
            position: config.type === 'burst' ? 'fixed' : 'absolute',
            fontSize: `${config.size}px`,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: config.type === 'burst' ? '150' : '5',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
        };

        // Position-specific styles
        if (config.position) {
            baseStyles.left = `${config.position.x}px`;
            baseStyles.top = `${config.position.y}px`;
        }

        // Apply styles
        Object.assign(heart.style, baseStyles);

        // Add to appropriate container
        const container = config.type === 'burst' ? this.containers.burst : this.containers.floating;
        container.appendChild(heart);

        // Track heart count
        this.state.heartCount++;

        // Schedule cleanup
        const cleanupTimeout = setTimeout(() => {
            this.removeHeart(heart);
        }, config.duration * 1000 + 1000);
        this.timeouts.add(cleanupTimeout);

        return heart;
    }

    /**
     * Animate floating heart
     */
    animateFloatingHeart(heart) {
        const startY = parseFloat(heart.style.top);
        const endY = -100;
        const startX = parseFloat(heart.style.left);
        const drift = (Math.random() - 0.5) * 200;
        const endX = startX + drift;

        const duration = parseFloat(heart.getAttribute('data-duration')) || 6;
        const rotation = Math.random() * 360;

        // Apply animation
        heart.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        heart.style.filter = `drop-shadow(0 0 10px rgba(255, 107, 157, 0.8)) hue-rotate(${Math.random() * 60 - 30}deg)`;

        // Start animation
        requestAnimationFrame(() => {
            heart.style.transform = `
                translate3d(${endX - startX}px, ${endY - startY}px, 0)
                rotate(${rotation}deg)
                scale(${Math.random() * 0.5 + 0.5})
            `;
            heart.style.opacity = '0';
        });
    }

    /**
     * Animate random heart with pattern
     */
    animateRandomHeart(heart, pattern) {
        const duration = parseFloat(heart.getAttribute('data-duration')) || 5;

        switch (pattern) {
            case 'spiral':
                this.animateSpiral(heart, duration);
                break;
            case 'bounce':
                this.animateBounce(heart, duration);
                break;
            case 'zigzag':
                this.animateZigzag(heart, duration);
                break;
            case 'explosion':
                this.animateExplosion(heart, duration);
                break;
            case 'teleport':
                this.animateTeleport(heart, duration);
                break;
            default:
                this.animateLinear(heart, duration);
        }
    }

    /**
     * Animate burst heart
     */
    animateBurstHeart(heart, centerX, centerY, index, total) {
        const angle = (Math.PI * 2 * index) / total + (Math.random() - 0.5) * 0.7;
        const velocity = Math.random() * 300 + 150;
        const duration = Math.random() * 2 + 1.5;
        const rotation = Math.random() * 720 + 360;
        const gravity = Math.random() * 300 + 200;

        const endX = centerX + Math.cos(angle) * velocity;
        const endY = centerY + Math.sin(angle) * velocity - 80;
        const finalY = centerY + gravity;

        // CSS custom properties for animation
        heart.style.setProperty('--endX', `${endX}px`);
        heart.style.setProperty('--endY', `${endY}px`);
        heart.style.setProperty('--finalY', `${finalY}px`);
        heart.style.setProperty('--rotation', `${rotation}deg`);

        // Apply burst animation
        heart.style.animation = `burstAnimation ${duration}s ease-out forwards`;
        heart.style.filter = `drop-shadow(0 0 15px rgba(255, 107, 157, 1)) hue-rotate(${Math.random() * 60 - 30}deg)`;
    }

    /**
     * Animation pattern implementations
     */
    animateSpiral(heart, duration) {
        const steps = 100;
        const stepDuration = duration * 1000 / steps;
        let currentStep = 0;

        const startX = parseFloat(heart.style.left);
        const startY = parseFloat(heart.style.top);
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight;

        const animate = () => {
            if (currentStep >= steps || !heart.parentNode) return;

            const progress = currentStep / steps;
            const angle = progress * Math.PI * 4;
            const radius = 50 * (1 - progress);

            const currentX = startX + (endX - startX) * progress + Math.cos(angle) * radius;
            const currentY = startY + (endY - startY) * progress + Math.sin(angle) * radius;
            const rotation = 720 * progress;

            heart.style.transform = `
                translate3d(${currentX - startX}px, ${currentY - startY}px, 0)
                rotate(${rotation}deg)
                scale(${1 - progress * 0.5})
            `;
            heart.style.opacity = 1 - progress;

            currentStep++;
            setTimeout(animate, stepDuration);
        };

        animate();
    }

    animateBounce(heart, duration) {
        const startX = parseFloat(heart.style.left);
        const startY = parseFloat(heart.style.top);
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight;

        heart.style.transition = `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;

        requestAnimationFrame(() => {
            heart.style.transform = `
                translate3d(${endX - startX}px, ${endY - startY}px, 0)
                rotate(${Math.random() * 360}deg)
                scale(0.8)
            `;
            heart.style.opacity = '0';
        });
    }

    animateZigzag(heart, duration) {
        const steps = 8;
        const stepDuration = duration * 1000 / steps;
        let currentStep = 0;

        const startX = parseFloat(heart.style.left);
        const startY = parseFloat(heart.style.top);
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight;

        const animate = () => {
            if (currentStep >= steps || !heart.parentNode) return;

            const progress = currentStep / steps;
            const zigzagOffset = Math.sin(progress * Math.PI * 3) * 80;

            const currentX = startX + (endX - startX) * progress + zigzagOffset;
            const currentY = startY + (endY - startY) * progress;
            const rotation = 360 * progress;
            const scale = 0.8 + Math.sin(progress * Math.PI * 2) * 0.3;

            heart.style.transform = `
                translate3d(${currentX - startX}px, ${currentY - startY}px, 0)
                rotate(${rotation}deg)
                scale(${scale})
            `;
            heart.style.opacity = 1 - progress;

            currentStep++;
            setTimeout(animate, stepDuration);
        };

        animate();
    }

    animateExplosion(heart, duration) {
        const startX = parseFloat(heart.style.left);
        const startY = parseFloat(heart.style.top);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 300 + 200;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;

        heart.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

        requestAnimationFrame(() => {
            heart.style.transform = `
                translate3d(${endX - startX}px, ${endY - startY}px, 0)
                rotate(${Math.random() * 720}deg)
                scale(${Math.random() * 1.5 + 0.5})
            `;
            heart.style.opacity = '0';
        });
    }

    animateTeleport(heart, duration) {
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight;

        // Fade out
        heart.style.transition = 'opacity 0.3s ease-in-out';
        heart.style.opacity = '0';

        setTimeout(() => {
            heart.style.left = endX + 'px';
            heart.style.top = endY + 'px';
            heart.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.75})`;
            heart.style.transition = `opacity ${duration - 0.6}s ease-in-out`;
            heart.style.opacity = '1';

            setTimeout(() => {
                heart.style.opacity = '0';
            }, (duration - 0.6) * 1000);
        }, 300);
    }

    animateLinear(heart, duration) {
        const startX = parseFloat(heart.style.left);
        const startY = parseFloat(heart.style.top);
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight;
        const curveX = (Math.random() - 0.5) * 300;
        const curveY = (Math.random() - 0.5) * 150;

        heart.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

        requestAnimationFrame(() => {
            heart.style.transform = `
                translate3d(${endX - startX + curveX}px, ${endY - startY + curveY}px, 0)
                rotate(${Math.random() * 720}deg)
                scale(${Math.random() * 0.8 + 0.6})
            `;
            heart.style.opacity = '0';
        });
    }

    /**
     * Event handlers
     */
    onDocumentClick(event) {
        // Don't create burst if clicking on interactive elements
        if (this.isInteractiveElement(event.target)) return;

        this.createHeartBurst(event.clientX, event.clientY, this.getBurstIntensity());
    }

    onDocumentTouch(event) {
        if (event.touches && event.touches[0] && !this.isInteractiveElement(event.target)) {
            const touch = event.touches[0] || event.changedTouches[0];
            this.createHeartBurst(touch.clientX, touch.clientY, this.getBurstIntensity());
        }
    }

    onVisibilityChange() {
        this.state.isPageVisible = !document.hidden;

        if (document.hidden) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    onWindowResize() {
        // Cleanup hearts that are now outside viewport
        this.performance.deferredCleanup();
    }

    /**
     * Utility functions
     */
    isInteractiveElement(element) {
        const interactiveTypes = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
        return interactiveTypes.includes(element.tagName) ||
               element.closest('button, a, .music-player, .control-panel, .gallery-navigation');
    }

    getHeartTypesByPage() {
        const commonHearts = ['💕', '💖', '💝', '💗', '💘', '❤️', '💞', '💓', '❣️'];

        switch (this.config.pageType) {
            case 'countdown':
                return [...commonHearts, '🎊', '🎉', '⏰', '🕛'];
            case 'anniversary':
                return [...commonHearts, '🌹', '💋', '🥂', '🎊', '🎉'];
            case 'love-story':
                return [...commonHearts, '📞', '💌', '🌙', '⭐', '💫'];
            case 'gallery':
                return [...commonHearts, '📸', '🖼️', '🌟', '✨'];
            default:
                return [...commonHearts, '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', '🤎'];
        }
    }

    getPageSpecificBurstHearts() {
        return this.heartTypes.slice(0, Math.min(this.heartTypes.length, 16));
    }

    getRandomHeartEmoji() {
        return this.heartTypes[Math.floor(Math.random() * this.heartTypes.length)];
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

    getRandomBurstSize() {
        return Math.random() * 16 + 12; // 12-28px
    }

    getRandomDuration() {
        const { min, max } = this.config.animationDuration;
        return Math.random() * (max - min) + min;
    }

    getRandomBurstDuration() {
        return Math.random() * 1.5 + 1.2; // 1.2-2.7 seconds
    }

    getFloatingStartPosition() {
        return {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50
        };
    }

    getRandomStartPosition(pattern) {
        switch (pattern) {
            case 'explosion':
                return {
                    x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
                    y: window.innerHeight / 2 + (Math.random() - 0.5) * 100
                };
            case 'teleport':
                return {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                };
            default:
                const side = Math.floor(Math.random() * 4);
                switch (side) {
                    case 0: // top
                        return { x: Math.random() * window.innerWidth, y: -50 };
                    case 1: // right
                        return { x: window.innerWidth + 50, y: Math.random() * window.innerHeight };
                    case 2: // bottom
                        return { x: Math.random() * window.innerWidth, y: window.innerHeight + 50 };
                    case 3: // left
                        return { x: -50, y: Math.random() * window.innerHeight };
                }
        }
    }

    getRandomAnimationPattern() {
        const patterns = ['linear', 'spiral', 'bounce', 'zigzag', 'explosion', 'teleport'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    getHeartInterval() {
        const intervals = {
            low: { min: 3000, max: 6000 },
            medium: { min: 1500, max: 3000 },
            high: { min: 800, max: 1500 }
        };

        const range = intervals[this.config.heartDensity] || intervals.medium;
        return Math.random() * (range.max - range.min) + range.min;
    }

    getRandomHeartInterval() {
        return Math.random() * 2000 + 1000; // 1-3 seconds
    }

    getRandomHeartCount() {
        const counts = {
            low: 1,
            medium: Math.floor(Math.random() * 2) + 1,
            high: Math.floor(Math.random() * 3) + 2
        };

        return counts[this.config.heartDensity] || counts.medium;
    }

    getBurstIntensity() {
        const intensities = {
            low: 6,
            medium: 10,
            high: 15
        };

        return intensities[this.config.heartDensity] || intensities.medium;
    }

    detectPerformanceMode() {
        if (this.config.performance !== 'auto') {
            return this.config.performance;
        }

        // Auto-detect based on device capabilities
        const isLowPower = navigator.hardwareConcurrency <= 2 ||
                          navigator.deviceMemory <= 2 ||
                          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        return isLowPower ? 'low' : 'medium';
    }

    /**
     * Performance utilities
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    updatePerformanceMetrics() {
        // Monitor heart count and performance
        if (this.state.heartCount > this.config.maxHearts * 1.5) {
            this.cleanupExpiredHearts();
        }
    }

    cleanupExpiredHearts() {
        const hearts = document.querySelectorAll('.heart-floating, .heart-random, .heart-burst');
        let cleaned = 0;

        hearts.forEach(heart => {
            const rect = heart.getBoundingClientRect();
            const isOutsideViewport = rect.bottom < -100 ||
                                    rect.top > window.innerHeight + 100 ||
                                    rect.right < -100 ||
                                    rect.left > window.innerWidth + 100;

            if (isOutsideViewport || parseFloat(heart.style.opacity) < 0.1) {
                this.removeHeart(heart);
                cleaned++;
            }
        });

        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} expired hearts`);
        }
    }

    removeHeart(heart) {
        if (heart && heart.parentNode) {
            heart.parentNode.removeChild(heart);
            this.state.heartCount = Math.max(0, this.state.heartCount - 1);
        }
    }

    /**
     * Animation control
     */
    pauseAnimations() {
        // Clear all intervals and timeouts
        this.intervals.forEach(interval => clearInterval(interval));
        this.timeouts.forEach(timeout => clearTimeout(timeout));

        // Pause CSS animations
        const hearts = document.querySelectorAll('.heart-floating, .heart-random, .heart-burst');
        hearts.forEach(heart => {
            heart.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        // Resume CSS animations
        const hearts = document.querySelectorAll('.heart-floating, .heart-random, .heart-burst');
        hearts.forEach(heart => {
            heart.style.animationPlayState = 'running';
        });

        // Restart animations if they were running
        if (this.state.isRunning) {
            this.startAnimations();
        }
    }

    /**
     * Public API
     */
    start() {
        this.state.isRunning = true;
        this.startAnimations();
    }

    stop() {
        this.state.isRunning = false;
        this.pauseAnimations();
        this.intervals.clear();
        this.timeouts.clear();
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Stop all animations
        this.stop();

        // Remove event listeners
        document.removeEventListener('click', this.boundHandlers.onClick);
        document.removeEventListener('touchend', this.boundHandlers.onTouch);
        document.removeEventListener('visibilitychange', this.boundHandlers.onVisibilityChange);
        window.removeEventListener('resize', this.boundHandlers.onResize);

        // Remove all hearts
        const hearts = document.querySelectorAll('.heart-floating, .heart-random, .heart-burst');
        hearts.forEach(heart => this.removeHeart(heart));

        // Remove containers
        Object.values(this.containers).forEach(container => {
            if (container && container.id && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });

        console.log('💔 Heart Animation System destroyed');
    }
}

// Add required CSS for burst animations
const addHeartAnimationStyles = () => {
    if (document.getElementById('heart-animation-styles')) return;

    const style = document.createElement('style');
    style.id = 'heart-animation-styles';
    style.textContent = `
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
                transform: translate(calc(var(--endX) - 50vw), calc(var(--finalY) - 50vh)) rotate(var(--rotation)) scale(0.3);
                opacity: 0;
            }
        }

        .heart-floating, .heart-random, .heart-burst {
            contain: layout style paint;
            will-change: transform, opacity;
            backface-visibility: hidden;
        }
    `;
    document.head.appendChild(style);
};

// Auto-add styles when class is loaded
addHeartAnimationStyles();

// Global export
window.UnifiedHeartAnimation = UnifiedHeartAnimation;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedHeartAnimation;
}

// ES6 export
export { UnifiedHeartAnimation };
