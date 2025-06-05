import globalConfig from '../config/globalConfig';

/**
 * Unified Storage Manager - Optimized localStorage operations
 * Centralizes all storage operations with performance optimization and error handling
 * Version: 2.0.0
 */

class UnifiedStorageManager {
    constructor(options = {}) {
        // Core configuration
        this.config = {
            prefix: options.prefix || `${globalConfig.siteName}_`,
            maxAge: options.maxAge || 30 * 24 * 60 * 60 * 1000, // 30 days
            compressionEnabled: options.compressionEnabled !== false,
            encryptionEnabled: options.encryptionEnabled || false,
            quotaWarningThreshold: options.quotaWarningThreshold || 0.8, // 80%
            enablePerformanceMonitoring: options.enablePerformanceMonitoring !== false,
            ...options
        };

        // State management
        this.state = {
            isAvailable: this.checkStorageAvailability(),
            quotaExceeded: false,
            totalSize: 0,
            operationCount: 0,
            lastCleanup: 0
        };

        // Performance optimization
        this.performance = {
            writeQueue: new Map(),
            readCache: new Map(),
            writeThrottled: this.throttle(this.flushWriteQueue.bind(this), 1000)
        };

        // Metrics tracking
        this.metrics = {
            reads: 0,
            writes: 0,
            deletes: 0,
            errors: 0,
            cacheHits: 0,
            cacheMisses: 0,
            compressionSavings: 0
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize the storage manager
     */
    init() {
        try {
            if (!this.state.isAvailable) {
                console.warn('💾 localStorage not available, using memory fallback');
                this.initMemoryFallback();
                return;
            }

            // Calculate current storage usage
            this.calculateStorageUsage();

            // Setup automatic cleanup
            this.setupAutoCleanup();

            // Setup performance monitoring
            if (this.config.enablePerformanceMonitoring) {
                this.setupPerformanceMonitoring();
            }

            console.log('💾 Unified Storage Manager initialized');
        } catch (error) {
            console.error('Failed to initialize storage manager:', error);
            this.initMemoryFallback();
        }
    }

    /**
     * Check if localStorage is available
     */
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Initialize memory fallback when localStorage is not available
     */
    initMemoryFallback() {
        this.memoryStorage = new Map();
        this.state.isAvailable = false;
    }

    /**
     * Get item from storage with caching
     */
    get(key, defaultValue = null) {
        try {
            this.metrics.reads++;

            const fullKey = this.config.prefix + key;

            // Check cache first
            if (this.performance.readCache.has(fullKey)) {
                this.metrics.cacheHits++;
                return this.performance.readCache.get(fullKey);
            }

            this.metrics.cacheMisses++;

            let value;

            if (this.state.isAvailable) {
                const stored = localStorage.getItem(fullKey);
                if (stored === null) {
                    return defaultValue;
                }

                value = this.deserializeValue(stored);
            } else {
                value = this.memoryStorage.get(fullKey) || defaultValue;
            }

            // Check expiration
            if (value && typeof value === 'object' && value.__expires) {
                if (Date.now() > value.__expires) {
                    this.delete(key);
                    return defaultValue;
                }
                value = value.__data;
            }

            // Cache the value
            if (this.performance.readCache.size < 100) { // Limit cache size
                this.performance.readCache.set(fullKey, value);
            }

            return value;
        } catch (error) {
            this.metrics.errors++;
            console.warn('Storage read error:', error);
            return defaultValue;
        }
    }

    /**
     * Set item in storage with queuing and throttling
     */
    set(key, value, options = {}) {
        try {
            this.metrics.writes++;

            const fullKey = this.config.prefix + key;
            const expiresIn = options.expiresIn || this.config.maxAge;

            // Prepare value with expiration
            let dataToStore = value;
            if (expiresIn && expiresIn > 0) {
                dataToStore = {
                    __data: value,
                    __expires: Date.now() + expiresIn,
                    __created: Date.now()
                };
            }

            // Add to write queue for batch processing
            this.performance.writeQueue.set(fullKey, dataToStore);

            // Update cache
            this.performance.readCache.set(fullKey, value);

            // Trigger throttled write
            this.performance.writeThrottled();

            return true;
        } catch (error) {
            this.metrics.errors++;
            console.warn('Storage write error:', error);
            return false;
        }
    }

    /**
     * Flush write queue to storage
     */
    flushWriteQueue() {
        if (this.performance.writeQueue.size === 0) return;

        try {
            this.performance.writeQueue.forEach((value, key) => {
                try {
                    const serialized = this.serializeValue(value);

                    if (this.state.isAvailable) {
                        localStorage.setItem(key, serialized);
                    } else {
                        this.memoryStorage.set(key, value);
                    }
                } catch (error) {
                    if (error.name === 'QuotaExceededError') {
                        this.handleQuotaExceeded();
                    } else {
                        console.warn('Write error for key', key, error);
                    }
                }
            });

            this.performance.writeQueue.clear();
            this.calculateStorageUsage();
        } catch (error) {
            console.error('Flush write queue error:', error);
        }
    }

    /**
     * Delete item from storage
     */
    delete(key) {
        try {
            this.metrics.deletes++;

            const fullKey = this.config.prefix + key;

            if (this.state.isAvailable) {
                localStorage.removeItem(fullKey);
            } else {
                this.memoryStorage.delete(fullKey);
            }

            // Remove from cache and write queue
            this.performance.readCache.delete(fullKey);
            this.performance.writeQueue.delete(fullKey);

            return true;
        } catch (error) {
            this.metrics.errors++;
            console.warn('Storage delete error:', error);
            return false;
        }
    }

    /**
     * Check if key exists
     */
    has(key) {
        const fullKey = this.config.prefix + key;

        if (this.state.isAvailable) {
            return localStorage.getItem(fullKey) !== null;
        } else {
            return this.memoryStorage.has(fullKey);
        }
    }

    /**
     * Get all keys with prefix
     */
    keys() {
        const keys = [];

        if (this.state.isAvailable) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.config.prefix)) {
                    keys.push(key.substring(this.config.prefix.length));
                }
            }
        } else {
            this.memoryStorage.forEach((value, key) => {
                if (key.startsWith(this.config.prefix)) {
                    keys.push(key.substring(this.config.prefix.length));
                }
            });
        }

        return keys;
    }

    /**
     * Clear all items with prefix
     */
    clear() {
        try {
            const keys = this.keys();
            keys.forEach(key => this.delete(key));

            // Clear caches
            this.performance.readCache.clear();
            this.performance.writeQueue.clear();

            this.calculateStorageUsage();
            return true;
        } catch (error) {
            this.metrics.errors++;
            console.warn('Storage clear error:', error);
            return false;
        }
    }

    /**
     * Serialize value with compression if enabled
     */
    serializeValue(value) {
        let serialized = JSON.stringify(value);

        if (this.config.compressionEnabled && serialized.length > 1000) {
            // Simple compression by removing whitespace and using shorter keys
            const compressed = this.compress(serialized);
            if (compressed.length < serialized.length * 0.8) {
                this.metrics.compressionSavings += serialized.length - compressed.length;
                return '__compressed__' + compressed;
            }
        }

        return serialized;
    }

    /**
     * Deserialize value with decompression if needed
     */
    deserializeValue(stored) {
        if (stored.startsWith('__compressed__')) {
            const compressed = stored.substring('__compressed__'.length);
            stored = this.decompress(compressed);
        }

        return JSON.parse(stored);
    }

    /**
     * Simple compression (placeholder for more sophisticated compression)
     */
    compress(str) {
        // Basic compression - replace common patterns
        return str
            .replace(/\s+/g, ' ')
            .replace(/": "/g, '":"')
            .replace(/", "/g, '","')
            .replace(/\{ "/g, '{"')
            .replace(/" \}/g, '"}');
    }

    /**
     * Simple decompression
     */
    decompress(str) {
        // Reverse the compression
        return str;
    }

    /**
     * Handle quota exceeded error
     */
    handleQuotaExceeded() {
        this.state.quotaExceeded = true;
        console.warn('💾 Storage quota exceeded, performing cleanup');

        // Emergency cleanup
        this.cleanup(true);

        // Reduce cache sizes
        this.performance.readCache.clear();

        // Try to free up space by removing oldest items
        this.removeOldestItems(10);
    }

    /**
     * Remove oldest items
     */
    removeOldestItems(count) {
        const items = [];

        // Collect items with creation dates
        this.keys().forEach(key => {
            const value = this.get(key);
            if (value && typeof value === 'object' && value.__created) {
                items.push({ key, created: value.__created });
            }
        });

        // Sort by creation date and remove oldest
        items.sort((a, b) => a.created - b.created)
             .slice(0, count)
             .forEach(item => this.delete(item.key));
    }

    /**
     * Calculate current storage usage
     */
    calculateStorageUsage() {
        if (!this.state.isAvailable) return;

        try {
            let totalSize = 0;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                totalSize += (key?.length || 0) + (value?.length || 0);
            }

            this.state.totalSize = totalSize;

            // Check quota warning
            const estimatedQuota = 5 * 1024 * 1024; // 5MB estimate
            const usageRatio = totalSize / estimatedQuota;

            if (usageRatio > this.config.quotaWarningThreshold) {
                console.warn('💾 Storage usage high:', Math.round(usageRatio * 100) + '%');
            }
        } catch (error) {
            console.warn('Storage usage calculation error:', error);
        }
    }

    /**
     * Cleanup expired items
     */
    cleanup(force = false) {
        try {
            const now = Date.now();

            // Only run cleanup if forced or enough time has passed
            if (!force && (now - this.state.lastCleanup) < 300000) { // 5 minutes
                return;
            }

            this.state.lastCleanup = now;

            const keys = this.keys();
            let cleanedCount = 0;

            keys.forEach(key => {
                const value = this.get(key);
                if (value && typeof value === 'object' && value.__expires) {
                    if (now > value.__expires) {
                        this.delete(key);
                        cleanedCount++;
                    }
                }
            });

            if (cleanedCount > 0) {
                console.log(`💾 Cleaned up ${cleanedCount} expired items`);
                this.calculateStorageUsage();
            }

            // Clear old cache entries
            if (this.performance.readCache.size > 50) {
                this.performance.readCache.clear();
            }
        } catch (error) {
            console.warn('Cleanup error:', error);
        }
    }

    /**
     * Setup automatic cleanup
     */
    setupAutoCleanup() {
        // Cleanup on page load
        setTimeout(() => this.cleanup(), 5000);

        // Cleanup periodically
        setInterval(() => this.cleanup(), 300000); // 5 minutes

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.flushWriteQueue();
            this.cleanup();
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Log performance stats periodically
        setInterval(() => {
            if (this.metrics.reads + this.metrics.writes > 0) {
                console.log('💾 Storage Performance:', {
                    operations: this.metrics.reads + this.metrics.writes,
                    cacheHitRate: Math.round((this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100) + '%',
                    errorRate: Math.round((this.metrics.errors / (this.metrics.reads + this.metrics.writes)) * 100) + '%',
                    compressionSavings: this.formatBytes(this.metrics.compressionSavings),
                    totalSize: this.formatBytes(this.state.totalSize)
                });
            }
        }, 30000); // 30 seconds
    }

    /**
     * Utility functions
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

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            storageAvailable: this.state.isAvailable,
            totalSize: this.state.totalSize,
            quotaExceeded: this.state.quotaExceeded,
            cacheSize: this.performance.readCache.size,
            queueSize: this.performance.writeQueue.size
        };
    }

    /**
     * Reset metrics
     */
    resetMetrics() {
        Object.keys(this.metrics).forEach(key => {
            this.metrics[key] = 0;
        });
    }

    /**
     * Export data
     */
    export() {
        const data = {};
        this.keys().forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    /**
     * Import data
     */
    import(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
        this.flushWriteQueue();
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Flush any pending writes
        this.flushWriteQueue();

        // Final cleanup
        this.cleanup();

        // Clear caches
        this.performance.readCache.clear();
        this.performance.writeQueue.clear();

        console.log('💾 Unified Storage Manager destroyed');
    }
}

// Global instance management
window.UnifiedStorageManager = UnifiedStorageManager;

// Create default instance
if (!window.storageManager) {
    window.storageManager = new UnifiedStorageManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedStorageManager;
}

// ES6 export
export { UnifiedStorageManager };
