
  // Professional Validation System for Business Applications

// CSS for validation feedback
export const VALIDATION_CSS = `
/* Validation System Styles */
.validation-container {
  position: relative;
  margin-bottom: 20px;
}

.validation-message {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  margin-top: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  animation: validation-slide-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes validation-slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-message.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.validation-message.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.validation-message.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.validation-message.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.validation-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.validation-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-primary);
}

.validation-input:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.validation-input.success {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.validation-input.success:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.validation-input.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.validation-input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.validation-input.warning {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.validation-input.warning:focus {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.validation-input.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.02);
}

.validation-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Password Strength Meter */
.password-strength {
  margin-top: 12px;
}

.strength-meter {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-meter-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.strength-meter-fill.weak {
  background: linear-gradient(90deg, #ef4444, #f87171);
  width: 25%;
}

.strength-meter-fill.fair {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  width: 50%;
}

.strength-meter-fill.good {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  width: 75%;
}

.strength-meter-fill.strong {
  background: linear-gradient(90deg, #10b981, #34d399);
  width: 100%;
}

.strength-meter-fill.excellent {
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  width: 100%;
  animation: strength-pulse 2s ease-in-out infinite;
}

@keyframes strength-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.strength-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.strength-text {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.strength-text.weak {
  color: #ef4444;
}

.strength-text.fair {
  color: #f59e0b;
}

.strength-text.good {
  color: #3b82f6;
}

.strength-text.strong {
  color: #10b981;
}

.strength-text.excellent {
  color: #8b5cf6;
}

/* Form Validation State */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.form-label.required::after {
  content: " *";
  color: #ef4444;
}

.form-helper {
  display: block;
  margin-top: 6px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Real-time Validation */
.realtime-validation {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
}

.realtime-validation.show {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.realtime-validation.success {
  color: #10b981;
}

.realtime-validation.error {
  color: #ef4444;
}

.realtime-validation.warning {
  color: #f59e0b;
}

/* Validation Summary */
.validation-summary {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  animation: validation-summary-slide 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes validation-summary-slide {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-summary-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 12px;
}

.validation-summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.validation-summary-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(239, 68, 68, 0.1);
}

.validation-summary-item:last-child {
  border-bottom: none;
}

.validation-summary-item-icon {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.validation-summary-item-text {
  flex: 1;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

/* File Validation */
.file-validation {
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.file-validation:hover {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
}

.file-validation.dragover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.02);
}

.file-validation.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.file-validation.success {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.file-preview {
  margin-top: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-preview-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.file-preview-info {
  flex: 1;
  text-align: left;
}

.file-preview-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.file-preview-size {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.file-preview-remove {
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.file-preview-remove:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* CAPTCHA Validation */
.captcha-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.captcha-challenge {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.9);
  user-select: none;
}

.captcha-input {
  flex: 0 0 120px;
}

.captcha-refresh {
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.captcha-refresh:hover {
  background: rgba(59, 130, 246, 0.1);
}

/* Business Validation */
.business-validation {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
}

.business-validation-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.business-validation-icon {
  font-size: 1.5rem;
  color: #22c55e;
}

.business-validation-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
}

.business-validation-compliance {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.compliance-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  font-size: 0.875rem;
}

.compliance-item.compliant {
  color: #10b981;
}

.compliance-item.non-compliant {
  color: #ef4444;
}

/* Validation Loader */
.validation-loader {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  color: #3b82f6;
  font-size: 0.875rem;
}

.validation-loader-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: validation-spin 1s linear infinite;
}

@keyframes validation-spin {
  to {
    transform: rotate(360deg);
  }
}

/* International Phone Validation */
.phone-validation {
  display: flex;
  gap: 8px;
}

.phone-country {
  flex: 0 0 80px;
}

.phone-number {
  flex: 1;
}

.country-select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.country-select:focus {
  outline: none;
  border-color: #22c55e;
}

.country-flag {
  margin-right: 8px;
}

/* Credit Card Validation */
.credit-card-validation {
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.credit-card-chip {
  width: 40px;
  height: 30px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 6px;
  margin-bottom: 20px;
}

.credit-card-number {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
  color: white;
}

.credit-card-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.credit-card-valid::before {
  content: "VALID THRU";
  display: block;
  font-size: 0.625rem;
  opacity: 0.5;
  margin-bottom: 2px;
}

.credit-card-logo {
  position: absolute;
  bottom: 24px;
  right: 24px;
  font-size: 2rem;
  opacity: 0.8;
}
`;

