const axios = require('axios');
const NodeGeocoder = require('node-geocoder');
const crypto = require('crypto');

class GeolocationService {
  constructor() {
    // Initialize geocoder with multiple providers
    this.geocoder = NodeGeocoder({
      provider: 'openstreetmap',
      httpAdapter: 'https',
      formatter: null
    });

    // Google Maps API (if configured)
    this.googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.googleGeocoder = this.googleApiKey ? NodeGeocoder({
      provider: 'google',
      apiKey: this.googleApiKey,
      formatter: null
    }) : null;

    // IP geolocation service
    this.ipApiUrl = 'http://ip-api.com/json';
    this.ipinfoToken = process.env.IPINFO_TOKEN;

    // Cache for geolocation results
    this.cache = new Map();
    this.cacheTtl = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Get location from coordinates (reverse geocoding)
  async getLocationFromCoordinates(lat, lng, options = {}) {
    const cacheKey = this.generateCacheKey('coords', { lat, lng });
    const cached = this.getCached(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      let result;
      
      // Try Google first if available
      if (this.googleGeocoder && options.preferGoogle !== false) {
        try {
          result = await this.googleGeocoder.reverse({ lat, lon: lng });
        } catch (error) {
          console.warn('Google reverse geocoding failed:', error.message);
        }
      }

      // Fallback to OpenStreetMap
      if (!result || result.length === 0) {
        result = await this.geocoder.reverse({ lat, lon: lng });
      }

      if (result && result.length > 0) {
        const location = this.formatLocation(result[0], options);
        this.setCached(cacheKey, location);
        return location;
      }

      throw new Error('No location found for coordinates');
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return this.getFallbackLocation(lat, lng, options);
    }
  }

  // Get coordinates from location string (forward geocoding)
  async getCoordinatesFromLocation(locationString, options = {}) {
    const cacheKey = this.generateCacheKey('location', { locationString });
    const cached = this.getCached(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      let result;
      
      // Try Google first if available
      if (this.googleGeocoder && options.preferGoogle !== false) {
        try {
          result = await this.googleGeocoder.geocode(locationString);
        } catch (error) {
          console.warn('Google geocoding failed:', error.message);
        }
      }

      // Fallback to OpenStreetMap
      if (!result || result.length === 0) {
        result = await this.geocoder.geocode(locationString);
      }

      if (result && result.length > 0) {
        const coordinates = this.formatCoordinates(result[0], options);
        this.setCached(cacheKey, coordinates);
        return coordinates;
      }

      throw new Error('No coordinates found for location');
    } catch (error) {
      console.error('Forward geocoding failed:', error);
      return null;
    }
  }

  // Get location from IP address
  async getLocationFromIP(ip, options = {}) {
    const cacheKey = this.generateCacheKey('ip', { ip });
    const cached = this.getCached(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      let data;
      
      // Try ipinfo.io if token is available
      if (this.ipinfoToken) {
        try {
          const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${this.ipinfoToken}`);
          data = response.data;
        } catch (error) {
          console.warn('ipinfo.io failed:', error.message);
        }
      }

      // Fallback to ip-api.com
      if (!data) {
        const response = await axios.get(`${this.ipApiUrl}/${ip}`);
        data = response.data;
      }

      if (data && data.status !== 'fail') {
        const location = this.formatIPLocation(data, options);
        this.setCached(cacheKey, location);
        return location;
      }

      throw new Error('IP geolocation failed');
    } catch (error) {
      console.error('IP geolocation failed:', error);
      return this.getDefaultLocation(options);
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2, unit = 'km') {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    }

    const R = unit === 'km' ? 6371 : 3959; // Earth's radius in km or miles
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimals
  }

  // Check if location is within radius
  isWithinRadius(lat1, lon1, lat2, lon2, radius, unit = 'km') {
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2, unit);
    return distance <= radius;
  }

  // Calculate bounding box around a point
  calculateBoundingBox(lat, lng, radius, unit = 'km') {
    const R = unit === 'km' ? 6371 : 3959;
    
    // Convert radius to radians
    const radDist = radius / R;
    
    // Convert latitude and longitude to radians
    const radLat = this.toRad(lat);
    const radLng = this.toRad(lng);
    
    // Calculate min and max latitude
    const minLat = radLat - radDist;
    const maxLat = radLat + radDist;
    
    // Calculate min and max longitude
    const deltaLng = Math.asin(Math.sin(radDist) / Math.cos(radLat));
    const minLng = radLng - deltaLng;
    const maxLng = radLng + deltaLng;
    
    // Convert back to degrees
    return {
      minLat: this.toDeg(minLat),
      maxLat: this.toDeg(maxLat),
      minLng: this.toDeg(minLng),
      maxLng: this.toDeg(maxLng)
    };
  }

  // Get timezone for coordinates
  async getTimezone(lat, lng) {
    const cacheKey = this.generateCacheKey('timezone', { lat, lng });
    const cached = this.getCached(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      if (this.googleApiKey) {
        // Use Google Time Zone API
        const timestamp = Math.floor(Date.now() / 1000);
        const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${this.googleApiKey}`;
        
        const response = await axios.get(url);
        const data = response.data;
        
        if (data.status === 'OK') {
          const timezone = {
            id: data.timeZoneId,
            name: data.timeZoneName,
            offset: data.rawOffset + data.dstOffset
          };
          
          this.setCached(cacheKey, timezone);
          return timezone;
        }
      }

      // Fallback: Estimate timezone from longitude
      const offset = Math.round(lng / 15) * 3600; // 15 degrees per hour
      const timezone = {
        id: 'Etc/GMT' + (offset >= 0 ? '+' : '') + (offset / 3600),
        name: `GMT${offset >= 0 ? '+' : ''}${offset / 3600}`,
        offset: offset
      };
      
      this.setCached(cacheKey, timezone);
      return timezone;
    } catch (error) {
      console.error('Timezone lookup failed:', error);
      return {
        id: 'UTC',
        name: 'UTC',
        offset: 0
      };
    }
  }

  // Get elevation for coordinates
  async getElevation(lat, lng) {
    const cacheKey = this.generateCacheKey('elevation', { lat, lng });
    const cached = this.getCached(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      if (this.googleApiKey) {
        // Use Google Elevation API
        const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${this.googleApiKey}`;
        
        const response = await axios.get(url);
        const data = response.data;
        
        if (data.status === 'OK' && data.results.length > 0) {
          const elevation = Math.round(data.results[0].elevation);
          this.setCached(cacheKey, elevation);
          return elevation;
        }
      }

      // Fallback: Use Open-Elevation API
      const response = await axios.get(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
      const data = response.data;
      
      if (data.results && data.results.length > 0) {
        const elevation = Math.round(data.results[0].elevation);
        this.setCached(cacheKey, elevation);
        return elevation;
      }

      return 0; // Default elevation
    } catch (error) {
      console.error('Elevation lookup failed:', error);
      return 0;
    }
  }

  // Validate coordinates
  validateCoordinates(lat, lng) {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return { valid: false, error: 'Coordinates must be numbers' };
    }

    if (lat < -90 || lat > 90) {
      return { valid: false, error: 'Latitude must be between -90 and 90' };
    }

    if (lng < -180 || lng > 180) {
      return { valid: false, error: 'Longitude must be between -180 and 180' };
    }

    return { valid: true };
  }

  // Format address from geocoding result
  formatAddress(geocodeResult, options = {}) {
    const {
      includeCountry = true,
      includePostalCode = false,
      shortFormat = false
    } = options;

    const parts = [];
    
    if (geocodeResult.streetName || geocodeResult.streetNumber) {
      parts.push(`${geocodeResult.streetNumber || ''} ${geocodeResult.streetName || ''}`.trim());
    }
    
    if (geocodeResult.city) {
      parts.push(geocodeResult.city);
    }
    
    if (geocodeResult.state) {
      parts.push(geocodeResult.state);
    }
    
    if (includePostalCode && geocodeResult.zipcode) {
      parts.push(geocodeResult.zipcode);
    }
    
    if (includeCountry && geocodeResult.country) {
      parts.push(geocodeResult.country);
    }

    if (shortFormat) {
      // Return just city and country
      return `${geocodeResult.city || ''}, ${geocodeResult.country || ''}`.trim();
    }

    return parts.join(', ');
  }

  // Get nearby cities/towns
  async getNearbyLocations(lat, lng, radius = 50, limit = 10) {
    const cacheKey = this.generateCacheKey('nearby', { lat, lng, radius, limit });
    const cached = this.getCached(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Use Nominatim (OpenStreetMap) for nearby places
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
      
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'TouchGrass/1.0' }
      });
      
      const data = response.data;
      
      if (data.address) {
        const nearby = this.extractNearbyPlaces(data, radius);
        const limited = nearby.slice(0, limit);
        
        this.setCached(cacheKey, limited);
        return limited;
      }

      return [];
    } catch (error) {
      console.error('Nearby locations lookup failed:', error);
      return [];
    }
  }

  // Get weather information for location
  async getWeather(lat, lng, options = {}) {
    const cacheKey = this.generateCacheKey('weather', { lat, lng });
    const cached = this.getCached(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) { // 30 minute cache
      return cached.data;
    }

    try {
      // Use OpenWeatherMap API
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
      
      const response = await axios.get(url);
      const data = response.data;
      
      const weather = {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        clouds: data.clouds.all,
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
        location: data.name,
        country: data.sys.country
      };

      const result = { data: weather, timestamp: Date.now() };
      this.setCached(cacheKey, result);
      
      return weather;
    } catch (error) {
      console.error('Weather lookup failed:', error);
      return this.getDefaultWeather(lat, lng);
    }
  }

  // Check if location is outdoors/nature-friendly
  async isNatureLocation(lat, lng) {
    const cacheKey = this.generateCacheKey('nature', { lat, lng });
    const cached = this.getCached(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Use Overpass API to check for parks, forests, etc.
      const query = `
        [out:json][timeout:25];
        (
          way["leisure"="park"](around:1000,${lat},${lng});
          way["landuse"="forest"](around:1000,${lat},${lng});
          way["natural"="wood"](around:1000,${lat},${lng});
          way["leisure"="garden"](around:1000,${lat},${lng});
          way["landuse"="meadow"](around:1000,${lat},${lng});
          way["landuse"="grass"](around:1000,${lat},${lng});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: { 'Content-Type': 'text/plain' }
      });

      const data = response.data;
      const isNature = data.elements && data.elements.length > 0;
      
      this.setCached(cacheKey, isNature);
      return isNature;
    } catch (error) {
      console.error('Nature location check failed:', error);
      
      // Fallback: Check elevation and water proximity
      const elevation = await this.getElevation(lat, lng);
      const isNature = elevation > 0; // Not underwater
      
      this.setCached(cacheKey, isNature);
      return isNature;
    }
  }

  // Calculate sunrise/sunset times
  calculateSunTimes(lat, lng, date = new Date()) {
    // Convert to radians
    const latRad = this.toRad(lat);
    
    // Calculate day of year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Solar declination
    const declination = 0.4093 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
    
    // Hour angle
    const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declination));
    
    // Sunrise and sunset in decimal hours
    const sunriseHour = 12 - (hourAngle * 180 / Math.PI) / 15 - (lng / 15);
    const sunsetHour = 12 + (hourAngle * 180 / Math.PI) / 15 - (lng / 15);
    
    // Convert to Date objects
    const sunrise = new Date(date);
    sunrise.setHours(Math.floor(sunriseHour), Math.round((sunriseHour % 1) * 60));
    
    const sunset = new Date(date);
    sunset.setHours(Math.floor(sunsetHour), Math.round((sunsetHour % 1) * 60));
    
    return {
      sunrise,
      sunset,
      dayLength: sunset - sunrise,
      isDaytime: date >= sunrise && date <= sunset
    };
  }

