/**
 * Unified Heart Animation Component
 * Provides consistent heart animations across all pages
 * Supports floating, burst, and trail patterns
 */

class UnifiedHeartAnimation {
    constructor(options = {}) {
        this.config = {
            container: options.container || document.body,
            pattern: options.pattern || 'floating', // 'floating', 'burst', 'trail'
            intensity: options.intensity || 'medium', // 'low', 'medium', 'high'
            heartCount: options.heartCount || this.getHeartCountByIntensity(options.intensity),
            colors: options.colors || ['#ff6b9d', '#ff8a65', '#ff5722', '#e91e63'],
            duration: options.duration || 3000,
            size: options.size || { min: 10, max: 30 },
            enableGPU: options.enableGPU !== false,
            ...options
        };

        this.hearts = [];
        this.animationId = null;
        this.isActive = false;
        this.performanceMode = this.detectPerformanceMode();

        this.init();
    }

    /**
     * Initialize the heart animation system
     */
    init() {
        this.setupContainer();
        this.createHeartPool();
        
        if (this.config.pattern === 'floating') {
            this.startFloatingAnimation();
        }

        console.log(`💖 Heart Animation initialized - Pattern: ${this.config.pattern}`);
    }

    /**
     * Setup the container for heart animations
     */
    setupContainer() {
        if (!this.config.container) {
            console.warn('Heart animation container not found');
            return;
        }

        // Ensure container has proper positioning
        const containerStyle = window.getComputedStyle(this.config.container);
        if (containerStyle.position === 'static') {
            this.config.container.style.position = 'relative';
        }

        // Add GPU acceleration if enabled
        if (this.config.enableGPU) {
            this.config.container.style.transform = 'translateZ(0)';
            this.config.container.style.willChange = 'auto';
        }
    }

    /**
     * Create a pool of heart elements for reuse
     */
    createHeartPool() {
        const poolSize = Math.min(this.config.heartCount * 2, 50); // Limit for performance
        
        for (let i = 0; i < poolSize; i++) {
            const heart = this.createHeartElement();
            heart.style.display = 'none';
            this.config.container.appendChild(heart);
            this.hearts.push({
                element: heart,
                active: false,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                life: 0,
                maxLife: this.config.duration
            });
        }
    }

    /**
     * Create a single heart element
     */
    createHeartElement() {
        const heart = document.createElement('div');
        heart.className = 'animated-heart';
        heart.innerHTML = '💖';
        
        const size = this.getRandomSize();
        const color = this.getRandomColor();
        
        heart.style.cssText = `
            position: absolute;
            font-size: ${size}px;
            color: ${color};
            pointer-events: none;
            user-select: none;
            z-index: 1000;
            will-change: transform, opacity;
            transform: translateZ(0);
        `;

        return heart;
    }

