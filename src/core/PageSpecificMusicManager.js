import { BaseAudioManager } from './BaseAudioManager.js';

/**
 * Page-Specific Music Manager with Popup UI
 * Each page has a designated song that plays in sync across pages
 * Version: 3.0.0 - Now extends BaseAudioManager
 */

class PageSpecificMusicManager extends BaseAudioManager {
    constructor(options = {}) {
        // Page-specific song mapping
        const pageSongs = {
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

        // Get current page song
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentPageSong = pageSongs[currentPage] || pageSongs['index.html'];

        super({
            ...options,
            playlist: [currentPageSong.src], // Single song playlist for current page
            storageKey: 'anniversaryPageMusicState',
            audioId: 'anniversary-page-audio',
            enableLoop: true, // Loop the designated song
            enableShuffle: false // No shuffle for page-specific songs
        });

        // Store page-specific data
        this.pageSongs = pageSongs;
        this.currentPageSong = currentPageSong;
        this.popupVisible = false;

        console.log(`🎵 Current page song: ${this.currentPageSong.title}`);

        // Initialize with parent's init method
        this.onInitialized(() => {
            this.initializePageSpecificExtended();
        });
    }

    /**
     * Extended initialization specific to PageSpecificMusicManager
     */
    initializePageSpecificExtended() {
        console.log('🎵 Initializing Page-Specific Music Manager Extended Features');
        
        // Create popup UI
        this.createPopupUI();
        
        // Setup music control button
        this.setupMusicControlButton();
        
        // Setup progress update for popup UI
        this.onProgressUpdate(() => {
            this.updateProgressDisplay();
        });
        
        // Setup play state change for popup UI
        this.onPlayStateChange(() => {
            this.updateUI();
        });
        
        console.log('🎵 Page-Specific Music Manager fully initialized');
    }

    /**
     * Override toggle to add popup support
     */
    toggle() {
        this.handleUserInteraction(); // Ensure user interaction is recorded
        super.toggle(); // Use parent's toggle functionality
    }

    /**
     * Override setVolume to update popup UI
     */
    setVolume(vol) {
        super.setVolume(vol);
        this.updateVolumeIcon();
        
        // Update volume slider in popup
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.value = this.state.volume * 100;
        }
    }

