const Post = require('../models/Post');

const {
  redisClient,
} = require(
  '../config/redis'
);



// ======================================
// GET ALL POSTS
// ======================================

exports.getPosts = async (req, res) => {

  try {

    const page =
      Number(req.query.page) || 1;

    const limit = 5;

    const skip =
      (page - 1) * limit;



    const cacheKey =
      `posts:page:${page}`;



    // CHECK CACHE
    let cachedPosts = null;

    try {

      cachedPosts =
        await redisClient.get(
          cacheKey
        );

    } catch (error) {

      console.log(
        'Redis read failed:',
        error.message
      );
    }



    // RETURN CACHE
    if (cachedPosts) {

      return res.status(200).json(
        JSON.parse(cachedPosts)
      );
    }



    // DATABASE QUERY
    const posts = await Post.find()
      .populate(
        'author',
        'username role _id'
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);



    // TOTAL POSTS
    const totalPosts =
      await Post.countDocuments();



    const hasMore =
      skip + posts.length <
      totalPosts;



    const responseData = {

      posts,

      nextPage:
        hasMore
          ? page + 1
          : null,
    };



    // STORE CACHE
    try {

      await redisClient.setEx(
        cacheKey,
        60,
        JSON.stringify(responseData)
      );

    } catch (error) {

      console.log(
        'Redis write failed:',
        error.message
      );
    }



    res.status(200).json(
      responseData
    );

  } catch (error) {

    res.status(500).json({
      message:
        'Failed to fetch posts',
      error: error.message,
    });
  }
};


// ======================================
// GET SINGLE POST
// ======================================

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username role _id');

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch post',
    });
  }
};



// ======================================
// CREATE POST
// ======================================

exports.createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      subcategory,
      image,
    } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      subcategory,
      image,

      // SECURE AUTHOR
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username role _id');

      const keys =
        await redisClient.keys(
          'posts:page:*'
        );

      if (keys.length > 0) {

        await redisClient.del(keys);
      }

    res.status(201).json(populatedPost);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to create post',
    });
  }
};



// ======================================
// UPDATE POST
// ======================================

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // OWNER CHECK
    const isOwner =
      post.author?._id?.toString() === req.user._id.toString();

    // ADMIN CHECK
    const isAdmin =
      req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Not authorized to edit this post',
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    ).populate('author', 'username role _id');
     const keys =
        await redisClient.keys(
          'posts:page:*'
        );

      if (keys.length > 0) {

        await redisClient.del(keys);
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update post',
    });
  }
};



// ======================================
// DELETE POST
// ======================================

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // OWNER CHECK
    const isOwner =
      post.author?._id?.toString() === req.user._id.toString();

    // ADMIN CHECK
    const isAdmin =
      req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();
    const keys =
      await redisClient.keys(
        'posts:page:*'
      );

    if (keys.length > 0) {

      await redisClient.del(keys);
    }

    res.json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete post',
    });
  }
};



// ======================================
// GET POSTS BY CATEGORY
// ======================================

exports.getPostsByCategory = async (req, res) => {
  try {
    const posts = await Post.find({
      category: req.params.category,
    })
      .populate('author', 'username role _id')
      .sort({ createdAt: -1 });

    res.json({
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch category posts',
    });
  }
};



// ======================================
// SEARCH POSTS
// ======================================

exports.searchPosts = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      subcategory = '',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // CATEGORY FILTER
    if (category) {
      query.category = category;
    }

    // SUBCATEGORY FILTER
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // SEARCH
    if (search) {
      query.$text = {
        $search: search,
      };
    }

    const posts = await Post.find(query)
      .populate('author', 'username role _id')
      .sort(
        search
          ? { score: { $meta: 'textScore' } }
          : { createdAt: -1 }
      )
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Search failed',
    });
  }
};