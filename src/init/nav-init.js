/**
 * Navigation Initialization Script
 * Auto-initializes UnifiedNavigation across all pages
 * Version: 1.0.0
 */

// Configuration mapping for each page
const NAV_CONFIG = {
    'index': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'countdown': {
        position: 'top-right',
        style: 'minimal',
        animated: true,
        autoHide: true
    },
    'anniversary': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'love-story': {
        position: 'top-left',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'photo-gallery': {
        position: 'bottom-right',
        style: 'minimal',
        animated: true,
        autoHide: true
    },
    'memories-timeline': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'fireworks': {
        position: 'top-left',
        style: 'minimal',
        animated: true,
        autoHide: true
    },
    'music-playlist': {
        position: 'bottom-left',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'wish-list': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'future-plans': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'special-dates': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'memory-book': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'settings': {
        position: 'top-left',
        style: 'minimal',
        animated: true,
        autoHide: false
    },
    'love-letters': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    },
    'challenges': {
        position: 'top-right',
        style: 'glassmorphism',
        animated: true,
        autoHide: false
    }
};

// Default configuration
const DEFAULT_CONFIG = {
    position: 'top-right',
    style: 'glassmorphism',
    animated: true,
    autoHide: false
};

/**
 * Initialize navigation system
 */
function initializeNavigation() {
    // Skip if navigation is already initialized
    if (window.unifiedNavigation) {
        return;
    }

    try {
        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageName = currentPage.replace('.html', '');

        // Get page-specific configuration
        const config = NAV_CONFIG[pageName] || DEFAULT_CONFIG;

        // Create navigation instance
        window.unifiedNavigation = new UnifiedNavigation(config);

        console.log(`🧭 Navigation initialized for ${pageName}`);

        // Performance optimization: preload navigation assets
        requestAnimationFrame(() => {
            optimizeNavigationPerformance();
        });

    } catch (error) {
        console.error('❌ Failed to initialize navigation:', error);
    }
}

/**
 * Optimize navigation performance for 90fps target
 */
function optimizeNavigationPerformance() {
    // Enable hardware acceleration for navigation elements
    const nav = document.querySelector('.unified-navigation');
    if (nav) {
        nav.style.willChange = 'transform, opacity';
        nav.style.transform = 'translateZ(0)'; // Force hardware acceleration
    }

    // Optimize dropdown animations
    const container = document.querySelector('.nav-container');
    if (container) {
        container.style.willChange = 'transform, opacity';
        container.style.transform = 'translateZ(0)';
    }

    // Use RAF for smooth animations
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.willChange = 'transform';
        item.style.backfaceVisibility = 'hidden';
    });
}

/**
 * Auto-initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', initializeNavigation);

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    // DOM already loaded
    setTimeout(initializeNavigation, 0);
}

// Export for manual initialization
window.initializeNavigation = initializeNavigation;
