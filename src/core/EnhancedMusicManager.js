/**
 * Enhanced Music Manager - Complete Music System
 * Provides cross-page music functionality with modern UI
 */

class EnhancedMusicManager {
    constructor() {
        this.isInitialized = false;
        this.audio = null;
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.volume = 0.3;
        this.userInteracted = false;
        
        // Music playlist
        this.playlist = [
            {
                title: "Arijit Singh Collection", 
                src: "music/Arijitsingh.m4a",
                artist: "Arijit Singh"
            },
            {
                title: "Nit Khair Manga", 
                src: "music/queue_song/01-nit-khair-manga.m4a",
                artist: "Rahat Fateh Ali Khan"
            },
            {
                title: "Kahani Suno", 
                src: "music/queue_song/02-Kahani-Suno.m4a",
                artist: "Kaifi Khalil"
            },
            {
                title: "Champakali", 
                src: "music/queue_song/03-champakali.m4a",
                artist: "Traditional"
            },
            {
                title: "Jo Tum Mere Ho", 
                src: "music/queue_song/04-jo-tum-mere-ho.m4a",
                artist: "Anuv Jain"
            },
            {
                title: "Paro", 
                src: "music/queue_song/05-paro.m4a",
                artist: "Anuv Jain"
            },
            {
                title: "Jugrafiyan", 
                src: "music/queue_song/06-Jugrafiyan.m4a",
                artist: "Arooj Aftab"
            }
        ];

        // Storage key for cross-page sync
        this.storageKey = 'anniversaryMusicState';
        
        // Bind methods
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.handleUserInteraction = this.handleUserInteraction.bind(this);
    }

    /**
     * Initialize the music manager
     */
    async init() {
        if (this.isInitialized) {
            return;
        }

        console.log('🎵 Initializing Enhanced Music Manager...');

        try {
            // Create audio element
            this.createAudioElement();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Restore previous state
            this.restoreState();
            
            // Create UI controls
            this.createMusicUI();
            
            // Setup cross-page sync
            this.setupCrossPageSync();
            
            // Setup user interaction detection
            this.setupUserInteractionDetection();
            
            this.isInitialized = true;
            console.log('✅ Enhanced Music Manager initialized successfully');
            
            // Try to restore playback if user previously interacted
            if (this.userInteracted) {
                this.attemptAutoplay();
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize Enhanced Music Manager:', error);
        }
    }

    /**
     * Create audio element
     */
    createAudioElement() {
        // Remove existing audio if any
        const existingAudio = document.getElementById('anniversary-audio');
        if (existingAudio) {
            existingAudio.remove();
        }

        this.audio = document.createElement('audio');
        this.audio.id = 'anniversary-audio';
        this.audio.preload = 'metadata';
        this.audio.volume = this.volume;
        this.audio.loop = false; // We'll handle playlist looping manually
        
        // Set initial song
        this.loadSong(this.currentSongIndex);
        
        document.body.appendChild(this.audio);
    }

    /**
     * Setup event listeners for audio element
     */
    setupEventListeners() {
        if (!this.audio) return;

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateUI();
            this.saveState();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateUI();
            this.saveState();
        });

