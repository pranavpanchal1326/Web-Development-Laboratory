const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword,
  getAllUsers // <-- Import the new function
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

// Admin-only route to get all users
router.get('/', protect, admin, getAllUsers);


module.exports = router;