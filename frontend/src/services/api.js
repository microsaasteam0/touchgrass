import React from 'react';
  
  
//   import React from 'react';
 
  
//   /**
//  * TouchGrass API Service - Premium Business API Layer
//  * International-grade API client with advanced features
//  */

// class PremiumAPIService {
//   constructor() {
//     this.baseURL = import.meta.env.REACT_APP_API_URL || 'https://api.touchgrass.now/v1';
//     this.retryAttempts = 3;
//     this.requestTimeout = 30000; // 30 seconds
//     this.cache = new Map();
//     this.requestQueue = new Map();
//     this.activeRequests = 0;
//     this.maxConcurrentRequests = 6;
    
//     // Initialize interceptors
//     this.initInterceptors();
    
//     // Performance monitoring
//     this.metrics = {
//       totalRequests: 0,
//       failedRequests: 0,
//       averageResponseTime: 0,
//       cacheHitRate: 0
//     };
    
//     // Start metrics collection
//     this.startMetricsCollection();
//   }

//   initInterceptors() {
//     // Request interceptor for auth and headers
//     this.interceptors = {
//       request: (config) => {
//         const token = this.getAuthToken();
        
//         // Business analytics header
//         config.headers['X-Client-Version'] = '1.0.0';
//         config.headers['X-Platform'] = 'web';
//         config.headers['X-Business-Tier'] = 'premium';
        
//         if (token) {
//           config.headers['Authorization'] = `Bearer ${token}`;
//         }
        
//         // Add request ID for tracking
//         config.headers['X-Request-ID'] = this.generateRequestId();
        
//         // Add timestamp
//         config.headers['X-Timestamp'] = Date.now();
        
//         return config;
//       },
      
//       response: (response) => {
//         // Log successful response
//         this.logRequestSuccess(response);
        
//         // Cache successful GET requests
//         if (response.config.method === 'get' && response.data) {
//           const cacheKey = this.generateCacheKey(response.config);
//           this.cache.set(cacheKey, {
//             data: response.data,
//             timestamp: Date.now(),
//             headers: response.headers
//           });
//         }
        
//         return response;
//       },
      
//       error: async (error) => {
//         this.metrics.failedRequests++;
        
//         // Retry logic for network errors
//         if (error.config && this.shouldRetry(error)) {
//           return this.retryRequest(error.config);
//         }
        
//         // Handle specific error types
//         this.handleErrorType(error);
        
//         throw error;
//       }
//     };
//   }

//   generateRequestId() {
//     return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }

//   generateCacheKey(config) {
//     return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
//   }

//   getAuthToken() {
//     // Check multiple storage locations for resilience
//     const tokenSources = [
//       () => localStorage.getItem('touchgrass_access_token'),
//       () => localStorage.getItem('access_token'),
//       () => sessionStorage.getItem('touchgrass_access_token'),
//       () => document.cookie.match(/access_token=([^;]+)/)?.[1]
//     ];
    
//     for (const source of tokenSources) {
//       try {
//         const token = source();
//         if (token) return token;
//       } catch (e) {
//         // Continue to next source
//       }
//     }
    
//     return null;
//   }

//   async request(config) {
//     const startTime = performance.now();
//     const requestId = this.generateRequestId();
    
//     // Check cache first for GET requests
//     if (config.method === 'get') {
//       const cacheKey = this.generateCacheKey(config);
//       const cached = this.cache.get(cacheKey);
      
//       if (cached && (Date.now() - cached.timestamp < 60000)) { // 1 minute cache
//         this.metrics.cacheHitRate = ((this.metrics.totalRequests - 1) * this.metrics.cacheHitRate + 1) / this.metrics.totalRequests;
//         return Promise.resolve({ data: cached.data, fromCache: true, headers: cached.headers });
//       }
//     }
    
//     // Queue management for rate limiting
//     if (this.activeRequests >= this.maxConcurrentRequests) {
//       await this.waitForSlot();
//     }
    
//     this.activeRequests++;
//     this.metrics.totalRequests++;
    
