/**
 * Anniversary Website API Layer
 * Client-side API for data management and website functionality
 * Version: 1.0.0 - Complete API for GitHub Pages compatibility
 */

import globalConfig from '../config/globalConfig';

class AnniversaryAPI {
    constructor() {
        // Wait for data manager to be available
        this.dataManager = null;
        this.initializeAPI();
    }

    async initializeAPI() {
        // Wait for anniversaryData to be available
        while (!window.anniversaryData) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.dataManager = window.anniversaryData;
        console.log('🚀 Anniversary API initialized');
        
        // Setup event listeners for real-time updates
        this.setupEventListeners();
    }

    // =================== TIMELINE & MEMORIES API ===================

    /**
     * Get all timeline entries sorted by date
     */
    getTimeline(sortOrder = 'desc') {
        const timeline = this.dataManager.data.timeline;
        return timeline.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    /**
     * Get timeline entries for a specific month/year
     */
    getTimelineByPeriod(year, month = null) {
        return this.dataManager.data.timeline.filter(entry => {
            const entryDate = new Date(entry.date);
            const matchYear = entryDate.getFullYear() === year;
            const matchMonth = month ? entryDate.getMonth() + 1 === month : true;
            return matchYear && matchMonth;
        });
    }

    /**
     * Add new memory to timeline
     */
    addMemory(memoryData) {
        const memory = this.dataManager.addTimelineEntry(memoryData);
        this.triggerEvent('memoryAdded', memory);
        return memory;
    }

    /**
     * Update existing memory
     */
    updateMemory(id, updates) {
        const timeline = this.dataManager.data.timeline;
        const index = timeline.findIndex(entry => entry.id === id);
        
        if (index !== -1) {
            timeline[index] = { ...timeline[index], ...updates };
            this.dataManager.saveData();
            this.triggerEvent('memoryUpdated', timeline[index]);
            return timeline[index];
        }
        
        return null;
    }

    /**
     * Delete memory
     */
    deleteMemory(id) {
        const timeline = this.dataManager.data.timeline;
        const index = timeline.findIndex(entry => entry.id === id);
        
        if (index !== -1) {
            const deleted = timeline.splice(index, 1)[0];
            this.dataManager.updateStatistics();
            this.dataManager.saveData();
            this.triggerEvent('memoryDeleted', deleted);
            return deleted;
        }
        
        return null;
    }

    // =================== PHOTO GALLERY API ===================

    /**
     * Get all photos with optional filtering
     */
    getPhotos(category = null, favoriteOnly = false) {
        let photos = this.dataManager.data.photos;
        
        if (category) {
            photos = photos.filter(photo => photo.category === category);
        }
        
        if (favoriteOnly) {
            photos = photos.filter(photo => photo.favorite);
        }
        
        return photos.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * Add new photo
     */
    addPhoto(photoData) {
        const photo = this.dataManager.addPhoto(photoData);
        this.triggerEvent('photoAdded', photo);
        return photo;
    }

    /**
     * Toggle photo favorite status
     */
    togglePhotoFavorite(id) {
        const photos = this.dataManager.data.photos;
        const photo = photos.find(p => p.id === id);
        
        if (photo) {
            photo.favorite = !photo.favorite;
            this.dataManager.saveData();
            this.triggerEvent('photoUpdated', photo);
            return photo;
        }
        
        return null;
    }

    // =================== LOVE LETTERS API ===================

    /**
     * Get all love letters
     */
    getLoveLetters(author = null) {
        let letters = this.dataManager.data.loveLetters;
        
        if (author) {
            letters = letters.filter(letter => letter.author === author);
        }
        
        return letters.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * Add new love letter
     */
    addLoveLetter(letterData) {
        const letter = this.dataManager.addLoveLetter(letterData);
        this.triggerEvent('letterAdded', letter);
        return letter;
    }

    /**
     * Get random love letter
     */
    getRandomLoveLetter() {
        const letters = this.dataManager.data.loveLetters;
        if (letters.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * letters.length);
        return letters[randomIndex];
    }

    // =================== MUSIC & PLAYLIST API ===================

    /**
     * Get music playlist
     */
    getPlaylist() {
        return this.dataManager.data.musicPlaylist;
    }

    /**
     * Add song to playlist
     */
    addSong(songData) {
        const newSong = {
            id: Date.now(),
            title: songData.title || "Unknown Song",
            artist: songData.artist || "Unknown Artist",
            filename: songData.filename || null,
            duration: songData.duration || null,
            addedDate: new Date().toISOString().split('T')[0],
            description: songData.description || "",
            tags: songData.tags || [],
            favorite: songData.favorite || false
        };
        
        this.dataManager.data.musicPlaylist.push(newSong);
        this.dataManager.saveData();
        this.triggerEvent('songAdded', newSong);
        return newSong;
    }

    /**
     * Get current playing song info
     */
    getCurrentSong() {
        // This would integrate with the music manager
        if (window.musicManager) {
            return window.musicManager.getCurrentTrack();
        }
        return null;
    }

    // =================== SPECIAL DATES & EVENTS API ===================

    /**
     * Get upcoming special dates
     */
    getUpcomingDates(days = 30) {
        const today = new Date();
        const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
        
        return this.dataManager.data.specialDates.filter(dateEvent => {
            if (dateEvent.type === 'recurring') {
                // Handle recurring dates (like monthly anniversaries)
                return true;
            } else {
                const eventDate = new Date(dateEvent.date);
                return eventDate >= today && eventDate <= futureDate;
            }
        });
    }

    /**
     * Add special date
     */
    addSpecialDate(dateData) {
        const newDate = {
            id: Date.now(),
            name: dateData.name || "Special Date",
            date: dateData.date || new Date().toISOString().split('T')[0],
            type: dateData.type || "special",
            description: dateData.description || "",
            notificationEnabled: dateData.notificationEnabled || true,
            category: dateData.category || "personal"
        };
        
        this.dataManager.data.specialDates.push(newDate);
        this.dataManager.saveData();
        this.triggerEvent('specialDateAdded', newDate);
        return newDate;
    }

    // =================== STATISTICS & ANALYTICS API ===================

    /**
     * Get relationship statistics
     */
    getStatistics() {
        // Update statistics before returning
        this.dataManager.updateStatistics();
        return this.dataManager.data.statistics;
    }

    /**
     * Get anniversary countdown
     */
    getAnniversaryCountdown() {
        const anniversaryDate = new Date(globalConfig.importantDates.anniversary);
        const today = new Date();
        
        // If anniversary passed this year, calculate for next year
        if (anniversaryDate < today) {
            anniversaryDate.setFullYear(today.getFullYear() + 1);
        }
        
        const diffTime = anniversaryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
            date: anniversaryDate.toISOString().split('T')[0],
            daysRemaining: diffDays,
        };
    }

    /**
     * Get memory statistics by category
     */
    getMemoryStatsByCategory() {
        const timeline = this.dataManager.data.timeline;
        const stats = {};
        
        timeline.forEach(entry => {
            if (!stats[entry.category]) {
                stats[entry.category] = 0;
            }
            stats[entry.category]++;
        });
        
        return stats;
    }

    // =================== SEARCH & FILTERING API ===================

    /**
     * Search across all content
     */
    globalSearch(query) {
        const results = {
            memories: this.dataManager.searchMemories(query),
            photos: this.dataManager.data.photos.filter(photo => 
                photo.title.toLowerCase().includes(query.toLowerCase()) ||
                photo.description.toLowerCase().includes(query.toLowerCase())
            ),
            letters: this.dataManager.data.loveLetters.filter(letter =>
                letter.title.toLowerCase().includes(query.toLowerCase()) ||
                letter.content.toLowerCase().includes(query.toLowerCase())
            )
        };
        
        return results;
    }

    /**
     * Get content by tag
     */
    getContentByTag(tag) {
        return {
            memories: this.dataManager.data.timeline.filter(entry => 
                entry.tags.includes(tag)
            ),
            photos: this.dataManager.data.photos.filter(photo => 
                photo.tags.includes(tag)
            )
        };
    }

    // =================== USER PREFERENCES API ===================

    /**
     * Get user settings
     */
    getSettings() {
        return this.dataManager.data.settings;
    }

    /**
     * Update settings
     */
    updateSettings(newSettings) {
        this.dataManager.data.settings = {
            ...this.dataManager.data.settings,
            ...newSettings
        };
        this.dataManager.saveData();
        this.triggerEvent('settingsUpdated', this.dataManager.data.settings);
        return this.dataManager.data.settings;
    }

    /**
     * Toggle setting
     */
    toggleSetting(settingPath) {
        const keys = settingPath.split('.');
        let current = this.dataManager.data.settings;
        
        // Navigate to the setting
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        
        // Toggle the final setting
        const lastKey = keys[keys.length - 1];
        current[lastKey] = !current[lastKey];
        
        this.dataManager.saveData();
        this.triggerEvent('settingToggled', { path: settingPath, value: current[lastKey] });
        return current[lastKey];
    }

    // =================== DATA MANAGEMENT API ===================

    /**
     * Export data in various formats
     */
    exportData(format = 'json') {
        switch (format) {
            case 'json':
                this.dataManager.exportAsJSON();
                break;
            case 'backup':
                return this.dataManager.createBackup();
            default:
                console.warn('Unsupported export format:', format);
        }
    }

    /**
     * Import data
     */
    async importData(file) {
        try {
            await this.dataManager.importFromJSON(file);
            this.triggerEvent('dataImported', true);
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            this.triggerEvent('dataImported', false);
            return false;
        }
    }

    /**
     * Get data summary for dashboard
     */
    getDashboardSummary() {
        const stats = this.getStatistics();
        const countdown = this.getAnniversaryCountdown();
        const recentMemories = this.getTimeline().slice(0, 3);
        const favoritePhotos = this.getPhotos(null, true).slice(0, 4);
        
        return {
            statistics: stats,
            countdown: countdown,
            recentMemories: recentMemories,
            favoritePhotos: favoritePhotos,
            upcomingDates: this.getUpcomingDates(7)
        };
    }

    // =================== EVENT SYSTEM ===================

    /**
     * Setup event listeners for real-time updates
     */
    setupEventListeners() {
        this.eventListeners = {};
        
        // Listen for storage changes (if multiple tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === this.dataManager.storageKey) {
                this.triggerEvent('dataUpdated', JSON.parse(e.newValue));
            }
        });
    }

    /**
     * Add event listener
     */
    on(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }

    /**
     * Remove event listener
     */
    off(eventName, callback) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName] = this.eventListeners[eventName]
                .filter(cb => cb !== callback);
        }
    }

    /**
     * Trigger event
     */
    triggerEvent(eventName, data) {
        if (this.eventListeners && this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            });
        }
    }

    // =================== UTILITY METHODS ===================

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Format date for display
     */
    formatDate(dateString, format = 'long') {
        const date = new Date(dateString);
        const options = format === 'long' ? 
            { year: 'numeric', month: 'long', day: 'numeric' } :
            { year: 'numeric', month: 'short', day: 'numeric' };
        
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Get time ago string
     */
    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }
}

// Initialize global API instance
window.anniversaryAPI = new AnniversaryAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnniversaryAPI;
}

console.log('🚀 Anniversary API loaded successfully!');
