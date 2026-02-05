import React from 'react';
  

  // Professional Formatters for International Business

// CSS for formatted elements
export const FORMATTERS_CSS = `
/* Formatted Number Styles */
.formatted-number {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

/* Currency Display */
.currency-display {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
}

.currency-symbol {
  font-size: 0.8em;
  opacity: 0.8;
}

.currency-amount {
  font-weight: 700;
}

.currency-code {
  font-size: 0.7em;
  opacity: 0.6;
  margin-left: 4px;
}

/* Percentage Display */
.percentage-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.percentage-value {
  font-weight: 600;
}

.percentage-symbol {
  font-size: 0.8em;
  opacity: 0.8;
}

/* Date & Time Display */
.date-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.time-display {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.datetime-tooltip {
  position: relative;
  cursor: help;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.3);
}

.datetime-tooltip::after {
  content: attr(data-full);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 1000;
  min-width: 200px;
  text-align: center;
}

.datetime-tooltip:hover::after {
  opacity: 1;
}

/* Progress Formatters */
.progress-formatted {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar-container {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: progress-shimmer 2s infinite;
}

@keyframes progress-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Countup Animation */
.countup-container {
  display: inline-block;
  position: relative;
}

.countup-value {
  font-weight: 700;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.countup-prefix,
.countup-suffix {
  opacity: 0.7;
  font-size: 0.9em;
}

/* File Size Formatter */
.file-size-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.file-size-unit {
  opacity: 0.6;
  font-size: 0.8em;
}

/* Duration Formatter */
.duration-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-variant-numeric: tabular-nums;
}

.duration-unit {
  opacity: 0.6;
  font-size: 0.8em;
}

/* Abbreviation Formatter */
.abbreviation {
  position: relative;
  cursor: help;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.3);
}

.abbreviation::after {
  content: attr(data-full);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 1000;
}

.abbreviation:hover::after {
  opacity: 1;
}

/* Badge Formatters */
.badge-formatted {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-danger {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-info {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-premium {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(251, 191, 36, 0);
  }
}

/* List Formatters */
.list-formatted {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item-formatted {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.list-item-formatted:last-child {
  border-bottom: none;
}

.list-item-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
}

/* Statistic Formatters */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.stat-item:hover {
  border-color: rgba(34, 197, 94, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #22c55e, #4ade80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  margin-top: 8px;
  padding: 2px 8px;
  border-radius: 12px;
}

.stat-change.positive {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.stat-change.negative {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Table Formatters */
.table-formatted {
  width: 100%;
  border-collapse: collapse;
}

.table-formatted th {
  text-align: left;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.table-formatted td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.table-formatted tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.table-formatted .numeric-cell {
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

/* Tag Formatters */
.tag-formatted {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.tag-formatted:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.tag-formatted .tag-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0 6px;
  border-radius: 10px;
  font-size: 0.7em;
}

/* Color-coded Status */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: status-pulse 2s ease-in-out infinite;
}

.status-dot.online {
  background: #10b981;
}

.status-dot.offline {
  background: #6b7280;
}

.status-dot.busy {
  background: #f59e0b;
}

.status-dot.dnd {
  background: #ef4444;
}

@keyframes status-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Social Proof Formatters */
.social-proof {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.social-proof-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.social-proof-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.social-proof-content {
  flex: 1;
}

.social-proof-text {
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.social-proof-author {
  font-weight: 600;
  font-size: 0.875rem;
}

.social-proof-role {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}
`;

// Number formatters
export const formatNumber = (num, options = {}) => {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = 'standard',
    compactDisplay = 'short'
  } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
    compactDisplay
  }).format(num);
};

export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Date & Time formatters
export const formatDate = (date, locale = 'en-US', options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(
    date instanceof Date ? date : new Date(date)
  );
};

export const formatTime = (date, locale = 'en-US', options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(
    date instanceof Date ? date : new Date(date)
  );
};

export const formatDateTime = (date, locale = 'en-US') => {
  return `${formatDate(date, locale)} • ${formatTime(date, locale)}`;
};

export const formatRelativeTime = (date, locale = 'en-US') => {
  const now = new Date();
  const diffMs = now - (date instanceof Date ? date : new Date(date));
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffDay > 0) return rtf.format(-diffDay, 'day');
  if (diffHour > 0) return rtf.format(-diffHour, 'hour');
  if (diffMin > 0) return rtf.format(-diffMin, 'minute');
  return rtf.format(-diffSec, 'second');
};

// Business formatters
export const formatRevenue = (amount, currency = 'USD') => {
  if (amount >= 1000000) {
    return `${formatCurrency(amount / 1000000, currency)}M`;
  }
  if (amount >= 1000) {
    return `${formatCurrency(amount / 1000, currency)}K`;
  }
  return formatCurrency(amount, currency);
};

