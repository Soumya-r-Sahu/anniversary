/**
 * Anniversary Website Data Management System - Enhanced v4.0.0
 * Dark Theme Support, Content-Focused Architecture, Performance Optimized
 * Unified Data Layer with Intelligent Caching and Real-time Updates
 */

class DataManager {
    constructor() {
        this.storageKey = 'anniversary_v4_data';
        this.backupKey = 'anniversary_v4_backup';
        this.themeKey = 'anniversary_v4_theme';
        this.version = '4.0.0';
        
        // Performance optimization
        this.cache = new Map();
        this.cacheTTL = 300000; // 5 minutes
        this.subscribers = new Map();
        
        // Initialize theme (default to dark)
        this.initializeTheme();
        
        // Initialize data structure
        this.defaultData = this.createOptimizedDataStructure();
        this.data = this.loadData();
        
        // Performance monitoring
        this.performanceMetrics = {
            loadTime: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
        
        // Auto-optimize on init
        this.optimizePerformance();
        
        console.log('🚀 Enhanced Data Manager v4.0.0 initialized');
    }

    /**
     * Initialize theme system with dark as default
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        const theme = savedTheme || 'dark'; // Default to dark theme
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.themeKey, theme);
        
        // Apply theme classes to body for better styling
        if (document.body) {
            document.body.className = `theme-${theme} anniversary-app`;
        }
    }

    /**
     * Create optimized data structure with content-focused naming
     */
    createOptimizedDataStructure() {
        return {
            version: this.version,
            lastUpdated: new Date().toISOString(),
            theme: 'dark',
            
            // Core relationship data
            relationship: {
                partners: {
                    soumya: {
                        name: "Soumya", 
                        nickname: "Mankada",
                        role: "beloved",
                        theme_color: "#ec4899"
                    },
                    puja: {
                        name: "Puja",
                        nickname: "Jerry", 
                        role: "sweetheart",
                        theme_color: "#8b5cf6"
                    }
                },
                timeline: {
                    start_date: "2024-06-16",
                    anniversary_date: "2025-06-16", 
                    milestone_months: [1, 3, 6, 12],
                    current_phase: "deepening_love"
                }
            },

            // Content-focused memory system
            memories: {
                moments: [
                    {
                        id: "first_hello",
                        date: "2024-06-16",
                        title: "First Sweet Message 💌",
                        content: "The very first message that started our beautiful journey together.",
                        emotion: "joy",
                        significance: 10,
                        tags: ["beginning", "first_contact", "milestone"],
                        is_favorite: true
                    },
                    {
                        id: "first_love_confession", 
                        date: "2024-06-19",
                        title: "First 'I Love You' 💕",
                        content: "During our amazing 3-hour phone call, when you said 'Love you' for the first time.",
                        emotion: "euphoria",
                        significance: 10,
                        tags: ["love", "confession", "phone_call"],
                        is_favorite: true
                    }
                ],
                categories: ["milestones", "daily_joys", "deep_connections", "future_dreams"],
                emotional_palette: ["joy", "love", "excitement", "contentment", "euphoria"]
            },

            // Visual content system
            media: {
                photos: [
                    {
                        id: "memory_snapshot_001",
                        title: "Our First Meeting",
                        description: "The day our hearts first connected",
                        emotion: "magical",
                        date: "2024-06-16",
                        is_favorite: true
                    }
                ],
                galleries: {
                    "special_moments": { name: "Special Moments", count: 0 },
                    "daily_life": { name: "Daily Life Together", count: 0 },
                    "future_plans": { name: "Dreams & Plans", count: 0 }
                }
            },

            // Communication archive
            messages: {
                love_letters: [
                    {
                        id: "five_month_letter",
                        date: "2024-11-16", 
                        title: "5 Month Anniversary Letter",
                        content: "My beautiful Puja, as we celebrate 5 wonderful months together...",
                        from: "soumya",
                        to: "puja",
                        emotion: "romantic"
                    }
                ],
                daily_affirmations: [
                    "You are my sunshine",
                    "Every day with you is a gift", 
                    "You make my heart complete"
                ],
                sweet_names: ["Jerry", "Mankada", "My Love", "Sweetheart", "Beautiful"]
            },

            // Experience planning
            plans: {
                future_dreams: [
                    {
                        id: "weekend_getaway",
                        title: "Romantic Weekend Together",
                        description: "A perfect weekend just for us",
                        priority: "high",
                        emotion: "excitement",
                        status: "dreaming"
                    }
                ],
                bucket_list: [],
                special_dates: [
                    {
                        id: "monthly_celebration",
                        name: "Monthly Anniversary",
                        date: "16th of every month",
                        type: "recurring",
                        celebration_ideas: ["special dinner", "love letter", "memory sharing"]
                    }
                ]
            },

            // App preferences
            settings: {
                theme: "dark",
                animations: true,
                auto_music: true,
                notifications: true,
                privacy_mode: false,
                content_focus: "romantic_emphasis"
            },

            // Analytics for optimization
            usage: {
                total_memories: 2,
                total_photos: 1, 
                total_letters: 1,
                days_together: 0, // Will be calculated
                last_visit: new Date().toISOString(),
                favorite_features: ["memories", "countdown", "love_letters"]
            }
        };
    }

    /**
     * Calculate days together with performance optimization
     */
    calculateDaysTogether(startDate) {
        const start = new Date(startDate);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Load data with intelligent caching
     */
    loadData() {
        const startTime = performance.now();
        
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsedData = JSON.parse(stored);
                this.performanceMetrics.cacheHits++;
                this.performanceMetrics.loadTime = performance.now() - startTime;
                return this.mergeWithDefaults(parsedData);
            }
        } catch (error) {
            console.warn('Error loading stored data:', error);
        }
        
        this.performanceMetrics.cacheMisses++;
        this.performanceMetrics.loadTime = performance.now() - startTime;
        const data = this.defaultData;
        data.usage.days_together = this.calculateDaysTogether("2024-06-16");
        return data;
    }

