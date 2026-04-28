const express = require('express');
const router = express.Router();
const { 
  createApplication, 
  getApplications, 
  getAllApplications, 
  updateApplicationStatus,
  getApplicationStats,
  getApplicationById,
  deleteApplication,
  updateOwnApplication // <-- Import the new update function
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');

// --- Routes for the main application list ---
// Students: Get their own applications, or create a new one
router.route('/').get(protect, getApplications).post(protect, createApplication);

// Admins: Get stats or all applications
router.get('/stats', protect, admin, getApplicationStats);
router.get('/all', protect, admin, getAllApplications);


// --- Routes for a SINGLE application by ID ---
// Student routes: Get, delete, or update their own application
router.route('/:id')
  .get(protect, getApplicationById)
  .delete(protect, deleteApplication)
  .put(protect, updateOwnApplication); // <-- ADD THIS LINE

// Admin route: Update the status of any application
router.put('/:id/status', protect, admin, updateApplicationStatus);


module.exports = router;