export const formatUserCount = (count) => {
  if (count >= 1000000) {
    return `${formatNumber(count / 1000000, { maximumFractionDigits: 1 })}M`;
  }
  if (count >= 1000) {
    return `${formatNumber(count / 1000, { maximumFractionDigits: 1 })}K`;
  }
  return formatNumber(count);
};

export const formatGrowthRate = (rate) => {
  const formatted = formatPercentage(Math.abs(rate));
  return rate >= 0 ? `+${formatted}` : `-${formatted}`;
};

// File size formatters
export const formatFileSize = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size, { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
};

// Duration formatters
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

export const formatMinutes = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Social formatters
export const formatSocialNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatHashtag = (text) => {
  return `#${text.replace(/\s+/g, '').toLowerCase()}`;
};

export const formatUsername = (username) => {
  return `@${username}`;
};

// Business metrics formatters
export const formatMRR = (amount) => {
  return `$${formatNumber(Math.round(amount), { minimumFractionDigits: 0 })}/mo`;
};

export const formatARR = (amount) => {
  return `$${formatNumber(Math.round(amount), { minimumFractionDigits: 0 })}/yr`;
};

export const formatLTV = (amount) => {
  return `$${formatNumber(amount, { maximumFractionDigits: 0 })} LTV`;
};

export const formatCAC = (amount) => {
  return `$${formatNumber(amount, { maximumFractionDigits: 0 })} CAC`;
};

// Achievement formatters
export const formatStreakDays = (days) => {
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  
  return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
};

export const formatConsistency = (percentage) => {
  return `${formatNumber(percentage, { maximumFractionDigits: 1 })}% consistency`;
};

// International address formatter
export const formatAddress = (address, locale = 'en-US') => {
  const { street, city, state, postalCode, country } = address;
  const parts = [];

  if (street) parts.push(street);
  if (city) parts.push(city);
  if (state && locale === 'en-US') parts.push(state);
  if (postalCode) parts.push(postalCode);
  if (country && locale !== country.toLowerCase()) {
    // Only add country if it's different from locale
    parts.push(country);
  }

  return parts.join(', ');
};

// Phone number formatter
export const formatPhoneNumber = (phoneNumber, countryCode = 'US') => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (countryCode === 'US') {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  }
  
  return phoneNumber;
};

// Credit card formatter
export const formatCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const parts = cleaned.match(/.{1,4}/g);
  return parts ? parts.join(' ') : cardNumber;
};

// URL formatter
export const formatURL = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

// Temperature formatter
export const formatTemperature = (temp, unit = 'C') => {
  const symbol = unit === 'C' ? '°C' : '°F';
  return `${formatNumber(temp, { maximumFractionDigits: 1 })}${symbol}`;
};

// Distance formatter
export const formatDistance = (meters, unit = 'metric') => {
  if (unit === 'metric') {
    if (meters >= 1000) {
      return `${formatNumber(meters / 1000, { maximumFractionDigits: 1 })} km`;
    }
    return `${formatNumber(meters, { maximumFractionDigits: 0 })} m`;
  } else {
    const feet = meters * 3.28084;
    if (feet >= 5280) {
      return `${formatNumber(feet / 5280, { maximumFractionDigits: 1 })} mi`;
    }
    return `${formatNumber(feet, { maximumFractionDigits: 0 })} ft`;
  }
};

// Timezone formatter
export const formatTimezone = (timezone) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    return formatter.formatToParts(new Date())
      .find(part => part.type === 'timeZoneName')
      ?.value || timezone;
  } catch {
    return timezone;
  }
};

// Utility functions for CSS classes
export const getFormattedNumberClass = (num) => {
  const classes = ['formatted-number'];
  
  if (num >= 1000000) classes.push('number-large');
  if (num < 0) classes.push('number-negative');
  if (num === 0) classes.push('number-zero');
  
  return classes.join(' ');
};

export const getCurrencyClass = (currency) => {
  const classes = ['currency-display'];
  
  switch (currency) {
    case 'USD':
      classes.push('currency-usd');
      break;
    case 'EUR':
      classes.push('currency-eur');
      break;
    case 'GBP':
      classes.push('currency-gbp');
      break;
    case 'JPY':
      classes.push('currency-jpy');
      break;
  }
  
  return classes.join(' ');
};

export const getPercentageClass = (percentage) => {
  const classes = ['percentage-display'];
  
  if (percentage >= 90) classes.push('percentage-excellent');
  else if (percentage >= 70) classes.push('percentage-good');
  else if (percentage >= 50) classes.push('percentage-fair');
  else classes.push('percentage-poor');
  
  return classes.join(' ');
};