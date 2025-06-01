/**
 * Photo Gallery Manager
 * Enhanced photo gallery system for the anniversary website
 * Renamed from UnifiedGallery for clarity
 * Version: 2.0.0
 */

class PhotoGalleryManager {
    constructor(options = {}) {
        // Configuration
        this.config = {
            container: options.container || document.querySelector('.photo-gallery'),
            images: options.images || [],
            lightbox: options.lightbox !== false,
            autoSlide: options.autoSlide || false,
            slideInterval: options.slideInterval || 5000,
            showThumbnails: options.showThumbnails !== false,
            showControls: options.showControls !== false,
            enableKeyboard: options.enableKeyboard !== false,
            enableTouch: options.enableTouch !== false,
            enableLazyLoading: options.enableLazyLoading !== false,
            performance: options.performance || 'auto',
            ...options
        };

        // State management
        this.state = {
            currentIndex: 0,
            isLightboxOpen: false,
            isSlideshow: false,
            isLoading: false,
            totalImages: this.config.images.length,
            loadedImages: new Set(),
            performanceMode: this.detectPerformanceMode()
        };

        // UI elements
        this.ui = {
            container: null,
            gallery: null,
            lightbox: null,
            thumbnails: null,
            controls: null,
            prevButton: null,
            nextButton: null,
            closeButton: null,
            counter: null
        };

        // Event handlers
        this.boundHandlers = {
            onImageClick: this.onImageClick.bind(this),
            onThumbnailClick: this.onThumbnailClick.bind(this),
            onPrevClick: this.onPrevClick.bind(this),
            onNextClick: this.onNextClick.bind(this),
            onCloseClick: this.onCloseClick.bind(this),
            onKeyDown: this.onKeyDown.bind(this),
            onTouchStart: this.onTouchStart.bind(this),
            onTouchMove: this.onTouchMove.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this)
        };

        // Touch handling
        this.touch = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            isDragging: false
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize photo gallery manager
     */
    async init() {
        try {
            if (!this.config.container) {
                console.warn('Photo gallery container not found');
                return;
            }

            // Setup UI
            this.setupUI();

            // Setup event listeners
            this.setupEventListeners();

            // Load images
            await this.loadImages();

            // Setup lazy loading
            if (this.config.enableLazyLoading) {
                this.setupLazyLoading();
            }

            // Setup auto slideshow
            if (this.config.autoSlide) {
                this.startSlideshow();
            }

            console.log('📸 Photo Gallery Manager initialized');
        } catch (error) {
            console.error('Failed to initialize photo gallery manager:', error);
        }
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        this.ui.container = this.config.container;
        this.ui.container.classList.add('photo-gallery-manager');

        // Create gallery grid
        this.ui.gallery = this.createGalleryGrid();

        // Create lightbox
        if (this.config.lightbox) {
            this.ui.lightbox = this.createLightbox();
        }

        // Create thumbnails
        if (this.config.showThumbnails) {
            this.ui.thumbnails = this.createThumbnails();
        }

        // Create controls
        if (this.config.showControls) {
            this.ui.controls = this.createControls();
        }
    }

    /**
     * Create gallery grid
     */
    createGalleryGrid() {
        const gallery = document.createElement('div');
        gallery.className = 'gallery-grid';
        
        this.config.images.forEach((image, index) => {
            const item = this.createGalleryItem(image, index);
            gallery.appendChild(item);
        });

        this.ui.container.appendChild(gallery);
        return gallery;
    }

    /**
     * Create gallery item
     */
    createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;

        const img = document.createElement('img');
        img.src = this.config.enableLazyLoading ? '' : image.src;
        img.dataset.src = image.src;
        img.alt = image.alt || `Photo ${index + 1}`;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';

        if (image.title) {
            const title = document.createElement('div');
            title.className = 'gallery-title';
            title.textContent = image.title;
            overlay.appendChild(title);
        }

        item.appendChild(img);
        item.appendChild(overlay);

        // Add click handler
        item.addEventListener('click', () => this.onImageClick(index));