  // Get time of day based on sun position
  getTimeOfDay(lat, lng) {
    const sunTimes = this.calculateSunTimes(lat, lng);
    const now = new Date();
    
    if (now < sunTimes.sunrise) {
      return { period: 'night', emoji: '🌙', description: 'Before sunrise' };
    } else if (now < new Date(sunTimes.sunrise.getTime() + 60 * 60 * 1000)) {
      return { period: 'dawn', emoji: '🌅', description: 'Sunrise' };
    } else if (now < new Date(sunTimes.sunrise.getTime() + 3 * 60 * 60 * 1000)) {
      return { period: 'morning', emoji: '☀️', description: 'Morning' };
    } else if (now < new Date(sunTimes.sunset.getTime() - 3 * 60 * 60 * 1000)) {
      return { period: 'afternoon', emoji: '🌤️', description: 'Afternoon' };
    } else if (now < sunTimes.sunset) {
      return { period: 'evening', emoji: '🌇', description: 'Evening' };
    } else if (now < new Date(sunTimes.sunset.getTime() + 60 * 60 * 1000)) {
      return { period: 'dusk', emoji: '🌆', description: 'Sunset' };
    } else {
      return { period: 'night', emoji: '🌙', description: 'Night' };
    }
  }

  // Helper methods
  formatLocation(geocodeResult, options) {
    const {
      includeDetails = true,
      language = 'en'
    } = options;

    const location = {
      coordinates: {
        lat: geocodeResult.latitude,
        lng: geocodeResult.longitude
      },
      address: this.formatAddress(geocodeResult, options),
      city: geocodeResult.city || geocodeResult.town || geocodeResult.village,
      state: geocodeResult.state,
      country: geocodeResult.country,
      countryCode: geocodeResult.countryCode,
      postalCode: geocodeResult.zipcode,
      formatted: geocodeResult.formattedAddress
    };

    if (includeDetails) {
      location.details = {
        street: geocodeResult.streetName,
        streetNumber: geocodeResult.streetNumber,
        neighborhood: geocodeResult.extra?.neighborhood,
        county: geocodeResult.county,
        district: geocodeResult.district,
        province: geocodeResult.province,
        region: geocodeResult.region
      };
    }

    return location;
  }

