/**
 * Unified Gallery Component - Consolidates all gallery functionality
 * Replaces duplicate EnhancedGallery classes with a single, optimized solution
 * Version: 2.0.0
 */

class UnifiedGallery {
    constructor(options = {}) {
        // Core configuration
        this.config = {
            autoAdvance: options.autoAdvance !== false,
            autoAdvanceInterval: options.autoAdvanceInterval || 5000,
            enableKeyboardNav: options.enableKeyboardNav !== false,
            enableTouchGestures: options.enableTouchGestures !== false,
            enableDots: options.enableDots !== false,
            enableArrows: options.enableArrows !== false,
            transition: options.transition || 'slide', // 'slide', 'fade', 'zoom'
            performance: options.performance || 'auto', // 'auto', 'high', 'low'
            selector: options.selector || '.gallery-slide',
            containerSelector: options.containerSelector || '.gallery-container',
            ...options
        };

        // State management
        this.state = {
            currentSlide: 0,
            isPlaying: false,
            isLoading: false,
            hasError: false,
            userInteracted: false,
            totalSlides: 0
        };

        // Performance optimization
        this.performance = {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isLowPower: this.detectLowPowerMode(),
            isVisible: true,
            updateThrottled: this.throttle(this.updateUI.bind(this), 100),
            preloadThrottled: this.throttle(this.preloadImages.bind(this), 500)
        };

        // DOM references
        this.elements = {
            container: null,
            slides: [],
            dots: [],
            prevBtn: null,
            nextBtn: null,
            counter: null
        };

        // Event handlers
        this.boundHandlers = {
            onKeyDown: this.onKeyDown.bind(this),
            onTouchStart: this.onTouchStart.bind(this),
            onTouchMove: this.onTouchMove.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this),
            onVisibilityChange: this.onVisibilityChange.bind(this),
            onResize: this.onResize.bind(this),
            onWheel: this.onWheel.bind(this)
        };

        // Touch gesture handling
        this.touch = {
            startX: 0,
            startY: 0,
            startTime: 0,
            threshold: 50,
            restraint: 100,
            allowedTime: 300
        };

        // Auto-advance management
        this.autoAdvanceTimer = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize the unified gallery
     */
    async init() {
        try {
            // Setup DOM
            this.setupDOM();

            // Setup event listeners
            this.setupEventListeners();

            // Setup controls
            this.setupControls();

            // Setup touch gestures
            if (this.config.enableTouchGestures) {
                this.setupTouchGestures();
            }

            // Setup keyboard navigation
            if (this.config.enableKeyboardNav) {
                this.setupKeyboardNav();
            }

            // Initial display
            this.showSlide(0);

            // Start auto-advance if enabled
            if (this.config.autoAdvance && !this.performance.isMobile) {
                this.startAutoAdvance();
            }

            // Preload images
            this.performance.preloadThrottled();

            console.log('📸 Unified Gallery initialized');
        } catch (error) {
            console.error('Failed to initialize gallery:', error);
            this.handleError(error);
        }
    }

