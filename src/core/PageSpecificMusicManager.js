/**
 * Page-Specific Music Manager with Popup UI
 * Each page has a designated song that plays in sync across pages
 */

class PageSpecificMusicManager {
    constructor() {
        this.isInitialized = false;
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.3;
        this.userInteracted = false;
        this.popupVisible = false;
        
        // Page-specific song mapping
        this.pageSongs = {
            'index.html': {
                title: "Arijit Singh Collection",
                src: "music/Arijitsingh.m4a",
                artist: "Arijit Singh"
            },
            'countdown.html': {
                title: "Arijit Singh Collection", 
                src: "music/Arijitsingh.m4a",
                artist: "Arijit Singh"
            },
            'anniversary.html': {
                title: "Nit Khair Manga",
                src: "music/queue_song/01-nit-khair-manga.m4a",
                artist: "Rahat Fateh Ali Khan"
            },
            'memories-timeline.html': {
                title: "Kahani Suno",
                src: "music/queue_song/02-Kahani-Suno.m4a",
                artist: "Kaifi Khalil"
            },
            'love-story.html': {
                title: "Champakali",
                src: "music/queue_song/03-champakali.m4a", 
                artist: "Traditional"
            },
            'music-playlist.html': {
                title: "Jo Tum Mere Ho",
                src: "music/queue_song/04-jo-tum-mere-ho.m4a",
                artist: "Anuv Jain"
            },
            'love-letters.html': {
                title: "Paro",
                src: "music/queue_song/05-paro.m4a",
                artist: "Anuv Jain"
            },
            'photo-gallery.html': {
                title: "Jugrafiyan",
                src: "music/queue_song/06-Jugrafiyan.m4a",
                artist: "Arooj Aftab"
            },
            'future-plans.html': {
                title: "Arijit Singh Collection",
                src: "music/Arijitsingh.m4a",
                artist: "Arijit Singh"
            },
            'special-dates.html': {
                title: "Nit Khair Manga",
                src: "music/queue_song/01-nit-khair-manga.m4a",
                artist: "Rahat Fateh Ali Khan"
            },
            'wish-list.html': {
                title: "Kahani Suno",
                src: "music/queue_song/02-Kahani-Suno.m4a",
                artist: "Kaifi Khalil"
            },
            'challenges.html': {
                title: "Champakali",
                src: "music/queue_song/03-champakali.m4a",
                artist: "Traditional"
            },
            'memory-book.html': {
                title: "Jo Tum Mere Ho",
                src: "music/queue_song/04-jo-tum-mere-ho.m4a",
                artist: "Anuv Jain"
            },
            'fireworks.html': {
                title: "Paro",
                src: "music/queue_song/05-paro.m4a",
                artist: "Anuv Jain"
            },
            'settings.html': {
                title: "Jugrafiyan",
                src: "music/queue_song/06-Jugrafiyan.m4a",
                artist: "Arooj Aftab"
            }
        };

        // Storage key for cross-page sync
        this.storageKey = 'anniversaryPageMusicState';
        this.currentPageSong = null;
        
        // Bind methods
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleUserInteraction = this.handleUserInteraction.bind(this);
    }

    /**
     * Initialize the music manager
     */
    async init() {
        if (this.isInitialized) {
            return;
        }

        console.log('🎵 Initializing Page-Specific Music Manager...');

        try {
            // Get current page song
            this.getCurrentPageSong();
            
            // Create audio element
            this.createAudioElement();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Restore previous state
            this.restoreState();
            
            // Create popup UI
            this.createPopupUI();
            
            // Setup music control button
            this.setupMusicControlButton();
            
            // Setup cross-page sync
            this.setupCrossPageSync();
            
            // Setup user interaction detection
            this.setupUserInteractionDetection();
            
            this.isInitialized = true;
            console.log('✅ Page-Specific Music Manager initialized successfully');
            
            // Try to restore playback if user previously interacted
            if (this.userInteracted) {
                this.attemptAutoplay();
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize Page-Specific Music Manager:', error);
        }
    }

    /**
     * Get the designated song for current page
     */
    getCurrentPageSong() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.currentPageSong = this.pageSongs[currentPage] || this.pageSongs['index.html'];
        console.log(`🎵 Current page song: ${this.currentPageSong.title}`);
    }