// Validation error messages
export const VALIDATION_ERRORS = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be at most ${max} characters`,
  PATTERN: 'Please match the requested format',
  MATCH: 'Values do not match',
  URL: 'Please enter a valid URL',
  PHONE: 'Please enter a valid phone number',
  DATE: 'Please enter a valid date',
  NUMBER: 'Please enter a valid number',
  MIN_VALUE: (min) => `Value must be at least ${min}`,
  MAX_VALUE: (max) => `Value must be at most ${max}`,
  CUSTOM: (message) => message
};

// Validation success messages
export const VALIDATION_SUCCESS = {
  EMAIL: 'Email address is valid',
  STRONG_PASSWORD: 'Strong password',
  MATCH: 'Values match',
  VALID_URL: 'URL is valid',
  VALID_PHONE: 'Phone number is valid',
  VALID_DATE: 'Date is valid',
  VALID_NUMBER: 'Number is valid',
  CUSTOM: (message) => message
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  HASHTAG: /^#[a-zA-Z0-9_]+$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  CREDIT_CARD: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/,
  DATE_YYYY_MM_DD: /^\d{4}-\d{2}-\d{2}$/,
  TIME_HH_MM: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
};

// Business validation rules
export const BUSINESS_VALIDATION_RULES = {
  COMPANY_NAME: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s&.,'-]+$/
  },
  VAT_NUMBER: {
    pattern: /^[A-Z]{2}[0-9A-Z]{8,12}$/,
    custom: (value) => validateVATNumber(value)
  },
  SWIFT_CODE: {
    pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
    custom: (value) => validateSwiftCode(value)
  },
  IBAN: {
    pattern: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/,
    custom: (value) => validateIBAN(value)
  }
};

// Validation functions
export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, error: VALIDATION_ERRORS.EMAIL };
  }
  return { isValid: true, success: VALIDATION_SUCCESS.EMAIL };
};

export const validatePassword = (password) => {
  if (!password) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  if (password.length < 8) {
    return { isValid: false, error: VALIDATION_ERRORS.MIN_LENGTH(8) };
  }
  
  const strength = calculatePasswordStrength(password);
  
  if (strength.score >= 4) {
    return { 
      isValid: true, 
      success: VALIDATION_SUCCESS.STRONG_PASSWORD,
      strength 
    };
  }
  
  return { 
    isValid: false, 
    error: 'Password is too weak',
    strength,
    suggestions: getPasswordSuggestions(strength)
  };
};

export const validateUsername = (username) => {
  if (!username) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  if (username.length < 3) {
    return { isValid: false, error: VALIDATION_ERRORS.MIN_LENGTH(3) };
  }
  if (username.length > 20) {
    return { isValid: false, error: VALIDATION_ERRORS.MAX_LENGTH(20) };
  }
  if (!VALIDATION_PATTERNS.USERNAME.test(username)) {
    return { 
      isValid: false, 
      error: 'Only letters, numbers, and underscores allowed'
    };
  }
  
  // Check for reserved usernames
  const reserved = ['admin', 'root', 'system', 'support', 'contact'];
  if (reserved.includes(username.toLowerCase())) {
    return { 
      isValid: false, 
      error: 'This username is reserved'
    };
  }
  
  return { isValid: true };
};

export const validatePhoneNumber = (phone, countryCode = 'US') => {
  if (!phone) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  
  // Basic pattern validation
  if (!VALIDATION_PATTERNS.PHONE.test(phone)) {
    return { isValid: false, error: VALIDATION_ERRORS.PHONE };
  }
  
  // Country-specific validation
  const countryValidators = {
    'US': validateUSPhone,
    'UK': validateUKPhone,
    'DE': validateGermanPhone,
    'FR': validateFrenchPhone,
    'JP': validateJapanesePhone
  };
  
  const validator = countryValidators[countryCode] || validateInternationalPhone;
  return validator(phone);
};

export const validateURL = (url) => {
  if (!url) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return { isValid: true, success: VALIDATION_SUCCESS.VALID_URL };
  } catch {
    return { isValid: false, error: VALIDATION_ERRORS.URL };
  }
};

export const validateCreditCard = (cardNumber, cardType = null) => {
  if (!cardNumber) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check length
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, error: 'Invalid card number length' };
  }
  
  // Luhn algorithm validation
  if (!validateLuhn(cleaned)) {
    return { isValid: false, error: 'Invalid card number' };
  }
  
  // Identify card type
  const detectedType = detectCardType(cleaned);
  if (cardType && detectedType !== cardType) {
    return { isValid: false, error: `Card must be ${cardType}` };
  }
  
  return { 
    isValid: true, 
    success: `Valid ${detectedType || 'credit card'} number`,
    type: detectedType 
  };
};

export const validateDate = (dateString, options = {}) => {
  if (!dateString) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: VALIDATION_ERRORS.DATE };
  }
  
  const { minDate, maxDate, futureOnly, pastOnly } = options;
  const now = new Date();
  
  if (futureOnly && date <= now) {
    return { isValid: false, error: 'Date must be in the future' };
  }
  
  if (pastOnly && date >= now) {
    return { isValid: false, error: 'Date must be in the past' };
  }
  
  if (minDate && date < new Date(minDate)) {
    return { isValid: false, error: `Date must be after ${formatDate(minDate)}` };
  }
  
  if (maxDate && date > new Date(maxDate)) {
    return { isValid: false, error: `Date must be before ${formatDate(maxDate)}` };
  }
  
  return { isValid: true, success: VALIDATION_SUCCESS.VALID_DATE };
};

// Business validation functions
export const validateVATNumber = (vatNumber) => {
  // Simplified VAT validation - in production, use proper API
  if (!vatNumber) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  
  const pattern = /^[A-Z]{2}[0-9A-Z]{8,12}$/;
  if (!pattern.test(vatNumber)) {
    return { isValid: false, error: 'Invalid VAT number format' };
  }
  
  return { isValid: true, success: 'Valid VAT number format' };
};

export const validateSwiftCode = (swiftCode) => {
  if (!swiftCode) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  
  const pattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  if (!pattern.test(swiftCode)) {
    return { isValid: false, error: 'Invalid SWIFT/BIC code format' };
  }
  
  return { isValid: true, success: 'Valid SWIFT/BIC code format' };
};

export const validateIBAN = (iban) => {
  if (!iban) return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  
  // Remove spaces and convert to uppercase
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic format validation
  const pattern = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
  if (!pattern.test(cleaned)) {
    return { isValid: false, error: 'Invalid IBAN format' };
  }
  
  // Simplified check - in production, use proper IBAN validation
  const countryCode = cleaned.substring(0, 2);
  const validCountries = ['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'CH'];
  
  if (!validCountries.includes(countryCode)) {
    return { isValid: false, error: 'Unsupported country code' };
  }
  
  return { isValid: true, success: 'Valid IBAN format' };
};

// Password strength calculator
export const calculatePasswordStrength = (password) => {
  let score = 0;
  const suggestions = [];
  const requirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };
  
  // Score calculation
  if (requirements.length) score += 1;
  if (requirements.lowercase) score += 1;
  if (requirements.uppercase) score += 1;
  if (requirements.number) score += 1;
  if (requirements.special) score += 1;
  
  // Length bonus
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Diversity bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars / password.length >= 0.7) score += 1;
  
  // Determine strength level
  let level = 'weak';
  let color = '#ef4444';
  
  if (score >= 6) {
    level = 'excellent';
    color = '#8b5cf6';
  } else if (score >= 5) {
    level = 'strong';
    color = '#10b981';
  } else if (score >= 4) {
    level = 'good';
    color = '#3b82f6';
  } else if (score >= 3) {
    level = 'fair';
    color = '#f59e0b';
  }
  
  // Generate suggestions
  if (!requirements.length) suggestions.push('Use at least 8 characters');
  if (!requirements.lowercase) suggestions.push('Add lowercase letters');
  if (!requirements.uppercase) suggestions.push('Add uppercase letters');
  if (!requirements.number) suggestions.push('Add numbers');
  if (!requirements.special) suggestions.push('Add special characters (@$!%*?&)');
  if (password.length < 12) suggestions.push('Use 12+ characters for better security');
  
  // Check for common patterns
  const commonPatterns = [
    'password', '123456', 'qwerty', 'admin', 'welcome',
    'letmein', 'monkey', 'dragon', 'baseball', 'football'
  ];
  
  if (commonPatterns.some(pattern => 
    password.toLowerCase().includes(pattern) || 
    pattern.includes(password.toLowerCase())
  )) {
    suggestions.push('Avoid common words and patterns');
    score = Math.max(1, score - 2);
  }
  
  // Check for sequential characters
  if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password) ||
      /(012|123|234|345|456|567|678|789|890)/.test(password)) {
    suggestions.push('Avoid sequential characters');
    score = Math.max(1, score - 1);
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid repeated characters');
    score = Math.max(1, score - 1);
  }
  
  return {
    score: Math.min(7, score),
    level,
    color,
    requirements,
    suggestions,
    percentage: Math.round((score / 7) * 100)
  };
};

// Helper functions
const validateLuhn = (cardNumber) => {
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

const detectCardType = (cardNumber) => {
  // Visa
  if (/^4/.test(cardNumber)) return 'Visa';
  // MasterCard
  if (/^5[1-5]/.test(cardNumber)) return 'MasterCard';
  // American Express
  if (/^3[47]/.test(cardNumber)) return 'American Express';
  // Discover
  if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
  // Diners Club
  if (/^3(?:0[0-5]|[68])/.test(cardNumber)) return 'Diners Club';
  // JCB
  if (/^35/.test(cardNumber)) return 'JCB';
  
  return null;
};

const validateUSPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'))) {
    return { isValid: true, success: VALIDATION_SUCCESS.VALID_PHONE };
  }
  return { isValid: false, error: VALIDATION_ERRORS.PHONE };
};

const validateUKPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10 && cleaned.length <= 13) {
    return { isValid: true, success: VALIDATION_SUCCESS.VALID_PHONE };
  }
  return { isValid: false, error: VALIDATION_ERRORS.PHONE };
};

const validateGermanPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10 && cleaned.length <= 13) {
    return { isValid: true, success: VALIDATION_SUCCESS.VALID_PHONE };
  }
  return { isValid: false, error: VALIDATION_ERRORS.PHONE };
};

const validateFrenchPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9 || cleaned.length === 10) {
    return { isValid: true, success: VALIDATION_SUCCESS.VALID_PHONE };
  }
  return { isValid: false, error: VALIDATION_ERRORS.PHONE };
};

const validateJapanesePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 || cleaned.length === 11) {
    return { isValid: true, success: VALIDATION_SUCCESS.VALID_PHONE };
  }
  return { isValid: false, error: VALIDATION_ERRORS.PHONE };
};

const validateInternationalPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 7 && cleaned.length <= 15) {
    return { isValid: true, success: VALIDATION_SUCCESS.VALID_PHONE };
  }
  return { isValid: false, error: VALIDATION_ERRORS.PHONE };
};

const getPasswordSuggestions = (strength) => {
  const suggestions = [];
  
  if (strength.score < 4) {
    suggestions.push('Use a mix of uppercase and lowercase letters');
    suggestions.push('Include numbers and special characters');
    suggestions.push('Make it at least 12 characters long');
    suggestions.push('Avoid common words and personal information');
  }
  
  return suggestions;
};

// Form validation utility
export const validateForm = (formData, validationRules) => {
  const errors = {};
  const validations = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    const validation = validateField(value, rules);
    
    validations[field] = validation;
    
    if (!validation.isValid) {
      errors[field] = validation.error;
      isValid = false;
    }
  });
  
  return {
    isValid,
    errors,
    validations
  };
};

export const validateField = (value, rules) => {
  if (rules.required && !value) {
    return { isValid: false, error: VALIDATION_ERRORS.REQUIRED };
  }
  
  if (value) {
    if (rules.minLength && value.length < rules.minLength) {
      return { 
        isValid: false, 
        error: VALIDATION_ERRORS.MIN_LENGTH(rules.minLength) 
      };
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      return { 
        isValid: false, 
        error: VALIDATION_ERRORS.MAX_LENGTH(rules.maxLength) 
      };
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return { 
        isValid: false, 
        error: rules.error || VALIDATION_ERRORS.PATTERN 
      };
    }
    
    if (rules.validate && typeof rules.validate === 'function') {
      const customValidation = rules.validate(value);
      if (!customValidation.isValid) {
        return customValidation;
      }
    }
  }
  
  return { isValid: true };
};

// Real-time validation helper
export const createValidationObserver = (element, rules) => {
  let currentValue = '';
  let currentValidation = null;
  
  const validate = (value) => {
    currentValue = value;
    currentValidation = validateField(value, rules);
    return currentValidation;
  };
  
  const isValid = () => currentValidation?.isValid || false;
  
  const getValidation = () => currentValidation;
  
  const reset = () => {
    currentValue = '';
    currentValidation = null;
  };
  
  return {
    validate,
    isValid,
    getValidation,
    reset,
    get value() { return currentValue; }
  };
};

// Export all validators
export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhoneNumber,
  validateURL,
  validateCreditCard,
  validateDate,
  validateVATNumber,
  validateSwiftCode,
  validateIBAN,
  validateForm,
  validateField,
  calculatePasswordStrength,
  createValidationObserver,
  PATTERNS: VALIDATION_PATTERNS,
  ERRORS: VALIDATION_ERRORS,
  SUCCESS: VALIDATION_SUCCESS,
  BUSINESS_RULES: BUSINESS_VALIDATION_RULES
};