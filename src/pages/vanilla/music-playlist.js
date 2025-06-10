/**
 * Music Playlist Page - Vanilla JavaScript Implementation
 * Anniversary Website v4.0.0
 * 
 * Interactive music playlist page with audio player,
 * song management, categories, and romantic effects.
 */

export class MusicPlaylistPage {
  constructor() {
    this.container = null;
    this.audioElement = null;
    this.currentSong = null;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.currentCategory = 'all';
    this.playlist = [];
    this.particles = [];
    this.animationId = null;
    this.isVisible = false;
    
    // Page configuration
    this.config = {
      particleCount: 25,
      visualizerBars: 12,
      defaultVolume: 0.7,
      categories: [
        { id: 'all', label: 'All Songs', icon: '🎵' },
        { id: 'romantic', label: 'Romantic', icon: '💕' },
        { id: 'happy', label: 'Happy', icon: '😊' },
        { id: 'nostalgic', label: 'Nostalgic', icon: '🎭' },
        { id: 'special', label: 'Our Specials', icon: '⭐' }
      ]
    };
  }

  /**
   * Create and return the page HTML structure
   */
  render() {
    const html = `
      <div class="music-playlist-page min-h-screen relative">
        <!-- Particle Canvas -->
        <canvas id="music-particles" class="fixed inset-0 pointer-events-none z-0"></canvas>
        
        <!-- Floating Musical Notes -->
        <div class="floating-notes-container"></div>
        
        <!-- Main Content -->
        <div class="relative z-10 px-4 py-8">
          <div class="max-w-6xl mx-auto">
            
            <!-- Header Section -->
            <div class="text-center mb-12">
              <div class="music-icon-container mb-6">
                <div class="music-icon text-6xl md:text-7xl">🎵</div>
                <div class="equalizer">
                  ${Array.from({length: 7}, (_, i) => `<div class="eq-bar" style="animation-delay: ${i * 0.1}s;"></div>`).join('')}
                </div>
              </div>
              <h1 class="music-title text-4xl md:text-6xl font-bold gradient-text mb-4 font-dancing">
                🎵 Our Love Songs 🎵
              </h1>
              <p class="music-subtitle text-xl text-pink-700 font-dancing mb-8">
                The soundtrack to our beautiful love story 🎶
              </p>
            </div>

            <!-- Music Player Section -->
            <div class="music-player-section mb-12">
              <div class="main-music-player glassmorphism rounded-2xl p-8">
                
                <!-- Now Playing Display -->
                <div class="now-playing mb-6">
                  <div class="album-art">
                    <div class="album-cover">🎵</div>
                    <div class="music-visualizer">
                      ${Array.from({length: this.config.visualizerBars}, (_, i) => 
                        `<div class="visualizer-bar" style="animation-delay: ${i * 0.1}s;"></div>`
                      ).join('')}
                    </div>
                  </div>
                  <div class="track-info">
                    <div class="track-title" id="currentSongTitle">Select a song to play</div>
                    <div class="track-artist" id="currentSongArtist">Our Love Collection</div>
                  </div>
                </div>

                <!-- Player Controls -->
                <div class="player-controls mb-6">
                  <button class="player-btn" id="prevBtn" title="Previous Song">
                    <span class="btn-icon">⏮️</span>
                  </button>
                  <button class="player-btn play-btn" id="playBtn" title="Play/Pause">
                    <span class="btn-icon">▶️</span>
                  </button>
                  <button class="player-btn" id="nextBtn" title="Next Song">
                    <span class="btn-icon">⏭️</span>
                  </button>
                  <button class="player-btn" id="shuffleBtn" title="Shuffle">
                    <span class="btn-icon">🔀</span>
                  </button>
                  <button class="player-btn" id="repeatBtn" title="Repeat">
                    <span class="btn-icon">🔁</span>
                  </button>
                </div>

                <!-- Progress Bar -->
                <div class="player-progress mb-4">
                  <div class="progress-bar" id="progressBarContainer">
                    <div class="progress-fill" id="progressFill"></div>
                  </div>
                  <div class="time-display">
                    <span id="currentTime">0:00</span>
                    <span id="duration">0:00</span>
                  </div>
                </div>

                <!-- Volume Control -->
                <div class="player-volume">
                  <span class="volume-icon">🔊</span>
                  <input type="range" class="volume-slider" id="volumeSlider" 
                         min="0" max="100" value="70">
                </div>

              </div>
            </div>

            <!-- Category Filters -->
            <div class="category-section mb-8">
              <h2 class="text-2xl font-dancing text-purple-600 mb-4 text-center">Music Moods</h2>
              <div class="category-filters">
                ${this.renderCategoryButtons()}
              </div>
            </div>

            <!-- Playlist Section -->
            <div class="playlist-section mb-12">
              <h2 class="text-2xl font-dancing text-purple-600 mb-6 text-center">Our Playlist</h2>
              <div class="music-playlist" id="musicPlaylist">
                <!-- Songs will be rendered here -->
              </div>
            </div>

            <!-- Add Song Section -->
            <div class="add-song-section mb-12">
              <div class="glassmorphism rounded-2xl p-8">
                <h2 class="text-2xl font-dancing text-purple-600 mb-6 text-center">
                  Create Our Playlist
                </h2>
                <div class="creation-tools">
                  <form class="add-song-form" id="addSongForm">
                    <input type="text" placeholder="Song Title" class="song-input" name="songTitle" required>
                    <input type="text" placeholder="Artist" class="song-input" name="songArtist" required>
                    <input type="text" placeholder="Why this song is special to us..." class="song-input" name="songDescription">
                    <select class="mood-select" name="songCategory" required>
                      <option value="romantic">💕 Romantic</option>
                      <option value="happy">😊 Happy</option>
                      <option value="nostalgic">🎭 Nostalgic</option>
                      <option value="special">⭐ Our Special</option>
                    </select>
                    <button type="submit" class="add-song-btn">Add to Our Playlist 🎵</button>
                  </form>
                </div>
              </div>
            </div>

            <!-- Music Statistics -->
            <div class="music-stats-section mb-12">
              <h2 class="text-2xl font-dancing text-purple-600 mb-8 text-center">
                Our Music in Numbers
              </h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-number" id="totalSongs">0</div>
                  <div class="stat-label">Total Songs</div>
                  <div class="stat-description">In our love playlist</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number" id="favoriteSongs">0</div>
                  <div class="stat-label">Favorite Songs</div>
                  <div class="stat-description">Extra special to our hearts</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number" id="playlistHours">2.5</div>
                  <div class="stat-label">Hours of Music</div>
                  <div class="stat-description">Of pure romantic vibes</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">∞</div>
                  <div class="stat-label">Love Songs</div>
                  <div class="stat-description">In our hearts forever</div>
                </div>
              </div>
            </div>

            <!-- Back to Home -->
            <div class="text-center">
              <button class="home-button bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                🏠 Back to Home
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Render category filter buttons
   */
  renderCategoryButtons() {
    return this.config.categories.map(category => `
      <button class="category-btn ${category.id === 'all' ? 'active' : ''}" 
              data-category="${category.id}">
        ${category.icon} ${category.label}
      </button>
    `).join('');
  }

  /**
   * Initialize the page
   */
  async init(container) {
    this.container = container;
    this.container.innerHTML = this.render();
    this.isVisible = true;

    // Set global reference for onclick handlers
    window.musicPlaylistPage = this;

    // Initialize components
    this.setupAudioElement();
    this.loadPlaylist();
    this.setupEventListeners();
    this.initializeParticleSystem();
    this.initializeFloatingNotes();
    this.initializePlayer();
    this.startAnimations();
    this.startStatsAnimation();

    console.log('Music Playlist page initialized');
  }

  /**
   * Setup audio element
   */
  setupAudioElement() {
    this.audioElement = new Audio();
    this.audioElement.volume = this.config.defaultVolume;
    this.audioElement.crossOrigin = 'anonymous';
    
    // Audio event listeners
    this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
    this.audioElement.addEventListener('ended', () => this.nextSong());
    this.audioElement.addEventListener('play', () => this.onAudioPlay());
    this.audioElement.addEventListener('pause', () => this.onAudioPause());
    this.audioElement.addEventListener('error', (e) => this.onAudioError(e));
  }

  /**
   * Load default playlist
   */
  loadPlaylist() {
    this.playlist = [
      {
        id: 1,
        title: "Perfect",
        artist: "Ed Sheeran",
        category: "romantic",
        duration: "4:23",
        favorite: true,
        file: "assets/music/perfect.mp3",
        description: "The song that perfectly describes how we feel about each other"
      },
      {
        id: 2,
        title: "All of Me",
        artist: "John Legend",
        category: "romantic",
        duration: "4:29",
        favorite: true,
        file: "assets/music/all-of-me.mp3",
        description: "Every part of me loves every part of you"
      },
      {
        id: 3,
        title: "Happy",
        artist: "Pharrell Williams",
        category: "happy",
        duration: "3:53",
        favorite: false,
        file: "assets/music/happy.mp3",
        description: "How we feel when we're together"
      },
      {
        id: 4,
        title: "Thinking Out Loud",
        artist: "Ed Sheeran",
        category: "romantic",
        duration: "4:41",
        favorite: true,
        file: "assets/music/thinking-out-loud.mp3",
        description: "Growing old together, forever in love"
      },
      {
        id: 5,
        title: "The Way You Look Tonight",
        artist: "Tony Bennett",
        category: "nostalgic",
        duration: "3:21",
        favorite: false,
        file: "assets/music/the-way-you-look-tonight.mp3",
        description: "Classic romance that never gets old"
      },
      {
        id: 6,
        title: "Our Song",
        artist: "Jerry & Soumya",
        category: "special",
        duration: "3:45",
        favorite: true,
        file: "assets/music/our-song.mp3",
        description: "The song we call ours - created with love"
      },
      {
        id: 7,
        title: "Can't Help Myself",
        artist: "Four Tops",
        category: "happy",
        duration: "2:53",
        favorite: false,
        file: "assets/music/cant-help-myself.mp3",
        description: "Can't help falling in love with you every day"
      },
      {
        id: 8,
        title: "First Dance",
        artist: "Our Memory",
        category: "special",
        duration: "4:12",
        favorite: true,
        file: "assets/music/first-dance.mp3",
        description: "The song from our first dance together"
      }
    ];

    this.renderPlaylist();
    this.updateMusicStats();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Player controls
    const playBtn = this.container.querySelector('#playBtn');
    const prevBtn = this.container.querySelector('#prevBtn');
    const nextBtn = this.container.querySelector('#nextBtn');
    const shuffleBtn = this.container.querySelector('#shuffleBtn');
    const repeatBtn = this.container.querySelector('#repeatBtn');
    
    if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());
    if (prevBtn) prevBtn.addEventListener('click', () => this.previousSong());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSong());
    if (shuffleBtn) shuffleBtn.addEventListener('click', () => this.toggleShuffle());
    if (repeatBtn) repeatBtn.addEventListener('click', () => this.toggleRepeat());

    // Volume control
    const volumeSlider = this.container.querySelector('#volumeSlider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.audioElement.volume = e.target.value / 100;
      });
    }

    // Progress bar
    const progressContainer = this.container.querySelector('#progressBarContainer');
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => this.seekTo(e));
    }

    // Category filters
    const categoryBtns = this.container.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        this.filterByCategory(category);
      });
    });

    // Add song form
    const addSongForm = this.container.querySelector('#addSongForm');
    if (addSongForm) {
      addSongForm.addEventListener('submit', (e) => this.addCustomSong(e));
    }

    // Home button
    const homeButton = this.container.querySelector('.home-button');
    if (homeButton) {
      homeButton.addEventListener('click', () => this.handleNavigation('/'));
    }
  }

  /**
   * Initialize particle system
   */
  initializeParticleSystem() {
    const canvas = this.container.querySelector('#music-particles');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    // Create music-themed particles
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.6 + 0.3,
        color: `hsl(${Math.random() * 60 + 280}, 70%, 70%)`, // Purple to pink hues
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }

    // Animation loop
    const animateParticles = () => {
      if (!this.isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw musical note
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        ctx.font = `${particle.size * 4}px Arial`;
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.textAlign = 'center';
        ctx.fillText('♪', 0, 0);
        ctx.restore();
      });

      this.animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /**
   * Initialize floating musical notes
   */
  initializeFloatingNotes() {
    const container = this.container.querySelector('.floating-notes-container');
    if (!container) return;

    const notes = ['♪', '♫', '♬', '♩', '♭', '♯'];
    
    // Create floating notes
    for (let i = 0; i < 20; i++) {
      const note = document.createElement('div');
      note.className = 'floating-note';
      note.textContent = notes[Math.floor(Math.random() * notes.length)];
      note.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 15}px;
        color: rgba(147, 51, 234, ${Math.random() * 0.3 + 0.1});
        animation: float-music-note ${Math.random() * 15 + 15}s infinite linear;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 10}s;
        pointer-events: none;
        font-weight: bold;
      `;
      container.appendChild(note);
    }
  }

  /**
   * Render playlist
   */
  renderPlaylist() {
    const playlistContainer = this.container.querySelector('#musicPlaylist');
    if (!playlistContainer) return;

    const filteredSongs = this.currentCategory === 'all' 
      ? this.playlist 
      : this.playlist.filter(song => song.category === this.currentCategory);

    playlistContainer.innerHTML = filteredSongs.map((song, index) => `
      <div class="song-item ${this.currentSong && this.currentSong.id === song.id ? 'active' : ''}"
           data-song-id="${song.id}" onclick="musicPlaylistPage.playSong(${song.id})">
        <div class="song-number">${String(index + 1).padStart(2, '0')}</div>
        <div class="song-info">
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
          <div class="song-description">${song.description || ''}</div>
        </div>
        <div class="song-duration">${song.duration}</div>
        <div class="song-actions">
          <button class="song-play-btn" onclick="event.stopPropagation(); musicPlaylistPage.playSong(${song.id})">
            ▶️
          </button>
          <button class="song-favorite-btn ${song.favorite ? 'favorited' : ''}" 
                  onclick="event.stopPropagation(); musicPlaylistPage.toggleFavorite(${song.id})">
            ${song.favorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Initialize player
   */
  initializePlayer() {
    if (this.playlist.length > 0) {
      this.currentSong = this.playlist[0];
      this.updatePlayerDisplay();
    }
  }

  /**
   * Start page animations
   */
  startAnimations() {
    // Animate music icon
    const musicIcon = this.container.querySelector('.music-icon');
    if (musicIcon) {
      musicIcon.classList.add('animate-bounce-slow');
    }

    // Animate equalizer bars
    const eqBars = this.container.querySelectorAll('.eq-bar');
    eqBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.classList.add('animate-music-bar');
      }, index * 100);
    });

    // Animate song items with stagger
    const songItems = this.container.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('slide-in-up');
      }, index * 50);
    });
  }

  /**
   * Start statistics animation
   */
  startStatsAnimation() {
    const stats = [
      { id: 'totalSongs', target: this.playlist.length },
      { id: 'favoriteSongs', target: this.playlist.filter(s => s.favorite).length }
    ];
    
    stats.forEach(stat => {
      this.animateCounter(stat.id, stat.target);
    });
  }

  /**
   * Animate counter
   */
  animateCounter(elementId, target) {
    const element = this.container.querySelector(`#${elementId}`);
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

  /**
   * Audio event handlers
   */
  onAudioPlay() {
    this.isPlaying = true;
    this.updatePlayButton();
    this.startVisualizer();
  }

  onAudioPause() {
    this.isPlaying = false;
    this.updatePlayButton();
    this.stopVisualizer();
  }

  onAudioError(error) {
    console.warn('Audio playback error:', error);
    this.showNotification('Audio playback failed. Please try another song.');
  }

  /**
   * Player controls
   */
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  async play() {
    if (this.currentSong && this.audioElement) {
      try {
        // Set audio source if needed
        if (this.audioElement.src !== this.currentSong.file) {
          this.audioElement.src = this.currentSong.file;
        }
        
        await this.audioElement.play();
      } catch (error) {
        console.warn('Play failed:', error);
        this.showNotification('Unable to play audio. User interaction may be required.');
      }
    }
  }

  pause() {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
  }

  nextSong() {
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.currentSong = this.playlist[this.currentIndex];
    this.updatePlayerDisplay();
    this.renderPlaylist();
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
    this.renderPlaylist();
    if (this.isPlaying) {
      this.play();
    }
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

  /**
   * UI update methods
   */
  updatePlayerDisplay() {
    const songTitle = this.container.querySelector('#currentSongTitle');
    const songArtist = this.container.querySelector('#currentSongArtist');
    
    if (songTitle && this.currentSong) {
      songTitle.textContent = this.currentSong.title;
    }
    if (songArtist && this.currentSong) {
      songArtist.textContent = this.currentSong.artist;
    }
  }

  updatePlayButton() {
    const playBtn = this.container.querySelector('#playBtn .btn-icon');
    if (playBtn) {
      playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }
  }

  updateDuration() {
    const durationElement = this.container.querySelector('#duration');
    if (durationElement && this.audioElement.duration) {
      durationElement.textContent = this.formatTime(this.audioElement.duration);
    }
  }

  updateProgress() {
    if (!this.audioElement.duration) return;
    
    const progressFill = this.container.querySelector('#progressFill');
    const currentTimeElement = this.container.querySelector('#currentTime');
    
    const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    if (currentTimeElement) {
      currentTimeElement.textContent = this.formatTime(this.audioElement.currentTime);
    }
  }

  /**
   * Additional features
   */
  toggleShuffle() {
    this.showNotification('Shuffle mode toggled!');
  }

  toggleRepeat() {
    this.showNotification('Repeat mode toggled!');
  }

  seekTo(event) {
    if (!this.audioElement.duration) return;
    
    const progressContainer = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressContainer.offsetWidth;
    const percentage = (clickX / width);
    const newTime = percentage * this.audioElement.duration;
    
    this.audioElement.currentTime = newTime;
  }

  filterByCategory(category) {
    this.currentCategory = category;
    
    // Update active button
    this.container.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    this.container.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    this.renderPlaylist();
  }

  toggleFavorite(songId) {
    const song = this.playlist.find(s => s.id === songId);
    if (song) {
      song.favorite = !song.favorite;
      this.renderPlaylist();
      this.updateMusicStats();
      this.showNotification(song.favorite ? 'Added to favorites!' : 'Removed from favorites!');
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
      file: null,
      description: formData.get('songDescription')
    };
    
    this.playlist.push(newSong);
    this.renderPlaylist();
    this.updateMusicStats();
    event.target.reset();
    
    this.showNotification('Song added to playlist! 🎵');
  }

  updateMusicStats() {
    const favoriteCount = this.playlist.filter(s => s.favorite).length;
    const totalSongs = this.playlist.length;
    
    const favElement = this.container.querySelector('#favoriteSongs');
    const totalElement = this.container.querySelector('#totalSongs');
    
    if (favElement) favElement.textContent = favoriteCount;
    if (totalElement) totalElement.textContent = totalSongs;
  }

  /**
   * Visualizer effects
   */
  startVisualizer() {
    const visualizerBars = this.container.querySelectorAll('.visualizer-bar');
    visualizerBars.forEach(bar => {
      bar.classList.add('active');
    });
  }

  stopVisualizer() {
    const visualizerBars = this.container.querySelectorAll('.visualizer-bar');
    visualizerBars.forEach(bar => {
      bar.classList.remove('active');
    });
  }

  /**
   * Utility methods
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #9333ea, #ec4899);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 10px 30px rgba(147, 51, 234, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  handleNavigation(route) {
    if (window.VanillaCore && window.VanillaCore.router) {
      window.VanillaCore.router.navigate(route);
    } else {
      window.location.hash = route;
    }
  }

  /**
   * Cleanup when page is destroyed
   */
  destroy() {
    this.isVisible = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }

    this.particles = [];
    
    // Clear global reference
    window.musicPlaylistPage = null;
    
    if (this.container) {
      this.container.innerHTML = '';
    }

    console.log('Music Playlist page destroyed');
  }
}

// CSS Styles for the music playlist page
const musicPlaylistStyles = `
  .music-playlist-page {
    background: linear-gradient(135deg, #fef7f0 0%, #fdf2f8 25%, #f3e8ff 50%, #fdf2f8 75%, #fef7f0 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  .music-icon-container {
    position: relative;
    display: inline-block;
  }

  .music-icon {
    background: linear-gradient(135deg, #9333ea, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 4px 8px rgba(147, 51, 234, 0.3));
  }

  .equalizer {
    display: flex;
    align-items: end;
    gap: 2px;
    height: 20px;
    justify-content: center;
    margin-top: 10px;
  }

  .eq-bar {
    width: 3px;
    background: linear-gradient(to top, #ec4899, #f472b6);
    border-radius: 2px;
    height: 4px;
    animation: musicBar 1.5s ease-in-out infinite;
  }

  .animate-music-bar {
    animation: musicBar 1.5s ease-in-out infinite !important;
  }

  @keyframes musicBar {
    0%, 100% { height: 4px; }
    50% { height: 20px; }
  }

  .music-title {
    background: linear-gradient(135deg, #9333ea, #ec4899, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(147, 51, 234, 0.3);
  }

  .main-music-player {
    backdrop-filter: blur(30px);
    box-shadow: 0 25px 50px rgba(147, 51, 234, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .now-playing {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .album-art {
    position: relative;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #9333ea, #ec4899);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
  }

  .music-visualizer {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1px;
    height: 12px;
  }

  .visualizer-bar {
    width: 2px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 1px;
    height: 2px;
    transition: height 0.2s ease;
  }

  .visualizer-bar.active {
    animation: visualizerPulse 0.8s ease-in-out infinite;
  }

  @keyframes visualizerPulse {
    0%, 100% { height: 2px; }
    50% { height: 12px; }
  }

  .track-info {
    flex: 1;
  }

  .track-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #9333ea;
    font-family: 'Dancing Script', cursive;
    margin-bottom: 0.25rem;
  }

  .track-artist {
    color: #6b7280;
    font-size: 1rem;
  }

  .player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .player-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(147, 51, 234, 0.1);
    border: 2px solid rgba(147, 51, 234, 0.3);
    color: #9333ea;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .player-btn:hover {
    background: rgba(147, 51, 234, 0.2);
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(147, 51, 234, 0.3);
  }

  .play-btn {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #9333ea, #ec4899);
    color: white;
    border: none;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(147, 51, 234, 0.2);
    border-radius: 3px;
    cursor: pointer;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #9333ea, #ec4899);
    width: 0%;
    transition: width 0.1s ease;
    border-radius: 3px;
  }

  .time-display {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .player-volume {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }

  .volume-slider {
    width: 100px;
    height: 6px;
    background: rgba(147, 51, 234, 0.2);
    border-radius: 3px;
    appearance: none;
    cursor: pointer;
  }

  .volume-slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #9333ea, #ec4899);
    cursor: pointer;
  }

  .category-filters {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .category-btn {
    padding: 0.75rem 1.5rem;
    background: rgba(147, 51, 234, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(147, 51, 234, 0.3);
    border-radius: 2rem;
    color: #9333ea;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .category-btn:hover,
  .category-btn.active {
    background: rgba(147, 51, 234, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(147, 51, 234, 0.3);
  }

  .song-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 1rem 0;
    border: 1px solid rgba(147, 51, 234, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
    transform: translateY(20px);
    opacity: 0;
  }

  .song-item.slide-in-up {
    transform: translateY(0);
    opacity: 1;
  }

  .song-item:hover {
    background: rgba(147, 51, 234, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(147, 51, 234, 0.2);
  }

  .song-item.active {
    background: rgba(147, 51, 234, 0.15);
    border-color: rgba(147, 51, 234, 0.5);
  }

  .song-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #9333ea, #ec4899);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .song-info {
    flex: 1;
  }

  .song-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .song-artist {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .song-description {
    color: #9ca3af;
    font-size: 0.75rem;
    font-style: italic;
  }

  .song-duration {
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .song-actions {
    display: flex;
    gap: 0.5rem;
  }

  .song-play-btn,
  .song-favorite-btn {
    background: rgba(147, 51, 234, 0.2);
    border: 1px solid rgba(147, 51, 234, 0.3);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .song-favorite-btn.favorited {
    background: rgba(236, 72, 153, 0.3);
    border-color: rgba(236, 72, 153, 0.5);
  }

  .song-play-btn:hover,
  .song-favorite-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(147, 51, 234, 0.3);
  }

  .add-song-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-radius: 1.5rem;
    padding: 2rem;
    border: 1px solid rgba(147, 51, 234, 0.2);
  }

  .song-input,
  .mood-select {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(147, 51, 234, 0.3);
    border-radius: 1rem;
    color: #374151;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .song-input:focus,
  .mood-select:focus {
    outline: none;
    border-color: rgba(147, 51, 234, 0.5);
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }

  .add-song-btn {
    background: linear-gradient(135deg, #9333ea, #ec4899);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-song-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(147, 51, 234, 0.3);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 1.5rem;
    padding: 2rem;
    text-align: center;
    border: 1px solid rgba(147, 51, 234, 0.2);
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(147, 51, 234, 0.2);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #9333ea;
    font-family: 'Dancing Script', cursive;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .stat-description {
    font-size: 0.875rem;
    color: #6b7280;
  }

  @keyframes float-music-note {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }

  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .now-playing {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .player-controls {
      gap: 0.75rem;
    }

    .player-btn {
      width: 45px;
      height: 45px;
    }

    .play-btn {
      width: 55px;
      height: 55px;
    }

    .song-item {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
      padding: 1rem;
    }

    .song-actions {
      justify-content: center;
    }

    .category-filters {
      justify-content: center;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .music-title {
      font-size: 2.5rem !important;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .add-song-form {
      padding: 1.5rem;
    }
  }
`;

// Inject styles
if (!document.getElementById('music-playlist-page-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'music-playlist-page-styles';
  styleSheet.textContent = musicPlaylistStyles;
  document.head.appendChild(styleSheet);
}

// Global reference for onclick handlers
window.musicPlaylistPage = null;

export default MusicPlaylistPage;
