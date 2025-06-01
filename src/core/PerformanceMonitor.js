/**
 * Performance Monitor
 * Comprehensive performance tracking and optimization system
 * Renamed from UnifiedPerformanceMonitor for clarity
 * Version: 2.0.0
 */

class PerformanceMonitor {
    constructor(options = {}) {
        // Core configuration
        this.config = {
            enableMonitoring: options.enableMonitoring !== false,
            enableOptimization: options.enableOptimization !== false,
            enableLogging: options.enableLogging !== false,
            logInterval: options.logInterval || 30000, // 30 seconds
            performanceThresholds: {
                fps: options.minFPS || 30,
                memoryUsage: options.maxMemoryMB || 100,
                domNodes: options.maxDOMNodes || 1000,
                loadTime: options.maxLoadTimeMS || 3000,
                ...options.performanceThresholds
            },
            targetFPS: options.targetFPS || 60,
            enableGPUAcceleration: options.enableGPUAcceleration !== false,
            optimizeAnimations: options.optimizeAnimations !== false,
            ...options
        };

        // Performance metrics
        this.metrics = {
            // Core Web Vitals
            fcp: 0, // First Contentful Paint
            lcp: 0, // Largest Contentful Paint
            fid: 0, // First Input Delay
            cls: 0, // Cumulative Layout Shift

            // Custom metrics
            fps: 0,
            averageFPS: 0,
            frameTime: 0,
            memoryUsage: 0,
            domNodes: 0,
            eventListeners: 0,

            // Performance counters
            frameCount: 0,
            totalFrameTime: 0,
            lastFrameTime: 0,

            // Component metrics
            musicManager: { cpu: 0, memory: 0 },
            heartAnimation: { cpu: 0, memory: 0 },
            particles: { cpu: 0, memory: 0 },
            gallery: { cpu: 0, memory: 0 }
        };

        // Performance state
        this.state = {
            isMonitoring: false,
            performanceMode: 'auto', // 'high', 'medium', 'low', 'auto'
            isLowPowerDevice: this.detectLowPowerDevice(),
            isSlowConnection: this.detectSlowConnection(),
            batteryLevel: null,
            thermalState: null
        };

        // Monitoring intervals
        this.intervals = {
            frameMonitor: null,
            metricsLogger: null,
            optimizationCheck: null
        };

        // Performance observers
        this.observers = {
            performance: null,
            mutation: null,
            intersection: null
        };

        // Component references for optimization
        this.components = {
            musicManager: null,
            heartAnimation: null,
            particles: null,
            gallery: null
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize performance monitoring
     */
    init() {
        try {
            if (!this.config.enableMonitoring) return;

            // Setup device capability detection
            this.detectDeviceCapabilities();

            // Setup performance observers
            this.setupPerformanceObservers();

            // Setup frame monitoring
            this.setupFrameMonitoring();

            // Setup metric logging
            this.setupMetricLogging();

            // Setup optimization checks
            this.setupOptimizationChecks();

            // Setup battery and thermal monitoring
            this.setupBatteryMonitoring();

            // Start monitoring
            this.start();

            console.log('📊 Performance Monitor initialized');
        } catch (error) {
            console.error('Failed to initialize performance monitor:', error);
        }
    }

    /**
     * Detect device capabilities
     */
    detectDeviceCapabilities() {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Determine performance mode
        if (cores >= 8 && memory >= 8 && !isMobile) {
            this.state.performanceMode = 'high';
        } else if (cores >= 4 && memory >= 4) {
            this.state.performanceMode = 'medium';
        } else {
            this.state.performanceMode = 'low';
        }

        console.log('📊 Device capabilities:', {
            cores,
            memory: memory + 'GB',
            mode: this.state.performanceMode,
            mobile: isMobile,
            connection: connection?.effectiveType || 'unknown'
        });
    }

    /**
     * Setup performance observers
     */
    setupPerformanceObservers() {
        // Performance Observer for Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                this.observers.performance = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.processPerformanceEntry(entry);
                    }
                });

