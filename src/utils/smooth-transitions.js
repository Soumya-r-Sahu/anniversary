// Universal Smooth Transitions for Anniversary Website
// This script enhances all pages with smooth transitions and animations

class SmoothTransitions {
    constructor() {
        this.init();
    }

    init() {
        this.setupPageTransitions();
        this.setupIntersectionObserver();
        this.setupLinkTransitions();
        this.setupImageLoading();
        this.enhanceExistingElements();
        
        // Initialize page entrance animation
        this.animatePageEntrance();
    }

    setupPageTransitions() {
        // Add page loading class initially
        document.body.classList.add('page-loading');
        
        // Remove loading class when page is ready
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.remove('page-loading');
                document.body.classList.add('page-enter');
            }, 100);
        });

        // Handle page exit transitions for internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.performPageTransition(link.href);
            }
        });
    }

    isInternalLink(href) {
        const link = new URL(href, window.location.origin);
        return link.origin === window.location.origin && 
               link.pathname !== window.location.pathname &&
               href.includes('.html');
    }

    performPageTransition(href) {
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
            window.location.href = href;
        }, 400);
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements that should animate in
        const animatedElements = document.querySelectorAll(
            '.section-fade-in, .stagger-animation, .timeline-item, .gallery-item, .memory-card'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupLinkTransitions() {
        const links = document.querySelectorAll('a:not(.no-transition)');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                if (!e.target.classList.contains('ripple-button')) {
                    e.target.style.transform = 'translateY(-1px)';
                }
            });
            
            link.addEventListener('mouseleave', (e) => {
                if (!e.target.classList.contains('ripple-button')) {
                    e.target.style.transform = 'translateY(0)';
                }
            });
        });
    }

    setupImageLoading() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.classList.add('smooth-image');
            
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

    enhanceExistingElements() {
        // Add transition classes to existing elements
        this.enhanceCards();
        this.enhanceButtons();
        this.enhanceTimelineItems();
        this.enhanceGalleryItems();
        this.enhanceMemoryCards();
    }

    enhanceCards() {
        const cards = document.querySelectorAll('.card, .timeline-content, .memory-card, .love-letter');
        cards.forEach(card => {
            if (!card.classList.contains('card-transition')) {
                card.classList.add('card-transition');
            }
        });
    }

    enhanceButtons() {
        const buttons = document.querySelectorAll('button, .btn, .enhanced-button');
        buttons.forEach(button => {
            if (!button.classList.contains('ripple-button')) {
                button.classList.add('ripple-button');
            }
        });
    }

    enhanceTimelineItems() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.classList.add('smooth-timeline');
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    enhanceGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-slide, .photo-card, .filter-btn');
        galleryItems.forEach((item, index) => {
            item.classList.add('gallery-item');
            item.style.transitionDelay = `${index * 0.05}s`;
        });
    }

    enhanceMemoryCards() {
        const memoryCards = document.querySelectorAll('.memory-card, .anniversary-memory');
        memoryCards.forEach(card => {
            card.classList.add('memory-card');
            
            // Add floating animation to special elements
            if (card.querySelector('.icon, .emoji')) {
                card.querySelector('.icon, .emoji').classList.add('float-animation');
            }
        });
    }

    animatePageEntrance() {
        // Stagger animation for main sections
        const sections = document.querySelectorAll('section, .hero, .main-content, header');
        sections.forEach((section, index) => {
            section.classList.add('section-fade-in');
            section.style.transitionDelay = `${index * 0.1}s`;
        });

        // Add stagger animation to navigation items
        const navItems = document.querySelectorAll('nav a, .nav-link');
        navItems.forEach((item, index) => {
            item.classList.add('stagger-animation');
            item.style.transitionDelay = `${index * 0.05}s`;
        });
    }

    // Method to add smooth scrolling to anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }    // Method to enhance countdown specific animations
    enhanceCountdown() {
        const countdownElements = document.querySelectorAll('.countdown-number, .countdown-container, .countdown-item');
        countdownElements.forEach(el => {
            el.classList.add('card-transition');
        });

        // Add enhanced animations to countdown boxes
        const countdownItems = document.querySelectorAll('.countdown-item');
        countdownItems.forEach((item, index) => {
            item.classList.add('stagger-animation');
            item.style.transitionDelay = `${index * 0.1}s`;
        });

        // Add background transition to countdown section
        const countdownSection = document.querySelector('.countdown-section, .countdown-wrapper');
        if (countdownSection) {
            countdownSection.classList.add('bg-transition');
        }
    }

    // Method to enhance photo gallery specific animations
    enhancePhotoGallery() {
        const photoCards = document.querySelectorAll('.photo-card, .quantum-photo-card');
        photoCards.forEach(card => {
            card.classList.add('photo-item');
        });

        const filterButtons = document.querySelectorAll('.filter-btn, .cosmic-filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.add('ripple-button');
        });
    }

    // Method to enhance anniversary page specific animations
    enhanceAnniversary() {
        const memoryCards = document.querySelectorAll('.memory-card, .anniversary-memory');
        memoryCards.forEach(card => {
            card.classList.add('memory-card', 'card-transition');
        });

        const floatingImages = document.querySelectorAll('.floating-image');
        floatingImages.forEach(img => {
            img.classList.add('float-animation');
        });
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmoothTransitions();
});

// Enhanced performance monitoring
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        const transitions = new SmoothTransitions();
        transitions.setupSmoothScrolling();
        
        // Page-specific enhancements
        const pageType = document.documentElement.getAttribute('data-page-type');
        switch(pageType) {
            case 'countdown':
                transitions.enhanceCountdown();
                break;
            case 'photo-gallery':
                transitions.enhancePhotoGallery();
                break;
            case 'anniversary':
                transitions.enhanceAnniversary();
                break;
        }
    });
}