    /**
     * Start floating heart animation
     */
    startFloatingAnimation() {
        if (this.isActive) return;
        
        this.isActive = true;
        const spawnRate = this.getSpawnRate();
        
        const animate = () => {
            if (!this.isActive) return;
            
            // Spawn new hearts
            if (Math.random() < spawnRate) {
                this.spawnHeart();
            }
            
            // Update existing hearts
            this.updateHearts();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    /**
     * Create a burst of hearts
     */
    burst(count = 10) {
        const burstCount = Math.min(count, this.hearts.length);
        
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                this.spawnBurstHeart(i, burstCount);
            }, i * 50); // Stagger the burst
        }
    }

    /**
     * Spawn a single heart for floating animation
     */
    spawnHeart() {
        const heart = this.getInactiveHeart();
        if (!heart) return;

        const containerRect = this.config.container.getBoundingClientRect();
        
        heart.active = true;
        heart.life = 0;
        heart.x = Math.random() * containerRect.width;
        heart.y = containerRect.height + 20;
        heart.vx = (Math.random() - 0.5) * 2;
        heart.vy = -1 - Math.random() * 2;
        
        heart.element.style.display = 'block';
        heart.element.style.opacity = '1';
        this.updateHeartPosition(heart);
    }

    /**
     * Spawn a heart for burst animation
     */
    spawnBurstHeart(index, total) {
        const heart = this.getInactiveHeart();
        if (!heart) return;

        const containerRect = this.config.container.getBoundingClientRect();
        const angle = (index / total) * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        
        heart.active = true;
        heart.life = 0;
        heart.x = containerRect.width / 2;
        heart.y = containerRect.height / 2;
        heart.vx = Math.cos(angle) * speed;
        heart.vy = Math.sin(angle) * speed;
        
        heart.element.style.display = 'block';
        heart.element.style.opacity = '1';
        this.updateHeartPosition(heart);
    }

    /**
     * Update all active hearts
     */
    updateHearts() {
        this.hearts.forEach(heart => {
            if (!heart.active) return;
            
            heart.life += 16; // Assume 60fps
            heart.x += heart.vx;
            heart.y += heart.vy;
            
            // Apply gravity for floating hearts
            if (this.config.pattern === 'floating') {
                heart.vy += 0.02;
            }
            
            // Update opacity based on life
            const lifeRatio = heart.life / heart.maxLife;
            const opacity = Math.max(0, 1 - lifeRatio);
            heart.element.style.opacity = opacity;
            
            // Update position
            this.updateHeartPosition(heart);
            
            // Deactivate if life expired or out of bounds
            if (heart.life >= heart.maxLife || this.isOutOfBounds(heart)) {
                this.deactivateHeart(heart);
            }
        });
    }

    /**
     * Update heart element position
     */
    updateHeartPosition(heart) {
        if (this.config.enableGPU) {
            heart.element.style.transform = `translate3d(${heart.x}px, ${heart.y}px, 0)`;
        } else {
            heart.element.style.left = heart.x + 'px';
            heart.element.style.top = heart.y + 'px';
        }
    }

    /**
     * Check if heart is out of bounds
     */
    isOutOfBounds(heart) {
        const containerRect = this.config.container.getBoundingClientRect();
        return heart.x < -50 || heart.x > containerRect.width + 50 ||
               heart.y < -50 || heart.y > containerRect.height + 50;
    }

    /**
     * Get an inactive heart from the pool
     */
    getInactiveHeart() {
        return this.hearts.find(heart => !heart.active);
    }

    /**
     * Deactivate a heart
     */
    deactivateHeart(heart) {
        heart.active = false;
        heart.element.style.display = 'none';
    }

    /**
     * Get heart count based on intensity
     */
    getHeartCountByIntensity(intensity) {
        const counts = { low: 5, medium: 10, high: 20 };
        return counts[intensity] || counts.medium;
    }

    /**
     * Get spawn rate based on intensity
     */
    getSpawnRate() {
        const rates = { low: 0.01, medium: 0.02, high: 0.05 };
        return rates[this.config.intensity] || rates.medium;
    }

    /**
     * Get random heart size
     */
    getRandomSize() {
        const { min, max } = this.config.size;
        return min + Math.random() * (max - min);
    }

    /**
     * Get random heart color
     */
    getRandomColor() {
        return this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
    }

    /**
     * Detect performance mode
     */
    detectPerformanceMode() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isLowEnd = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        return isLowEnd || isLowMemory ? 'low' : 'high';
    }

    /**
     * Stop the animation
     */
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Hide all hearts
        this.hearts.forEach(heart => this.deactivateHeart(heart));
    }

    /**
     * Destroy the component
     */
    destroy() {
        this.stop();
        
        // Remove all heart elements
        this.hearts.forEach(heart => {
            if (heart.element.parentNode) {
                heart.element.parentNode.removeChild(heart.element);
            }
        });
        
        this.hearts = [];
        console.log('💖 Heart Animation destroyed');
    }
}

// Export for module systems
export { UnifiedHeartAnimation };
