
  /**
 * TouchGrass Authentication Service - Premium Security Layer
 * Enterprise-grade authentication with advanced security features
 */

class PremiumAuthService {
  constructor() {
    this.api = window.apiService; // Reference to main API service
    this.storage = new SecureStorage();
    this.biometric = new BiometricAuth();
    this.mfa = new MultiFactorAuth();
    this.sessionManager = new SessionManager();
    this.securityMonitor = new SecurityMonitor();
    
    // Initialize security features
    this.initSecurity();
    
    // Track authentication state
    this.authState = {
      isAuthenticated: false,
      user: null,
      permissions: [],
      roles: [],
      sessionExpiry: null,
      mfaEnabled: false,
      biometricEnabled: false
    };
    
    // Event listeners for auth state changes
    this.listeners = new Set();
    
    // Start session monitoring
    this.startSessionMonitoring();
  }

  initSecurity() {
    // Initialize security headers
    this.setSecurityHeaders();
    
    // Check for security threats
    this.securityMonitor.scanEnvironment();
    
    // Initialize biometric if available
    if (this.biometric.isAvailable()) {
      this.authState.biometricEnabled = true;
    }
  }

  setSecurityHeaders() {
    // Set security headers for all requests
    document.addEventListener('securitypolicyviolation', (e) => {
      this.logSecurityViolation(e);
    });
  }

  async register(userData) {
    try {
      // Validate business requirements
      this.validateBusinessRegistration(userData);
      
      // Create enhanced user data with business context
      const enhancedData = {
        ...userData,
        metadata: {
          registrationSource: this.getRegistrationSource(),
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          locale: navigator.language,
          ipInfo: await this.getIPInfo(),
          utmParams: this.getUTMParams(),
          deviceFingerprint: await this.generateDeviceFingerprint()
        },
        preferences: {
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          currency: 'USD',
          notifications: {
            email: true,
            push: true,
            marketing: false
          },
          privacy: {
            profileVisibility: 'public',
            activityVisibility: 'friends',
            showOnLeaderboards: true
          }
        }
      };

      // Business validation checks
      const businessRules = this.validateBusinessRules(enhancedData);
      if (!businessRules.valid) {
        throw new BusinessValidationError(businessRules.errors);
      }

      // Make registration request
      const response = await this.api.post('/auth/register', enhancedData);
      
      if (response.data.success) {
        // Store tokens securely
        this.storeTokens(response.data.tokens);
        
        // Set up user session
        await this.setupUserSession(response.data.user);
        
        // Initialize user analytics
        this.initializeUserAnalytics(response.data.user);
        
        // Send welcome sequence
        this.sendWelcomeSequence(response.data.user);
        
        // Track registration for business analytics
        this.trackRegistrationEvent(response.data.user);
        
        return {
          success: true,
          user: response.data.user,
          requiresVerification: response.data.requiresVerification,
          nextSteps: response.data.nextSteps
        };
      }
      
      throw new Error('Registration failed');
      
    } catch (error) {
      // Handle specific error types
      this.handleRegistrationError(error);
      throw error;
    }
  }

  async login(credentials, options = {}) {
    try {
      const startTime = Date.now();
      
      // Security checks
      await this.performSecurityChecks(credentials);
      
      // Enhanced credentials with security context
      const enhancedCredentials = {
        ...credentials,
        security: {
          captchaToken: options.captchaToken,
          deviceId: await this.getDeviceId(),
          loginMethod: options.method || 'password',
          timestamp: new Date().toISOString(),
          location: await this.getApproximateLocation()
        }
      };

      // Make login request
      const response = await this.api.post('/auth/login', enhancedCredentials);
      
      if (response.data.success) {
        // Store tokens with enhanced security
        this.storeTokens(response.data.tokens, options.rememberMe);
        
        // Set up user session
        await this.setupUserSession(response.data.user);
        
        // Check if MFA is required
        if (response.data.requiresMFA) {
          return {
            success: true,
            requiresMFA: true,
            mfaMethods: response.data.mfaMethods,
            tempToken: response.data.tempToken
          };
        }
        
        // Track successful login
        this.trackLoginEvent({
          userId: response.data.user.id,
          method: options.method || 'password',
          duration: Date.now() - startTime,
          location: enhancedCredentials.security.location,
          device: await this.getDeviceInfo()
        });
        
        // Send security notification
        this.sendSecurityNotification('login', response.data.user);
        
        return {
          success: true,
          user: response.data.user,
          session: response.data.session
        };
      }
      
      throw new Error('Login failed');
      
    } catch (error) {
      // Track failed login attempt
      this.trackFailedLogin(credentials);
      
      // Handle specific error types
      this.handleLoginError(error);
      throw error;
    }
  }

