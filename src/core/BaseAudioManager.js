/**
 * Base Audio Manager - Foundation for all audio-related managers
 * Provides common audio functionality, state management, and cross-browser compatibility
 */

import { BaseManager } from './BaseManager.js';

class BaseAudioManager extends BaseManager {
  constructor(options = {}) {
    super(options);
    
    this.audio = null;
    this.audioContext = null;
    this.playlist = options.playlist || [];
    this.currentTrackIndex = 0;
  }

  /**
   * Default configuration for audio managers
   */
  getDefaultConfig() {
    return {
      ...super.getDefaultConfig(),
      volume: 0.3,
      autoplay: false,
      loop: false,
      crossPageSync: true,
      enableVisualizer: false,
      enablePlaylist: true,
      preload: 'metadata',
      audioFormat: ['mp3', 'm4a', 'ogg', 'wav']
    };
  }

  /**
   * Default state for audio managers
   */
  getDefaultState() {
    return {
      ...super.getDefaultState(),
      isPlaying: false,
      isLoading: false,
      hasError: false,
      currentTime: 0,
      duration: 0,
      volume: this.config.volume,
      userInteracted: false
    };
  }

  /**
   * Get custom handlers for audio events
   */
  getCustomHandlers() {
    return {
      onPlay: this.onPlay.bind(this),
      onPause: this.onPause.bind(this),
      onEnded: this.onEnded.bind(this),
      onTimeUpdate: this.onTimeUpdate.bind(this),
      onLoadedMetadata: this.onLoadedMetadata.bind(this),
      onError: this.onAudioError.bind(this),
      onUserInteraction: this.onUserInteraction.bind(this)
    };
  }

  /**
   * Main initialization for audio managers
   */
  async doInit() {
    await this.setupAudio();
    this.setupEventListeners();
    this.setupUserInteractionDetection();
    
    if (this.config.crossPageSync) {
      this.setupCrossPageSync();
    }
    
    if (this.playlist.length > 0) {
      await this.loadTrack(this.currentTrackIndex);
    }
  }

  /**
   * Setup audio element
   */
  async setupAudio() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.preload = this.config.preload;
    this.audio.volume = this.state.volume;
    
