const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const commentRoutes = require('./routes/commentRoutes');

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const http = require('http');
const { Server } = require('socket.io');

const {
  globalLimiter,
} = require(
  './middleware/rateLimiter'
);

const {
  connectRedis,
} = require(
  './config/redis'
);

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

app.use(globalLimiter);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/comments', commentRoutes);

// Static files for uploaded media
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modernblog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.set('io', io);

connectRedis();

global.io = io;

io.on('connection', (socket) => {

  console.log(
    'User connected:',
    socket.id
  );

  socket.on('disconnect', () => {

    console.log(
      'User disconnected:',
      socket.id
    );
  });
});

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});