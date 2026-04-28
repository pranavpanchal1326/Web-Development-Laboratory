const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// 1. Define the 'protect' function completely
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach it to the request object
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move on to the next piece of middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401); // 401 = Not Authorized
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// 2. Define the 'admin' function completely
const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    next(); // User is an admin or staff, proceed
  } else {
    res.status(401); // Not authorized
    throw new Error('Not authorized as an admin or staff member');
  }
};

// 3. Export both functions at the very end of the file
module.exports = { protect, admin };