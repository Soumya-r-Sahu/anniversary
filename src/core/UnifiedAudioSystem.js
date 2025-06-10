/**
 * Anniversary Website v4.0.0 - Unified Audio System
 * Professional, comprehensive audio management with cross-page sync
 * Consolidates AudioManager and MusicPlayer functionality
 */

import performanceUtils from '../utils/UnifiedPerformanceUtils.js';

class UnifiedAudioSystem {
    constructor(options = {}) {
        this.version = '4.0.0';
        this.config = {
            volume: 0.3,
            autoplay: false,
            loop: false,
            crossPageSync: true,
            enableVisualizer: false,
            fadeInDuration: 1000,
            fadeOutDuration: 500,
            preload: 'metadata',
            supportedFormats: ['mp3', 'm4a', 'ogg', 'wav'],
            ...options
        };

        // Audio state
        this.state = {
            isPlaying: false,
            isLoading: false,
            hasError: false,
            currentTime: 0,
            duration: 0,
            volume: this.config.volume,
            userInteracted: false,
            currentTrack: null,
            currentIndex: 0
        };

        // Audio elements and context
        this.audio = null;
        this.audioContext = null;
        this.gainNode = null;
        this.playlist = this.initializePlaylist();
        this.subscribers = new Map();

        // Performance optimized event handlers
        this.throttledTimeUpdate = performanceUtils.throttle(
            this.handleTimeUpdate.bind(this), 
            100
        );
        
        this.debouncedVolumeChange = performanceUtils.debounce(
            this.handleVolumeChange.bind(this), 
            50
        );

        // Initialize system
        this.initializeAudio();
        this.setupCrossPageSync();
        this.setupUserInteractionDetection();

        console.log('🎵 Unified Audio System v4.0.0 initialized');
    }

    /**
     * Initialize page-specific music playlist
     */
    initializePlaylist() {
        return {
            'index.html': {
                id: 'home-melody',
                title: "Arijit Singh Collection",
                src: "assets/music/Arijitsingh.m4a",
                artist: "Arijit Singh",
                mood: "romantic",
                description: "Main theme for our love story"
            },
            'countdown.html': {
                id: 'countdown-melody',
                title: "Celebration Song", 
                src: "assets/music/Arijitsingh.m4a",
                artist: "Arijit Singh",
                mood: "anticipation",
                description: "Counting down to our anniversary"
            },
            'love-letters.html': {
                id: 'letters-melody',
                title: "Paro",
                src: "assets/music/queue_song/05-paro.m4a",
                artist: "Anuv Jain",
                mood: "tender",
                description: "Sweet melodies for love letters"
            },
            'music-playlist.html': {
                id: 'playlist-melody',
                title: "Jo Tum Mere Ho",
                src: "assets/music/queue_song/04-jo-tum-mere-ho.m4a",
                artist: "Anuv Jain",
                mood: "devotional",
                description: "Music that connects our hearts"
            },
            'photo-gallery.html': {
                id: 'photos-melody',
                title: "Jugrafiyan",
                src: "assets/music/queue_song/06-Jugrafiyan.m4a",
                artist: "Arooj Aftab",
                mood: "nostalgic",
                description: "Melodies for captured memories"
            },
            'memories-timeline.html': {
                id: 'memories-melody',
                title: "Kahani Suno",
                src: "assets/music/queue_song/02-Kahani-Suno.m4a",
                artist: "Kaifi Khalil",
                mood: "storytelling",
                description: "The soundtrack to our journey"
            }
        };
    }

    /**
     * Initialize audio system
     */
    async initializeAudio() {
        try {
            // Create Audio Context for enhanced control
            if (window.AudioContext || window.webkitAudioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.gainNode = this.audioContext.createGain();
                this.gainNode.connect(this.audioContext.destination);
            }

            // Determine current page track
            this.setCurrentTrackByPage();
            
            // Load current track
            if (this.state.currentTrack) {
                await this.loadTrack(this.state.currentTrack);
            }

        } catch (error) {
            console.error('Audio initialization failed:', error);
            this.state.hasError = true;
        }
    }

    /**
     * Set current track based on current page
     */
    setCurrentTrackByPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const track = this.playlist[currentPage] || this.playlist['index.html'];
        
