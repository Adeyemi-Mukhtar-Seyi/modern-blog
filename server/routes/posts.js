const express = require('express');
const Post = require('../models/Post');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const {
  getPostsByCategory,
} = require('../controllers/postController');

const {
  searchPosts,
} = require('../controllers/postController');


// Get all posts (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ status: 'published' })
    .populate('author', 'username role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    console.log(posts);

    const total = await Post.countDocuments({ status: 'published' });


    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
  console.log("CREATE POST ERROR:");
  console.log(error);

  res.status(500).json({
    message: 'Error creating post',
    error: error.message
  });
}
});

// Get posts for admin (includes drafts)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
    .populate('author', 'username role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
  console.log("CREATE POST ERROR:");
  console.log(error);

  res.status(500).json({
    message: 'Error creating post',
    error: error.message
  });
}
});

router.get(
  '/search/all',
  searchPosts
);

router.get(
  '/category/:category',
  getPostsByCategory
);

// Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: 'published',
    }).populate('author', 'username role');;
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views = (post.views || 0) + 1;
    await post.save();

    res.json(post);
  } catch (error) {
  console.log("CREATE POST ERROR:");
  console.log(error);

  res.status(500).json({
    message: 'Error creating post',
    error: error.message
  });
}
});

// Create new post (Admin only)
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { title,
    content,
    category,
    subcategory,
    mediaType,
    tags, } = req.body;
    
    let mediaUrl = null;
    let mediaPath = null;

    if (req.file) {
      mediaPath = req.file.path;
      mediaUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    }

   const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-');

    const post = new Post({
    title,
    slug,
    content,

    category,
    subcategory,

    author: req.user._id,

    mediaType: mediaType || 'none',

    mediaUrl,
    mediaPath,

    tags: tags
      ? tags.split(',').map(tag => tag.trim())
      : [],
  });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
      console.log("CREATE POST ERROR:");
      console.log(error);

      res.status(500).json({
        message: 'Error creating post',
        error: error.message
      });
    }
});


// Update post (Admin only)
router.put('/:id', auth, upload.single('media'), async (req, res) => {
  try {
    const { title, content, mediaType, tags, status } = req.body;
    
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // OWNER CHECK
    const isOwner =
      post.author.toString() === req.user._id.toString();

    // ADMIN CHECK
    const isAdmin =
      req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Not authorized to update this post'
      });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (mediaType) post.mediaType = mediaType;
    if (status) post.status = status;

    if (tags) {
      post.tags = tags
        .split(',')
        .map(tag => tag.trim());
    }

    if (req.file) {
      if (
        post.mediaPath &&
        require('fs').existsSync(post.mediaPath)
      ) {
        require('fs').unlinkSync(post.mediaPath);
      }

      post.mediaPath = req.file.path;

      post.mediaUrl =
        `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    }

    await post.save();

    res.json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Error updating post',
      error: error.message
    });
  }
});

// Delete post (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // OWNER CHECK
    const isOwner =
      post.author.toString() === req.user._id.toString();

    // ADMIN CHECK
    const isAdmin =
      req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Not authorized to delete this post'
      });
    }

    // Delete associated media file
    if (post.mediaPath && require('fs').existsSync(post.mediaPath)) {
      require('fs').unlinkSync(post.mediaPath);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
  console.log("CREATE POST ERROR:");
  console.log(error);

  res.status(500).json({
    message: 'Error creating post',
    error: error.message
  });
}
});

// Like / Unlike Post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    const userId = req.user._id.toString();

    post.likes = post.likes || [];

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    post.likesCount = post.likes.length;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username role');;

    res.json({
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
      post: updatedPost
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Error liking post',
      error: error.message
    });
  }
});


module.exports = router;
