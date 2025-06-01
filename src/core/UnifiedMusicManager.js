/**
 * Unified Music Manager - Consolidates all music functionality
 * Replaces multiple music managers with a single, optimized solution
 * Version: 2.0.0
 */

class UnifiedMusicManager {
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
            'music/Arijitsingh.m4a',
            'music/queue_song/01-nit-khair-manga.m4a',
            'music/queue_song/02-Kahani-Suno.m4a',
            'music/queue_song/03-champakali.m4a',
            'music/queue_song/04-jo-tum-mere-ho.m4a',
            'music/queue_song/05-paro.m4a',
            'music/queue_song/06-Jugrafiyan.m4a'
        ];

        // Performance optimization
        this.performance = {
            isLowPower: this.detectLowPowerMode(),
            saveStateThrottled: this.throttle(this.saveState.bind(this), 2000),
            updateUIThrottled: this.throttle(this.updateUI.bind(this), 100)
        };

        // DOM references
        this.elements = {};
        this.audio = null;
        this.visualizerContext = null;

        // Event handlers
        this.boundHandlers = {
            onPlay: this.onPlay.bind(this),
            onPause: this.onPause.bind(this),
            onError: this.onError.bind(this),
            onTimeUpdate: this.onTimeUpdate.bind(this),
            onLoadedMetadata: this.onLoadedMetadata.bind(this),
            onEnded: this.onEnded.bind(this),
            onStorageChange: this.onStorageChange.bind(this),
            onVisibilityChange: this.onVisibilityChange.bind(this),
            onBeforeUnload: this.onBeforeUnload.bind(this),
            onUserInteraction: this.onUserInteraction.bind(this)
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize the unified music manager
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

            console.log('🎵 Unified Music Manager initialized');
        } catch (error) {
            console.error('Failed to initialize music manager:', error);
            this.handleError(error);
        }
    }

    /**
     * Setup audio element with optimized configuration
     */
    setupAudio() {
        // Check if there's an existing audio element in the DOM
        const existingAudio = document.getElementById('background-music');
        if (existingAudio && existingAudio instanceof HTMLAudioElement) {
            this.audio = existingAudio;
            console.log('🎵 Using existing audio element');
        } else {
            this.audio = new Audio();
            console.log('🎵 Created new audio element');
        }

        this.audio.preload = this.performance.isLowPower ? 'none' : 'metadata';
        this.audio.volume = this.state.volume;
        this.audio.crossOrigin = 'anonymous';
        this.audio.loop = true; // Enable looping

        // Load the first song
        this.loadSong(this.state.currentSongIndex);

        // Audio event listeners
        this.audio.addEventListener('play', this.boundHandlers.onPlay, { passive: true });
        this.audio.addEventListener('pause', this.boundHandlers.onPause, { passive: true });
        this.audio.addEventListener('error', this.boundHandlers.onError, { passive: true });
        this.audio.addEventListener('timeupdate', this.boundHandlers.onTimeUpdate, { passive: true });
        this.audio.addEventListener('loadedmetadata', this.boundHandlers.onLoadedMetadata, { passive: true });
        this.audio.addEventListener('ended', this.boundHandlers.onEnded, { passive: true });

        // Load current song
        this.loadSong(this.state.currentSongIndex);
    }

    /**
     * Setup DOM elements with error handling
     */
    setupDOM() {
        this.elements = {
            toggle: document.getElementById('music-toggle'),
            icon: document.getElementById('music-icon'),
            visualizer: document.getElementById('music-visualizer'),
            volumeSlider: document.getElementById('volume-slider'),
            progressBar: document.getElementById('progress-bar'),
            timeDisplay: document.getElementById('time-display')
        };

        // Setup toggle button
        if (this.elements.toggle) {
            this.elements.toggle.addEventListener('click', () => this.toggle());
            this.elements.toggle.setAttribute('aria-label', 'Toggle Background Music');
        }

        // Setup volume control
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseFloat(e.target.value));
            });
            this.elements.volumeSlider.value = this.state.volume;
        }

        // Setup progress bar
        if (this.elements.progressBar) {
            this.elements.progressBar.addEventListener('click', (e) => {
                const rect = e.target.getBoundingClientRect();
                const progress = (e.clientX - rect.left) / rect.width;
                this.seekTo(progress);
            });
        }
    }

    /**
     * Setup cross-page synchronization
     */
    setupCrossPageSync() {
        // Storage event listener for cross-page sync
        window.addEventListener('storage', this.boundHandlers.onStorageChange, { passive: true });

        // Page visibility change
        document.addEventListener('visibilitychange', this.boundHandlers.onVisibilityChange, { passive: true });

        // Before unload
        window.addEventListener('beforeunload', this.boundHandlers.onBeforeUnload);
    }

    /**
     * Setup user interaction detection for autoplay
     */
    setupUserInteraction() {
        const events = ['click', 'touchstart', 'keydown', 'scroll'];

        const handleFirstInteraction = () => {
            if (!this.state.userInteracted) {
                this.state.userInteracted = true;
                this.attemptAutoplay();

                // Remove listeners after first interaction
                events.forEach(event => {
                    document.removeEventListener(event, handleFirstInteraction);
                });
            }
        };

        events.forEach(event => {
            document.addEventListener(event, handleFirstInteraction, {
                once: true,
                passive: true
            });
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor audio performance
        if (this.audio && 'performance' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name.includes('audio') && entry.duration > 100) {
                        console.warn(`Slow audio operation: ${entry.name} took ${entry.duration}ms`);
                    }
                }
            });

            observer.observe({ entryTypes: ['measure'] });
        }
    }

    /**
     * Load song by index with error handling
     */
    loadSong(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.state.currentSongIndex = index;
            this.state.isLoading = true;
            this.state.hasError = false;

            const newSrc = this.playlist[index];

            // Only change src if different
            if (this.audio.src !== new URL(newSrc, window.location.href).href) {
                this.audio.src = newSrc;
            }

            this.updateUIThrottled();
        }
    }

    /**
     * Play audio with enhanced error handling
     */
    async play() {
        if (!this.audio || this.state.hasError) return false;

        try {
            this.state.isLoading = true;
            this.updateUIThrottled();

            const playPromise = this.audio.play();

            if (playPromise !== undefined) {
                await playPromise;
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Play failed:', error.message);
            this.handlePlayError(error);
            return false;
        }
    }

    /**
     * Pause audio
     */
    pause() {
        if (this.audio && this.audio instanceof HTMLAudioElement && !this.audio.paused) {
            this.audio.pause();
        }
    }

    /**
     * Toggle play/pause
     */
    async toggle() {
        if (this.state.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }

    /**
     * Load a song from the playlist
     */
    loadSong(index) {
        if (!this.audio || !this.playlist || index >= this.playlist.length) {
            console.warn('Cannot load song: invalid index or missing audio');
            return;
        }

        const songPath = this.playlist[index];
        console.log(`🎵 Loading song: ${songPath}`);

        this.state.currentSongIndex = index;
        this.audio.src = songPath;

        // Reset error state
        this.state.hasError = false;

        // Save state
        this.performance.saveStateThrottled();
    }

    /**
     * Next song in playlist
     */
    nextSong() {
        if (!this.config.enablePlaylist || !this.playlist) return;

        const nextIndex = (this.state.currentSongIndex + 1) % this.playlist.length;
        this.loadSong(nextIndex);

        if (this.state.isPlaying) {
            this.play();
        }
    }

    /**
     * Previous song in playlist
     */
    previousSong() {
        if (!this.config.enablePlaylist || !this.playlist) return;

        const prevIndex = this.state.currentSongIndex === 0
            ? this.playlist.length - 1
            : this.state.currentSongIndex - 1;
        this.loadSong(prevIndex);

        if (this.state.isPlaying) {
            this.play();
        }
    }

    /**
     * Set volume with validation
     */
    setVolume(volume) {
        const newVolume = Math.max(0, Math.min(1, volume));
        this.state.volume = newVolume;

        if (this.audio) {
            this.audio.volume = newVolume;
        }

        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.value = newVolume;
        }

        this.performance.saveStateThrottled();
    }

    /**
     * Seek to position (0-1)
     */
    seekTo(progress) {
        if (this.audio && this.audio.duration) {
            const newTime = progress * this.audio.duration;
            this.audio.currentTime = newTime;
            this.state.currentTime = newTime;
        }
    }

    /**
     * Next song in playlist
     */
    nextSong() {
        if (!this.config.enablePlaylist) return;

        const nextIndex = (this.state.currentSongIndex + 1) % this.playlist.length;
        this.loadSong(nextIndex);

        if (this.state.isPlaying) {
            this.play();
        }
    }

    /**
     * Previous song in playlist
     */
    previousSong() {
        if (!this.config.enablePlaylist) return;

        const prevIndex = this.state.currentSongIndex === 0
            ? this.playlist.length - 1
            : this.state.currentSongIndex - 1;
        this.loadSong(prevIndex);

        if (this.state.isPlaying) {
            this.play();
        }
    }

    /**
     * Attempt autoplay after user interaction
     */
    async attemptAutoplay() {
        if (this.state.autoplayAttempted || !this.config.autoplay) return;

        this.state.autoplayAttempted = true;

        try {
            if (this.state.isPlaying || (this.audio && !this.audio.paused)) {
                await this.play();
                console.log('🎵 Autoplay successful!');
            }
        } catch (error) {
            console.log('🔇 Autoplay prevented by browser policy');
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update toggle button
        if (this.elements.icon) {
            this.elements.icon.textContent = this.state.isPlaying ? '🎵' : '🔇';
        }

        if (this.elements.toggle) {
            const isPlaying = this.state.isPlaying;
            this.elements.toggle.style.background = isPlaying
                ? 'linear-gradient(135deg, #ec4899, #f472b6, #fb7185)'
                : 'linear-gradient(135deg, #6b7280, #9ca3af)';
            this.elements.toggle.setAttribute('aria-label',
                isPlaying ? 'Pause Background Music' : 'Play Background Music'
            );
            this.elements.toggle.classList.toggle('playing', isPlaying);
        }

        // Update visualizer
        if (this.elements.visualizer) {
            this.elements.visualizer.style.display = this.state.isPlaying ? 'flex' : 'none';
        }

        // Update progress bar
        this.updateProgress();

        // Update time display
        this.updateTimeDisplay();
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        if (this.elements.progressBar && this.audio && this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.elements.progressBar.style.width = `${progress}%`;
        }
    }

    /**
     * Update time display
     */
    updateTimeDisplay() {
        if (this.elements.timeDisplay && this.audio) {
            const current = this.formatTime(this.audio.currentTime || 0);
            const duration = this.formatTime(this.audio.duration || 0);
            this.elements.timeDisplay.textContent = `${current} / ${duration}`;
        }
    }

    /**
     * Format time in MM:SS format
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Save state to localStorage with throttling
     */
    saveState() {
        if (!this.config.crossPageSync) return;

        const state = {
            isPlaying: this.state.isPlaying,
            currentTime: this.state.currentTime,
            volume: this.state.volume,
            currentSongIndex: this.state.currentSongIndex,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(state));
        } catch (error) {
            console.warn('Could not save music state:', error);
        }
    }

    /**
     * Restore state from localStorage
     */
    async restoreState() {
        if (!this.config.crossPageSync) return;

        try {
            const saved = localStorage.getItem(this.config.storageKey);
            if (saved) {
                const state = JSON.parse(saved);

                // Only restore if recent (within 5 minutes)
                if (Date.now() - state.timestamp < 5 * 60 * 1000) {
                    this.state.isPlaying = state.isPlaying || false;
                    this.state.currentTime = state.currentTime || 0;
                    this.state.volume = Math.max(0, Math.min(1, state.volume || 0.3));
                    this.state.currentSongIndex = state.currentSongIndex || 0;
                }
            }
        } catch (error) {
            console.warn('Could not restore music state:', error);
        }
    }

    /**
     * Handle cross-page synchronization
     */
    handleCrossPageSync(newState) {
        if (!newState || !this.config.crossPageSync) return;

        // Update state from other page
        this.state.isPlaying = newState.isPlaying;
        this.state.currentTime = newState.currentTime || 0;
        this.state.volume = newState.volume || 0.3;
        this.state.currentSongIndex = newState.currentSongIndex || 0;

        // Apply changes
        if (this.audio) {
            this.audio.volume = this.state.volume;

            if (this.state.currentSongIndex !== this.state.currentSongIndex) {
                this.loadSong(this.state.currentSongIndex);
            }

            if (Math.abs(this.audio.currentTime - this.state.currentTime) > 2) {
                this.audio.currentTime = this.state.currentTime;
            }

            if (this.state.isPlaying && this.audio.paused) {
                this.play();
            } else if (!this.state.isPlaying && !this.audio.paused) {
                this.pause();
            }
        }

        this.updateUIThrottled();
    }

    /**
     * Event Handlers
     */
    onPlay() {
        this.state.isPlaying = true;
        this.state.isLoading = false;
        this.updateUIThrottled();
        this.performance.saveStateThrottled();
    }

    onPause() {
        this.state.isPlaying = false;
        this.updateUIThrottled();
        this.performance.saveStateThrottled();
    }

    onError(event) {
        this.state.hasError = true;
        this.state.isLoading = false;
        this.state.isPlaying = false;
        console.error('Audio error:', event);
        this.handleError(event);
        this.updateUIThrottled();
    }

    onTimeUpdate() {
        if (this.audio) {
            this.state.currentTime = this.audio.currentTime;
            this.updateProgress();
            this.updateTimeDisplay();
        }
    }

    onLoadedMetadata() {
        if (this.state.currentTime > 0 && this.audio.duration) {
            this.audio.currentTime = Math.min(this.state.currentTime, this.audio.duration);
        }
        this.state.isLoading = false;
        this.updateUIThrottled();
    }

    onEnded() {
        if (this.config.enablePlaylist) {
            this.nextSong();
        } else {
            this.state.isPlaying = false;
            this.updateUIThrottled();
        }
    }

    onStorageChange(event) {
        if (event.key === this.config.storageKey && event.newValue) {
            try {
                const newState = JSON.parse(event.newValue);
                this.handleCrossPageSync(newState);
            } catch (error) {
                console.warn('Invalid storage state:', error);
            }
        }
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.performance.saveStateThrottled();
        } else {
            this.restoreState();
        }
    }

    onBeforeUnload() {
        this.saveState();
    }

    onUserInteraction() {
        if (!this.state.userInteracted) {
            this.state.userInteracted = true;
            this.attemptAutoplay();
        }
    }

    /**
     * Error handling
     */
    handleError(error) {
        this.state.hasError = true;
        this.state.isPlaying = false;

        if (this.elements.icon) {
            this.elements.icon.textContent = '❌';
        }

        if (this.elements.toggle) {
            this.elements.toggle.title = 'Audio error - please check music files';
        }
    }

    handlePlayError(error) {
        if (error.name === 'NotAllowedError') {
            console.log('Autoplay prevented - waiting for user interaction');
        } else if (error.name === 'NotSupportedError') {
            console.error('Audio format not supported');
            this.nextSong(); // Try next song
        } else {
            console.error('Play error:', error);
        }
    }

    /**
     * Utility functions
     */
    detectLowPowerMode() {
        // Basic low power detection
        return navigator.hardwareConcurrency <= 2 ||
               navigator.deviceMemory <= 2 ||
               /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
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
        // Remove event listeners
        if (this.audio) {
            this.audio.removeEventListener('play', this.boundHandlers.onPlay);
            this.audio.removeEventListener('pause', this.boundHandlers.onPause);
            this.audio.removeEventListener('error', this.boundHandlers.onError);
            this.audio.removeEventListener('timeupdate', this.boundHandlers.onTimeUpdate);
            this.audio.removeEventListener('loadedmetadata', this.boundHandlers.onLoadedMetadata);
            this.audio.removeEventListener('ended', this.boundHandlers.onEnded);

            this.audio.pause();
            this.audio.src = '';
            this.audio = null;
        }

        window.removeEventListener('storage', this.boundHandlers.onStorageChange);
        document.removeEventListener('visibilitychange', this.boundHandlers.onVisibilityChange);
        window.removeEventListener('beforeunload', this.boundHandlers.onBeforeUnload);

        console.log('🎵 Unified Music Manager destroyed');
    }

    /**
     * Clear stored state (for "Clear Previous Visits" functionality)
     */
    clearStoredState() {
        try {
            localStorage.removeItem(this.config.storageKey);

            // Clear other anniversary-related storage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (
                    key.includes('anniversary') ||
                    key.includes('countdown') ||
                    key.includes('love') ||
                    key.includes('music')
                )) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));
            sessionStorage.clear();

            // Reset state
            this.state.isPlaying = false;
            this.state.currentTime = 0;
            this.state.currentSongIndex = 0;
            this.state.volume = 0.3;

            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.loadSong(0);
            }

            this.updateUIThrottled();

            console.log('🧹 Music state cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing music state:', error);
            return false;
        }
    }
}

// Global instance management
window.UnifiedMusicManager = UnifiedMusicManager;

// Auto-initialize when DOM is ready (if not manually initialized)
document.addEventListener('DOMContentLoaded', function() {
    if (!window.musicManager) {
        window.musicManager = new UnifiedMusicManager();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedMusicManager;
}

// ES6 export
export { UnifiedMusicManager };
