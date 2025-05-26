/**
 * Photo Gallery Page Specific Logic
 * Handles page-specific functionality for the photo gallery
 * Version: 2.0.0
 */

class PhotoGalleryPage {
    constructor() {
        this.config = {
            enableLightbox: true,
            enableSlideshow: true,
            enableFiltering: true,
            autoplaySlideshow: false,
            transitionSpeed: 500
        };

        this.state = {
            initialized: false,
            currentFilter: 'all',
            lightboxOpen: false,
            slideshowActive: false
        };

        this.init();
    }

    /**
     * Initialize photo gallery page
     */
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => 
                    document.addEventListener('DOMContentLoaded', resolve, { once: true })
                );
            }

            // Initialize components
            await this.initializeComponents();
            
            // Setup page-specific interactions
            this.setupInteractions();
            
            // Initialize lazy loading
            this.initializeLazyLoading();

            this.state.initialized = true;
            console.log('📸 Photo Gallery page initialized');

        } catch (error) {
            console.error('Failed to initialize photo gallery page:', error);
        }
    }

    /**
     * Initialize page components
     */
    async initializeComponents() {
        // Initialize photo filters
        if (this.config.enableFiltering) {
            this.initializeFilters();
        }

        // Initialize lightbox
        if (this.config.enableLightbox) {
            this.initializeLightbox();
        }

        // Initialize slideshow controls
        if (this.config.enableSlideshow) {
            this.initializeSlideshow();
        }

        // Initialize memory lane controller if present
        this.initializeMemoryLane();
    }

    /**
     * Initialize photo filters
     */
    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn, .gallery-filter');
        const photos = document.querySelectorAll('.gallery-photo, .photo-item');

        if (filterButtons.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter || 'all';
                this.applyFilter(filter, photos);
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.state.currentFilter = filter;
            });
        });
    }

    /**
     * Apply photo filter
     */
    applyFilter(filter, photos) {
        photos.forEach(photo => {
            const categories = photo.dataset.categories || '';
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                photo.style.display = 'block';
                photo.style.opacity = '0';
                photo.style.transform = 'scale(0.8)';
                
                // Animate in
                setTimeout(() => {
                    photo.style.opacity = '1';
                    photo.style.transform = 'scale(1)';
                }, 100);
            } else {
                photo.style.opacity = '0';
                photo.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    photo.style.display = 'none';
                }, 300);
            }
        });
    }

    /**
     * Initialize lightbox
     */
    initializeLightbox() {
        const photos = document.querySelectorAll('.gallery-photo, .photo-item, .lightbox-trigger');
        
        photos.forEach(photo => {
            photo.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(photo);
            });
        });

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (this.state.lightboxOpen) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.lightboxPrevious();
                        break;
                    case 'ArrowRight':
                        this.lightboxNext();
                        break;
                }
            }
        });
    }

    /**
     * Open lightbox
     */
    openLightbox(photo) {
        const src = photo.src || photo.dataset.src || photo.href;
        const caption = photo.alt || photo.dataset.caption || '';
        const index = Array.from(document.querySelectorAll('.gallery-photo, .photo-item')).indexOf(photo);

        this.createLightbox(src, caption, index);
        this.state.lightboxOpen = true;
    }

    /**
     * Create lightbox element
     */
    createLightbox(src, caption, index) {
        // Remove existing lightbox
        const existing = document.querySelector('.photo-lightbox');
        if (existing) existing.remove();

        const lightbox = document.createElement('div');
        lightbox.className = 'photo-lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        lightbox.innerHTML = `
            <div class="lightbox-content" style="position: relative; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center;">
                <img src="${src}" alt="${caption}" style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                ${caption ? `<p style="color: white; margin-top: 20px; text-align: center; font-size: 16px; max-width: 600px;">${caption}</p>` : ''}
                <button class="lightbox-close" style="position: absolute; top: -40px; right: 0; background: none; border: none; color: white; font-size: 30px; cursor: pointer; padding: 10px;">&times;</button>
                <button class="lightbox-prev" style="position: absolute; left: -60px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; padding: 15px 20px; border-radius: 50%;">&#8249;</button>
                <button class="lightbox-next" style="position: absolute; right: -60px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; padding: 15px 20px; border-radius: 50%;">&#8250;</button>
            </div>
        `;

        document.body.appendChild(lightbox);

        // Store current index
        lightbox.dataset.currentIndex = index;

        // Show lightbox
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);

        // Event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.lightboxPrevious());
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.lightboxNext());
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        // Disable body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close lightbox
     */
    closeLightbox() {
        const lightbox = document.querySelector('.photo-lightbox');
        if (!lightbox) return;

        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);

        this.state.lightboxOpen = false;
    }

    /**
     * Navigate to previous photo in lightbox
     */
    lightboxPrevious() {
        const lightbox = document.querySelector('.photo-lightbox');
        if (!lightbox) return;

        const photos = document.querySelectorAll('.gallery-photo, .photo-item');
        const currentIndex = parseInt(lightbox.dataset.currentIndex);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
        const prevPhoto = photos[prevIndex];

        if (prevPhoto) {
            const src = prevPhoto.src || prevPhoto.dataset.src;
            const caption = prevPhoto.alt || prevPhoto.dataset.caption || '';
            
            this.updateLightboxContent(src, caption, prevIndex);
        }
    }

    /**
     * Navigate to next photo in lightbox
     */
    lightboxNext() {
        const lightbox = document.querySelector('.photo-lightbox');
        if (!lightbox) return;

        const photos = document.querySelectorAll('.gallery-photo, .photo-item');
        const currentIndex = parseInt(lightbox.dataset.currentIndex);
        const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
        const nextPhoto = photos[nextIndex];

        if (nextPhoto) {
            const src = nextPhoto.src || nextPhoto.dataset.src;
            const caption = nextPhoto.alt || nextPhoto.dataset.caption || '';
            
            this.updateLightboxContent(src, caption, nextIndex);
        }
    }

    /**
     * Update lightbox content
     */
    updateLightboxContent(src, caption, index) {
        const lightbox = document.querySelector('.photo-lightbox');
        const img = lightbox.querySelector('img');
        const captionEl = lightbox.querySelector('p');

        // Fade out
        img.style.opacity = '0';
        
        setTimeout(() => {
            img.src = src;
            img.alt = caption;
            
            if (captionEl) {
                captionEl.textContent = caption;
            }
            
            lightbox.dataset.currentIndex = index;
            
            // Fade in
            img.style.opacity = '1';
        }, 150);
    }

    /**
     * Initialize slideshow
     */
    initializeSlideshow() {
        const slideshowBtn = document.querySelector('.slideshow-btn, .play-slideshow');
        if (!slideshowBtn) return;

        slideshowBtn.addEventListener('click', () => {
            this.toggleSlideshow();
        });
    }

    /**
     * Toggle slideshow
     */
    toggleSlideshow() {
        if (this.state.slideshowActive) {
            this.stopSlideshow();
        } else {
            this.startSlideshow();
        }
    }

    /**
     * Start slideshow
     */
    startSlideshow() {
        const photos = document.querySelectorAll('.gallery-photo, .photo-item');
        if (photos.length === 0) return;

        this.state.slideshowActive = true;
        let currentIndex = 0;

        // Open first photo in lightbox
        this.openLightbox(photos[0]);

        // Auto-advance every 3 seconds
        this.slideshowInterval = setInterval(() => {
            if (!this.state.lightboxOpen) {
                this.stopSlideshow();
                return;
            }

            currentIndex = (currentIndex + 1) % photos.length;
            const nextPhoto = photos[currentIndex];
            const src = nextPhoto.src || nextPhoto.dataset.src;
            const caption = nextPhoto.alt || nextPhoto.dataset.caption || '';
            
            this.updateLightboxContent(src, caption, currentIndex);
        }, 3000);

        // Update button text
        const slideshowBtn = document.querySelector('.slideshow-btn, .play-slideshow');
        if (slideshowBtn) {
            slideshowBtn.textContent = 'Stop Slideshow';
        }
    }

    /**
     * Stop slideshow
     */
    stopSlideshow() {
        this.state.slideshowActive = false;
        
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }

        // Update button text
        const slideshowBtn = document.querySelector('.slideshow-btn, .play-slideshow');
        if (slideshowBtn) {
            slideshowBtn.textContent = 'Start Slideshow';
        }
    }

    /**
     * Initialize memory lane controller (if present)
     */
    initializeMemoryLane() {
        const memoryLane = document.querySelector('#memory-lane-controller, .memory-lane');
        if (!memoryLane) return;

        // Setup memory lane specific interactions
        const playBtn = memoryLane.querySelector('.memory-play');
        const pauseBtn = memoryLane.querySelector('.memory-pause');
        const timeline = memoryLane.querySelector('.memory-timeline');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.startMemoryLane());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseMemoryLane());
        }

        if (timeline) {
            timeline.addEventListener('input', (e) => {
                this.seekMemoryLane(e.target.value);
            });
        }
    }

    /**
     * Start memory lane experience
     */
    startMemoryLane() {
        console.log('🎬 Starting Memory Lane experience');
        // Implementation depends on specific memory lane features
    }

    /**
     * Initialize lazy loading for photos
     */
    initializeLazyLoading() {
        if (window.lazyLoader) {
            // Lazy loader already initialized globally
            return;
        }

        const photos = document.querySelectorAll('img[data-src], .gallery-photo[data-src]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px'
        });

        photos.forEach(photo => {
            observer.observe(photo);
        });
    }

    /**
     * Setup page interactions
     */
    setupInteractions() {
        // Photo hover effects
        const photos = document.querySelectorAll('.gallery-photo, .photo-item');
        photos.forEach(photo => {
            photo.addEventListener('mouseenter', () => {
                photo.style.transform = 'scale(1.05)';
                photo.style.filter = 'brightness(1.1)';
                photo.style.transition = 'transform 0.3s ease, filter 0.3s ease';
            });

            photo.addEventListener('mouseleave', () => {
                photo.style.transform = 'scale(1)';
                photo.style.filter = 'brightness(1)';
            });
        });

        // Touch gestures for mobile
        if ('ontouchstart' in window) {
            this.setupTouchGestures();
        }
    }

    /**
     * Setup touch gestures for mobile
     */
    setupTouchGestures() {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            if (this.state.lightboxOpen) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!this.state.lightboxOpen) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.lightboxPrevious();
                } else {
                    this.lightboxNext();
                }
            }

            // Vertical swipe down to close
            if (deltaY > 100) {
                this.closeLightbox();
            }
        }, { passive: true });
    }

    /**
     * Cleanup page resources
     */
    cleanup() {
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
        }

        this.closeLightbox();
        
        console.log('📸 Photo Gallery page cleanup completed');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.photoGalleryPage = new PhotoGalleryPage();
    });
} else {
    window.photoGalleryPage = new PhotoGalleryPage();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoGalleryPage;
}
