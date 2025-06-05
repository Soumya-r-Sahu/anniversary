import { BaseAudioManager } from './BaseAudioManager.js';

/**
 * Unified Music Manager - Consolidates all music functionality
 * Replaces multiple music managers with a single, optimized solution
 * Version: 3.0.0 - Now extends BaseAudioManager
 */

class UnifiedMusicManager extends BaseAudioManager {
  constructor(options = {}) {
    // Set default playlist for base manager
    const defaultPlaylist = [
      'music/Arijitsingh.m4a',
      'music/queue_song/01-nit-khair-manga.m4a',
      'music/queue_song/02-Kahani-Suno.m4a',
      'music/queue_song/03-champakali.m4a',
      'music/queue_song/04-jo-tum-mere-ho.m4a',
      'music/queue_song/05-paro.m4a',
      'music/queue_song/06-Jugrafiyan.m4a'
    ];

    super({
      ...options,
      playlist: options.playlist || defaultPlaylist,
      enableVisualizer: options.enableVisualizer !== false,
      enablePlaylist: options.enablePlaylist !== false
    });

    // Additional state specific to UnifiedMusicManager
    this.extendedState = {
      currentTrack: null
    };

    // DOM references for unified manager
    this.elements = {};
    this.visualizerContext = null;

    // Initialize with parent's init method
    this.onInitialized(() => {
      this.initializeExtended();
    });
  }

  /**
   * Extended initialization specific to UnifiedMusicManager
   */
  initializeExtended() {
    console.log('🎵 Initializing Unified Music Manager');
    
    // Setup extended DOM elements
    this.setupExtendedDOM();
    
    // Setup visualizer if enabled
    if (this.config.enableVisualizer) {
      this.setupVisualizerAnimation();
    }

    console.log('🎵 Unified Music Manager fully initialized');
  }

  /**
   * Setup extended DOM elements specific to unified manager
   */
  setupExtendedDOM() {
    // Override or extend parent DOM setup as needed
    super.setupDOM();
    
    // Add any additional DOM setup here
    this.setupVisualizerCanvas();
  }

  /**
   * Setup visualizer canvas
   */
  setupVisualizerCanvas() {
    const visualizerCanvas = document.getElementById('visualizer-canvas');
    if (visualizerCanvas && this.config.enableVisualizer) {
      this.visualizerContext = visualizerCanvas.getContext('2d');
    }
  }

  /**
   * Setup visualizer animation - unique to UnifiedMusicManager
   */
  setupVisualizerAnimation() {
    if (!this.visualizerContext || !this.audioAnalyzer) return;

    const animate = () => {
      requestAnimationFrame(animate);
      this.drawVisualizer();
    };
    animate();
  }

