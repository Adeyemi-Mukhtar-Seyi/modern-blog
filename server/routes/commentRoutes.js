const express = require('express');

const {
  createComment,
  getPostComments,
  toggleLikeComment,
  toggleDislikeComment,
} = require('../controllers/commentController');

const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/:postId', getPostComments);

router.post('/', auth, createComment);

router.put('/:id/like', auth, toggleLikeComment);

router.put('/:id/dislike', auth, toggleDislikeComment);

module.exports = router;