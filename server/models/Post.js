const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'audio', 'none'],
    default: 'none'
  },
  mediaUrl: {
    type: String,
    default: null
  },
  mediaPath: {
    type: String,
    default: null
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
  }],

  likesCount: {
    type: Number,
    default: 0
  },
  category: {
  type: String,
  default: 'General',
},

subcategory: {
  type: String,
  default: 'News',
},
}, {
  timestamps: true
});

// Generate slug from title
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      + '-' + Date.now();
  }
  next();
});

// Virtual for excerpt
postSchema.virtual('excerpt').get(function() {
  return this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '');
});

// Populate author by default
postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'username email avatar'
  });
  next();
});

postSchema.index({
  title: 'text',
  content: 'text',
  category: 'text',
  subcategory: 'text',
});

module.exports = mongoose.model('Post', postSchema);