/**
 * UI Performance Integrator
 * Integrates performance monitoring with UIControlSystem
 * Version: 1.0.0
 */

class UIPerformanceIntegrator {
    constructor() {
        this.performanceData = {
            musicStateUpdates: 0,
            notificationCount: 0,
            renderTime: 0,
            memoryUsage: 0
        };
        
        this.isMonitoring = false;
        this.monitoringInterval = null;
        
        this.init();
    }

    /**
     * Initialize performance monitoring
     */
    init() {
        // Start monitoring when UIControlSystem is available
        document.addEventListener('DOMContentLoaded', () => {
            this.startMonitoring();
        });

        // Monitor page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseMonitoring();
            } else {
                this.resumeMonitoring();
            }
        });
    }

    /**
     * Start performance monitoring
     */
    startMonitoring() {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        console.log('🔍 UI Performance monitoring started');

        // Monitor every 5 seconds
        this.monitoringInterval = setInterval(() => {
            this.collectPerformanceData();
        }, 5000);

        // Monitor music state update frequency
        this.monitorMusicStateUpdates();
        
        // Monitor DOM mutations for performance impact
        this.monitorDOMMutations();
    }

    /**
     * Pause performance monitoring
     */
    pauseMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.isMonitoring = false;
        console.log('⏸️ UI Performance monitoring paused');
    }

    /**
     * Resume performance monitoring
     */
    resumeMonitoring() {
        if (!this.isMonitoring) {
            this.startMonitoring();
            console.log('▶️ UI Performance monitoring resumed');
        }
    }

    /**
     * Collect performance data
     */
    collectPerformanceData() {
        // Collect memory usage
        if (window.performance && window.performance.memory) {
            this.performanceData.memoryUsage = window.performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        }

        // Collect FPS data
        this.measureFPS((fps) => {
            this.performanceData.fps = fps;
            
            // Warn if performance is degrading
            if (fps < 30) {
                console.warn('⚠️ Low FPS detected:', fps);
                this.optimizePerformance();
            }
        });

        // Log performance summary every minute
        if (this.performanceData.musicStateUpdates % 12 === 0) {
            this.logPerformanceSummary();
        }
    }

    /**
     * Monitor music state updates
     */
    monitorMusicStateUpdates() {
        // Patch UIControlSystem methods to track updates
        if (window.uiControlSystem) {
            const originalUpdateMethod = window.uiControlSystem.updateMusicControlState;
            window.uiControlSystem.updateMusicControlState = (...args) => {
                this.performanceData.musicStateUpdates++;
                
                const startTime = performance.now();
                const result = originalUpdateMethod.apply(window.uiControlSystem, args);
                const endTime = performance.now();
                
                this.performanceData.renderTime += endTime - startTime;
                
                return result;
            };
        }
    }

    /**
     * Monitor DOM mutations for performance impact
     */
    monitorDOMMutations() {
        if (!window.MutationObserver) return;

        const observer = new MutationObserver((mutations) => {
            let significantChanges = 0;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if it's a UI control related change
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && 
                            (node.classList?.contains('ui-notification') || 
                             node.classList?.contains('ui-control-panel'))) {
                            significantChanges++;
                        }
                    }
                }
            });

            if (significantChanges > 3) {
                console.warn('⚠️ High DOM mutation rate detected in UI controls');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Measure FPS using requestAnimationFrame
     */
    measureFPS(callback) {
        let frames = 0;
        let startTime = performance.now();
        
        const measureFrame = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime - startTime >= 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - startTime));
                callback(fps);
                
                // Reset for next measurement
                frames = 0;
                startTime = currentTime;
            }
            
            requestAnimationFrame(measureFrame);
        };
        
        requestAnimationFrame(measureFrame);
    }

    /**
     * Optimize performance when issues are detected
     */
    optimizePerformance() {
        console.log('🔧 Applying performance optimizations...');

        // Reduce music state update frequency
        if (window.uiControlSystem && window.uiControlSystem.musicStateUpdateInterval) {
            clearInterval(window.uiControlSystem.musicStateUpdateInterval);
            window.uiControlSystem.musicStateUpdateInterval = setInterval(() => {
                window.uiControlSystem.updateMusicControlState();
            }, 1000); // Reduce from 500ms to 1000ms
        }

        // Throttle notifications
        if (window.uiControlSystem) {
            const originalShowNotification = window.uiControlSystem.showNotification;
            let lastNotificationTime = 0;
            
            window.uiControlSystem.showNotification = function(message, type) {
                const now = Date.now();
                if (now - lastNotificationTime < 2000) {
                    return; // Skip notification if too frequent
                }
                lastNotificationTime = now;
                return originalShowNotification.call(this, message, type);
            };
        }

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * Log performance summary
     */
    logPerformanceSummary() {
        console.group('📊 UI Performance Summary');
        console.log('Music State Updates:', this.performanceData.musicStateUpdates);
        console.log('Notifications Shown:', this.performanceData.notificationCount);
        console.log('Average Render Time:', (this.performanceData.renderTime / this.performanceData.musicStateUpdates).toFixed(2), 'ms');
        console.log('Memory Usage:', this.performanceData.memoryUsage.toFixed(2), 'MB');
        
        if (this.performanceData.fps) {
            console.log('Current FPS:', this.performanceData.fps);
        }
        
        console.groupEnd();
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        return {
            ...this.performanceData,
            timestamp: new Date().toISOString(),
            isOptimal: this.performanceData.fps > 45 && this.performanceData.memoryUsage < 50
        };
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        this.pauseMonitoring();
        console.log('🧹 UI Performance Integrator cleaned up');
    }
}

// Auto-initialize
if (typeof window !== 'undefined') {
    window.uiPerformanceIntegrator = new UIPerformanceIntegrator();
}

export { UIPerformanceIntegrator };
