/**
 * Music Popup Initializer
 * Initializes the page-specific music manager with popup UI
 * This script handles the popup music player functionality
 */

// Initialize Page-Specific Music Manager
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🎵 Initializing page-specific music system...');
        
        // Import and initialize PageSpecificMusicManager
        const { PageSpecificMusicManager } = await import('./core/PageSpecificMusicManager.js');
        
        // Create global instance
        if (!window.pageSpecificMusicManager) {
            window.pageSpecificMusicManager = new PageSpecificMusicManager();
            await window.pageSpecificMusicManager.init();
            console.log('✅ Page-specific music manager initialized');
        }
        
        // Override UIControlSystem music button behavior if it exists
        setTimeout(() => {
            const musicControlBtn = document.querySelector('.ui-control-btn.music-control-btn');
            if (musicControlBtn) {
                // Remove existing click listeners
                musicControlBtn.replaceWith(musicControlBtn.cloneNode(true));
                
                // Get the new element and add our listener
                const newMusicBtn = document.querySelector('.ui-control-btn.music-control-btn');
                if (newMusicBtn) {
                    newMusicBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Mark user interaction and toggle popup
                        window.pageSpecificMusicManager.handleUserInteraction();
                        window.pageSpecificMusicManager.togglePopup();
                    });
                    
                    console.log('🎛️ Music control button override complete');
                }
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Failed to initialize page-specific music system:', error);
    }
});

// Export for module systems  
export { };
