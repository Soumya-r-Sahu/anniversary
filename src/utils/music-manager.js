/**
 * Music Manager for Anniversary Website
 * Simplified version for countdown page compatibility
 */

class MusicManager {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.3;
        this.userInteracted = false;
        this.storageKey = 'anniversaryMusicState';
        this.init();
    }

    init() {
        this.audio = document.getElementById('background-music');
        if (this.audio) {
            this.audio.volume = this.volume;
            this.setupEventListeners();
            this.loadSavedState();
        }
    }    setupEventListeners() {
        if (this.audio) {
            this.audio.addEventListener('ended', () => {
                this.audio.currentTime = 0;
                this.audio.play().catch(e => console.log('Autoplay prevented:', e));
            });

            this.audio.addEventListener('error', (e) => {
                console.log('Audio error:', e);
            });
        }

        // Setup music toggle button
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                this.userInteracted = true;
                this.toggle();
            });
        }

        // Auto-start on user interaction
        document.addEventListener('click', () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                if (this.getSavedState().wasPlaying) {
                    this.play();
                }
            }
        }, { once: true });

        // Cross-page synchronization via storage events
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey && e.newValue) {
                this.handleCrossPageSync(e.newValue);
            }
        });

        // Save state before page unload
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    }

    play() {
        if (this.audio && this.userInteracted) {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updateUI();
                this.saveState();
            }).catch(e => {
                console.log('Play failed:', e);
            });
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updateUI();
            this.saveState();
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    updateUI() {
        const musicIcon = document.getElementById('music-icon');
        const musicVisualizer = document.getElementById('music-visualizer');
        
        if (musicIcon) {
            musicIcon.textContent = this.isPlaying ? '🎵' : '🔇';
        }
        
        if (musicVisualizer) {
            musicVisualizer.style.display = this.isPlaying ? 'flex' : 'none';
        }
    }    saveState() {
        const state = {
            wasPlaying: this.isPlaying,
            volume: this.volume,
            currentTime: this.audio ? this.audio.currentTime : 0,
            userInteracted: this.userInteracted,
            timestamp: Date.now()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }    loadSavedState() {
        const saved = this.getSavedState();
        
        // Only load if state is recent (within 5 minutes) and user had interacted
        const isRecentState = saved.timestamp && (Date.now() - saved.timestamp < 5 * 60 * 1000);
        
        if (saved.userInteracted && isRecentState) {
            this.userInteracted = true;
            this.volume = saved.volume || 0.3;
            if (this.audio) {
                this.audio.volume = this.volume;
                if (saved.currentTime) {
                    this.audio.currentTime = saved.currentTime;
                }
                
                // Auto-resume if was playing (with user interaction already established)
                if (saved.wasPlaying) {
                    // Small delay to ensure audio is ready
                    setTimeout(() => {
                        this.play();
                    }, 100);
                }
            }
        }
    }    getSavedState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    clearPreviousVisits() {
        localStorage.removeItem(this.storageKey);
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        this.isPlaying = false;
        this.userInteracted = false;
        this.updateUI();
    }

    handleCrossPageSync(newStateString) {
        try {
            const newState = JSON.parse(newStateString);
            
            // Only sync if user has interacted and state is recent
            if (!newState.userInteracted) return;
            
            // Sync user interaction status
            if (newState.userInteracted && !this.userInteracted) {
                this.userInteracted = true;
            }
            
            // Sync playing state
            if (newState.wasPlaying !== this.isPlaying) {
                if (newState.wasPlaying && this.userInteracted) {
                    // Resume playback from other page
                    if (this.audio && this.audio.paused) {
                        if (newState.currentTime) {
                            this.audio.currentTime = newState.currentTime;
                        }
                        this.play();
                    }
                } else if (!newState.wasPlaying && this.isPlaying) {
                    // Pause if other page paused
                    this.pause();
                }
            }
            
            // Sync volume
            if (newState.volume && newState.volume !== this.volume) {
                this.volume = newState.volume;
                if (this.audio) {
                    this.audio.volume = this.volume;
                }
            }
            
            // Update UI to reflect synced state
            this.updateUI();
            
        } catch (error) {
            console.warn('Failed to sync music state:', error);
        }
    }
}

// Initialize global music manager
window.musicManager = new MusicManager();
