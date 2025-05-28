/**
 * Unified Music Manager - Consolidates all music functionality with Chunked Streaming
 * Replaces multiple music managers with a single, optimized solution
 * Version: 3.0.0 - Now includes chunked music streaming for bandwidth optimization
 */

class UnifiedMusicManager {
  constructor(options = {}) {
    // Core configuration
    this.config = {
      volume: options.volume || 0.3,
      autoplay: options.autoplay !== false,
      crossPageSync: options.crossPageSync !== false,
      storageKey: options.storageKey || "anniversaryMusicState",
      enableVisualizer: options.enableVisualizer !== false,
      enablePlaylist: options.enablePlaylist !== false,
      performance: options.performance || "auto", // 'auto', 'high', 'low'

      // Chunked streaming configuration
      enableChunkedStreaming: options.enableChunkedStreaming !== false,
      chunkDuration: options.chunkDuration || 30, // seconds per chunk
      preloadChunks: options.preloadChunks || 3, // number of chunks to preload
      bufferAhead: options.bufferAhead || 2, // chunks to keep ahead
      bufferBehind: options.bufferBehind || 1, // chunks to keep behind
      crossfadeDuration: options.crossfadeDuration || 0.5, // seconds
      seamlessThreshold: options.seamlessThreshold || 0.1, // seconds
      fallbackToRegular: options.fallbackToRegular !== false, // fallback to regular audio if chunked fails

      ...options,
    }; // State management
    this.state = {
      isPlaying: false,
      currentTime: 0,
      currentSongIndex: 0,
      volume: this.config.volume,
      isLoading: false,
      hasError: false,
      userInteracted: false,
      autoplayAttempted: false,

      // Chunked streaming state
      usingChunkedPlayer: false,
      currentChunk: 0,
      totalChunks: 0,
      isBuffering: false,
      bufferHealth: 100,
      chunkLoadingProgress: 0,
    };

    // Audio queue and management
    this.playlist = [
      "music/song1.m4a",
      "music/queue_song/01-anniversary-celebration.m4a",
      "music/queue_song/02-love-story-theme.m4a",
    ];

    // Chunked player components
    this.chunkedPlayer = null;
    this.audioContext = null;
    this.audioSources = new Map();
    this.bufferSources = new Map();
    this.chunks = new Map();
    this.loadingPromises = new Map();
    this.masterGainNode = null;
    this.analyserNode = null; // Performance optimization
    this.performance = {
      isLowPower: this.detectLowPowerMode(),
      saveStateThrottled: this.throttle(this.saveState.bind(this), 2000),
      updateUIThrottled: this.throttle(this.updateUI.bind(this), 100),

      // Chunked streaming performance stats
      chunksLoaded: 0,
      chunksUnloaded: 0,
      totalBandwidth: 0,
      averageLoadTime: 0,
      networkSpeed: "unknown",
    }; // DOM references
    this.elements = {};
    this.audio = null;
    this.visualizerContext = null;

    // Event handlers
    this.boundHandlers = {
      onPlay: this.onPlay.bind(this),
      onPause: this.onPause.bind(this),
      onError: this.onError.bind(this),
      onTimeUpdate: this.onTimeUpdate.bind(this),
      onLoadedMetadata: this.onLoadedMetadata.bind(this),
      onEnded: this.onEnded.bind(this),
      onStorageChange: this.onStorageChange.bind(this),
      onVisibilityChange: this.onVisibilityChange.bind(this),
      onBeforeUnload: this.onBeforeUnload.bind(this),
      onUserInteraction: this.onUserInteraction.bind(this),

      // Chunked player handlers
      onChunkLoaded: this.onChunkLoaded.bind(this),
      onChunkError: this.onChunkError.bind(this),
      onBufferUpdate: this.onBufferUpdate.bind(this),
    };

    // Chunked streaming timing
    this.startTime = 0;
    this.pauseTime = 0;
    this.nextChunkTime = 0;
    this.scheduledSources = [];
    this.crossfadeNodes = {};

    // Initialize
    this.init();
  } /**
   * Initialize the unified music manager
   */
  async init() {
    try {
      // Restore previous state
      await this.restoreState();

      // Initialize chunked streaming if enabled
      if (this.config.enableChunkedStreaming) {
        await this.initializeChunkedStreaming();
      }

      // Setup audio (fallback or primary)
      this.setupAudio();

      // Setup DOM elements
      this.setupDOM();

      // Initialize buffer status component if chunked streaming is enabled
      if (
        this.state.usingChunkedPlayer &&
        typeof UnifiedBufferStatus !== "undefined"
      ) {
        this.bufferStatus = new UnifiedBufferStatus({
          musicManager: this,
          position: "bottom-right",
        });
        console.log("✅ Buffer status component initialized");
      }

      // Setup cross-page sync
      if (this.config.crossPageSync) {
        this.setupCrossPageSync();
      }

      // Setup user interaction detection
      this.setupUserInteraction();

      // Setup performance monitoring
      this.setupPerformanceMonitoring();

      // Initial UI update
      this.updateUIThrottled();

      console.log(
        "🎵 Unified Music Manager initialized with chunked streaming:",
        this.state.usingChunkedPlayer,
      );
    } catch (error) {
      console.error("Failed to initialize music manager:", error);
      this.handleError(error);
    }
  }