//     try {
//       // Apply request interceptor
//       const interceptedConfig = this.interceptors.request({
//         ...config,
//         url: `${this.baseURL}${config.url}`,
//         timeout: this.requestTimeout,
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           ...config.headers
//         }
//       });
      
//       // Make the request
//       const response = await fetch(interceptedConfig.url, {
//         method: config.method || 'get',
//         headers: interceptedConfig.headers,
//         body: config.data ? JSON.stringify(config.data) : undefined,
//         signal: AbortSignal.timeout(this.requestTimeout),
//         credentials: 'include'
//       });
      
//       const responseTime = performance.now() - startTime;
//       this.metrics.averageResponseTime = 
//         ((this.metrics.totalRequests - 1) * this.metrics.averageResponseTime + responseTime) / 
//         this.metrics.totalRequests;
      
//       // Parse response
//       let data;
//       const contentType = response.headers.get('content-type');
      
//       if (contentType && contentType.includes('application/json')) {
//         data = await response.json();
//       } else {
//         data = await response.text();
//       }
      
//       // Create response object
//       const responseObj = {
//         data,
//         status: response.status,
//         statusText: response.statusText,
//         headers: Object.fromEntries(response.headers.entries()),
//         config: interceptedConfig,
//         requestId
//       };
      
//       // Apply response interceptor
//       const interceptedResponse = this.interceptors.response(responseObj);
      
//       // Check for business errors in response
//       if (data && data.error) {
//         throw this.createBusinessError(data.error, responseObj);
//       }
      
//       // Check for rate limiting
//       if (response.status === 429) {
//         const retryAfter = response.headers.get('retry-after') || 5;
//         await this.handleRateLimit(retryAfter);
//         return this.request(config); // Retry the request
//       }
      
//       return interceptedResponse;
      
//     } catch (error) {
//       // Apply error interceptor
//       return this.interceptors.error(error);
//     } finally {
//       this.activeRequests--;
//       this.requestQueue.delete(requestId);
//     }
//   }

//   async waitForSlot() {
//     return new Promise(resolve => {
//       const checkInterval = setInterval(() => {
//         if (this.activeRequests < this.maxConcurrentRequests) {
//           clearInterval(checkInterval);
//           resolve();
//         }
//       }, 100);
//     });
//   }

//   shouldRetry(error) {
//     // Retry on network errors or 5xx status codes
//     const retryableStatuses = [408, 429, 500, 502, 503, 504];
//     const isNetworkError = !error.response && error.message && 
//       (error.message.includes('network') || error.message.includes('timeout'));
    
//     return isNetworkError || 
//            (error.response && retryableStatuses.includes(error.response.status));
//   }

//   async retryRequest(config, attempt = 1) {
//     if (attempt > this.retryAttempts) {
//       throw new Error(`Request failed after ${this.retryAttempts} retries`);
//     }
    
//     // Exponential backoff with jitter
//     const backoffTime = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000);
    
//     await new Promise(resolve => setTimeout(resolve, backoffTime));
    
//     return this.request({
//       ...config,
//       headers: {
//         ...config.headers,
//         'X-Retry-Attempt': attempt
//       }
//     });
//   }

//   handleErrorType(error) {
//     // Business-specific error handling
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // Authentication error - trigger logout
//           this.handleAuthError();
//           break;
//         case 402:
//           // Payment required
//           this.handlePaymentError(error.response.data);
//           break;
//         case 403:
//           // Forbidden - insufficient permissions
//           this.handlePermissionError();
//           break;
//         case 404:
//           // Resource not found
//           this.handleNotFoundError(error.config.url);
//           break;
//         case 422:
//           // Validation error
//           this.handleValidationError(error.response.data.errors);
//           break;
//       }
//     }
    
//     // Log error for business analytics
//     this.logBusinessError(error);
//   }

//   handleAuthError() {
//     // Clear auth tokens
//     localStorage.removeItem('touchgrass_access_token');
//     localStorage.removeItem('access_token');
//     sessionStorage.clear();
    
//     // Redirect to login with return URL
//     const currentPath = window.location.pathname;
//     window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`;
//   }