  /**
   * Draw visualizer - unique to UnifiedMusicManager
   */
  drawVisualizer() {
    if (!this.visualizerContext || !this.audioAnalyzer) return;

    const canvas = this.visualizerContext.canvas;
    const bufferLength = this.audioAnalyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    this.audioAnalyzer.getByteFrequencyData(dataArray);
    
    this.visualizerContext.fillStyle = 'rgb(0, 0, 0)';
    this.visualizerContext.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      
      this.visualizerContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      this.visualizerContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      
      x += barWidth + 1;
    }
  }

  /**
   * Override setupAudio to check for existing DOM element
   */
  async setupAudio() {
    // Check if there's an existing audio element in the DOM  
    const existingAudio = document.getElementById('background-music');
    if (existingAudio && existingAudio instanceof HTMLAudioElement) {
      this.audio = existingAudio;
      console.log('🎵 Using existing audio element');
      
      // Setup analyzer for existing audio
      if (this.config.enableVisualizer) {
        this.setupAudioAnalyzer();
      }
    } else {
      // Use parent's setup method
      await super.setupAudio();
      console.log('🎵 Created new audio element');
    }

    // Additional configuration for unified manager
    if (this.audio) {
      this.audio.loop = false; // Disable loop as playlist handles this
      this.audio.id = 'background-music';
    }
  }

  /**
   * Setup DOM elements - extends parent functionality
   */
  setupDOM() {
    // Call parent setup first
    super.setupDOM();

    // Setup unified manager specific elements
    this.elements = {
      ...this.elements,
      toggle: document.getElementById('music-toggle'),
      icon: document.getElementById('music-icon'),
      visualizer: document.getElementById('music-visualizer'),
      volumeSlider: document.getElementById('volume-slider'),
      progressBar: document.getElementById('progress-bar'),
      timeDisplay: document.getElementById('time-display')
    };

    // Setup toggle button with enhanced functionality
    if (this.elements.toggle) {
      this.elements.toggle.addEventListener('click', () => this.toggle());
      this.elements.toggle.setAttribute('aria-label', 'Toggle Background Music');
      
      // Add visual feedback
      this.elements.toggle.addEventListener('mousedown', () => {
        this.elements.toggle.style.transform = 'scale(0.95)';
      });
      
      this.elements.toggle.addEventListener('mouseup', () => {
        this.elements.toggle.style.transform = 'scale(1)';
      });
    }

    // Setup volume control with better UX
    if (this.elements.volumeSlider) {
      this.elements.volumeSlider.addEventListener('input', (e) => {
        this.setVolume(e.target.value / 100);
      });
      
      // Show current volume on hover
      this.elements.volumeSlider.addEventListener('mouseover', () => {
        this.showVolumeTooltip();
      });
    }

    // Setup progress bar interaction
    if (this.elements.progressBar) {
      this.elements.progressBar.addEventListener('click', (e) => {
        const rect = this.elements.progressBar.getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        this.seekTo(progress);
      });
    }
  }

  /**
   * Show volume tooltip - unique to UnifiedMusicManager
   */
  showVolumeTooltip() {
    if (!this.elements.volumeSlider) return;
    
    const volume = Math.round(this.audio?.volume * 100 || 0);
    this.elements.volumeSlider.title = `Volume: ${volume}%`;
  }

  /**
   * Enhanced UI update with more visual feedback
   */
  updateUI() {
    // Call parent update first
    super.updateUI();

    // Update unified manager specific UI elements
    this.updateProgressBar();
    this.updateTimeDisplay();
    this.updateVisualizerState();
  }

  /**
   * Update progress bar - unique to UnifiedMusicManager
   */
  updateProgressBar() {
    if (!this.elements.progressBar || !this.audio) return;

    const progress = this.audio.currentTime / this.audio.duration || 0;
    this.elements.progressBar.style.width = `${progress * 100}%`;
  }

  /**
   * Update time display - unique to UnifiedMusicManager
   */
  updateTimeDisplay() {
    if (!this.elements.timeDisplay || !this.audio) return;

    const current = this.formatTime(this.audio.currentTime || 0);
    const total = this.formatTime(this.audio.duration || 0);
    this.elements.timeDisplay.textContent = `${current} / ${total}`;
  }

  /**
   * Update visualizer state
   */
  updateVisualizerState() {
    if (!this.elements.visualizer) return;

    if (this.state.isPlaying && this.config.enableVisualizer) {
      this.elements.visualizer.classList.add('active');
    } else {
      this.elements.visualizer.classList.remove('active');
    }
  }

  /**
   * Format time helper - unique to UnifiedMusicManager
   */
  formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Seek to specific progress - enhanced version
   */
  seekTo(progress) {
    if (!this.audio || !isFinite(progress)) return;
    
    const time = progress * this.audio.duration;
    if (isFinite(time)) {
      this.audio.currentTime = time;
      this.saveState(); // Save state after seeking
    }
  }

  /**
   * Enhanced toggle with better state management
   */
  async toggle() {
    try {
      if (this.state.isPlaying) {
        await this.pause();
      } else {
        await this.play();
      }
      
      // Update UI immediately
      this.updateUI();
      
      // Save state
      this.saveState();
      
    } catch (error) {
      console.error('Toggle failed:', error);
      this.handleError(error);
    }
  }

  /**
   * Override onEnded to handle playlist progression
   */
  onEnded() {
    super.onEnded();
    
    // Additional handling for unified manager
    if (this.extendedState.currentTrack !== null) {
      console.log(`🎵 Track ${this.extendedState.currentTrack} ended`);
    }
  }

  /**
   * Override onError with enhanced error handling
   */
  onError(event) {
    super.onError(event);
    
    // Additional error handling for unified manager
    if (this.elements.toggle) {
      this.elements.toggle.classList.add('error');
      setTimeout(() => {
        this.elements.toggle?.classList.remove('error');
      }, 3000);
    }
  }

  /**
   * Cleanup method - enhanced version
   */
  destroy() {
    // Cleanup visualizer
    if (this.visualizerContext) {
      this.visualizerContext = null;
    }

    // Clear extended state
    this.extendedState = null;
    this.elements = {};

    // Call parent cleanup
    super.destroy();
    
    console.log('🎵 Unified Music Manager destroyed');
  }
}

// Export singleton instance
let unifiedMusicManagerInstance = null;

export function getUnifiedMusicManager(options = {}) {
  if (!unifiedMusicManagerInstance) {
    unifiedMusicManagerInstance = new UnifiedMusicManager(options);
  }
  return unifiedMusicManagerInstance;
}

export { UnifiedMusicManager };
export default UnifiedMusicManager;