    /**
     * Create audio element
     */
    createAudioElement() {
        // Remove existing audio if any
        const existingAudio = document.getElementById('anniversary-page-audio');
        if (existingAudio) {
            existingAudio.remove();
        }

        this.audio = document.createElement('audio');
        this.audio.id = 'anniversary-page-audio';
        this.audio.preload = 'metadata';
        this.audio.volume = this.volume;
        this.audio.loop = true; // Loop the designated song
        
        // Set the page-specific song
        this.audio.src = this.currentPageSong.src;
        this.audio.load();
        
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

        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.updateUI();
        });
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
            console.log(`▶️ Playing: ${this.currentPageSong.title}`);
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
     * Toggle popup visibility
     */
    togglePopup() {
        this.popupVisible = !this.popupVisible;
        const popup = document.getElementById('music-popup-player');
        if (popup) {
            popup.style.display = this.popupVisible ? 'block' : 'none';
            popup.style.opacity = this.popupVisible ? '1' : '0';
            popup.style.transform = this.popupVisible ? 'translateY(0)' : 'translateY(20px)';
        }
        
        // Update music control button state
        const musicBtn = document.querySelector('.music-control-btn');
        if (musicBtn) {
            musicBtn.classList.toggle('active', this.popupVisible);
        }
        
        console.log(`🎵 Music popup ${this.popupVisible ? 'opened' : 'closed'}`);
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
        if (this.userInteracted && this.audio) {
            // Check if we should continue playing based on saved state
            const savedState = this.getSavedState();
            if (savedState && savedState.isPlaying && savedState.currentSong === this.currentPageSong.src) {
                this.play();
            }
        }
    }

    /**
     * Setup music control button
     */
    setupMusicControlButton() {
        const musicBtn = document.querySelector('.ui-control-btn.music-control-btn');
        if (musicBtn) {
            musicBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleUserInteraction();
                this.togglePopup();
            });
            console.log('✅ Music control button setup complete');
        } else {
            console.log('⚠️ Music control button not found');
        }
    }

    /**
     * Create popup UI
     */
    createPopupUI() {
        // Remove existing popup if any
        const existingPopup = document.getElementById('music-popup-player');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.id = 'music-popup-player';
        popup.className = 'music-popup-player';
        popup.style.display = 'none';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h3>🎵 Now Playing</h3>
                    <button class="popup-close-btn" onclick="window.pageSpecificMusicManager.togglePopup()">×</button>
                </div>
                <div class="song-info">
                    <div class="song-title">${this.currentPageSong.title}</div>
                    <div class="song-artist">${this.currentPageSong.artist}</div>
                </div>
                <div class="music-controls">
                    <button class="popup-play-pause-btn" onclick="window.pageSpecificMusicManager.toggle()">▶️</button>
                </div>
                <div class="volume-control">
                    <span class="volume-icon">🔊</span>
                    <input type="range" class="volume-slider" min="0" max="100" value="${this.volume * 100}" 
                           oninput="window.pageSpecificMusicManager.setVolume(this.value / 100)">
                </div>
                <div class="progress-container">
                    <div class="progress-bar" onclick="window.pageSpecificMusicManager.seekTo(event)">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="time-display">
                        <span class="current-time">0:00</span>
                        <span class="duration">0:00</span>
                    </div>
                </div>
                <div class="page-info">
                    <small>🎯 Page-specific song for ${window.location.pathname.split('/').pop() || 'index.html'}</small>
                </div>
            </div>
        `;        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .music-popup-player {
                position: fixed;
                background: rgba(20, 20, 30, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 0;
                z-index: 10000;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

                /* Proper alignment with page body padding and borders */
                bottom: 20px;
                right: 20px;
                width: 380px;
                max-width: calc(100vw - 40px);
                min-width: 280px;

                /* Respect page margins and safe areas */
                margin-right: env(safe-area-inset-right, 0);
                margin-bottom: env(safe-area-inset-bottom, 0);
            }
            
            /* Desktop positioning - aligned with page layout */
            @media (min-width: 768px) {
                .music-popup-player {
                    bottom: 20px;
                    right: 20px;
                    width: 400px;
                    max-width: calc(100vw - 40px);

                    /* Align with page container margins */
                    margin-right: max(20px, calc((100vw - 1200px) / 2));
                    margin-bottom: 20px;
                }
            }

            /* Large desktop - align with page container */
            @media (min-width: 1200px) {
                .music-popup-player {
                    right: max(20px, calc((100vw - 1200px) / 2 + 20px));
                    margin-right: 0;
                }
            }            .popup-content {
                padding: 20px;
            }

            .popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }

            .popup-header h3 {
                margin: 0;
                color: #fff;
                font-size: 18px;
                font-weight: 600;
            }

            .popup-close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.7);
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .popup-close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            }

            .song-info {
                text-align: center;
                margin-bottom: 20px;
            }

            .song-title {
                font-weight: 600;
                color: #fff;
                font-size: 16px;
                margin-bottom: 5px;
            }

            .song-artist {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
            }

            .music-controls {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }

            .popup-play-pause-btn {
                background: linear-gradient(45deg, #ec4899, #f472b6);
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 24px;
                color: white;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
            }

            .popup-play-pause-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
            }            .volume-control {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
            }

            .volume-icon {
                font-size: 18px;
                width: 24px;
                text-align: center;
                color: rgba(255, 255, 255, 0.8);
            }

            .volume-slider {
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: rgba(255, 255, 255, 0.2);
                outline: none;
                -webkit-appearance: none;
            }

            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ec4899;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
            }

            .volume-slider::-moz-range-thumb {
                border: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ec4899;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
            }

            .progress-container {
                margin-bottom: 15px;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
                cursor: pointer;
                margin-bottom: 8px;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ec4899, #f472b6);
                width: 0%;
                transition: width 0.1s ease;
            }

            .time-display {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
            }

            .page-info {
                text-align: center;
                color: rgba(255, 255, 255, 0.5);
                font-size: 11px;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }            .music-control-btn.active {
                background: linear-gradient(45deg, #ec4899, #f472b6) !important;
                color: white !important;
                transform: scale(1.1);
            }

            /* Mobile-specific improvements - proper page alignment */
            @media (max-width: 767px) {
                .music-popup-player {
                    /* Align with page body padding and safe areas */
                    bottom: calc(20px + env(safe-area-inset-bottom));
                    left: 20px;
                    right: 20px;
                    width: auto;
                    max-width: none;
                    min-width: 280px;
                    top: auto;
                    margin: 0;

                    /* Respect page container margins */
                    margin-left: env(safe-area-inset-left, 0);
                    margin-right: env(safe-area-inset-right, 0);
                }
                
                .popup-content {
                    padding: 16px;
                }
                
                /* Larger touch targets for mobile */
                .popup-play-pause-btn {
                    width: 64px;
                    height: 64px;
                    font-size: 26px;
                }
                
                .popup-close-btn {
                    width: 36px;
                    height: 36px;
                    font-size: 26px;
                }
                
                /* Better volume control for mobile */
                .volume-slider {
                    height: 8px;
                }
                
                .volume-slider::-webkit-slider-thumb {
                    width: 24px;
                    height: 24px;
                }
                
                .volume-slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                }
                
                /* Better progress bar for mobile */
                .progress-bar {
                    height: 8px;
                    margin-bottom: 12px;
                }
                
                /* Slightly larger text for readability */
                .song-title {
                    font-size: 17px;
                }
                
                .song-artist {
                    font-size: 15px;
                }
                
                .time-display {
                    font-size: 13px;
                }
            }
            
            /* Extra small screens - maintain page alignment */
            @media (max-width: 359px) {
                .music-popup-player {
                    left: 10px;
                    right: 10px;
                    bottom: calc(10px + env(safe-area-inset-bottom));
                    width: auto;
                }

                .popup-content {
                    padding: 12px;
                }
            }
            
            /* Landscape mobile orientation - proper alignment */
            @media (max-width: 767px) and (orientation: landscape) {
                .music-popup-player {
                    bottom: calc(10px + env(safe-area-inset-bottom));
                    left: 30px;
                    right: 30px;
                    width: auto;
                    max-width: 380px;
                    margin: 0 auto;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(popup);
    }

    /**
     * Seek to specific time
     */
    seekTo(event) {
        if (this.audio && this.audio.duration) {
            const progressBar = event.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const percent = (event.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        const playPauseBtn = document.querySelector('.popup-play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
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

        // Sync with other tabs/windows playing the same song
        setInterval(() => {
            const savedState = this.getSavedState();
            if (savedState && savedState.currentSong === this.currentPageSong.src) {
                if (savedState.isPlaying && !this.isPlaying && this.userInteracted) {
                    this.play();
                } else if (!savedState.isPlaying && this.isPlaying) {
                    this.pause();
                }
            }
        }, 1000);
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
            currentSong: this.currentPageSong.src,
            isPlaying: this.isPlaying,
            volume: this.volume,
            userInteracted: this.userInteracted,
            currentTime: this.audio ? this.audio.currentTime : 0,
            lastUpdated: Date.now()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    /**
     * Get saved state
     */
    getSavedState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('❌ Failed to get saved state:', error);
            return null;
        }
    }

    /**
     * Restore state from localStorage
     */
    restoreState() {
        try {
            const savedState = this.getSavedState();
            if (savedState) {
                // Only restore if it's the same song as current page
                if (savedState.currentSong === this.currentPageSong.src) {
                    this.volume = savedState.volume || 0.3;
                    this.userInteracted = savedState.userInteracted || false;

                    if (this.audio) {
                        this.audio.volume = this.volume;
                        // Sync playback position across pages
                        if (savedState.currentTime) {
                            this.audio.currentTime = savedState.currentTime;
                        }
                    }

                    console.log('🔄 Music state restored for current page song');
                }
            }
        } catch (error) {
            console.error('❌ Failed to restore music state:', error);
        }
    }

    /**
     * Get current song info
     */
    getCurrentSong() {
        return this.currentPageSong;
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

        const popup = document.getElementById('music-popup-player');
        if (popup) {
            popup.remove();
        }

        this.isInitialized = false;
        console.log('🔥 Page-Specific Music Manager destroyed');
    }
}

// Global instance
window.PageSpecificMusicManager = PageSpecificMusicManager;

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    window.pageSpecificMusicManager = new PageSpecificMusicManager();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.pageSpecificMusicManager.init();
        });
    } else {
        window.pageSpecificMusicManager.init();
    }
}

console.log('✅ Page-Specific Music Manager loaded');