        return item;
    }

    /**
     * Create lightbox
     */
    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.style.display = 'none';

        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <button class="lightbox-prev" aria-label="Previous">&lt;</button>
                <button class="lightbox-next" aria-label="Next">&gt;</button>
                <div class="lightbox-image-container">
                    <img class="lightbox-image" alt="">
                </div>
                <div class="lightbox-info">
                    <div class="lightbox-title"></div>
                    <div class="lightbox-counter"></div>
                </div>
            </div>
        `;

        // Get UI elements
        this.ui.closeButton = lightbox.querySelector('.lightbox-close');
        this.ui.prevButton = lightbox.querySelector('.lightbox-prev');
        this.ui.nextButton = lightbox.querySelector('.lightbox-next');
        this.ui.counter = lightbox.querySelector('.lightbox-counter');

        document.body.appendChild(lightbox);
        return lightbox;
    }

    /**
     * Create thumbnails
     */
    createThumbnails() {
        const thumbnails = document.createElement('div');
        thumbnails.className = 'gallery-thumbnails';

        this.config.images.forEach((image, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail-item';
            thumb.dataset.index = index;

            const img = document.createElement('img');
            img.src = image.thumbnail || image.src;
            img.alt = `Thumbnail ${index + 1}`;

            thumb.appendChild(img);
            thumb.addEventListener('click', () => this.onThumbnailClick(index));

            thumbnails.appendChild(thumb);
        });

        this.ui.container.appendChild(thumbnails);
        return thumbnails;
    }

    /**
     * Create controls
     */
    createControls() {
        const controls = document.createElement('div');
        controls.className = 'gallery-controls';

        controls.innerHTML = `
            <button class="control-btn prev-btn" aria-label="Previous">⬅️</button>
            <button class="control-btn play-btn" aria-label="Play slideshow">▶️</button>
            <button class="control-btn pause-btn" aria-label="Pause slideshow" style="display: none;">⏸️</button>
            <button class="control-btn next-btn" aria-label="Next">➡️</button>
        `;

        this.ui.container.appendChild(controls);
        return controls;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Lightbox controls
        if (this.ui.closeButton) {
            this.ui.closeButton.addEventListener('click', this.boundHandlers.onCloseClick);
        }

        if (this.ui.prevButton) {
            this.ui.prevButton.addEventListener('click', this.boundHandlers.onPrevClick);
        }

        if (this.ui.nextButton) {
            this.ui.nextButton.addEventListener('click', this.boundHandlers.onNextClick);
        }

        // Keyboard navigation
        if (this.config.enableKeyboard) {
            document.addEventListener('keydown', this.boundHandlers.onKeyDown);
        }

        // Touch navigation
        if (this.config.enableTouch && this.ui.lightbox) {
            this.ui.lightbox.addEventListener('touchstart', this.boundHandlers.onTouchStart, { passive: true });
            this.ui.lightbox.addEventListener('touchmove', this.boundHandlers.onTouchMove, { passive: true });
            this.ui.lightbox.addEventListener('touchend', this.boundHandlers.onTouchEnd, { passive: true });
        }

        // Gallery controls
        if (this.ui.controls) {
            const prevBtn = this.ui.controls.querySelector('.prev-btn');
            const nextBtn = this.ui.controls.querySelector('.next-btn');
            const playBtn = this.ui.controls.querySelector('.play-btn');
            const pauseBtn = this.ui.controls.querySelector('.pause-btn');

            if (prevBtn) prevBtn.addEventListener('click', () => this.previousImage());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextImage());
            if (playBtn) playBtn.addEventListener('click', () => this.startSlideshow());
            if (pauseBtn) pauseBtn.addEventListener('click', () => this.stopSlideshow());
        }
    }

    /**
     * Load images
     */
    async loadImages() {
        this.state.isLoading = true;

        // Load images based on performance mode
        const loadPromises = this.config.images.map((image, index) => {
            return this.loadImage(image, index);
        });

        try {
            await Promise.all(loadPromises);
            console.log('📸 All images loaded');
        } catch (error) {
            console.warn('Some images failed to load:', error);
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Load single image
     */
    loadImage(imageData, index) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.state.loadedImages.add(index);
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`Failed to load image: ${imageData.src}`);
                reject(new Error(`Failed to load image: ${imageData.src}`));
            };
            
            img.src = imageData.src;
        });
    }

    /**
     * Event handlers
     */
    onImageClick(index) {
        if (this.config.lightbox) {
            this.openLightbox(index);
        }
    }

    onThumbnailClick(index) {
        this.goToImage(index);
    }

    onPrevClick() {
        this.previousImage();
    }

    onNextClick() {
        this.nextImage();
    }

    onCloseClick() {
        this.closeLightbox();
    }

    onKeyDown(event) {
        if (!this.state.isLightboxOpen) return;

        switch (event.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }

    /**
     * Navigation methods
     */
    goToImage(index) {
        if (index >= 0 && index < this.state.totalImages) {
            this.state.currentIndex = index;
            this.updateDisplay();
        }
    }

    nextImage() {
        const nextIndex = (this.state.currentIndex + 1) % this.state.totalImages;
        this.goToImage(nextIndex);
    }

    previousImage() {
        const prevIndex = (this.state.currentIndex - 1 + this.state.totalImages) % this.state.totalImages;
        this.goToImage(prevIndex);
    }

    /**
     * Lightbox methods
     */
    openLightbox(index) {
        this.state.isLightboxOpen = true;
        this.state.currentIndex = index;
        
        if (this.ui.lightbox) {
            this.ui.lightbox.style.display = 'flex';
            this.updateLightboxImage();
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        this.state.isLightboxOpen = false;
        
        if (this.ui.lightbox) {
            this.ui.lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    updateLightboxImage() {
        if (!this.ui.lightbox) return;

        const currentImage = this.config.images[this.state.currentIndex];
        const lightboxImg = this.ui.lightbox.querySelector('.lightbox-image');
        const titleEl = this.ui.lightbox.querySelector('.lightbox-title');

        if (lightboxImg) {
            lightboxImg.src = currentImage.src;
            lightboxImg.alt = currentImage.alt || `Photo ${this.state.currentIndex + 1}`;
        }

        if (titleEl) {
            titleEl.textContent = currentImage.title || '';
        }

        if (this.ui.counter) {
            this.ui.counter.textContent = `${this.state.currentIndex + 1} / ${this.state.totalImages}`;
        }
    }

    /**
     * Slideshow methods
     */
    startSlideshow() {
        this.state.isSlideshow = true;
        this.slideshowInterval = setInterval(() => {
            this.nextImage();
        }, this.config.slideInterval);

        // Update controls
        if (this.ui.controls) {
            const playBtn = this.ui.controls.querySelector('.play-btn');
            const pauseBtn = this.ui.controls.querySelector('.pause-btn');
            if (playBtn) playBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'block';
        }
    }

    stopSlideshow() {
        this.state.isSlideshow = false;
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }

        // Update controls
        if (this.ui.controls) {
            const playBtn = this.ui.controls.querySelector('.play-btn');
            const pauseBtn = this.ui.controls.querySelector('.pause-btn');
            if (playBtn) playBtn.style.display = 'block';
            if (pauseBtn) pauseBtn.style.display = 'none';
        }
    }

    /**
     * Update display
     */
    updateDisplay() {
        // Update thumbnails
        if (this.ui.thumbnails) {
            const thumbnails = this.ui.thumbnails.querySelectorAll('.thumbnail-item');
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === this.state.currentIndex);
            });
        }

        // Update lightbox if open
        if (this.state.isLightboxOpen) {
            this.updateLightboxImage();
        }
    }

    /**
     * Utility methods
     */
    detectPerformanceMode() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isLowEnd = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        return isLowEnd || isLowMemory ? 'low' : 'high';
    }

    /**
     * Destroy photo gallery manager
     */
    destroy() {
        // Stop slideshow
        this.stopSlideshow();

        // Remove event listeners
        document.removeEventListener('keydown', this.boundHandlers.onKeyDown);

        // Remove lightbox
        if (this.ui.lightbox && this.ui.lightbox.parentNode) {
            this.ui.lightbox.parentNode.removeChild(this.ui.lightbox);
        }

        console.log('📸 Photo Gallery Manager destroyed');
    }
}

// Export for module systems
export { PhotoGalleryManager };

// Legacy export for backward compatibility
export { PhotoGalleryManager as UnifiedGallery };
