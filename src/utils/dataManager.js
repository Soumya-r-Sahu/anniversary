/**
 * Comprehensive Data Management System - Anniversary Website v4.0.0
 * Fast response, intelligent caching, JSON-based data layer
 */

import JSONDatabase from './jsonDatabase.js';

class DataManager {
  constructor() {
    this.database = new JSONDatabase();
    this.cache = new Map();
    this.subscribers = new Map();
    this.lastUpdate = null;
    this.isOnline = navigator.onLine;
    this.init();
  }

  /**
   * Initialize the data management system
   */
  async init() {
    try {
      // Initialize JSON database
      await this.database.init();
      
      // Setup offline/online detection
      this.setupNetworkDetection();
      
      // Preload critical data
      await this.preloadCriticalData();
      
      console.log('📊 Data Management System initialized');
    } catch (error) {
      console.error('❌ Data Manager initialization failed:', error);
    }
  }

  /**
   * Preload critical data for fast access
   */
  async preloadCriticalData() {
    const criticalData = [
      'personalData',
      'timeline', 
      'countdownSettings',
      'anniversaryData'
    ];

    await Promise.all(criticalData.map(async (key) => {
      try {
        const data = await this.getData(key);
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          critical: true
        });
      } catch (error) {
        console.warn(`Failed to preload ${key}:`, error);
      }
    }));
  }

  /**
   * Get data with intelligent caching
   */
  async getData(key, options = {}) {
    const { 
      useCache = true, 
      maxAge = 300000, // 5 minutes default
      fallback = null 
    } = options;

    // Check cache first
    if (useCache && this.cache.has(key)) {
      const cached = this.cache.get(key);
      const age = Date.now() - cached.timestamp;
      
      if (age < maxAge) {
        return cached.data;
      }
    }

    try {
      let data;
      
      // Route to appropriate data source
      switch (key) {
        case 'personalData':
          data = await this.database.getPersonalData();
          break;
        case 'coupleInfo':
          data = await this.database.getCoupleInfo();
          break;
        case 'relationshipData':
          data = await this.database.getRelationshipData();
          break;
        case 'anniversaryData':
          data = await this.database.getAnniversaryData();
          break;
        case 'firstInteraction':
          data = await this.database.getFirstInteractionDate();
          break;
        case 'memories':
          data = await this.database.getMemories();
          break;
        case 'timeline':
          data = await this.database.getTimeline();
          break;
        case 'messages':
          data = await this.database.getMessages();
          break;
        case 'settings':
          data = await this.database.getSettings();
          break;
        case 'countdownSettings':
          data = await this.database.getCountdownInfo();
          break;
        case 'daysTogether':
          data = await this.database.getDaysTogether();
          break;
        case 'isAnniversaryReached':
          data = await this.database.isAnniversaryReached();
          break;
        default:
          throw new Error(`Unknown data key: ${key}`);
      }

      // Cache the result
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        critical: false
      });

      // Notify subscribers
      this.notifySubscribers(key, data);

      return data;

    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      
      // Return fallback or cached data if available
      if (fallback !== null) {
        return fallback;
      }
      
      if (this.cache.has(key)) {
        console.warn(`Using stale cache for ${key}`);
        return this.cache.get(key).data;
      }
      
      throw error;
    }
  }

  /**
   * Get random message by category
   */
  async getRandomMessage(category = 'encouragement') {
    return await this.database.getRandomMessage(category);
  }

  /**
   * Get seasonal message
   */
  async getSeasonalMessage() {
    return await this.database.getSeasonalMessage();
  }

  /**
   * Get countdown information with real-time calculation
   */
  async getCountdownData() {
    const settings = await this.getData('countdownSettings');
    const personalData = await this.getData('personalData');
    
    const targetDate = new Date(personalData.relationship.anniversary.date);
    const now = new Date();
    const timeRemaining = targetDate.getTime() - now.getTime();
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    return {
      targetDate,
      timeRemaining,
      days,
      hours,
      minutes,
      seconds,
      isActive: timeRemaining > 0,
      settings
    };
  }

  /**
   * Get relationship statistics
   */
  async getRelationshipStats() {
    const personalData = await this.getData('personalData');
    const timeline = await this.getData('timeline');
    
    const firstInteraction = new Date(personalData.relationship.firstInteraction.date);
    const now = new Date();
    const daysTogether = Math.floor((now - firstInteraction) / (1000 * 60 * 60 * 24));
    
    const stats = {
      daysTogether,
      weeksTogether: Math.floor(daysTogether / 7),
      monthsTogether: Math.floor(daysTogether / 30),
      firstInteractionDate: personalData.relationship.firstInteraction.date,
      anniversaryDate: personalData.relationship.anniversary.date,
      milestones: timeline.milestones || {},
      achievements: timeline.achievements || []
    };
    
    return stats;
  }

  /**
   * Subscribe to data changes
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      const keySubscribers = this.subscribers.get(key);
      if (keySubscribers) {
        keySubscribers.delete(callback);
      }
    };
  }

  /**
   * Notify subscribers of data changes
   */
  notifySubscribers(key, data) {
    const keySubscribers = this.subscribers.get(key);
    if (keySubscribers) {
      keySubscribers.forEach(callback => {
        try {
          callback(data, key);
        } catch (error) {
          console.error('Subscriber callback error:', error);
        }
      });
    }
  }

  /**
   * Clear cache for specific key or all keys
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
    console.log(`Cache cleared${key ? ` for ${key}` : ''}`);
  }

  /**
   * Setup network detection
   */
  setupNetworkDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('📡 Back online - refreshing data');
      this.refreshCriticalData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Offline - using cached data');
    });
  }

  /**
   * Refresh critical data when back online
   */
  async refreshCriticalData() {
    if (!this.isOnline) return;

    const criticalKeys = Array.from(this.cache.entries())
      .filter(([key, value]) => value.critical)
      .map(([key]) => key);

    await Promise.all(criticalKeys.map(key => 
      this.getData(key, { useCache: false })
    ));
  }

  /**
   * Export data for debugging/backup
   */
  async exportData() {
    const allData = {};
    
    for (const [key] of this.cache) {
      try {
        allData[key] = await this.getData(key);
      } catch (error) {
        console.warn(`Failed to export ${key}:`, error);
      }
    }
    
    return {
      data: allData,
      meta: {
        exportTime: new Date().toISOString(),
        cacheSize: this.cache.size,
        isOnline: this.isOnline
      }
    };
  }

  /**
   * Get cache information
   */
  getCacheInfo() {
    const info = {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalMemory: 0,
      entries: []
    };

    for (const [key, value] of this.cache) {
      const entry = {
        key,
        timestamp: value.timestamp,
        age: Date.now() - value.timestamp,
        critical: value.critical,
        size: JSON.stringify(value.data).length
      };
      
      info.entries.push(entry);
      info.totalMemory += entry.size;
    }

    return info;
  }

  /**
   * Health check
   */
  async healthCheck() {
    const health = {
      database: false,
      cache: false,
      network: this.isOnline,
      errors: []
    };

    try {
      // Test database
      await this.database.getPersonalData();
      health.database = true;
    } catch (error) {
      health.errors.push(`Database: ${error.message}`);
    }

    try {
      // Test cache
      const testData = await this.getData('personalData');
      health.cache = !!testData;
    } catch (error) {
      health.errors.push(`Cache: ${error.message}`);
    }

    return health;
  }
}

// Create global instance
const dataManager = new DataManager();

// Export for global access
window.dataManager = dataManager;
window.DataManager = DataManager;

export default dataManager;