  formatCoordinates(geocodeResult, options) {
    return {
      lat: geocodeResult.latitude,
      lng: geocodeResult.longitude,
      accuracy: geocodeResult.accuracy,
      formattedAddress: geocodeResult.formattedAddress,
      provider: geocodeResult.provider
    };
  }

  formatIPLocation(ipData, options) {
    return {
      ip: ipData.ip,
      coordinates: {
        lat: parseFloat(ipData.lat),
        lng: parseFloat(ipData.lon)
      },
      city: ipData.city,
      region: ipData.regionName,
      country: ipData.country,
      countryCode: ipData.countryCode,
      postalCode: ipData.zip,
      timezone: ipData.timezone,
      isp: ipData.isp,
      org: ipData.org,
      as: ipData.as
    };
  }

  getFallbackLocation(lat, lng, options) {
    return {
      coordinates: { lat, lng },
      address: `Near ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      city: null,
      state: null,
      country: null,
      countryCode: null,
      postalCode: null,
      formatted: `Coordinates: ${lat}, ${lng}`,
      isFallback: true
    };
  }

  getDefaultLocation(options) {
    return {
      coordinates: { lat: 0, lng: 0 },
      address: 'Unknown location',
      city: null,
      state: null,
      country: null,
      countryCode: null,
      postalCode: null,
      formatted: 'Location unavailable',
      isDefault: true
    };
  }

  getDefaultWeather(lat, lng) {
    // Generate pseudo-random weather based on coordinates
    const seed = lat * lng;
    const temp = 20 + Math.sin(seed) * 10; // Between 10-30°C
    const humidity = 50 + Math.cos(seed) * 30; // Between 20-80%
    
    return {
      temperature: Math.round(temp),
      feelsLike: Math.round(temp + Math.sin(seed * 2) * 2),
      humidity: Math.round(humidity),
      pressure: 1013,
      description: 'Partly cloudy',
      icon: '02d',
      windSpeed: 3 + Math.sin(seed * 3) * 2,
      windDirection: Math.round(Math.sin(seed) * 360),
      clouds: 40 + Math.cos(seed) * 30,
      sunrise: new Date(Date.now() - 4 * 60 * 60 * 1000),
      sunset: new Date(Date.now() + 4 * 60 * 60 * 1000),
      location: 'Unknown',
      country: 'Unknown',
      isEstimated: true
    };
  }

  extractNearbyPlaces(osmData, radius) {
    const places = [];
    
    // Extract cities/towns from address components
    const address = osmData.address;
    
    if (address.city) {
      places.push({
        name: address.city,
        type: 'city',
        distance: radius * 0.3 // Estimated
      });
    }
    
    if (address.town) {
      places.push({
        name: address.town,
        type: 'town',
        distance: radius * 0.5
      });
    }
    
    if (address.village) {
      places.push({
        name: address.village,
        type: 'village',
        distance: radius * 0.7
      });
    }
    
    if (address.hamlet) {
      places.push({
        name: address.hamlet,
        type: 'hamlet',
        distance: radius * 0.9
      });
    }
    
    // Add nearby features
    if (address.park) {
      places.push({
        name: address.park,
        type: 'park',
        distance: radius * 0.2
      });
    }
    
    if (address.forest) {
      places.push({
        name: address.forest,
        type: 'forest',
        distance: radius * 0.4
      });
    }
    
    return places.sort((a, b) => a.distance - b.distance);
  }

  toRad(degrees) {
    return degrees * Math.PI / 180;
  }

  toDeg(radians) {
    return radians * 180 / Math.PI;
  }

  generateCacheKey(prefix, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    const hash = crypto
      .createHash('md5')
      .update(sortedParams)
      .digest('hex')
      .slice(0, 8);
    
    return `${prefix}:${hash}`;
  }

  getCached(key) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTtl) {
      return cached.data;
    }
    
    this.cache.delete(key);
    return null;
  }

  setCached(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Limit cache size
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  // Clear cache (useful for testing)
  clearCache() {
    this.cache.clear();
  }

  // Batch geocoding
  async batchGeocode(locations, options = {}) {
    const batchSize = options.batchSize || 10;
    const results = [];
    
    for (let i = 0; i < locations.length; i += batchSize) {
      const batch = locations.slice(i, i + batchSize);
      const batchPromises = batch.map(loc => 
        this.getLocationFromCoordinates(loc.lat, loc.lng, options)
          .catch(error => ({ error: error.message, coordinates: loc }))
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Rate limiting delay
      if (i + batchSize < locations.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  // Validate and normalize address
  async normalizeAddress(address, options = {}) {
    try {
      const coordinates = await this.getCoordinatesFromLocation(address, options);
      
      if (!coordinates) {
        return { valid: false, error: 'Address not found' };
      }
      
      const location = await this.getLocationFromCoordinates(
        coordinates.lat, 
        coordinates.lng, 
        options
      );
      
      return {
        valid: true,
        original: address,
        normalized: location.address,
        coordinates: location.coordinates,
        details: location
      };
    } catch (error) {
      return { valid: false, error: error.message, original: address };
    }
  }

  // Calculate area coverage (for nature verification)
  calculateAreaCoverage(points) {
    if (points.length < 3) {
      return 0;
    }
    
    // Shoelace formula for polygon area
    let area = 0;
    
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].lng * points[j].lat;
      area -= points[j].lng * points[i].lat;
    }
    
    area = Math.abs(area) / 2;
    
    // Convert to square meters (approximate)
    const earthRadius = 6371000; // meters
    const areaM2 = area * earthRadius * earthRadius;
    
    return areaM2;
  }

  // Check if location is safe (not in restricted areas)
  async isLocationSafe(lat, lng) {
    // Implement safety checks based on your requirements
    // This could check against known dangerous areas, military zones, etc.
    
    // For now, just check if it's on land (not in ocean)
    const elevation = await this.getElevation(lat, lng);
    const isOnLand = elevation > -10; // Allow some coastal areas
    
    return {
      safe: isOnLand,
      reason: isOnLand ? null : 'Location appears to be in water',
      elevation,
      details: { isOnLand }
    };
  }

  // Get location statistics for streak verification
  async getLocationStats(lat, lng) {
    const [
      location,
      timezone,
      elevation,
      weather,
      isNature,
      sunTimes,
      timeOfDay,
      isSafe
    ] = await Promise.all([
      this.getLocationFromCoordinates(lat, lng),
      this.getTimezone(lat, lng),
      this.getElevation(lat, lng),
      this.getWeather(lat, lng),
      this.isNatureLocation(lat, lng),
      this.calculateSunTimes(lat, lng),
      this.getTimeOfDay(lat, lng),
      this.isLocationSafe(lat, lng)
    ]);

    return {
      location,
      timezone,
      elevation,
      weather,
      environment: {
        isNature,
        isOutdoors: timeOfDay.period !== 'night' && weather.temperature > 0,
        isDaytime: sunTimes.isDaytime,
        timeOfDay,
        sunTimes
      },
      safety: isSafe,
      verification: {
        isValid: this.validateCoordinates(lat, lng).valid,
        timestamp: new Date(),
        confidence: this.calculateVerificationConfidence(location, weather, isNature)
      }
    };
  }

  calculateVerificationConfidence(location, weather, isNature) {
    let confidence = 70; // Base confidence
    
    // Increase confidence for detailed location
    if (location.city && location.country) {
      confidence += 10;
    }
    
    // Increase confidence for good weather
    if (weather.temperature > 10 && weather.temperature < 30) {
      confidence += 5;
    }
    
    if (!weather.isEstimated) {
      confidence += 5;
    }
    
    // Increase confidence for nature locations
    if (isNature) {
      confidence += 10;
    }
    
    return Math.min(100, confidence);
  }

  // Generate location hash for deduplication
  generateLocationHash(lat, lng, precision = 4) {
    // Round coordinates to specified precision
    const roundedLat = parseFloat(lat.toFixed(precision));
    const roundedLng = parseFloat(lng.toFixed(precision));
    
    // Create hash
    const hash = crypto
      .createHash('md5')
      .update(`${roundedLat},${roundedLng}`)
      .digest('hex')
      .slice(0, 12);
    
    return hash;
  }

  // Detect if location is spoofed (basic check)
  async detectLocationSpoofing(currentLocation, previousLocations = []) {
    if (previousLocations.length === 0) {
      return { isSpoofed: false, confidence: 0, reason: null };
    }

    const lastLocation = previousLocations[previousLocations.length - 1];
    const distance = this.calculateDistance(
      lastLocation.lat,
      lastLocation.lng,
      currentLocation.lat,
      currentLocation.lng,
      'km'
    );

    const timeDiff = (currentLocation.timestamp - lastLocation.timestamp) / (1000 * 60 * 60); // Hours
    const maxSpeed = 1000; // Maximum realistic speed in km/h

    // Check if movement is physically possible
    const maxDistance = maxSpeed * timeDiff;
    const isPossible = distance <= maxDistance;

    // Check for common spoofing patterns
    const patterns = this.checkSpoofingPatterns(currentLocation, previousLocations);

    return {
      isSpoofed: !isPossible || patterns.isSuspicious,
      confidence: !isPossible ? 80 : patterns.confidence,
      reason: !isPossible 
        ? `Impossible movement: ${distance.toFixed(1)}km in ${timeDiff.toFixed(1)}h` 
        : patterns.reason,
      distance,
      timeDiff,
      maxPossibleDistance: maxDistance,
      patterns: patterns.details
    };
  }

  checkSpoofingPatterns(currentLocation, previousLocations) {
    const patterns = {
      isSuspicious: false,
      confidence: 0,
      reason: null,
      details: {}
    };

    // Check for exact same coordinates
    const exactMatches = previousLocations.filter(loc => 
      loc.lat === currentLocation.lat && loc.lng === currentLocation.lng
    ).length;

    if (exactMatches > 2) {
      patterns.isSuspicious = true;
      patterns.confidence = 60;
      patterns.reason = 'Exact coordinates repeated multiple times';
      patterns.details.exactMatches = exactMatches;
    }

    // Check for unrealistic precision
    const latDecimals = currentLocation.lat.toString().split('.')[1]?.length || 0;
    const lngDecimals = currentLocation.lng.toString().split('.')[1]?.length || 0;

    if (latDecimals > 6 || lngDecimals > 6) {
      patterns.isSuspicious = true;
      patterns.confidence = Math.max(patterns.confidence, 40);
      patterns.reason = 'Unrealistic coordinate precision';
      patterns.details.precision = { lat: latDecimals, lng: lngDecimals };
    }

    // Check for coordinates at exact degrees
    const isExactDegree = 
      currentLocation.lat % 1 === 0 || 
      currentLocation.lng % 1 === 0;

    if (isExactDegree) {
      patterns.isSuspicious = true;
      patterns.confidence = Math.max(patterns.confidence, 50);
      patterns.reason = 'Coordinates at exact degrees are suspicious';
      patterns.details.exactDegree = isExactDegree;
    }

    return patterns;
  }
}

module.exports = new GeolocationService();