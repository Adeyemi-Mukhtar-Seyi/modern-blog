import express from 'express';
import {
  createComment,
  getPostComments,
  toggleLikeComment,
  toggleDislikeComment,
} from '../controllers/commentController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:postId', getPostComments);

router.post('/', protect, createComment);

router.put('/:id/like', protect, toggleLikeComment);

router.put('/:id/dislike', protect, toggleDislikeComment);

export default router;