/**
 * Integration Script for Anniversary Website Optimization
 * This script integrates the new unified components with existing HTML files
 */

import { UnifiedMusicManager } from './core/UnifiedMusicManager.js';
import { UnifiedHeartAnimation } from './components/UnifiedHeartAnimation.js';
import { UnifiedGallery } from './components/UnifiedGallery.js';
import { UnifiedParticleSystem } from './components/UnifiedParticleSystem.js';
import { UnifiedStorageManager } from './core/UnifiedStorageManager.js';
import { UnifiedPerformanceMonitor } from './core/UnifiedPerformanceMonitor.js';
import { BackgroundComponents } from './components/BackgroundComponents.js';
import { PerformanceUtils } from './utils/performance.js';
import { LazyLoader } from './utils/lazyLoader.js';

class AnniversaryWebsiteIntegrator {
    constructor() {
        this.components = new Map();
        this.performanceMonitor = null;
        this.lazyLoader = null;
        this.initialized = false;

        console.log('🎉 Anniversary Website Integrator loaded');
    }

    async init() {
        if (this.initialized) return;

        try {
            console.log('🚀 Initializing Anniversary Website Integration...');

            // Start performance monitoring
            this.performanceMonitor = new UnifiedPerformanceMonitor();
            await this.performanceMonitor.init();

            // Initialize lazy loading
            this.lazyLoader = new LazyLoader({
                rootMargin: '50px',
                enableWebP: true,
                enablePlaceholder: true
            });

            // Initialize background components
            await this.initializeBackgroundComponents();

            // Initialize page-specific components
            await this.initializePageComponents();

            // Setup global event listeners
            this.setupGlobalListeners();

            // Setup theme and accessibility
            this.setupThemeSystem();

            // Initialize navigation enhancements
            this.enhanceNavigation();

            // Setup performance optimizations
            this.optimizePerformance();

            this.initialized = true;
            console.log('✅ Anniversary Website Integration complete!');

            // Dispatch ready event
            document.dispatchEvent(new CustomEvent('anniversaryWebsiteReady', {
                detail: { components: this.components }
            }));

        } catch (error) {
            console.error('❌ Integration failed:', error);
            this.handleError(error);
        }
    }

    async initializeBackgroundComponents() {
        // Initialize unified background system
        const backgroundComponents = new BackgroundComponents({
            pageType: document.body.dataset.pageType || 'general',
            enableMusic: true,
            enableHearts: true,
            enableParticles: true
        });

        await backgroundComponents.init();
        this.components.set('background', backgroundComponents);

        console.log('🎭 Background components initialized');
    }

    async initializePageComponents() {
        const pageType = document.body.dataset.pageType;

        console.log(`📄 Initializing components for page type: ${pageType}`);

        switch (pageType) {
            case 'index':
                await this.initializeIndexPage();
                break;
            case 'anniversary':
                await this.initializeAnniversaryPage();
                break;
            case 'photo-gallery':
                await this.initializeGalleryPage();
                break;
            case 'countdown':
                await this.initializeCountdownPage();
                break;
            case 'love-story':
                await this.initializeLoveStoryPage();
                break;
            default:
                await this.initializeGeneralPage();
        }
    }

