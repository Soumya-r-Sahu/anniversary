/**
 * Music Player Manager
 * Enhanced music management system for the anniversary website
 * Renamed from EnhancedMusicManager for clarity
 * Version: 2.0.0
 */

class MusicPlayerManager {
    constructor(options = {}) {
        // Core configuration
        this.config = {
            volume: options.volume || 0.3,
            autoplay: options.autoplay !== false,
            crossPageSync: options.crossPageSync !== false,
            storageKey: options.storageKey || 'anniversaryMusicState',
            enableVisualizer: options.enableVisualizer !== false,
            enablePlaylist: options.enablePlaylist !== false,
            performance: options.performance || 'auto', // 'auto', 'high', 'low'
            ...options
        };

        // State management
        this.state = {
            isPlaying: false,
            currentTime: 0,
            currentSongIndex: 0,
            volume: this.config.volume,
            isLoading: false,
            hasError: false,
            userInteracted: false,
            autoplayAttempted: false
        };

        // Audio queue and management
        this.playlist = [
            'music/song1.m4a',
            'music/queue_song/01-anniversary-celebration.m4a',
            'music/queue_song/02-love-story-theme.m4a'
        ];

        // Performance optimization
        this.performance = {
            isLowPower: this.detectLowPowerMode(),
            saveStateThrottled: this.throttle(this.saveState.bind(this), 2000),
            updateUIThrottled: this.throttle(this.updateUI.bind(this), 100)
        };

        // Audio elements
        this.audio = null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;

        // UI elements
        this.ui = {
            player: null,
            playButton: null,
            pauseButton: null,
            volumeSlider: null,
            progressBar: null,
            currentTimeDisplay: null,
            durationDisplay: null,
            playlistContainer: null,
            visualizer: null
        };

        // Event handlers
        this.boundHandlers = {
            onAudioEnd: this.onAudioEnd.bind(this),
            onAudioError: this.onAudioError.bind(this),
            onAudioLoad: this.onAudioLoad.bind(this),
            onTimeUpdate: this.onTimeUpdate.bind(this),
            onVolumeChange: this.onVolumeChange.bind(this),
            onUserInteraction: this.onUserInteraction.bind(this)
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize the music player manager
     */
    async init() {
        try {
            // Restore previous state
            await this.restoreState();

            // Setup audio
            this.setupAudio();

            // Setup DOM elements
            this.setupDOM();

            // Setup cross-page sync
            if (this.config.crossPageSync) {
                this.setupCrossPageSync();
            }

            // Setup user interaction detection
            this.setupUserInteraction();

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            // Initial UI update
            this.updateUIThrottled();

            console.log('🎵 Music Player Manager initialized');
        } catch (error) {
            console.error('Failed to initialize music player manager:', error);
            this.handleError(error);
        }
    }

    /**
     * Setup audio elements and context
     */
    setupAudio() {
        // Create audio element
        this.audio = new Audio();
        this.audio.crossOrigin = 'anonymous';
        this.audio.preload = 'metadata';
        this.audio.volume = this.state.volume;

        // Setup audio event listeners
        this.audio.addEventListener('ended', this.boundHandlers.onAudioEnd);
        this.audio.addEventListener('error', this.boundHandlers.onAudioError);
        this.audio.addEventListener('loadedmetadata', this.boundHandlers.onAudioLoad);
        this.audio.addEventListener('timeupdate', this.boundHandlers.onTimeUpdate);
        this.audio.addEventListener('volumechange', this.boundHandlers.onVolumeChange);

        // Setup audio context for visualizer
        if (this.config.enableVisualizer && window.AudioContext) {
            this.setupAudioContext();
        }

        // Load current song
        if (this.playlist.length > 0) {
            this.loadSong(this.state.currentSongIndex);
        }
    }

    /**
     * Setup audio context for visualizer
     */
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            // Connect audio source to analyser
            const source = this.audioContext.createMediaElementSource(this.audio);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            console.log('🎵 Audio context initialized for visualizer');
        } catch (error) {
            console.warn('Failed to setup audio context:', error);
            this.config.enableVisualizer = false;
        }
    }

