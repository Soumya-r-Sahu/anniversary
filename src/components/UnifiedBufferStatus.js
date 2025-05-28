/**
 * Unified Buffer Status Component
 * Shows chunked streaming buffer health and loading status
 */

class UnifiedBufferStatus {
  constructor(options = {}) {
    this.config = {
      container: options.container || document.body,
      position: options.position || "bottom-right", // top-left, top-right, bottom-left, bottom-right
      autoHide: options.autoHide !== false,
      autoHideDelay: options.autoHideDelay || 3000,
      enableTooltips: options.enableTooltips !== false,
      showDetailed: options.showDetailed || false,
      ...options,
    };

    this.state = {
      visible: false,
      bufferHealth: 0,
      isLoading: false,
      currentChunk: 0,
      totalChunks: 0,
      loadedChunks: [],
      error: null,
    };

    this.elements = {};
    this.autoHideTimeout = null;

    this.init();
  }

  /**
   * Initialize buffer status UI
   */
  init() {
    this.createUI();
    this.setupEventListeners();
    console.log("📊 Unified Buffer Status initialized");
  }

  /**
   * Create buffer status UI elements
   */
  createUI() {
    // Main container
    this.elements.container = document.createElement("div");
    this.elements.container.className = "unified-buffer-status";
    this.elements.container.innerHTML = `
            <div class="buffer-status-content">
                <div class="buffer-header">
                    <span class="buffer-icon">📊</span>
                    <span class="buffer-title">Buffer Status</span>
                    <button class="buffer-close" aria-label="Close buffer status">×</button>
                </div>
                
                <div class="buffer-main">
                    <!-- Buffer Health Bar -->
                    <div class="buffer-health-container">
                        <div class="buffer-health-label">
                            <span>Buffer Health</span>
                            <span class="buffer-health-percentage">0%</span>
                        </div>
                        <div class="buffer-health-bar">
                            <div class="buffer-health-fill"></div>
                        </div>
                    </div>
                    
                    <!-- Loading Status -->
                    <div class="buffer-loading-container">
                        <div class="buffer-loading-indicator">
                            <div class="loading-spinner"></div>
                            <span class="loading-text">Ready</span>
                        </div>
                    </div>
                    
                    <!-- Chunk Progress (detailed view) -->
                    <div class="buffer-chunks-container" style="display: none;">
                        <div class="buffer-chunks-label">Chunks</div>
                        <div class="buffer-chunks-progress">
                            <span class="chunks-current">0</span> / <span class="chunks-total">0</span>
                        </div>
                        <div class="buffer-chunks-grid"></div>
                    </div>
                    
                    <!-- Error Display -->
                    <div class="buffer-error-container" style="display: none;">
                        <div class="buffer-error-icon">⚠️</div>
                        <div class="buffer-error-message"></div>
                    </div>
                </div>
                
                <div class="buffer-controls">
                    <button class="buffer-toggle-detailed">Details</button>
                    <button class="buffer-retry" style="display: none;">Retry</button>
                </div>
            </div>
        `;

    // Position the container
    this.positionContainer();

    // Add styles
    this.addStyles();

    // Append to container
    this.config.container.appendChild(this.elements.container);

    // Cache elements
    this.cacheElements();

    // Initially hidden
    this.hide();
  }

  /**
   * Cache frequently used elements
   */
  cacheElements() {
    this.elements.healthFill = this.elements.container.querySelector(
      ".buffer-health-fill",
    );
    this.elements.healthPercentage = this.elements.container.querySelector(
      ".buffer-health-percentage",
    );
    this.elements.loadingSpinner =
      this.elements.container.querySelector(".loading-spinner");
    this.elements.loadingText =
      this.elements.container.querySelector(".loading-text");
    this.elements.chunksContainer = this.elements.container.querySelector(
      ".buffer-chunks-container",
    );
    this.elements.chunksCurrent =
      this.elements.container.querySelector(".chunks-current");
    this.elements.chunksTotal =
      this.elements.container.querySelector(".chunks-total");
    this.elements.chunksGrid = this.elements.container.querySelector(
      ".buffer-chunks-grid",
    );
    this.elements.errorContainer = this.elements.container.querySelector(
      ".buffer-error-container",
    );
    this.elements.errorMessage = this.elements.container.querySelector(
      ".buffer-error-message",
    );
    this.elements.closeBtn =
      this.elements.container.querySelector(".buffer-close");
    this.elements.detailsBtn = this.elements.container.querySelector(
      ".buffer-toggle-detailed",
    );
    this.elements.retryBtn =
      this.elements.container.querySelector(".buffer-retry");
  }

