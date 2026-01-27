
  /**
 * TouchGrass API Service - Premium Business API Layer
 * International-grade API client with advanced features
 */

class PremiumAPIService {
  constructor() {
    this.baseURL = import.meta.env.REACT_APP_API_URL || 'https://api.touchgrass.now/v1';
    this.retryAttempts = 3;
    this.requestTimeout = 30000; // 30 seconds
    this.cache = new Map();
    this.requestQueue = new Map();
    this.activeRequests = 0;
    this.maxConcurrentRequests = 6;
    
    // Initialize interceptors
    this.initInterceptors();
    
    // Performance monitoring
    this.metrics = {
      totalRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      cacheHitRate: 0
    };
    
    // Start metrics collection
    this.startMetricsCollection();
  }

  initInterceptors() {
    // Request interceptor for auth and headers
    this.interceptors = {
      request: (config) => {
        const token = this.getAuthToken();
        
        // Business analytics header
        config.headers['X-Client-Version'] = '1.0.0';
        config.headers['X-Platform'] = 'web';
        config.headers['X-Business-Tier'] = 'premium';
        
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();
        
        // Add timestamp
        config.headers['X-Timestamp'] = Date.now();
        
        return config;
      },
      
      response: (response) => {
        // Log successful response
        this.logRequestSuccess(response);
        
        // Cache successful GET requests
        if (response.config.method === 'get' && response.data) {
          const cacheKey = this.generateCacheKey(response.config);
          this.cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
            headers: response.headers
          });
        }
        
        return response;
      },
      