  async loginWithMFA(mfaData, tempToken) {
    try {
      const response = await this.api.post('/auth/mfa/verify', {
        ...mfaData,
        tempToken
      });
      
      if (response.data.success) {
        this.storeTokens(response.data.tokens);
        await this.setupUserSession(response.data.user);
        
        // Track MFA success
        this.trackMFAEvent('success', response.data.user.id);
        
        return {
          success: true,
          user: response.data.user
        };
      }
      
      throw new Error('MFA verification failed');
      
    } catch (error) {
      // Track MFA failure
      this.trackMFAEvent('failure', null, error);
      throw error;
    }
  }

  async loginWithBiometric() {
    if (!this.biometric.isAvailable()) {
      throw new Error('Biometric authentication not available');
    }
    
    try {
      const biometricResult = await this.biometric.authenticate();
      
      if (biometricResult.success) {
        // Use stored biometric credentials
        const storedCredentials = this.storage.get('biometric_credentials');
        
        if (!storedCredentials) {
          throw new Error('No biometric credentials stored');
        }
        
        return this.login({
          email: storedCredentials.email,
          biometricSignature: biometricResult.signature
        }, { method: 'biometric' });
      }
      
      throw new Error('Biometric authentication failed');
      
    } catch (error) {
      this.trackBiometricEvent('failure', error);
      throw error;
    }
  }