    /**
     * Merge with defaults ensuring all fields exist
     */
    mergeWithDefaults(storedData) {
        const merged = { ...this.defaultData };
        
        // Deep merge stored data
        Object.keys(storedData).forEach(key => {
            if (typeof storedData[key] === 'object' && !Array.isArray(storedData[key])) {
                merged[key] = { ...merged[key], ...storedData[key] };
            } else {
                merged[key] = storedData[key];
            }
        });

        return merged;
    }

    /**
     * Save data with performance tracking
     */
    saveData() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            this.data.usage.last_visit = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    /**
     * Theme management
     */
    setTheme(theme) {
        this.data.theme = theme;
        this.data.settings.theme = theme;
        
        document.documentElement.setAttribute('data-theme', theme);
        if (document.body) {
            document.body.className = `theme-${theme} anniversary-app`;
        }
        
        localStorage.setItem(this.themeKey, theme);
        this.saveData();
        
        this.notifySubscribers('theme_changed', theme);
    }

    getTheme() {
        return this.data.theme || 'dark';
    }

    /**
     * Content-focused memory management
     */
    addMemory(memoryData) {
        const memory = {
            id: `memory_${Date.now()}`,
            date: memoryData.date || new Date().toISOString().split('T')[0],
            title: memoryData.title || "New Memory",
            content: memoryData.content || "",
            emotion: memoryData.emotion || "joy",
            significance: memoryData.significance || 5,
            tags: memoryData.tags || [],
            is_favorite: memoryData.is_favorite || false
        };
        
        this.data.memories.moments.push(memory);
        this.data.usage.total_memories = this.data.memories.moments.length;
        this.saveData();
        
        this.notifySubscribers('memory_added', memory);
        return memory;
    }

    getMemories(filter = {}) {
        let memories = this.data.memories.moments;
        
        if (filter.emotion) {
            memories = memories.filter(m => m.emotion === filter.emotion);
        }
        
        if (filter.is_favorite) {
            memories = memories.filter(m => m.is_favorite);
        }
        
        if (filter.tags && filter.tags.length > 0) {
            memories = memories.filter(m => 
                filter.tags.some(tag => m.tags.includes(tag))
            );
        }
        
        return memories.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * Performance optimization
     */
    optimizePerformance() {
        // Clean old cache entries
        setInterval(() => {
            this.cleanCache();
        }, this.cacheTTL);
        
        // Auto-save every 5 minutes
        setInterval(() => {
            this.saveData();
        }, 300000);
        
        // Memory usage monitoring
        this.monitorMemoryUsage();
    }

    cleanCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.cacheTTL) {
                this.cache.delete(key);
            }
        }
    }

    monitorMemoryUsage() {
        if (performance.memory) {
            const memInfo = performance.memory;
            if (memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.8) {
                console.warn('High memory usage detected, optimizing...');
                this.cleanCache();
            }
        }
    }

    /**
     * Subscriber pattern for real-time updates
     */
    subscribe(eventType, callback) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType).push(callback);
    }

    notifySubscribers(eventType, data) {
        const callbacks = this.subscribers.get(eventType) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in subscriber callback for ${eventType}:`, error);
            }
        });
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            cacheSize: this.cache.size,
            totalMemories: this.data.usage.total_memories,
            totalPhotos: this.data.usage.total_photos,
            daysActive: this.data.usage.days_together
        };
    }

    /**
     * Export data for backup
     */
    exportData() {
        const exportData = {
            exportDate: new Date().toISOString(),
            version: this.version,
            data: this.data,
            metrics: this.getPerformanceMetrics()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anniversary-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Get all data for debugging
     */
    getAllData() {
        return this.data;
    }

    /**
     * Class and ID content-focused naming utilities
     */
    generateContentFocusedId(content) {
        // Generate meaningful IDs based on content
        return content.toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .substring(0, 50);
    }

    generateContentFocusedClass(type, emotion, significance) {
        // Generate semantic CSS classes
        const classes = [`${type}_content`];
        
        if (emotion) {
            classes.push(`emotion_${emotion}`);
        }
        
        if (significance >= 8) {
            classes.push('high_significance');
        } else if (significance >= 5) {
            classes.push('medium_significance');
        } else {
            classes.push('low_significance');
        }
        
        return classes.join(' ');
    }
}

// Initialize global instance
window.dataManager = new DataManager();
window.DataManager = DataManager;

// Auto-initialize theme
document.addEventListener('DOMContentLoaded', () => {
    if (window.dataManager) {
        window.dataManager.initializeTheme();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}

console.log('💖 Enhanced Anniversary Data Manager v4.0.0 Ready!');
