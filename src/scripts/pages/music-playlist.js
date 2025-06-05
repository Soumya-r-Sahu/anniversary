/**
 * Music Playlist Page Manager
 * Handles music player functionality, playlist management, and audio controls
 */

class MusicPlaylistManager {
    constructor() {
        this.currentSong = null;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.currentCategory = 'all';
        this.playlist = [];
        this.audioElement = null;
        
        this.init();
    }

    init() {
        this.setupAudioElement();
        this.loadPlaylist();
        this.setupEventListeners();
        this.initializePlayer();
        this.startStatsAnimation();
        console.log('MusicPlaylistManager initialized');
    }

    setupAudioElement() {
        this.audioElement = new Audio();
        this.audioElement.volume = 0.7;
        this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('ended', () => this.nextSong());
    }

    loadPlaylist() {
        this.playlist = [
            {
                id: 1,
                title: "Perfect",
                artist: "Ed Sheeran",
                category: "romantic",
                duration: "4:23",
                favorite: true,
                file: "perfect.mp3"
            },
            {
                id: 2,
                title: "All of Me",
                artist: "John Legend",
                category: "romantic",
                duration: "4:29",
                favorite: true,
                file: "all-of-me.mp3"
            },
            {
                id: 3,
                title: "Happy",
                artist: "Pharrell Williams",
                category: "happy",
                duration: "3:53",
                favorite: false,
                file: "happy.mp3"
            },
            {
                id: 4,
                title: "Thinking Out Loud",
                artist: "Ed Sheeran",
                category: "romantic",
                duration: "4:41",
                favorite: true,
                file: "thinking-out-loud.mp3"
            },
            {
                id: 5,
                title: "The Way You Look Tonight",
                artist: "Tony Bennett",
                category: "nostalgic",
                duration: "3:21",
                favorite: false,
                file: "the-way-you-look-tonight.mp3"
            },
            {
                id: 6,
                title: "Our Song",
                artist: "Custom Recording",
                category: "special",
                duration: "3:45",
                favorite: true,
                file: "our-song.mp3"
            },
            {
                id: 7,
                title: "Can't Help Myself",
                artist: "Four Tops",
                category: "happy",
                duration: "2:53",
                favorite: false,
                file: "cant-help-myself.mp3"
            },
            {
                id: 8,
                title: "First Dance",
                artist: "Our Memory",
                category: "special",
                duration: "4:12",
                favorite: true,
                file: "first-dance.mp3"
            }
        ];
        
        this.renderPlaylist();
    }