//   handlePaymentError(data) {
//     // Show premium upgrade modal
//     window.dispatchEvent(new CustomEvent('show-premium-modal', {
//       detail: {
//         reason: data.message,
//         requiredFeature: data.requiredFeature,
//         price: data.price
//       }
//     }));
//   }

//   createBusinessError(errorData, response) {
//     const error = new Error(errorData.message || 'Business error occurred');
//     error.code = errorData.code;
//     error.type = errorData.type;
//     error.severity = errorData.severity || 'medium';
//     error.timestamp = new Date().toISOString();
//     error.response = response;
    
//     // Add business context
//     error.businessContext = {
//       userId: this.getCurrentUserId(),
//       action: response?.config?.url?.split('/').pop(),
//       environment: process.env.NODE_ENV
//     };
    
//     return error;
//   }

//   logRequestSuccess(response) {
//     // Send to analytics service
//     const analyticsData = {
//       event: 'api_request_success',
//       requestId: response.requestId,
//       duration: response.duration,
//       endpoint: response.config.url,
//       status: response.status,
//       timestamp: new Date().toISOString()
//     };
    
//     this.sendToAnalytics(analyticsData);
//   }

//   logBusinessError(error) {
//     // Send to error tracking service
//     const errorData = {
//       event: 'api_request_error',
//       message: error.message,
//       code: error.code,
//       type: error.type,
//       severity: error.severity,
//       endpoint: error.config?.url,
//       status: error.response?.status,
//       timestamp: error.timestamp,
//       businessContext: error.businessContext,
//       stack: error.stack
//     };
    
//     this.sendToErrorTracking(errorData);
//   }

//   sendToAnalytics(data) {
//     // Implementation for analytics service
//     if (window.analytics) {
//       window.analytics.track('api_request', data);
//     }
    
//     // Also log to console in development
//     if (process.env.NODE_ENV === 'development') {
//     }
//   }

//   sendToErrorTracking(data) {
//     // Implementation for error tracking service (Sentry, etc.)
//     if (window.Sentry) {
//       window.Sentry.captureException(new Error(data.message), {
//         extra: data
//       });
//     }
    
//     // Log to console
//     console.error('[API Error]', data);
//   }

//   startMetricsCollection() {
//     // Collect metrics every minute
//     setInterval(() => {
//       this.reportMetrics();
//     }, 60000);
//   }

//   reportMetrics() {
//     const metrics = {
//       ...this.metrics,
//       activeRequests: this.activeRequests,
//       cacheSize: this.cache.size,
//       timestamp: new Date().toISOString()
//     };
    
//     // Send to metrics endpoint
//     if (process.env.NODE_ENV === 'production') {
//       this.request({
//         method: 'post',
//         url: '/metrics',
//         data: metrics
//       }).catch(() => {
//         // Silent fail for metrics
//       });
//     }
//   }

//   getCurrentUserId() {
//     try {
//       const token = this.getAuthToken();
//       if (token) {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         return payload.userId;
//       }
//     } catch (e) {
//       return null;
//     }
//     return null;
//   }

//   // Convenience methods
//   get(url, params = {}, config = {}) {
//     return this.request({
//       method: 'get',
//       url,
//       params,
//       ...config
//     });
//   }

//   post(url, data = {}, config = {}) {
//     return this.request({
//       method: 'post',
//       url,
//       data,
//       ...config
//     });
//   }

//   put(url, data = {}, config = {}) {
//     return this.request({
//       method: 'put',
//       url,
//       data,
//       ...config
//     });
//   }

//   delete(url, config = {}) {
//     return this.request({
//       method: 'delete',
//       url,
//       ...config
//     });
//   }

//   patch(url, data = {}, config = {}) {
//     return this.request({
//       method: 'patch',
//       url,
//       data,
//       ...config
//     });
//   }

//   // File upload with progress
//   upload(url, file, onProgress, config = {}, fieldName = 'file') {
//     const formData = new FormData();
//     formData.append(fieldName, file);

//     return this.request({
//       method: 'post',
//       url,
//       data: formData,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         ...config.headers
//       },
//       onUploadProgress: onProgress
//     });
//   }