  /**
   * Setup audio element with optimized configuration
   */
  setupAudio() {
    this.audio = new Audio();
    this.audio.preload = this.performance.isLowPower ? "none" : "metadata";
    this.audio.volume = this.state.volume;
    this.audio.crossOrigin = "anonymous";

    // Audio event listeners
    this.audio.addEventListener("play", this.boundHandlers.onPlay, {
      passive: true,
    });
    this.audio.addEventListener("pause", this.boundHandlers.onPause, {
      passive: true,
    });
    this.audio.addEventListener("error", this.boundHandlers.onError, {
      passive: true,
    });
    this.audio.addEventListener("timeupdate", this.boundHandlers.onTimeUpdate, {
      passive: true,
    });
    this.audio.addEventListener(
      "loadedmetadata",
      this.boundHandlers.onLoadedMetadata,
      { passive: true },
    );
    this.audio.addEventListener("ended", this.boundHandlers.onEnded, {
      passive: true,
    }); // Load current song
    this.loadSong(this.state.currentSongIndex);
  }

  /**
   * Initialize chunked streaming capabilities
   */
  async initializeChunkedStreaming() {
    try {
      // Check for Web Audio API support
      if (!window.AudioContext && !window.webkitAudioContext) {
        console.warn(
          "Web Audio API not supported, falling back to regular audio",
        );
        this.state.usingChunkedPlayer = false;
        return;
      }

      // Initialize audio context
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Setup audio nodes
      await this.setupAudioNodes();

      // Test chunked streaming capability
      const canUseChunked = await this.testChunkedStreamingSupport();

      if (canUseChunked) {
        this.state.usingChunkedPlayer = true;
        console.log("✅ Chunked streaming enabled");
      } else {
        console.warn("⚠️ Chunked streaming not supported, using fallback");
        this.state.usingChunkedPlayer = false;
      }
    } catch (error) {
      console.error("Failed to initialize chunked streaming:", error);
      this.state.usingChunkedPlayer = false;
    }
  }

  /**
   * Setup Web Audio API nodes for chunked streaming
   */
  async setupAudioNodes() {
    if (!this.audioContext) return;

    // Master gain node for volume control
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.value = this.state.volume;
    this.masterGainNode.connect(this.audioContext.destination);

    // Analyser for visualizations
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.connect(this.masterGainNode);

    // Crossfade gain nodes for seamless transitions
    this.crossfadeNodes = {
      current: this.audioContext.createGain(),
      next: this.audioContext.createGain(),
    };

    this.crossfadeNodes.current.connect(this.analyserNode);
    this.crossfadeNodes.next.connect(this.analyserNode);
    this.crossfadeNodes.current.gain.value = 1;
    this.crossfadeNodes.next.gain.value = 0;
  }

  /**
   * Test if chunked streaming is supported
   */
  async testChunkedStreamingSupport() {
    try {
      // Test range request support
      const testUrl = this.playlist[0];
      const response = await fetch(testUrl, {
        method: "HEAD",
      });

      const acceptsRanges = response.headers.get("accept-ranges");
      const contentLength = response.headers.get("content-length");

      return (
        acceptsRanges === "bytes" &&
        contentLength &&
        parseInt(contentLength) > 0
      );
    } catch (error) {
      console.warn("Range request test failed:", error);
      return false;
    }
  }