    /**
     * Setup DOM elements
     */
    setupDOM() {
        // Find or create music player UI
        this.ui.player = document.querySelector('.music-player') || this.createMusicPlayerUI();

        // Get UI elements
        this.ui.playButton = this.ui.player.querySelector('.play-btn');
        this.ui.pauseButton = this.ui.player.querySelector('.pause-btn');
        this.ui.volumeSlider = this.ui.player.querySelector('.volume-slider');
        this.ui.progressBar = this.ui.player.querySelector('.progress-bar');
        this.ui.currentTimeDisplay = this.ui.player.querySelector('.current-time');
        this.ui.durationDisplay = this.ui.player.querySelector('.duration');
        this.ui.playlistContainer = this.ui.player.querySelector('.playlist-container');
        this.ui.visualizer = this.ui.player.querySelector('.visualizer');

        // Setup event listeners
        this.setupUIEventListeners();

        // Setup playlist UI
        if (this.config.enablePlaylist) {
            this.setupPlaylistUI();
        }

        // Setup visualizer UI
        if (this.config.enableVisualizer && this.ui.visualizer) {
            this.setupVisualizerUI();
        }
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
     * Setup UI event listeners
     */
    setupUIEventListeners() {
        if (this.ui.playButton) {
            this.ui.playButton.addEventListener('click', () => this.play());
        }

        if (this.ui.pauseButton) {
            this.ui.pauseButton.addEventListener('click', () => this.pause());
        }

        if (this.ui.volumeSlider) {
            this.ui.volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseFloat(e.target.value));
            });
        }

        if (this.ui.progressBar) {
            this.ui.progressBar.addEventListener('click', (e) => {
                const rect = this.ui.progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.seekTo(percent * this.audio.duration);
            });
        }
    }

    /**
     * Play music
     */
    async play() {
        try {
            if (!this.audio.src) {
                this.loadSong(this.state.currentSongIndex);
            }

            this.state.isLoading = true;
            this.updateUIThrottled();

            await this.audio.play();
            
            this.state.isPlaying = true;
            this.state.isLoading = false;
            this.state.hasError = false;
            
            this.updateUIThrottled();
            this.saveStateThrottled();

            console.log('🎵 Music started playing');
        } catch (error) {
            console.error('Failed to play music:', error);
            this.handleError(error);
        }
    }

    /**
     * Pause music
     */
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.state.isPlaying = false;
            this.updateUIThrottled();
            this.saveStateThrottled();
            console.log('🎵 Music paused');
        }
    }

    /**
     * Stop music
     */
    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.state.isPlaying = false;
            this.state.currentTime = 0;
            this.updateUIThrottled();
            this.saveStateThrottled();
            console.log('🎵 Music stopped');
        }
    }

    /**
     * Set volume
     */
    setVolume(volume) {
        volume = Math.max(0, Math.min(1, volume));
        this.state.volume = volume;
        
        if (this.audio) {
            this.audio.volume = volume;
        }
        
        this.updateUIThrottled();
        this.saveStateThrottled();
    }

    /**
     * Load song by index
     */
    loadSong(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.state.currentSongIndex = index;
            this.audio.src = this.playlist[index];
            this.audio.load();
            console.log(`🎵 Loading song: ${this.playlist[index]}`);
        }
    }

    /**
     * Utility methods
     */
    detectLowPowerMode() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isLowEnd = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        return isLowEnd || isLowMemory;
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Stop audio
        this.stop();

        // Remove event listeners
        if (this.audio) {
            this.audio.removeEventListener('ended', this.boundHandlers.onAudioEnd);
            this.audio.removeEventListener('error', this.boundHandlers.onAudioError);
            this.audio.removeEventListener('loadedmetadata', this.boundHandlers.onAudioLoad);
            this.audio.removeEventListener('timeupdate', this.boundHandlers.onTimeUpdate);
            this.audio.removeEventListener('volumechange', this.boundHandlers.onVolumeChange);
        }

        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
        }

        console.log('🎵 Music Player Manager destroyed');
    }
}

// Export for module systems
export { MusicPlayerManager };

// Legacy export for backward compatibility
export { MusicPlayerManager as EnhancedMusicManager };
