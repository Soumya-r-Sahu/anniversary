/**
 * Chunked Music Player System
 * Implements dynamic music streaming with chunk-based loading
 * Version: 1.0.0
 */

class ChunkedMusicPlayer {
  constructor(options = {}) {
    this.config = {
      chunkDuration: options.chunkDuration || 30, // seconds per chunk
      preloadChunks: options.preloadChunks || 3, // number of chunks to preload
      bufferAhead: options.bufferAhead || 2, // chunks to keep ahead
      bufferBehind: options.bufferBehind || 1, // chunks to keep behind
      crossfadeDuration: options.crossfadeDuration || 0.5, // seconds
      seamlessThreshold: options.seamlessThreshold || 0.1, // seconds
      ...options,
    };

    // State management
    this.state = {
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      currentChunk: 0,
      totalChunks: 0,
      isBuffering: false,
      lastSeekTime: 0,
    };

    // Chunk management
    this.chunks = new Map();
    this.audioContexts = new Map();
    this.bufferSources = new Map();
    this.loadingPromises = new Map();
    this.currentSources = [];

    // Audio processing
    this.audioContext = null;
    this.gainNode = null;
    this.analyser = null;
    this.masterGainNode = null;

    // Timing and synchronization
    this.startTime = 0;
    this.pauseTime = 0;
    this.scheduledSources = [];
    this.nextChunkTime = 0;

    // Performance monitoring
    this.performanceStats = {
      chunksLoaded: 0,
      chunksUnloaded: 0,
      totalBandwidth: 0,
      averageLoadTime: 0,
      bufferHealth: 100,
    };

    // Event system
    this.eventListeners = new Map();

    this.init();
  }