    setupEventListeners() {
        // Play/Pause button
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        // Previous/Next buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSong());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSong());

        // Volume control
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.audioElement.volume = e.target.value / 100;
            });
        }

        // Progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seekTo(e));
        }

        // Category filters
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Add song form
        const addSongForm = document.getElementById('addSongForm');
        if (addSongForm) {
            addSongForm.addEventListener('submit', (e) => this.addCustomSong(e));
        }
    }

    initializePlayer() {
        if (this.playlist.length > 0) {
            this.currentSong = this.playlist[0];
            this.updatePlayerDisplay();
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.currentSong) {
            // Note: In a real implementation, you'd load the actual audio file
            // For demo purposes, we'll simulate playback
            this.isPlaying = true;
            this.updatePlayButton();
            this.simulatePlayback();
            console.log(`Playing: ${this.currentSong.title} by ${this.currentSong.artist}`);
        }
    }

    pause() {
        this.isPlaying = false;
        this.audioElement.pause();
        this.updatePlayButton();
        console.log('Playback paused');
    }

    nextSong() {
        if (this.currentIndex < this.playlist.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.currentSong = this.playlist[this.currentIndex];
        this.updatePlayerDisplay();
        if (this.isPlaying) {
            this.play();
        }
    }

    previousSong() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.playlist.length - 1;
        }
        this.currentSong = this.playlist[this.currentIndex];
        this.updatePlayerDisplay();
        if (this.isPlaying) {
            this.play();
        }
    }

    updatePlayerDisplay() {
        const songTitle = document.getElementById('currentSongTitle');
        const songArtist = document.getElementById('currentSongArtist');
        
        if (songTitle && this.currentSong) {
            songTitle.textContent = this.currentSong.title;
        }
        if (songArtist && this.currentSong) {
            songArtist.textContent = this.currentSong.artist;
        }
    }

    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '⏸️' : '▶️';
        }
    }

    simulatePlayback() {
        // Simulate audio playback for demo purposes
        if (this.isPlaying) {
            setTimeout(() => {
                if (this.isPlaying) {
                    this.simulatePlayback();
                }
            }, 1000);
        }
    }

    updateDuration() {
        const duration = document.getElementById('duration');
        if (duration && this.currentSong) {
            duration.textContent = this.currentSong.duration;
        }
    }

    updateProgress() {
        // In a real implementation, this would update based on actual audio progress
        const progressBar = document.getElementById('progressBar');
        if (progressBar && this.isPlaying) {
            // Simulate progress for demo
        }
    }

    seekTo(event) {
        // In a real implementation, this would seek to the clicked position
        console.log('Seeking to position...');
    }

    filterByCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderPlaylist();
    }

    renderPlaylist() {
        const songList = document.getElementById('songList');
        if (!songList) return;

        const filteredSongs = this.currentCategory === 'all' 
            ? this.playlist 
            : this.playlist.filter(song => song.category === this.currentCategory);

        songList.innerHTML = filteredSongs.map((song, index) => `
            <div class="song-item ${this.currentSong && this.currentSong.id === song.id ? 'active' : ''}" 
                 data-song-id="${song.id}" onclick="musicManager.playSong(${song.id})">
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-controls">
                    <span class="song-duration">${song.duration}</span>
                    <button class="favorite-btn ${song.favorite ? 'active' : ''}" 
                            onclick="event.stopPropagation(); musicManager.toggleFavorite(${song.id})">
                        ${song.favorite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    playSong(songId) {
        const songIndex = this.playlist.findIndex(song => song.id === songId);
        if (songIndex !== -1) {
            this.currentIndex = songIndex;
            this.currentSong = this.playlist[songIndex];
            this.updatePlayerDisplay();
            this.renderPlaylist();
            this.play();
        }
    }

    toggleFavorite(songId) {
        const song = this.playlist.find(s => s.id === songId);
        if (song) {
            song.favorite = !song.favorite;
            this.renderPlaylist();
            this.updateMusicStats();
        }
    }

    addCustomSong(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const newSong = {
            id: this.playlist.length + 1,
            title: formData.get('songTitle'),
            artist: formData.get('songArtist'),
            category: formData.get('songCategory'),
            duration: '0:00',
            favorite: false,
            file: null
        };

        this.playlist.push(newSong);
        this.renderPlaylist();
        this.updateMusicStats();
        event.target.reset();
        
        // Show success message
        this.showNotification('Song added to playlist!');
    }

    startStatsAnimation() {
        const stats = [
            { id: 'totalSongs', target: this.playlist.length },
            { id: 'favoriteSongs', target: this.playlist.filter(s => s.favorite).length },
            { id: 'totalPlaytime', target: 32 }, // Simulated total minutes
            { id: 'songsThisMonth', target: 15 }
        ];

        stats.forEach(stat => {
            this.animateCounter(stat.id, stat.target);
        });
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = Math.ceil(target / 50);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = current;
        }, 30);
    }

    updateMusicStats() {
        const favoriteCount = this.playlist.filter(s => s.favorite).length;
        const totalSongs = this.playlist.length;
        
        const favElement = document.getElementById('favoriteSongs');
        const totalElement = document.getElementById('totalSongs');
        
        if (favElement) favElement.textContent = favoriteCount;
        if (totalElement) totalElement.textContent = totalSongs;
    }

    showNotification(message) {
        // Create and show a notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--romantic-pink);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Utility functions
const MusicUtils = {
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    getCategoryIcon(category) {
        const icons = {
            romantic: '💕',
            happy: '😊',
            nostalgic: '🎭',
            special: '⭐'
        };
        return icons[category] || '🎵';
    }
};

// Initialize when DOM is loaded
let musicManager;

document.addEventListener('DOMContentLoaded', () => {
    musicManager = new MusicPlaylistManager();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MusicPlaylistManager, MusicUtils };
}
