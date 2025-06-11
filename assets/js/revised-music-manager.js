/**
 * Anniversary Website v5.0.0 - Revised Music Manager
 * Strategy: Hindi Priority on Pages, Mixed Playlists
 * Features: Bijay Anand Sahu Sambalpuri Collection
 */

class RevisedMusicManager {
    constructor() {
        this.currentPage = '';
        this.currentSong = null;
        this.currentPlaylist = [];
        this.currentTrack = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        this.volume = 0.7;
        this.language = 'hindi'; // Default to Hindi for pages
        this.playlistMode = 'page'; // 'page' or 'playlist'
        this.basePath = '/assets/music/';
        
        this.initializePlayer();
        this.setupEventListeners();
        this.detectCurrentPage();
    }

    // Page-specific music assignments (Hindi Priority)
    pageMusic = {
        anniversary: {
            primary: 'pages/anniversary.m4a', // Tum Hi Ho - Arijit Singh
            alternatives: {
                odia: 'playlists/romantic-odia/tu-mora-janha.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/prema-re-jhulana.m4a'
            },
            info: {
                title: 'Tum Hi Ho',
                artist: 'Arijit Singh',
                album: 'Aashiqui 2 (2013)',
                mood: 'Anniversary Celebration'
            }
        },
        
        countdown: {
            primary: 'pages/countdown.m4a', // Galliyan - Ankit Tiwari
            alternatives: {
                odia: 'playlists/romantic-odia/laila-o-laila.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/rangabati.m4a'
            },
            info: {
                title: 'Galliyan',
                artist: 'Ankit Tiwari',
                album: 'Ek Villain (2014)',
                mood: 'Building Anticipation'
            }
        },
        
        'love-story': {
            primary: 'pages/love-story.m4a', // Jeene Laga Hoon
            alternatives: {
                odia: 'playlists/romantic-odia/tu-mo-love-story.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/sundara-prema-kahani.m4a'
            },
            info: {
                title: 'Jeene Laga Hoon',
                artist: 'Atif Aslam & Shreya Ghoshal',
                album: 'Ramaiya Vastavaiya (2013)',
                mood: 'Love Story Narrative'
            }
        },
        
        games: {
            primary: 'pages/games.m4a', // Sooraj Dooba Hain
            alternatives: {
                odia: 'playlists/romantic-odia/chocolate.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/kalia-rang-ma.m4a'
            },
            info: {
                title: 'Sooraj Dooba Hain',
                artist: 'Arijit Singh',
                album: 'Roy (2015)',
                mood: 'Interactive Energy'
            }
        },
        
        surprises: {
            primary: 'pages/surprises.m4a', // Bolna
            alternatives: {
                odia: 'playlists/romantic-odia/bou.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/nuakhai-re-nuakhai.m4a'
            },
            info: {
                title: 'Bolna',
                artist: 'Arijit Singh & Asees Kaur',
                album: 'Kapoor & Sons (2016)',
                mood: 'Surprise Discovery'
            }
        }
    };

