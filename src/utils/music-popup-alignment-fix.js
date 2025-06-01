/**
 * Music Popup Alignment Fix
 * Ensures proper alignment with page body padding, borders, and layout
 */

class MusicPopupAlignmentFix {
    constructor() {
        this.popup = null;
        this.observer = null;
        this.resizeHandler = null;
    }

    /**
     * Initialize alignment fix
     */
    init() {
        console.log('🎯 Initializing music popup alignment fix...');
        
        // Wait for popup to be created
        this.waitForPopup();
        
        // Set up resize handler
        this.setupResizeHandler();
        
        // Set up mutation observer
        this.setupMutationObserver();
    }

    /**
     * Wait for popup element to be created
     */
    waitForPopup() {
        const checkForPopup = () => {
            this.popup = document.getElementById('music-popup-player');
            
            if (this.popup) {
                console.log('🎵 Music popup found, applying alignment fix...');
                this.applyAlignmentFix();
                this.setupPopupObserver();
            } else {
                // Check again in 100ms
                setTimeout(checkForPopup, 100);
            }
        };
        
        checkForPopup();
    }

    /**
     * Apply comprehensive alignment fix
     */
    applyAlignmentFix() {
        if (!this.popup) return;

        // Get page container information
        const pageContainer = this.getPageContainer();
        const containerWidth = pageContainer ? pageContainer.offsetWidth : 1200;
        const containerMargin = this.calculateContainerMargin(containerWidth);

        // Apply positioning based on screen size
        if (window.innerWidth >= 768) {
            this.applyDesktopAlignment(containerMargin);
        } else {
            this.applyMobileAlignment();
        }

        // Ensure proper z-index
        this.popup.style.zIndex = '10000';
        
        // Add alignment class
        this.popup.classList.add('popup-aligned');
        
        console.log('✅ Music popup alignment applied');
    }

    /**
     * Get page container element
     */
    getPageContainer() {
        // Try to find common container classes
        const selectors = [
            '.container',
            '.max-w-7xl',
            '.max-w-6xl',
            '.max-w-5xl',
            '.max-w-4xl',
            'main',
            '.main-content',
            '.page-container'
        ];

        for (const selector of selectors) {
            const container = document.querySelector(selector);
            if (container) {
                return container;
            }
        }

        return null;
    }

    /**
     * Calculate container margin for alignment
     */
    calculateContainerMargin(containerWidth) {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth <= containerWidth) {
            return 20; // Default margin
        }
        
        return Math.max(20, (viewportWidth - containerWidth) / 2 + 20);
    }

    /**
     * Apply desktop alignment
     */
    applyDesktopAlignment(containerMargin) {
        if (!this.popup) return;

        // Position relative to page container
        this.popup.style.position = 'fixed';
        this.popup.style.bottom = '20px';
        this.popup.style.right = `${containerMargin}px`;
        this.popup.style.left = 'auto';
        this.popup.style.width = '400px';
        this.popup.style.maxWidth = 'calc(100vw - 40px)';
        this.popup.style.transform = 'none';
        
        // Clear mobile-specific styles
        this.popup.style.marginLeft = '0';
        this.popup.style.marginRight = '0';
        
        console.log(`🖥️ Desktop alignment applied with margin: ${containerMargin}px`);
    }

    /**
     * Apply mobile alignment
     */
    applyMobileAlignment() {
        if (!this.popup) return;

        // Full width with proper margins
        this.popup.style.position = 'fixed';
        this.popup.style.left = '20px';
        this.popup.style.right = '20px';
        this.popup.style.bottom = `calc(20px + ${this.getSafeAreaInset('bottom')})`;
        this.popup.style.width = 'auto';
        this.popup.style.maxWidth = 'none';
        this.popup.style.transform = 'none';
        
        // Apply safe area margins
        this.popup.style.marginLeft = this.getSafeAreaInset('left');
        this.popup.style.marginRight = this.getSafeAreaInset('right');
        
        console.log('📱 Mobile alignment applied');
    }

    /**
     * Get safe area inset value
     */
    getSafeAreaInset(side) {
        // Try to get CSS env() value
        const testElement = document.createElement('div');
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        testElement.style.padding = `env(safe-area-inset-${side}, 0px)`;
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const padding = computedStyle.paddingTop || computedStyle.paddingLeft || '0px';
        
        document.body.removeChild(testElement);
        
        return padding === '0px' ? '0px' : padding;
    }

    /**
     * Setup resize handler
     */
    setupResizeHandler() {
        this.resizeHandler = () => {
            if (this.popup) {
                this.applyAlignmentFix();
            }
        };

        window.addEventListener('resize', this.resizeHandler);
        window.addEventListener('orientationchange', this.resizeHandler);
    }

    /**
     * Setup mutation observer for popup changes
     */
    setupMutationObserver() {
        if (!window.MutationObserver) return;

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check if popup was added
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && 
                            (node.id === 'music-popup-player' || 
                             node.classList?.contains('music-popup-player'))) {
                            this.popup = node;
                            this.applyAlignmentFix();
                            this.setupPopupObserver();
                        }
                    });
                }
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Setup observer for popup style changes
     */
    setupPopupObserver() {
        if (!this.popup || !window.MutationObserver) return;

        const popupObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'style') {
                    // Reapply alignment if style was changed
                    setTimeout(() => this.applyAlignmentFix(), 10);
                }
            });
        });

        popupObserver.observe(this.popup, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    /**
     * Destroy alignment fix
     */
    destroy() {
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            window.removeEventListener('orientationchange', this.resizeHandler);
        }

        if (this.observer) {
            this.observer.disconnect();
        }

        console.log('🧹 Music popup alignment fix destroyed');
    }
}

// Auto-initialize
const musicPopupAlignmentFix = new MusicPopupAlignmentFix();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => musicPopupAlignmentFix.init());
} else {
    musicPopupAlignmentFix.init();
}

// Export for manual use
window.musicPopupAlignmentFix = musicPopupAlignmentFix;

console.log('✅ Music Popup Alignment Fix loaded');
