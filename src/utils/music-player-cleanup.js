/**
 * Music Player Cleanup Utility
 * Removes all overlapping music player containers for clean deployment
 */

class MusicPlayerCleanup {
    constructor() {
        this.cleanupInterval = null;
        this.cleanupAttempts = 0;
        this.maxAttempts = 10;
    }

    /**
     * Initialize cleanup process
     */
    init() {
        console.log('🧹 Initializing music player cleanup...');
        
        // Immediate cleanup
        this.performCleanup();
        
        // Set up periodic cleanup for dynamically created elements
        this.cleanupInterval = setInterval(() => {
            this.performCleanup();
            this.cleanupAttempts++;
            
            // Stop after max attempts
            if (this.cleanupAttempts >= this.maxAttempts) {
                clearInterval(this.cleanupInterval);
                console.log('✅ Music player cleanup completed');
            }
        }, 500);
        
        // DOM ready cleanup
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.performCleanup());
        }
        
        // Window load cleanup
        window.addEventListener('load', () => this.performCleanup());
    }

    /**
     * Perform comprehensive cleanup
     */
    async performCleanup() {
        try {
            // Hide enhanced music players
            await this.hideEnhancedMusicPlayers();
            
            // Hide music player containers
            await this.hideMusicPlayerContainers();
            
            // Apply display none to overlapping elements
            await this.applyDisplayNoneFix();
            
            // Remove from DOM if necessary
            await this.removeFromDOM();
            
        } catch (error) {
            console.warn('⚠️ Music player cleanup error:', error);
        }
    }

    /**
     * Hide enhanced music players
     */
    async hideEnhancedMusicPlayers() {
        const enhancedPlayers = document.querySelectorAll('.enhanced-music-player, #enhanced-music-player');
        
        enhancedPlayers.forEach(player => {
            if (player) {
                await this.setElementStyles(player, { 
                    display: 'none',
                    visibility: 'hidden',
                    opacity: '0',
                    pointerEvents: 'none',
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px'
                });
                console.log('🚫 Hidden enhanced music player');
            }
        });
    }

    /**
     * Hide music player containers
     */
    async hideMusicPlayerContainers() {
        const containers = document.querySelectorAll('.music-player-container, [class*="music-player-container"]');
        
        containers.forEach(container => {
            if (container) {
                this.setElementStyles(container, { 
                    display: 'none',
                    visibility: 'hidden',
                    opacity: '0',
                    pointerEvents: 'none'
                });
                console.log('🚫 Hidden music player container');
            }
        });
    }

    /**
     * Apply display none fix using the provided code snippet
     */
    async applyDisplayNoneFix() {
        // Find all music-related elements
        const musicElements = document.querySelectorAll(`
            .enhanced-music-player,
            #enhanced-music-player,
            .music-player-container,
            [class*="music-player-container"],
            [id*="music-player"],
            [class*="enhanced-music"]
        `);

        for (const element of musicElements) {
            if (element) {
                // Apply the provided fix
                await this.setElementStyles(element, { display: 'none' });
                
                const data = {
                    success: true
                };
                
                console.log('✅ Applied display none fix to:', element.className || element.id);
            }
        }
    }

    /**
     * Remove elements from DOM completely
     */
    async removeFromDOM() {
        const elementsToRemove = document.querySelectorAll(`
            .enhanced-music-player,
            #enhanced-music-player,
            .music-player-container
        `);

        elementsToRemove.forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
                console.log('🗑️ Removed music player element from DOM');
            }
        });
    }

    /**
     * Set element styles with async support
     */
    async setElementStyles(element, styles) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }

            // Apply styles
            Object.assign(element.style, styles);
            
            // Add CSS class for additional hiding
            element.classList.add('music-player-hidden');
            
            // Force reflow
            element.offsetHeight;
            
            resolve();
        });
    }

    /**
     * Add global CSS to ensure elements stay hidden
     */
    addGlobalHidingCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-music-player,
            #enhanced-music-player,
            .music-player-container,
            .music-player-hidden,
            [class*="music-player-container"],
            [id*="enhanced-music-player"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                position: absolute !important;
                left: -9999px !important;
                top: -9999px !important;
                z-index: -1 !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 Added global hiding CSS');
    }

    /**
     * Destroy cleanup process
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        console.log('🧹 Music player cleanup destroyed');
    }
}

// Auto-initialize
const musicPlayerCleanup = new MusicPlayerCleanup();

// Initialize immediately
musicPlayerCleanup.init();
musicPlayerCleanup.addGlobalHidingCSS();

// Export for manual use
window.musicPlayerCleanup = musicPlayerCleanup;

console.log('✅ Music Player Cleanup utility loaded');
