const Post = require('../models/Post');

exports.getPostsByCategory = async (req, res) => {
  try {
    const posts = await Post.find({
      category: req.params.category,
    })
      .populate('author', 'username')
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
      .populate('author', 'username')
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