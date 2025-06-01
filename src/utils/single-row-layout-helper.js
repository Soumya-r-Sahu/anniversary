/**
 * Single Row Layout Helper
 * Dynamically applies single row layout to all count boxes
 */

class SingleRowLayoutHelper {
    constructor() {
        this.selectors = [
            '.countdown-container .grid',
            '.count-container .grid',
            '.timer-container .grid',
            '.stats-container .grid',
            '.metrics-container .grid',
            '.grid.grid-cols-1',
            '.grid.grid-cols-2',
            '.grid.grid-cols-3',
            '.grid.grid-cols-4',
            '.grid[class*="grid-cols"]'
        ];
        
        this.itemSelectors = [
            '.countdown-item',
            '.count-item',
            '.timer-item',
            '.stats-item',
            '.metrics-item'
        ];
        
        this.isInitialized = false;
        this.observer = null;
    }

    /**
     * Initialize the single row layout helper
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('🔄 Initializing Single Row Layout Helper...');
        
        // Apply initial layout
        this.applyInitialLayout();
        
        // Set up mutation observer for dynamic content
        this.setupMutationObserver();
        
        // Set up resize observer for responsive updates
        this.setupResizeObserver();
        
        // Set up intersection observer for performance
        this.setupIntersectionObserver();
        
        this.isInitialized = true;
        console.log('✅ Single Row Layout Helper initialized');
    }

    /**
     * Apply initial single row layout to all existing elements
     */
    applyInitialLayout() {
        // Apply to grid containers
        this.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.applyFlexLayout(element);
            });
        });

        // Apply to grid items
        this.itemSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.applyFlexItem(element);
            });
        });

        console.log('🎯 Applied initial single row layout to all elements');
    }

    /**
     * Apply flex layout to container element
     */
    async applyFlexLayout(element) {
        if (!element) return;

        try {
            // Check if the element is still in the document
            if (!document.body.contains(element)) {
                console.warn('Element not in document, skipping layout application');
                return;
            }

            // Apply the flex layout styles with padding fix
            await this.setElementStyles(element, {
                'display': 'flex',
                'flex-direction': 'row',
                'flex-wrap': 'nowrap',
                'justify-content': 'center',
                'align-items': 'center',
                'gap': '0.5rem',
                'width': '100%',
                'padding': '0',
                'margin': '0',
                'border': 'none',
                'overflow-x': 'auto',
                'overflow-y': 'hidden',
                'box-sizing': 'border-box'
            });

            // Get computed styles for verification
            const computedStyles = window.getComputedStyle(element);
            const data = {
                display: computedStyles['display'],
                flexDirection: computedStyles['flex-direction'],
                justifyContent: computedStyles['justify-content'],
                alignItems: computedStyles['align-items']
            };

            console.log('✅ Applied flex layout:', data);
            return data;

        } catch (e) {
            const data = { error: e.message };
            console.error('❌ Error applying flex layout:', data);
            return data;
        }
    }

    /**
     * Apply flex item styles to count box items
     */
    async applyFlexItem(element) {
        if (!element) return;

        try {
            // Check if the element is still in the document
            if (!document.body.contains(element)) {
                console.warn('Element not in document, skipping item styling');
                return;
            }

            // Apply the flex item styles with mobile optimization
            await this.setElementStyles(element, {
                'flex': '1 1 auto',
                'min-width': '70px',
                'max-width': '150px',
                'flex-shrink': '0',
                'display': 'flex',
                'flex-direction': 'column',
                'justify-content': 'center',
                'align-items': 'center',
                'text-align': 'center',
                'padding': '8px 4px',
                'margin': '0',
                'border': 'none',
                'border-radius': '12px',
                'box-sizing': 'border-box'
            });

            // Get computed styles for verification
            const computedStyles = window.getComputedStyle(element);
            const data = {
                flex: computedStyles['flex'],
                minWidth: computedStyles['min-width'],
                maxWidth: computedStyles['max-width'],
                display: computedStyles['display']
            };

            console.log('✅ Applied flex item styles:', data);
            return data;

        } catch (e) {
            const data = { error: e.message };
            console.error('❌ Error applying flex item styles:', data);
            return data;
        }
    }

    /**
     * Set element styles with error handling
     */
    async setElementStyles(element, styles) {
        return new Promise((resolve, reject) => {
            try {
                if (!element || !element.style) {
                    reject(new Error('Invalid element'));
                    return;
                }

                // Apply styles
                Object.entries(styles).forEach(([property, value]) => {
                    element.style.setProperty(property, value, 'important');
                });

                // Add utility class
                element.classList.add('force-single-row');

                // Force reflow
                element.offsetHeight;

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Setup mutation observer for dynamic content
     */
    setupMutationObserver() {
        if (!window.MutationObserver) return;

        this.observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check for added nodes
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check if it's a grid container or contains grid containers
                            if (this.isGridContainer(node) || node.querySelector && this.hasGridContainers(node)) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }

                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // Check if class changes affect grid layout
                    const target = mutation.target;
                    if (this.isGridContainer(target)) {
                        shouldUpdate = true;
                    }
                }
            });

            if (shouldUpdate) {
                // Debounce updates
                clearTimeout(this.updateTimeout);
                this.updateTimeout = setTimeout(() => {
                    this.applyInitialLayout();
                }, 100);
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Setup resize observer for responsive updates
     */
    setupResizeObserver() {
        if (!window.ResizeObserver) return;

        this.resizeObserver = new ResizeObserver((entries) => {
            // Update layout on resize
            this.updateResponsiveLayout();
        });

        // Observe the document body
        this.resizeObserver.observe(document.body);
    }

    /**
     * Setup intersection observer for performance
     */
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Apply layout when element becomes visible
                    if (this.isGridContainer(entry.target)) {
                        this.applyFlexLayout(entry.target);
                    }
                }
            });
        });

        // Observe all grid containers
        this.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.intersectionObserver.observe(element);
            });
        });
    }

    /**
     * Check if element is a grid container
     */
    isGridContainer(element) {
        if (!element || !element.classList) return false;
        
        return this.selectors.some(selector => {
            return element.matches && element.matches(selector.replace(/^\./, ''));
        });
    }

    /**
     * Check if element contains grid containers
     */
    hasGridContainers(element) {
        if (!element || !element.querySelector) return false;
        
        return this.selectors.some(selector => {
            return element.querySelector(selector) !== null;
        });
    }

    /**
     * Update responsive layout with mobile-first approach
     */
    updateResponsiveLayout() {
        const isExtraSmallMobile = window.innerWidth <= 320;
        const isSmallMobile = window.innerWidth > 320 && window.innerWidth <= 480;
        const isTablet = window.innerWidth > 480 && window.innerWidth <= 768;
        const isDesktop = window.innerWidth > 768;

        // Apply responsive styles based on screen size
        this.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (isExtraSmallMobile) {
                    this.setElementStyles(element, {
                        'gap': '0.25rem',
                        'padding': '0',
                        'margin': '0'
                    });
                } else if (isSmallMobile) {
                    this.setElementStyles(element, {
                        'gap': '0.375rem',
                        'padding': '0',
                        'margin': '0'
                    });
                } else if (isTablet) {
                    this.setElementStyles(element, {
                        'gap': '0.75rem',
                        'padding': '0',
                        'margin': '0'
                    });
                } else if (isDesktop) {
                    this.setElementStyles(element, {
                        'gap': '1rem',
                        'padding': '0',
                        'margin': '0'
                    });
                }
            });
        });

        // Apply responsive styles to items
        this.itemSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (isExtraSmallMobile) {
                    this.setElementStyles(element, {
                        'min-width': '55px',
                        'max-width': '75px',
                        'padding': '6px 2px',
                        'border-radius': '8px'
                    });
                } else if (isSmallMobile) {
                    this.setElementStyles(element, {
                        'min-width': '65px',
                        'max-width': '85px',
                        'padding': '8px 4px',
                        'border-radius': '10px'
                    });
                } else if (isTablet) {
                    this.setElementStyles(element, {
                        'min-width': '80px',
                        'max-width': '120px',
                        'padding': '10px 6px',
                        'border-radius': '12px'
                    });
                } else if (isDesktop) {
                    this.setElementStyles(element, {
                        'min-width': '100px',
                        'max-width': '150px',
                        'padding': '12px 8px',
                        'border-radius': '14px'
                    });
                }
            });
        });
    }

    /**
     * Force apply single row layout (for manual use)
     */
    forceApplyLayout() {
        console.log('🔄 Force applying single row layout...');
        this.applyInitialLayout();
    }

    /**
     * Destroy the layout helper
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        clearTimeout(this.updateTimeout);
        
        this.isInitialized = false;
        console.log('🧹 Single Row Layout Helper destroyed');
    }
}

// Auto-initialize
const singleRowLayoutHelper = new SingleRowLayoutHelper();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => singleRowLayoutHelper.init());
} else {
    singleRowLayoutHelper.init();
}

// Export for manual use
window.singleRowLayoutHelper = singleRowLayoutHelper;

console.log('✅ Single Row Layout Helper loaded');