//   // Cache management
//   clearCache(pattern = null) {
//     if (pattern) {
//       for (const [key] of this.cache) {
//         if (key.includes(pattern)) {
//           this.cache.delete(key);
//         }
//       }
//     } else {
//       this.cache.clear();
//     }
//   }

//   preheatCache(endpoints) {
//     // Pre-fetch and cache important endpoints
//     endpoints.forEach(endpoint => {
//       this.get(endpoint).catch(() => {
//         // Silent fail for preheating
//       });
//     });
//   }

//   // Subscription to real-time updates
//   subscribe(channel, callback) {
//     if (!this.websocket) {
//       this.initWebSocket();
//     }
    
//     this.websocket.subscribe(channel, callback);
//   }

//   initWebSocket() {
//     // WebSocket implementation for real-time updates
//     // This would connect to your WebSocket server
//   }
// }

// // Export singleton instance
// export default new PremiumAPIService();
// src/services/api.js
import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'https://touchgrass-backend.onrender.com/api';

// Helper to get auth token from Supabase
const getAuthToken = async () => {
  try {
    // First try to get from Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return session.access_token;
    }

    // Check localStorage for Supabase token
    const supabaseStorage = localStorage.getItem('supabase.auth.token');
    if (supabaseStorage) {
      try {
        const parsed = JSON.parse(supabaseStorage);
        if (parsed.currentSession?.access_token) {
          return parsed.currentSession.access_token;
        }
      } catch (e) {
        // Continue to other methods
      }
    }

    // Check for project-specific token
    const projectId = 'lkrwoidwisbwktndxoca';
    const projectToken = localStorage.getItem(`sb-${projectId}-auth-token`);
    if (projectToken) {
      try {
        const parsed = JSON.parse(projectToken);
        if (parsed.access_token) {
          return parsed.access_token;
        }
      } catch (e) {
        // Continue
      }
    }

    // Fallback to old token storage
    const fallbackToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (fallbackToken) {
      return fallbackToken;
    }

    return null;
  } catch (error) {
    return null;
  }
};

// API client with retry logic and error handling
const api = {
  async request(endpoint, options = {}) {
    const token = await getAuthToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: options.method || 'GET',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (options.body && typeof options.body !== 'string') {
      config.body = JSON.stringify(options.body);
    }

    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);

        // Handle 401 Unauthorized
        if (response.status === 401) {
          // Clear invalid tokens
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('sb-lkrwoidwisbwktndxoca-auth-token');
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          
          // Try to refresh session
          const { data: { session: newSession } } = await supabase.auth.getSession();
          if (newSession?.access_token) {
            // Retry with new token
            config.headers['Authorization'] = `Bearer ${newSession.access_token}`;
            continue;
          }
          
          throw new Error('Authentication required. Please log in again.');
        }

        // Handle other error statuses
        if (!response.ok) {
          const errorData = await response.text();
          let errorMessage;
          
          try {
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.message || parsedError.error || `HTTP ${response.status}`;
          } catch {
            errorMessage = errorData || `HTTP ${response.status}`;
          }
          
          throw new Error(errorMessage);
        }

        // Parse successful response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }

      } catch (error) {
        lastError = error;
        retries--;
        
        if (retries > 0) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
          continue;
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  },

  // GET request
  async get(endpoint, params = {}) {
    let url = endpoint;
    if (Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    
    return this.request(url, { method: 'GET' });
  },

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  },

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  },

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
    });
  },

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Upload file with progress
  async upload(endpoint, file, onProgress) {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', `${API_BASE}${endpoint}`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.upload.onprogress = (event) => {
        if (onProgress && event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  }
};

// Specific API endpoints
export const authApi = {
  // Get current user
  getMe: () => api.get('/auth/me'),
  
  // Update profile
  updateProfile: (data) => api.put('/auth/profile', data),
  
  // Update settings
  updateSettings: (data) => api.put('/auth/settings', data),
};

