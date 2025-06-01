/**
 * Background Effects Manager
 * Unified background effects system for the anniversary website
 * Renamed from BackgroundComponents for clarity
 * Version: 2.0.0
 */

class BackgroundEffectsManager {
    constructor(options = {}) {
        // Configuration
        this.config = {
            enableParticles: options.enableParticles !== false,
            enableHearts: options.enableHearts !== false,
            enableMusic: options.enableMusic !== false,
            enableBubbles: options.enableBubbles !== false,
            pageType: options.pageType || 'default',
            performance: options.performance || 'auto',
            intensity: options.intensity || 'medium', // 'low', 'medium', 'high'
            ...options
        };

        // State management
        this.state = {
            isInitialized: false,
            isActive: true,
            performanceMode: this.detectPerformanceMode(),
            isPageVisible: !document.hidden
        };

        // Component instances
        this.components = {
            particles: null,
            hearts: null,
            music: null,
            bubbles: null
        };

        // Containers
        this.containers = {
            particles: null,
            hearts: null,
            bubbles: null
        };

        // Event handlers
        this.boundHandlers = {
            onVisibilityChange: this.onVisibilityChange.bind(this),
            onResize: this.onResize.bind(this),
            onPerformanceChange: this.onPerformanceChange.bind(this)
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize background effects manager
     */
    init() {
        try {
            // Setup containers
            this.setupContainers();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize components based on configuration
            this.initializeComponents();

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            this.state.isInitialized = true;
            console.log('🎭 Background Effects Manager initialized');
        } catch (error) {
            console.error('Failed to initialize background effects manager:', error);
        }
    }

    /**
     * Setup containers for background effects
     */
    setupContainers() {
        // Particles container
        if (this.config.enableParticles) {
            this.containers.particles = this.createContainer('particles-background', {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '1',
                overflow: 'hidden'
            });
        }

        // Hearts container
        if (this.config.enableHearts) {
            this.containers.hearts = this.createContainer('hearts-background', {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '2',
                overflow: 'hidden'
            });
        }

        // Bubbles container
        if (this.config.enableBubbles) {
            this.containers.bubbles = this.createContainer('bubbles-background', {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '3',
                overflow: 'hidden'
            });
        }
    }

    /**
     * Create container element
     */
    createContainer(id, styles) {
        let container = document.getElementById(id);

        if (!container) {
            container = document.createElement('div');
            container.id = id;
            container.className = id.replace('-background', '');

            // Apply styles
            Object.assign(container.style, styles);

            // Add GPU acceleration
            container.style.transform = 'translateZ(0)';
            container.style.willChange = 'auto';
            container.style.backfaceVisibility = 'hidden';

            document.body.appendChild(container);
        }

        return container;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Page visibility handling
        document.addEventListener('visibilitychange', this.boundHandlers.onVisibilityChange, { passive: true });

        // Window resize handling
        window.addEventListener('resize', this.boundHandlers.onResize, { passive: true });

        // Performance change handling
        document.addEventListener('performancechange', this.boundHandlers.onPerformanceChange, { passive: true });
    }

    /**
     * Initialize components
     */
    async initializeComponents() {
        // Initialize particles system
        if (this.config.enableParticles) {
            await this.initializeParticles();
        }

        // Initialize hearts animation
        if (this.config.enableHearts) {
            await this.initializeHearts();
        }

        // Initialize music player
        if (this.config.enableMusic) {
            await this.initializeMusic();
        }

        // Initialize bubbles animation
        if (this.config.enableBubbles) {
            await this.initializeBubbles();
        }
    }

    /**
     * Initialize particles system
     */
    async initializeParticles() {
        try {
            // Dynamic import to avoid loading if not needed
            const { ParticleEffectSystem } = await import('./ParticleEffectSystem.js');
            
            this.components.particles = new ParticleEffectSystem({
                container: this.containers.particles,
                pageType: this.config.pageType,
                performance: this.state.performanceMode,
                intensity: this.config.intensity
            });

            console.log('✨ Particles system initialized');
        } catch (error) {
            console.warn('Failed to initialize particles:', error);
        }
    }

    /**
     * Initialize hearts animation
     */
    async initializeHearts() {
        try {
            // Dynamic import
            const { HeartAnimationSystem } = await import('./HeartAnimationSystem.js');
            
            this.components.hearts = new HeartAnimationSystem({
                container: this.containers.hearts,
                pattern: 'floating',
                intensity: this.config.intensity,
                pageType: this.config.pageType
            });

            console.log('💖 Hearts animation initialized');
        } catch (error) {
            console.warn('Failed to initialize hearts:', error);
        }
    }

    /**
     * Initialize music player
     */
    async initializeMusic() {
        try {
            // Dynamic import
            const { MusicPlayerManager } = await import('../core/MusicPlayerManager.js');
            
            this.components.music = new MusicPlayerManager({
                autoplay: false, // Respect user preference
                volume: 0.3,
                crossPageSync: true,
                performance: this.state.performanceMode
            });

            console.log('🎵 Music player initialized');
        } catch (error) {
            console.warn('Failed to initialize music:', error);
        }
    }

    /**
     * Initialize bubbles animation
     */
    async initializeBubbles() {
        try {
            // Dynamic import
            const { BubbleAnimationSystem } = await import('./BubbleAnimationSystem.js');
            
            this.components.bubbles = new BubbleAnimationSystem({
                enableFloatingBubbles: true,
                enableBurstBubbles: true,
                pageType: this.config.pageType,
                performance: this.state.performanceMode,
                bubbleDensity: this.config.intensity
            });

            console.log('🫧 Bubbles animation initialized');
        } catch (error) {
            console.warn('Failed to initialize bubbles:', error);
        }
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor FPS and adjust quality accordingly
        let frameCount = 0;
        let lastTime = performance.now();

        const monitorPerformance = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) { // Check every second
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;

                // Adjust quality based on FPS
                if (fps < 30 && this.state.performanceMode !== 'low') {
                    this.adjustPerformanceMode('low');
                } else if (fps > 50 && this.state.performanceMode === 'low') {
                    this.adjustPerformanceMode('medium');
                }
            }

            if (this.state.isActive) {
                requestAnimationFrame(monitorPerformance);
            }
        };

        requestAnimationFrame(monitorPerformance);
    }