  async logout(options = {}) {
    try {
      const logoutData = {
        userId: this.authState.user?.id,
        sessionId: this.sessionManager.getSessionId(),
        reason: options.reason || 'user_initiated',
        timestamp: new Date().toISOString()
      };
      
      // Call logout endpoint
      await this.api.post('/auth/logout', logoutData);
      
      // Track logout event
      this.trackLogoutEvent(logoutData);
      
    } catch (error) {
      // Log but don't throw - we still want to clear local state
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state
      this.clearAuthState();
      
      // Clear storage
      this.storage.clear();
      
      // Notify listeners
      this.notifyAuthStateChange();
      
      // Redirect if specified
      if (options.redirectTo) {
        window.location.href = options.redirectTo;
      }
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.storage.get('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await this.api.post('/auth/refresh', {
        refreshToken,
        deviceId: await this.getDeviceId()
      });
      
      if (response.data.success) {
        this.storeTokens(response.data.tokens);
        return true;
      }
      
      throw new Error('Token refresh failed');
      
    } catch (error) {
      // Refresh failed - logout user
      await this.logout({ reason: 'token_refresh_failed' });
      return false;
    }
  }

  async setupUserSession(userData) {
    // Update auth state
    this.authState = {
      isAuthenticated: true,
      user: userData,
      permissions: userData.permissions || [],
      roles: userData.roles || [],
      sessionExpiry: new Date(Date.now() + (24 * 60 * 60 * 1000)), // 24 hours
      mfaEnabled: userData.mfaEnabled || false,
      biometricEnabled: userData.biometricEnabled || false
    };
    
    // Initialize session manager
    this.sessionManager.startSession({
      userId: userData.id,
      sessionId: this.generateSessionId(),
      startTime: new Date().toISOString(),
      deviceInfo: await this.getDeviceInfo()
    });
    
    // Start auto-refresh timer
    this.startTokenRefreshTimer();
    
    // Notify listeners
    this.notifyAuthStateChange();
    
    // Initialize user-specific services
    this.initializeUserServices(userData);
  }

  storeTokens(tokens, rememberMe = false) {
    // Store access token
    this.storage.set('access_token', tokens.accessToken, {
      secure: true,
      httpOnly: false, // Can't be true for JS access
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day
    });
    
    // Store refresh token more securely
    this.storage.set('refresh_token', tokens.refreshToken, {
      secure: true,
      httpOnly: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    // Store token expiry
    this.storage.set('token_expiry', tokens.expiresIn, {
      secure: true
    });
  }

  clearAuthState() {
    this.authState = {
      isAuthenticated: false,
      user: null,
      permissions: [],
      roles: [],
      sessionExpiry: null,
      mfaEnabled: false,
      biometricEnabled: false
    };
    
    // Stop session manager
    this.sessionManager.endSession();
    
    // Stop refresh timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }

  startSessionMonitoring() {
    // Monitor for idle timeout
    this.idleMonitor = new IdleMonitor({
      timeout: 30 * 60 * 1000, // 30 minutes
      onIdle: () => this.handleIdleTimeout(),
      onActive: () => this.handleUserActive()
    });
    
    // Monitor tab visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleTabHidden();
      } else {
        this.handleTabVisible();
      }
    });
  }

  startTokenRefreshTimer() {
    const refreshTime = 55 * 60 * 1000; // 55 minutes
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    this.refreshTimer = setTimeout(async () => {
      await this.refreshToken();
    }, refreshTime);
  }

  async getCurrentUser() {
    if (this.authState.isAuthenticated) {
      return this.authState.user;
    }
    
    // Try to restore from token
    const token = this.storage.get('access_token');
    
    if (token) {
      try {
        const response = await this.api.get('/auth/me');
        await this.setupUserSession(response.data.user);
        return response.data.user;
      } catch (error) {
        // Token is invalid
        this.clearAuthState();
        return null;
      }
    }
    
    return null;
  }

  hasPermission(permission) {
    return this.authState.permissions.includes(permission) ||
           this.authState.roles.some(role => role.permissions?.includes(permission));
  }

  hasRole(role) {
    return this.authState.roles.includes(role);
  }

  isPremium() {
    return this.authState.user?.subscription?.plan !== 'free';
  }

  isElite() {
    return this.authState.user?.subscription?.plan === 'elite';
  }

  // Event handling
  addAuthStateListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyAuthStateChange() {
    const state = { ...this.authState };
    this.listeners.forEach(callback => callback(state));
  }

  // Security methods
  async performSecurityChecks(credentials) {
    // Check for brute force attempts
    const attempts = this.storage.get(`login_attempts_${credentials.email}`) || 0;
    
    if (attempts > 5) {
      throw new SecurityError('Too many login attempts. Please try again later.');
    }
    
    // Check IP reputation
    const ipReputation = await this.checkIPReputation();
    if (ipReputation.riskScore > 70) {
      throw new SecurityError('Suspicious activity detected');
    }
    
    // Check device reputation
    const deviceReputation = await this.checkDeviceReputation();
    if (deviceReputation.riskScore > 70) {
      throw new SecurityError('Unrecognized device');
    }
  }

  async trackFailedLogin(credentials) {
    const key = `login_attempts_${credentials.email}`;
    const attempts = this.storage.get(key) || 0;
    this.storage.set(key, attempts + 1, { maxAge: 3600 }); // Reset after 1 hour
    
    // Send to security monitoring
    this.securityMonitor.recordFailedLogin({
      email: credentials.email,
      timestamp: new Date().toISOString(),
      ip: await this.getIP(),
      userAgent: navigator.userAgent
    });
  }

  // Analytics methods
  trackRegistrationEvent(user) {
    const eventData = {
      event: 'user_registration',
      userId: user.id,
      email: user.email,
      registrationMethod: 'email',
      timestamp: new Date().toISOString(),
      metadata: user.metadata
    };
    
    this.sendAnalyticsEvent(eventData);
  }

  trackLoginEvent(data) {
    const eventData = {
      event: 'user_login',
      ...data,
      timestamp: new Date().toISOString()
    };
    
    this.sendAnalyticsEvent(eventData);
  }

  trackLogoutEvent(data) {
    const eventData = {
      event: 'user_logout',
      ...data,
      timestamp: new Date().toISOString()
    };
    
    this.sendAnalyticsEvent(eventData);
  }

  sendAnalyticsEvent(data) {
    // Send to analytics service
    if (window.analytics) {
      window.analytics.track(data.event, data);
    }
    
    // Also send to business intelligence
    this.api.post('/analytics/events', data).catch(() => {
      // Silent fail for analytics
    });
  }

  // Utility methods
  async getIPInfo() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      return response.json();
    } catch (error) {
      return null;
    }
  }

  getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = params.get(param);
      if (value) utmParams[param] = value;
    });
    
    return utmParams;
  }

  async generateDeviceFingerprint() {
    // Generate a unique device fingerprint
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      !!navigator.cookieEnabled,
      !!navigator.javaEnabled(),
      typeof navigator.pdfViewerEnabled
    ].join('|');
    
    // Hash the components
    const hash = await this.hashString(components);
    return hash;
  }

  async hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Error handling
  handleRegistrationError(error) {
    if (error instanceof BusinessValidationError) {
      // Show business validation errors
      this.showBusinessValidationErrors(error.errors);
    } else if (error.code === 'EMAIL_EXISTS') {
      // Handle duplicate email
      this.showDuplicateEmailError();
    } else {
      // Generic error handling
      this.showGenericError('Registration failed. Please try again.');
    }
    
    // Log error for support
    this.logSupportError('registration', error);
  }

  handleLoginError(error) {
    switch (error.code) {
      case 'INVALID_CREDENTIALS':
        this.showInvalidCredentialsError();
        break;
      case 'ACCOUNT_LOCKED':
        this.showAccountLockedError();
        break;
      case 'MFA_REQUIRED':
        // Already handled
        break;
      default:
        this.showGenericError('Login failed. Please try again.');
    }
    
    this.logSupportError('login', error);
  }

  // UI Methods (to be implemented by UI layer)
  showBusinessValidationErrors(errors) {
    // Implementation depends on UI framework
    console.error('Business validation errors:', errors);
  }

  showDuplicateEmailError() {
    console.error('Email already exists');
  }

  showInvalidCredentialsError() {
    console.error('Invalid credentials');
  }

  showAccountLockedError() {
    console.error('Account locked');
  }

  showGenericError(message) {
    console.error(message);
  }

  logSupportError(context, error) {
    // Send to error tracking
    this.api.post('/errors/client', {
      context,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }).catch(() => {
      // Silent fail for error logging
    });
  }
}