        this.state.currentTrack = track;
        this.notifySubscribers('trackChanged', track);
    }

    /**
     * Load audio track
     */
    async loadTrack(track) {
        this.state.isLoading = true;
        this.state.hasError = false;

        try {
            // Create new audio element
            if (this.audio) {
                this.cleanupAudio();
            }

            this.audio = new Audio();
            this.audio.src = track.src;
            this.audio.preload = this.config.preload;
            this.audio.volume = this.state.volume;
            this.audio.crossOrigin = 'anonymous';

            // Setup event listeners with performance optimization
            this.setupAudioEvents();

            // Connect to audio context if available
            if (this.audioContext && this.gainNode) {
                const source = this.audioContext.createMediaElementSource(this.audio);
                source.connect(this.gainNode);
            }

            console.log(`🎵 Loaded: ${track.title} by ${track.artist}`);
            
        } catch (error) {
            console.error('Track loading failed:', error);
            this.state.hasError = true;
        } finally {
            this.state.isLoading = false;
            this.notifySubscribers('loadingStateChanged', this.state.isLoading);
        }
    }

    /**
     * Setup audio event listeners with performance optimization
     */
    setupAudioEvents() {
        if (!this.audio) return;

        // Time update with throttling
        this.audio.addEventListener('timeupdate', this.throttledTimeUpdate);
        
        // Volume change with debouncing
        this.audio.addEventListener('volumechange', this.debouncedVolumeChange);

        // Standard events
        this.audio.addEventListener('loadedmetadata', () => {
            this.state.duration = this.audio.duration;
            this.notifySubscribers('metadataLoaded', { duration: this.state.duration });
        });

        this.audio.addEventListener('play', () => {
            this.state.isPlaying = true;
            this.notifySubscribers('playStateChanged', true);
        });

        this.audio.addEventListener('pause', () => {
            this.state.isPlaying = false;
            this.notifySubscribers('playStateChanged', false);
        });

        this.audio.addEventListener('ended', () => {
            this.handleTrackEnded();
        });

        this.audio.addEventListener('error', (e) => {
            this.state.hasError = true;
            console.error('Audio error:', e);
            this.notifySubscribers('error', e);
        });
    }

    /**
     * Play audio with user interaction check
     */
    async play() {
        if (!this.audio || !this.state.userInteracted) {
            console.log('🎵 Waiting for user interaction to play audio');
            return false;
        }

        try {
            // Resume audio context if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            await this.fadeIn();
            await this.audio.play();
            
            // Sync across pages
            this.syncPlayState(true);
            
            return true;
        } catch (error) {
            console.error('Play failed:', error);
            this.state.hasError = true;
            return false;
        }
    }

    /**
     * Pause audio with fade out
     */
    async pause() {
        if (!this.audio) return;

        try {
            await this.fadeOut();
            this.audio.pause();
            
            // Sync across pages
            this.syncPlayState(false);
            
        } catch (error) {
            console.error('Pause failed:', error);
        }
    }

    /**
     * Stop audio completely
     */
    stop() {
        if (!this.audio) return;

        this.audio.pause();
        this.audio.currentTime = 0;
        this.state.currentTime = 0;
        this.state.isPlaying = false;
        
        this.syncPlayState(false);
        this.notifySubscribers('stopped', null);
    }

    /**
     * Smooth fade in effect
     */
    async fadeIn() {
        if (!this.audio || !this.gainNode) return;

        return new Promise((resolve) => {
            const startVolume = 0;
            const endVolume = this.state.volume;
            const duration = this.config.fadeInDuration;
            const steps = 50;
            const stepDuration = duration / steps;
            const volumeStep = (endVolume - startVolume) / steps;

            let currentStep = 0;
            this.gainNode.gain.value = startVolume;

            const fadeInterval = setInterval(() => {
                currentStep++;
                const newVolume = startVolume + (volumeStep * currentStep);
                this.gainNode.gain.value = Math.min(newVolume, endVolume);

                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, stepDuration);
        });
    }

    /**
     * Smooth fade out effect
     */
    async fadeOut() {
        if (!this.audio || !this.gainNode) return;

        return new Promise((resolve) => {
            const startVolume = this.gainNode.gain.value;
            const endVolume = 0;
            const duration = this.config.fadeOutDuration;
            const steps = 25;
            const stepDuration = duration / steps;
            const volumeStep = (startVolume - endVolume) / steps;

            let currentStep = 0;

            const fadeInterval = setInterval(() => {
                currentStep++;
                const newVolume = startVolume - (volumeStep * currentStep);
                this.gainNode.gain.value = Math.max(newVolume, endVolume);

                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, stepDuration);
        });
    }

    /**
     * Set volume with smooth transition
     */
    setVolume(volume) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        this.state.volume = clampedVolume;

        if (this.audio) {
            this.audio.volume = clampedVolume;
        }

        if (this.gainNode) {
            this.gainNode.gain.value = clampedVolume;
        }

        this.notifySubscribers('volumeChanged', clampedVolume);
    }

    /**
     * Handle time update events
     */
    handleTimeUpdate() {
        if (this.audio) {
            this.state.currentTime = this.audio.currentTime;
            this.notifySubscribers('timeUpdate', {
                currentTime: this.state.currentTime,
                duration: this.state.duration,
                progress: this.state.duration ? this.state.currentTime / this.state.duration : 0
            });
        }
    }

    /**
     * Handle volume change events
     */
    handleVolumeChange() {
        if (this.audio) {
            this.state.volume = this.audio.volume;
            this.notifySubscribers('volumeChanged', this.state.volume);
        }
    }

    /**
     * Handle track ended
     */
    handleTrackEnded() {
        if (this.config.loop) {
            this.audio.currentTime = 0;
            this.play();
        } else {
            this.state.isPlaying = false;
            this.notifySubscribers('trackEnded', this.state.currentTrack);
        }
    }

    /**
     * Setup cross-page synchronization
     */
    setupCrossPageSync() {
        if (!this.config.crossPageSync) return;

        // Listen for sync messages
        window.addEventListener('storage', (e) => {
            if (e.key === 'anniversary_audio_sync') {
                const syncData = JSON.parse(e.newValue || '{}');
                this.handleSyncMessage(syncData);
            }
        });

        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.state.isPlaying) {
                // Page became visible, sync audio state
                this.syncFromStorage();
            }
        });
    }

    /**
     * Sync play state across pages
     */
    syncPlayState(isPlaying) {
        if (!this.config.crossPageSync) return;

        const syncData = {
            isPlaying,
            currentTime: this.state.currentTime,
            track: this.state.currentTrack,
            timestamp: Date.now()
        };

        localStorage.setItem('anniversary_audio_sync', JSON.stringify(syncData));
    }

    /**
     * Handle sync messages from other pages
     */
    handleSyncMessage(syncData) {
        if (!syncData.track || syncData.track.id !== this.state.currentTrack?.id) {
            return; // Different track, ignore
        }

        const timeDiff = Math.abs(this.state.currentTime - syncData.currentTime);
        
        // Sync if time difference is significant (>2 seconds)
        if (timeDiff > 2) {
            this.audio.currentTime = syncData.currentTime;
        }

        // Sync play state
        if (syncData.isPlaying !== this.state.isPlaying) {
            if (syncData.isPlaying) {
                this.play();
            } else {
                this.pause();
            }
        }
    }

    /**
     * Setup user interaction detection
     */
    setupUserInteractionDetection() {
        const enableAudio = () => {
            this.state.userInteracted = true;
            this.notifySubscribers('userInteracted', true);
            
            // Remove listeners after first interaction
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
        };

        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
    }

    /**
     * Subscribe to audio events
     */
    subscribe(event, callback) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event).push(callback);
    }

    /**
     * Notify subscribers of events
     */
    notifySubscribers(event, data) {
        const callbacks = this.subscribers.get(event) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in audio subscriber for ${event}:`, error);
            }
        });
    }

    /**
     * Get current audio state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Get current track info
     */
    getCurrentTrack() {
        return this.state.currentTrack;
    }

    /**
     * Get playlist for current or all pages
     */
    getPlaylist(page = null) {
        return page ? this.playlist[page] : this.playlist;
    }

    /**
     * Cleanup audio resources
     */
    cleanupAudio() {
        if (this.audio) {
            this.audio.pause();
            this.audio.removeEventListener('timeupdate', this.throttledTimeUpdate);
            this.audio.removeEventListener('volumechange', this.debouncedVolumeChange);
            this.audio.src = '';
            this.audio = null;
        }
    }

    /**
     * Destroy audio system
     */
    destroy() {
        this.cleanupAudio();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.subscribers.clear();
        performanceUtils.cleanup();
        
        console.log('🎵 Unified Audio System destroyed');
    }
}

// Create global instance
const audioSystem = new UnifiedAudioSystem();

// Global access
window.audioSystem = audioSystem;
window.UnifiedAudioSystem = UnifiedAudioSystem;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedAudioSystem;
}

export { UnifiedAudioSystem };
export default audioSystem;
