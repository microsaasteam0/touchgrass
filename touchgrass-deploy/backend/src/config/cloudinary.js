const cloudinary = require('cloudinary').v2;
const path = require('path');

/**
 * Cloudinary Configuration
 * Handles image uploads for streak verifications, user avatars, and OG images
 */
const configureCloudinary = () => {
  // Validate required environment variables
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing Cloudinary environment variables: ${missingVars.join(', ')}`);
    console.warn('   Uploads will be disabled. Set variables to enable.');
    return null;
  }

  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    console.log('✅ Cloudinary configured successfully');
    
    // Test connection
    return testCloudinaryConnection();
  } catch (error) {
    console.error('❌ Cloudinary configuration failed:', error.message);
    return null;
  }
};

/**
 * Test Cloudinary connection
 */
const testCloudinaryConnection = async () => {
  try {
    // Simple ping to test credentials
    await cloudinary.api.ping();
    console.log('✅ Cloudinary connection test passed');
    return cloudinary;
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:', error.message);
    return null;
  }
};

/**
 * Upload options for different file types
 */
const uploadOptions = {
  // User avatar upload options
  avatar: {
    folder: 'touchgrass/avatars',
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
    format: 'webp',
    quality: 'auto:good',
    transformation: [
      { effect: 'auto_brightness' },
      { effect: 'auto_contrast' },
      { effect: 'auto_color' }
    ]
  },

  // Streak verification photo options
  verification: {
    folder: 'touchgrass/verifications',
    format: 'webp',
    quality: 'auto:good',
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { effect: 'auto_brightness' }
    ],
    moderation: 'awsel_rek', // Optional: Auto-moderation for inappropriate content
    context: {
      source: 'touchgrass-verification',
      timestamp: Date.now().toString()
    }
  },

  // OG (Open Graph) images for social sharing
  ogImage: {
    folder: 'touchgrass/og-images',
    format: 'png',
    quality: 100,
    transformation: [
      { width: 1200, height: 630, crop: 'fill' },
      { quality: 'auto:best' }
    ]
  },

  // Chat attachments
  chatAttachment: {
    folder: 'touchgrass/chat',
    resource_type: 'auto',
    format: 'auto',
    quality: 'auto:good',
    transformation: [
      { width: 800, crop: 'limit' }
    ]
  }
};

/**
 * Generate secure upload signature for client-side uploads
 */
const generateUploadSignature = (options = {}) => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  const params = {
    timestamp,
    folder: options.folder || 'touchgrass/uploads',
    ...options
  };

  // Remove undefined values
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  // Generate signature
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

  return {
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    ...params
  };
};

/**
 * Upload file to Cloudinary with error handling
 */
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        ...uploadOptions.verification,
        ...options,
        invalidate: true // Clear CDN cache
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Upload failed: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
            createdAt: result.created_at
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete asset from Cloudinary
 */
const deleteFromCloudinary = async (publicId, options = {}) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      ...options
    });
    
    if (result.result !== 'ok') {
      throw new Error(`Delete failed: ${result.result}`);
    }
    
    return { success: true, publicId };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Generate transformation URL for optimized delivery
 */
const generateOptimizedUrl = (publicId, transformations = []) => {
  const baseTransformations = [
    { quality: 'auto:good' },
    { format: 'auto' }
  ];

  const allTransformations = [...baseTransformations, ...transformations];
  
  return cloudinary.url(publicId, {
    transformation: allTransformations,
    secure: true
  });
};

/**
 * Generate social share image with text overlay
 */
const generateSocialShareImage = async (streakData, userData) => {
  const textOverlays = [
    {
      text: `Day ${streakData.currentStreak}`,
      font_family: 'Inter',
      font_size: 100,
      font_weight: 'bold',
      color: '#FFFFFF',
      gravity: 'north',
      y: 100
    },
    {
      text: 'TOUCH GRASS STREAK',
      font_family: 'Inter',
      font_size: 40,
      color: 'rgba(255, 255, 255, 0.8)',
      gravity: 'north',
      y: 220
    },
    {
      text: userData.displayName,
      font_family: 'Inter',
      font_size: 36,
      color: '#FFFFFF',
      gravity: 'south',
      y: 120
    },
    {
      text: `${streakData.consistencyScore}% Consistency`,
      font_family: 'Inter',
      font_size: 28,
      color: '#86EFAC',
      gravity: 'south',
      y: 80
    },
    {
      text: 'touchgrass.now',
      font_family: 'Inter',
      font_size: 24,
      color: 'rgba(255, 255, 255, 0.6)',
      gravity: 'south',
      y: 30
    }
  ];

  // Create background gradient
  const backgroundGradient = [
    'gradient_fade',
    'symetric_pad',
    `co_rgb:14532d,e_colorize:40`,
    `co_rgb:22c55e,e_colorize:40`
  ].join(':');

  try {
    const result = await cloudinary.uploader.upload(`background:${backgroundGradient}`, {
      folder: uploadOptions.ogImage.folder,
      transformation: [
        { width: 1200, height: 630, crop: 'fill' },
        ...textOverlays.map(overlay => ({
          overlay: {
            font_family: overlay.font_family,
            font_size: overlay.font_size,
            font_weight: overlay.font_weight,
            text: encodeURIComponent(overlay.text)
          },
          color: overlay.color,
          gravity: overlay.gravity,
          y: overlay.y
        }))
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      etag: result.etag
    };
  } catch (error) {
    console.error('Failed to generate social share image:', error);
    throw error;
  }
};

module.exports = {
  configureCloudinary,
  cloudinary,
  uploadOptions,
  generateUploadSignature,
  uploadToCloudinary,
  deleteFromCloudinary,
  generateOptimizedUrl,
  generateSocialShareImage,
  testCloudinaryConnection
};