    /**
     * Adjust performance mode
     */
    adjustPerformanceMode(mode) {
        this.state.performanceMode = mode;

        // Notify all components of performance change
        Object.values(this.components).forEach(component => {
            if (component && component.setPerformanceMode) {
                component.setPerformanceMode(mode);
            }
        });

        console.log(`🎭 Performance mode adjusted to: ${mode}`);
    }

    /**
     * Event handlers
     */
    onVisibilityChange() {
        this.state.isPageVisible = !document.hidden;

        if (document.hidden) {
            this.pauseEffects();
        } else {
            this.resumeEffects();
        }
    }

    onResize() {
        // Notify components of resize
        Object.values(this.components).forEach(component => {
            if (component && component.handleResize) {
                component.handleResize();
            }
        });
    }

    onPerformanceChange(event) {
        if (event.detail && event.detail.mode) {
            this.adjustPerformanceMode(event.detail.mode);
        }
    }

    /**
     * Control methods
     */
    pauseEffects() {
        Object.values(this.components).forEach(component => {
            if (component && component.pause) {
                component.pause();
            }
        });
        console.log('🎭 Background effects paused');
    }

    resumeEffects() {
        Object.values(this.components).forEach(component => {
            if (component && component.resume) {
                component.resume();
            }
        });
        console.log('🎭 Background effects resumed');
    }

    /**
     * Toggle specific effects
     */
    toggleParticles() {
        if (this.components.particles) {
            this.components.particles.toggle();
        }
    }

    toggleHearts() {
        if (this.components.hearts) {
            this.components.hearts.toggle();
        }
    }

    toggleMusic() {
        if (this.components.music) {
            if (this.components.music.state.isPlaying) {
                this.components.music.pause();
            } else {
                this.components.music.play();
            }
        }
    }

    toggleBubbles() {
        if (this.components.bubbles) {
            this.components.bubbles.toggle();
        }
    }

    /**
     * Utility methods
     */
    detectPerformanceMode() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isLowEnd = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isLowEnd || isLowMemory || isMobile) {
            return 'low';
        } else if (navigator.hardwareConcurrency >= 8 && navigator.deviceMemory >= 8) {
            return 'high';
        } else {
            return 'medium';
        }
    }

    /**
     * Get component by name
     */
    getComponent(name) {
        return this.components[name];
    }

    /**
     * Check if component is active
     */
    isComponentActive(name) {
        const component = this.components[name];
        return component && component.state && component.state.isActive;
    }

    /**
     * Destroy background effects manager
     */
    destroy() {
        this.state.isActive = false;

        // Destroy all components
        Object.values(this.components).forEach(component => {
            if (component && component.destroy) {
                component.destroy();
            }
        });

        // Remove containers
        Object.values(this.containers).forEach(container => {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });

        // Remove event listeners
        document.removeEventListener('visibilitychange', this.boundHandlers.onVisibilityChange);
        window.removeEventListener('resize', this.boundHandlers.onResize);
        document.removeEventListener('performancechange', this.boundHandlers.onPerformanceChange);

        console.log('🎭 Background Effects Manager destroyed');
    }
}

// Export for module systems
export { BackgroundEffectsManager };

// Legacy export for backward compatibility
export { BackgroundEffectsManager as BackgroundComponents };
