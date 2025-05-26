/**
 * Lazy Loader - Optimized image and content lazy loading
 * Provides intelligent lazy loading with performance optimization
 * Version: 2.0.0
 */

class LazyLoader {
    constructor(options = {}) {
        this.config = {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.1,
            enableWebP: options.enableWebP !== false,
            enablePlaceholder: options.enablePlaceholder !== false,
            fadeDuration: options.fadeDuration || 300,
            quality: options.quality || 'auto', // 'auto', 'high', 'medium', 'low'
            ...options
        };

        this.observers = new Map();
        this.loadedImages = new Set();
        this.performance = this.detectPerformanceMode();

        this.init();
    }

    /**
     * Initialize lazy loader
     */
    init() {
        this.createImageObserver();
        this.createContentObserver();
        this.observeExistingElements();

        console.log('🖼️ Lazy Loader initialized');
    }

    /**
     * Detect performance mode
     */
    detectPerformanceMode() {
        const connection = navigator.connection;
        const memory = navigator.deviceMemory || 4;

        // Low performance mode
        if (memory < 2 || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
            return 'low';
        }

        // High performance mode
        if (memory >= 8 && connection?.effectiveType === '4g') {
            return 'high';
        }

        return 'medium';
    }

    /**
     * Create image observer
     */
    createImageObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.config.rootMargin,
            threshold: this.config.threshold
        });

        this.observers.set('images', imageObserver);
    }

    /**
     * Create content observer
     */
    createContentObserver() {
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadContent(entry.target);
                    contentObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.config.rootMargin,
            threshold: this.config.threshold
        });

        this.observers.set('content', contentObserver);
    }

    /**
     * Observe existing elements
     */
    observeExistingElements() {
        // Observe images
        document.querySelectorAll('[data-src], [data-bg-src]').forEach(img => {
            this.observeImage(img);
        });

        // Observe lazy content
        document.querySelectorAll('[data-lazy-content]').forEach(el => {
            this.observeContent(el);
        });
    }

    /**
     * Observe image for lazy loading
     */
    observeImage(img) {
        if (this.config.enablePlaceholder && !img.src) {
            this.createPlaceholder(img);
        }

        this.observers.get('images').observe(img);
    }

    /**
     * Observe content for lazy loading
     */
    observeContent(el) {
        this.observers.get('content').observe(el);
    }

    /**
     * Load image with optimization
     */
    async loadImage(img) {
        const src = img.dataset.src || img.dataset.bgSrc;
        if (!src || this.loadedImages.has(src)) return;

        try {
            // Create optimized URL
            const optimizedSrc = this.optimizeImageURL(src);

            // Preload image
            const imageElement = new Image();
            imageElement.src = optimizedSrc;

            await new Promise((resolve, reject) => {
                imageElement.onload = resolve;
                imageElement.onerror = reject;
            });

            // Apply image
            if (img.dataset.src) {
                img.src = optimizedSrc;
                img.removeAttribute('data-src');
            } else if (img.dataset.bgSrc) {
                img.style.backgroundImage = `url(${optimizedSrc})`;
                img.removeAttribute('data-bg-src');
            }

            // Apply fade effect
            if (this.config.fadeDuration > 0) {
                this.applyFadeEffect(img);
            }

            // Mark as loaded
            this.loadedImages.add(src);
            img.classList.add('lazy-loaded');

            // Fire custom event
            img.dispatchEvent(new CustomEvent('lazy-loaded', { detail: { src: optimizedSrc } }));

        } catch (error) {
            console.error('Failed to load image:', src, error);
            this.handleImageError(img, src);
        }
    }

    /**
     * Load content
     */
    async loadContent(el) {
        const contentURL = el.dataset.lazyContent;
        if (!contentURL) return;

        try {
            el.classList.add('lazy-loading');

            const response = await fetch(contentURL);
            const content = await response.text();

            el.innerHTML = content;
            el.classList.remove('lazy-loading');
            el.classList.add('lazy-loaded');

            // Re-observe new images in loaded content
            el.querySelectorAll('[data-src], [data-bg-src]').forEach(img => {
                this.observeImage(img);
            });

            el.dispatchEvent(new CustomEvent('content-loaded', { detail: { url: contentURL } }));

        } catch (error) {
            console.error('Failed to load content:', contentURL, error);
            el.classList.remove('lazy-loading');
            el.classList.add('lazy-error');
        }
    }

    /**
     * Optimize image URL based on performance mode
     */
    optimizeImageURL(src) {
        // If already optimized, return as-is
        if (src.includes('?')) return src;

        const params = new URLSearchParams();

        // Quality optimization
        switch (this.performance) {
            case 'low':
                params.set('q', '60');
                params.set('w', '800');
                break;
            case 'medium':
                params.set('q', '80');
                params.set('w', '1200');
                break;
            case 'high':
                params.set('q', '90');
                break;
        }

        // WebP support
        if (this.config.enableWebP && this.supportsWebP()) {
            params.set('format', 'webp');
        }

        return params.toString() ? `${src}?${params.toString()}` : src;
    }

    /**
     * Check WebP support
     */
    supportsWebP() {
        if (this._webpSupport !== undefined) return this._webpSupport;

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;

        this._webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        return this._webpSupport;
    }

    /**
     * Create placeholder image
     */
    createPlaceholder(img) {
        const width = img.getAttribute('width') || 300;
        const height = img.getAttribute('height') || 200;

        // Create SVG placeholder
        const placeholder = `data:image/svg+xml;base64,${btoa(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
                    Loading...
                </text>
            </svg>
        `)}`;

        img.src = placeholder;
    }

    /**
     * Apply fade effect
     */
    applyFadeEffect(img) {
        img.style.opacity = '0';
        img.style.transition = `opacity ${this.config.fadeDuration}ms ease-in-out`;

        // Force reflow
        img.offsetHeight;

        img.style.opacity = '1';
    }

    /**
     * Handle image error
     */
    handleImageError(img, src) {
        img.classList.add('lazy-error');

        // Create error placeholder
        const errorPlaceholder = `data:image/svg+xml;base64,${btoa(`
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f5f5f5"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="12">
                    Failed to load image
                </text>
            </svg>
        `)}`;

        if (img.dataset.src) {
            img.src = errorPlaceholder;
        } else if (img.dataset.bgSrc) {
            img.style.backgroundImage = `url(${errorPlaceholder})`;
        }
    }

    /**
     * Preload critical images
     */
    preloadCritical(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = this.optimizeImageURL(url);
            document.head.appendChild(link);
        });
    }

    /**
     * Force load all images
     */
    loadAll() {
        document.querySelectorAll('[data-src], [data-bg-src]').forEach(img => {
            this.loadImage(img);
        });
    }

    /**
     * Get loading statistics
     */
    getStats() {
        return {
            loadedImages: this.loadedImages.size,
            pendingImages: document.querySelectorAll('[data-src], [data-bg-src]').length,
            performanceMode: this.performance,
            webpSupported: this.supportsWebP()
        };
    }

    /**
     * Destroy lazy loader
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.loadedImages.clear();

        console.log('🖼️ Lazy Loader destroyed');
    }
}

// Global instance
window.LazyLoader = LazyLoader;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (!window.lazyLoader) {
        window.lazyLoader = new LazyLoader();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}

// ES6 export
export { LazyLoader };
