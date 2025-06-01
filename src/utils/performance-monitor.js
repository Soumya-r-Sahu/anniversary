/**
 * Performance Monitor for Anniversary Website
 * Monitors frame rate, memory usage, and performance metrics
 * Automatically adjusts quality settings for optimal performance
 */

class AnniversaryPerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.targetFPS = 90;
        this.performanceMode = 'auto';
        this.memoryThreshold = 50; // MB
        this.isMonitoring = false;
        
        // Performance statistics
        this.stats = {
            averageFPS: 60,
            minFPS: 60,
            maxFPS: 60,
            memoryUsage: 0,
            frameDrops: 0,
            totalFrames: 0
        };
        
        // Quality settings
        this.qualitySettings = {
            high: {
                particles: true,
                bubbles: true,
                hearts: true,
                music: true,
                glassmorphism: true,
                animations: 'full'
            },
            medium: {
                particles: true,
                bubbles: true,
                hearts: false,
                music: true,
                glassmorphism: true,
                animations: 'reduced'
            },
            low: {
                particles: false,
                bubbles: false,
                hearts: false,
                music: true,
                glassmorphism: false,
                animations: 'minimal'
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize performance monitoring
     */
    init() {
        this.detectDeviceCapabilities();
        this.startMonitoring();
        this.setupEventListeners();
        this.createPerformanceUI();
        
        console.log('🚀 Anniversary Performance Monitor initialized');
    }
    
    /**
     * Detect device capabilities
     */
    detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        this.deviceInfo = {
            gpu: gl ? gl.getParameter(gl.RENDERER) : 'Unknown',
            cores: navigator.hardwareConcurrency || 4,
            memory: navigator.deviceMemory || 4,
            connection: navigator.connection?.effectiveType || '4g',
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isLowEnd: navigator.deviceMemory < 4 || navigator.hardwareConcurrency < 4
        };
        
        console.log('📱 Device Info:', this.deviceInfo);
        
        // Set initial performance mode based on device
        if (this.deviceInfo.isLowEnd) {
            this.performanceMode = 'low';
        } else if (this.deviceInfo.memory >= 8 && this.deviceInfo.cores >= 8) {
            this.performanceMode = 'high';
        } else {
            this.performanceMode = 'medium';
        }
        
        this.applyQualitySettings();
    }
    
    /**
     * Start FPS monitoring
     */
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.monitorFrame();
        
        // Monitor memory usage every 5 seconds
        setInterval(() => {
            this.checkMemoryUsage();
        }, 5000);
    }
    
    /**
     * Monitor frame rate
     */
    monitorFrame() {
        if (!this.isMonitoring) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            
            // Update statistics
            this.updateStats();
            
            // Check if performance adjustment is needed
            this.checkPerformance();
            
            // Reset counters
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        this.frameCount++;
        this.stats.totalFrames++;
        
        requestAnimationFrame(() => this.monitorFrame());
    }
    
    /**
     * Update performance statistics
     */
    updateStats() {
        // Update FPS statistics
        this.stats.averageFPS = Math.round((this.stats.averageFPS + this.fps) / 2);
        this.stats.minFPS = Math.min(this.stats.minFPS, this.fps);
        this.stats.maxFPS = Math.max(this.stats.maxFPS, this.fps);
        
        // Count frame drops
        if (this.fps < this.targetFPS * 0.8) {
            this.stats.frameDrops++;
        }
        
        // Update UI
        this.updatePerformanceUI();
    }
    
    /**
     * Check memory usage
     */
    checkMemoryUsage() {
        if (performance.memory) {
            const memoryMB = performance.memory.usedJSHeapSize / 1024 / 1024;
            this.stats.memoryUsage = Math.round(memoryMB);
            
            // Memory warning
            if (memoryMB > this.memoryThreshold) {
                console.warn('⚠️ High memory usage detected:', memoryMB, 'MB');
                this.optimizeMemory();
            }
        }
    }
    
    /**
     * Check if performance adjustment is needed
     */
    checkPerformance() {
        const isLowPerformance = this.fps < this.targetFPS * 0.8;
        const hasFrameDrops = this.stats.frameDrops > 10;
        
        if (isLowPerformance || hasFrameDrops) {
            this.adjustQuality('down');
        } else if (this.fps > this.targetFPS && this.performanceMode !== 'high') {
            this.adjustQuality('up');
        }
    }
    
    /**
     * Adjust quality settings
     */
    adjustQuality(direction) {
        const modes = ['low', 'medium', 'high'];
        const currentIndex = modes.indexOf(this.performanceMode);
        
        let newIndex = currentIndex;
        if (direction === 'down' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'up' && currentIndex < modes.length - 1) {
            newIndex = currentIndex + 1;
        }
        
        if (newIndex !== currentIndex) {
            this.performanceMode = modes[newIndex];
            this.applyQualitySettings();
            console.log(`🎯 Performance mode adjusted to: ${this.performanceMode}`);
        }
    }
    
    /**
     * Apply quality settings based on performance mode
     */
    applyQualitySettings() {
        const settings = this.qualitySettings[this.performanceMode];
        
        // Apply particle settings
        this.toggleParticles(settings.particles);
        
        // Apply bubble settings
        this.toggleBubbles(settings.bubbles);
        
        // Apply heart animations
        this.toggleHearts(settings.hearts);
        
        // Apply glassmorphism effects
        this.toggleGlassmorphism(settings.glassmorphism);
        
        // Apply animation settings
        this.setAnimationLevel(settings.animations);
        
        // Notify other systems
        document.dispatchEvent(new CustomEvent('performanceModeChange', {
            detail: { mode: this.performanceMode, settings }
        }));
    }
    
    /**
     * Toggle particle effects
     */
    toggleParticles(enabled) {
        const particles = document.getElementById('particles-js');
        if (particles) {
            particles.style.display = enabled ? 'block' : 'none';
        }
    }
    
    /**
     * Toggle bubble animations
     */
    toggleBubbles(enabled) {
        const bubbles = document.querySelectorAll('.bubble, .floating-bubbles');
        bubbles.forEach(bubble => {
            bubble.style.display = enabled ? 'block' : 'none';
        });
    }
    
    /**
     * Toggle heart animations
     */
    toggleHearts(enabled) {
        const hearts = document.querySelectorAll('.heart-float, .floating-heart');
        hearts.forEach(heart => {
            heart.style.display = enabled ? 'block' : 'none';
        });
    }
    
    /**
     * Toggle glassmorphism effects
     */
    toggleGlassmorphism(enabled) {
        document.body.classList.toggle('no-glassmorphism', !enabled);
    }
    
    /**
     * Set animation level
     */
    setAnimationLevel(level) {
        document.body.classList.remove('animations-full', 'animations-reduced', 'animations-minimal');
        document.body.classList.add(`animations-${level}`);
    }
    
    /**
     * Optimize memory usage
     */
    optimizeMemory() {
        // Clear unused variables
        if (window.gc) {
            window.gc();
        }
        
        // Reduce quality temporarily
        this.adjustQuality('down');
        
        // Clear particle systems
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.remove();
            }
        });
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseMonitoring();
            } else {
                this.resumeMonitoring();
            }
        });
        
        // Resize optimization
        window.addEventListener('resize', this.throttle(() => {
            this.detectDeviceCapabilities();
        }, 1000));
    }
    
    /**
     * Create performance UI
     */
    createPerformanceUI() {
        // Only show in development mode
        if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
            const ui = document.createElement('div');
            ui.id = 'performance-monitor';
            ui.innerHTML = `
                <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; z-index: 10000;">
                    <div>FPS: <span id="fps-display">60</span></div>
                    <div>Avg: <span id="avg-fps">60</span></div>
                    <div>Memory: <span id="memory-display">0</span> MB</div>
                    <div>Mode: <span id="mode-display">auto</span></div>
                    <div>Drops: <span id="drops-display">0</span></div>
                </div>
            `;
            document.body.appendChild(ui);
        }
    }
    
    /**
     * Update performance UI
     */
    updatePerformanceUI() {
        const fpsDisplay = document.getElementById('fps-display');
        const avgDisplay = document.getElementById('avg-fps');
        const memoryDisplay = document.getElementById('memory-display');
        const modeDisplay = document.getElementById('mode-display');
        const dropsDisplay = document.getElementById('drops-display');
        
        if (fpsDisplay) fpsDisplay.textContent = this.fps;
        if (avgDisplay) avgDisplay.textContent = this.stats.averageFPS;
        if (memoryDisplay) memoryDisplay.textContent = this.stats.memoryUsage;
        if (modeDisplay) modeDisplay.textContent = this.performanceMode;
        if (dropsDisplay) dropsDisplay.textContent = this.stats.frameDrops;
    }
    
    /**
     * Pause monitoring
     */
    pauseMonitoring() {
        this.isMonitoring = false;
    }
    
    /**
     * Resume monitoring
     */
    resumeMonitoring() {
        if (!this.isMonitoring) {
            this.isMonitoring = true;
            this.lastTime = performance.now();
            this.frameCount = 0;
            this.monitorFrame();
        }
    }
    
    /**
     * Get performance report
     */
    getReport() {
        return {
            ...this.stats,
            currentFPS: this.fps,
            performanceMode: this.performanceMode,
            deviceInfo: this.deviceInfo,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize global performance monitor
window.performanceMonitor = new AnniversaryPerformanceMonitor();

// Export for module systems
export { AnniversaryPerformanceMonitor };
