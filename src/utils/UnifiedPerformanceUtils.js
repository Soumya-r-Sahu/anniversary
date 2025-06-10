/**
 * Anniversary Website v4.0.0 - Unified Performance Utilities
 * Consolidated throttle, debounce, and performance optimization functions
 * Replaces duplicate implementations across the codebase
 */

class UnifiedPerformanceUtils {
    constructor() {
        this.throttleTimers = new Map();
        this.debounceTimers = new Map();
        this.performanceMetrics = {
            throttleCalls: 0,
            debounceCalls: 0,
            optimizationRuns: 0,
            memoryUsage: 0
        };
        
        console.log('🚀 Unified Performance Utils v4.0.0 initialized');
    }

    /**
     * Professional throttle implementation
     * Ensures function is called at most once per specified interval
     */
    throttle(func, limit, context = null) {
        const key = func.toString() + limit;
        
        if (this.throttleTimers.has(key)) {
            return this.throttleTimers.get(key);
        }

        const throttledFunction = (...args) => {
            const now = Date.now();
            const lastRun = throttledFunction.lastRun || 0;
            
            if (now - lastRun >= limit) {
                throttledFunction.lastRun = now;
                this.performanceMetrics.throttleCalls++;
                return func.apply(context, args);
            }
        };

        this.throttleTimers.set(key, throttledFunction);
        return throttledFunction;
    }

    /**
     * Professional debounce implementation 
     * Delays function execution until after specified delay of inactivity
     */
    debounce(func, delay, immediate = false, context = null) {
        const key = func.toString() + delay;
        
        if (this.debounceTimers.has(key)) {
            return this.debounceTimers.get(key);
        }

        let timeout;
        const debouncedFunction = (...args) => {
            const callNow = immediate && !timeout;
            
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = null;
                if (!immediate) {
                    this.performanceMetrics.debounceCalls++;
                    func.apply(context, args);
                }
            }, delay);
            
            if (callNow) {
                this.performanceMetrics.debounceCalls++;
                func.apply(context, args);
            }
        };

        this.debounceTimers.set(key, debouncedFunction);
        return debouncedFunction;
    }

    /**
     * Animation frame throttle for smooth visual updates
     */
    animationThrottle(func, context = null) {
        let isScheduled = false;
        
        return (...args) => {
            if (!isScheduled) {
                isScheduled = true;
                requestAnimationFrame(() => {
                    isScheduled = false;
                    func.apply(context, args);
                });
            }
        };
    }

    /**
     * Optimized event listener management
     */
    optimizedEventListener(element, event, handler, options = {}) {
        const { throttle: throttleMs, debounce: debounceMs, passive = true } = options;
        
        let optimizedHandler = handler;
        
        if (throttleMs) {
            optimizedHandler = this.throttle(handler, throttleMs);
        } else if (debounceMs) {
            optimizedHandler = this.debounce(handler, debounceMs);
        }
        
        const listenerOptions = { passive, ...options };
        delete listenerOptions.throttle;
        delete listenerOptions.debounce;
        
        element.addEventListener(event, optimizedHandler, listenerOptions);
        
        return () => element.removeEventListener(event, optimizedHandler, listenerOptions);
    }

    /**
     * Memory-efficient observer pattern
     */
    createObserver(callback, options = {}) {
        const { throttle: throttleMs, debounce: debounceMs } = options;
        let optimizedCallback = callback;
        
        if (throttleMs) {
            optimizedCallback = this.throttle(callback, throttleMs);
        } else if (debounceMs) {
            optimizedCallback = this.debounce(callback, debounceMs);
        }
        
        return {
            observe: optimizedCallback,
            disconnect: () => {
                // Cleanup logic here
            }
        };
    }

    /**
     * Performance monitoring utilities
     */
    measurePerformance(name, func, context = null) {
        return (...args) => {
            const startTime = performance.now();
            const result = func.apply(context, args);
            const endTime = performance.now();
            
            console.log(`⏱️ ${name}: ${(endTime - startTime).toFixed(2)}ms`);
            
            return result;
        };
    }

    /**
     * Memory usage monitoring
     */
    monitorMemory() {
        if (performance.memory) {
            this.performanceMetrics.memoryUsage = {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
            
            return this.performanceMetrics.memoryUsage;
        }
        
        return null;
    }

    /**
     * Cleanup function to prevent memory leaks
     */
    cleanup() {
        this.throttleTimers.clear();
        this.debounceTimers.clear();
        this.performanceMetrics.optimizationRuns++;
        
        console.log('🧹 Performance utils cleaned up');
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            ...this.performanceMetrics,
            memory: this.monitorMemory(),
            activeThrottles: this.throttleTimers.size,
            activeDebounces: this.debounceTimers.size
        };
    }

    /**
     * Optimized scroll handler for smooth scrolling effects
     */
    smoothScrollHandler(callback, context = null) {
        let isScrolling = false;
        
        return this.throttle(() => {
            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(() => {
                    callback.call(context);
                    isScrolling = false;
                });
            }
        }, 16); // ~60fps
    }

    /**
     * Optimized resize handler
     */
    smartResizeHandler(callback, context = null) {
        return this.debounce(callback, 250, false, context);
    }

    /**
     * Intersection Observer with performance optimization
     */
    createIntersectionObserver(callback, options = {}) {
        const optimizedCallback = this.throttle(callback, 100);
        
        return new IntersectionObserver(optimizedCallback, {
            rootMargin: '50px',
            threshold: [0, 0.25, 0.5, 0.75, 1],
            ...options
        });
    }

    /**
     * Optimized animation utilities
     */
    createAnimationController() {
        let animationId = null;
        let isRunning = false;
        
        return {
            start: (callback) => {
                if (!isRunning) {
                    isRunning = true;
                    const animate = () => {
                        callback();
                        if (isRunning) {
                            animationId = requestAnimationFrame(animate);
                        }
                    };
                    animate();
                }
            },
            
            stop: () => {
                isRunning = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            },
            
            isRunning: () => isRunning
        };
    }
}

// Create global instance
const performanceUtils = new UnifiedPerformanceUtils();

// Global access
window.performanceUtils = performanceUtils;
window.UnifiedPerformanceUtils = UnifiedPerformanceUtils;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedPerformanceUtils;
}

export { UnifiedPerformanceUtils };
export default performanceUtils;
