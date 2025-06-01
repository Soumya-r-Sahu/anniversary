/**
 * Unified Navigation Component
 * Provides consistent navigation across all pages
 * Version: 1.0.0
 */

class UnifiedNavigation {
    constructor(options = {}) {
        this.config = {
            position: options.position || 'top-right', // top-right, top-left, bottom-right, etc.
            showOnPages: options.showOnPages || 'all', // all, specific pages array
            style: options.style || 'glassmorphism', // glassmorphism, minimal, vibrant
            animated: options.animated !== false,
            autoHide: options.autoHide || false,
            ...options
        };

        this.currentPage = this.getCurrentPageName();
        this.navigationLinks = this.getNavigationLinks();
        
        this.init();
    }

    /**
     * Initialize navigation component
     */
    init() {
        // Remove existing navigation if any
        this.removeExistingNavigation();
        
        // Create and inject navigation
        this.createNavigation();
        
        // Setup interactions
        this.setupInteractions();
        
        console.log('🧭 Unified Navigation initialized');
    }

    /**
     * Get current page name
     */
    getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    /**
     * Get navigation links configuration
     */
    getNavigationLinks() {
        return [
            {
                id: 'home',
                name: 'Home',
                href: 'index.html',
                icon: '🏠',
                description: 'Welcome page'
            },
            {
                id: 'anniversary',
                name: 'Anniversary',
                href: 'anniversary.html',
                icon: '💕',
                description: 'Our celebration'
            },
            {
                id: 'love-story',
                name: 'Love Story',
                href: 'love-story.html',
                icon: '📖',
                description: 'Our journey'
            },
            {
                id: 'photo-gallery',
                name: 'Photos',
                href: 'photo-gallery.html',
                icon: '📸',
                description: 'Our memories'
            },
            {
                id: 'memories-timeline',
                name: 'Timeline',
                href: 'memories-timeline.html',
                icon: '⏰',
                description: 'Our milestones'
            },
            {
                id: 'fireworks',
                name: 'Fireworks',
                href: 'fireworks.html',
                icon: '🎆',
                description: 'Celebration'
            },
            {
                id: 'countdown',
                name: 'Countdown',
                href: 'countdown.html',
                icon: '⏱️',
                description: 'Time to love'
            }
        ];
    }

    /**
     * Remove existing navigation elements
     */
    removeExistingNavigation() {
        // Remove various existing navigation patterns
        const selectors = [
            '.unified-navigation',
            '.nav-controls',
            '.home-nav',
            '.page-navigation'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    }

    /**
     * Create navigation HTML
     */
    createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'unified-navigation';
        nav.style.cssText = this.getNavigationStyles();
        
        // Create navigation container
        const container = document.createElement('div');
        container.className = 'nav-container';
        container.style.cssText = this.getContainerStyles();

        // Create navigation items
        this.navigationLinks.forEach(link => {
            if (link.id !== this.currentPage) { // Don't show current page
                const navItem = this.createNavigationItem(link);
                container.appendChild(navItem);
            }
        });

        nav.appendChild(container);
        document.body.appendChild(nav);

        // Add animations if enabled
        if (this.config.animated) {
            this.addNavigationAnimations(nav);
        }
    }

    /**
     * Create individual navigation item
     */
    createNavigationItem(link) {
        const item = document.createElement('a');
        item.href = link.href;
        item.className = 'nav-item';
        item.style.cssText = this.getNavItemStyles();
        item.setAttribute('aria-label', `Navigate to ${link.name}: ${link.description}`);
        item.setAttribute('data-page', link.id);

        // Create item content
        item.innerHTML = `
            <span class="nav-icon">${link.icon}</span>
            <span class="nav-label">${link.name}</span>
            <div class="nav-tooltip">${link.description}</div>
        `;

        return item;
    }

