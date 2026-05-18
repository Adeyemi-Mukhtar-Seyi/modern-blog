const Comment = require('../models/commentModel');

const createComment = async (req, res) => {
  try {
    const { postId, content, quotedComment } = req.body;

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      content,
      quotedComment: quotedComment || null,
    });

    const populated = await comment.populate([
      { path: 'user', select: 'username profilePicture' },
      {
        path: 'quotedComment',
        populate: {
          path: 'user',
          select: 'username',
        },
      },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPostComments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = 10;

    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments({
      post: req.params.postId,
    });

    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate('user', 'username profilePicture')
      .populate({
        path: 'quotedComment',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    const userId = req.user._id.toString();

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        id => id.toString() !== userId
      );
    } else {
      comment.likes.push(userId);

      comment.dislikes = comment.dislikes.filter(
        id => id.toString() !== userId
      );
    }

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
    .populate('user', 'username profilePicture')
    .populate({
        path: 'quotedComment',
        populate: {
        path: 'user',
        select: 'username',
        },
    });

res.json(updatedComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleDislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    const userId = req.user._id.toString();

    const alreadyDisliked = comment.dislikes.includes(userId);

    if (alreadyDisliked) {
      comment.dislikes = comment.dislikes.filter(
        id => id.toString() !== userId
      );
    } else {
      comment.dislikes.push(userId);

      comment.likes = comment.likes.filter(
        id => id.toString() !== userId
      );
    }

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
    .populate('user', 'username profilePicture')
    .populate({
        path: 'quotedComment',
        populate: {
        path: 'user',
        select: 'username',
        },
    });

res.json(updatedComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getPostComments,
  toggleLikeComment,
  toggleDislikeComment,
};