// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary');
// const path = require('path');
// const crypto = require('crypto');
// const { ERROR_CODES, UPLOAD_CONFIG } = require('../config/constants');

// /**
//  * File Upload Middleware
//  * Handles secure file uploads to Cloudinary with validation
//  */

// class UploadMiddleware {
//   /**
//    * Generate unique filename
//    */
//   static generateFilename = (originalname) => {
//     const timestamp = Date.now();
//     const randomString = crypto.randomBytes(8).toString('hex');
//     const extension = path.extname(originalname);
//     const nameWithoutExt = path.basename(originalname, extension);
    
//     // Sanitize filename
//     const sanitizedName = nameWithoutExt
//       .toLowerCase()
//       .replace(/[^a-z0-9]/g, '-')
//       .replace(/-+/g, '-')
//       .substring(0, 50);
    
//     return `${sanitizedName}-${timestamp}-${randomString}${extension}`;
//   };

//   /**
//    * Configure storage based on upload type
//    */
//   static getStorage = (uploadType = 'general') => {
//     const folderMap = {
//       verification: 'touchgrass/verifications',
//       profile: 'touchgrass/profiles',
//       chat: 'touchgrass/chat',
//       achievements: 'touchgrass/achievements',
//       general: 'touchgrass/uploads'
//     };

//     const folder = folderMap[uploadType] || folderMap.general;

//     return new CloudinaryStorage({
//       cloudinary: cloudinary,
//       params: {
//         folder: folder,
//         format: async (req, file) => {
//           // Preserve original format or convert to webp for images
//           const ext = path.extname(file.originalname).toLowerCase();
//           if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
//             return 'webp'; // Convert all images to webp for better compression
//           }
//           return ext.substring(1); // Remove dot
//         },
//         transformation: uploadType === 'verification' ? [
//           { width: 1200, height: 1200, crop: 'limit' },
//           { quality: 'auto:good' },
//           { fetch_format: 'auto' }
//         ] : [],
//         public_id: (req, file) => {
//           return UploadMiddleware.generateFilename(file.originalname);
//         },
//         resource_type: 'auto'
//       }
//     });
//   };

//   /**
//    * File filter based on type
//    */
//   static fileFilter = (allowedTypes) => {
//     return (req, file, cb) => {
//       try {
//         const fileType = file.mimetype;
//         const fileSize = parseInt(req.headers['content-length']) || 0;
//         const extension = path.extname(file.originalname).toLowerCase();
        
//         // Check file size
//         if (fileSize > UPLOAD_CONFIG.MAX_FILE_SIZE) {
//           return cb(new Error(`File size exceeds ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB limit`));
//         }

//         // Check if file type is allowed
//         const isAllowed = allowedTypes.some(type => {
//           if (typeof type === 'string') {
//             return fileType.startsWith(type);
//           }
//           return type.test(fileType);
//         });

//         if (!isAllowed) {
//           return cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
//         }

//         // Additional security checks
//         if (UploadMiddleware.isMaliciousFile(file, extension)) {
//           return cb(new Error('File appears to be malicious'));
//         }

//         cb(null, true);
//       } catch (error) {
//         cb(error);
//       }
//     };
//   };

//   /**
//    * Basic malicious file detection
//    */
//   static isMaliciousFile = (file, extension) => {
//     const maliciousPatterns = [
//       /\.(exe|bat|cmd|sh|php|asp|aspx|jsp|jar)$/i,
//       /<\?php/i,
//       /<script/i,
//       /eval\(/i,
//       /base64_decode/i
//     ];

//     // Check extension
//     if (maliciousPatterns.some(pattern => pattern.test(extension))) {
//       return true;
//     }

//     // For small files, check content (in production, use virus scanning service)
//     if (file.size < 1024 * 1024) { // 1MB
//       // Additional checks would go here
//       return false;
//     }

//     return false;
//   };

//   /**
//    * Upload configuration presets
//    */
//   static configs = {
//     // Photo verification upload
//     verificationPhoto: {
//       storage: UploadMiddleware.getStorage('verification'),
//       fileFilter: UploadMiddleware.fileFilter(['image/']),
//       limits: {
//         fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
//         files: 1
//       }
//     },