    // Setup audio context for advanced features
    if (this.config.enableVisualizer && this.supportsAudioContext()) {
      this.setupAudioContext();
    }
  }

  /**
   * Setup audio context for visualizer
   */
  setupAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      const source = this.audioContext.createMediaElementSource(this.audio);
      const analyser = this.audioContext.createAnalyser();
      
      source.connect(analyser);
      analyser.connect(this.audioContext.destination);
      
      this.analyser = analyser;
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    } catch (error) {
      this.handleError('Failed to setup audio context', error);
    }
  }

  /**
   * Check if browser supports AudioContext
   */
  supportsAudioContext() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }

  /**
   * Setup audio event listeners
   */
  setupEventListeners() {
    if (!this.audio) return;
    
    this.audio.addEventListener('play', this.boundHandlers.onPlay, { passive: true });
    this.audio.addEventListener('pause', this.boundHandlers.onPause, { passive: true });
    this.audio.addEventListener('ended', this.boundHandlers.onEnded, { passive: true });
    this.audio.addEventListener('timeupdate', this.boundHandlers.onTimeUpdate, { passive: true });
    this.audio.addEventListener('loadedmetadata', this.boundHandlers.onLoadedMetadata, { passive: true });
    this.audio.addEventListener('error', this.boundHandlers.onError, { passive: true });
  }

  /**
   * Setup user interaction detection for autoplay
   */
  setupUserInteractionDetection() {
    const events = ['click', 'keydown', 'touchstart'];
    const handler = this.boundHandlers.onUserInteraction;
    
    events.forEach(event => {
      document.addEventListener(event, handler, { once: true, passive: true });
    });
  }

  /**
   * Setup cross-page synchronization
   */
  setupCrossPageSync() {
    window.addEventListener('storage', (event) => {
      if (event.key === `${this.config.storagePrefix}_audio_state`) {
        this.syncFromStorage(event.newValue);
      }
    });
  }

  /**
   * Load track by index
   */
  async loadTrack(index) {
    if (index < 0 || index >= this.playlist.length) return;
    
    this.currentTrackIndex = index;
    const trackUrl = this.playlist[index];
    
    try {
      this.state.isLoading = true;
      this.audio.src = trackUrl;
      
      await new Promise((resolve, reject) => {
        const onLoad = () => {
          this.audio.removeEventListener('loadedmetadata', onLoad);
          this.audio.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = (error) => {
          this.audio.removeEventListener('loadedmetadata', onLoad);
          this.audio.removeEventListener('error', onError);
          reject(error);
        };
        
        this.audio.addEventListener('loadedmetadata', onLoad);
        this.audio.addEventListener('error', onError);
      });
      
      this.state.isLoading = false;
      this.emit('trackLoaded', { index, url: trackUrl });
    } catch (error) {
      this.state.isLoading = false;
      this.handleError('Failed to load track', error);
    }
  }

  /**
   * Play audio
   */
  async play() {
    if (!this.audio || this.state.isPlaying) return;
    
    try {
      // Resume audio context if suspended
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      await this.audio.play();
    } catch (error) {
      this.handleError('Failed to play audio', error);
    }
  }

  /**
   * Pause audio
   */
  pause() {
    if (this.audio && this.state.isPlaying) {
      this.audio.pause();
    }
  }

  /**
   * Stop audio
   */
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  /**
   * Set volume
   */
  setVolume(volume) {
    volume = Math.max(0, Math.min(1, volume));
    this.state.volume = volume;
    
    if (this.audio) {
      this.audio.volume = volume;
    }
    
    this.emit('volumeChanged', volume);
  }

  /**
   * Next track
   */
  next() {
    const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadTrack(nextIndex);
  }

  /**
   * Previous track
   */
  previous() {
    const prevIndex = this.currentTrackIndex === 0 
      ? this.playlist.length - 1 
      : this.currentTrackIndex - 1;
    this.loadTrack(prevIndex);
  }

  /**
   * Audio event handlers
   */
  onPlay() {
    this.state.isPlaying = true;
    this.emit('play');
    this.saveState();
  }

  onPause() {
    this.state.isPlaying = false;
    this.emit('pause');
    this.saveState();
  }

  onEnded() {
    this.state.isPlaying = false;
    
    if (this.config.enablePlaylist && this.playlist.length > 1) {
      this.next();
    }
    
    this.emit('ended');
  }

  onTimeUpdate() {
    this.state.currentTime = this.audio.currentTime;
    this.emit('timeUpdate', this.state.currentTime);
  }

  onLoadedMetadata() {
    this.state.duration = this.audio.duration;
    this.emit('loadedMetadata', this.state.duration);
  }

  onAudioError(error) {
    this.state.hasError = true;
    this.handleError('Audio error', error);
  }

  onUserInteraction() {
    this.state.userInteracted = true;
    
    if (this.config.autoplay && !this.state.isPlaying) {
      this.play();
    }
  }

  /**
   * Save state for cross-page sync
   */
  saveState() {
    if (!this.config.crossPageSync) return;
    
    const state = {
      isPlaying: this.state.isPlaying,
      currentTime: this.state.currentTime,
      volume: this.state.volume,
      currentTrackIndex: this.currentTrackIndex,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`${this.config.storagePrefix}_audio_state`, JSON.stringify(state));
  }

  /**
   * Sync state from storage
   */
  syncFromStorage(stateJson) {
    try {
      const state = JSON.parse(stateJson);
      
      // Only sync if state is recent (within 5 seconds)
      if (Date.now() - state.timestamp < 5000) {
        this.setVolume(state.volume);
        
        if (state.currentTrackIndex !== this.currentTrackIndex) {
          this.loadTrack(state.currentTrackIndex);
        }
      }
    } catch (error) {
      this.handleError('Failed to sync from storage', error);
    }
  }

  /**
   * Get visualizer data
   */
  getVisualizerData() {
    if (!this.analyser || !this.dataArray) return null;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  /**
   * Destroy audio manager
   */
  onDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    super.onDestroy();
  }
}

export { BaseAudioManager };
