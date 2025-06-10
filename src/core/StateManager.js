/**
 * Vanilla JavaScript State Manager - Anniversary Website v4.0.0
 * Pure JavaScript state management without React dependencies
 */

class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.subscribers = new Map();
    this.middlewares = [];
    this.history = [];
    this.maxHistorySize = 50;
    
    // Create reactive proxy for state changes
    this.reactiveState = new Proxy(this.state, {
      set: (target, property, value) => {
        const oldValue = target[property];
        target[property] = value;
        
        // Apply middlewares
        this.applyMiddlewares(property, value, oldValue);
        
        // Add to history
        this.addToHistory(property, value, oldValue);
        
        // Notify subscribers
        this.notify(property, value, oldValue);
        
        // Notify global state change
        this.notifyGlobalChange();
        
        return true;
      },
      
      get: (target, property) => {
        return target[property];
      }
    });
  }

  // Subscribe to state changes
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
        if (keySubscribers.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  // Subscribe to all state changes
  subscribeToAll(callback) {
    return this.subscribe('*', callback);
  }

  // Set state value
  setState(key, value) {
    if (typeof key === 'object') {
      // Batch update multiple keys
      Object.keys(key).forEach(k => {
        this.reactiveState[k] = key[k];
      });
    } else {
      this.reactiveState[key] = value;
    }
  }

  // Get state value
  getState(key) {
    if (key) {
      return this.reactiveState[key];
    }
    return { ...this.reactiveState };
  }

  // Check if state key exists
  hasState(key) {
    return key in this.reactiveState;
  }

  // Delete state key
  deleteState(key) {
    const value = this.reactiveState[key];
    delete this.reactiveState[key];
    this.notify(key, undefined, value);
    return value;
  }

  // Clear all state
  clearState() {
    const oldState = { ...this.reactiveState };
    Object.keys(this.reactiveState).forEach(key => {
      delete this.reactiveState[key];
    });
    this.notify('*', {}, oldState);
  }

  // Add middleware for state changes
  addMiddleware(middleware) {
    this.middlewares.push(middleware);
  }

  // Remove middleware
  removeMiddleware(middleware) {
    const index = this.middlewares.indexOf(middleware);
    if (index > -1) {
      this.middlewares.splice(index, 1);
    }
  }

  // Apply middlewares
  applyMiddlewares(key, newValue, oldValue) {
    this.middlewares.forEach(middleware => {
      try {
        middleware(key, newValue, oldValue, this);
      } catch (error) {
        console.error('State middleware error:', error);
      }
    });
  }

  // Add to history
  addToHistory(key, newValue, oldValue) {
    this.history.push({
      key,
      newValue,
      oldValue,
      timestamp: Date.now()
    });
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  // Get state history
  getHistory() {
    return [...this.history];
  }

  // Get history for specific key
  getKeyHistory(key) {
    return this.history.filter(entry => entry.key === key);
  }

  // Notify subscribers
  notify(key, newValue, oldValue) {
    // Notify specific key subscribers
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        try {
          callback(newValue, oldValue, key);
        } catch (error) {
          console.error('State subscriber error:', error);
        }
      });
    }
    
    // Notify global subscribers
    if (this.subscribers.has('*')) {
      this.subscribers.get('*').forEach(callback => {
        try {
          callback(newValue, oldValue, key);
        } catch (error) {
          console.error('Global state subscriber error:', error);
        }
      });
    }
  }

  // Notify global state change
  notifyGlobalChange() {
    // Dispatch custom event for global state changes
    const event = new CustomEvent('statechange', {
      detail: {
        state: this.getState(),
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(event);
  }

  // Persist state to localStorage
  persist(key = 'anniversary-state') {
    try {
      const serializedState = JSON.stringify(this.getState());
      localStorage.setItem(key, serializedState);
      return true;
    } catch (error) {
      console.error('Failed to persist state:', error);
      return false;
    }
  }

  // Restore state from localStorage
  restore(key = 'anniversary-state') {
    try {
      const serializedState = localStorage.getItem(key);
      if (serializedState) {
        const restoredState = JSON.parse(serializedState);
        this.setState(restoredState);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to restore state:', error);
      return false;
    }
  }

  // Create computed values
  computed(key, computeFn, dependencies = []) {
    const updateComputed = () => {
      const newValue = computeFn(this.getState());
      this.setState(key, newValue);
    };
    
    // Subscribe to dependencies
    dependencies.forEach(dep => {
      this.subscribe(dep, updateComputed);
    });
    
    // Initial computation
    updateComputed();
    
    return () => {
      // Return cleanup function
      dependencies.forEach(dep => {
        const subscribers = this.subscribers.get(dep);
        if (subscribers) {
          subscribers.delete(updateComputed);
        }
      });
    };
  }

  // Watch for specific state changes
  watch(key, callback, immediate = false) {
    if (immediate) {
      callback(this.getState(key), undefined, key);
    }
    return this.subscribe(key, callback);
  }

  // Batch state updates
  batch(updateFn) {
    const originalNotify = this.notify;
    const batchedUpdates = [];
    
    // Temporarily disable notifications
    this.notify = (key, newValue, oldValue) => {
      batchedUpdates.push({ key, newValue, oldValue });
    };
    
    try {
      updateFn(this);
    } finally {
      // Restore original notify function
      this.notify = originalNotify;
      
      // Execute all batched notifications
      batchedUpdates.forEach(({ key, newValue, oldValue }) => {
        this.notify(key, newValue, oldValue);
      });
    }
  }

  // Create a derived state manager
  createDerived(transformFn) {
    const derived = new StateManager();
    
    this.subscribeToAll((newValue, oldValue, key) => {
      const transformedState = transformFn(this.getState());
      derived.setState(transformedState);
    });
    
    return derived;
  }

  // Debug helpers
  debug() {
    console.group('State Manager Debug');
    console.log('Current State:', this.getState());
    console.log('Subscribers:', Array.from(this.subscribers.keys()));
    console.log('History:', this.getHistory());
    console.log('Middlewares:', this.middlewares.length);
    console.groupEnd();
  }

  // Get state size in bytes (approximate)
  getStateSize() {
    const serialized = JSON.stringify(this.getState());
    return new Blob([serialized]).size;
  }

  // Validate state structure
  validate(schema) {
    const state = this.getState();
    const errors = [];
    
    Object.keys(schema).forEach(key => {
      const value = state[key];
      const expectedType = schema[key];
      
      if (value === undefined && expectedType.required) {
        errors.push(`Missing required key: ${key}`);
      } else if (value !== undefined && typeof value !== expectedType.type) {
        errors.push(`Invalid type for ${key}: expected ${expectedType.type}, got ${typeof value}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Destroy state manager
  destroy() {
    this.subscribers.clear();
    this.middlewares = [];
    this.history = [];
    Object.keys(this.reactiveState).forEach(key => {
      delete this.reactiveState[key];
    });
  }
}

// Built-in middlewares
StateManager.middlewares = {
  // Logger middleware
  logger: (key, newValue, oldValue, stateManager) => {
    console.log(`State Change: ${key}`, {
      old: oldValue,
      new: newValue,
      timestamp: new Date().toISOString()
    });
  },
  
  // Persistence middleware
  autoPersist: (key, newValue, oldValue, stateManager) => {
    if (key.startsWith('settings:') || key.startsWith('user:')) {
      stateManager.persist();
    }
  },
  
  // Validation middleware
  validator: (schema) => (key, newValue, oldValue, stateManager) => {
    if (schema[key]) {
      const expectedType = schema[key].type;
      if (newValue !== undefined && typeof newValue !== expectedType) {
        console.warn(`Invalid type for ${key}: expected ${expectedType}, got ${typeof newValue}`);
      }
    }
  },
  
  // Performance monitoring middleware
  performance: (key, newValue, oldValue, stateManager) => {
    const stateSize = stateManager.getStateSize();
    if (stateSize > 1024 * 1024) { // 1MB
      console.warn('State size is getting large:', stateSize, 'bytes');
    }
  }
};

// Make StateManager globally available
window.StateManager = StateManager;

export default StateManager;
