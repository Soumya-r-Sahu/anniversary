/**
 * Anniversary Website v5.0.0 - Enhanced Page-Specific Music Manager
 * Revised Strategy: Hindi Priority on Pages, Mixed Playlists
 * Features: Bijay Anand Sahu Sambalpuri Collection
 */

class PageSpecificMusicManager {
    constructor() {
        this.currentPage = '';
        this.currentPlaylist = [];
        this.currentTrack = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        this.volume = 0.7;
        this.fadeInterval = null;
        this.language = 'hindi'; // Default to Hindi for pages
        this.playlistMode = 'mixed'; // For playlist collections
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
        },
        
        'photo-gallery': {
            primary: 'pages/photo-gallery.m4a', // Raabta
            alternatives: {
                odia: 'playlists/romantic-odia/mo-man-bhamara.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/tora-aakhi-ra-kajala.m4a'
            },
            info: {
                title: 'Raabta',
                artist: 'Arijit Singh',
                album: 'Agent Vinod (2012)',
                mood: 'Memory Browsing'
            }
        },
        
        'love-letters': {
            primary: 'pages/love-letters.m4a', // Sunn Raha Hai
            alternatives: {
                odia: 'playlists/romantic-odia/prema-adhara.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/chandan-tara-chhati.m4a'
            },
            info: {
                title: 'Sunn Raha Hai',
                artist: 'Ankit Tiwari',
                album: 'Aashiqui 2 (2013)',
                mood: 'Intimate Reading'
            }
        },
        
        'memory-book': {
            primary: 'pages/memory-book.m4a', // Tere Sang Yaara
            alternatives: {
                odia: 'playlists/romantic-odia/balunga-kete-katha.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/mo-mana-kete-katha.m4a'
            },
            info: {
                title: 'Tere Sang Yaara',
                artist: 'Atif Aslam',
                album: 'Rustom (2016)',
                mood: 'Nostalgic Memories'
            }
        },
        
        'special-dates': {
            primary: 'pages/special-dates.m4a', // Ae Dil Hai Mushkil
            alternatives: {
                odia: 'playlists/romantic-odia/odia-mana.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/bande-utkala-janani.m4a'
            },
            info: {
                title: 'Ae Dil Hai Mushkil',
                artist: 'Arijit Singh',
                album: 'Ae Dil Hai Mushkil (2016)',
                mood: 'Important Moments'
            }
        },
        