    /**
     * Toggle mute/unmute
     */
    toggleMute() {
        if (!this.audio) return;

        if (this.audio.volume > 0) {
            // Mute
            this.previousVolume = this.state.volume;
            this.setVolume(0);
            console.log('🔇 Audio muted');
        } else {
            // Unmute
            const restoreVolume = this.previousVolume || 0.3;
            this.setVolume(restoreVolume);
            console.log('🔊 Audio unmuted');
        }

        // Update volume slider
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.value = this.state.volume * 100;
        }
    }

    /**
     * Update volume icon based on current volume
     */
    updateVolumeIcon() {
        const volumeIcon = document.querySelector('.volume-icon');
        if (!volumeIcon) return;

        if (this.state.volume === 0) {
            volumeIcon.textContent = '🔇';
            volumeIcon.title = 'Click to unmute';
        } else if (this.state.volume < 0.3) {
            volumeIcon.textContent = '🔈';
            volumeIcon.title = 'Click to mute';
        } else if (this.state.volume < 0.7) {
            volumeIcon.textContent = '🔉';
            volumeIcon.title = 'Click to mute';
        } else {
            volumeIcon.textContent = '🔊';
            volumeIcon.title = 'Click to mute';
        }
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
     * Get proper song title for display
     */
    getProperSongTitle() {
        return this.currentPageSong ? this.currentPageSong.title : 'Unknown Song';
    }

    /**
     * Get proper artist name for display
     */
    getProperArtistName() {
        return this.currentPageSong ? this.currentPageSong.artist : 'Unknown Artist';
    }

    /**
     * Seek to specific position in song
     */
    seekTo(event) {
        if (!this.audio || !this.audio.duration) return;

        const progressBar = event.target.closest('.progress-bar');
        if (!progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
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
                    <div class="song-title">💕 ${this.getProperSongTitle()}</div>
                    <div class="song-artist">${this.getProperArtistName()}</div>
                </div>
                <div class="music-controls">
                    <button class="popup-play-pause-btn" onclick="window.pageSpecificMusicManager.toggle()">▶️</button>
                </div>
                <div class="volume-control">
                    <span class="volume-icon" onclick="window.pageSpecificMusicManager.toggleMute()" title="Click to mute/unmute">🔊</span>
                    <input type="range" class="volume-slider" min="0" max="100" value="${this.volume * 100}"
                           oninput="window.pageSpecificMusicManager.setVolume(this.value / 100)" title="Adjust volume">
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
                <!-- Page info removed for compact design -->
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
                gap: 12px;
                margin-bottom: 12px;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }

            .volume-control:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(236, 72, 153, 0.3);
            }

            .volume-icon {
                font-size: 16px;
                width: 20px;
                text-align: center;
                color: rgba(255, 255, 255, 0.9);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .volume-icon:hover {
                color: #ec4899;
                transform: scale(1.1);
            }

            .volume-slider {
                flex: 1;
                height: 4px;
                border-radius: 2px;
                background: rgba(255, 255, 255, 0.2);
                outline: none;
                -webkit-appearance: none;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .volume-slider:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: linear-gradient(45deg, #ec4899, #f472b6);
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.2);
                transition: all 0.2s ease;
            }

            .volume-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 12px rgba(236, 72, 153, 0.6);
                border-color: rgba(255, 255, 255, 0.4);
            }

            .volume-slider::-moz-range-thumb {
                border: 2px solid rgba(255, 255, 255, 0.2);
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: linear-gradient(45deg, #ec4899, #f472b6);
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
                transition: all 0.2s ease;
            }

            .volume-slider::-moz-range-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 12px rgba(236, 72, 153, 0.6);
                border-color: rgba(255, 255, 255, 0.4);
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

            /* Page info styles removed for compact design */            .music-control-btn.active {
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

        // Initialize volume icon
        setTimeout(() => this.updateVolumeIcon(), 100);
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
            playPauseBtn.textContent = this.state.isPlaying ? '⏸️' : '▶️';
        }
        
        // Update progress bar using parent's progress tracking
        this.updateProgressDisplay();
    }

    /**
     * Update progress display using BaseAudioManager's formatTime
     */
    updateProgressDisplay() {
        if (!this.audio) return;

        const progressFill = document.querySelector('.progress-fill');
        const currentTimeEl = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');

        if (progressFill && this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            progressFill.style.width = percent + '%';
        }

        if (currentTimeEl) {
            currentTimeEl.textContent = super.formatTime(this.audio.currentTime || 0);
        }

        if (durationEl) {
            durationEl.textContent = super.formatTime(this.audio.duration || 0);
        }
    }

    // Progress tracking and time formatting are handled by BaseAudioManager

    /**
     * Get proper song title with better formatting
     */
    getProperSongTitle() {
        if (!this.currentPageSong || !this.currentPageSong.title) {
            return 'Beautiful Love Song';
        }

        let title = this.currentPageSong.title;

        // Remove file extensions
        title = title.replace(/\.(mp3|m4a|wav|flac|ogg)$/i, '');

        // Remove track numbers (01-, 02-, etc.)
        title = title.replace(/^\d{2}-/, '');

        // Replace hyphens and underscores with spaces
        title = title.replace(/[-_]/g, ' ');

        // Capitalize each word
        title = title.replace(/\b\w+/g, word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );

        // Handle special cases
        title = title.replace(/\bAnd\b/g, 'and');
        title = title.replace(/\bThe\b/g, 'the');
        title = title.replace(/\bOf\b/g, 'of');
        title = title.replace(/\bIn\b/g, 'in');
        title = title.replace(/\bOn\b/g, 'on');
        title = title.replace(/\bAt\b/g, 'at');
        title = title.replace(/\bTo\b/g, 'to');
        title = title.replace(/\bFor\b/g, 'for');

        return title.trim() || 'Beautiful Love Song';
    }

    /**
     * Get proper artist name with better formatting
     */
    getProperArtistName() {
        if (!this.currentPageSong || !this.currentPageSong.artist) {
            return 'Arijit Singh';
        }

        let artist = this.currentPageSong.artist;

        // Handle common artist name formats
        const artistMappings = {
            'arijit': 'Arijit Singh',
            'arijit singh': 'Arijit Singh',
            'atif': 'Atif Aslam',
            'atif aslam': 'Atif Aslam',
            'rahat': 'Rahat Fateh Ali Khan',
            'rahat fateh ali khan': 'Rahat Fateh Ali Khan',
            'shreya': 'Shreya Ghoshal',
            'shreya ghoshal': 'Shreya Ghoshal',
            'armaan': 'Armaan Malik',
            'armaan malik': 'Armaan Malik',
            'jubin': 'Jubin Nautiyal',
            'jubin nautiyal': 'Jubin Nautiyal',
            'darshan': 'Darshan Raval',
            'darshan raval': 'Darshan Raval'
        };

        const lowerArtist = artist.toLowerCase().trim();

        if (artistMappings[lowerArtist]) {
            return artistMappings[lowerArtist];
        }

        // Capitalize each word if no mapping found
        artist = artist.replace(/\b\w+/g, word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );

        return artist.trim() || 'Arijit Singh';
    }

    // Cross-page sync, user interaction detection, and state management
    // are all handled by BaseAudioManager

    /**
     * Override getCurrentSong to return page-specific song metadata
     */
    getCurrentSong() {
        return this.currentPageSong;
    }

    /**
     * Override destroy to cleanup popup UI
     */
    destroy() {
        const popup = document.getElementById('music-popup-player');
        if (popup) {
            popup.remove();
        }
        
        // Call parent destroy method
        super.destroy();
        
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