  /**
   * Initialize the chunked music player
   */
  async init() {
    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      await this.setupAudioNodes();

      // Setup performance monitoring
      this.setupPerformanceMonitoring();

      console.log("🎵 Chunked Music Player initialized");
    } catch (error) {
      console.error("Failed to initialize Chunked Music Player:", error);
    }
  }

  /**
   * Setup audio processing nodes
   */
  async setupAudioNodes() {
    // Master gain node for volume control
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.value = this.state.volume;
    this.masterGainNode.connect(this.audioContext.destination);

    // Analyser for visualizations
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.connect(this.masterGainNode);

    // Crossfade gain nodes
    this.crossfadeNodes = {
      current: this.audioContext.createGain(),
      next: this.audioContext.createGain(),
    };

    this.crossfadeNodes.current.connect(this.analyser);
    this.crossfadeNodes.next.connect(this.analyser);
  }

  /**
   * Load and prepare a song for chunked playback
   */
  async loadSong(songUrl, metadata = {}) {
    try {
      this.currentSongUrl = songUrl;
      this.songMetadata = metadata;

      // Get song metadata
      const songInfo = await this.getSongInfo(songUrl);
      this.state.duration = songInfo.duration;
      this.state.totalChunks = Math.ceil(
        songInfo.duration / this.config.chunkDuration,
      );

      // Reset state
      this.resetPlaybackState();

      // Preload initial chunks
      await this.preloadInitialChunks();

      this.emit("songLoaded", {
        url: songUrl,
        duration: this.state.duration,
        totalChunks: this.state.totalChunks,
      });

      console.log(
        `🎵 Song loaded: ${this.state.totalChunks} chunks, ${this.state.duration}s duration`,
      );
    } catch (error) {
      console.error("Failed to load song:", error);
      this.emit("error", error);
    }
  }

  /**
   * Get song information without downloading entire file
   */
  async getSongInfo(songUrl) {
    try {
      // Use HEAD request to get content length and estimate duration
      const response = await fetch(songUrl, { method: "HEAD" });
      const contentLength = parseInt(response.headers.get("content-length"));

      // For now, return estimated values - in production, you'd use proper metadata extraction
      return {
        duration: this.estimateDuration(contentLength, songUrl),
        bitrate: 128000, // Default bitrate
        sampleRate: 44100,
      };
    } catch (error) {
      console.warn("Could not get song info, using defaults:", error);
      return {
        duration: 180, // 3 minutes default
        bitrate: 128000,
        sampleRate: 44100,
      };
    }
  }

  /**
   * Estimate song duration based on file size and format
   */
  estimateDuration(contentLength, songUrl) {
    const extension = songUrl.split(".").pop().toLowerCase();
    let estimatedBitrate = 128000; // bits per second

    // Rough estimation based on file extension
    switch (extension) {
      case "mp3":
        estimatedBitrate = 128000;
        break;
      case "m4a":
      case "aac":
        estimatedBitrate = 128000;
        break;
      case "wav":
        estimatedBitrate = 1411200; // CD quality
        break;
      case "flac":
        estimatedBitrate = 1000000;
        break;
    }

    return (contentLength * 8) / estimatedBitrate; // Convert to seconds
  }

  /**
   * Preload initial chunks for immediate playback
   */
  async preloadInitialChunks() {
    const chunksToLoad = Math.min(
      this.config.preloadChunks,
      this.state.totalChunks,
    );
    const loadPromises = [];

    for (let i = 0; i < chunksToLoad; i++) {
      loadPromises.push(this.loadChunk(i));
    }

    await Promise.all(loadPromises);
    console.log(`🔄 Preloaded ${chunksToLoad} chunks`);
  }

  /**
   * Load a specific chunk
   */
  async loadChunk(chunkIndex) {
    if (this.chunks.has(chunkIndex) || this.loadingPromises.has(chunkIndex)) {
      return (
        this.chunks.get(chunkIndex) || this.loadingPromises.get(chunkIndex)
      );
    }

    const loadPromise = this._loadChunkData(chunkIndex);
    this.loadingPromises.set(chunkIndex, loadPromise);

    try {
      const chunkData = await loadPromise;
      this.chunks.set(chunkIndex, chunkData);
      this.loadingPromises.delete(chunkIndex);
      this.performanceStats.chunksLoaded++;

      this.emit("chunkLoaded", {
        chunkIndex,
        size: chunkData.buffer.byteLength,
      });
      return chunkData;
    } catch (error) {
      this.loadingPromises.delete(chunkIndex);
      console.error(`Failed to load chunk ${chunkIndex}:`, error);
      throw error;
    }
  }

  /**
   * Load chunk data from server using range requests
   */
  async _loadChunkData(chunkIndex) {
    const startTime = performance.now();
    const startByte = chunkIndex * this.config.chunkDuration * 16000; // Estimate bytes per second
    const endByte = startByte + this.config.chunkDuration * 16000 - 1;

    try {
      const response = await fetch(this.currentSongUrl, {
        headers: {
          Range: `bytes=${startByte}-${endByte}`,
        },
      });

      if (!response.ok && response.status !== 206) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(
        arrayBuffer.slice(),
      );

      // Update performance stats
      const loadTime = performance.now() - startTime;
      this.performanceStats.totalBandwidth += arrayBuffer.byteLength;
      this.performanceStats.averageLoadTime =
        (this.performanceStats.averageLoadTime *
          (this.performanceStats.chunksLoaded - 1) +
          loadTime) /
        this.performanceStats.chunksLoaded;

      return {
        buffer: audioBuffer,
        index: chunkIndex,
        startTime: chunkIndex * this.config.chunkDuration,
        duration: this.config.chunkDuration,
        size: arrayBuffer.byteLength,
      };
    } catch (error) {
      // Fallback: load entire file and extract chunk
      console.warn(
        `Range request failed for chunk ${chunkIndex}, falling back to full file`,
      );
      return this._loadChunkFromFullFile(chunkIndex);
    }
  }

  /**
   * Fallback method to extract chunk from full file
   */
  async _loadChunkFromFullFile(chunkIndex) {
    if (!this.fullAudioBuffer) {
      const response = await fetch(this.currentSongUrl);
      const arrayBuffer = await response.arrayBuffer();
      this.fullAudioBuffer =
        await this.audioContext.decodeAudioData(arrayBuffer);
    }

    const startSample = Math.floor(
      chunkIndex * this.config.chunkDuration * this.fullAudioBuffer.sampleRate,
    );
    const endSample = Math.min(
      startSample + this.config.chunkDuration * this.fullAudioBuffer.sampleRate,
      this.fullAudioBuffer.length,
    );

    const chunkLength = endSample - startSample;
    const chunkBuffer = this.audioContext.createBuffer(
      this.fullAudioBuffer.numberOfChannels,
      chunkLength,
      this.fullAudioBuffer.sampleRate,
    );

    // Copy audio data
    for (
      let channel = 0;
      channel < this.fullAudioBuffer.numberOfChannels;
      channel++
    ) {
      const originalData = this.fullAudioBuffer.getChannelData(channel);
      const chunkData = chunkBuffer.getChannelData(channel);
      for (let i = 0; i < chunkLength; i++) {
        chunkData[i] = originalData[startSample + i];
      }
    }

    return {
      buffer: chunkBuffer,
      index: chunkIndex,
      startTime: chunkIndex * this.config.chunkDuration,
      duration: chunkLength / this.fullAudioBuffer.sampleRate,
      size: chunkLength * 4 * this.fullAudioBuffer.numberOfChannels,
    };
  }

  /**
   * Start playback
   */
  async play() {
    try {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      if (this.state.isPaused) {
        await this.resumePlayback();
      } else {
        await this.startPlayback();
      }

      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.emit("play");
    } catch (error) {
      console.error("Failed to start playback:", error);
      this.emit("error", error);
    }
  }

  /**
   * Start fresh playback
   */
  async startPlayback() {
    this.state.currentTime = 0;
    this.state.currentChunk = 0;
    this.startTime = this.audioContext.currentTime;
    this.nextChunkTime = this.startTime;

    await this.scheduleChunks();
    this.startProgressTracking();
    this.startChunkManagement();
  }

  /**
   * Resume paused playback
   */
  async resumePlayback() {
    const pauseDuration = this.audioContext.currentTime - this.pauseTime;
    this.startTime += pauseDuration;
    this.nextChunkTime = this.audioContext.currentTime;

    // Reschedule remaining chunks
    this.stopAllSources();
    await this.scheduleChunksFromCurrent();
    this.startProgressTracking();
    this.startChunkManagement();
  }

  /**
   * Schedule audio chunks for seamless playback
   */
  async scheduleChunks() {
    const chunksToSchedule = Math.min(
      this.config.bufferAhead + 1,
      this.state.totalChunks,
    );

    for (let i = 0; i < chunksToSchedule; i++) {
      await this.scheduleChunk(i);
    }
  }

  /**
   * Schedule chunks starting from current position
   */
  async scheduleChunksFromCurrent() {
    const startChunk = this.state.currentChunk;
    const endChunk = Math.min(
      startChunk + this.config.bufferAhead + 1,
      this.state.totalChunks,
    );

    for (let i = startChunk; i < endChunk; i++) {
      await this.scheduleChunk(i);
    }
  }

  /**
   * Schedule a specific chunk for playback
   */
  async scheduleChunk(chunkIndex) {
    try {
      const chunkData = await this.loadChunk(chunkIndex);
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = chunkData.buffer;
      source.connect(gainNode);
      gainNode.connect(this.crossfadeNodes.current);

      // Calculate when to start this chunk
      const startTime = this.nextChunkTime;
      const offset = Math.max(0, this.state.currentTime - chunkData.startTime);

      // Handle crossfading for seamless transitions
      if (chunkIndex > 0 && this.config.crossfadeDuration > 0) {
        this.applyCrossfade(gainNode, startTime, true);
      }

      source.start(startTime, offset);
      this.nextChunkTime = startTime + (chunkData.duration - offset);

      // Store reference for cleanup
      this.scheduledSources.push({
        source,
        gainNode,
        chunkIndex,
        startTime,
        endTime: this.nextChunkTime,
      });

      // Schedule cleanup
      source.onended = () => {
        this.cleanupSource(source);
      };
    } catch (error) {
      console.error(`Failed to schedule chunk ${chunkIndex}:`, error);
    }
  }

  /**
   * Apply crossfade for seamless transitions
   */
  applyCrossfade(gainNode, startTime, fadeIn = true) {
    const fadeStart = startTime;
    const fadeEnd = startTime + this.config.crossfadeDuration;

    if (fadeIn) {
      gainNode.gain.setValueAtTime(0, fadeStart);
      gainNode.gain.linearRampToValueAtTime(1, fadeEnd);
    } else {
      gainNode.gain.setValueAtTime(1, fadeStart);
      gainNode.gain.linearRampToValueAtTime(0, fadeEnd);
    }
  }

  /**
   * Pause playback
   */
  pause() {
    if (!this.state.isPlaying) return;

    this.state.isPlaying = false;
    this.state.isPaused = true;
    this.pauseTime = this.audioContext.currentTime;

    // Stop all scheduled sources
    this.stopAllSources();

    this.stopProgressTracking();
    this.stopChunkManagement();

    this.emit("pause");
  }

  /**
   * Stop playback completely
   */
  stop() {
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.currentTime = 0;
    this.state.currentChunk = 0;

    this.stopAllSources();
    this.stopProgressTracking();
    this.stopChunkManagement();

    this.emit("stop");
  }

  /**
   * Seek to specific time
   */
  async seek(time) {
    const wasPlaying = this.state.isPlaying;

    if (wasPlaying) {
      this.pause();
    }

    this.state.currentTime = Math.max(0, Math.min(time, this.state.duration));
    this.state.currentChunk = Math.floor(
      this.state.currentTime / this.config.chunkDuration,
    );
    this.state.lastSeekTime = this.audioContext.currentTime;

    // Preload chunks around seek position
    await this.preloadAroundPosition(this.state.currentChunk);

    if (wasPlaying) {
      await this.play();
    }

    this.emit("seek", { time: this.state.currentTime });
  }

  /**
   * Set volume
   */
  setVolume(volume) {
    this.state.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGainNode) {
      this.masterGainNode.gain.setTargetAtTime(
        this.state.volume,
        this.audioContext.currentTime,
        0.1,
      );
    }
    this.emit("volumechange", { volume: this.state.volume });
  }

  /**
   * Start progress tracking
   */
  startProgressTracking() {
    this.stopProgressTracking();
    this.progressInterval = setInterval(() => {
      if (this.state.isPlaying) {
        this.updateProgress();
      }
    }, 100);
  }

  /**
   * Update playback progress
   */
  updateProgress() {
    if (this.state.isPlaying && !this.state.isPaused) {
      const elapsed = this.audioContext.currentTime - this.startTime;
      this.state.currentTime = Math.min(elapsed, this.state.duration);
      this.state.currentChunk = Math.floor(
        this.state.currentTime / this.config.chunkDuration,
      );

      this.emit("timeupdate", {
        currentTime: this.state.currentTime,
        duration: this.state.duration,
        progress: this.state.currentTime / this.state.duration,
      });

      // Check if song ended
      if (this.state.currentTime >= this.state.duration) {
        this.stop();
        this.emit("ended");
      }
    }
  }

  /**
   * Stop progress tracking
   */
  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * Start chunk management (loading/unloading)
   */
  startChunkManagement() {
    this.stopChunkManagement();
    this.chunkManagementInterval = setInterval(() => {
      this.manageChunks();
    }, 1000);
  }

  /**
   * Manage chunk loading and unloading
   */
  async manageChunks() {
    if (!this.state.isPlaying) return;

    const currentChunk = this.state.currentChunk;

    // Load upcoming chunks
    for (let i = 1; i <= this.config.bufferAhead; i++) {
      const chunkIndex = currentChunk + i;
      if (chunkIndex < this.state.totalChunks && !this.chunks.has(chunkIndex)) {
        this.loadChunk(chunkIndex).catch((error) => {
          console.warn(`Failed to preload chunk ${chunkIndex}:`, error);
        });
      }
    }

    // Schedule upcoming chunks
    const nextChunk = currentChunk + 1;
    if (nextChunk < this.state.totalChunks) {
      const isScheduled = this.scheduledSources.some(
        (s) => s.chunkIndex === nextChunk,
      );
      if (!isScheduled) {
        await this.scheduleChunk(nextChunk);
      }
    }

    // Unload old chunks to save memory
    for (let i = currentChunk - this.config.bufferBehind - 1; i >= 0; i--) {
      if (this.chunks.has(i)) {
        this.unloadChunk(i);
      }
    }

    // Update buffer health
    this.updateBufferHealth();
  }

  /**
   * Unload a chunk to free memory
   */
  unloadChunk(chunkIndex) {
    if (this.chunks.has(chunkIndex)) {
      this.chunks.delete(chunkIndex);
      this.performanceStats.chunksUnloaded++;
      console.log(`🗑️ Unloaded chunk ${chunkIndex}`);
    }
  }

  /**
   * Preload chunks around a specific position
   */
  async preloadAroundPosition(centerChunk) {
    const start = Math.max(0, centerChunk - this.config.bufferBehind);
    const end = Math.min(
      this.state.totalChunks - 1,
      centerChunk + this.config.bufferAhead,
    );

    const loadPromises = [];
    for (let i = start; i <= end; i++) {
      if (!this.chunks.has(i)) {
        loadPromises.push(this.loadChunk(i));
      }
    }

    await Promise.all(loadPromises);
  }

  /**
   * Stop chunk management
   */
  stopChunkManagement() {
    if (this.chunkManagementInterval) {
      clearInterval(this.chunkManagementInterval);
      this.chunkManagementInterval = null;
    }
  }

  /**
   * Stop all audio sources
   */
  stopAllSources() {
    this.scheduledSources.forEach(({ source }) => {
      try {
        source.stop();
      } catch (error) {
        // Source might already be stopped
      }
    });
    this.scheduledSources = [];
  }

  /**
   * Cleanup audio source
   */
  cleanupSource(source) {
    this.scheduledSources = this.scheduledSources.filter(
      (s) => s.source !== source,
    );
  }

  /**
   * Update buffer health metrics
   */
  updateBufferHealth() {
    const currentChunk = this.state.currentChunk;
    let availableAhead = 0;

    for (let i = 1; i <= this.config.bufferAhead; i++) {
      if (this.chunks.has(currentChunk + i)) {
        availableAhead++;
      }
    }

    this.performanceStats.bufferHealth = Math.round(
      (availableAhead / this.config.bufferAhead) * 100,
    );

    this.emit("bufferHealth", {
      health: this.performanceStats.bufferHealth,
      chunksAhead: availableAhead,
    });
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    setInterval(() => {
      this.emit("performanceStats", {
        ...this.performanceStats,
        memoryUsage: this.getMemoryUsage(),
        activeChunks: this.chunks.size,
      });
    }, 5000);
  }

  /**
   * Get memory usage of loaded chunks
   */
  getMemoryUsage() {
    let totalBytes = 0;
    for (const chunk of this.chunks.values()) {
      totalBytes += chunk.size || 0;
    }
    return {
      bytes: totalBytes,
      mb: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
    };
  }

  /**
   * Reset playback state
   */
  resetPlaybackState() {
    this.state.currentTime = 0;
    this.state.currentChunk = 0;
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.chunks.clear();
    this.loadingPromises.clear();
    this.stopAllSources();
  }

  /**
   * Get current playback state
   */
  getState() {
    return {
      ...this.state,
      performanceStats: { ...this.performanceStats },
    };
  }

  /**
   * Event system methods
   */
  on(event, listener) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(listener);
  }

  off(event, listener) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    this.stop();
    this.stopProgressTracking();
    this.stopChunkManagement();

    // Cleanup audio context
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }

    // Clear all data
    this.chunks.clear();
    this.loadingPromises.clear();
    this.eventListeners.clear();

    console.log("🎵 Chunked Music Player destroyed");
  }
}

// Export for use in other modules
window.ChunkedMusicPlayer = ChunkedMusicPlayer;

// ES6 export
export { ChunkedMusicPlayer };