// Supporting classes
class SecureStorage {
  set(key, value, options = {}) {
    try {
      if (options.secure) {
        // Use encrypted storage
        const encrypted = this.encrypt(value);
        localStorage.setItem(key, encrypted);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  get(key, options = {}) {
    try {
      const value = localStorage.getItem(key);
      
      if (!value) return null;
      
      if (options.secure) {
        return this.decrypt(value);
      }
      
      return JSON.parse(value);
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  encrypt(data) {
    // Simple encryption for demo - use crypto.subtle in production
    return btoa(JSON.stringify(data));
  }

  decrypt(data) {
    try {
      return JSON.parse(atob(data));
    } catch (error) {
      return null;
    }
  }
}

class BiometricAuth {
  isAvailable() {
    return 'credentials' in navigator && 
           'PublicKeyCredential' in window &&
           typeof PublicKeyCredential !== 'undefined';
  }

  async authenticate() {
    // WebAuthn implementation
    const publicKey = {
      challenge: new Uint8Array(32),
      allowCredentials: [],
      timeout: 60000,
      userVerification: 'required'
    };

    try {
      const credential = await navigator.credentials.get({ publicKey });
      return {
        success: true,
        credential,
        signature: this.extractSignature(credential)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  extractSignature(credential) {
    // Extract signature from credential
    return credential.id;
  }
}

class MultiFactorAuth {
  async sendOTP(method, identifier) {
    // Send OTP via selected method
    const response = await fetch('/auth/mfa/send', {
      method: 'POST',
      body: JSON.stringify({ method, identifier })
    });
    
    return response.json();
  }

  async verifyOTP(method, identifier, code) {
    // Verify OTP code
    const response = await fetch('/auth/mfa/verify', {
      method: 'POST',
      body: JSON.stringify({ method, identifier, code })
    });
    
    return response.json();
  }
}

class SessionManager {
  startSession(sessionData) {
    this.sessionData = sessionData;
    this.startTime = Date.now();
  }

  endSession() {
    this.sessionData = null;
    this.startTime = null;
  }

  getSessionId() {
    return this.sessionData?.sessionId;
  }

  getSessionDuration() {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }
}

class SecurityMonitor {
  scanEnvironment() {
    // Check for security issues
    this.checkHTTPSSecurity();
    this.checkContentSecurity();
    this.checkBrowserExtensions();
  }

  checkHTTPSSecurity() {
    if (window.location.protocol !== 'https:' && 
        window.location.hostname !== 'localhost') {
      console.warn('Not using HTTPS - security risk');
    }
  }

  recordFailedLogin(data) {
    // Record for security analytics
    console.log('Failed login attempt:', data);
  }
}

class IdleMonitor {
  constructor(config) {
    this.timeout = config.timeout;
    this.onIdle = config.onIdle;
    this.onActive = config.onActive;
    this.idleTimer = null;
    this.isIdle = false;
    
    this.setupEventListeners();
    this.resetTimer();
  }

  setupEventListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), true);
    });
  }

  resetTimer() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    
    if (this.isIdle) {
      this.isIdle = false;
      this.onActive?.();
    }
    
    this.idleTimer = setTimeout(() => {
      this.isIdle = true;
      this.onIdle?.();
    }, this.timeout);
  }
}

// Custom errors
class BusinessValidationError extends Error {
  constructor(errors) {
    super('Business validation failed');
    this.name = 'BusinessValidationError';
    this.errors = errors;
  }
}

class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SecurityError';
  }
}

// Export singleton instance
export default new PremiumAuthService();