const express = require('express');
const router = express.Router();
const { authenticateToken: auth } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const VerificationWall = require('../models/VerificationWall');
const User = require('../models/user');

// @route   POST /api/verification-wall
// @desc    Create a new verification wall post
// @access  Private
router.post('/', auth, [
  check('photoUrl', 'Photo URL is required').not().isEmpty(),
  check('activityType', 'Activity type is required').optional(),
  check('duration', 'Duration is required').optional(),
  check('caption', 'Caption must be less than 500 characters').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { photoUrl, activityType = 'other', duration = 30, location, caption, tags, streakId } = req.body;

    // Create verification wall post
    const wallPost = new VerificationWall({
      userId: req.user.id,
      photoUrl,
      activityType,
      duration,
      location,
      caption,
      tags: tags || [],
      streakId
    });

    await wallPost.save();

    // Populate user data
    await wallPost.populate('userId', 'username avatar displayName');

    res.json({
      success: true,
      message: 'Verification wall post created successfully',
      post: wallPost
    });

  } catch (err) {
    console.error('Create verification wall post error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error creating verification wall post'
    });
  }
});

// @route   GET /api/verification-wall
// @desc    Get public verification wall posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await VerificationWall.getPublicPosts(limit, skip)
      .populate('userId', 'username avatar displayName')
      .populate('streakId', 'currentStreak');

    const total = await VerificationWall.countDocuments({ isBlocked: false });

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    });

  } catch (err) {
    console.error('Get verification wall posts error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error fetching verification wall posts'
    });
  }
});

// @route   GET /api/verification-wall/:id
// @desc    Get single verification wall post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await VerificationWall.findById(req.params.id)
      .populate('userId', 'username avatar displayName')
      .populate('streakId', 'currentStreak')
      .populate('comments.userId', 'username avatar')
      .populate('likes.userId', 'username');

    if (!post) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    if (post.isBlocked) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post
    });

  } catch (err) {
    console.error('Get verification wall post error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error fetching verification wall post'
    });
  }
});

// @route   POST /api/verification-wall/:id/like
// @desc    Like/unlike a verification wall post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await VerificationWall.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    if (post.isBlocked) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    const wasLiked = post.likes.some(like => like.userId.toString() === req.user.id);

    await post.toggleLike(req.user.id);

    res.json({
      success: true,
      message: wasLiked ? 'Post unliked' : 'Post liked',
      liked: !wasLiked,
      likeCount: post.likeCount
    });

  } catch (err) {
    console.error('Like verification wall post error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error liking verification wall post'
    });
  }
});

// @route   POST /api/verification-wall/:id/comment
// @desc    Add comment to verification wall post
// @access  Private
router.post('/:id/comment', auth, [
  check('text', 'Comment text is required').not().isEmpty().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await VerificationWall.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    if (post.isBlocked) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    await post.addComment(req.user.id, req.body.text);

    // Populate the new comment
    await post.populate('comments.userId', 'username avatar');

    const newComment = post.comments[post.comments.length - 1];

    res.json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error adding comment'
    });
  }
});

// @route   POST /api/verification-wall/:id/report
// @desc    Report a verification wall post
// @access  Private
router.post('/:id/report', auth, [
  check('reason', 'Report reason is required').isIn(['fake_photo', 'inappropriate', 'spam', 'copyright', 'other']),
  check('details', 'Report details must be less than 500 characters').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await VerificationWall.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    if (post.isBlocked) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    await post.addReport(req.user.id, req.body.reason, req.body.details);

    res.json({
      success: true,
      message: 'Report submitted successfully'
    });

  } catch (err) {
    console.error('Report verification wall post error:', err);

    if (err.message === 'You have already reported this post') {
      return res.status(400).json({
        error: 'ALREADY_REPORTED',
        message: err.message
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error reporting verification wall post'
    });
  }
});

// @route   GET /api/verification-wall/reports/pending
// @desc    Get reported posts for moderation (admin only)
// @access  Private (Admin)
router.get('/reports/pending', auth, async (req, res) => {
  try {
    // Check if user is admin (you might want to add admin role check)
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Admin access required'
      });
    }

    const reportedPosts = await VerificationWall.getReportedPosts();

    res.json({
      success: true,
      posts: reportedPosts
    });

  } catch (err) {
    console.error('Get reported posts error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error fetching reported posts'
    });
  }
});

// @route   POST /api/verification-wall/:id/moderate
// @desc    Moderate a reported post (admin only)
// @access  Private (Admin)
router.post('/:id/moderate', auth, [
  check('action', 'Action is required').isIn(['block', 'dismiss']),
  check('reportId', 'Report ID is required').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Admin access required'
      });
    }

    const post = await VerificationWall.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    await post.moderateReport(req.body.reportId, req.body.action, req.user.id);

    res.json({
      success: true,
      message: `Post ${req.body.action === 'block' ? 'blocked' : 'report dismissed'} successfully`
    });

  } catch (err) {
    console.error('Moderate post error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error moderating post'
    });
  }
});

// @route   DELETE /api/verification-wall/:id
// @desc    Delete verification wall post (owner or admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await VerificationWall.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Verification wall post not found'
      });
    }

    // Check if user owns the post or is admin
    const user = await User.findById(req.user.id);
    const isOwner = post.userId.toString() === req.user.id;
    const isAdmin = user && user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You can only delete your own posts'
      });
    }

    // Soft delete by blocking
    post.isBlocked = true;
    post.blockedReason = 'Deleted by user';
    post.blockedAt = new Date();
    post.blockedBy = req.user.id;

    await post.save();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (err) {
    console.error('Delete verification wall post error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error deleting verification wall post'
    });
  }
});

module.exports = router;
