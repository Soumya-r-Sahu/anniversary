/**
 * Anniversary Website API Layer
 * Client-side API for data management and website functionality
 * Version: 4.0.0 - Professional unified data management
 */

import globalConfig from '../config/globalConfig';

class AnniversaryAPI {
    constructor() {
        // Use the unified data manager
        this.dataManager = null;
        this.initializeAPI();
    }

    async initializeAPI() {
        // Wait for unified data manager to be available
        while (!window.dataManager) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.dataManager = window.dataManager;
        console.log('🚀 Anniversary API v4.0.0 initialized with unified data manager');
        
        // Setup event listeners for real-time updates
        this.setupEventListeners();
    }

    // =================== TIMELINE & MEMORIES API ===================

    /**
     * Get all timeline entries sorted by date
     */
    getTimeline(sortOrder = 'desc') {
        return this.dataManager.getTimeline({ sortOrder });
    }

    /**
     * Get timeline entries for a specific month/year
     */
    getTimelineByPeriod(year, month = null) {
        const timeline = this.dataManager.getTimeline();
        return timeline.filter(entry => {
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
        return this.dataManager.getPhotos({ 
            category, 
            favorite: favoriteOnly 
        });
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
        return this.dataManager.getLetters({ author });
    }

    /**
     * Add new love letter
     */
    addLoveLetter(letterData) {
        const letter = this.dataManager.addLetter(letterData);
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
        return this.dataManager.getMusic();
    }

    /**
     * Add song to playlist
     */
    addSong(songData) {
        // Use unified data manager to add music (we'll need to add this method)
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
        
        this.dataManager.data.music.push(newSong);
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
        return this.dataManager.getStatistics();
    }

    /**
     * Get anniversary countdown
     */
    getAnniversaryCountdown() {
        return this.dataManager.getCountdown();
    }

    /**
     * Get memory statistics by category
     */
    getMemoryStatsByCategory() {
        const timeline = this.dataManager.getTimeline();
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
        return this.dataManager.search(query);
    }

    /**
     * Get content by tag
     */
    getContentByTag(tag) {
        const searchResults = this.dataManager.search(tag);
        return {
            memories: searchResults.memories,
            photos: searchResults.photos,
            letters: searchResults.letters
        };
    }

    // =================== USER PREFERENCES API ===================

    /**
     * Get user settings
     */
    getSettings() {
        return this.dataManager.getSettings();
    }

    /**
     * Update settings
     */
    updateSettings(newSettings) {
        return this.dataManager.updateSettings(newSettings);
    }

    /**
     * Toggle setting
     */
    toggleSetting(settingPath) {
        const settings = this.dataManager.getSettings();
        const keys = settingPath.split('.');
        let current = settings;
        
        // Navigate to the setting
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        
        // Toggle the final setting
        const lastKey = keys[keys.length - 1];
        current[lastKey] = !current[lastKey];
        
        this.dataManager.updateSettings(settings);
        this.triggerEvent('settingToggled', { path: settingPath, value: current[lastKey] });
        return current[lastKey];
    }

    // =================== DATA MANAGEMENT API ===================

    /**
     * Export data in various formats
     */
    exportData(format = 'json') {
        if (format === 'json') {
            this.dataManager.exportData();
            return true;
        } else if (format === 'backup') {
            return this.dataManager.createBackup();
        } else {
            console.warn('Unsupported export format:', format);
            return false;
        }
    }

    /**
     * Import data
     */
    async importData(file) {
        try {
            // Note: We'll need to add importFromJSON to unified data manager
            console.log('Import functionality will be added to unified data manager');
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
        const recentMemories = this.getTimeline({ limit: 3 });
        const favoritePhotos = this.getPhotos(null, true);
        
        return {
            statistics: stats,
            countdown: countdown,
            recentMemories: recentMemories,
            favoritePhotos: favoritePhotos.slice(0, 4),
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