  /**
   * Position container based on config
   */
  positionContainer() {
    const positions = {
      "top-left": { top: "20px", left: "20px" },
      "top-right": { top: "20px", right: "20px" },
      "bottom-left": { bottom: "20px", left: "20px" },
      "bottom-right": { bottom: "20px", right: "20px" },
    };

    const pos = positions[this.config.position] || positions["bottom-right"];
    Object.assign(this.elements.container.style, {
      position: "fixed",
      zIndex: "10000",
      ...pos,
    });
  }

  /**
   * Add CSS styles
   */
  addStyles() {
    if (document.getElementById("unified-buffer-status-styles")) return;

    const styles = document.createElement("style");
    styles.id = "unified-buffer-status-styles";
    styles.textContent = `
            .unified-buffer-status {
                background: rgba(0, 0, 0, 0.9);
                border-radius: 12px;
                padding: 16px;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                min-width: 280px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .unified-buffer-status.visible {
                transform: translateY(0);
                opacity: 1;
            }

            .buffer-header {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                gap: 8px;
            }

            .buffer-icon {
                font-size: 16px;
            }

            .buffer-title {
                flex: 1;
                font-weight: 600;
            }

            .buffer-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .buffer-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .buffer-health-container {
                margin-bottom: 12px;
            }

            .buffer-health-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
            }

            .buffer-health-bar {
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
            }

            .buffer-health-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff4444 0%, #ffaa00 50%, #00ff88 100%);
                border-radius: 3px;
                transition: all 0.3s ease;
                width: 0%;
            }

            .buffer-loading-container {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }

            .loading-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid #4fc3f7;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                display: none;
            }

            .loading-spinner.active {
                display: block;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-text {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
            }

            .buffer-chunks-container {
                margin-bottom: 12px;
            }

            .buffer-chunks-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 6px;
            }

            .buffer-chunks-progress {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 8px;
            }

            .buffer-chunks-grid {
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 2px;
                margin-bottom: 8px;
            }

            .chunk-indicator {
                width: 20px;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 1px;
                transition: all 0.2s ease;
            }

            .chunk-indicator.loaded {
                background: #00ff88;
            }

            .chunk-indicator.loading {
                background: #ffaa00;
                animation: pulse 1s infinite;
            }

            .chunk-indicator.error {
                background: #ff4444;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .buffer-error-container {
                background: rgba(255, 68, 68, 0.1);
                border: 1px solid rgba(255, 68, 68, 0.3);
                border-radius: 6px;
                padding: 8px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .buffer-error-icon {
                font-size: 16px;
            }

            .buffer-error-message {
                font-size: 12px;
                color: #ff8a80;
            }

            .buffer-controls {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }

            .buffer-controls button {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .buffer-controls button:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .buffer-controls button:active {
                transform: translateY(1px);
            }
        `;

    document.head.appendChild(styles);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Close button
    this.elements.closeBtn.addEventListener("click", () => this.hide());

    // Details toggle
    this.elements.detailsBtn.addEventListener("click", () =>
      this.toggleDetails(),
    );

    // Retry button
    this.elements.retryBtn.addEventListener("click", () => this.handleRetry());

    // Listen for music manager events
    window.addEventListener("musicManager:chunkLoaded", (e) => {
      this.updateChunkStatus(e.detail);
    });

    window.addEventListener("musicManager:chunkError", (e) => {
      this.showError(e.detail);
    });

    window.addEventListener("musicManager:bufferUpdate", (e) => {
      this.updateBufferHealth(e.detail.bufferHealth);
    });

    // Auto-hide on user interaction
    if (this.config.autoHide) {
      document.addEventListener("click", (e) => {
        if (!this.elements.container.contains(e.target)) {
          this.startAutoHide();
        }
      });
    }
  }

  /**
   * Show buffer status
   */
  show() {
    this.state.visible = true;
    this.elements.container.classList.add("visible");
    this.clearAutoHide();
  }

  /**
   * Hide buffer status
   */
  hide() {
    this.state.visible = false;
    this.elements.container.classList.remove("visible");
    this.clearAutoHide();
  }

