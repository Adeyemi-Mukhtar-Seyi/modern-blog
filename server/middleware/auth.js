const jwt = require("jsonwebtoken");
const User = require("../models/User");

// General auth middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId || decoded.id); // handle both formats
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin-only middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed." });
  }
};

module.exports = { auth, adminAuth };








// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
//     const user = await User.findById(decoded.userId);
    
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid token.' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token.' });
//   }
// };

// const adminAuth = async (req, res, next) => {
//   try {
//     await auth(req, res, () => {
//       if (req.user.role !== 'admin') {
//         return res.status(403).json({ message: 'Access denied. Admin only.' });
//       }
//       next();
//     });
//   } catch (error) {
//     res.status(401).json({ message: 'Authentication failed.' });
//   }
// };

// module.exports = { auth, adminAuth };