        this.audio.addEventListener('ended', () => {
            this.next();
        });

        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.next(); // Skip to next song on error
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.updateUI();
        });
    }

    /**
     * Load a specific song
     */
    loadSong(index) {
        if (index < 0 || index >= this.playlist.length) {
            index = 0; // Loop back to start
        }

        this.currentSongIndex = index;
        const song = this.playlist[index];
        
        if (this.audio) {
            this.audio.src = song.src;
            this.audio.load();
        }
        
        console.log(`🎵 Loaded: ${song.title} by ${song.artist}`);
        this.updateUI();
        this.saveState();
    }

    /**
     * Play music
     */
    async play() {
        if (!this.audio || !this.userInteracted) {
            console.log('⚠️ Cannot play: User interaction required');
            return;
        }

        try {
            await this.audio.play();
            console.log('▶️ Playing music');
        } catch (error) {
            console.error('❌ Play failed:', error);
        }
    }

    /**
     * Pause music
     */
    pause() {
        if (this.audio) {
            this.audio.pause();
            console.log('⏸️ Music paused');
        }
    }

    /**
     * Next song
     */
    next() {
        const nextIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.loadSong(nextIndex);
        if (this.isPlaying && this.userInteracted) {
            setTimeout(() => this.play(), 100);
        }
    }

    /**
     * Previous song
     */
    previous() {
        const prevIndex = this.currentSongIndex === 0 
            ? this.playlist.length - 1 
            : this.currentSongIndex - 1;
        this.loadSong(prevIndex);
        if (this.isPlaying && this.userInteracted) {
            setTimeout(() => this.play(), 100);
        }
    }

    /**
     * Set volume
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.updateUI();
        this.saveState();
    }

    /**
     * Toggle play/pause
     */
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Handle user interaction (required for autoplay)
     */
    handleUserInteraction() {
        this.userInteracted = true;
        this.saveState();
        console.log('✅ User interaction detected - music can now play');
    }

    /**
     * Attempt autoplay after user interaction
     */
    attemptAutoplay() {
        if (this.userInteracted && this.audio && !this.audio.src) {
            this.loadSong(this.currentSongIndex);
        }
    }

    /**
     * Create music UI controls
     */    createMusicUI() {
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
        musicUI.innerHTML = `<!-- Enhanced music player disabled for clean deployment -->`;

        // Enhanced music player styles disabled for clean deployment
        const styles = document.createElement('style');
        styles.textContent = `
            .enhanced-music-player {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(musicUI);

        // Setup UI event listeners
        this.setupUIEventListeners();
    }

    /**
     * Setup UI event listeners
     */
    setupUIEventListeners() {
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

    /**
     * Update UI elements
     */
    updateUI() {
        const playPauseBtn = document.querySelector('.play-pause-btn');
        const songTitle = document.querySelector('.song-title');
        const songArtist = document.querySelector('.song-artist');

        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        }

        if (this.playlist[this.currentSongIndex]) {
            const currentSong = this.playlist[this.currentSongIndex];
            if (songTitle) songTitle.textContent = currentSong.title;
            if (songArtist) songArtist.textContent = currentSong.artist;
        }
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        if (!this.audio) return;

        const progressFill = document.querySelector('.progress-fill');
        const currentTimeEl = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');

        if (progressFill && this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            progressFill.style.width = percent + '%';
        }

        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.audio.currentTime || 0);
        }

        if (durationEl) {
            durationEl.textContent = this.formatTime(this.audio.duration || 0);
        }
    }

    /**
     * Format time in mm:ss
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Setup cross-page sync
     */
    setupCrossPageSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.restoreState();
            }
        });

        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    }

    /**
     * Setup user interaction detection
     */
    setupUserInteractionDetection() {
        const events = ['click', 'touchstart', 'keydown'];
        const handler = () => {
            this.handleUserInteraction();
            events.forEach(event => {
                document.removeEventListener(event, handler);
            });
        };

        events.forEach(event => {
            document.addEventListener(event, handler, { once: true });
        });
    }

    /**
     * Save state to localStorage
     */
    saveState() {
        const state = {
            currentSongIndex: this.currentSongIndex,
            isPlaying: this.isPlaying,
            volume: this.volume,
            userInteracted: this.userInteracted,
            currentTime: this.audio ? this.audio.currentTime : 0
        };

        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    /**
     * Restore state from localStorage
     */
    restoreState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const state = JSON.parse(saved);
                this.currentSongIndex = state.currentSongIndex || 0;
                this.volume = state.volume || 0.3;
                this.userInteracted = state.userInteracted || false;

                if (this.audio) {
                    this.audio.volume = this.volume;
                    if (state.currentTime && state.isPlaying) {
                        this.audio.currentTime = state.currentTime;
                    }
                }

                console.log('🔄 Music state restored');
            }
        } catch (error) {
            console.error('❌ Failed to restore music state:', error);
        }
    }

    /**
     * Get current song info
     */
    getCurrentSong() {
        return this.playlist[this.currentSongIndex];
    }

    /**
     * Get playlist
     */
    getPlaylist() {
        return this.playlist;
    }

    /**
     * Check if music is playing
     */
    getIsPlaying() {
        return this.isPlaying;
    }

    /**
     * Get current volume
     */
    getVolume() {
        return this.volume;
    }

    /**
     * Destroy the music manager
     */
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio.remove();
        }

        const ui = document.getElementById('enhanced-music-player');
        if (ui) {
            ui.remove();
        }

        this.isInitialized = false;
        console.log('🔥 Enhanced Music Manager destroyed');
    }
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
