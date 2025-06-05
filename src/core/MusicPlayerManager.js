import { BaseAudioManager } from './BaseAudioManager.js';

/**
 * Music Player Manager
 * Enhanced music management system for the anniversary website
 * Version: 3.0.0 - Now extends BaseAudioManager
 */
class MusicPlayerManager extends BaseAudioManager {
    constructor(options = {}) {
        // Set default playlist for base manager
        const defaultPlaylist = [
            'music/Arijitsingh.m4a',
            'music/queue_song/01-nit-khair-manga.m4a',
            'music/queue_song/02-Kahani-Suno.m4a',
            'music/queue_song/03-champakali.m4a',
            'music/queue_song/04-jo-tum-mere-ho.m4a',
            'music/queue_song/05-paro.m4a',
            'music/queue_song/06-Jugrafiyan.m4a'
        ];

        super({
            ...options,
            playlist: options.playlist || defaultPlaylist,
            enableVisualizer: options.enableVisualizer !== false,
            enablePlaylist: options.enablePlaylist !== false
        });

        // Initialize with parent's init method
        this.onInitialized(() => {
            this.initializePlayerExtended();
        });
    }

    /**
     * Extended initialization specific to MusicPlayerManager
     */
    initializePlayerExtended() {
        console.log('🎵 Initializing Music Player Manager');
        
        // Setup any player-specific functionality here
        this.setupPlayerSpecificFeatures();

        console.log('🎵 Music Player Manager fully initialized');
    }

    /**
     * Setup player-specific features
     */
    setupPlayerSpecificFeatures() {
        // Setup custom player UI if needed
        this.setupCustomPlayerUI();
    }

    /**
     * Setup custom player UI specific to MusicPlayerManager
     */
    setupCustomPlayerUI() {
        // Find or create music player UI if it doesn't exist
        let player = document.querySelector('.music-player');
        if (!player) {
            player = this.createMusicPlayerUI();
        }
        
        // Store reference to player UI
        this.playerUI = player;
    }

    /**
     * Create basic music player UI if not exists
     */
    createMusicPlayerUI() {
        const player = document.createElement('div');
        player.className = 'music-player';
        player.innerHTML = `
            <div class="player-controls">
                <button class="play-btn">▶️</button>
                <button class="pause-btn" style="display: none;">⏸️</button>
                <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="${this.state.volume}">
            </div>
            <div class="player-info">
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
                <div class="time-display">
                    <span class="current-time">0:00</span> / <span class="duration">0:00</span>
                </div>
            </div>
            <div class="playlist-container" style="display: none;"></div>
            <div class="visualizer" style="display: none;"></div>
        `;

        // Add to page
        document.body.appendChild(player);
        return player;
    }

    /**
     * Detect low power mode for performance optimization
     */
    detectLowPowerMode() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isLowEnd = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        return isLowEnd || isLowMemory;
    }
}

// Export for module systems
export { MusicPlayerManager };

// Legacy export for backward compatibility
export { MusicPlayerManager as EnhancedMusicManager };