//     // Profile picture upload
//     profilePicture: {
//       storage: UploadMiddleware.getStorage('profile'),
//       fileFilter: UploadMiddleware.fileFilter(['image/']),
//       limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB
//         files: 1
//       }
//     },

//     // Chat media upload
//     chatMedia: {
//       storage: UploadMiddleware.getStorage('chat'),
//       fileFilter: UploadMiddleware.fileFilter(['image/', 'video/', 'audio/']),
//       limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB
//         files: 5
//       }
//     },

//     // Achievement badge upload (admin only)
//     achievementBadge: {
//       storage: UploadMiddleware.getStorage('achievements'),
//       fileFilter: UploadMiddleware.fileFilter(['image/svg+xml', 'image/png']),
//       limits: {
//         fileSize: 2 * 1024 * 1024, // 2MB
//         files: 1
//       }
//     },

//     // General document upload
//     document: {
//       storage: UploadMiddleware.getStorage('general'),
//       fileFilter: UploadMiddleware.fileFilter([
//         'application/pdf',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//       ]),
//       limits: {
//         fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
//         files: 1
//       }
//     }
//   };

//   /**
//    * Get upload middleware for specific type
//    */
//   static getUploadMiddleware = (uploadType, fieldName = 'file') => {
//     const config = UploadMiddleware.configs[uploadType];
    
//     if (!config) {
//       throw new Error(`Unknown upload type: ${uploadType}`);
//     }

//     const upload = multer(config);
    
//     return (req, res, next) => {
//       const uploadHandler = upload.single(fieldName);
      
//       uploadHandler(req, res, (err) => {
//         if (err) {
//           console.error('Upload error:', err);
          
//           if (err instanceof multer.MulterError) {
//             // Multer-specific errors
//             switch (err.code) {
//               case 'LIMIT_FILE_SIZE':
//                 return res.status(400).json({
//                   error: 'FileTooLarge',
//                   message: 'File size exceeds limit',
//                   code: ERROR_CODES.VALIDATION_ERROR,
//                   maxSize: UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
//                 });
              
//               case 'LIMIT_FILE_COUNT':
//                 return res.status(400).json({
//                   error: 'TooManyFiles',
//                   message: 'Too many files uploaded',
//                   code: ERROR_CODES.VALIDATION_ERROR
//                 });
              
//               case 'LIMIT_UNEXPECTED_FILE':
//                 return res.status(400).json({
//                   error: 'UnexpectedFile',
//                   message: 'Unexpected file field',
//                   code: ERROR_CODES.VALIDATION_ERROR
//                 });
              
//               default:
//                 return res.status(400).json({
//                   error: 'UploadError',
//                   message: 'File upload failed',
//                   code: ERROR_CODES.VALIDATION_ERROR,
//                   details: err.message
//                 });
//             }
//           } else {
//             // Other errors
//             return res.status(400).json({
//               error: 'UploadError',
//               message: err.message,
//               code: ERROR_CODES.VALIDATION_ERROR
//             });
//           }
//         }

//         // Add file info to request
//         if (req.file) {
//           req.fileInfo = {
//             url: req.file.path,
//             publicId: req.file.filename,
//             format: req.file.format,
//             bytes: req.file.size,
//             width: req.file.width,
//             height: req.file.height,
//             secureUrl: req.file.path.replace('http://', 'https://')
//           };

//           // Log successful upload (without sensitive data)
//           console.log(`File uploaded: ${req.file.originalname} -> ${req.fileInfo.publicId}`, {
//             type: uploadType,
//             size: req.file.size,
//             userId: req.user?.id
//           });
//         }

//         next();
//       });
//     };
//   };

//   /**
//    * Multiple files upload
//    */
//   static getMultiUploadMiddleware = (uploadType, fieldName = 'files', maxCount = 5) => {
//     const config = UploadMiddleware.configs[uploadType];
    
//     if (!config) {
//       throw new Error(`Unknown upload type: ${uploadType}`);
//     }

//     // Override file count limit
//     config.limits.files = maxCount;
    
//     const upload = multer(config);
    
