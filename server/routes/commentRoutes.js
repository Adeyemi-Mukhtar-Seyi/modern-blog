const express = require('express');

const {
  createComment,
  getPostComments,
  toggleLikeComment,
  toggleDislikeComment,
} = require('../controllers/commentController');

const {
  commentLimiter,
  likeLimiter,
} = require('../middleware/rateLimiter');

const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/:postId', getPostComments);

router.post('/', auth, commentLimiter, createComment);

router.put('/:id/like', auth, likeLimiter, toggleLikeComment);

router.put('/:id/dislike', auth, toggleDislikeComment);

module.exports = router;