// Enhanced background effects initialization
class BackgroundEffectsManager {
  constructor(options = {}) {
    this.config = {
      pageType: options.pageType || 'default',
      intensity: options.intensity || 'medium',
      ...options,
    };

    this.state = {
      isInitialized: false,
      performanceMode: 'high',
    };

    this.components = {};
    this.init();
  }

  async init() {
    try {
      console.log('🎭 Initializing Background Effects Manager');

      this.setupContainers();
      this.setupEventListeners();

      await this.initializeComponents();

      this.state.isInitialized = true;
      console.log('🎭 Background Effects Manager initialized');
    } catch (error) {
      console.error('Failed to initialize background effects manager:', error);
    }
  }

  async initializeComponents() {
    await this.initializeParticles();
    await this.initializeHearts();
    await this.initializeMusic();
    await this.initializeBubbles();
  }

  async initializeParticles() {
    try {
      const { ParticleEffectSystem } = await import('./ParticleEffectSystem.js');
      this.components.particles = new ParticleEffectSystem({
        container: this.containers.particles,
        pageType: this.config.pageType,
        performance: this.state.performanceMode,
        intensity: this.config.intensity,
      });

      console.log('✨ Particles system initialized');
    } catch (error) {
      console.warn('Failed to initialize particles:', error);
    }
  }

  async initializeHearts() {
    try {
      const { HeartAnimationSystem } = await import('./HeartAnimationSystem.js');
      this.components.hearts = new HeartAnimationSystem({
        container: this.containers.hearts,
        pattern: 'floating',
        intensity: this.config.intensity,
        pageType: this.config.pageType,
      });

      console.log('💖 Hearts animation initialized');
    } catch (error) {
      console.warn('Failed to initialize hearts:', error);
    }
  }

  async initializeMusic() {
    try {
      const { MusicPlayer } = await import('../core/MusicPlayer.js');
      this.components.music = new MusicPlayer({
        autoplay: false,
        volume: 0.3,
        crossPageSync: true,
        performance: this.state.performanceMode,
      });

      console.log('🎵 Music player initialized');
    } catch (error) {
      console.warn('Failed to initialize music:', error);
    }
  }

  async initializeBubbles() {
    try {
      const { BubbleAnimationSystem } = await import('./BubbleAnimationSystem.js');
      this.components.bubbles = new BubbleAnimationSystem({
        enableFloatingBubbles: true,
        enableBurstBubbles: true,
        pageType: this.config.pageType,
        performance: this.state.performanceMode,
        bubbleDensity: this.config.intensity,
      });

      console.log('🫧 Bubbles animation initialized');
    } catch (error) {
      console.warn('Failed to initialize bubbles:', error);
    }
  }
}

export { BackgroundEffectsManager };