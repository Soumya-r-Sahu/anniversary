/**
 * Anniversary Website Data Management System
 * Intelligent JSON Database with Caching, Validation, and Real-time Updates
 * Version: 4.0.0
 */

class AnniversaryDataManager {
    constructor() {
        this.cache = new Map();
        this.cacheTTL = new Map(); // Time to live for cache entries
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
        this.baseURL = '/assets/json/';
        this.dataFiles = {
            personal: 'personal-data.json',
            messages: 'messages-data.json',
            photos: 'photo-data.json',
            music: 'music-data.json',
            memories: 'memory-data.json',
            plans: 'plans-data.json'
        };
        this.loadingStates = new Map();
        this.errorHandlers = new Map();
        this.updateListeners = new Map();
        
        // Initialize data validation schemas
        this.initValidationSchemas();
        
        // Setup auto-save for user generated content
        this.setupAutoSave();
        
        console.log('🎯 Anniversary Data Manager v4.0.0 initialized');
    }

    /**
     * Initialize validation schemas for data integrity
     */
    initValidationSchemas() {
        this.schemas = {
            personal: {
                required: ['couple', 'relationship', 'shared'],
                types: {
                    'couple.person1': 'object',
                    'couple.person2': 'object',
                    'relationship.anniversary.date': 'string'
                }
            },
            messages: {
                required: ['messages', 'love_quotes'],
                types: {
                    'messages': 'array',
                    'love_quotes': 'array'
                }
            },
            photos: {
                required: ['galleries', 'photos', 'albums'],
                types: {
                    'photos': 'array',
                    'albums': 'array'
                }
            },
            music: {
                required: ['playlists', 'tracks'],
                types: {
                    'playlists': 'array',
                    'tracks': 'array'
                }
            },
            memories: {
                required: ['memories', 'categories'],
                types: {
                    'memories': 'array',
                    'categories': 'array'
                }
            },
            plans: {
                required: ['future_plans', 'wish_list', 'special_dates'],
                types: {
                    'future_plans': 'array',
                    'wish_list': 'array',
                    'special_dates': 'array'
                }
            }
        };
    }