//     return (req, res, next) => {
//       const uploadHandler = upload.array(fieldName, maxCount);
      
//       uploadHandler(req, res, (err) => {
//         if (err) {
//           console.error('Multi upload error:', err);
          
//           if (err instanceof multer.MulterError) {
//             return res.status(400).json({
//               error: 'UploadError',
//               message: err.message,
//               code: ERROR_CODES.VALIDATION_ERROR
//             });
//           } else {
//             return res.status(400).json({
//               error: 'UploadError',
//               message: err.message,
//               code: ERROR_CODES.VALIDATION_ERROR
//             });
//           }
//         }

//         // Add file info to request
//         if (req.files && req.files.length > 0) {
//           req.filesInfo = req.files.map(file => ({
//             url: file.path,
//             publicId: file.filename,
//             format: file.format,
//             bytes: file.size,
//             width: file.width,
//             height: file.height,
//             secureUrl: file.path.replace('http://', 'https://'),
//             originalName: file.originalname,
//             mimetype: file.mimetype
//           }));

//           console.log(`${req.files.length} files uploaded for ${uploadType}`, {
//             userId: req.user?.id,
//             totalSize: req.files.reduce((sum, f) => sum + f.size, 0)
//           });
//         }

//         next();
//       });
//     };
//   };

//   /**
//    * Delete file from Cloudinary
//    */
//   static deleteFile = async (publicId) => {
//     try {
//       const result = await cloudinary.uploader.destroy(publicId);
      
//       if (result.result === 'ok') {
//         console.log(`File deleted: ${publicId}`);
//         return { success: true, result };
//       } else {
//         console.warn(`Failed to delete file: ${publicId}`, result);
//         return { success: false, error: result.result };
//       }
//     } catch (error) {
//       console.error('Error deleting file:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   /**
//    * Delete multiple files
//    */
//   static deleteFiles = async (publicIds) => {
//     try {
//       const results = await Promise.all(
//         publicIds.map(id => UploadMiddleware.deleteFile(id))
//       );
      
//       const successCount = results.filter(r => r.success).length;
      
//       return {
//         success: successCount === publicIds.length,
//         total: publicIds.length,
//         deleted: successCount,
//         results
//       };
//     } catch (error) {
//       console.error('Error deleting files:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   /**
//    * Generate signed upload URL (for direct client uploads)
//    */
//   static generateSignedUploadUrl = async (uploadType, publicId = null) => {
//     try {
//       const timestamp = Math.round(Date.now() / 1000);
//       const folder = UploadMiddleware.getStorage(uploadType).params.folder;
      
//       const params = {
//         timestamp: timestamp,
//         folder: folder,
//         format: 'webp'
//       };

//       if (publicId) {
//         params.public_id = publicId;
//       }

//       // Generate signature
//       const signature = cloudinary.utils.api_sign_request(
//         params,
//         process.env.CLOUDINARY_API_SECRET
//       );

//       return {
//         url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
//         params: {
//           ...params,
//           signature: signature,
//           api_key: process.env.CLOUDINARY_API_KEY
//         }
//       };
//     } catch (error) {
//       console.error('Error generating signed URL:', error);
//       throw error;
//     }
//   };

//   /**
//    * Validate uploaded file (check for required dimensions, etc.)
//    */
//   static validateUpload = async (fileInfo, requirements = {}) => {
//     const errors = [];

//     // Check dimensions if required
//     if (requirements.minWidth && fileInfo.width < requirements.minWidth) {
//       errors.push(`Image width must be at least ${requirements.minWidth}px`);
//     }
    
//     if (requirements.minHeight && fileInfo.height < requirements.minHeight) {
//       errors.push(`Image height must be at least ${requirements.minHeight}px`);
//     }
    
//     if (requirements.maxWidth && fileInfo.width > requirements.maxWidth) {
//       errors.push(`Image width must not exceed ${requirements.maxWidth}px`);
//     }
    
//     if (requirements.maxHeight && fileInfo.height > requirements.maxHeight) {
//       errors.push(`Image height must not exceed ${requirements.maxHeight}px`);
//     }

