/**
 * Long Page Music Positioning Fix
 * Applies top positioning for music popup on long pages like love-letters and anniversary
 */

class LongPageMusicPositioning {
    constructor() {
        this.longPages = [
            'love-letters.html',
            'anniversary.html',
            'memories-timeline.html',
            'love-story.html',
            'photo-gallery.html'
        ];
        this.currentPage = this.getCurrentPage();
        this.isLongPage = this.checkIfLongPage();
        this.popup = null;
        this.observer = null;
    }

    /**
     * Get current page name
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop() || 'index.html';
        return pageName;
    }

    /**
     * Check if current page is a long page
     */
    checkIfLongPage() {
        return this.longPages.includes(this.currentPage);
    }

    /**
     * Initialize positioning fix
     */
    init() {
        if (!this.isLongPage) {
            console.log(`📄 Page ${this.currentPage} is not a long page, skipping top positioning`);
            return;
        }

        console.log(`📜 Long page detected: ${this.currentPage}, applying top positioning...`);
        
        // Wait for popup to be created
        this.waitForPopup();
        
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
                console.log('🎵 Music popup found on long page, applying top positioning...');
                this.applyTopPositioning();
                this.setupPopupObserver();
            } else {
                // Check again in 100ms
                setTimeout(checkForPopup, 100);
            }
        };
        
        checkForPopup();
    }

    /**
     * Apply the specific top positioning fix
     */
    async applyTopPositioning() {
        if (!this.popup) return;

        try {
            // Apply the requested positioning fix
            await this.setElementStyles(this.popup, {
                position: 'fixed', // Revert to fixed positioning
                top: '20px',       // Position from the top
                bottom: 'auto',    // Remove bottom constraint
                left: 'auto',      // Remove left constraint
                right: 'auto'      // Remove right constraint
            });

            // Get computed styles for verification
            const computedStyles = window.getComputedStyle(this.popup);
            const data = {
                page: this.currentPage,
                newPosition: computedStyles['position'],
                newTop: computedStyles['top'],
                newBottom: computedStyles['bottom'],
                newLeft: computedStyles['left'],
                newRight: computedStyles['right'],
                success: true
            };

            console.log('✅ Long page top positioning applied:', data);

            // Add additional positioning for better alignment
            this.applyAdditionalPositioning();

            return data;

        } catch (error) {
            console.error('❌ Error applying top positioning:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Apply additional positioning for long pages
     */
    applyAdditionalPositioning() {
        if (!this.popup) return;

        // Determine horizontal positioning based on screen size
        if (window.innerWidth >= 768) {
            // Desktop: position on the right side
            this.popup.style.right = '20px';
            this.popup.style.left = 'auto';
            this.popup.style.width = '400px';
            this.popup.style.maxWidth = 'calc(100vw - 40px)';
        } else {
            // Mobile: center horizontally
            this.popup.style.left = '50%';
            this.popup.style.right = 'auto';
            this.popup.style.transform = 'translateX(-50%)';
            this.popup.style.width = 'calc(100vw - 40px)';
            this.popup.style.maxWidth = '400px';
        }

        // Ensure proper z-index
        this.popup.style.zIndex = '10000';
        
        // Add long page class
        this.popup.classList.add('long-page-positioned');

        console.log(`📍 Additional positioning applied for ${this.currentPage}`);
    }

    /**
     * Set element styles with async support (as requested)
     */
    async setElementStyles(element, styles) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }

            // Apply styles
            Object.assign(element.style, styles);
            
            // Force reflow
            element.offsetHeight;
            
            resolve();
        });
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
                            this.applyTopPositioning();
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
                    // Reapply top positioning if style was changed
                    setTimeout(() => {
                        if (this.popup && !this.popup.style.top.includes('20px')) {
                            this.applyTopPositioning();
                        }
                    }, 10);
                }
            });
        });

        popupObserver.observe(this.popup, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (this.popup && this.isLongPage) {
            this.applyAdditionalPositioning();
        }
    }

    /**
     * Destroy positioning fix
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        console.log('🧹 Long page music positioning destroyed');
    }
}

// Auto-initialize only for long pages
const longPageMusicPositioning = new LongPageMusicPositioning();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => longPageMusicPositioning.init());
} else {
    longPageMusicPositioning.init();
}

// Handle resize
window.addEventListener('resize', () => longPageMusicPositioning.handleResize());

// Export for manual use
window.longPageMusicPositioning = longPageMusicPositioning;

console.log('✅ Long Page Music Positioning loaded');