                // Observe various performance metrics
                this.observers.performance.observe({ entryTypes: ['navigation', 'paint', 'layout-shift', 'first-input'] });
            } catch (error) {
                console.warn('Performance Observer not supported:', error);
            }
        }

        // Mutation Observer for DOM changes
        this.observers.mutation = new MutationObserver((mutations) => {
            this.metrics.domNodes = document.querySelectorAll('*').length;
            
            // Check for performance impact
            if (mutations.length > 10) {
                this.optimizeDOM();
            }
        });

        this.observers.mutation.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    /**
     * Setup frame monitoring for FPS tracking
     */
    setupFrameMonitoring() {
        let lastTime = performance.now();
        
        const measureFrame = (currentTime) => {
            if (!this.state.isMonitoring) return;

            const deltaTime = currentTime - lastTime;
            this.metrics.frameTime = deltaTime;
            this.metrics.fps = 1000 / deltaTime;
            
            // Update average FPS
            this.metrics.frameCount++;
            this.metrics.totalFrameTime += deltaTime;
            this.metrics.averageFPS = 1000 / (this.metrics.totalFrameTime / this.metrics.frameCount);

            // Check for performance issues
            if (this.metrics.fps < this.config.performanceThresholds.fps) {
                this.handleLowFPS();
            }

            lastTime = currentTime;
            this.intervals.frameMonitor = requestAnimationFrame(measureFrame);
        };

        this.intervals.frameMonitor = requestAnimationFrame(measureFrame);
    }

    /**
     * Setup metric logging
     */
    setupMetricLogging() {
        this.intervals.metricsLogger = setInterval(() => {
            this.updateMetrics();
            this.logMetrics();
        }, this.config.logInterval);
    }

    /**
     * Setup optimization checks
     */
    setupOptimizationChecks() {
        this.intervals.optimizationCheck = setInterval(() => {
            this.checkPerformanceThresholds();
            this.optimizeIfNeeded();
        }, 10000); // Check every 10 seconds
    }

    /**
     * Setup battery and thermal monitoring
     */
    setupBatteryMonitoring() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.state.batteryLevel = battery.level;
                
                battery.addEventListener('levelchange', () => {
                    this.state.batteryLevel = battery.level;
                    
                    // Adjust performance mode based on battery
                    if (battery.level < 0.2) {
                        this.state.performanceMode = 'low';
                        this.optimizeForBattery();
                    }
                });
            });
        }
    }

    /**
     * Start monitoring
     */
    start() {
        this.state.isMonitoring = true;
        console.log('📊 Performance monitoring started');
    }

    /**
     * Stop monitoring
     */
    stop() {
        this.state.isMonitoring = false;
        
        // Clear intervals
        if (this.intervals.frameMonitor) {
            cancelAnimationFrame(this.intervals.frameMonitor);
        }
        if (this.intervals.metricsLogger) {
            clearInterval(this.intervals.metricsLogger);
        }
        if (this.intervals.optimizationCheck) {
            clearInterval(this.intervals.optimizationCheck);
        }

        // Disconnect observers
        if (this.observers.performance) {
            this.observers.performance.disconnect();
        }
        if (this.observers.mutation) {
            this.observers.mutation.disconnect();
        }

        console.log('📊 Performance monitoring stopped');
    }

    /**
     * Process performance entry
     */
    processPerformanceEntry(entry) {
        switch (entry.entryType) {
            case 'paint':
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = entry.startTime;
                }
                break;
            case 'largest-contentful-paint':
                this.metrics.lcp = entry.startTime;
                break;
            case 'first-input':
                this.metrics.fid = entry.processingStart - entry.startTime;
                break;
            case 'layout-shift':
                if (!entry.hadRecentInput) {
                    this.metrics.cls += entry.value;
                }
                break;
        }
    }

    /**
     * Update metrics
     */
    updateMetrics() {
        // Memory usage
        if (performance.memory) {
            this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
        }

        // DOM complexity
        this.metrics.domNodes = document.querySelectorAll('*').length;
        this.metrics.eventListeners = this.estimateEventListeners();
    }

    /**
     * Estimate event listeners
     */
    estimateEventListeners() {
        const elementsWithEvents = document.querySelectorAll('*[onclick], *[onload], *[onmouseover]');
        return elementsWithEvents.length;
    }

    /**
     * Detect low power device
     */
    detectLowPowerDevice() {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return cores < 4 || memory < 4 || isMobile;
    }

    /**
     * Detect slow connection
     */
    detectSlowConnection() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    }

    /**
     * Handle low FPS
     */
    handleLowFPS() {
        console.warn('📊 Low FPS detected, optimizing...');
        this.optimizeForPerformance();
    }

    /**
     * Optimize for performance
     */
    optimizeForPerformance() {
        // Reduce animation quality
        document.body.classList.add('performance-mode');
        
        // Notify components to reduce quality
        Object.values(this.components).forEach(component => {
            if (component && component.reduceQuality) {
                component.reduceQuality();
            }
        });
    }

    /**
     * Log metrics
     */
    logMetrics() {
        if (!this.config.enableLogging) return;

        const summary = {
            fps: Math.round(this.metrics.averageFPS),
            memory: Math.round(this.metrics.memoryUsage) + 'MB',
            domNodes: this.metrics.domNodes,
            mode: this.state.performanceMode,
            battery: this.state.batteryLevel ? Math.round(this.state.batteryLevel * 100) + '%' : 'unknown'
        };

        console.log('📊 Performance Summary:', summary);
    }

    /**
     * Register component for monitoring
     */
    registerComponent(name, component) {
        this.components[name] = component;
        console.log(`📊 Registered component: ${name}`);
    }

    /**
     * Destroy performance monitor
     */
    destroy() {
        this.stop();
        console.log('📊 Performance Monitor destroyed');
    }
}

// Export for module systems
export { PerformanceMonitor };

// Legacy export for backward compatibility
export { PerformanceMonitor as UnifiedPerformanceMonitor };
