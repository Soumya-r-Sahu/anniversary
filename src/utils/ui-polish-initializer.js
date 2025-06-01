/**
 * UI Polish Initializer
 * Automatically applies consistent dark theme and UI controls across all pages
 * Version: 2.0.0 - Polished and Consistent
 */

class UIPolishInitializer {
    constructor() {
        this.config = {
            defaultTheme: 'dark',
            enableAutoInit: true,
            enableUIControls: true,
            enableThemeSync: true,
            enablePerformanceOptimizations: true
        };

        this.state = {
            isInitialized: false,
            currentTheme: 'dark',
            componentsLoaded: new Set()
        };

        // Don't initialize automatically - will be called by initializeWhenReady
    }

    /**
     * Initialize UI polishing system
     */
    async init() {
        try {
            // Apply dark theme immediately
            this.applyDarkTheme();

            // Setup performance optimizations
            this.setupPerformanceOptimizations();

            // Initialize music system first
            await this.initializeMusicSystem();

            // Initialize UI control system
            await this.initializeUIControls();

            // Setup theme synchronization
            this.setupThemeSync();

            // Apply consistent styling
            this.applyConsistentStyling();

            // Setup mobile optimizations
            this.setupMobileOptimizations();

            this.state.isInitialized = true;
            console.log('✨ UI Polish Initializer: All systems polished and ready!');
        } catch (error) {
            console.error('Failed to initialize UI polish system:', error);
        }
    }

    /**
     * Apply dark theme immediately
     */
    applyDarkTheme() {
        // Set data-theme attribute
        document.documentElement.setAttribute('data-theme', 'dark');
        
        // Add dark theme class to body
        document.body.classList.add('dark-theme');
        
        // Update meta theme color
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', '#0f0f23');
        }