export const streaksApi = {
  // Get current streak
  getCurrent: () => api.get('/streaks/current'),
  
  // Get streak history
  getHistory: (params) => api.get('/streaks/history', params),
  
  // Create streak entry
  create: (data) => api.post('/streaks', data),
  
  // Update streak
  update: (id, data) => api.put(`/streaks/${id}`, data),
  
  // Delete streak
  delete: (id) => api.delete(`/streaks/${id}`),
  
  // Verify streak (check-in)
  verify: (data) => api.post('/streaks/verify', data),
};

export const challengesApi = {
  // Get all available challenges (public)
  getAvailable: () => api.get('/challenges/available'),

  // Get user's joined challenges
  getMyChallenges: () => api.get('/challenges/my-challenges'),

  // Get all challenges (admin)
  getAll: () => api.get('/challenges'),

  // Get user's challenges (alternative)
  getMine: () => api.get('/challenges/mine'),

  // Get challenge by ID
  getById: (id) => api.get(`/challenges/${id}`),

  // Join challenge
  joinChallenge: (challengeId) => api.post(`/challenges/${challengeId}/join`),

  // Leave challenge
  leave: (challengeId) => api.post(`/challenges/${challengeId}/leave`),

  // Create challenge
  create: (data) => api.post('/challenges', data),

  // Update challenge progress
  updateProgress: (userChallengeId, data) => api.post(`/challenges/${userChallengeId}/progress`, data),

  // Complete challenge
  completeChallenge: (userChallengeId) => api.post(`/challenges/${userChallengeId}/complete`),
};

export const leaderboardApi = {
  // Get global leaderboard
  getGlobal: (params) => api.get('/leaderboard/global', params),
  
  // Get friends leaderboard
  getFriends: (params) => api.get('/leaderboard/friends', params),
  
  // Get weekly/monthly rankings
  getRankings: (period = 'weekly') => api.get(`/leaderboard/${period}`),
};

export const socialApi = {
  // Get followers
  getFollowers: () => api.get('/social/followers'),
  
  // Get following
  getFollowing: () => api.get('/social/following'),
  
  // Follow user
  follow: (userId) => api.post(`/social/follow/${userId}`),
  
  // Unfollow user
  unfollow: (userId) => api.post(`/social/unfollow/${userId}`),
  
  // Get user posts
  getPosts: (userId) => api.get(`/social/user/${userId}/posts`),
  
  // Create post
  createPost: (data) => api.post('/social/posts', data),
};

export const verificationWallApi = {
  // Get all verification wall posts
  getPosts: (params = {}) => api.get('/verification-wall', params),
  
  // Get single verification wall post
  getPost: (id) => api.get(`/verification-wall/${id}`),
  
  // Create verification wall post
  createPost: (data) => api.post('/verification-wall', data),
  
  // Like/unlike a verification wall post
  toggleLike: (id) => api.post(`/verification-wall/${id}/like`),
  
  // Add comment to verification wall post
  addComment: (id, text) => api.post(`/verification-wall/${id}/comment`, { text }),
  
  // Report a verification wall post
  reportPost: (id, reason, details) => api.post(`/verification-wall/${id}/report`, { reason, details }),
  
  // Delete a verification wall post
  deletePost: (id) => api.delete(`/verification-wall/${id}`),
};

export const achievementsApi = {
  // Get user achievements
  getMine: () => api.get('/achievements'),
  
  // Get achievement by ID
  getById: (id) => api.get(`/achievements/${id}`),
  
  // Unlock achievement
  unlock: (achievementId) => api.post(`/achievements/${achievementId}/unlock`),
};

export const analyticsApi = {
  // Get user analytics
  getUserAnalytics: (params) => api.get('/analytics/user', params),
  
  // Get challenge analytics
  getChallengeAnalytics: (challengeId) => api.get(`/analytics/challenges/${challengeId}`),
  
  // Get platform analytics (admin)
  getPlatformAnalytics: () => api.get('/analytics/platform'),
};

export const notificationsApi = {
  // Get notifications
  getMine: (params) => api.get('/notifications', params),
  
  // Mark as read
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  
  // Mark all as read
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  // Delete notification
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

// Export the main api object as default
export default api;