//     // Check aspect ratio
//     if (requirements.aspectRatio) {
//       const [widthRatio, heightRatio] = requirements.aspectRatio.split(':').map(Number);
//       const actualRatio = fileInfo.width / fileInfo.height;
//       const targetRatio = widthRatio / heightRatio;
//       const tolerance = requirements.aspectTolerance || 0.1;

//       if (Math.abs(actualRatio - targetRatio) > tolerance) {
//         errors.push(`Image aspect ratio must be ${widthRatio}:${heightRatio}`);
//       }
//     }

//     // Check file size
//     if (requirements.maxSize && fileInfo.bytes > requirements.maxSize) {
//       errors.push(`File size must not exceed ${requirements.maxSize / (1024 * 1024)}MB`);
//     }

//     // Check format
//     if (requirements.allowedFormats && !requirements.allowedFormats.includes(fileInfo.format)) {
//       errors.push(`File format must be one of: ${requirements.allowedFormats.join(', ')}`);
//     }

//     return {
//       isValid: errors.length === 0,
//       errors
//     };
//   };

//   /**
//    * Process image (apply transformations)
//    */
//   static processImage = async (publicId, transformations = []) => {
//     try {
//       const defaultTransformations = [
//         { quality: 'auto:good' },
//         { fetch_format: 'auto' }
//       ];

//       const allTransformations = [...transformations, ...defaultTransformations];
      
//       const url = cloudinary.url(publicId, {
//         transformation: allTransformations
//       });

//       return {
//         success: true,
//         url: url,
//         secureUrl: url.replace('http://', 'https://')
//       };
//     } catch (error) {
//       console.error('Error processing image:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   /**
//    * Middleware to clean up uploaded files on error
//    */
//   static cleanupOnError = async (req, res, next) => {
//     // Store original send function
//     const originalSend = res.send;
//     const originalJson = res.json;

//     // Override send to check for errors
//     res.send = function(body) {
//       if (res.statusCode >= 400) {
//         // Clean up uploaded files
//         UploadMiddleware.cleanupUploads(req).catch(console.error);
//       }
//       return originalSend.call(this, body);
//     };

//     res.json = function(body) {
//       if (res.statusCode >= 400) {
//         // Clean up uploaded files
//         UploadMiddleware.cleanupUploads(req).catch(console.error);
//       }
//       return originalJson.call(this, body);
//     };

//     next();
//   };

//   /**
//    * Clean up uploaded files
//    */
//   static cleanupUploads = async (req) => {
//     try {
//       const filesToDelete = [];

//       if (req.fileInfo) {
//         filesToDelete.push(req.fileInfo.publicId);
//       }

//       if (req.filesInfo) {
//         req.filesInfo.forEach(file => {
//           filesToDelete.push(file.publicId);
//         });
//       }

//       if (filesToDelete.length > 0) {
//         console.log(`Cleaning up ${filesToDelete.length} uploaded files due to error`);
//         await UploadMiddleware.deleteFiles(filesToDelete);
//       }
//     } catch (error) {
//       console.error('Error cleaning up uploads:', error);
//     }
//   };
// }

// /**
//  * Convenience middleware exports
//  */
// module.exports = {
//   UploadMiddleware,
  
//   // Single file uploads
//   uploadVerificationPhoto: UploadMiddleware.getUploadMiddleware('verificationPhoto', 'photo'),
//   uploadProfilePicture: UploadMiddleware.getUploadMiddleware('profilePicture', 'avatar'),
//   uploadChatMedia: UploadMiddleware.getUploadMiddleware('chatMedia', 'media'),
//   uploadDocument: UploadMiddleware.getUploadMiddleware('document', 'document'),
  
//   // Multiple file uploads
//   uploadMultipleChatMedia: UploadMiddleware.getMultiUploadMiddleware('chatMedia', 'media', 10),
  
//   // Utility functions
//   deleteFile: UploadMiddleware.deleteFile,
//   deleteFiles: UploadMiddleware.deleteFiles,
//   validateUpload: UploadMiddleware.validateUpload,
//   processImage: UploadMiddleware.processImage,
//   generateSignedUploadUrl: UploadMiddleware.generateSignedUploadUrl,
//   cleanupOnError: UploadMiddleware.cleanupOnError
// };