    // Mixed Playlist Collections (50% Hindi, 35% Odia, 15% Sambalpuri)
    playlistCollections = {
        'romantic-mixed': [
            // Hindi (10 songs - 50%)
            { file: 'playlists/romantic-hindi/tum-hi-ho.m4a', title: 'Tum Hi Ho', artist: 'Arijit Singh', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/jeene-laga-hoon.m4a', title: 'Jeene Laga Hoon', artist: 'Atif Aslam', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/raabta.m4a', title: 'Raabta', artist: 'Arijit Singh', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/bolna.m4a', title: 'Bolna', artist: 'Arijit Singh', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/sunn-raha-hai.m4a', title: 'Sunn Raha Hai', artist: 'Ankit Tiwari', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/galliyan.m4a', title: 'Galliyan', artist: 'Ankit Tiwari', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/sooraj-dooba-hain.m4a', title: 'Sooraj Dooba Hain', artist: 'Arijit Singh', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/tere-sang-yaara.m4a', title: 'Tere Sang Yaara', artist: 'Atif Aslam', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/ae-dil-hai-mushkil.m4a', title: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh', lang: 'hindi' },
            { file: 'playlists/romantic-hindi/mann-mera.m4a', title: 'Mann Mera', artist: 'Gajendra Verma', lang: 'hindi' },
            
            // Odia (7 songs - 35%)
            { file: 'playlists/romantic-odia/tu-mo-love-story.m4a', title: 'Tu Mo Love Story', artist: 'Ananya & Humane', lang: 'odia' },
            { file: 'playlists/romantic-odia/mo-man-bhamara.m4a', title: 'Mo Man Bhamara', artist: 'Humane Sagar', lang: 'odia' },
            { file: 'playlists/romantic-odia/tu-mora-janha.m4a', title: 'Tu Mora Janha', artist: 'Humane Sagar', lang: 'odia' },
            { file: 'playlists/romantic-odia/laila-o-laila.m4a', title: 'Laila O Laila', artist: 'Humane Sagar', lang: 'odia' },
            { file: 'playlists/romantic-odia/prema-adhara.m4a', title: 'Prema Adhara', artist: 'Ananya Sritam', lang: 'odia' },
            { file: 'playlists/romantic-odia/balunga-kete-katha.m4a', title: 'Balunga Kete Katha', artist: 'Humane Sagar', lang: 'odia' },
            { file: 'playlists/romantic-odia/tike-tike-achha.m4a', title: 'Tike Tike Achha Laguchi', artist: 'Humane Sagar', lang: 'odia' },
            
            // Sambalpuri (3 songs - 15%)
            { file: 'playlists/romantic-sambalpuri/tora-bina-mo-jibana.m4a', title: 'Tora Bina Mo Jibana', artist: 'Bijay Anand Sahu', lang: 'sambalpuri' },
            { file: 'playlists/romantic-sambalpuri/sundara-prema-kahani.m4a', title: 'Sundara Prema Kahani', artist: 'Bijay Anand Sahu', lang: 'sambalpuri' },
            { file: 'playlists/romantic-sambalpuri/prema-re-jhulana.m4a', title: 'Prema Re Jhulana', artist: 'Bijay Anand Sahu', lang: 'sambalpuri' }
        ],
        
        'celebration-mixed': [
            // Hindi celebration (8 songs)
            { file: 'playlists/celebration-mixed/sooraj-dooba-hain.m4a', title: 'Sooraj Dooba Hain', artist: 'Arijit Singh', lang: 'hindi' },
            { file: 'playlists/celebration-mixed/galliyan.m4a', title: 'Galliyan', artist: 'Ankit Tiwari', lang: 'hindi' },
            { file: 'playlists/celebration-mixed/bolna.m4a', title: 'Bolna', artist: 'Arijit Singh', lang: 'hindi' },
            { file: 'playlists/celebration-mixed/mann-mera.m4a', title: 'Mann Mera', artist: 'Gajendra Verma', lang: 'hindi' },
            { file: 'playlists/celebration-mixed/tere-sang-yaara.m4a', title: 'Tere Sang Yaara', artist: 'Atif Aslam', lang: 'hindi' },
            { file: 'playlists/celebration-mixed/jeene-laga-hoon.m4a', title: 'Jeene Laga Hoon', artist: 'Atif Aslam', lang: 'hindi' },
            { file: 'playlists/celebration-mixed/raabta.m4a', title: 'Raabta', artist: 'Arijit Singh', lang: 'hindi' },
            { file: 'playlists/celebration-mixed/ae-dil-hai-mushkil.m4a', title: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh', lang: 'hindi' },
            
            // Odia celebration (5 songs)
            { file: 'playlists/celebration-mixed/laila-o-laila.m4a', title: 'Laila O Laila', artist: 'Humane Sagar', lang: 'odia' },
            { file: 'playlists/celebration-mixed/chocolate.m4a', title: 'Chocolate', artist: 'Humane Sagar', lang: 'odia' },
            { file: 'playlists/celebration-mixed/bou.m4a', title: 'Bou', artist: 'Humane Sagar', lang: 'odia' },
            { file: 'playlists/celebration-mixed/tu-mo-love-story.m4a', title: 'Tu Mo Love Story', artist: 'Ananya & Humane', lang: 'odia' },
            { file: 'playlists/celebration-mixed/mo-man-bhamara.m4a', title: 'Mo Man Bhamara', artist: 'Humane Sagar', lang: 'odia' },
            
            // Sambalpuri celebration (2 songs)
            { file: 'playlists/celebration-mixed/rangabati.m4a', title: 'Rangabati', artist: 'Bijay Anand Sahu', lang: 'sambalpuri' },
            { file: 'playlists/celebration-mixed/nuakhai-re-nuakhai.m4a', title: 'Nuakhai Re Nuakhai', artist: 'Bijay Anand Sahu', lang: 'sambalpuri' }
        ]
    };

    initializePlayer() {
        this.audio.volume = this.volume;
        this.audio.loop = false;
        
        // Audio event listeners
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
        this.audio.addEventListener('loadstart', () => this.showLoading());
        this.audio.addEventListener('canplay', () => this.hideLoading());
        this.audio.addEventListener('error', (e) => this.handleError(e));
        
        console.log('🎵 Revised Music Manager v5.0.0 initialized');
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        // Detect page from URL
        if (path.includes('anniversary') || hash.includes('anniversary')) {
            this.loadPageMusic('anniversary');
        } else if (path.includes('countdown') || hash.includes('countdown')) {
            this.loadPageMusic('countdown');
        } else if (path.includes('love-story') || hash.includes('love-story')) {
            this.loadPageMusic('love-story');
        } else if (path.includes('games') || hash.includes('games')) {
            this.loadPageMusic('games');
        } else if (path.includes('surprises') || hash.includes('surprises')) {
            this.loadPageMusic('surprises');
        } else {
            // Default to mixed playlist
            this.loadPlaylist('romantic-mixed');
        }
    }

    // Load page-specific music (Hindi priority)
    loadPageMusic(pageName) {
        this.currentPage = pageName;
        this.playlistMode = 'page';
        const pageConfig = this.pageMusic[pageName];
        
        if (pageConfig) {
            this.currentSong = {
                path: this.basePath + pageConfig.primary,
                info: pageConfig.info,
                alternatives: pageConfig.alternatives
            };
            
            this.language = 'hindi'; // Always start with Hindi
            this.updateUI();
            
            console.log(`🎵 Loading page music for ${pageName}: ${pageConfig.info.title}`);
        } else {
            console.warn(`No music configured for page: ${pageName}`);
            this.loadPlaylist('romantic-mixed');
        }
    }

    // Load mixed playlist collections
    loadPlaylist(playlistName) {
        this.playlistMode = 'playlist';
        const playlist = this.playlistCollections[playlistName];
        
        if (playlist) {
            this.currentPlaylist = playlist.map(song => ({
                path: this.basePath + song.file,
                info: {
                    title: song.title,
                    artist: song.artist,
                    language: song.lang
                }
            }));
            
            this.currentTrack = 0;
            this.shufflePlaylist();
            this.updateUI();
            
            console.log(`🎵 Loading playlist: ${playlistName} (${this.currentPlaylist.length} songs)`);
        }
    }

    // Play current song/track
    play() {
        let trackPath = null;
        
        if (this.playlistMode === 'page' && this.currentSong) {
            trackPath = this.currentSong.path;
        } else if (this.playlistMode === 'playlist' && this.currentPlaylist.length > 0) {
            trackPath = this.currentPlaylist[this.currentTrack].path;
        }
        
        if (!trackPath) {
            console.error('No track to play');
            return;
        }
        
        this.audio.src = trackPath;
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
            console.log('▶️ Playing:', trackPath);
        }).catch(error => {
            console.error('Playback failed:', error);
            this.handlePlaybackError();
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
        console.log('⏸️ Paused');
    }

    // Handle playback errors with fallback
    handlePlaybackError() {
        if (this.playlistMode === 'page' && this.currentSong && this.currentSong.alternatives) {
            // Try language alternatives
            if (this.language === 'hindi') {
                this.switchLanguage('odia');
                return;
            } else if (this.language === 'odia') {
                this.switchLanguage('sambalpuri');
                return;
            }
        }
        
        // If in playlist mode or no alternatives, try next song
        if (this.playlistMode === 'playlist') {
            this.playNext();
        } else {
            // Fallback to romantic-mixed playlist
            this.loadPlaylist('romantic-mixed');
            this.play();
        }
    }

    // Switch language for current page
    switchLanguage(newLanguage) {
        if (this.playlistMode !== 'page' || !this.currentSong || !this.currentSong.alternatives) {
            console.warn('Language switch only available in page mode with alternatives');
            return;
        }
        
        const alternative = this.currentSong.alternatives[newLanguage];
        if (alternative) {
            this.language = newLanguage;
            this.currentSong.path = this.basePath + alternative;
            this.play();
            this.updateUI();
            
            console.log(`🌐 Switched to ${newLanguage} alternative`);
        }
    }

    playNext() {
        if (this.playlistMode === 'playlist' && this.currentPlaylist.length > 0) {
            this.currentTrack = (this.currentTrack + 1) % this.currentPlaylist.length;
            this.play();
        }
    }

    playPrevious() {
        if (this.playlistMode === 'playlist' && this.currentPlaylist.length > 0) {
            this.currentTrack = this.currentTrack === 0 ? 
                this.currentPlaylist.length - 1 : 
                this.currentTrack - 1;
            this.play();
        }
    }

    handleTrackEnd() {
        if (this.playlistMode === 'playlist') {
            this.playNext();
        } else {
            // In page mode, restart the same song
            this.currentTrack = 0;
            this.play();
        }
    }

    shufflePlaylist() {
        if (this.playlistMode === 'playlist') {
            for (let i = this.currentPlaylist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.currentPlaylist[i], this.currentPlaylist[j]] = 
                [this.currentPlaylist[j], this.currentPlaylist[i]];
            }
        }
    }

    setupEventListeners() {
        // Listen for page changes
        window.addEventListener('hashchange', () => {
            this.detectCurrentPage();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case 'p': // Alt+P for play/pause
                        e.preventDefault();
                        this.toggle();
                        break;
                    case 'n': // Alt+N for next (playlist mode only)
                        e.preventDefault();
                        this.playNext();
                        break;
                    case 'h': // Alt+H for Hindi
                        e.preventDefault();
                        this.switchLanguage('hindi');
                        break;
                    case 'o': // Alt+O for Odia
                        e.preventDefault();
                        this.switchLanguage('odia');
                        break;
                    case 's': // Alt+S for Sambalpuri
                        e.preventDefault();
                        this.switchLanguage('sambalpuri');
                        break;
                    case 'r': // Alt+R for romantic playlist
                        e.preventDefault();
                        this.loadPlaylist('romantic-mixed');
                        break;
                    case 'c': // Alt+C for celebration playlist
                        e.preventDefault();
                        this.loadPlaylist('celebration-mixed');
                        break;
                }
            }
        });
    }

    updateUI() {
        // Update play/pause button
        const playBtn = document.querySelector('.music-play-btn');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '⏸️' : '▶️';
        }

        // Update track info
        const trackInfo = document.querySelector('.music-track-info');
        if (trackInfo) {
            let info = '';
            
            if (this.playlistMode === 'page' && this.currentSong) {
                info = `${this.currentSong.info.title} - ${this.currentSong.info.artist} (${this.language})`;
            } else if (this.playlistMode === 'playlist' && this.currentPlaylist.length > 0) {
                const current = this.currentPlaylist[this.currentTrack];
                info = `${current.info.title} - ${current.info.artist} (${current.info.language}) [${this.currentTrack + 1}/${this.currentPlaylist.length}]`;
            }
            
            trackInfo.textContent = info;
        }

        // Update language indicator
        const langIndicator = document.querySelector('.music-language-indicator');
        if (langIndicator) {
            const displayLang = this.playlistMode === 'page' ? this.language : 'mixed';
            langIndicator.textContent = displayLang.toUpperCase();
        }
    }

    showLoading() {
        const loader = document.querySelector('.music-loader');
        if (loader) loader.style.display = 'block';
    }

    hideLoading() {
        const loader = document.querySelector('.music-loader');
        if (loader) loader.style.display = 'none';
    }

    handleError(error) {
        console.error('🎵 Music playback error:', error);
        this.handlePlaybackError();
    }

    // Public API methods
    toggle() {
        this.isPlaying ? this.pause() : this.play();
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
    }

    getCurrentInfo() {
        if (this.playlistMode === 'page' && this.currentSong) {
            return {
                mode: 'page',
                page: this.currentPage,
                song: this.currentSong.info,
                language: this.language
            };
        } else if (this.playlistMode === 'playlist' && this.currentPlaylist.length > 0) {
            return {
                mode: 'playlist',
                current: this.currentTrack + 1,
                total: this.currentPlaylist.length,
                song: this.currentPlaylist[this.currentTrack].info
            };
        }
        return null;
    }
}

// Initialize the revised music manager
window.revisedMusicManager = new RevisedMusicManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RevisedMusicManager;
}

console.log('🎵 Anniversary Website v5.0.0 - Revised Music System Loaded');
console.log('📱 Strategy: Hindi Priority on Pages, Mixed Playlists');
console.log('🎤 Featured: Bijay Anand Sahu Sambalpuri Collection');
