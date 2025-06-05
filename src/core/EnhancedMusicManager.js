import { BaseAudioManager } from './BaseAudioManager.js';

/**
 * Enhanced Music Manager - Complete Music System
 * Provides cross-page music functionality with modern UI
 * Version: 3.0.0 - Now extends BaseAudioManager
 */

class EnhancedMusicManager extends BaseAudioManager {
    constructor(options = {}) {
        // Enhanced playlist with metadata
        const enhancedPlaylist = [
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
            playlist: options.playlist || enhancedPlaylist,
            enableVisualizer: options.enableVisualizer !== false,
            enablePlaylist: options.enablePlaylist !== false
        });

        // Enhanced metadata for songs
        this.songMetadata = [
            { title: "Arijit Singh Collection", artist: "Arijit Singh" },
            { title: "Nit Khair Manga", artist: "Rahat Fateh Ali Khan" },
            { title: "Kahani Suno", artist: "Kaifi Khalil" },
            { title: "Champakali", artist: "Traditional" },
            { title: "Jo Tum Mere Ho", artist: "Anuv Jain" },
            { title: "Paro", artist: "Anuv Jain" },
            { title: "Jugrafiyan", artist: "Arooj Aftab" }
        ];

        // Initialize with parent's init method
        this.onInitialized(() => {
            this.initializeEnhancedExtended();
        });
    }

    /**
     * Extended initialization specific to EnhancedMusicManager
     */
    initializeEnhancedExtended() {
        console.log('🎵 Initializing Enhanced Music Manager Extended Features');
        
        // Initialize enhanced metadata features
        this.initializeMetadataFeatures();
        this.createEnhancedMusicUI();

        console.log('🎵 Enhanced Music Manager fully initialized');
    }

    /**
     * Initialize metadata-specific features
     */
    initializeMetadataFeatures() {
        // Setup enhanced metadata handling
        this.setupMetadataDisplay();
    }

    /**
     * Get enhanced metadata for current song
     */
    getCurrentSongMetadata() {
        const metadata = this.songMetadata[this.state.currentSongIndex];
        return metadata || { title: "Unknown Song", artist: "Unknown Artist" };
    }

    /**
     * Setup metadata display features
     */
    setupMetadataDisplay() {
        // Enhanced metadata display logic
        this.onSongChange((index) => {
            this.updateMetadataDisplay(index);
        });
    }

    /**
     * Update metadata display
     */
    updateMetadataDisplay(index) {
        const metadata = this.songMetadata[index];
        if (metadata) {
            this.emit('metadataUpdate', metadata);
            
            // Update any existing metadata displays
            const titleElements = document.querySelectorAll('.song-title');
            const artistElements = document.querySelectorAll('.song-artist');
            
            titleElements.forEach(el => el.textContent = metadata.title);
            artistElements.forEach(el => el.textContent = metadata.artist);
        }
    }
    /**
     * Create enhanced music UI controls with metadata display
     */
    createEnhancedMusicUI() {
        // Check if PageSpecificMusicManager exists - if so, don't create UI to avoid overlap
        if (window.pageSpecificMusicManager) {
            console.log('🎵 PageSpecificMusicManager detected - skipping Enhanced Music Player UI creation');
            return;
        }

        // Remove existing UI
        const existingUI = document.getElementById('enhanced-music-player');
        if (existingUI) {
            existingUI.remove();
        }

        // Enhanced music player UI creation disabled for clean deployment
        const musicUI = document.createElement('div');
        musicUI.id = 'enhanced-music-player';
        musicUI.className = 'enhanced-music-player';
        musicUI.style.display = 'none'; // Hidden to prevent overlap
        musicUI.innerHTML = `
            <div class="enhanced-player-content">
                <div class="metadata-display">
                    <div class="song-title">Loading...</div>
                    <div class="song-artist">Loading...</div>
                </div>
                <!-- Enhanced music player disabled for clean deployment -->
            </div>
        `;

        // Enhanced music player styles disabled for clean deployment
        const styles = document.createElement('style');
        styles.textContent = `
            .enhanced-music-player {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            .metadata-display {
                text-align: center;
                padding: 10px;
            }
            .song-title {
                font-weight: bold;
                font-size: 1.1em;
                margin-bottom: 5px;
            }
            .song-artist {
                color: #888;
                font-size: 0.9em;
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(musicUI);

        // Setup enhanced UI event listeners
        this.setupEnhancedUIEventListeners();
    }

    /**
     * Setup enhanced UI event listeners with metadata updates
     */
    setupEnhancedUIEventListeners() {
        const playPauseBtn = document.querySelector('.play-pause-btn');
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.previous-btn');
        const volumeSlider = document.querySelector('.volume-slider');
        const progressBar = document.querySelector('.progress-bar');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.handleUserInteraction();
                this.toggle();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.handleUserInteraction();
                this.next();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.handleUserInteraction();
                this.previous();
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }

        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                if (this.audio && this.audio.duration) {
                    const rect = progressBar.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    this.audio.currentTime = percent * this.audio.duration;
                }
            });
        }
    }

    // All UI update, progress tracking, state management, and sync functionality
    // is now handled by the BaseAudioManager parent class

    // All utility methods (getCurrentSong, getPlaylist, getIsPlaying, getVolume, destroy)
    // are now inherited from BaseAudioManager
}

// Global instance
window.EnhancedMusicManager = EnhancedMusicManager;

// Auto-initialize if in browser (only if PageSpecificMusicManager is not available)
if (typeof window !== 'undefined') {
    window.musicManager = new EnhancedMusicManager();
    
    // Initialize when DOM is ready, but only if PageSpecificMusicManager is not available
    const initializeIfNeeded = () => {
        // Check if PageSpecificMusicManager is available and preferred
        if (window.pageSpecificMusicManager) {
            console.log('🎵 PageSpecificMusicManager detected - skipping EnhancedMusicManager initialization');
            return;
        }
        
        // Only initialize if the new music manager is not available
        window.musicManager.init();
    };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIfNeeded);    } else {
        // Add a small delay to allow PageSpecificMusicManager to load first
        setTimeout(initializeIfNeeded, 200);
    }
}

console.log('✅ Enhanced Music Manager loaded');
