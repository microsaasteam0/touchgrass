const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for different upload types
const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `touchgrass/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'pdf', 'doc', 'docx'],
      resource_type: 'auto',
      transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
    }
  });
};

// Create upload instances for different purposes
const photoUpload = multer({ 
  storage: createStorage('photos'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const avatarUpload = multer({
  storage: createStorage('avatars'),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const verificationUpload = multer({
  storage: createStorage('verifications'),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit for verification photos
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i)) {
      return cb(new Error('Only image and video files are allowed!'), false);
    }
    cb(null, true);
  }
});

const chatUpload = multer({
  storage: createStorage('chat'),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit for chat files
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/mov', 'video/avi',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('File type not allowed!'), false);
    }
    cb(null, true);
  }
});

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', auth, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'NO_FILE',
        message: 'No file uploaded'
      });
    }

    // Get user to delete old avatar
    const User = require('../models/user');
    const user = await User.findById(req.user.id);

    if (user && user.avatar) {
      // Extract public ID from Cloudinary URL
      const urlParts = user.avatar.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
      
      // Delete old avatar
      try {
        await cloudinary.uploader.destroy(`touchgrass/avatars/${publicId}`);
      } catch (deleteErr) {
        console.warn('Failed to delete old avatar:', deleteErr);
      }
    }

    // Optimize image for web
    const optimizedUrl = cloudinary.url(req.file.filename, {
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: optimizedUrl,
      original: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

  } catch (err) {
    console.error('Upload avatar error:', err);
    
    if (err.message.includes('File type not allowed') || 
        err.message.includes('Only image files are allowed')) {
      return res.status(400).json({
        error: 'INVALID_FILE_TYPE',
        message: 'Only JPG, PNG, GIF, and WebP images are allowed'
      });
    }

    if (err.message.includes('File too large')) {
      return res.status(400).json({
        error: 'FILE_TOO_LARGE',
        message: 'File size must be less than 5MB'
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error uploading avatar'
    });
  }
});

// @route   POST /api/upload/verification
// @desc    Upload verification photo/video
// @access  Private
router.post('/verification', auth, verificationUpload.single('media'), [
  check('streakId', 'Streak ID is required').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'NO_FILE',
        message: 'No file uploaded'
      });
    }

    const { streakId } = req.body;

    // Verify streak exists and belongs to user
    if (streakId) {
      const Streak = require('../models/Streak');
      const streak = await Streak.findOne({
        _id: streakId,
        userId: req.user.id
      });

      if (!streak) {
        return res.status(404).json({
          error: 'STREAK_NOT_FOUND',
          message: 'Streak not found or access denied'
        });
      }
    }

    // Generate optimized URL
    let optimizedUrl;
    const isVideo = req.file.mimetype.startsWith('video/');

    if (isVideo) {
      optimizedUrl = cloudinary.url(req.file.filename, {
        resource_type: 'video',
        transformation: [
          { width: 1280, height: 720, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Generate thumbnail
      const thumbnailUrl = cloudinary.url(req.file.filename, {
        resource_type: 'video',
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { format: 'jpg' }
        ]
      });

      res.json({
        success: true,
        message: 'Verification video uploaded successfully',
        media: {
          url: optimizedUrl,
          thumbnail: thumbnailUrl,
          type: 'video',
          duration: req.file.duration || null,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        streakId
      });

    } else {
      optimizedUrl = cloudinary.url(req.file.filename, {
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      res.json({
        success: true,
        message: 'Verification photo uploaded successfully',
        media: {
          url: optimizedUrl,
          type: 'image',
          size: req.file.size,
          mimetype: req.file.mimetype,
          dimensions: {
            width: req.file.width,
            height: req.file.height
          }
        },
        streakId
      });
    }

  } catch (err) {
    console.error('Upload verification error:', err);
    
    if (err.message.includes('File type not allowed')) {
      return res.status(400).json({
        error: 'INVALID_FILE_TYPE',
        message: 'Only image and video files are allowed'
      });
    }

    if (err.message.includes('File too large')) {
      return res.status(400).json({
        error: 'FILE_TOO_LARGE',
        message: 'File size must be less than 15MB'
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error uploading verification media'
    });
  }
});

// @route   POST /api/upload/chat
// @desc    Upload chat attachments
// @access  Private
router.post('/chat', auth, chatUpload.array('attachments', 5), [
  check('chatId', 'Chat ID is required').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'NO_FILES',
        message: 'No files uploaded'
      });
    }

    const { chatId } = req.body;

    // Verify chat exists and user is participant
    const Chat = require('../models/Chat');
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Process each file
    const attachments = await Promise.all(req.files.map(async (file) => {
      const isImage = file.mimetype.startsWith('image/');
      const isVideo = file.mimetype.startsWith('video/');
      const isDocument = file.mimetype.startsWith('application/');

      let url, thumbnail;
      
      if (isImage) {
        url = cloudinary.url(file.filename, {
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        thumbnail = cloudinary.url(file.filename, {
          transformation: [
            { width: 200, height: 200, crop: 'fill' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
      } else if (isVideo) {
        url = cloudinary.url(file.filename, {
          resource_type: 'video',
          transformation: [
            { width: 1280, height: 720, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        thumbnail = cloudinary.url(file.filename, {
          resource_type: 'video',
          transformation: [
            { width: 200, height: 200, crop: 'fill' },
            { format: 'jpg' }
          ]
        });
      } else {
        // For documents, just store the URL
        url = file.path;
        thumbnail = null;
      }

      return {
        url,
        thumbnail,
        type: isImage ? 'image' : isVideo ? 'video' : 'document',
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        ...(isImage && {
          dimensions: {
            width: file.width,
            height: file.height
          }
        }),
        ...(isVideo && {
          duration: file.duration || null
        })
      };
    }));

    res.json({
      success: true,
      message: `${attachments.length} file(s) uploaded successfully`,
      attachments,
      chatId
    });

  } catch (err) {
    console.error('Upload chat attachments error:', err);
    
    if (err.message.includes('File type not allowed')) {
      return res.status(400).json({
        error: 'INVALID_FILE_TYPE',
        message: 'File type not allowed. Allowed types: images, videos, PDF, Word documents'
      });
    }

    if (err.message.includes('File too large')) {
      return res.status(400).json({
        error: 'FILE_TOO_LARGE',
        message: 'Each file must be less than 25MB'
      });
    }

    if (err.message.includes('Too many files')) {
      return res.status(400).json({
        error: 'TOO_MANY_FILES',
        message: 'Maximum 5 files allowed per upload'
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error uploading files'
    });
  }
});

// @route   POST /api/upload/banner
// @desc    Upload profile or challenge banner
// @access  Private
router.post('/banner', auth, photoUpload.single('banner'), [
  check('type', 'Type is required').isIn(['profile', 'challenge'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'NO_FILE',
        message: 'No file uploaded'
      });
    }

    const { type, entityId } = req.body;

    // Generate banner URL with different dimensions based on type
    let optimizedUrl;
    
    if (type === 'profile') {
      optimizedUrl = cloudinary.url(req.file.filename, {
        transformation: [
          { width: 1500, height: 500, crop: 'fill', gravity: 'auto' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });
    } else if (type === 'challenge') {
      optimizedUrl = cloudinary.url(req.file.filename, {
        transformation: [
          { width: 1200, height: 400, crop: 'fill', gravity: 'auto' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Update challenge banner if entityId provided
      if (entityId) {
        const Challenge = require('../models/Challenge');
        await Challenge.findByIdAndUpdate(entityId, {
          'metadata.bannerImage': optimizedUrl
        });
      }
    }

    res.json({
      success: true,
      message: 'Banner uploaded successfully',
      banner: optimizedUrl,
      type,
      dimensions: {
        width: type === 'profile' ? 1500 : 1200,
        height: type === 'profile' ? 500 : 400
      }
    });

  } catch (err) {
    console.error('Upload banner error:', err);
    
    if (err.message.includes('Only image files are allowed')) {
      return res.status(400).json({
        error: 'INVALID_FILE_TYPE',
        message: 'Only image files are allowed for banners'
      });
    }

    if (err.message.includes('File too large')) {
      return res.status(400).json({
        error: 'FILE_TOO_LARGE',
        message: 'File size must be less than 10MB'
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error uploading banner'
    });
  }
});

// @route   POST /api/upload/bulk
// @desc    Upload multiple files for different purposes
// @access  Private
router.post('/bulk', auth, chatUpload.array('files', 10), [
  check('purpose', 'Purpose is required').isIn(['verification', 'chat', 'general'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'NO_FILES',
        message: 'No files uploaded'
      });
    }

    const { purpose, metadata } = req.body;
    const parsedMetadata = metadata ? JSON.parse(metadata) : {};

    // Process files based on purpose
    const processedFiles = await Promise.all(req.files.map(async (file, index) => {
      const fileMetadata = parsedMetadata[index] || {};
      
      let optimizedUrl, thumbnail;
      const isImage = file.mimetype.startsWith('image/');
      const isVideo = file.mimetype.startsWith('video/');

      if (isImage) {
        optimizedUrl = cloudinary.url(file.filename, {
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        
        if (purpose === 'verification') {
          thumbnail = cloudinary.url(file.filename, {
            transformation: [
              { width: 400, height: 400, crop: 'fill' },
              { quality: 'auto', fetch_format: 'auto' }
            ]
          });
        }
      } else if (isVideo) {
        optimizedUrl = cloudinary.url(file.filename, {
          resource_type: 'video',
          transformation: [
            { width: 1280, height: 720, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        
        thumbnail = cloudinary.url(file.filename, {
          resource_type: 'video',
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { format: 'jpg' }
          ]
        });
      } else {
        optimizedUrl = file.path;
      }

      return {
        url: optimizedUrl,
        thumbnail,
        type: isImage ? 'image' : isVideo ? 'video' : 'document',
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        purpose,
        metadata: fileMetadata,
        ...(isImage && {
          dimensions: {
            width: file.width,
            height: file.height
          }
        }),
        ...(isVideo && {
          duration: file.duration || null
        })
      };
    }));

    // Calculate total size
    const totalSize = processedFiles.reduce((sum, file) => sum + file.size, 0);

    res.json({
      success: true,
      message: `${processedFiles.length} file(s) uploaded successfully`,
      files: processedFiles,
      summary: {
        totalFiles: processedFiles.length,
        totalSize,
        images: processedFiles.filter(f => f.type === 'image').length,
        videos: processedFiles.filter(f => f.type === 'video').length,
        documents: processedFiles.filter(f => f.type === 'document').length
      },
      purpose
    });

  } catch (err) {
    console.error('Bulk upload error:', err);
    
    if (err.message.includes('File type not allowed')) {
      return res.status(400).json({
        error: 'INVALID_FILE_TYPE',
        message: 'One or more files have invalid file types'
      });
    }

    if (err.message.includes('File too large')) {
      return res.status(400).json({
        error: 'FILE_TOO_LARGE',
        message: 'One or more files exceed the size limit'
      });
    }

    if (err.message.includes('Too many files')) {
      return res.status(400).json({
        error: 'TOO_MANY_FILES',
        message: 'Maximum 10 files allowed per upload'
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error uploading files'
    });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete uploaded file
// @access  Private
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resource_type = 'image' } = req.query;

    // Verify user has permission to delete this file
    // In production, you would check if the file belongs to the user

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(`touchgrass/${publicId}`, {
      resource_type: resource_type
    });

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'File deleted successfully',
        result
      });
    } else {
      res.status(404).json({
        error: 'FILE_NOT_FOUND',
        message: 'File not found or already deleted'
      });
    }

  } catch (err) {
    console.error('Delete file error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error deleting file'
    });
  }
});

// @route   GET /api/upload/limits
// @desc    Get upload limits and supported formats
// @access  Public
router.get('/limits', (req, res) => {
  res.json({
    success: true,
    limits: {
      avatar: {
        maxSize: '5MB',
        formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        dimensions: '400x400 (auto-cropped)'
      },
      verification: {
        maxSize: '15MB',
        formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi'],
        dimensions: '1200x1200 (images), 1280x720 (videos)'
      },
      chat: {
        maxSize: '25MB per file',
        maxFiles: 5,
        formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'pdf', 'doc', 'docx']
      },
      banner: {
        maxSize: '10MB',
        formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        dimensions: {
          profile: '1500x500',
          challenge: '1200x400'
        }
      },
      bulk: {
        maxSize: '25MB per file',
        maxFiles: 10,
        totalMaxSize: '100MB'
      }
    },
    optimization: {
      images: 'Automatically optimized for web',
      videos: 'Automatically compressed',
      formats: 'Auto-converted to web-friendly formats'
    }
  });
});

// Error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'FILE_TOO_LARGE',
        message: 'File size exceeds the limit'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'TOO_MANY_FILES',
        message: 'Too many files uploaded'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'INVALID_FIELD',
        message: 'Invalid field name for file upload'
      });
    }
  }
  
  if (err.message) {
    return res.status(400).json({
      error: 'UPLOAD_ERROR',
      message: err.message
    });
  }
  
  next(err);
});

module.exports = router;