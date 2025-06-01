/**
 * UI Control System
 * Unified control panel for theme, music, and other UI controls
 * Version: 2.0.0 - Polished and Consistent
 */

class UIControlSystem {
    constructor(options = {}) {
        // Get current page to determine settings availability
        const currentPage = window.location.pathname.toLowerCase();
        const isIndexOrCountdown = currentPage.includes('index.html') || 
                                  currentPage.includes('countdown.html') || 
                                  currentPage === '/' || 
                                  currentPage.endsWith('/');
        
        // Configuration
        this.config = {
            enableThemeToggle: options.enableThemeToggle !== false,
            enableMusicControl: options.enableMusicControl !== false,
            enableSettingsPanel: isIndexOrCountdown ? false : (options.enableSettingsPanel !== false),
            enableClearVisits: options.enableClearVisits || false, // Disabled by default, moved to settings
            position: options.position || 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
            autoHide: options.autoHide || false,
            hideDelay: options.hideDelay || 3000,
            ...options
        };

        // State management
        this.state = {
            isVisible: true,
            isExpanded: false,
            currentTheme: 'dark',
            isMusicPlaying: false,
            hideTimeout: null,
            lastNotificationTime: null
        };

        // UI elements
        this.ui = {
            controlPanel: null,
            themeToggle: null,
            musicControl: null,
            settingsButton: null,
            clearVisitsButton: null
        };

        // Component references
        this.components = {
            themeManager: null,
            musicManager: null
        };

        // Event handlers
        this.boundHandlers = {
            onThemeToggle: this.onThemeToggle.bind(this),
            onMusicToggle: this.onMusicToggle.bind(this),
            onSettingsToggle: this.onSettingsToggle.bind(this),
            onClearVisits: this.onClearVisits.bind(this),
            onMouseEnter: this.onMouseEnter.bind(this),
            onMouseLeave: this.onMouseLeave.bind(this)
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize UI control system
     */
    init() {
        try {
            // Create control panel
            this.createControlPanel();

            // Setup event listeners
            this.setupEventListeners();

            // Setup auto-hide if enabled
            if (this.config.autoHide) {
                this.setupAutoHide();
            }

            // Initialize theme
            this.initializeTheme();

            // Initialize music control
            this.initializeMusicControl();

            console.log('🎛️ UI Control System initialized');
        } catch (error) {
            console.error('Failed to initialize UI control system:', error);
        }
    }

    /**
     * Create control panel
     */
    createControlPanel() {
        // Remove existing control panel if any
        const existing = document.querySelector('.ui-control-panel');
        if (existing) {
            existing.remove();
        }

        // Create main control panel
        this.ui.controlPanel = document.createElement('div');
        this.ui.controlPanel.className = `ui-control-panel ${this.config.position}`;

        // Create theme toggle
        if (this.config.enableThemeToggle) {
            this.ui.themeToggle = this.createThemeToggle();
            this.ui.controlPanel.appendChild(this.ui.themeToggle);
        }

        // Create music control
        if (this.config.enableMusicControl) {
            this.ui.musicControl = this.createMusicControl();
            this.ui.controlPanel.appendChild(this.ui.musicControl);
        }

        // Create settings button
        if (this.config.enableSettingsPanel) {
            this.ui.settingsButton = this.createSettingsButton();
            this.ui.controlPanel.appendChild(this.ui.settingsButton);
        }

        // Create clear visits button
        if (this.config.enableClearVisits) {
            this.ui.clearVisitsButton = this.createClearVisitsButton();
            this.ui.controlPanel.appendChild(this.ui.clearVisitsButton);
        }

        // Add to page
        document.body.appendChild(this.ui.controlPanel);
    }

    /**
     * Create theme toggle button
     */
    createThemeToggle() {
        const button = document.createElement('button');
        button.className = 'ui-control-btn theme-toggle-btn';
        button.innerHTML = '🌙';
        button.title = 'Toggle Theme';
        button.setAttribute('aria-label', 'Toggle between light and dark theme');
        
        button.addEventListener('click', this.boundHandlers.onThemeToggle);
        
        return button;
    }

    /**
     * Create music control button
     */
    createMusicControl() {
        const button = document.createElement('button');
        button.className = 'ui-control-btn music-control-btn';
        button.innerHTML = '🎵';
        button.title = 'Toggle Music';
        button.setAttribute('aria-label', 'Toggle background music');

        // Add visualizer
        const visualizer = document.createElement('div');
        visualizer.className = 'music-visualizer';
        visualizer.style.display = 'none';
        visualizer.innerHTML = `
            <div class="music-bar"></div>
            <div class="music-bar"></div>
            <div class="music-bar"></div>
            <div class="music-bar"></div>
        `;

        button.appendChild(visualizer);
        button.addEventListener('click', this.boundHandlers.onMusicToggle);
        
        return button;
    }

    /**
     * Create settings button
     */
    createSettingsButton() {
        const button = document.createElement('button');
        button.className = 'ui-control-btn settings-btn';
        button.innerHTML = '⚙️';
        button.title = 'Settings';
        button.setAttribute('aria-label', 'Open settings panel');
        
        button.addEventListener('click', this.boundHandlers.onSettingsToggle);
        
        return button;
    }

    /**
     * Create clear visits button
     */
    createClearVisitsButton() {
        const button = document.createElement('button');
        button.className = 'ui-control-btn clear-visits-btn';
        button.innerHTML = '🔄';
        button.title = 'Clear Previous Visits';
        button.setAttribute('aria-label', 'Clear all previous visit data');
        
        button.addEventListener('click', this.boundHandlers.onClearVisits);
        
        return button;
    }

    /**
     * Get position styles based on configuration
     */
    getPositionStyles() {
        const positions = {
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;'
        };

        return positions[this.config.position] || positions['top-right'];
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (this.config.autoHide) {
            this.ui.controlPanel.addEventListener('mouseenter', this.boundHandlers.onMouseEnter);
            this.ui.controlPanel.addEventListener('mouseleave', this.boundHandlers.onMouseLeave);
        }
    }

    /**
     * Initialize theme management
     */
    async initializeTheme() {
        try {
            // Import theme manager if not already available
            if (!this.components.themeManager) {
                const { ThemeManager } = await import('./ThemeManager.js');
                this.components.themeManager = new ThemeManager({
                    defaultTheme: 'dark',
                    enableAutoTheme: false
                });
            }

            // Update theme toggle icon
            this.updateThemeToggleIcon();
        } catch (error) {
            console.warn('Failed to initialize theme manager:', error);
        }
    }

    /**
     * Initialize music control with PageSpecificMusicManager priority
     */
    async initializeMusicControl() {
        try {
            // Priority 1: PageSpecificMusicManager (preferred for new system)
            if (window.pageSpecificMusicManager) {
                this.components.musicManager = window.pageSpecificMusicManager;
                console.log('🎵 Using PageSpecificMusicManager for UI controls');
            }
            // Priority 2: Existing global music manager
            else if (window.musicManager) {
                this.components.musicManager = window.musicManager;
                console.log('🎵 Using existing global music manager');
            }
            // Priority 3: Initialize UnifiedMusicManager as fallback
            else {
                try {
                    const { UnifiedMusicManager } = await import('../core/UnifiedMusicManager.js');
                    this.components.musicManager = new UnifiedMusicManager({
                        autoplay: false,
                        volume: 0.3,
                        crossPageSync: true
                    });
                    await this.components.musicManager.init();
                    window.musicManager = this.components.musicManager;
                    console.log('🎵 Initialized UnifiedMusicManager as fallback');
                } catch (importError) {
                    console.warn('UnifiedMusicManager not available, music controls disabled:', importError);
                    return;
                }
            }

            // Setup state synchronization with the music manager
            this.setupMusicStateSync();
            
            // Initial UI update
            this.updateMusicControlState();
        } catch (error) {
            console.warn('Failed to initialize music manager:', error);
        }
    }

    /**
     * Event handlers
     */
    onThemeToggle() {
        if (this.components.themeManager) {
            this.components.themeManager.toggleTheme();
            this.updateThemeToggleIcon();
        }
    }

    onMusicToggle() {
        // Priority 1: PageSpecificMusicManager (preferred)
        if (window.pageSpecificMusicManager) {
            window.pageSpecificMusicManager.handleUserInteraction();
            window.pageSpecificMusicManager.togglePopup();
            return;
        }
        
        // Priority 2: Use assigned music manager
        if (this.components.musicManager) {
            try {
                // Handle different music manager interfaces
                if (typeof this.components.musicManager.toggle === 'function') {
                    this.components.musicManager.toggle();
                } else if (typeof this.components.musicManager.play === 'function') {
                    if (this.state.isMusicPlaying) {
                        this.components.musicManager.pause();
                    } else {
                        this.components.musicManager.play();
                    }
                }
                this.updateMusicControlState();
            } catch (error) {
                console.warn('Error toggling music:', error);
            }
        } else {
            console.warn('No music manager available');
        }
    }

    onSettingsToggle() {
        // Navigate to settings page
        window.location.href = 'settings.html';
    }

    onClearVisits() {
        // Clear localStorage
        localStorage.clear();

        // Clear sessionStorage
        sessionStorage.clear();

        // Show subtle notification instead of popup
        this.showNotification('Previous visit data cleared', 'success');

        // Reload page after short delay
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    onMouseEnter() {
        if (this.state.hideTimeout) {
            clearTimeout(this.state.hideTimeout);
            this.state.hideTimeout = null;
        }
        this.show();
    }

    onMouseLeave() {
        if (this.config.autoHide) {
            this.state.hideTimeout = setTimeout(() => {
                this.hide();
            }, this.config.hideDelay);
        }
    }

    /**
     * Update theme toggle icon
     */
    updateThemeToggleIcon() {
        if (!this.ui.themeToggle) return;

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.state.currentTheme = currentTheme;

        if (currentTheme === 'dark') {
            this.ui.themeToggle.innerHTML = '🌙';
            this.ui.themeToggle.title = 'Switch to Light Theme';
        } else {
            this.ui.themeToggle.innerHTML = '☀️';
            this.ui.themeToggle.title = 'Switch to Dark Theme';
        }
    }

    /**
     * Setup music state synchronization
     */
    setupMusicStateSync() {
        if (!this.components.musicManager) return;

        // Listen for music state changes
        if (this.components.musicManager === window.pageSpecificMusicManager) {
            // PageSpecificMusicManager integration
            this.musicStateUpdateInterval = setInterval(() => {
                this.updateMusicControlStateFromPageSpecificManager();
            }, 500);
        } else {
            // Traditional music manager integration
            this.musicStateUpdateInterval = setInterval(() => {
                this.updateMusicControlState();
            }, 500);
        }
    }

    /**
     * Update music control state for PageSpecificMusicManager
     */
    updateMusicControlStateFromPageSpecificManager() {
        if (!this.ui.musicControl || !window.pageSpecificMusicManager) return;

        const isPlaying = window.pageSpecificMusicManager.isPlaying;
        this.state.isMusicPlaying = isPlaying;

        const icon = this.ui.musicControl.querySelector(':not(.music-visualizer)');
        const visualizer = this.ui.musicControl.querySelector('.music-visualizer');

        if (isPlaying) {
            this.ui.musicControl.classList.add('playing');
            if (icon) icon.style.display = 'none';
            if (visualizer) visualizer.style.display = 'flex';
            this.ui.musicControl.title = 'Open Music Player';
        } else {
            this.ui.musicControl.classList.remove('playing');
            if (icon) icon.style.display = 'flex';
            if (visualizer) visualizer.style.display = 'none';
            this.ui.musicControl.title = 'Open Music Player';
        }
    }

    /**
     * Update music control state (optimized)
     */
    updateMusicControlState() {
        if (!this.ui.musicControl) return;

        // Use PageSpecificMusicManager if available
        if (window.pageSpecificMusicManager) {
            this.updateMusicControlStateFromPageSpecificManager();
            return;
        }

        // Traditional music manager state check
        const isPlaying = this.components.musicManager && 
                         this.components.musicManager.state && 
                         this.components.musicManager.state.isPlaying;

        this.state.isMusicPlaying = isPlaying;

        const icon = this.ui.musicControl.querySelector(':not(.music-visualizer)');
        const visualizer = this.ui.musicControl.querySelector('.music-visualizer');

        if (isPlaying) {
            this.ui.musicControl.classList.add('playing');
            if (icon) icon.style.display = 'none';
            if (visualizer) visualizer.style.display = 'flex';
            this.ui.musicControl.title = 'Pause Music';
        } else {
            this.ui.musicControl.classList.remove('playing');
            if (icon) icon.style.display = 'flex';
            if (visualizer) visualizer.style.display = 'none';
            this.ui.musicControl.title = 'Play Music';
        }
    }

    /**
     * Show/hide control panel
     */
    show() {
        this.state.isVisible = true;
        this.ui.controlPanel.style.opacity = '1';
        this.ui.controlPanel.style.transform = 'translateX(0)';
    }

    hide() {
        this.state.isVisible = false;
        this.ui.controlPanel.style.opacity = '0.3';
        this.ui.controlPanel.style.transform = 'translateX(20px)';
    }

    /**
     * Setup auto-hide functionality
     */
    setupAutoHide() {
        this.ui.controlPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Initially hide after delay
        setTimeout(() => {
            if (!this.ui.controlPanel.matches(':hover')) {
                this.hide();
            }
        }, this.config.hideDelay);
    }

    /**
     * Show subtle notification with improved performance
     */
    showNotification(message, type = 'info') {
        // Prevent notification spam
        if (this.state.lastNotificationTime && 
            Date.now() - this.state.lastNotificationTime < 1000) {
            return;
        }

        const notification = document.createElement('div');
        notification.className = `ui-notification ui-notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: slideInRight 0.3s ease-out;
            will-change: transform, opacity;
        `;

        if (type === 'success') {
            notification.style.background = 'rgba(34, 197, 94, 0.8)';
            notification.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        }

        document.body.appendChild(notification);
        this.state.lastNotificationTime = Date.now();

        // Auto remove with optimized cleanup
        const removeNotification = () => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        };

        setTimeout(removeNotification, 3000);
    }

    /**
     * Enhanced destroy method with comprehensive cleanup
     */
    destroy() {
        // Clear music state sync interval
        if (this.musicStateUpdateInterval) {
            clearInterval(this.musicStateUpdateInterval);
            this.musicStateUpdateInterval = null;
        }

        // Clear hide timeout
        if (this.state.hideTimeout) {
            clearTimeout(this.state.hideTimeout);
            this.state.hideTimeout = null;
        }

        // Remove event listeners
        if (this.ui.controlPanel) {
            this.ui.controlPanel.removeEventListener('mouseenter', this.boundHandlers.onMouseEnter);
            this.ui.controlPanel.removeEventListener('mouseleave', this.boundHandlers.onMouseLeave);
        }

        // Remove individual button event listeners
        if (this.ui.themeToggle) {
            this.ui.themeToggle.removeEventListener('click', this.boundHandlers.onThemeToggle);
        }
        if (this.ui.musicControl) {
            this.ui.musicControl.removeEventListener('click', this.boundHandlers.onMusicToggle);
        }
        if (this.ui.settingsButton) {
            this.ui.settingsButton.removeEventListener('click', this.boundHandlers.onSettingsToggle);
        }
        if (this.ui.clearVisitsButton) {
            this.ui.clearVisitsButton.removeEventListener('click', this.boundHandlers.onClearVisits);
        }

        // Remove from DOM
        if (this.ui.controlPanel && this.ui.controlPanel.parentNode) {
            this.ui.controlPanel.parentNode.removeChild(this.ui.controlPanel);
        }

        // Clean up references
        this.ui = {};
        this.components = {};
        this.state = {
            isVisible: false,
            isExpanded: false,
            currentTheme: 'dark',
            isMusicPlaying: false,
            hideTimeout: null,
            lastNotificationTime: null
        };

        console.log('🧹 UIControlSystem cleaned up completely');
    }
}

// Export for module systems
export { UIControlSystem };

// Auto-initialize if not in module environment
if (typeof window !== 'undefined' && !window.uiControlSystem) {
    document.addEventListener('DOMContentLoaded', () => {
        window.uiControlSystem = new UIControlSystem();
    });
}
