/**
 * Music System Initializer - Comprehensive Music Fix
 * Ensures music works across all pages with proper initialization
 */

class MusicSystemInitializer {
    constructor() {
        this.musicManager = null;
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Music file paths (corrected)
        this.playlist = [
            'music/Arijitsingh.m4a',
            'music/queue_song/01-nit-khair-manga.m4a',
            'music/queue_song/02-Kahani-Suno.m4a',
            'music/queue_song/03-champakali.m4a',
            'music/queue_song/04-jo-tum-mere-ho.m4a',
            'music/queue_song/05-paro.m4a',
            'music/queue_song/06-Jugrafiyan.m4a'
        ];
        
        this.config = {
            autoplay: false,
            volume: 0.3,
            crossPageSync: true,
            enablePlaylist: true,
            loop: true
        };
    }

    /**
     * Initialize the music system with fallbacks
     */
    async init() {
        if (this.isInitialized) {
            console.log('🎵 Music system already initialized');
            return this.musicManager;
        }

        console.log('🎵 Initializing music system...');

        try {
            // Method 1: Try UnifiedMusicManager
            await this.tryUnifiedMusicManager();
        } catch (error) {
            console.warn('UnifiedMusicManager failed:', error);
            
            try {
                // Method 2: Try MusicPlayerManager
                await this.tryMusicPlayerManager();
            } catch (error2) {
                console.warn('MusicPlayerManager failed:', error2);
                
                // Method 3: Fallback to simple audio element
                this.trySimpleAudioElement();
            }
        }

        if (this.musicManager) {
            this.isInitialized = true;
            window.musicManager = this.musicManager;
            console.log('🎵 Music system initialized successfully');
            
            // Setup user interaction handler
            this.setupUserInteractionHandler();
        } else {
            console.error('❌ Failed to initialize music system');
        }

        return this.musicManager;
    }

    /**
     * Try UnifiedMusicManager
     */
    async tryUnifiedMusicManager() {
        const { UnifiedMusicManager } = await import('./UnifiedMusicManager.js');
        
        this.musicManager = new UnifiedMusicManager({
            ...this.config,
            playlist: this.playlist
        });
        
        await this.musicManager.init();
        console.log('✅ UnifiedMusicManager initialized');
    }

    /**
     * Try MusicPlayerManager
     */
    async tryMusicPlayerManager() {
        const { MusicPlayerManager } = await import('./MusicPlayerManager.js');
        
        this.musicManager = new MusicPlayerManager({
            ...this.config,
            playlist: this.playlist
        });
        
        await this.musicManager.init();
        console.log('✅ MusicPlayerManager initialized');
    }

    /**
     * Fallback to simple audio element
     */
    trySimpleAudioElement() {
        console.log('🎵 Using simple audio element fallback');
        
        this.musicManager = new SimpleAudioManager({
            ...this.config,
            playlist: this.playlist
        });
        
        console.log('✅ SimpleAudioManager initialized');
    }

    /**
     * Setup user interaction handler for autoplay
     */
    setupUserInteractionHandler() {
        const handleFirstInteraction = async () => {
            if (this.musicManager && typeof this.musicManager.handleUserInteraction === 'function') {
                await this.musicManager.handleUserInteraction();
            }
            
            // Remove listeners after first interaction
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        // Add interaction listeners
        document.addEventListener('click', handleFirstInteraction, { once: true });
        document.addEventListener('touchstart', handleFirstInteraction, { once: true });
        document.addEventListener('keydown', handleFirstInteraction, { once: true });
    }

    /**
     * Get the initialized music manager
     */
    getMusicManager() {
        return this.musicManager;
    }

    /**
     * Check if music system is working
     */
    async testMusicSystem() {
        if (!this.musicManager) {
            return { success: false, error: 'No music manager initialized' };
        }

        try {
            // Test basic functionality
            if (typeof this.musicManager.play === 'function') {
                console.log('🧪 Testing music playback...');
                const result = await this.musicManager.play();
                
                // Pause immediately after test
                if (typeof this.musicManager.pause === 'function') {
                    this.musicManager.pause();
                }
                
                return { success: true, result };
            } else {
                return { success: false, error: 'Play method not available' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

/**
 * Simple Audio Manager - Fallback implementation
 */
class SimpleAudioManager {
    constructor(config = {}) {
        this.config = config;
        this.playlist = config.playlist || [];
        this.currentIndex = 0;
        this.audio = null;
        this.isPlaying = false;
        
        this.init();
    }

    init() {
        // Use existing audio element or create new one
        const existingAudio = document.getElementById('background-music');
        if (existingAudio && existingAudio instanceof HTMLAudioElement) {
            this.audio = existingAudio;
        } else {
            this.audio = new Audio();
        }

        this.audio.volume = this.config.volume || 0.3;
        this.audio.loop = this.config.loop || true;
        
        // Load first song
        if (this.playlist.length > 0) {
            this.audio.src = this.playlist[0];
        }

        // Setup event listeners
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            console.log('🎵 Music started playing');
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            console.log('🎵 Music paused');
        });

        this.audio.addEventListener('error', (e) => {
            console.error('🎵 Audio error:', e);
            this.handleError(e);
        });

        this.audio.addEventListener('ended', () => {
            if (this.config.enablePlaylist && this.playlist.length > 1) {
                this.nextSong();
            }
        });
    }

    async play() {
        if (!this.audio) return false;
        
        try {
            await this.audio.play();
            return true;
        } catch (error) {
            console.warn('Play failed:', error);
            return false;
        }
    }

    pause() {
        if (this.audio && !this.audio.paused) {
            this.audio.pause();
        }
    }

    async toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }

    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }

    nextSong() {
        if (this.playlist.length <= 1) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.audio.src = this.playlist[this.currentIndex];
        
        if (this.isPlaying) {
            this.play();
        }
    }

    handleError(error) {
        console.error('Audio error:', error);
        
        // Try next song if available
        if (this.playlist.length > 1) {
            console.log('Trying next song...');
            this.nextSong();
        }
    }

    handleUserInteraction() {
        // Enable audio context if needed
        if (this.audio && this.audio.paused) {
            console.log('🎵 User interaction detected, enabling audio');
        }
    }
}

// Global music system initializer
window.MusicSystemInitializer = MusicSystemInitializer;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.musicSystemInitializer) {
        window.musicSystemInitializer = new MusicSystemInitializer();
        await window.musicSystemInitializer.init();
    }
});

// Export for module systems
export { MusicSystemInitializer, SimpleAudioManager };
