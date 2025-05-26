/**
 * Enhanced Music Manager with Cross-Page Synchronization
 * Manages background music across all pages with state persistence
 */

class MusicManager {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.volume = 0.3;
        this.queue = [
            'music/song1.m4a',
            'music/queue_song/01-anniversary-celebration.m4a',
            'music/queue_song/02-love-story-theme.m4a'
        ];
        this.currentSongIndex = 0;
        this.storageKey = 'anniversaryMusicState';
        this.crossPageSync = true;
        
        // Initialize music manager
        this.init();
    }

    init() {
        // Restore previous state
        this.restoreState();
        
        // Setup audio element
        this.setupAudio();
        
        // Setup cross-page synchronization
        if (this.crossPageSync) {
            this.setupCrossPageSync();
        }
        
        // Setup UI elements
        this.setupUI();
        
        // Auto-play if was playing
        if (this.isPlaying) {
            this.play();
        }
    }

    setupAudio() {
        this.audio = new Audio();
        this.audio.preload = 'metadata';
        this.audio.volume = this.volume;
        this.audio.currentTime = this.currentTime;
        
        // Load current song
        this.loadSong(this.currentSongIndex);
        
        // Audio event listeners
        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            if (this.currentTime > 0 && this.currentTime < this.audio.duration) {
                this.audio.currentTime = this.currentTime;
            }
        });

        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
            this.saveState();
        });

        this.audio.addEventListener('error', (e) => {
            console.warn('Audio error:', e);
            this.nextSong();
        });
    }

    setupCrossPageSync() {
        // Listen for storage changes (cross-page communication)
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.handleCrossPageSync(JSON.parse(e.newValue));
            }
        });

        // Page visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveState();
            } else {
                this.restoreState();
            }
        });

        // Before unload - save state
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    }

    setupUI() {
        const musicToggle = document.getElementById('music-toggle');
        const musicIcon = document.getElementById('music-icon');
        const musicVisualizer = document.getElementById('music-visualizer');

        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                this.toggle();
            });
        }

        // Update UI based on current state
        this.updateUI();
    }

    loadSong(index) {
        if (index >= 0 && index < this.queue.length) {
            this.currentSongIndex = index;
            this.audio.src = this.queue[index];
        }
    }

    play() {
        if (!this.audio) return;

        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.updateUI();
                    this.saveState();
                })
                .catch((error) => {
                    console.warn('Auto-play prevented:', error);
                    this.isPlaying = false;
                    this.updateUI();
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

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.queue.length;
        this.currentTime = 0;
        this.loadSong(this.currentSongIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }

    previousSong() {
        this.currentSongIndex = this.currentSongIndex === 0 
            ? this.queue.length - 1 
            : this.currentSongIndex - 1;
        this.currentTime = 0;
        this.loadSong(this.currentSongIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.saveState();
    }

    updateUI() {
        const musicIcon = document.getElementById('music-icon');
        const musicVisualizer = document.getElementById('music-visualizer');
        const musicToggle = document.getElementById('music-toggle');

        if (musicIcon) {
            musicIcon.textContent = this.isPlaying ? '🎵' : '🔇';
        }

        if (musicVisualizer) {
            musicVisualizer.style.display = this.isPlaying ? 'flex' : 'none';
        }

        if (musicToggle) {
            musicToggle.setAttribute('aria-label', 
                this.isPlaying ? 'Pause Background Music' : 'Play Background Music'
            );
            musicToggle.classList.toggle('playing', this.isPlaying);
        }
    }

    saveState() {
        const state = {
            isPlaying: this.isPlaying,
            currentTime: this.currentTime,
            volume: this.volume,
            currentSongIndex: this.currentSongIndex,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save music state:', e);
        }
    }

    restoreState() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Only restore if state is recent (within 5 minutes)
                if (Date.now() - state.timestamp < 5 * 60 * 1000) {
                    this.isPlaying = state.isPlaying;
                    this.currentTime = state.currentTime || 0;
                    this.volume = state.volume || 0.3;
                    this.currentSongIndex = state.currentSongIndex || 0;
                }
            }
        } catch (e) {
            console.warn('Could not restore music state:', e);
        }
    }

    handleCrossPageSync(newState) {
        if (!newState) return;

        // Update state from other page
        this.isPlaying = newState.isPlaying;
        this.currentTime = newState.currentTime || 0;
        this.volume = newState.volume || 0.3;
        this.currentSongIndex = newState.currentSongIndex || 0;

        // Apply changes
        if (this.audio) {
            this.audio.volume = this.volume;
            
            if (this.currentSongIndex !== this.currentSongIndex) {
                this.loadSong(this.currentSongIndex);
            }

            if (Math.abs(this.audio.currentTime - this.currentTime) > 2) {
                this.audio.currentTime = this.currentTime;
            }

            if (this.isPlaying && this.audio.paused) {
                this.play();
            } else if (!this.isPlaying && !this.audio.paused) {
                this.pause();
            }
        }

        this.updateUI();
    }

    // Clear previous visits functionality
    clearPreviousVisits() {
        try {
            // Clear music state
            localStorage.removeItem(this.storageKey);
            
            // Clear other anniversary-related data
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (
                    key.includes('anniversary') || 
                    key.includes('countdown') || 
                    key.includes('love') ||
                    key.includes('surprise')
                )) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // Clear session storage
            sessionStorage.clear();
            
            // Reset music manager state
            this.isPlaying = false;
            this.currentTime = 0;
            this.currentSongIndex = 0;
            this.volume = 0.3;
            
            // Reset audio
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.loadSong(0);
            }
            
            this.updateUI();
            
            console.log('Previous visits cleared successfully');
            return true;
        } catch (e) {
            console.error('Error clearing previous visits:', e);
            return false;
        }
    }

    // Destroy music manager (cleanup)
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            this.audio = null;
        }
        
        // Remove event listeners
        window.removeEventListener('storage', this.handleCrossPageSync);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
}

// Global music manager instance
window.musicManager = null;

// Initialize music manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (!window.musicManager) {
        window.musicManager = new MusicManager();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicManager;
}
