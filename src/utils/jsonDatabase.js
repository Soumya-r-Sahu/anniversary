/**
 * JSON Database Manager for Anniversary Website v4.0.0
 * Fast response JSON-based data management system
 */

class JSONDatabase {
  constructor() {
    this.cache = new Map();
    this.config = null;
    this.isInitialized = false;
    this.baseUrl = './assets/json/';
  }

  /**
   * Initialize the database system
   */
  async init() {
    try {
      // Load database configuration first
      this.config = await this.loadJSON('database-config.json');
      
      // Preload all data if enabled
      if (this.config.performance.preloadData) {
        await this.preloadAllData();
      }
      
      this.isInitialized = true;
      console.log('JSON Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize JSON Database:', error);
      this.fallbackToHardcodedData();
    }
  }

  /**
   * Load JSON file with caching
   */
  async loadJSON(filename) {
    // Check cache first
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    try {
      const response = await fetch(`${this.baseUrl}${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the data
      this.cache.set(filename, data);
      
      return data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return this.getFallbackData(filename);
    }
  }

  /**
   * Get personal data (girl/boy info, relationship details)
   */
  async getPersonalData() {
    return await this.loadJSON('personal-data.json');
  }

  /**
   * Get memories and special moments
   */
  async getMemories() {
    return await this.loadJSON('memories.json');
  }

  /**
   * Get timeline and milestone data
   */
  async getTimeline() {
    return await this.loadJSON('timeline.json');
  }

  /**
   * Get messages and quotes
   */
  async getMessages() {
    return await this.loadJSON('messages.json');
  }

  /**
   * Get application settings
   */
  async getSettings() {
    return await this.loadJSON('settings.json');
  }

  /**
   * Get specific couple information
   */
  async getCoupleInfo() {
    const personalData = await this.getPersonalData();
    return personalData.couple;
  }

  /**
   * Get relationship milestones
   */
  async getRelationshipData() {
    const personalData = await this.getPersonalData();
    return personalData.relationship;
  }

  /**
   * Get anniversary information
   */
  async getAnniversaryData() {
    const personalData = await this.getPersonalData();
    return personalData.relationship.anniversary;
  }

  /**
   * Get first interaction date (2024-06-16)
   */
  async getFirstInteractionDate() {
    const personalData = await this.getPersonalData();
    return personalData.relationship.firstInteraction;
  }

  /**
   * Get random message by category
   */
  async getRandomMessage(category = 'encouragement') {
    const messages = await this.getMessages();
    const categoryMessages = messages.messages[category];
    
    if (Array.isArray(categoryMessages)) {
      return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
    }
    
    return "Every moment with you is precious 💕";
  }

  /**
   * Get seasonal message
   */
  async getSeasonalMessage() {
    const messages = await this.getMessages();
    const now = new Date();
    const month = now.getMonth();
    
    let season;
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';
    
    return messages.seasonalMessages[season];
  }

  /**
   * Calculate days together since first interaction
   */
  async getDaysTogether() {
    const personalData = await this.getPersonalData();
    const firstInteraction = new Date(personalData.relationship.firstInteraction.date);
    const now = new Date();
    const diffTime = Math.abs(now - firstInteraction);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Get countdown information
   */
  async getCountdownInfo() {
    const timeline = await this.getTimeline();
    return timeline.countdownSettings;
  }

  /**
   * Check if anniversary has passed
   */
  async isAnniversaryReached() {
    const personalData = await this.getPersonalData();
    const anniversaryDate = new Date(personalData.relationship.anniversary.date);
    const now = new Date();
    return now >= anniversaryDate;
  }

  /**
   * Preload all data for fast access
   */
  async preloadAllData() {
    const files = [
      'personal-data.json',
      'memories.json',
      'timeline.json', 
      'messages.json',
      'settings.json'
    ];
    
    await Promise.all(files.map(file => this.loadJSON(file)));
    console.log('All data preloaded successfully');
  }

  /**
   * Fallback to hardcoded data if JSON fails
   */
  getFallbackData(filename) {
    const fallbacks = {
      'personal-data.json': {
        couple: {
          girl: { name: "Soumya", nickname: "My Soul" },
          boy: { name: "Jerry", nickname: "My Heart" }
        },
        relationship: {
          anniversary: { date: "2025-06-16T00:00:00" },
          firstInteraction: { date: "2024-06-16T00:00:00" }
        }
      },
      'messages.json': {
        messages: {
          encouragement: ["Every moment with you is precious 💕"]
        }
      }
    };
    
    return fallbacks[filename] || {};
  }

  /**
   * Initialize fallback mode
   */
  fallbackToHardcodedData() {
    console.warn('Using fallback hardcoded data');
    this.isInitialized = true;
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache() {
    this.cache.clear();
    console.log('Database cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheInfo() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      isInitialized: this.isInitialized
    };
  }
}

// Export for use in other modules
window.JSONDatabase = JSONDatabase;

// Create global instance
window.db = new JSONDatabase();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.db.init();
  });
} else {
  window.db.init();
}

export default JSONDatabase;