    /**
     * Setup DOM elements
     */
    setupDOM() {
        // Find container
        this.elements.container = document.querySelector(this.config.containerSelector);

        // Find slides
        this.elements.slides = Array.from(document.querySelectorAll(this.config.selector));
        this.state.totalSlides = this.elements.slides.length;

        if (this.state.totalSlides === 0) {
            console.warn('No gallery slides found');
            return;
        }

        // Create wrapper if not exists
        if (!this.elements.container) {
            this.createGalleryWrapper();
        }

        // Setup slide attributes
        this.elements.slides.forEach((slide, index) => {
            slide.setAttribute('data-slide-index', index);
            slide.style.position = 'absolute';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.transition = `all ${this.performance.isMobile ? 300 : 500}ms ease-in-out`;
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100%)';
        });
    }

    /**
     * Create gallery wrapper structure
     */
    createGalleryWrapper() {
        const firstSlide = this.elements.slides[0];
        if (!firstSlide) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'unified-gallery-container';
        wrapper.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
            border-radius: 8px;
        `;

        // Insert wrapper before first slide
        firstSlide.parentNode.insertBefore(wrapper, firstSlide);

        // Move all slides into wrapper
        this.elements.slides.forEach(slide => {
            wrapper.appendChild(slide);
        });

        this.elements.container = wrapper;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Visibility change
        document.addEventListener('visibilitychange', this.boundHandlers.onVisibilityChange, { passive: true });

        // Window resize
        window.addEventListener('resize', this.boundHandlers.onResize, { passive: true });
    }

    /**
     * Setup controls (dots, arrows)
     */
    setupControls() {
        if (this.config.enableDots) {
            this.createDots();
        }

        if (this.config.enableArrows) {
            this.createArrows();
        }

        this.createCounter();
    }

    /**
     * Create navigation dots
     */
    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'unified-gallery-dots';
        dotsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 10;
        `;

        this.elements.dots = [];

        for (let i = 0; i < this.state.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.5);
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            dot.addEventListener('click', () => this.goToSlide(i));

            this.elements.dots.push(dot);
            dotsContainer.appendChild(dot);
        }

        this.elements.container.appendChild(dotsContainer);
    }

    /**
     * Create navigation arrows
     */
    createArrows() {
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'unified-gallery-prev';
        prevBtn.innerHTML = '&#8249;';
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.style.cssText = `
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            transition: background 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        prevBtn.addEventListener('click', () => this.previousSlide());
        this.elements.prevBtn = prevBtn;
        this.elements.container.appendChild(prevBtn);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'unified-gallery-next';
        nextBtn.innerHTML = '&#8250;';
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.style.cssText = prevBtn.style.cssText.replace('left: 20px', 'right: 20px');

        nextBtn.addEventListener('click', () => this.nextSlide());
        this.elements.nextBtn = nextBtn;
        this.elements.container.appendChild(nextBtn);

        // Hover effects
        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(0, 0, 0, 0.8)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(0, 0, 0, 0.5)';
            });
        });
    }

    /**
     * Create slide counter
     */
    createCounter() {
        const counter = document.createElement('div');
        counter.className = 'unified-gallery-counter';
        counter.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10;
        `;

        this.elements.counter = counter;
        this.elements.container.appendChild(counter);
        this.updateCounter();
    }

    /**
     * Setup touch gestures for mobile
     */
    setupTouchGestures() {
        if (!this.elements.container) return;

        this.elements.container.addEventListener('touchstart', this.boundHandlers.onTouchStart, { passive: true });
        this.elements.container.addEventListener('touchmove', this.boundHandlers.onTouchMove, { passive: false });
        this.elements.container.addEventListener('touchend', this.boundHandlers.onTouchEnd, { passive: true });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNav() {
        document.addEventListener('keydown', this.boundHandlers.onKeyDown);
    }

    /**
     * Show specific slide
     */
    showSlide(index) {
        if (index < 0 || index >= this.state.totalSlides) return;

        const previousIndex = this.state.currentSlide;
        this.state.currentSlide = index;

        // Update slides
        this.elements.slides.forEach((slide, i) => {
            if (i === index) {
                // Current slide
                slide.style.opacity = '1';
                slide.style.transform = 'translateX(0)';
                slide.style.zIndex = '2';
            } else if (i === previousIndex) {
                // Previous slide - animate out
                slide.style.opacity = '0';
                slide.style.transform = i < index ? 'translateX(-100%)' : 'translateX(100%)';
                slide.style.zIndex = '1';
            } else {
                // Other slides
                slide.style.opacity = '0';
                slide.style.transform = i < index ? 'translateX(-100%)' : 'translateX(100%)';
                slide.style.zIndex = '0';
            }
        });

        // Update controls
        this.updateDots();
        this.updateCounter();
        this.updateArrows();

        // Preload adjacent images
        this.preloadAdjacentImages(index);

        // Performance monitoring
        this.performance.updateThrottled();
    }

    /**
     * Next slide
     */
    nextSlide() {
        const next = (this.state.currentSlide + 1) % this.state.totalSlides;
        this.showSlide(next);
        this.restartAutoAdvance();
    }

    /**
     * Previous slide
     */
    previousSlide() {
        const prev = (this.state.currentSlide - 1 + this.state.totalSlides) % this.state.totalSlides;
        this.showSlide(prev);
        this.restartAutoAdvance();
    }

    /**
     * Go to specific slide
     */
    goToSlide(index) {
        if (index >= 0 && index < this.state.totalSlides) {
            this.showSlide(index);
            this.restartAutoAdvance();
        }
    }

    /**
     * Start auto-advance
     */
    startAutoAdvance() {
        if (!this.config.autoAdvance || this.performance.isMobile) return;

        this.stopAutoAdvance();
        this.autoAdvanceTimer = setInterval(() => {
            if (this.performance.isVisible && !this.state.userInteracted) {
                this.nextSlide();
            }
        }, this.config.autoAdvanceInterval);
    }

    /**
     * Stop auto-advance
     */
    stopAutoAdvance() {
        if (this.autoAdvanceTimer) {
            clearInterval(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
    }

    /**
     * Restart auto-advance
     */
    restartAutoAdvance() {
        this.state.userInteracted = true;

        // Restart after a delay
        setTimeout(() => {
            this.state.userInteracted = false;
            this.startAutoAdvance();
        }, this.config.autoAdvanceInterval * 2);
    }

    /**
     * Update navigation dots
     */
    updateDots() {
        if (!this.elements.dots.length) return;

        this.elements.dots.forEach((dot, index) => {
            if (index === this.state.currentSlide) {
                dot.style.background = 'rgba(255, 255, 255, 0.9)';
                dot.style.borderColor = 'rgba(255, 255, 255, 0.9)';
            } else {
                dot.style.background = 'transparent';
                dot.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }
        });
    }

    /**
     * Update slide counter
     */
    updateCounter() {
        if (this.elements.counter) {
            this.elements.counter.textContent = `${this.state.currentSlide + 1} / ${this.state.totalSlides}`;
        }
    }

    /**
     * Update navigation arrows
     */
    updateArrows() {
        if (this.elements.prevBtn) {
            this.elements.prevBtn.style.opacity = this.state.totalSlides > 1 ? '1' : '0.5';
        }

        if (this.elements.nextBtn) {
            this.elements.nextBtn.style.opacity = this.state.totalSlides > 1 ? '1' : '0.5';
        }
    }

    /**
     * Preload images for performance
     */
    preloadImages() {
        this.elements.slides.forEach((slide, index) => {
            const images = slide.querySelectorAll('img');
            images.forEach(img => {
                if (!img.complete && img.src) {
                    const preloadImg = new Image();
                    preloadImg.src = img.src;
                }
            });
        });
    }

    /**
     * Preload adjacent images
     */
    preloadAdjacentImages(currentIndex) {
        const adjacentIndices = [
            (currentIndex - 1 + this.state.totalSlides) % this.state.totalSlides,
            (currentIndex + 1) % this.state.totalSlides
        ];

        adjacentIndices.forEach(index => {
            const slide = this.elements.slides[index];
            if (slide) {
                const images = slide.querySelectorAll('img');
                images.forEach(img => {
                    if (!img.complete && img.src) {
                        const preloadImg = new Image();
                        preloadImg.src = img.src;
                    }
                });
            }
        });
    }

    /**
     * Update UI elements
     */
    updateUI() {
        this.updateDots();
        this.updateCounter();
        this.updateArrows();
    }

    /**
     * Event Handlers
     */
    onKeyDown(event) {
        if (!this.elements.container) return;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                event.preventDefault();
                this.goToSlide(this.state.totalSlides - 1);
                break;
        }
    }

    onTouchStart(event) {
        if (event.touches.length !== 1) return;

        const touch = event.touches[0];
        this.touch.startX = touch.clientX;
        this.touch.startY = touch.clientY;
        this.touch.startTime = Date.now();
    }

    onTouchMove(event) {
        // Prevent default to avoid scrolling while swiping
        if (Math.abs(event.touches[0].clientX - this.touch.startX) > 10) {
            event.preventDefault();
        }
    }

    onTouchEnd(event) {
        if (!event.changedTouches.length) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.touch.startX;
        const deltaY = touch.clientY - this.touch.startY;
        const deltaTime = Date.now() - this.touch.startTime;

        // Check if it's a valid swipe
        if (deltaTime <= this.touch.allowedTime) {
            if (Math.abs(deltaX) >= this.touch.threshold && Math.abs(deltaY) <= this.touch.restraint) {
                if (deltaX < 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.previousSlide();
                }
            }
        }
    }

    onVisibilityChange() {
        this.performance.isVisible = !document.hidden;

        if (document.hidden) {
            this.stopAutoAdvance();
        } else {
            this.startAutoAdvance();
        }
    }

    onResize() {
        // Throttled resize handling
        setTimeout(() => {
            this.performance.updateThrottled();
        }, 150);
    }

    onWheel(event) {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            event.preventDefault();

            if (event.deltaX > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    /**
     * Utility functions
     */
    detectLowPowerMode() {
        return (
            navigator.hardwareConcurrency <= 2 ||
            navigator.deviceMemory <= 2 ||
            navigator.connection?.effectiveType === 'slow-2g' ||
            navigator.connection?.effectiveType === '2g'
        );
    }

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

    /**
     * Error handling
     */
    handleError(error) {
        this.state.hasError = true;
        console.error('Gallery error:', error);

        // Show error message
        if (this.elements.container) {
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.1);
                color: #ff0000;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                z-index: 100;
            `;
            errorMsg.textContent = 'Gallery failed to load';
            this.elements.container.appendChild(errorMsg);
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Stop auto-advance
        this.stopAutoAdvance();

        // Remove event listeners
        document.removeEventListener('keydown', this.boundHandlers.onKeyDown);
        document.removeEventListener('visibilitychange', this.boundHandlers.onVisibilityChange);
        window.removeEventListener('resize', this.boundHandlers.onResize);

        if (this.elements.container) {
            this.elements.container.removeEventListener('touchstart', this.boundHandlers.onTouchStart);
            this.elements.container.removeEventListener('touchmove', this.boundHandlers.onTouchMove);
            this.elements.container.removeEventListener('touchend', this.boundHandlers.onTouchEnd);
        }

        // Clear references
        this.elements = {};
        this.autoAdvanceTimer = null;

        console.log('📸 Unified Gallery destroyed');
    }

    /**
     * Public API methods for backwards compatibility
     */
    show(index) {
        this.showSlide(index);
    }

    next() {
        this.nextSlide();
    }

    prev() {
        this.previousSlide();
    }

    goto(index) {
        this.goToSlide(index);
    }

    play() {
        this.startAutoAdvance();
    }

    pause() {
        this.stopAutoAdvance();
    }

    getCurrentSlide() {
        return this.state.currentSlide;
    }

    getTotalSlides() {
        return this.state.totalSlides;
    }
}

// Global instance management
window.UnifiedGallery = UnifiedGallery;

// Global functions for backwards compatibility
let galleryInstance = null;

function nextSlide() {
    if (galleryInstance) galleryInstance.nextSlide();
}

function previousSlide() {
    if (galleryInstance) galleryInstance.previousSlide();
}

function currentSlide(index) {
    if (galleryInstance) galleryInstance.goToSlide(index - 1);
}

// Auto-initialize when DOM is ready (if not manually initialized)
document.addEventListener('DOMContentLoaded', function() {
    if (!galleryInstance && document.querySelectorAll('.gallery-slide').length > 0) {
        galleryInstance = new UnifiedGallery();
        window.galleryInstance = galleryInstance; // Global access
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedGallery;
}

// ES6 export
export { UnifiedGallery };