    /**
     * Get navigation styles based on configuration
     */
    getNavigationStyles() {
        const position = this.getPositionStyles();
        const baseStyles = `
            position: fixed;
            z-index: 1000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        return baseStyles + position;
    }

    /**
     * Get position styles
     */
    getPositionStyles() {
        switch (this.config.position) {
            case 'top-left':
                return 'top: 20px; left: 20px;';
            case 'top-right':
                return 'top: 20px; right: 20px;';
            case 'bottom-left':
                return 'bottom: 20px; left: 20px;';
            case 'bottom-right':
                return 'bottom: 20px; right: 20px;';
            case 'top-center':
                return 'top: 20px; left: 50%; transform: translateX(-50%);';
            case 'bottom-center':
                return 'bottom: 20px; left: 50%; transform: translateX(-50%);';
            default:
                return 'top: 20px; right: 20px;';
        }
    }

    /**
     * Get container styles
     */
    getContainerStyles() {
        let styles = `
            display: flex;
            gap: 10px;
            align-items: center;
            padding: 10px;
            border-radius: 25px;
            transition: all 0.3s ease;
        `;

        switch (this.config.style) {
            case 'glassmorphism':
                styles += `
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
                `;
                break;
            case 'minimal':
                styles += `
                    background: rgba(0, 0, 0, 0.8);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                `;
                break;
            case 'vibrant':
                styles += `
                    background: linear-gradient(135deg, #ff6b9d, #ffa8cc);
                    box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
                `;
                break;
        }

        return styles;
    }

    /**
     * Get navigation item styles
     */
    getNavItemStyles() {
        return `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            position: relative;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
        `;
    }

    /**
     * Setup navigation interactions
     */
    setupInteractions() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            // Hover effects
            item.addEventListener('mouseenter', this.handleNavItemHover.bind(this));
            item.addEventListener('mouseleave', this.handleNavItemLeave.bind(this));
            
            // Click effects
            item.addEventListener('click', this.handleNavItemClick.bind(this));
        });

        // Auto-hide functionality
        if (this.config.autoHide) {
            this.setupAutoHide();
        }

        // Add CSS for tooltips and animations
        this.addNavigationCSS();
    }

    /**
     * Handle navigation item hover
     */
    handleNavItemHover(e) {
        const item = e.currentTarget;
        item.style.transform = 'scale(1.1)';
        item.style.background = 'rgba(255, 255, 255, 0.2)';
        item.style.boxShadow = '0 5px 15px rgba(255, 107, 157, 0.3)';

        // Show tooltip
        const tooltip = item.querySelector('.nav-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        }

        // Create heart burst effect if available
        if (window.BackgroundComponents?.triggerHeartBurst) {
            const rect = item.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            window.BackgroundComponents.triggerHeartBurst(x, y, 3);
        }
    }

    /**
     * Handle navigation item leave
     */
    handleNavItemLeave(e) {
        const item = e.currentTarget;
        item.style.transform = 'scale(1)';
        item.style.background = 'rgba(255, 255, 255, 0.1)';
        item.style.boxShadow = 'none';

        // Hide tooltip
        const tooltip = item.querySelector('.nav-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        }
    }

    /**
     * Handle navigation item click
     */
    handleNavItemClick(e) {
        const item = e.currentTarget;
        
        // Add click animation
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = 'scale(1.1)';
        }, 100);

        // Create special click effect
        if (window.BackgroundComponents?.triggerHeartBurst) {
            const rect = item.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            window.BackgroundComponents.triggerHeartBurst(x, y, 8);
        }
    }

    /**
     * Setup auto-hide functionality
     */
    setupAutoHide() {
        let hideTimeout;
        const nav = document.querySelector('.unified-navigation');
        
        const showNav = () => {
            nav.style.opacity = '1';
            nav.style.transform = nav.style.transform.replace(/translateY\([^)]*\)/, '') + ' translateY(0)';
            clearTimeout(hideTimeout);
        };

        const hideNav = () => {
            hideTimeout = setTimeout(() => {
                nav.style.opacity = '0.3';
                nav.style.transform = nav.style.transform.replace(/translateY\([^)]*\)/, '') + ' translateY(-10px)';
            }, 3000);
        };

        // Show on mouse movement
        document.addEventListener('mousemove', showNav);
        
        // Hide after inactivity
        hideNav();
    }

    /**
     * Add navigation CSS styles
     */
    addNavigationCSS() {
        if (document.querySelector('#unified-navigation-styles')) return;

        const style = document.createElement('style');
        style.id = 'unified-navigation-styles';
        style.textContent = `
            .nav-icon {
                font-size: 20px;
                margin-bottom: 2px;
            }

            .nav-label {
                font-size: 8px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                opacity: 0.8;
            }

            .nav-tooltip {
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%) translateY(10px);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
                z-index: 10;
            }

            .nav-tooltip:before {
                content: '';
                position: absolute;
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 5px solid rgba(0, 0, 0, 0.8);
            }

            .unified-navigation:hover .nav-container {
                transform: scale(1.05);
            }

            @media (max-width: 768px) {
                .nav-label {
                    display: none;
                }

                .nav-item {
                    width: 45px !important;
                    height: 45px !important;
                }

                .nav-icon {
                    font-size: 18px !important;
                }

                .nav-container {
                    padding: 8px !important;
                    gap: 8px !important;
                }
            }

            @keyframes navFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .unified-navigation {
                animation: navFadeIn 0.5s ease-out;
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Add entrance animations
     */
    addNavigationAnimations(nav) {
        const items = nav.querySelectorAll('.nav-item');
        
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Update navigation for current page
     */
    updateCurrentPage() {
        this.currentPage = this.getCurrentPageName();
        
        // Remove and recreate navigation
        this.removeExistingNavigation();
        this.createNavigation();
    }

    /**
     * Show navigation
     */
    show() {
        const nav = document.querySelector('.unified-navigation');
        if (nav) {
            nav.style.display = 'block';
            nav.style.opacity = '1';
        }
    }

    /**
     * Hide navigation
     */
    hide() {
        const nav = document.querySelector('.unified-navigation');
        if (nav) {
            nav.style.opacity = '0';
            setTimeout(() => {
                nav.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Destroy navigation
     */
    destroy() {
        this.removeExistingNavigation();
        
        const style = document.querySelector('#unified-navigation-styles');
        if (style) {
            style.remove();
        }
    }
}

// Auto-initialize navigation on supported pages
/*
document.addEventListener('DOMContentLoaded', () => {
    // Skip initialization on certain pages if needed
    const skipPages = []; // Add page names here if needed
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (!skipPages.includes(currentPage)) {
        // Initialize with page-specific configuration
        const navConfig = {
            position: 'top-right',
            style: 'glassmorphism',
            animated: true,
            autoHide: false
        };

        // Page-specific overrides
        switch (currentPage) {
            case 'fireworks.html':
                navConfig.position = 'top-left';
                break;
            case 'photo-gallery.html':
                navConfig.style = 'minimal';
                break;
        }

        window.unifiedNavigation = new UnifiedNavigation(navConfig);
    }
});
*/

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedNavigation;
}