    async initializeIndexPage() {
        // Enhanced typewriter effect
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            this.enhanceTypewriter(element);
        });

        // Hero section enhancements
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            this.enhanceHeroSection(heroSection);
        }

        // Statistics counter
        const statsElements = document.querySelectorAll('.stat-number');
        if (statsElements.length > 0) {
            this.initializeCounters(statsElements);
        }
    }

    async initializeAnniversaryPage() {
        // Timeline enhancements
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            this.enhanceTimeline(timeline);
        }

        // Memory carousel
        const carousel = document.querySelector('.memory-carousel');
        if (carousel) {
            await this.initializeCarousel(carousel);
        }

        // Love meter
        const loveMeter = document.querySelector('.love-meter');
        if (loveMeter) {
            this.initializeLoveMeter(loveMeter);
        }
    }

    async initializeGalleryPage() {
        // Enhanced gallery with unified gallery component
        const galleryContainer = document.querySelector('.photo-gallery');
        if (galleryContainer) {
            const images = Array.from(galleryContainer.querySelectorAll('img')).map(img => ({
                src: img.src || img.dataset.src,
                alt: img.alt,
                title: img.title,
                description: img.dataset.description
            }));

            const gallery = new UnifiedGallery({
                container: galleryContainer,
                images: images,
                lightbox: true,
                autoSlide: false,
                showThumbnails: true
            });

            await gallery.init();
            this.components.set('gallery', gallery);
        }

        // Filter functionality
        this.initializeGalleryFilters();
    }

    async initializeCountdownPage() {
        // Enhanced countdown with animations
        const countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            this.enhanceCountdown(countdownContainer);
        }

        // Milestone celebrations
        this.initializeMilestoneCelebrations();
    }

    async initializeLoveStoryPage() {
        // Story timeline
        const storyTimeline = document.querySelector('.story-timeline');
        if (storyTimeline) {
            this.enhanceStoryTimeline(storyTimeline);
        }

        // Reading progress indicator
        this.initializeReadingProgress();
    }

    async initializeGeneralPage() {
        // Basic enhancements for any page
        this.initializeBasicAnimations();
        this.initializeScrollEffects();
    }

    enhanceTypewriter(element) {
        const text = element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;

        element.textContent = '';
        element.style.borderRight = '2px solid #ff6b9d';

        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRightColor =
                        element.style.borderRightColor === 'transparent' ? '#ff6b9d' : 'transparent';
                }, 500);
            }
        }, speed);
    }

    enhanceHeroSection(heroSection) {
        // Parallax effect
        const parallaxElements = heroSection.querySelectorAll('[data-parallax]');

        if (parallaxElements.length > 0) {
            const updateParallax = () => {
                const scrollY = window.pageYOffset;

                parallaxElements.forEach(element => {
                    const speed = parseFloat(element.dataset.parallax);
                    const yPos = -(scrollY * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
            };

            window.addEventListener('scroll', this.throttle(updateParallax, 16));
        }

        // Floating hearts
        const heartsContainer = heroSection.querySelector('.floating-hearts');
        if (heartsContainer) {
            const heartAnimation = new UnifiedHeartAnimation({
                container: heartsContainer,
                pattern: 'floating',
                intensity: 'medium'
            });
            heartAnimation.init();
            this.components.set('heroHearts', heartAnimation);
        }
    }

    initializeCounters(elements) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        elements.forEach(element => observer.observe(element));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target) || parseInt(element.textContent);
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.floor(start + (target - start) * this.easeOutQuart(progress));
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    enhanceTimeline(timeline) {
        const timelineItems = timeline.querySelectorAll('.timeline-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Trigger heart burst
                    const heartsContainer = entry.target.querySelector('.timeline-hearts');
                    if (heartsContainer) {
                        const heartAnimation = new UnifiedHeartAnimation({
                            container: heartsContainer,
                            pattern: 'burst',
                            intensity: 'low'
                        });
                        heartAnimation.init();
                        heartAnimation.burst(5);
                    }
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => observer.observe(item));
    }

    async initializeCarousel(carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        const autoSlideInterval = 5000;

        // Add navigation
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const indicators = carousel.querySelector('.carousel-indicators');

        const showSlide = (index) => {
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });

            if (indicators) {
                const dots = indicators.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }

            currentIndex = index;
        };

        const nextSlide = () => {
            const next = (currentIndex + 1) % items.length;
            showSlide(next);
        };

        const prevSlide = () => {
            const prev = (currentIndex - 1 + items.length) % items.length;
            showSlide(prev);
        };

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto-slide
        setInterval(nextSlide, autoSlideInterval);

        // Touch support
        this.addTouchSupport(carousel, { prev: prevSlide, next: nextSlide });
    }

    initializeLoveMeter(loveMeter) {
        const progressBar = loveMeter.querySelector('.love-progress');
        const percentage = parseInt(loveMeter.dataset.love) || 100;

        setTimeout(() => {
            progressBar.style.width = `${percentage}%`;
            loveMeter.classList.add('animated');

            // Heart burst when animation completes
            setTimeout(() => {
                const heartAnimation = new UnifiedHeartAnimation({
                    container: loveMeter,
                    pattern: 'burst',
                    intensity: 'high'
                });
                heartAnimation.init();
                heartAnimation.burst(20);
            }, 1000);
        }, 500);
    }

    initializeGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter items
                galleryItems.forEach(item => {
                    const category = item.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;

                    item.style.display = shouldShow ? 'block' : 'none';

                    if (shouldShow) {
                        item.classList.add('filter-fade-in');
                        setTimeout(() => item.classList.remove('filter-fade-in'), 300);
                    }
                });
            });
        });
    }

    enhanceCountdown(container) {
        const numbers = container.querySelectorAll('.countdown-number');

        // Add flip animation to number changes
        numbers.forEach(numberElement => {
            const observer = new MutationObserver(() => {
                numberElement.classList.add('flip');
                setTimeout(() => numberElement.classList.remove('flip'), 300);
            });

            observer.observe(numberElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        });
    }

    initializeMilestoneCelebrations() {
        // This would be implemented in the countdown page controller
        console.log('Milestone celebrations initialized');
    }

    enhanceStoryTimeline(timeline) {
        const chapters = timeline.querySelectorAll('.chapter');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    // Update reading progress
                    const chapterIndex = Array.from(chapters).indexOf(entry.target);
                    const progress = ((chapterIndex + 1) / chapters.length) * 100;

                    const progressBar = document.querySelector('.reading-progress');
                    if (progressBar) {
                        progressBar.style.width = `${progress}%`;
                    }
                }
            });
        }, { threshold: 0.5 });

        chapters.forEach(chapter => observer.observe(chapter));
    }

    initializeReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff6b9d, #ff8a65);
            z-index: 1000;
            transition: width 0.3s ease;
        `;

        document.body.appendChild(progressBar);
    }

    initializeBasicAnimations() {
        // Fade in animations for elements with data-animate
        const animateElements = document.querySelectorAll('[data-animate]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationType = entry.target.dataset.animate;
                    entry.target.classList.add(`animate-${animationType}`);
                    observer.unobserve(entry.target);
                }
            });
        });

        animateElements.forEach(element => observer.observe(element));
    }

    initializeScrollEffects() {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', this.throttle(() => {
            const currentScrollY = window.scrollY;
            const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

            document.body.classList.toggle('scrolling-down', scrollDirection === 'down');
            document.body.classList.toggle('scrolling-up', scrollDirection === 'up');

            lastScrollY = currentScrollY;
        }, 16));
    }

    setupGlobalListeners() {
        // Enhanced navigation
        document.addEventListener('click', (e) => {
            // Music toggle
            if (e.target.classList.contains('music-toggle')) {
                const backgroundComponents = this.components.get('background');
                if (backgroundComponents) {
                    backgroundComponents.toggleMusic();
                }
            }

            // Heart burst on click
            if (e.target.classList.contains('heart-trigger')) {
                const heartAnimation = this.components.get('background')?.heartAnimation;
                if (heartAnimation) {
                    heartAnimation.burst(5);
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'm':
                        e.preventDefault();
                        const backgroundComponents = this.components.get('background');
                        if (backgroundComponents) {
                            backgroundComponents.toggleMusic();
                        }
                        break;
                    case 'h':
                        e.preventDefault();
                        const heartAnimation = this.components.get('background')?.heartAnimation;
                        if (heartAnimation) {
                            heartAnimation.burst(10);
                        }
                        break;
                }
            }
        });
    }

    setupThemeSystem() {
        const themeToggle = document.querySelector('.theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';

        document.documentElement.setAttribute('data-theme', currentTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'light' ? 'dark' : 'light';

                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);

                // Update icon
                const icon = themeToggle.querySelector('.theme-icon');
                if (icon) {
                    icon.textContent = next === 'light' ? '🌙' : '☀️';
                }
            });
        }
    }

    enhanceNavigation() {
        const nav = document.querySelector('.main-nav');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.toggle('open');
                navToggle.setAttribute('aria-expanded', isOpen);
                navToggle.classList.toggle('active', isOpen);
            });
        }

        // Active page highlighting
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });

        // Scroll-based navigation styling
        if (nav) {
            window.addEventListener('scroll', this.throttle(() => {
                nav.classList.toggle('scrolled', window.scrollY > 50);
            }, 16));
        }
    }

    optimizePerformance() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.lazyLoader.observe(img));

        // Defer non-critical CSS
        const deferredStyles = document.querySelectorAll('link[data-defer]');
        deferredStyles.forEach(link => {
            const href = link.dataset.defer;
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = href;
            document.head.appendChild(newLink);
        });

        // Preload critical resources
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        const criticalImages = [
            '/images/hero-bg.jpg',
            '/images/couple-main.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    addTouchSupport(element, handlers) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        element.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        element.addEventListener('touchend', () => {
            if (!isDragging) return;

            const deltaX = currentX - startX;
            const threshold = 50;

            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0 && handlers.prev) {
                    handlers.prev();
                } else if (deltaX < 0 && handlers.next) {
                    handlers.next();
                }
            }

            isDragging = false;
        });
    }

    throttle(func, delay) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, delay);
            }
        };
    }

    handleError(error) {
        console.error('Anniversary Website Error:', error);

        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-notification';
        errorMessage.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">Something went wrong. Please refresh the page.</span>
                <button class="error-close">×</button>
            </div>
        `;

        document.body.appendChild(errorMessage);

        // Auto-remove after 5 seconds
        setTimeout(() => errorMessage.remove(), 5000);

        // Close button
        errorMessage.querySelector('.error-close').addEventListener('click', () => {
            errorMessage.remove();
        });
    }

    destroy() {
        // Clean up all components
        this.components.forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });

        this.components.clear();

        // Stop performance monitoring
        if (this.performanceMonitor) {
            this.performanceMonitor.stop();
        }

        console.log('🧹 Anniversary Website Integration cleaned up');
    }
}

// Initialize when DOM is ready
const integrator = new AnniversaryWebsiteIntegrator();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => integrator.init());
} else {
    integrator.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => integrator.destroy());

// Global access
window.AnniversaryWebsiteIntegrator = integrator;

export { AnniversaryWebsiteIntegrator };
