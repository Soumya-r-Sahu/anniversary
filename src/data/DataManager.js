/**
 * Anniversary Website - Unified Data Management System v4.0.0
 * Professional, optimized, single-source data management
 * Dark theme default, content-focused architecture, performance optimized
 */

class UnifiedDataManager {
    constructor() {
        this.version = '4.0.0';
        this.storageKey = 'anniversary_data_v4';
        this.backupKey = 'anniversary_backup_v4';
        this.themeKey = 'anniversary_theme_v4';
        
        // Performance optimization
        this.cache = new Map();
        this.cacheTTL = new Map();
        this.defaultCacheDuration = 300000; // 5 minutes
        this.subscribers = new Map();
        this.loadingStates = new Map();
        
        // Initialize theme system (dark as default)
        this.initializeTheme();
        
        // Initialize data structure
        this.defaultData = this.createDataStructure();
        this.data = this.loadData();
        
        // Performance metrics
        this.metrics = {
            cacheHits: 0,
            cacheMisses: 0,
            loadTime: 0,
            lastOptimization: Date.now()
        };
        
        // Auto-save and cleanup
        this.setupAutoSave();
        this.setupPerformanceOptimization();
        
        console.log('🚀 Unified Data Manager v4.0.0 initialized with dark theme');
    }

    /**
     * Initialize theme system with dark as default
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        const theme = savedTheme || 'dark'; // Professional dark theme default
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.themeKey, theme);
        
        if (document.body) {
            document.body.className = `theme-${theme} anniversary-app`;
        }
    }

    /**
     * Create optimized data structure
     */
    createDataStructure() {
        return {
            version: this.version,
            lastUpdated: new Date().toISOString(),
            
            // Core relationship data
            relationship: {
                partners: {
                    primary: {
                        name: "Soumya",
                        nickname: "Mankada",
                        favoriteColor: "#ec4899"
                    },
                    secondary: {
                        name: "Puja", 
                        nickname: "Jerry",
                        favoriteColor: "#8b5cf6"
                    }
                },
                startDate: "2024-06-16",
                anniversaryDate: "2025-06-16",
                motto: "Together forever, my darling 💖"
            },
            
            // Timeline and memories
            timeline: [
                {
                    id: 1,
                    date: "2024-06-16",
                    title: "First Sweet Message 💌",
                    description: "The very first message that started our beautiful journey together.",
                    category: "milestone",
                    tags: ["first", "message", "beginning"],
                    favorite: true
                },
                {
                    id: 2,
                    date: "2024-06-19", 
                    title: "First 'I Love You' 💕",
                    description: "During our amazing 3-hour phone call, when you said 'Love you' for the first time.",
                    category: "milestone",
                    tags: ["love", "phone call", "confession"],
                    favorite: true
                },
                {
                    id: 3,
                    date: "2024-11-16",
                    title: "5 Months of Pure Love 🎉", 
                    description: "Celebrating 5 incredible months of love, laughter, and beautiful memories.",
                    category: "anniversary",
                    tags: ["5 months", "celebration", "love"],
                    favorite: true
                }
            ],
            
            // Photo gallery
            photos: [
                {
                    id: 1,
                    filename: "first-meeting.jpg",
                    title: "Our First Meeting",
                    description: "The day our hearts first connected",
                    date: "2024-06-16",
                    category: "milestones",
                    tags: ["first", "meeting", "beginning"],
                    favorite: true
                }
            ],
            
            // Love letters and messages
            letters: [
                {
                    id: 1,
                    date: "2024-11-16",
                    title: "5 Month Anniversary Letter",
                    content: "My beautiful Puja, as we celebrate 5 wonderful months together, I want you to know how much you mean to me. You are my sunshine, my joy, and my everything. Thank you for being my sweet Jerry. I love you more each day! 💕",
                    author: "Soumya",
                    recipient: "Puja",
                    mood: "romantic",
                    tags: ["anniversary", "5 months", "love"],
                    favorite: true
                }
            ],
            
            // Music playlist
            music: [
                {
                    id: 1,
                    title: "Our Song",
                    artist: "Unknown",
                    filename: "romantic-song.mp3",
                    description: "The song that reminds us of our love",
                    tags: ["romantic", "our song"],
                    favorite: true,
                    addedDate: "2024-06-16"
                }
            ],
            
            // Special dates and events
            specialDates: [
                {
                    id: 1,
                    name: "Monthly Anniversary",
                    date: "16th of every month",
                    type: "recurring",
                    description: "Celebrating another month of love",
                    notificationEnabled: true,
                    category: "anniversary"
                },
                {
                    id: 2,
                    name: "1 Year Anniversary",
                    date: "2025-06-16", 
                    type: "special",
                    description: "Our first year celebration!",
                    notificationEnabled: true,
                    category: "milestone"
                }
            ],
            
            // Future plans and wishes
            wishList: [
                {
                    id: 1,
                    title: "Weekend Getaway",
                    description: "A romantic weekend trip together",
                    priority: "high",
                    category: "travel",
                    completed: false,
                    tags: ["travel", "romance", "weekend"]
                }
            ],
            
            // Application settings
            settings: {
                theme: "dark", // Professional dark theme default
                animations: true,
                notifications: true,
                musicAutoplay: true,
                display: {
                    showTimeline: true,
                    showPhotos: true,
                    showMusic: true,
                    heartAnimations: true
                },
                privacy: {
                    sharePhotos: false,
                    publicProfile: false
                }
            },
            
            // Analytics and statistics
            statistics: {
                totalMemories: 3,
                totalPhotos: 1,
                totalLetters: 1,
                totalSongs: 1,
                daysTogether: this.calculateDaysTogether("2024-06-16"),
                siteLaunched: new Date().toISOString(),
                lastVisit: new Date().toISOString()
            }
        };
    }

