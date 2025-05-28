/**
 * Throttle and Debounce Utilities
 * Provides performance optimization through function call limiting
 * Version: 2.0.0
 */

class ThrottleUtils {
  /**
   * Throttle function execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce function execution
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
  }

  /**
   * RequestAnimationFrame throttle for smooth animations
   * @param {Function} func - Function to throttle
   * @returns {Function} RAF throttled function
   */
  static rafThrottle(func) {
    let rafId = null;
    return function (...args) {
      const context = this;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          func.apply(context, args);
          rafId = null;
        });
      }
    };
  }

  /**
   * Lead and trail throttle
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @param {Object} options - Options for leading/trailing
   * @returns {Function} Throttled function
   */
  static throttleAdvanced(func, limit, options = {}) {
    const { leading = true, trailing = true } = options;
    let timeout;
    let previous = 0;
    let result;

    const throttled = function (...args) {
      const context = this;
      const now = Date.now();

      if (!previous && leading === false) previous = now;

      const remaining = limit - (now - previous);

      if (remaining <= 0 || remaining > limit) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && trailing !== false) {
        timeout = setTimeout(() => {
          previous = leading === false ? 0 : Date.now();
          timeout = null;
          result = func.apply(context, args);
        }, remaining);
      }

      return result;
    };

    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = null;
    };

    return throttled;
  }

  /**
   * Batch function calls
   * @param {Function} func - Function to batch
   * @param {number} delay - Batch delay in milliseconds
   * @returns {Function} Batched function
   */
  static batch(func, delay = 16) {
    let queue = [];
    let timeoutId;

    return function (...args) {
      queue.push(args);

      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          const batch = queue.slice();
          queue = [];
          timeoutId = null;
          func.call(this, batch);
        }, delay);
      }
    };
  }

  /**
   * Limit concurrent executions
   * @param {Function} func - Async function to limit
   * @param {number} limit - Maximum concurrent executions
   * @returns {Function} Limited function
   */
  static limit(func, limit) {
    let running = 0;
    const queue = [];

    return function (...args) {
      return new Promise((resolve, reject) => {
        queue.push({ args, resolve, reject, context: this });
        process();
      });
    };

    function process() {
      if (running >= limit || queue.length === 0) return;

      running++;
      const { args, resolve, reject, context } = queue.shift();

      Promise.resolve(func.apply(context, args))
        .then(resolve)
        .catch(reject)
        .finally(() => {
          running--;
          process();
        });
    }
  }

  /**
   * Memoize function results
   * @param {Function} func - Function to memoize
   * @param {Function} keyGenerator - Function to generate cache key
   * @returns {Function} Memoized function
   */
  static memoize(func, keyGenerator = JSON.stringify) {
    const cache = new Map();
    const maxSize = 100; // Prevent memory leaks

    const memoized = function (...args) {
      const key = keyGenerator(args);

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = func.apply(this, args);

      // Clean cache if too large
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      cache.set(key, result);
      return result;
    };

    memoized.cache = cache;
    memoized.clear = () => cache.clear();

    return memoized;
  }

  /**
   * Once function - execute only once
   * @param {Function} func - Function to execute once
   * @returns {Function} Once function
   */
  static once(func) {
    let called = false;
    let result;

    return function (...args) {
      if (!called) {
        called = true;
        result = func.apply(this, args);
      }
      return result;
    };
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} func - Async function to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @param {number} baseDelay - Base delay in milliseconds
   * @returns {Function} Retry function
   */
  static retry(func, maxRetries = 3, baseDelay = 1000) {
    return async function (...args) {
      let lastError;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await func.apply(this, args);
        } catch (error) {
          lastError = error;

          if (attempt < maxRetries) {
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError;
    };
  }

  /**
   * Timeout wrapper
   * @param {Function} func - Function to wrap
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Function} Timeout wrapped function
   */
  static timeout(func, timeout) {
    return function (...args) {
      return Promise.race([
        Promise.resolve(func.apply(this, args)),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Function timeout")), timeout),
        ),
      ]);
    };
  }
}

// Global utilities
window.ThrottleUtils = ThrottleUtils;

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = ThrottleUtils;
}

// ES6 exports
export { ThrottleUtils };
export const {
  throttle,
  debounce,
  rafThrottle,
  batch,
  limit,
  memoize,
  once,
  retry,
  timeout,
} = ThrottleUtils;
