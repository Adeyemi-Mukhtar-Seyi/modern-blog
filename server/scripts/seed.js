// scripts/seed.js (Database seeding script)
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modernblog');
    
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@blog.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    
    // Create regular user
    const regularUser = new User({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });
    await regularUser.save();
    
    // Create sample posts
    const samplePosts = [
      {
        title: "Getting Started with React Hooks",
        content: "React Hooks have revolutionized the way we write React components...",
        author: adminUser._id,
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        tags: ['react', 'javascript', 'hooks']
      },
      {
        title: "Advanced JavaScript Patterns",
        content: "JavaScript patterns are essential for writing clean, maintainable code...",
        author: regularUser._id,
        mediaType: 'video',
        tags: ['javascript', 'patterns', 'programming']
      }
    ];
    
    for (const postData of samplePosts) {
      const post = new Post(postData);
      await post.save();
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();