const fs = require("fs");
const path = require("path");
const os = require("os");

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.cacheDir = path.join(os.homedir(), ".phantom-cli", "cache");
    this.cacheFile = path.join(this.cacheDir, "query-cache.json");
    this.loadCache();
  }

  /**
   * Load cache from disk
   */
  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, "utf-8");
        const parsed = JSON.parse(data);
        
        // Convert plain object back to Map and check expiry
        Object.entries(parsed).forEach(([key, value]) => {
          if (value.expiresAt > Date.now()) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      // Ignore cache loading errors
    }
  }

  /**
   * Save cache to disk
   */
  saveCache() {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
      
      // Convert Map to plain object
      const cacheObj = {};
      this.cache.forEach((value, key) => {
        if (value.expiresAt > Date.now()) {
          cacheObj[key] = value;
        }
      });
      
      fs.writeFileSync(this.cacheFile, JSON.stringify(cacheObj, null, 2));
    } catch (error) {
      // Ignore cache saving errors
    }
  }

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if not found/expired
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (cached.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.saveCache();
      return null;
    }
    
    return cached.data;
  }

  /**
   * Set data in cache with TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set(key, data, ttl = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
      cachedAt: Date.now(),
    });
    this.saveCache();
  }

  /**
   * Invalidate specific cache key
   * @param {string} key - Cache key to invalidate
   */
  invalidate(key) {
    this.cache.delete(key);
    this.saveCache();
  }

  /**
   * Invalidate cache keys matching a pattern
   * @param {string} pattern - Pattern to match (supports wildcards with *)
   */
  invalidatePattern(pattern) {
    const regex = new RegExp(
      "^" + pattern.replace(/\*/g, ".*") + "$"
    );
    
    const keysToDelete = [];
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach((key) => this.cache.delete(key));
    this.saveCache();
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.saveCache();
  }

  /**
   * Fetch with cache - wrapper around fetch
   * @param {string} cacheKey - Unique cache key
   * @param {Function} fetcher - Async function that fetches the data
   * @param {Object} options - Cache options
   * @param {number} options.ttl - Time to live in milliseconds
   * @param {boolean} options.force - Force refresh even if cached
   * @returns {Promise<any>} Fetched or cached data
   */
  async query(cacheKey, fetcher, options = {}) {
    const { ttl = 5 * 60 * 1000, force = false } = options;
    
    // Check cache first
    if (!force) {
      const cached = this.get(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }
    
    // Fetch fresh data
    const data = await fetcher();
    
    // Cache the result
    this.set(cacheKey, data, ttl);
    
    return data;
  }

  /**
   * Mutate - invalidate cache and optionally update
   * @param {string|string[]} keys - Cache key(s) to invalidate
   * @param {Function} updater - Optional function to update cache optimistically
   */
  mutate(keys, updater = null) {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    
    if (updater) {
      // Optimistic update
      keyArray.forEach((key) => {
        const current = this.get(key);
        if (current !== null) {
          const updated = updater(current);
          this.set(key, updated);
        }
      });
    } else {
      // Just invalidate
      keyArray.forEach((key) => this.invalidate(key));
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;
    
    this.cache.forEach((value) => {
      if (value.expiresAt < now) {
        expired++;
      } else {
        valid++;
      }
    });
    
    return {
      total: this.cache.size,
      valid,
      expired,
      cacheFile: this.cacheFile,
    };
  }
}

// Singleton instance
const cacheManager = new CacheManager();

module.exports = { cacheManager, CacheManager };