  /**
   * Setup DOM elements with error handling
   */
  setupDOM() {
    this.elements = {
      toggle: document.getElementById("music-toggle"),
      icon: document.getElementById("music-icon"),
      visualizer: document.getElementById("music-visualizer"),
      volumeSlider: document.getElementById("volume-slider"),
      progressBar: document.getElementById("progress-bar"),
      timeDisplay: document.getElementById("time-display"),
    };

    // Setup toggle button
    if (this.elements.toggle) {
      this.elements.toggle.addEventListener("click", () => this.toggle());
      this.elements.toggle.setAttribute(
        "aria-label",
        "Toggle Background Music",
      );
    }

    // Setup volume control
    if (this.elements.volumeSlider) {
      this.elements.volumeSlider.addEventListener("input", (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
      this.elements.volumeSlider.value = this.state.volume;
    }

    // Setup progress bar
    if (this.elements.progressBar) {
      this.elements.progressBar.addEventListener("click", (e) => {
        const rect = e.target.getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        this.seekTo(progress);
      });
    }
  }

  /**
   * Setup cross-page synchronization
   */
  setupCrossPageSync() {
    // Storage event listener for cross-page sync
    window.addEventListener("storage", this.boundHandlers.onStorageChange, {
      passive: true,
    });

    // Page visibility change
    document.addEventListener(
      "visibilitychange",
      this.boundHandlers.onVisibilityChange,
      { passive: true },
    );

    // Before unload
    window.addEventListener("beforeunload", this.boundHandlers.onBeforeUnload);
  }

  /**
   * Setup user interaction detection for autoplay
   */
  setupUserInteraction() {
    const events = ["click", "touchstart", "keydown", "scroll"];

    const handleFirstInteraction = () => {
      if (!this.state.userInteracted) {
        this.state.userInteracted = true;
        this.attemptAutoplay();

        // Remove listeners after first interaction
        events.forEach((event) => {
          document.removeEventListener(event, handleFirstInteraction);
        });
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, {
        once: true,
        passive: true,
      });
    });
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor audio performance
    if (this.audio && "performance" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes("audio") && entry.duration > 100) {
            console.warn(
              `Slow audio operation: ${entry.name} took ${entry.duration}ms`,
            );
          }
        }
      });

      observer.observe({ entryTypes: ["measure"] });
    }
  } /**
   * Load song by index with error handling
   */
  async loadSong(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.state.currentSongIndex = index;
      this.state.isLoading = true;
      this.state.hasError = false;

      const newSrc = this.playlist[index];

      if (this.state.usingChunkedPlayer) {
        await this.loadChunkedSong(newSrc);
      } else {
        // Only change src if different
        if (this.audio.src !== new URL(newSrc, window.location.href).href) {
          this.audio.src = newSrc;
        }
      }

      this.updateUIThrottled();
    }
  }

  /**
   * Load song for chunked streaming
   */
  async loadChunkedSong(url) {
    try {
      // Get song metadata and calculate chunks
      const metadata = await this.getSongMetadata(url);
      this.state.totalChunks = Math.ceil(
        metadata.duration / this.config.chunkDuration,
      );
      this.state.currentChunk = 0;

      // Clear existing chunks
      this.chunks.clear();
      this.loadingPromises.clear();

      // Preload initial chunks
      await this.preloadInitialChunks(url);

      console.log(`🎵 Loaded chunked song: ${this.state.totalChunks} chunks`);
    } catch (error) {
      console.error("Failed to load chunked song:", error);
      this.state.usingChunkedPlayer = false;
      // Fallback to regular audio
      this.audio.src = url;
    }
  }

  /**
   * Get song metadata including duration
   */
  async getSongMetadata(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";

      audio.addEventListener("loadedmetadata", () => {
        resolve({
          duration: audio.duration,
          channels: audio.mozChannels || 2,
          sampleRate: audio.mozSampleRate || 44100,
        });
      });

      audio.addEventListener("error", reject);
      audio.src = url;
    });
  }

  /**
   * Preload initial chunks for seamless playback
   */
  async preloadInitialChunks(url) {
    const chunksToLoad = Math.min(
      this.config.preloadChunks,
      this.state.totalChunks,
    );
    const loadPromises = [];

    for (let i = 0; i < chunksToLoad; i++) {
      loadPromises.push(this.loadChunk(url, i));
    }

    await Promise.allSettled(loadPromises);
  }

  /**
   * Load a specific audio chunk
   */
  async loadChunk(url, chunkIndex) {
    if (this.chunks.has(chunkIndex) || this.loadingPromises.has(chunkIndex)) {
      return (
        this.chunks.get(chunkIndex) || this.loadingPromises.get(chunkIndex)
      );
    }

    const loadPromise = this.fetchAndDecodeChunk(url, chunkIndex);
    this.loadingPromises.set(chunkIndex, loadPromise);

    try {
      const audioBuffer = await loadPromise;
      this.chunks.set(chunkIndex, audioBuffer);
      this.loadingPromises.delete(chunkIndex);
      this.performance.chunksLoaded++;

      // Trigger buffer update event
      this.boundHandlers.onChunkLoaded(chunkIndex);

      return audioBuffer;
    } catch (error) {
      this.loadingPromises.delete(chunkIndex);
      this.boundHandlers.onChunkError(chunkIndex, error);
      throw error;
    }
  }

  /**
   * Fetch and decode a specific chunk
   */
  async fetchAndDecodeChunk(url, chunkIndex) {
    const startByte = chunkIndex * this.config.chunkDuration * 44100 * 4; // Approximate
    const endByte = startByte + this.config.chunkDuration * 44100 * 4;

    const response = await fetch(url, {
      headers: {
        Range: `bytes=${startByte}-${endByte}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch chunk ${chunkIndex}: ${response.status}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    this.performance.totalBandwidth += arrayBuffer.byteLength;

    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  /**
   * Schedule chunk playback with seamless transitions
   */
  async scheduleChunkPlayback() {
    const chunkIndex = this.state.currentChunk;
    const audioBuffer = this.chunks.get(chunkIndex);

    if (!audioBuffer) {
      console.warn(`Chunk ${chunkIndex} not loaded, buffering...`);
      this.state.isBuffering = true;
      this.updateUIThrottled();

      // Wait for chunk to load
      await this.loadChunk(
        this.playlist[this.state.currentSongIndex],
        chunkIndex,
      );
      return this.scheduleChunkPlayback();
    }

    this.state.isBuffering = false;

    // Create buffer source
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Apply crossfade if transitioning between chunks
    const gainNode = this.crossfadeNodes.current;
    source.connect(gainNode);

    // Schedule playback
    const startTime = this.audioContext.currentTime;
    source.start(startTime);

    // Store reference for cleanup
    this.scheduledSources.push({
      source,
      startTime,
      chunkIndex,
    });

    // Schedule next chunk
    this.scheduleNextChunk();

    return source;
  }

  /**
   * Schedule the next chunk for seamless playback
   */
  scheduleNextChunk() {
    const nextChunkIndex = this.state.currentChunk + 1;

    if (nextChunkIndex >= this.state.totalChunks) {
      // Song finished, handle end
      this.handleChunkedSongEnd();
      return;
    }

    // Calculate when to start next chunk
    const nextStartTime =
      this.audioContext.currentTime +
      this.config.chunkDuration -
      this.config.crossfadeDuration;

    setTimeout(
      () => {
        this.crossfadeToNextChunk(nextChunkIndex);
      },
      (nextStartTime - this.audioContext.currentTime) * 1000,
    );
  }

  /**
   * Crossfade to the next chunk for seamless transition
   */
  async crossfadeToNextChunk(nextChunkIndex) {
    this.state.currentChunk = nextChunkIndex;

    // Preload ahead chunks
    this.preloadAheadChunks();

    // Cleanup old chunks
    this.cleanupOldChunks();

    // Swap crossfade nodes
    const currentNode = this.crossfadeNodes.current;
    const nextNode = this.crossfadeNodes.next;

    // Fade out current, fade in next
    const fadeTime = this.config.crossfadeDuration;
    const now = this.audioContext.currentTime;

    currentNode.gain.exponentialRampToValueAtTime(0.001, now + fadeTime);
    nextNode.gain.exponentialRampToValueAtTime(1, now + fadeTime);

    // Schedule next chunk
    await this.scheduleChunkPlayback();

    // Swap references
    this.crossfadeNodes.current = nextNode;
    this.crossfadeNodes.next = currentNode;
    this.crossfadeNodes.next.gain.value = 0;

    // Update UI
    this.updateUIThrottled();
  }

  /**
   * Preload chunks ahead of current position
   */
  async preloadAheadChunks() {
    const currentUrl = this.playlist[this.state.currentSongIndex];
    const loadPromises = [];

    for (let i = 1; i <= this.config.bufferAhead; i++) {
      const chunkIndex = this.state.currentChunk + i;

      if (chunkIndex < this.state.totalChunks && !this.chunks.has(chunkIndex)) {
        loadPromises.push(this.loadChunk(currentUrl, chunkIndex));
      }
    }

    await Promise.allSettled(loadPromises);
  }

  /**
   * Clean up old chunks to free memory
   */
  cleanupOldChunks() {
    const keepBehind = this.config.bufferBehind;
    const currentChunk = this.state.currentChunk;

    for (const [chunkIndex] of this.chunks) {
      if (chunkIndex < currentChunk - keepBehind) {
        this.chunks.delete(chunkIndex);
        this.performance.chunksUnloaded++;
      }
    }
  }

  /**
   * Handle end of chunked song
   */
  handleChunkedSongEnd() {
    console.log("🎵 Chunked song finished");

    // Cleanup all sources
    this.scheduledSources.forEach(({ source }) => {
      try {
        source.stop();
      } catch (e) {
        // Source may already be stopped
      }
    });

    this.scheduledSources = [];

    // Move to next song or loop
    this.handleSongEnd();
  }
  /**
   * Event handler for chunk loaded
   */
  onChunkLoaded(chunkIndex) {
    console.log(`✅ Chunk ${chunkIndex} loaded`);
    this.updateBufferHealth();
    this.emit("chunkLoaded", {
      chunkIndex,
      bufferHealth: this.state.bufferHealth,
    });
  }

  /**
   * Event handler for chunk error
   */
  onChunkError(chunkIndex, error) {
    console.error(`❌ Chunk ${chunkIndex} failed to load:`, error);
    this.performance.chunkErrors = (this.performance.chunkErrors || 0) + 1;

    if (this.performance.chunkErrors > 3 && this.config.fallbackToRegular) {
      console.warn("Falling back to regular audio due to chunk errors");
      this.fallbackToRegularAudio();
    }

    this.emit("chunkError", { chunkIndex, error });
  }

  /**
   * Event handler for buffer health updates
   */
  onBufferUpdate(bufferHealth) {
    this.emit("bufferUpdate", { bufferHealth });

    const bufferIndicator = document.getElementById("buffer-indicator");
    if (bufferIndicator) {
      bufferIndicator.style.width = `${bufferHealth}%`;
      bufferIndicator.className = `buffer-indicator ${bufferHealth < 30 ? "low" : bufferHealth < 70 ? "medium" : "high"}`;
    }
  }

  /**
   * Fallback to regular audio when chunked streaming fails
   */
  async fallbackToRegularAudio() {
    console.log("🔄 Falling back to regular audio playback");

    const wasPlaying = this.state.isPlaying;
    const currentTime = this.state.currentTime;

    this.pauseChunked();
    this.chunks.clear();
    this.loadingPromises.clear();

    this.state.usingChunkedPlayer = false;
    this.setupAudio();

    if (wasPlaying) {
      this.audio.currentTime = currentTime;
      await this.play();
    }
  }

  /**
   * Update buffer health metrics
   */
  updateBufferHealth() {
    if (!this.state.usingChunkedPlayer) return;

    const currentChunk = this.state.currentChunk;
    let availableAhead = 0;

    for (let i = 1; i <= this.config.bufferAhead; i++) {
      if (this.chunks.has(currentChunk + i)) {
        availableAhead++;
      }
    }

    this.state.bufferHealth = Math.round(
      (availableAhead / this.config.bufferAhead) * 100,
    );

    this.onBufferUpdate(this.state.bufferHealth);
  }

  // ==================== CORE PLAYBACK METHODS ====================

  /**
   * Play music (handles both regular and chunked audio)
   */
  async play() {
    try {
      if (!this.state.userInteracted) {
        console.warn("Cannot play audio without user interaction");
        return;
      }

      this.state.isLoading = true;
      this.updateUIThrottled();

      if (this.state.usingChunkedPlayer) {
        await this.playChunked();
      } else {
        await this.playRegular();
      }

      this.state.isPlaying = true;
      this.state.isLoading = false;
      this.updateUIThrottled();
      this.performance.saveStateThrottled();

      // Start buffer health monitoring for chunked streaming
      if (this.state.usingChunkedPlayer) {
        this.startBufferHealthMonitoring();
      }

      console.log("🎵 Music started playing");
    } catch (error) {
      console.error("Play failed:", error);
      this.handleError(error);
    }
  }

  /**
   * Play chunked audio
   */
  async playChunked() {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized");
    }

    // Resume audio context if suspended
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    // Start or resume chunked playback
    this.startTime = this.audioContext.currentTime;
    await this.scheduleChunkPlayback();
  }

  /**
   * Play regular audio
   */
  async playRegular() {
    if (!this.audio) {
      throw new Error("Audio element not initialized");
    }

    await this.audio.play();
  }

  /**
   * Pause music (handles both regular and chunked audio)
   */
  async pause() {
    try {
      if (this.state.usingChunkedPlayer) {
        this.pauseChunked();
      } else {
        this.pauseRegular();
      }

      this.state.isPlaying = false;
      this.updateUIThrottled();
      this.performance.saveStateThrottled();

      console.log("🎵 Music paused");
    } catch (error) {
      console.error("Pause failed:", error);
      this.handleError(error);
    }
  }

  /**
   * Pause chunked audio
   */
  pauseChunked() {
    this.pauseTime = this.audioContext.currentTime;

    // Stop all scheduled sources
    this.scheduledSources.forEach(({ source }) => {
      try {
        source.stop();
      } catch (e) {
        // Source may already be stopped
      }
    });

    this.scheduledSources = [];
  }

  /**
   * Pause regular audio
   */
  pauseRegular() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  /**
   * Toggle play/pause
   */
  async toggle() {
    if (this.state.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  /**
   * Stop music completely
   */
  async stop() {
    try {
      if (this.state.usingChunkedPlayer) {
        this.stopChunked();
      } else {
        this.stopRegular();
      }

      this.state.isPlaying = false;
      this.state.currentTime = 0;
      this.updateUIThrottled();
      this.performance.saveStateThrottled();

      console.log("🎵 Music stopped");
    } catch (error) {
      console.error("Stop failed:", error);
      this.handleError(error);
    }
  }

  /**
   * Stop chunked audio
   */
  stopChunked() {
    this.pauseChunked();
    this.state.currentChunk = 0;
    this.state.currentTime = 0;
  }

  /**
   * Stop regular audio
   */
  stopRegular() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  /**
   * Seek to specific time (handles both regular and chunked audio)
   */
  async seekTo(progress) {
    try {
      if (this.state.usingChunkedPlayer) {
        await this.seekChunked(progress);
      } else {
        await this.seekRegular(progress);
      }

      this.updateUIThrottled();
      console.log(`🎵 Seeked to ${(progress * 100).toFixed(1)}%`);
    } catch (error) {
      console.error("Seek failed:", error);
      this.handleError(error);
    }
  }

  /**
   * Seek in chunked audio
   */
  async seekChunked(progress) {
    const duration = this.state.totalChunks * this.config.chunkDuration;
    const targetTime = progress * duration;
    const targetChunk = Math.floor(targetTime / this.config.chunkDuration);

    const wasPlaying = this.state.isPlaying;

    if (wasPlaying) {
      this.pauseChunked();
    }

    this.state.currentTime = targetTime;
    this.state.currentChunk = targetChunk;

    // Preload chunks around seek position
    await this.preloadAroundSeekPosition(targetChunk);

    if (wasPlaying) {
      await this.playChunked();
    }
  }

  /**
   * Preload chunks around seek position
   */
  async preloadAroundSeekPosition(centerChunk) {
    const currentUrl = this.playlist[this.state.currentSongIndex];
    const loadPromises = [];

    const start = Math.max(0, centerChunk - this.config.bufferBehind);
    const end = Math.min(
      this.state.totalChunks - 1,
      centerChunk + this.config.bufferAhead,
    );

    for (let i = start; i <= end; i++) {
      if (!this.chunks.has(i)) {
        loadPromises.push(this.loadChunk(currentUrl, i));
      }
    }

    await Promise.allSettled(loadPromises);
  }

  /**
   * Seek in regular audio
   */
  async seekRegular(progress) {
    if (this.audio && this.audio.duration) {
      const targetTime = progress * this.audio.duration;
      this.audio.currentTime = targetTime;
      this.state.currentTime = targetTime;
    }
  }

  /**
   * Set volume (handles both regular and chunked audio)
   */
  setVolume(volume) {
    try {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.state.volume = clampedVolume;

      if (this.state.usingChunkedPlayer) {
        this.setVolumeChunked(clampedVolume);
      } else {
        this.setVolumeRegular(clampedVolume);
      }

      this.updateUIThrottled();
      this.performance.saveStateThrottled();
    } catch (error) {
      console.error("Set volume failed:", error);
      this.handleError(error);
    }
  }

  /**
   * Set volume for chunked audio
   */
  setVolumeChunked(volume) {
    if (this.masterGainNode) {
      this.masterGainNode.gain.setTargetAtTime(
        volume,
        this.audioContext.currentTime,
        0.1,
      );
    }
  }

  /**
   * Set volume for regular audio
   */
  setVolumeRegular(volume) {
    if (this.audio) {
      this.audio.volume = volume;
    }
  }

  /**
   * Attempt autoplay after user interaction
   */
  async attemptAutoplay() {
    if (this.config.autoplay && !this.state.autoplayAttempted) {
      this.state.autoplayAttempted = true;

      // Restore previous state
      const savedState = this.getSavedState();
      if (savedState.wasPlaying) {
        await this.play();
      }
    }
  }

  /**
   * Handle song end (move to next song or loop)
   */
  handleSongEnd() {
    if (this.config.enablePlaylist && this.playlist.length > 1) {
      const nextIndex =
        (this.state.currentSongIndex + 1) % this.playlist.length;
      this.loadSong(nextIndex);

      if (this.state.isPlaying) {
        setTimeout(() => this.play(), 100);
      }
    } else {
      // Loop current song
      this.state.currentTime = 0;
      this.state.currentChunk = 0;

      if (this.state.isPlaying) {
        setTimeout(() => this.play(), 100);
      }
    }
  }

  // ==================== EVENT HANDLERS ====================

  /**
   * Handle regular audio play event
   */
  onPlay() {
    this.state.isPlaying = true;
    this.updateUIThrottled();
  }

  /**
   * Handle regular audio pause event
   */
  onPause() {
    this.state.isPlaying = false;
    this.updateUIThrottled();
  } /**
   * Handle regular audio time update
   */
  onTimeUpdate() {
    if (this.audio && !this.state.usingChunkedPlayer) {
      this.state.currentTime = this.audio.currentTime;
      this.updateUIThrottled();
    }

    // Update buffer health for chunked streaming
    if (this.state.usingChunkedPlayer && this.state.isPlaying) {
      this.updateBufferHealth();
    }
  }

  /**
   * Handle regular audio loaded metadata
   */
  onLoadedMetadata() {
    this.state.isLoading = false;
    this.updateUIThrottled();
  }

  /**
   * Handle regular audio ended
   */
  onEnded() {
    this.handleSongEnd();
  }

  /**
   * Handle audio error
   */
  onError(error) {
    console.error("Audio error:", error);
    this.state.hasError = true;
    this.state.isLoading = false;
    this.updateUIThrottled();
  }

  /**
   * Handle storage change for cross-page sync
   */
  onStorageChange(event) {
    if (event.key === this.config.storageKey && event.newValue) {
      this.handleCrossPageSync(JSON.parse(event.newValue));
    }
  }

  /**
   * Handle visibility change
   */
  onVisibilityChange() {
    if (document.hidden) {
      this.performance.saveStateThrottled();
    }
  }

  /**
   * Handle before unload
   */
  onBeforeUnload() {
    this.saveState();
  }

  /**
   * Handle user interaction
   */
  onUserInteraction() {
    if (!this.state.userInteracted) {
      this.state.userInteracted = true;
      this.attemptAutoplay();
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Update UI elements
   */
  updateUI() {
    // Update toggle button and icon
    if (this.elements.icon) {
      this.elements.icon.textContent = this.state.isPlaying ? "🎵" : "🔇";
    }

    // Update visualizer
    if (this.elements.visualizer) {
      this.elements.visualizer.style.display = this.state.isPlaying
        ? "flex"
        : "none";
    }

    // Update volume slider
    if (this.elements.volumeSlider) {
      this.elements.volumeSlider.value = this.state.volume;
    }

    // Update progress bar
    if (this.elements.progressBar && this.elements.timeDisplay) {
      const duration = this.state.usingChunkedPlayer
        ? this.state.totalChunks * this.config.chunkDuration
        : this.audio
          ? this.audio.duration
          : 0;

      if (duration > 0) {
        const progress = (this.state.currentTime / duration) * 100;
        this.elements.progressBar.style.width = `${progress}%`;

        const currentMin = Math.floor(this.state.currentTime / 60);
        const currentSec = Math.floor(this.state.currentTime % 60);
        const totalMin = Math.floor(duration / 60);
        const totalSec = Math.floor(duration % 60);

        this.elements.timeDisplay.textContent = `${currentMin}:${currentSec.toString().padStart(2, "0")} / ${totalMin}:${totalSec.toString().padStart(2, "0")}`;
      }
    }

    // Update loading state
    if (this.state.isLoading) {
      document.body.classList.add("music-loading");
    } else {
      document.body.classList.remove("music-loading");
    }

    // Update error state
    if (this.state.hasError) {
      document.body.classList.add("music-error");
    } else {
      document.body.classList.remove("music-error");
    }
  }

  /**
   * Save current state to localStorage
   */
  saveState() {
    try {
      const state = {
        wasPlaying: this.state.isPlaying,
        volume: this.state.volume,
        currentTime: this.state.currentTime,
        currentSongIndex: this.state.currentSongIndex,
        userInteracted: this.state.userInteracted,
        usingChunkedPlayer: this.state.usingChunkedPlayer,
        timestamp: Date.now(),
      };

      localStorage.setItem(this.config.storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save music state:", error);
    }
  }

  /**
   * Restore state from localStorage
   */
  async restoreState() {
    try {
      const saved = this.getSavedState();
      const isRecentState =
        saved.timestamp && Date.now() - saved.timestamp < 5 * 60 * 1000;

      if (saved.userInteracted && isRecentState) {
        this.state.userInteracted = true;
        this.state.volume = saved.volume || this.config.volume;
        this.state.currentSongIndex = saved.currentSongIndex || 0;
        this.state.currentTime = saved.currentTime || 0;

        if (saved.wasPlaying) {
          // Will auto-resume after user interaction
          console.log(
            "🎵 Previous session was playing, will resume after user interaction",
          );
        }
      }
    } catch (error) {
      console.warn("Failed to restore music state:", error);
    }
  }

  /**
   * Get saved state from localStorage
   */
  getSavedState() {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Handle cross-page synchronization
   */
  handleCrossPageSync(newState) {
    try {
      if (!newState.userInteracted) return;

      // Sync user interaction status
      if (newState.userInteracted && !this.state.userInteracted) {
        this.state.userInteracted = true;
      }

      // Sync playing state
      if (newState.wasPlaying !== this.state.isPlaying) {
        if (newState.wasPlaying && this.state.userInteracted) {
          if (newState.currentTime) {
            this.state.currentTime = newState.currentTime;
            if (!this.state.usingChunkedPlayer && this.audio) {
              this.audio.currentTime = newState.currentTime;
            }
          }
          this.play();
        } else if (!newState.wasPlaying && this.state.isPlaying) {
          this.pause();
        }
      }

      // Sync volume
      if (newState.volume && newState.volume !== this.state.volume) {
        this.setVolume(newState.volume);
      }

      this.updateUIThrottled();
    } catch (error) {
      console.warn("Failed to sync music state:", error);
    }
  }

  /**
   * Handle errors gracefully
   */
  handleError(error) {
    this.state.hasError = true;
    this.state.isLoading = false;
    this.state.isPlaying = false;

    // Try to fallback to regular audio if chunked fails
    if (this.state.usingChunkedPlayer && this.config.fallbackToRegular) {
      console.warn("Chunked player error, falling back to regular audio");
      this.fallbackToRegularAudio();
    }

    this.updateUIThrottled();
  }

  /**
   * Detect low power mode for performance optimization
   */
  detectLowPowerMode() {
    // Simple heuristic based on navigator properties
    return (
      navigator.hardwareConcurrency < 4 ||
      navigator.deviceMemory < 4 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }

  /**
   * Throttle function to limit call frequency
   */
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  } /**
   * Simple event emitter
   */
  emit(event, data) {
    // Basic event emission for extensibility
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(`musicManager:${event}`, { detail: data }),
      );
    }
  }

  /**
   * Cleanup and destroy the music manager
   */ destroy() {
    // Stop playback
    this.stop();

    // Cleanup buffer status component
    if (this.bufferStatus) {
      this.bufferStatus.destroy();
      this.bufferStatus = null;
    }

    // Remove event listeners
    if (this.audio) {
      Object.values(this.boundHandlers).forEach((handler) => {
        this.audio.removeEventListener("play", handler);
        this.audio.removeEventListener("pause", handler);
        this.audio.removeEventListener("error", handler);
        this.audio.removeEventListener("timeupdate", handler);
        this.audio.removeEventListener("loadedmetadata", handler);
        this.audio.removeEventListener("ended", handler);
      });
    }

    // Cleanup chunked streaming
    if (this.audioContext) {
      this.audioContext.close();
    }

    this.chunks.clear();
    this.loadingPromises.clear();
    this.scheduledSources = [];

    // Remove global reference
    if (window.musicManager === this) {
      window.musicManager = null;
    }

    console.log("🎵 Music Manager destroyed");
  }
}

// Global instance management
window.UnifiedMusicManager = UnifiedMusicManager;

// Auto-initialize when DOM is ready (if not manually initialized)
document.addEventListener("DOMContentLoaded", function () {
  if (!window.musicManager) {
    window.musicManager = new UnifiedMusicManager();
  }
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = UnifiedMusicManager;
}

// ES6 export
export { UnifiedMusicManager };