    /**
     * Load data with intelligent caching
     */
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsedData = JSON.parse(stored);
                return this.mergeWithDefaults(parsedData);
            }
        } catch (error) {
            console.warn('Error loading stored data:', error);
        }
        
        return this.defaultData;
    }

    /**
     * Merge stored data with defaults
     */
    mergeWithDefaults(storedData) {
        const merged = { ...this.defaultData };
        
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
     * Save data to localStorage
     */
    saveData() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            this.data.statistics.lastVisit = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('💾 Data saved successfully');
            
            // Notify subscribers
            this.notifySubscribers('dataSaved', this.data);
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // =================== CONTENT RETRIEVAL API ===================

    /**
     * Get timeline entries with filtering
     */
    getTimeline(filters = {}) {
        const { category, favorite, sortOrder = 'desc', limit } = filters;
        let timeline = [...this.data.timeline];
        
        if (category) {
            timeline = timeline.filter(entry => entry.category === category);
        }
        
        if (favorite) {
            timeline = timeline.filter(entry => entry.favorite);
        }
        
        // Sort by date
        timeline.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        
        if (limit) {
            timeline = timeline.slice(0, limit);
        }
        
        return timeline;
    }

    /**
     * Get photos with filtering
     */
    getPhotos(filters = {}) {
        const { category, favorite, limit } = filters;
        let photos = [...this.data.photos];
        
        if (category) {
            photos = photos.filter(photo => photo.category === category);
        }
        
        if (favorite) {
            photos = photos.filter(photo => photo.favorite);
        }
        
        // Sort by date (newest first)
        photos.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (limit) {
            photos = photos.slice(0, limit);
        }
        
        return photos;
    }

    /**
     * Get love letters with filtering
     */
    getLetters(filters = {}) {
        const { author, favorite, limit } = filters;
        let letters = [...this.data.letters];
        
        if (author) {
            letters = letters.filter(letter => letter.author === author);
        }
        
        if (favorite) {
            letters = letters.filter(letter => letter.favorite);
        }
        
        // Sort by date (newest first)
        letters.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (limit) {
            letters = letters.slice(0, limit);
        }
        
        return letters;
    }

    /**
     * Get music playlist
     */
    getMusic(filters = {}) {
        const { favorite, limit } = filters;
        let music = [...this.data.music];
        
        if (favorite) {
            music = music.filter(song => song.favorite);
        }
        
        // Sort by added date
        music.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        
        if (limit) {
            music = music.slice(0, limit);
        }
        
        return music;
    }

    /**
     * Global search across all content
     */
    search(query, options = {}) {
        const { limit = 10, caseSensitive = false } = options;
        const searchTerm = caseSensitive ? query : query.toLowerCase();
        const results = {
            memories: [],
            photos: [],
            letters: [],
            music: []
        };

        // Search timeline
        this.data.timeline.forEach(entry => {
            const content = `${entry.title} ${entry.description} ${entry.tags.join(' ')}`;
            const searchContent = caseSensitive ? content : content.toLowerCase();
            if (searchContent.includes(searchTerm)) {
                results.memories.push({ ...entry, type: 'memory' });
            }
        });

        // Search photos
        this.data.photos.forEach(photo => {
            const content = `${photo.title} ${photo.description} ${photo.tags.join(' ')}`;
            const searchContent = caseSensitive ? content : content.toLowerCase();
            if (searchContent.includes(searchTerm)) {
                results.photos.push({ ...photo, type: 'photo' });
            }
        });

        // Search letters
        this.data.letters.forEach(letter => {
            const content = `${letter.title} ${letter.content} ${letter.tags.join(' ')}`;
            const searchContent = caseSensitive ? content : content.toLowerCase();
            if (searchContent.includes(searchTerm)) {
                results.letters.push({ ...letter, type: 'letter' });
            }
        });

        // Search music
        this.data.music.forEach(song => {
            const content = `${song.title} ${song.artist} ${song.description} ${song.tags.join(' ')}`;
            const searchContent = caseSensitive ? content : content.toLowerCase();
            if (searchContent.includes(searchTerm)) {
                results.music.push({ ...song, type: 'music' });
            }
        });

        // Limit results
        Object.keys(results).forEach(key => {
            results[key] = results[key].slice(0, limit);
        });

        return results;
    }

    // =================== CONTENT MANAGEMENT API ===================

    /**
     * Add new timeline entry
     */
    addTimelineEntry(entry) {
        const newEntry = {
            id: Date.now(),
            date: entry.date || new Date().toISOString().split('T')[0],
            title: entry.title || "New Memory",
            description: entry.description || "",
            category: entry.category || "memory",
            tags: entry.tags || [],
            favorite: entry.favorite || false,
            created: new Date().toISOString()
        };
        
        this.data.timeline.push(newEntry);
        this.updateStatistics();
        this.saveData();
        
        console.log('➕ New memory added:', newEntry.title);
        this.notifySubscribers('memoryAdded', newEntry);
        return newEntry;
    }

    /**
     * Add new photo
     */
    addPhoto(photo) {
        const newPhoto = {
            id: Date.now(),
            filename: photo.filename || "new-photo.jpg",
            title: photo.title || "New Photo",
            description: photo.description || "",
            date: photo.date || new Date().toISOString().split('T')[0],
            category: photo.category || "memories",
            tags: photo.tags || [],
            favorite: photo.favorite || false,
            uploaded: new Date().toISOString()
        };
        
        this.data.photos.push(newPhoto);
        this.updateStatistics();
        this.saveData();
        
        console.log('📸 New photo added:', newPhoto.title);
        this.notifySubscribers('photoAdded', newPhoto);
        return newPhoto;
    }

    /**
     * Add new love letter
     */
    addLetter(letter) {
        const newLetter = {
            id: Date.now(),
            date: letter.date || new Date().toISOString().split('T')[0],
            title: letter.title || "Love Letter",
            content: letter.content || "",
            author: letter.author || this.data.relationship.partners.primary.name,
            recipient: letter.recipient || this.data.relationship.partners.secondary.name,
            mood: letter.mood || "romantic",
            tags: letter.tags || [],
            favorite: letter.favorite || false,
            created: new Date().toISOString()
        };
        
        this.data.letters.push(newLetter);
        this.updateStatistics();
        this.saveData();
        
        console.log('💌 New letter added:', newLetter.title);
        this.notifySubscribers('letterAdded', newLetter);
        return newLetter;
    }

    // =================== COUNTDOWN & STATISTICS API ===================

    /**
     * Get anniversary countdown
     */
    getCountdown() {
        const anniversaryDate = new Date(this.data.relationship.anniversaryDate);
        const today = new Date();
        
        // If anniversary passed this year, calculate for next year
        if (anniversaryDate < today) {
            anniversaryDate.setFullYear(today.getFullYear() + 1);
        }
        
        const diffTime = anniversaryDate - today;
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
        
        return {
            targetDate: anniversaryDate.toISOString().split('T')[0],
            timeRemaining: diffTime,
            days,
            hours,
            minutes,
            seconds,
            isActive: diffTime > 0
        };
    }

    /**
     * Get relationship statistics
     */
    getStatistics() {
        const startDate = new Date(this.data.relationship.startDate);
        const daysTogether = this.calculateDaysTogether(this.data.relationship.startDate);
        
        return {
            ...this.data.statistics,
            daysTogether,
            weeksTogether: Math.floor(daysTogether / 7),
            monthsTogether: Math.floor(daysTogether / 30),
            relationshipStartDate: this.data.relationship.startDate,
            anniversaryDate: this.data.relationship.anniversaryDate
        };
    }

    /**
     * Calculate days together
     */
    calculateDaysTogether(startDate) {
        const start = new Date(startDate);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Update statistics
     */
    updateStatistics() {
        this.data.statistics = {
            ...this.data.statistics,
            totalMemories: this.data.timeline.length,
            totalPhotos: this.data.photos.length,
            totalLetters: this.data.letters.length,
            totalSongs: this.data.music.length,
            daysTogether: this.calculateDaysTogether(this.data.relationship.startDate),
            lastVisit: new Date().toISOString()
        };
    }

    // =================== SETTINGS & THEME API ===================

    /**
     * Get current theme
     */
    getTheme() {
        return localStorage.getItem(this.themeKey) || 'dark';
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.themeKey, theme);
        
        if (document.body) {
            document.body.className = `theme-${theme} anniversary-app`;
        }
        
        this.data.settings.theme = theme;
        this.saveData();
        
        console.log(`🎨 Theme changed to: ${theme}`);
        this.notifySubscribers('themeChanged', theme);
    }

    /**
     * Get settings
     */
    getSettings() {
        return { ...this.data.settings };
    }

    /**
     * Update settings
     */
    updateSettings(newSettings) {
        this.data.settings = {
            ...this.data.settings,
            ...newSettings
        };
        this.saveData();
        
        this.notifySubscribers('settingsUpdated', this.data.settings);
        return this.data.settings;
    }

    // =================== BACKUP & EXPORT API ===================

    /**
     * Create backup
     */
    createBackup() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                version: this.version,
                data: this.data
            };
            
            localStorage.setItem(this.backupKey, JSON.stringify(backup));
            console.log('💾 Backup created successfully');
            return true;
        } catch (error) {
            console.error('Error creating backup:', error);
            return false;
        }
    }

    /**
     * Export data as JSON
     */
    exportData() {
        const exportData = {
            exportDate: new Date().toISOString(),
            version: this.version,
            data: this.data
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
        
        console.log('📤 Data exported successfully');
    }

    // =================== PERFORMANCE & UTILITIES ===================

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        // Auto-save every 5 minutes
        setInterval(() => {
            this.saveData();
        }, 300000);
        
        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });
    }

    /**
     * Setup performance optimization
     */
    setupPerformanceOptimization() {
        // Clean up cache every 10 minutes
        setInterval(() => {
            this.optimizeCache();
        }, 600000);
    }

    /**
     * Optimize cache performance
     */
    optimizeCache() {
        const now = Date.now();
        
        for (const [key, ttl] of this.cacheTTL) {
            if (now > ttl) {
                this.cache.delete(key);
                this.cacheTTL.delete(key);
            }
        }
        
        console.log(`🧹 Cache optimized: ${this.cache.size} items remaining`);
    }

    /**
     * Subscribe to data changes
     */
    subscribe(event, callback) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event).push(callback);
    }

    /**
     * Notify subscribers
     */
    notifySubscribers(event, data) {
        const callbacks = this.subscribers.get(event) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in subscriber callback:', error);
            }
        });
    }

    /**
     * Get all data (for debugging)
     */
    getAllData() {
        return { ...this.data };
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            cacheSize: this.cache.size,
            subscriberCount: Array.from(this.subscribers.values()).reduce((acc, arr) => acc + arr.length, 0)
        };
    }
}

// Create and export global instance
const dataManager = new UnifiedDataManager();

// Global access
window.dataManager = dataManager;
window.UnifiedDataManager = UnifiedDataManager;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedDataManager;
}

export default dataManager;