  /**
   * Toggle visibility
   */
  toggle() {
    if (this.state.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Update buffer health percentage
   */
  updateBufferHealth(health) {
    this.state.bufferHealth = Math.max(0, Math.min(100, health));

    this.elements.healthFill.style.width = `${this.state.bufferHealth}%`;
    this.elements.healthPercentage.textContent = `${Math.round(this.state.bufferHealth)}%`;

    // Auto-show on low buffer health
    if (this.state.bufferHealth < 30) {
      this.show();
      this.setLoadingState(true, "Buffer low...");
    } else if (this.state.bufferHealth > 70) {
      this.setLoadingState(false, "Buffer healthy");
      this.startAutoHide();
    }
  }

  /**
   * Update chunk loading status
   */
  updateChunkStatus(data) {
    const { chunkIndex, bufferHealth } = data;

    this.state.currentChunk = chunkIndex;
    this.state.loadedChunks.push(chunkIndex);

    this.updateBufferHealth(bufferHealth);
    this.updateChunksDisplay();

    // Show briefly on chunk load
    this.show();
    this.setLoadingState(false, `Chunk ${chunkIndex} loaded`);
    this.startAutoHide();
  }

  /**
   * Show loading state
   */
  setLoadingState(loading, text = "") {
    this.state.isLoading = loading;

    if (loading) {
      this.elements.loadingSpinner.classList.add("active");
      this.elements.loadingText.textContent = text || "Loading...";
      this.show();
    } else {
      this.elements.loadingSpinner.classList.remove("active");
      this.elements.loadingText.textContent = text || "Ready";
    }
  }

  /**
   * Show error
   */
  showError(data) {
    const { error, chunkIndex } = data;
    this.state.error = error;

    this.elements.errorMessage.textContent = `Chunk ${chunkIndex}: ${error.message || "Load failed"}`;
    this.elements.errorContainer.style.display = "block";
    this.elements.retryBtn.style.display = "block";

    this.show();
    this.setLoadingState(false, "Error occurred");
  }

  /**
   * Clear error
   */
  clearError() {
    this.state.error = null;
    this.elements.errorContainer.style.display = "none";
    this.elements.retryBtn.style.display = "none";
  }

  /**
   * Toggle detailed view
   */
  toggleDetails() {
    this.config.showDetailed = !this.config.showDetailed;
    this.elements.chunksContainer.style.display = this.config.showDetailed
      ? "block"
      : "none";
    this.elements.detailsBtn.textContent = this.config.showDetailed
      ? "Hide Details"
      : "Details";

    if (this.config.showDetailed) {
      this.updateChunksDisplay();
    }
  }

  /**
   * Update chunks display
   */
  updateChunksDisplay() {
    if (!this.config.showDetailed) return;

    this.elements.chunksCurrent.textContent = this.state.loadedChunks.length;
    this.elements.chunksTotal.textContent = this.state.totalChunks;

    // Update chunks grid
    this.elements.chunksGrid.innerHTML = "";
    for (let i = 0; i < this.state.totalChunks; i++) {
      const indicator = document.createElement("div");
      indicator.className = "chunk-indicator";

      if (this.state.loadedChunks.includes(i)) {
        indicator.classList.add("loaded");
      } else if (i === this.state.currentChunk) {
        indicator.classList.add("loading");
      }

      this.elements.chunksGrid.appendChild(indicator);
    }
  }

  /**
   * Handle retry
   */
  handleRetry() {
    this.clearError();
    this.setLoadingState(true, "Retrying...");

    // Emit retry event
    window.dispatchEvent(
      new CustomEvent("bufferStatus:retry", {
        detail: { chunkIndex: this.state.currentChunk },
      }),
    );
  }

  /**
   * Start auto-hide timer
   */
  startAutoHide() {
    if (!this.config.autoHide) return;

    this.clearAutoHide();
    this.autoHideTimeout = setTimeout(() => {
      this.hide();
    }, this.config.autoHideDelay);
  }

  /**
   * Clear auto-hide timer
   */
  clearAutoHide() {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
      this.autoHideTimeout = null;
    }
  }

  /**
   * Update total chunks
   */
  setTotalChunks(total) {
    this.state.totalChunks = total;
    this.updateChunksDisplay();
  }

  /**
   * Reset state
   */
  reset() {
    this.state.bufferHealth = 0;
    this.state.currentChunk = 0;
    this.state.loadedChunks = [];
    this.clearError();
    this.setLoadingState(false, "Ready");
    this.updateBufferHealth(0);
    this.updateChunksDisplay();
  }

  /**
   * Destroy buffer status
   */
  destroy() {
    this.clearAutoHide();

    if (this.elements.container && this.elements.container.parentNode) {
      this.elements.container.parentNode.removeChild(this.elements.container);
    }

    // Remove styles if no other instances
    const statusElements = document.querySelectorAll(".unified-buffer-status");
    if (statusElements.length === 0) {
      const styles = document.getElementById("unified-buffer-status-styles");
      if (styles) {
        styles.remove();
      }
    }
  }
}

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = UnifiedBufferStatus;
}

// Global registration
if (typeof window !== "undefined") {
  window.UnifiedBufferStatus = UnifiedBufferStatus;
}
