/**
 * Anniversary Page Specific Logic
 * Handles page-specific functionality for the anniversary celebration page
 * Version: 2.0.0
 */

class AnniversaryPage {
    constructor() {
        this.config = {
            enableTimeline: true,
            enableMemories: true,
            enableAnimations: true,
            autoplayMemories: false
        };

        this.state = {
            initialized: false,
            currentMemory: 0,
            timelineVisible: false
        };

        this.init();
    }

    /**
     * Initialize anniversary page
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
            
            // Initialize animations
            if (this.config.enableAnimations) {
                this.initializeAnimations();
            }

            this.state.initialized = true;
            console.log('💕 Anniversary page initialized');

        } catch (error) {
            console.error('Failed to initialize anniversary page:', error);
        }
    }

    /**
     * Initialize page components
     */
    async initializeComponents() {
        // Initialize timeline if present
        if (this.config.enableTimeline) {
            this.initializeTimeline();
        }

        // Initialize memory carousel if present
        if (this.config.enableMemories) {
            this.initializeMemories();
        }

        // Initialize love meter
        this.initializeLoveMeter();

        // Initialize celebration effects
        this.initializeCelebrationEffects();
    }

    /**
     * Initialize relationship timeline
     */
    initializeTimeline() {
        const timeline = document.querySelector('.timeline, #timeline');
        if (!timeline) return;

        const timelineItems = timeline.querySelectorAll('.timeline-item, .milestone');
        
        // Setup intersection observer for timeline animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animateTimelineItem(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '50px'
        });

        timelineItems.forEach(item => {
            observer.observe(item);
            
            // Add click interaction
            item.addEventListener('click', () => {
                this.showTimelineDetail(item);
            });
        });
    }

    /**
     * Animate timeline item
     */
    animateTimelineItem(item) {
        const icon = item.querySelector('.timeline-icon, .milestone-icon');
        const content = item.querySelector('.timeline-content, .milestone-content');
        
        if (icon) {
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 300);
        }

        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
        }

        // Trigger heart burst at timeline item position
        const rect = item.getBoundingClientRect();
        this.triggerHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    /**
     * Show timeline detail modal
     */
    showTimelineDetail(item) {
        const title = item.querySelector('.timeline-title, .milestone-title')?.textContent || 'Memory';
        const date = item.querySelector('.timeline-date, .milestone-date')?.textContent || '';
        const description = item.querySelector('.timeline-description, .milestone-description')?.textContent || '';
        const image = item.querySelector('img')?.src || '';

        this.createModal({
            title,
            date,
            description,
            image
        });
    }

    /**
     * Initialize memories/photos carousel
     */
    initializeMemories() {
        const memoriesContainer = document.querySelector('.memories, .photo-memories, #memories');
        if (!memoriesContainer) return;

        const photos = memoriesContainer.querySelectorAll('.memory-photo, .photo-item');
        if (photos.length === 0) return;

        // Setup photo interactions
        photos.forEach((photo, index) => {
            photo.addEventListener('click', () => {
                this.showPhotoDetail(photo, index);
            });

            // Add hover effects
            photo.addEventListener('mouseenter', () => {
                photo.style.transform = 'scale(1.05)';
                photo.style.filter = 'brightness(1.1)';
            });

            photo.addEventListener('mouseleave', () => {
                photo.style.transform = 'scale(1)';
                photo.style.filter = 'brightness(1)';
            });
        });

        // Auto-play memories if enabled
        if (this.config.autoplayMemories) {
            this.startMemorySlideshow(photos);
        }
    }

    /**
     * Show photo detail
     */
    showPhotoDetail(photo, index) {
        const src = photo.src || photo.dataset.src;
        const caption = photo.alt || photo.dataset.caption || '';
        const date = photo.dataset.date || '';

        this.createPhotoModal({
            src,
            caption,
            date,
            index
        });
    }

    /**
     * Start memory slideshow
     */
    startMemorySlideshow(photos) {
        let currentIndex = 0;
        
        setInterval(() => {
            // Remove active class from all
            photos.forEach(photo => photo.classList.remove('active'));
            
            // Add active class to current
            photos[currentIndex].classList.add('active');
            
            // Move to next
            currentIndex = (currentIndex + 1) % photos.length;
        }, 3000);
    }

    /**
     * Initialize love meter
     */
    initializeLoveMeter() {
        const loveMeter = document.querySelector('.love-meter, #love-meter');
        if (!loveMeter) return;

        const level = parseInt(loveMeter.dataset.level) || 100;
        this.animateLoveMeter(loveMeter, level);

        // Interactive love meter
        loveMeter.addEventListener('click', () => {
            this.increaseLoveLevel(loveMeter);
        });
    }

    /**
     * Animate love meter
     */
    animateLoveMeter(meter, targetLevel) {
        const fill = meter.querySelector('.love-fill, .meter-fill');
        const text = meter.querySelector('.love-text, .meter-text');
        
        if (!fill) return;

        let currentLevel = 0;
        const increment = targetLevel / 50; // 50 steps
        
        const timer = setInterval(() => {
            currentLevel += increment;
            
            if (currentLevel >= targetLevel) {
                currentLevel = targetLevel;
                clearInterval(timer);
            }
            
            fill.style.width = currentLevel + '%';
            if (text) {
                text.textContent = Math.round(currentLevel) + '%';
            }
            
            // Change color based on level
            if (currentLevel >= 80) {
                fill.style.background = 'linear-gradient(45deg, #ff6b9d, #ff8cc8)';
            } else if (currentLevel >= 50) {
                fill.style.background = 'linear-gradient(45deg, #ffa8cc, #ffb3d6)';
            } else {
                fill.style.background = 'linear-gradient(45deg, #ffcce0, #ffe0ec)';
            }
        }, 50);
    }

    /**
     * Increase love level
     */
    increaseLoveLevel(meter) {
        const currentLevel = parseInt(meter.dataset.level) || 100;
        const newLevel = Math.min(currentLevel + 5, 100);
        
        meter.dataset.level = newLevel;
        this.animateLoveMeter(meter, newLevel);
        
        // Trigger celebration effect
        this.triggerCelebrationEffect();
    }

    /**
     * Initialize celebration effects
     */
    initializeCelebrationEffects() {
        // Setup celebration triggers
        const celebrationTriggers = document.querySelectorAll('.celebrate-btn, .celebration-trigger');
        
        celebrationTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.triggerCelebrationEffect();
            });
        });
    }

    /**
     * Trigger celebration effect
     */
    triggerCelebrationEffect() {
        // Heart burst at center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.triggerHeartBurst(centerX, centerY);
        
        // Multiple bursts
        setTimeout(() => this.triggerHeartBurst(centerX - 100, centerY - 50), 200);
        setTimeout(() => this.triggerHeartBurst(centerX + 100, centerY - 50), 400);
        setTimeout(() => this.triggerHeartBurst(centerX, centerY + 100), 600);
        
        // Flash effect
        this.triggerFlashEffect();
    }

    /**
     * Trigger heart burst effect
     */
    triggerHeartBurst(x, y) {
        if (window.BackgroundComponents?.triggerHeartBurst) {
            window.BackgroundComponents.triggerHeartBurst(x, y);
        }
    }

    /**
     * Trigger flash effect
     */
    triggerFlashEffect() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,182,193,0.8) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(flash);
        
        // Trigger flash
        setTimeout(() => {
            flash.style.opacity = '1';
        }, 10);
        
        // Fade out
        setTimeout(() => {
            flash.style.opacity = '0';
        }, 300);
        
        // Remove element
        setTimeout(() => {
            flash.remove();
        }, 600);
    }

    /**
     * Create modal
     */
    createModal({ title, date, description, image }) {
        const modal = document.createElement('div');
        modal.className = 'memory-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            max-height: 70vh;
            overflow-y: auto;
            position: relative;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        content.innerHTML = `
            <button class="modal-close" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            ${image ? `<img src="${image}" alt="${title}" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">` : ''}
            <h3 style="margin: 0 0 10px 0; color: #d63384;">${title}</h3>
            ${date ? `<p style="color: #666; margin: 0 0 15px 0; font-style: italic;">${date}</p>` : ''}
            <p style="line-height: 1.6; color: #333;">${description}</p>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Show modal
        setTimeout(() => {
            modal.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 10);

        // Close modal
        const closeModal = () => {
            modal.style.opacity = '0';
            content.style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        };

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        content.querySelector('.modal-close').addEventListener('click', closeModal);
    }

    /**
     * Create photo modal
     */
    createPhotoModal({ src, caption, date, index }) {
        // Similar to createModal but optimized for photos
        this.createModal({
            title: caption || `Memory ${index + 1}`,
            date,
            description: caption || 'A beautiful memory from our journey together ❤️',
            image: src
        });
    }

    /**
     * Initialize page animations
     */
    initializeAnimations() {
        // Animate main sections
        const sections = document.querySelectorAll('section, .section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    }

    /**
     * Setup page interactions
     */
    setupInteractions() {
        // Love button interactions
        const loveButtons = document.querySelectorAll('.love-btn, .heart-btn');
        loveButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.triggerHeartBurst(e.clientX, e.clientY);
            });
        });
    }

    /**
     * Cleanup page resources
     */
    cleanup() {
        console.log('💕 Anniversary page cleanup completed');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.anniversaryPage = new AnniversaryPage();
    });
} else {
    window.anniversaryPage = new AnniversaryPage();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnniversaryPage;
}
