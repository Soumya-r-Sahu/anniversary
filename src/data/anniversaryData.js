/**
 * Anniversary Website Data Storage System
 * Client-side data management for GitHub Pages compatibility
 * Version: 1.0.0 - Complete data structure with localStorage support
 */

class AnniversaryDataManager {
    constructor() {
        this.storageKey = 'anniversaryWebsiteData';
        this.backupKey = 'anniversaryWebsiteBackup';
        this.version = '1.0.0';
        
        // Initialize data structure
        this.defaultData = this.createDefaultDataStructure();
        this.data = this.loadData();
        
        // Auto-save interval (5 minutes)
        this.autoSaveInterval = 5 * 60 * 1000;
        this.setupAutoSave();
        
        console.log('💕 Anniversary Data Manager initialized');
    }

    /**
     * Create default data structure for the anniversary website
     */
    createDefaultDataStructure() {
        return {
            version: this.version,
            lastUpdated: new Date().toISOString(),
            
            // Couple Information
            couple: {
                partner1: {
                    name: "Soumya",
                    nickname: "Mankada",
                    birthday: null,
                    favoriteColor: "#ec4899",
                    favoriteMemory: null
                },
                partner2: {
                    name: "Puja",
                    nickname: "Jerry",
                    birthday: null,
                    favoriteColor: "#8b5cf6",
                    favoriteMemory: null
                },
                relationshipStart: "2024-06-16",
                anniversaryDate: "2025-06-16",
                motto: "Together forever, my darling 💖"
            },

            // Timeline/Memories Data
            timeline: [
                {
                    id: 1,
                    date: "2024-06-16",
                    title: "First Sweet Message 💌",
                    description: "The very first message that started our beautiful journey together. A simple hello that changed everything!",
                    category: "milestone",
                    image: null,
                    location: null,
                    tags: ["first", "message", "beginning"],
                    favorite: true
                },
                {
                    id: 2,
                    date: "2024-06-19",
                    title: "First 'I Love You' 💕",
                    description: "During our amazing 3-hour phone call, when you said 'Love you' for the first time. I was so happy I couldn't even explain it! My heart was dancing. 🐒💕",
                    category: "milestone",
                    image: null,
                    location: null,
                    tags: ["love", "phone call", "confession"],
                    favorite: true
                },
                {
                    id: 3,
                    date: "2024-07-01",
                    title: "Growing Closer Every Day 🌱",
                    description: "Daily conversations, sharing dreams, and discovering how perfectly we complement each other. You became my sweet Jerry, and I became your loving Mankada.",
                    category: "growth",
                    image: null,
                    location: null,
                    tags: ["growth", "conversations", "nicknames"],
                    favorite: false
                },
                {
                    id: 4,
                    date: "2024-08-15",
                    title: "Deep Heart Connection 💖",
                    description: "Understanding each other's hearts, sharing our deepest thoughts, and realizing we're truly soulmates. Every conversation brought us closer.",
                    category: "connection",
                    image: null,
                    location: null,
                    tags: ["connection", "soulmates", "deep"],
                    favorite: true
                },
                {
                    id: 5,
                    date: "2024-10-01",
                    title: "Best Friends Forever 👫",
                    description: "Not just lovers, but the best of friends. Sharing jokes, supporting each other through everything, and finding joy in the simplest moments together.",
                    category: "friendship",
                    image: null,
                    location: null,
                    tags: ["friendship", "support", "joy"],
                    favorite: false
                },
                {
                    id: 6,
                    date: "2024-11-16",
                    title: "5 Months of Pure Love 🎉",
                    description: "Celebrating 5 incredible months of love, laughter, and beautiful memories. Each day with you has been a gift, my sweet Jerry! 🐒💕",
                    category: "anniversary",
                    image: null,
                    location: null,
                    tags: ["5 months", "celebration", "love"],
                    favorite: true
                }
            ],

            // Photo Gallery Data
            photos: [
                {
                    id: 1,
                    filename: "first-meeting.jpg",
                    title: "Our First Meeting",
                    description: "The day our hearts first connected",
                    date: "2024-06-16",
                    category: "milestones",
                    tags: ["first", "meeting", "beginning"],
                    favorite: true,
                    uploaded: new Date().toISOString()
                },
                {
                    id: 2,
                    filename: "memory1.jpg",
                    title: "Beautiful Memory",
                    description: "A precious moment captured in time",
                    date: "2024-07-01",
                    category: "memories",
                    tags: ["memory", "beautiful", "precious"],
                    favorite: false,
                    uploaded: new Date().toISOString()
                }
            ],

            // Love Letters/Messages
            loveLetters: [
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

            // Music Playlist Data
            musicPlaylist: [
                {
                    id: 1,
                    title: "Our Song",
                    artist: "Unknown",
                    filename: "romantic-song.mp3",
                    duration: null,
                    addedDate: "2024-06-16",
                    description: "The song that reminds us of our love",
                    tags: ["romantic", "our song"],
                    favorite: true
                }
            ],

            // Special Dates & Events
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

            // Wish List & Future Plans
            wishList: [
                {
                    id: 1,
                    title: "Weekend Getaway",
                    description: "A romantic weekend trip together",
                    priority: "high",
                    category: "travel",
                    estimated_cost: null,
                    target_date: null,
                    completed: false,
                    tags: ["travel", "romance", "weekend"]
                }
            ],

            // Settings & Preferences
            settings: {
                theme: "romantic",
                musicAutoplay: true,
                animations: true,
                notifications: true,
                privacy: {
                    sharePhotos: false,
                    publicProfile: false
                },
                display: {
                    showTimeline: true,
                    showPhotos: true,
                    showMusic: true,
                    heartAnimations: true
                }
            },

            // Analytics & Statistics
            statistics: {
                totalMemories: 6,
                totalPhotos: 2,
                totalLetters: 1,
                totalSongs: 1,
                daysogether: this.calculateDaysTogether("2024-06-16"),
                siteLaunched: new Date().toISOString(),
                lastVisit: new Date().toISOString()
            }
        };
    }

    /**
     * Load data from localStorage or return default data
     */
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsedData = JSON.parse(stored);
                // Merge with defaults to ensure all fields exist
                return this.mergeWithDefaults(parsedData);
            }
        } catch (error) {
            console.warn('Error loading stored data:', error);
        }
        
        // Return default data if nothing stored or error occurred
        return this.defaultData;
    }

    /**
     * Merge stored data with defaults to ensure completeness
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
     * Save data to localStorage
     */
    saveData() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            this.data.statistics.lastVisit = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('💾 Anniversary data saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    /**
     * Create backup of current data
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
     * Restore from backup
     */
    restoreFromBackup() {
        try {
            const backup = localStorage.getItem(this.backupKey);
            if (backup) {
                const parsed = JSON.parse(backup);
                this.data = parsed.data;
                this.saveData();
                console.log('📥 Data restored from backup');
                return true;
            }
        } catch (error) {
            console.error('Error restoring backup:', error);
        }
        return false;
    }

    /**
     * Export data as JSON
     */
    exportAsJSON() {
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
        
        console.log('📤 Data exported as JSON');
    }

    /**
     * Import data from JSON file
     */
    importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (imported.data) {
                        this.createBackup(); // Backup current data first
                        this.data = this.mergeWithDefaults(imported.data);
                        this.saveData();
                        console.log('📥 Data imported successfully');
                        resolve(true);
                    } else {
                        reject(new Error('Invalid data format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
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
     * Setup auto-save functionality
     */
    setupAutoSave() {
        setInterval(() => {
            this.saveData();
        }, this.autoSaveInterval);
        
        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });
    }

    // =================== DATA MANIPULATION METHODS ===================

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
            image: entry.image || null,
            location: entry.location || null,
            tags: entry.tags || [],
            favorite: entry.favorite || false,
            created: new Date().toISOString()
        };
        
        this.data.timeline.push(newEntry);
        this.data.statistics.totalMemories = this.data.timeline.length;
        this.saveData();
        
        console.log('➕ New timeline entry added:', newEntry.title);
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
        this.data.statistics.totalPhotos = this.data.photos.length;
        this.saveData();
        
        console.log('📸 New photo added:', newPhoto.title);
        return newPhoto;
    }

    /**
     * Add new love letter
     */
    addLoveLetter(letter) {
        const newLetter = {
            id: Date.now(),
            date: letter.date || new Date().toISOString().split('T')[0],
            title: letter.title || "Love Letter",
            content: letter.content || "",
            author: letter.author || this.data.couple.partner1.name,
            recipient: letter.recipient || this.data.couple.partner2.name,
            mood: letter.mood || "romantic",
            tags: letter.tags || [],
            favorite: letter.favorite || false,
            created: new Date().toISOString()
        };
        
        this.data.loveLetters.push(newLetter);
        this.data.statistics.totalLetters = this.data.loveLetters.length;
        this.saveData();
        
        console.log('💌 New love letter added:', newLetter.title);
        return newLetter;
    }

    /**
     * Get data by category
     */
    getTimelineByCategory(category) {
        return this.data.timeline.filter(entry => entry.category === category);
    }

    getPhotosByCategory(category) {
        return this.data.photos.filter(photo => photo.category === category);
    }

    getFavoriteMemories() {
        return this.data.timeline.filter(entry => entry.favorite);
    }

    getFavoritePhotos() {
        return this.data.photos.filter(photo => photo.favorite);
    }

    /**
     * Search functionality
     */
    searchMemories(query) {
        const lowerQuery = query.toLowerCase();
        return this.data.timeline.filter(entry => 
            entry.title.toLowerCase().includes(lowerQuery) ||
            entry.description.toLowerCase().includes(lowerQuery) ||
            entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Update statistics
     */
    updateStatistics() {
        this.data.statistics = {
            ...this.data.statistics,
            totalMemories: this.data.timeline.length,
            totalPhotos: this.data.photos.length,
            totalLetters: this.data.loveLetters.length,
            totalSongs: this.data.musicPlaylist.length,
            daysogether: this.calculateDaysTogether(this.data.couple.relationshipStart),
            lastVisit: new Date().toISOString()
        };
        
        this.saveData();
    }

    /**
     * Get all data (for debugging or full access)
     */
    getAllData() {
        return this.data;
    }

    /**
     * Reset all data to defaults
     */
    resetAllData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone!')) {
            this.createBackup();
            this.data = this.createDefaultDataStructure();
            this.saveData();
            console.log('🔄 All data reset to defaults');
            return true;
        }
        return false;
    }
}

// Initialize global instance
window.anniversaryData = new AnniversaryDataManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnniversaryDataManager;
}

console.log('💕 Anniversary Data Manager loaded successfully!');