        // Force dark background immediately
        document.body.style.background = 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)';
        document.body.style.color = '#ffffff';

        console.log('🌙 Dark theme applied immediately');
    }

    /**
     * Setup performance optimizations
     */
    setupPerformanceOptimizations() {
        // Add performance classes to body
        document.body.classList.add('performance-optimized');

        // Setup GPU acceleration for key elements
        const keyElements = document.querySelectorAll('.enhanced-button, .bubble, .particle, .heart');
        keyElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            element.style.transform = 'translateZ(0)';
            element.style.backfaceVisibility = 'hidden';
        });

        // Optimize images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.imageRendering = '-webkit-optimize-contrast';
            img.loading = 'lazy';
        });

        console.log('⚡ Performance optimizations applied');
    }

    /**
     * Initialize music system with comprehensive fallbacks
     */
    async initializeMusicSystem() {
        try {
            // Check if music manager already exists
            if (window.musicManager) {
                console.log('🎵 Music manager already exists');
                return;
            }

            // Use the new comprehensive music system initializer
            const { MusicSystemInitializer } = await import('../core/MusicSystemInitializer.js');

            if (!window.musicSystemInitializer) {
                window.musicSystemInitializer = new MusicSystemInitializer();
            }

            await window.musicSystemInitializer.init();
            window.musicManager = window.musicSystemInitializer.getMusicManager();

            console.log('🎵 Comprehensive music system initialized');
        } catch (error) {
            console.warn('Failed to initialize music system:', error);

            // Final fallback - try simple audio element
            this.initializeSimpleAudio();
        }
    }

    /**
     * Simple audio fallback
     */
    initializeSimpleAudio() {
        try {
            const audio = document.getElementById('background-music');
            if (audio && audio instanceof HTMLAudioElement) {
                window.musicManager = {
                    audio: audio,
                    play: () => audio.play().catch(e => console.warn('Play failed:', e)),
                    pause: () => audio.pause(),
                    toggle: function() {
                        if (this.audio.paused) {
                            this.play();
                        } else {
                            this.pause();
                        }
                    },
                    setVolume: (volume) => audio.volume = Math.max(0, Math.min(1, volume))
                };

                console.log('🎵 Simple audio fallback initialized');
            }
        } catch (error) {
            console.error('Failed to initialize simple audio:', error);
        }
    }

    /**
     * Initialize UI control system
     */
    async initializeUIControls() {
        try {
            // Remove old music players
            const oldMusicPlayers = document.querySelectorAll('.enhanced-music-player');
            oldMusicPlayers.forEach(player => {
                if (player.parentNode) {
                    player.parentNode.removeChild(player);
                }
            });

            // Import and initialize UI control system
            const { UIControlSystem } = await import('../components/UIControlSystem.js');
            
            if (!window.uiControlSystem) {
                window.uiControlSystem = new UIControlSystem({
                    enableThemeToggle: false, // Removed auto theme toggle
                    enableMusicControl: true,
                    enableSettingsPanel: true,
                    enableClearVisits: false, // Moved to settings page
                    position: 'bottom-right' // Moved settings to bottom
                });
            }

            console.log('🎛️ UI Control System initialized');
        } catch (error) {
            console.warn('Failed to initialize UI controls:', error);
        }
    }

    /**
     * Setup theme synchronization across tabs
     */
    setupThemeSync() {
        // Listen for storage changes (cross-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'anniversaryTheme') {
                const themeData = JSON.parse(e.newValue || '{}');
                if (themeData.theme && themeData.theme !== this.state.currentTheme) {
                    this.applyTheme(themeData.theme);
                }
            }
        });

        // Save current theme
        this.saveTheme();
    }

    /**
     * Apply consistent styling across all elements
     */
    applyConsistentStyling() {
        // Add consistent button styling
        const buttons = document.querySelectorAll('button, .enhanced-button, a[href]');
        buttons.forEach(button => {
            if (!button.classList.contains('ui-control-btn')) {
                button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                button.style.cursor = 'pointer';
            }
        });

        // Add consistent card styling
        const cards = document.querySelectorAll('.memory-card, .photo-card, .timeline-item, .glassmorphism-bg');
        cards.forEach(card => {
            card.style.backdropFilter = 'blur(20px)';
            card.style.webkitBackdropFilter = 'blur(20px)';
            card.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        });

        // Add consistent text styling
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.color = '#ffffff';
        });

        console.log('🎨 Consistent styling applied');
    }

    /**
     * Setup mobile optimizations
     */
    setupMobileOptimizations() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            document.body.classList.add('mobile-optimized');
            
            // Optimize touch targets
            const touchTargets = document.querySelectorAll('button, a, input, select');
            touchTargets.forEach(target => {
                const currentMinHeight = parseInt(getComputedStyle(target).minHeight) || 0;
                if (currentMinHeight < 44) {
                    target.style.minHeight = '44px';
                    target.style.minWidth = '44px';
                }
            });

            // Optimize animations for mobile
            const animatedElements = document.querySelectorAll('.bubble, .particle, .heart');
            animatedElements.forEach(element => {
                element.style.animationDuration = '0.5s';
            });

            console.log('📱 Mobile optimizations applied');
        }
    }

    /**
     * Apply theme
     */
    applyTheme(themeName) {
        this.state.currentTheme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        
        if (themeName === 'dark') {
            document.body.style.background = 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)';
            document.body.style.color = '#ffffff';
        } else {
            document.body.style.background = 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)';
            document.body.style.color = '#1f2937';
        }

        this.saveTheme();
    }

    /**
     * Save theme to localStorage
     */
    saveTheme() {
        const themeData = {
            theme: this.state.currentTheme,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem('anniversaryTheme', JSON.stringify(themeData));
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    }

    /**
     * Add polished button effects
     */
    addButtonEffects() {
        const buttons = document.querySelectorAll('.enhanced-button, button:not(.ui-control-btn)');
        
        buttons.forEach(button => {
            // Add hover effect
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
                button.style.boxShadow = '0 12px 40px rgba(255, 107, 157, 0.3)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
                button.style.boxShadow = '0 8px 25px rgba(255, 107, 157, 0.2)';
            });

            // Add click effect
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(0) scale(0.98)';
            });

            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
        });
    }

    /**
     * Fix positioning issues
     */
    fixPositioning() {
        // Fix any absolute positioned elements that might be off-screen
        const absoluteElements = document.querySelectorAll('[style*="position: absolute"], [style*="position: fixed"]');
        
        absoluteElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            
            // If element is off-screen, adjust position
            if (rect.right > window.innerWidth) {
                element.style.right = '20px';
                element.style.left = 'auto';
            }
            
            if (rect.bottom > window.innerHeight) {
                element.style.bottom = '20px';
                element.style.top = 'auto';
            }
        });
    }

    /**
     * Initialize when DOM is ready
     */
    static initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                const initializer = new UIPolishInitializer();
                await initializer.init();
            });
        } else {
            const initializer = new UIPolishInitializer();
            initializer.init();
        }
    }
}

// Auto-initialize
UIPolishInitializer.initializeWhenReady();

// Export for manual initialization
export { UIPolishInitializer };