        'future-plans': {
            primary: 'pages/future-plans.m4a', // Mann Mera
            alternatives: {
                odia: 'playlists/romantic-odia/sapana-mo.m4a',
                sambalpuri: 'playlists/romantic-sambalpuri/dhana-dhanya-pushpa.m4a'
            },
            info: {
                title: 'Mann Mera',
                artist: 'Gajendra Verma',
                album: 'Mann Mera (2013)',
                mood: 'Dreams & Aspirations'
            }
        }
    };

    // Mixed Playlist Collections
    playlistCollections = {
        'romantic-mixed': {
            path: 'playlists/celebration-mixed/',
            songs: [
                // Hindi (10 songs - 50%)
                'tum-hi-ho.m4a', 'jeene-laga-hoon.m4a', 'raabta.m4a', 'bolna.m4a',
                'sunn-raha-hai.m4a', 'galliyan.m4a', 'sooraj-dooba-hain.m4a',
                'tere-sang-yaara.m4a', 'ae-dil-hai-mushkil.m4a', 'mann-mera.m4a',
                // Odia (7 songs - 35%)
                'tu-mo-love-story.m4a', 'mo-man-bhamara.m4a', 'tu-mora-janha.m4a',
                'laila-o-laila.m4a', 'prema-adhara.m4a', 'balunga-kete-katha.m4a',
                'tike-tike-achha-laguchi.m4a',
                // Sambalpuri (3 songs - 15%)
                'tora-bina-mo-jibana.m4a', 'sundara-prema-kahani.m4a', 'prema-re-jhulana.m4a'
            ]
        },
        
        'celebration-mixed': {
            path: 'playlists/celebration-mixed/',
            songs: [
                // Hindi celebration (8 songs)
                'sooraj-dooba-hain.m4a', 'galliyan.m4a', 'bolna.m4a', 'mann-mera.m4a',
                'tere-sang-yaara.m4a', 'jeene-laga-hoon.m4a', 'raabta.m4a', 'ae-dil-hai-mushkil.m4a',
                // Odia celebration (5 songs)
                'laila-o-laila.m4a', 'chocolate.m4a', 'bou.m4a', 'tu-mo-love-story.m4a', 'mo-man-bhamara.m4a',
                // Sambalpuri celebration (2 songs)
                'rangabati.m4a', 'nuakhai-re-nuakhai.m4a'
            ]
        },
        
        'cultural-mixed': {
            path: 'playlists/cultural-mixed/',
            songs: [
                // Hindi cultural (5 songs)
                'tum-hi-ho.m4a', 'jeene-laga-hoon.m4a', 'raabta.m4a', 'sunn-raha-hai.m4a', 'mann-mera.m4a',
                // Odia cultural (5 songs)
                'odia-mana.m4a', 'prema-adhara.m4a', 'tu-mora-janha.m4a', 'balunga-kete-katha.m4a', 'sapana-mo.m4a',
                // Sambalpuri cultural (5 songs)
                'bande-utkala-janani.m4a', 'sundarei-mo-gaon.m4a', 'gori-gori-rani.m4a',
                'sandhya-beluara.m4a', 'chandana-rati-swapna.m4a'
            ]
        }
    };
            odia: [
                'tu-mo-love-story.m4a',
                'laila-o-laila.m4a',
                'rangabati.m4a'
            ]
        },
        
        'love-story': {
            hindi: [
                '02-Kahani-Suno.m4a', // Current file
                'tera-ban-jaunga.m4a',
                'kabira.m4a',
                'samjhawan.m4a',
                'humsafar.m4a',
                'khamoshiyan.m4a',
                'muskurane.m4a'
            ],
            odia: [
                'balunga-kete-katha.m4a',
                'mo-kanthe-basichhi.m4a',
                'emiti-bela-gala.m4a'
            ]
        },
        
        games: {
            hindi: [
                'nagada-sang-dhol.m4a',
                'saturday-saturday.m4a',
                'abhi-toh-party-shuru-hui-hai.m4a',
                'tune-maari-entriyaan.m4a',
                'kar-gayi-chull.m4a'
            ],
            odia: [
                'tu-mo-love-story.m4a',
                'laila-o-laila.m4a',
                'rangabati.m4a',
                'mo-man-bhamara.m4a'
            ]
        },
        
        surprises: {
            hindi: [
                'hawayein.m4a',
                'channa-mereya.m4a',
                'bulleya.m4a',
                'janam-janam.m4a',
                'gerua.m4a',
                'manma-emotion-jaage.m4a'
            ],
            odia: [
                'milana-sagara.m4a',
                'prema-adhara.m4a',
                'chanda-mama.m4a',
                'ei-je-dunia.m4a'
            ]
        },
        
        'photo-gallery': {
            hindi: [
                'dil-diyan-gallan.m4a',
                'ik-vaari-aa.m4a',
                'zara-sa.m4a',
                'yeh-dooriyan.m4a',
                'phir-mohabbat.m4a',
                'pee-loon.m4a'
            ],
            odia: [
                'mo-priya-heba.m4a',
                'to-akhi-mo-aaina.m4a',
                'milana-sagara.m4a'
            ]
        },
        
        // Use existing songs for now
        main: {
            current: [
                'Arijitsingh.m4a',
                '01-nit-khair-manga.m4a',
                '02-Kahani-Suno.m4a',
                '03-champakali.m4a',
                '04-jo-tum-mere-ho.m4a',
                '05-paro.m4a',
                '06-Jugrafiyan.m4a'
            ]
        }
    };

    initializePlayer() {
        this.audio.volume = this.volume;
        this.audio.loop = false;
        
        // Event listeners for audio
        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.addEventListener('loadstart', () => this.showLoading());
        this.audio.addEventListener('canplay', () => this.hideLoading());
        this.audio.addEventListener('error', (e) => this.handleError(e));
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        // Detect page from URL
        if (path.includes('anniversary.html') || hash.includes('anniversary')) {
            this.currentPage = 'anniversary';
        } else if (path.includes('countdown.html') || hash.includes('countdown')) {
            this.currentPage = 'countdown';
        } else if (path.includes('love-story.html') || hash.includes('love-story')) {
            this.currentPage = 'love-story';
        } else if (path.includes('games.html') || hash.includes('games')) {
            this.currentPage = 'games';
        } else if (path.includes('surprises.html') || hash.includes('surprises')) {
            this.currentPage = 'surprises';
        } else if (path.includes('photo-gallery.html') || hash.includes('photo-gallery')) {
            this.currentPage = 'photo-gallery';
        } else {
            this.currentPage = 'main';
        }
        
        this.loadPagePlaylist();
    }

    loadPagePlaylist() {
        const pageConfig = this.playlists[this.currentPage];
        
        if (!pageConfig) {
            this.currentPlaylist = this.playlists.main.current;
            return;
        }

        // Build playlist based on language preference
        this.currentPlaylist = [];
        
        if (this.language === 'hindi' && pageConfig.hindi) {
            this.currentPlaylist = [...pageConfig.hindi];
        } else if (this.language === 'odia' && pageConfig.odia) {
            this.currentPlaylist = [...pageConfig.odia];
        } else if (this.language === 'mixed') {
            // Mix both languages
            if (pageConfig.hindi) this.currentPlaylist.push(...pageConfig.hindi);
            if (pageConfig.odia) this.currentPlaylist.push(...pageConfig.odia);
            this.shufflePlaylist();
        } else {
            // Fallback to current songs
            this.currentPlaylist = this.playlists.main.current;
        }
        
        this.currentTrack = 0;
        this.updateUI();
    }

    getTrackPath(filename) {
        // Determine the correct directory based on current page and file
        if (this.currentPage === 'main' || !this.playlists[this.currentPage]) {
            return `/public/assets/music/${filename}`;
        }
        
        // Check if it's an existing file in main directory
        if (this.playlists.main.current.includes(filename)) {
            return `/public/assets/music/${filename}`;
        }
        
        // Otherwise, use page-specific directory
        return `/public/assets/music/${this.currentPage}/${filename}`;
    }

    play() {
        if (this.currentPlaylist.length === 0) return;
        
        const track = this.currentPlaylist[this.currentTrack];
        const trackPath = this.getTrackPath(track);
        
        this.audio.src = trackPath;
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
        }).catch(error => {
            console.error('Playback failed:', error);
            this.playNext(); // Try next song
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
    }

    playNext() {
        this.currentTrack = (this.currentTrack + 1) % this.currentPlaylist.length;
        this.play();
    }

    playPrevious() {
        this.currentTrack = this.currentTrack === 0 ? 
            this.currentPlaylist.length - 1 : 
            this.currentTrack - 1;
        this.play();
    }

    setLanguage(language) {
        this.language = language;
        this.loadPagePlaylist();
        if (this.isPlaying) {
            this.play();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
    }

    fadeIn(duration = 2000) {
        const startVolume = 0;
        const endVolume = this.volume;
        const steps = 50;
        const stepTime = duration / steps;
        const stepVolume = (endVolume - startVolume) / steps;
        
        this.audio.volume = startVolume;
        let currentStep = 0;
        
        this.fadeInterval = setInterval(() => {
            currentStep++;
            this.audio.volume = Math.min(endVolume, startVolume + (stepVolume * currentStep));
            
            if (currentStep >= steps) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            }
        }, stepTime);
    }

    fadeOut(duration = 2000) {
        const startVolume = this.audio.volume;
        const endVolume = 0;
        const steps = 50;
        const stepTime = duration / steps;
        const stepVolume = (startVolume - endVolume) / steps;
        
        let currentStep = 0;
        
        this.fadeInterval = setInterval(() => {
            currentStep++;
            this.audio.volume = Math.max(endVolume, startVolume - (stepVolume * currentStep));
            
            if (currentStep >= steps) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
                this.pause();
            }
        }, stepTime);
    }

    shufflePlaylist() {
        for (let i = this.currentPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentPlaylist[i], this.currentPlaylist[j]] = 
            [this.currentPlaylist[j], this.currentPlaylist[i]];
        }
    }

    setupEventListeners() {
        // Listen for page changes
        window.addEventListener('hashchange', () => {
            const oldPage = this.currentPage;
            this.detectCurrentPage();
            
            if (oldPage !== this.currentPage) {
                this.fadeOut(1000);
                setTimeout(() => {
                    this.fadeIn(1000);
                }, 1000);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case 'p': // Alt+P for play/pause
                        e.preventDefault();
                        this.isPlaying ? this.pause() : this.play();
                        break;
                    case 'n': // Alt+N for next
                        e.preventDefault();
                        this.playNext();
                        break;
                    case 'b': // Alt+B for previous
                        e.preventDefault();
                        this.playPrevious();
                        break;
                    case 'h': // Alt+H for Hindi
                        e.preventDefault();
                        this.setLanguage('hindi');
                        break;
                    case 'o': // Alt+O for Odia
                        e.preventDefault();
                        this.setLanguage('odia');
                        break;
                    case 'm': // Alt+M for Mixed
                        e.preventDefault();
                        this.setLanguage('mixed');
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
            playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause' : 'Play');
        }

        // Update track info
        const trackInfo = document.querySelector('.music-track-info');
        if (trackInfo && this.currentPlaylist.length > 0) {
            const currentTrackName = this.currentPlaylist[this.currentTrack]
                .replace('.m4a', '')
                .replace(/^\d+-/, '')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            
            trackInfo.textContent = `${currentTrackName} (${this.currentPage})`;
        }

        // Update language indicator
        const langIndicator = document.querySelector('.music-language-indicator');
        if (langIndicator) {
            langIndicator.textContent = this.language.toUpperCase();
            langIndicator.className = `music-language-indicator ${this.language}`;
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
        console.error('Music playback error:', error);
        // Try next song on error
        setTimeout(() => this.playNext(), 1000);
    }

    // Public methods for UI controls
    toggle() {
        this.isPlaying ? this.pause() : this.play();
    }

    getCurrentTrackInfo() {
        if (this.currentPlaylist.length === 0) return null;
        
        return {
            name: this.currentPlaylist[this.currentTrack],
            index: this.currentTrack + 1,
            total: this.currentPlaylist.length,
            page: this.currentPage,
            language: this.language
        };
    }
}

// Initialize the enhanced music manager
window.pageSpecificMusicManager = new PageSpecificMusicManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageSpecificMusicManager;
}