    /**
     * Load data with intelligent caching and error handling
     */
    async loadData(dataType, forceRefresh = false) {
        const cacheKey = `data_${dataType}`;
        
        // Check cache first (unless force refresh)
        if (!forceRefresh && this.isCacheValid(cacheKey)) {
            console.log(`📋 Loading ${dataType} from cache`);
            return this.cache.get(cacheKey);
        }

        // Set loading state
        this.loadingStates.set(dataType, true);

        try {
            const fileName = this.dataFiles[dataType];
            if (!fileName) {
                throw new Error(`Unknown data type: ${dataType}`);
            }

            console.log(`🔄 Fetching ${dataType} data from ${fileName}`);
            const response = await fetch(`${this.baseURL}${fileName}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Validate data structure
            if (!this.validateData(dataType, data)) {
                throw new Error(`Invalid data structure for ${dataType}`);
            }

            // Cache the data
            this.cache.set(cacheKey, data);
            this.cacheTTL.set(cacheKey, Date.now() + this.defaultTTL);
            
            // Notify listeners
            this.notifyListeners(dataType, 'loaded', data);
            
            console.log(`✅ ${dataType} data loaded successfully`);
            return data;

        } catch (error) {
            console.error(`❌ Error loading ${dataType}:`, error);
            this.handleError(dataType, error);
            
            // Return cached data if available, otherwise return mock data
            return this.cache.get(cacheKey) || this.getMockData(dataType);
            
        } finally {
            this.loadingStates.set(dataType, false);
        }
    }

    /**
     * Get all data with intelligent preloading
     */
    async loadAllData() {
        console.log('🚀 Loading all anniversary data...');
        const startTime = performance.now();
        
        const dataPromises = Object.keys(this.dataFiles).map(dataType => 
            this.loadData(dataType).catch(error => {
                console.warn(`⚠️ Failed to load ${dataType}:`, error);
                return this.getMockData(dataType);
            })
        );

        try {
            const results = await Promise.all(dataPromises);
            const loadTime = (performance.now() - startTime).toFixed(2);
            
            console.log(`🎉 All data loaded in ${loadTime}ms`);
            
            // Return organized data object
            return Object.keys(this.dataFiles).reduce((acc, dataType, index) => {
                acc[dataType] = results[index];
                return acc;
            }, {});
            
        } catch (error) {
            console.error('❌ Error loading all data:', error);
            throw error;
        }
    }

    /**
     * Smart data filtering and search
     */
    searchData(dataType, query, options = {}) {
        const data = this.cache.get(`data_${dataType}`);
        if (!data) {
            console.warn(`No cached data for ${dataType}`);
            return [];
        }

        const {
            fields = ['title', 'description', 'content', 'tags'],
            caseSensitive = false,
            exactMatch = false,
            limit = 10
        } = options;

        const searchTerm = caseSensitive ? query : query.toLowerCase();
        const results = [];

        // Search function
        const searchInData = (items, searchFields) => {
            if (!Array.isArray(items)) return;

            items.forEach(item => {
                let score = 0;
                let matches = [];

                searchFields.forEach(field => {
                    const value = this.getNestedProperty(item, field);
                    if (value) {
                        const valueStr = caseSensitive ? String(value) : String(value).toLowerCase();
                        
                        if (exactMatch ? valueStr === searchTerm : valueStr.includes(searchTerm)) {
                            score += exactMatch ? 10 : 1;
                            matches.push(field);
                        }
                    }
                });

                if (score > 0) {
                    results.push({ ...item, _searchScore: score, _matchedFields: matches });
                }
            });
        };

        // Search in different data structures
        switch (dataType) {
            case 'messages':
                searchInData(data.messages, fields);
                searchInData(data.love_quotes, ['text', 'author', 'category']);
                break;
            case 'photos':
                searchInData(data.photos, [...fields, 'location', 'people', 'mood']);
                break;
            case 'music':
                searchInData(data.tracks, [...fields, 'artist', 'album', 'significance']);
                break;
            case 'memories':
                searchInData(data.memories, [...fields, 'location', 'participants', 'mood']);
                break;
            case 'plans':
                searchInData(data.future_plans, fields);
                searchInData(data.wish_list, fields);
                break;
            default:
                console.warn(`Search not implemented for ${dataType}`);
        }

        // Sort by score and return limited results
        return results
            .sort((a, b) => b._searchScore - a._searchScore)
            .slice(0, limit);
    }

    /**
     * Get filtered data by category, mood, date range, etc.
     */
    getFilteredData(dataType, filters = {}) {
        const data = this.cache.get(`data_${dataType}`);
        if (!data) return [];

        const {
            category,
            mood,
            featured,
            dateRange,
            tags,
            priority,
            status
        } = filters;

        let items = [];

        // Get appropriate data array
        switch (dataType) {
            case 'messages':
                items = data.messages || [];
                break;
            case 'photos':
                items = data.photos || [];
                break;
            case 'music':
                items = data.tracks || [];
                break;
            case 'memories':
                items = data.memories || [];
                break;
            case 'plans':
                items = [...(data.future_plans || []), ...(data.wish_list || [])];
                break;
            default:
                return [];
        }

        return items.filter(item => {
            // Category filter
            if (category && item.category !== category) return false;
            
            // Mood filter
            if (mood && item.mood !== mood) return false;
            
            // Featured filter
            if (featured !== undefined && item.featured !== featured) return false;
            
            // Date range filter
            if (dateRange && dateRange.start && dateRange.end) {
                const itemDate = new Date(item.date || item.created || item.dateAdded);
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);
                if (itemDate < startDate || itemDate > endDate) return false;
            }
            
            // Tags filter
            if (tags && Array.isArray(tags) && Array.isArray(item.tags)) {
                const hasMatchingTag = tags.some(tag => item.tags.includes(tag));
                if (!hasMatchingTag) return false;
            }
            
            // Priority filter (for plans)
            if (priority && item.priority !== priority) return false;
            
            // Status filter (for plans)
            if (status && item.status !== status) return false;
            
            return true;
        });
    }

    /**
     * Get statistics and analytics
     */
    getDataStats(dataType) {
        const data = this.cache.get(`data_${dataType}`);
        if (!data) return null;

        const stats = {
            dataType,
            lastUpdated: new Date().toISOString(),
            cacheStatus: this.isCacheValid(`data_${dataType}`) ? 'valid' : 'expired'
        };

        switch (dataType) {
            case 'messages':
                stats.totalMessages = data.messages?.length || 0;
                stats.totalQuotes = data.love_quotes?.length || 0;
                stats.featuredMessages = data.messages?.filter(m => m.featured)?.length || 0;
                break;
            case 'photos':
                stats.totalPhotos = data.photos?.length || 0;
                stats.totalAlbums = data.albums?.length || 0;
                stats.featuredPhotos = data.photos?.filter(p => p.featured)?.length || 0;
                break;
            case 'music':
                stats.totalTracks = data.tracks?.length || 0;
                stats.totalPlaylists = data.playlists?.length || 0;
                stats.totalPlayTime = data.tracks?.reduce((acc, track) => {
                    const duration = this.parseDuration(track.duration);
                    return acc + duration;
                }, 0) || 0;
                break;
            case 'memories':
                stats.totalMemories = data.memories?.length || 0;
                stats.categories = data.categories?.length || 0;
                stats.averageSignificance = data.memories?.reduce((acc, mem) => acc + (mem.significance || 0), 0) / (data.memories?.length || 1);
                break;
            case 'plans':
                stats.totalPlans = data.future_plans?.length || 0;
                stats.totalWishes = data.wish_list?.length || 0;
                stats.specialDates = data.special_dates?.length || 0;
                break;
        }

        return stats;
    }

    /**
     * Cache management utilities
     */
    isCacheValid(cacheKey) {
        if (!this.cache.has(cacheKey)) return false;
        const expiry = this.cacheTTL.get(cacheKey);
        return expiry && Date.now() < expiry;
    }

    clearCache(dataType = null) {
        if (dataType) {
            const cacheKey = `data_${dataType}`;
            this.cache.delete(cacheKey);
            this.cacheTTL.delete(cacheKey);
            console.log(`🗑️ Cleared cache for ${dataType}`);
        } else {
            this.cache.clear();
            this.cacheTTL.clear();
            console.log('🗑️ Cleared all cache');
        }
    }

    /**
     * Data validation
     */
    validateData(dataType, data) {
        const schema = this.schemas[dataType];
        if (!schema) return true; // No validation schema, assume valid

        // Check required fields
        for (const field of schema.required) {
            if (!this.getNestedProperty(data, field)) {
                console.error(`❌ Missing required field: ${field} in ${dataType}`);
                return false;
            }
        }

        // Check types
        for (const [field, expectedType] of Object.entries(schema.types)) {
            const value = this.getNestedProperty(data, field);
            if (value !== undefined) {
                const actualType = Array.isArray(value) ? 'array' : typeof value;
                if (actualType !== expectedType) {
                    console.error(`❌ Type mismatch for ${field}: expected ${expectedType}, got ${actualType}`);
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Auto-save setup for user-generated content
     */
    setupAutoSave() {
        // Save data every 30 seconds if there are changes
        setInterval(() => {
            this.autoSaveUserContent();
        }, 30000);

        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.autoSaveUserContent();
        });
    }

    autoSaveUserContent() {
        // Implementation would depend on backend API
        // For now, save to localStorage as backup
        try {
            const userContent = {
                memories: this.cache.get('data_memories'),
                plans: this.cache.get('data_plans'),
                timestamp: Date.now()
            };
            
            localStorage.setItem('anniversary_user_content', JSON.stringify(userContent));
            console.log('💾 Auto-saved user content to localStorage');
        } catch (error) {
            console.warn('⚠️ Auto-save failed:', error);
        }
    }

    /**
     * Error handling
     */
    handleError(dataType, error) {
        if (this.errorHandlers.has(dataType)) {
            this.errorHandlers.get(dataType)(error);
        } else {
            console.error(`❌ Error with ${dataType}:`, error);
        }
    }

    /**
     * Event system for data updates
     */
    onDataUpdate(dataType, callback) {
        if (!this.updateListeners.has(dataType)) {
            this.updateListeners.set(dataType, []);
        }
        this.updateListeners.get(dataType).push(callback);
    }

    notifyListeners(dataType, event, data) {
        const listeners = this.updateListeners.get(dataType) || [];
        listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in data update listener:', error);
            }
        });
    }

    /**
     * Utility functions
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    parseDuration(duration) {
        // Convert duration string (e.g., "4:23") to seconds
        const parts = duration.split(':').map(Number);
        return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
    }

    getMockData(dataType) {
        // Return minimal mock data structure
        const mockData = {
            personal: { couple: {}, relationship: {}, shared: {} },
            messages: { messages: [], love_quotes: [], daily_affirmations: [] },
            photos: { galleries: {}, photos: [], albums: [] },
            music: { playlists: [], tracks: [], music_memories: [] },
            memories: { memories: [], categories: [], book_settings: {} },
            plans: { future_plans: [], wish_list: [], special_dates: [] }
        };
        
        return mockData[dataType] || {};
    }

    /**
     * Public API methods
     */
    
    // Quick access methods
    async getPersonalData() { return this.loadData('personal'); }
    async getMessages() { return this.loadData('messages'); }
    async getPhotos() { return this.loadData('photos'); }
    async getMusic() { return this.loadData('music'); }
    async getMemories() { return this.loadData('memories'); }
    async getPlans() { return this.loadData('plans'); }

    // Status check
    isLoading(dataType) {
        return this.loadingStates.get(dataType) || false;
    }

    // Get system info
    getSystemInfo() {
        return {
            version: '4.0.0',
            cacheSize: this.cache.size,
            loadingStates: Object.fromEntries(this.loadingStates),
            lastCacheUpdate: Math.max(...Array.from(this.cacheTTL.values())),
            supportedDataTypes: Object.keys(this.dataFiles)
        };
    }
}

// Create global instance
window.anniversaryData = new AnniversaryDataManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnniversaryDataManager;
}

console.log('🎯 Anniversary Data Management System v4.0.0 Ready!');