      error: async (error) => {
        this.metrics.failedRequests++;
        
        // Retry logic for network errors
        if (error.config && this.shouldRetry(error)) {
          return this.retryRequest(error.config);
        }
        
        // Handle specific error types
        this.handleErrorType(error);
        
        throw error;
      }
    };
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateCacheKey(config) {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
  }

  getAuthToken() {
    // Check multiple storage locations for resilience
    const tokenSources = [
      () => localStorage.getItem('touchgrass_access_token'),
      () => localStorage.getItem('access_token'),
      () => sessionStorage.getItem('touchgrass_access_token'),
      () => document.cookie.match(/access_token=([^;]+)/)?.[1]
    ];
    
    for (const source of tokenSources) {
      try {
        const token = source();
        if (token) return token;
      } catch (e) {
        // Continue to next source
      }
    }
    
    return null;
  }

  async request(config) {
    const startTime = performance.now();
    const requestId = this.generateRequestId();
    
    // Check cache first for GET requests
    if (config.method === 'get') {
      const cacheKey = this.generateCacheKey(config);
      const cached = this.cache.get(cacheKey);
      
      if (cached && (Date.now() - cached.timestamp < 60000)) { // 1 minute cache
        this.metrics.cacheHitRate = ((this.metrics.totalRequests - 1) * this.metrics.cacheHitRate + 1) / this.metrics.totalRequests;
        return Promise.resolve({ data: cached.data, fromCache: true, headers: cached.headers });
      }
    }
    
    // Queue management for rate limiting
    if (this.activeRequests >= this.maxConcurrentRequests) {
      await this.waitForSlot();
    }
    
    this.activeRequests++;
    this.metrics.totalRequests++;
    
    try {
      // Apply request interceptor
      const interceptedConfig = this.interceptors.request({
        ...config,
        url: `${this.baseURL}${config.url}`,
        timeout: this.requestTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers
        }
      });
      
      // Make the request
      const response = await fetch(interceptedConfig.url, {
        method: config.method || 'get',
        headers: interceptedConfig.headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
        signal: AbortSignal.timeout(this.requestTimeout),
        credentials: 'include'
      });
      
      const responseTime = performance.now() - startTime;
      this.metrics.averageResponseTime = 
        ((this.metrics.totalRequests - 1) * this.metrics.averageResponseTime + responseTime) / 
        this.metrics.totalRequests;
      
      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // Create response object
      const responseObj = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config: interceptedConfig,
        requestId
      };
      
      // Apply response interceptor
      const interceptedResponse = this.interceptors.response(responseObj);
      
      // Check for business errors in response
      if (data && data.error) {
        throw this.createBusinessError(data.error, responseObj);
      }
      
      // Check for rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after') || 5;
        await this.handleRateLimit(retryAfter);
        return this.request(config); // Retry the request
      }
      
      return interceptedResponse;
      
    } catch (error) {
      // Apply error interceptor
      return this.interceptors.error(error);
    } finally {
      this.activeRequests--;
      this.requestQueue.delete(requestId);
    }
  }

  async waitForSlot() {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (this.activeRequests < this.maxConcurrentRequests) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  shouldRetry(error) {
    // Retry on network errors or 5xx status codes
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const isNetworkError = !error.response && error.message && 
      (error.message.includes('network') || error.message.includes('timeout'));
    
    return isNetworkError || 
           (error.response && retryableStatuses.includes(error.response.status));
  }

  async retryRequest(config, attempt = 1) {
    if (attempt > this.retryAttempts) {
      throw new Error(`Request failed after ${this.retryAttempts} retries`);
    }
    
    // Exponential backoff with jitter
    const backoffTime = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000);
    
    await new Promise(resolve => setTimeout(resolve, backoffTime));
    
    return this.request({
      ...config,
      headers: {
        ...config.headers,
        'X-Retry-Attempt': attempt
      }
    });
  }

  handleErrorType(error) {
    // Business-specific error handling
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Authentication error - trigger logout
          this.handleAuthError();
          break;
        case 402:
          // Payment required
          this.handlePaymentError(error.response.data);
          break;
        case 403:
          // Forbidden - insufficient permissions
          this.handlePermissionError();
          break;
        case 404:
          // Resource not found
          this.handleNotFoundError(error.config.url);
          break;
        case 422:
          // Validation error
          this.handleValidationError(error.response.data.errors);
          break;
      }
    }
    
    // Log error for business analytics
    this.logBusinessError(error);
  }

  handleAuthError() {
    // Clear auth tokens
    localStorage.removeItem('touchgrass_access_token');
    localStorage.removeItem('access_token');
    sessionStorage.clear();
    
    // Redirect to login with return URL
    const currentPath = window.location.pathname;
    window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`;
  }

  handlePaymentError(data) {
    // Show premium upgrade modal
    window.dispatchEvent(new CustomEvent('show-premium-modal', {
      detail: {
        reason: data.message,
        requiredFeature: data.requiredFeature,
        price: data.price
      }
    }));
  }

  createBusinessError(errorData, response) {
    const error = new Error(errorData.message || 'Business error occurred');
    error.code = errorData.code;
    error.type = errorData.type;
    error.severity = errorData.severity || 'medium';
    error.timestamp = new Date().toISOString();
    error.response = response;
    
    // Add business context
    error.businessContext = {
      userId: this.getCurrentUserId(),
      action: response?.config?.url?.split('/').pop(),
      environment: process.env.NODE_ENV
    };
    
    return error;
  }

  logRequestSuccess(response) {
    // Send to analytics service
    const analyticsData = {
      event: 'api_request_success',
      requestId: response.requestId,
      duration: response.duration,
      endpoint: response.config.url,
      status: response.status,
      timestamp: new Date().toISOString()
    };
    
    this.sendToAnalytics(analyticsData);
  }

  logBusinessError(error) {
    // Send to error tracking service
    const errorData = {
      event: 'api_request_error',
      message: error.message,
      code: error.code,
      type: error.type,
      severity: error.severity,
      endpoint: error.config?.url,
      status: error.response?.status,
      timestamp: error.timestamp,
      businessContext: error.businessContext,
      stack: error.stack
    };
    
    this.sendToErrorTracking(errorData);
  }

  sendToAnalytics(data) {
    // Implementation for analytics service
    if (window.analytics) {
      window.analytics.track('api_request', data);
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', data);
    }
  }

  sendToErrorTracking(data) {
    // Implementation for error tracking service (Sentry, etc.)
    if (window.Sentry) {
      window.Sentry.captureException(new Error(data.message), {
        extra: data
      });
    }
    
    // Log to console
    console.error('[API Error]', data);
  }

  startMetricsCollection() {
    // Collect metrics every minute
    setInterval(() => {
      this.reportMetrics();
    }, 60000);
  }

  reportMetrics() {
    const metrics = {
      ...this.metrics,
      activeRequests: this.activeRequests,
      cacheSize: this.cache.size,
      timestamp: new Date().toISOString()
    };
    
    // Send to metrics endpoint
    if (process.env.NODE_ENV === 'production') {
      this.request({
        method: 'post',
        url: '/metrics',
        data: metrics
      }).catch(() => {
        // Silent fail for metrics
      });
    }
  }

  getCurrentUserId() {
    try {
      const token = this.getAuthToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // Convenience methods
  get(url, params = {}, config = {}) {
    return this.request({
      method: 'get',
      url,
      params,
      ...config
    });
  }

  post(url, data = {}, config = {}) {
    return this.request({
      method: 'post',
      url,
      data,
      ...config
    });
  }

  put(url, data = {}, config = {}) {
    return this.request({
      method: 'put',
      url,
      data,
      ...config
    });
  }

  delete(url, config = {}) {
    return this.request({
      method: 'delete',
      url,
      ...config
    });
  }

  patch(url, data = {}, config = {}) {
    return this.request({
      method: 'patch',
      url,
      data,
      ...config
    });
  }

  // File upload with progress
  upload(url, file, onProgress, config = {}, fieldName = 'file') {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.request({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      },
      onUploadProgress: onProgress
    });
  }

  // Cache management
  clearCache(pattern = null) {
    if (pattern) {
      for (const [key] of this.cache) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  preheatCache(endpoints) {
    // Pre-fetch and cache important endpoints
    endpoints.forEach(endpoint => {
      this.get(endpoint).catch(() => {
        // Silent fail for preheating
      });
    });
  }

  // Subscription to real-time updates
  subscribe(channel, callback) {
    if (!this.websocket) {
      this.initWebSocket();
    }
    
    this.websocket.subscribe(channel, callback);
  }

  initWebSocket() {
    // WebSocket implementation for real-time updates
    // This would connect to your WebSocket server
  }
}

// Export singleton instance
export default new PremiumAPIService();