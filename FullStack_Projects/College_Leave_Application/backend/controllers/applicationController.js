const asyncHandler = require('express-async-handler');
const Application = require('../models/applicationModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const dayjs = require('dayjs');

// @desc    Get user's leave applications
// @route   GET /api/applications
// @access  Private
const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user.id });
  res.status(200).json(applications);
});

// @desc    Create new leave application
// @route   POST /api/applications
// @access  Private
const createApplication = asyncHandler(async (req, res) => {
  const { subject, reason, startDate, endDate, documentUrl, leaveType } = req.body;

  if (!subject || !reason || !startDate || !endDate || !leaveType) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const duration = end.diff(start, 'day') + 1;

  if (duration <= 0) {
    res.status(400);
    throw new Error('End date must be after start date.');
  }

  const user = await User.findById(req.user.id);
  const balanceField = leaveType === 'Sick Leave' ? 'sickLeave' : 'casualLeave';

  if (user.leaveQuotas[balanceField] < duration) {
    res.status(400);
    throw new Error('Insufficient leave balance.');
  }

  const application = await Application.create({
    subject, reason, startDate, endDate, leaveType, duration, documentUrl, user: req.user.id,
  });

  user.leaveQuotas[balanceField] -= duration;
  await user.save();

  try {
    const staffMembers = await User.find({ role: { $in: ['staff', 'admin'] } });
    const staffEmails = staffMembers.map(staff => staff.email);

    if (staffEmails.length > 0) {
      const message = `A new leave application has been submitted by ${req.user.name} for "${subject}".\n\nPlease log in to the staff dashboard to review it.`;
      await sendEmail({
        email: staffEmails.join(','),
        subject: 'New Leave Application Submitted',
        message,
      });
    }
  } catch (error) {
    console.error('Email failed to send:', error);
  }

  res.status(201).json(application);
});

// @desc    Get single leave application
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('user', 'name email');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.user._id.toString() !== req.user.id && req.user.role !== 'staff' && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not Authorized');
  }

  res.status(200).json(application);
});

// @desc    Delete a leave application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  if (application.status !== 'Pending') {
    res.status(400);
    throw new Error('Cannot withdraw an application that has already been processed');
  }

  const user = await User.findById(req.user.id);
  const balanceField = application.leaveType === 'Sick Leave' ? 'sickLeave' : 'casualLeave';
  user.leaveQuotas[balanceField] += application.duration;
  await user.save();

  await application.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Application withdrawn and leave days refunded.' });
});

// @desc    Update own leave application
// @route   PUT /api/applications/:id
// @access  Private
const updateOwnApplication = asyncHandler(async (req, res) => {
  const { subject, reason, startDate, endDate, documentUrl, leaveType } = req.body;
  
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  if (application.status !== 'Pending') {
    res.status(400);
    throw new Error('Cannot edit an application that has already been processed');
  }

  const user = await User.findById(req.user.id);
  const oldDuration = application.duration;
  const balanceField = application.leaveType === 'Sick Leave' ? 'sickLeave' : 'casualLeave';
  
  user.leaveQuotas[balanceField] += oldDuration;
  
  const newStart = dayjs(startDate || application.startDate);
  const newEnd = dayjs(endDate || application.endDate);
  const newDuration = newEnd.diff(newStart, 'day') + 1;

  if (newDuration <= 0) {
    res.status(400);
    throw new Error('End date must be after start date.');
  }

  if (user.leaveQuotas[balanceField] < newDuration) {
    res.status(400);
    throw new Error('Insufficient leave balance for the updated duration.');
  }
  user.leaveQuotas[balanceField] -= newDuration;

  application.subject = subject || application.subject;
  application.reason = reason || application.reason;
  application.startDate = startDate || application.startDate;
  application.endDate = endDate || application.endDate;
  application.documentUrl = documentUrl || application.documentUrl;
  application.leaveType = leaveType || application.leaveType;
  application.duration = newDuration;

  const updatedApplication = await application.save();
  await user.save();

  if (req.io) {
    req.io.emit('applicationUpdated', updatedApplication);
  }

  res.status(200).json(updatedApplication);
});

// --- Admin Routes ---

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private/Admin
const getApplicationStats = asyncHandler(async (req, res) => {
  const stats = await Application.aggregate([ { $group: { _id: '$status', count: { $sum: 1 } } } ]);
  const statsFormatted = stats.reduce((acc, curr) => {
    acc[curr._id.toLowerCase()] = curr.count;
    return acc;
  }, {});
  const totalApplications = await Application.countDocuments();
  res.status(200).json({
    totalApplications,
    pending: statsFormatted.pending || 0,
    approved: statsFormatted.approved || 0,
    rejected: statsFormatted.rejected || 0,
  });
});

// @desc    Get all applications (for staff)
// @route   GET /api/applications/all
// @access  Private/Admin
const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({}).populate('user', 'name email');
  res.status(200).json(applications);
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  const application = await Application.findById(req.params.id).populate('user', 'name email');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  application.status = status;
  application.staffComment = comment || '';
  const updatedApplication = await application.save();

  try {
    const message = `Hi ${application.user.name},\n\nYour leave application for "${application.subject}" has been ${status}.\n\nStaff Comment: ${application.staffComment || 'N/A'}\n\nThank you.`;
    await sendEmail({
      email: application.user.email,
      subject: `Your Leave Application has been ${status}`,
      message,
    });
  } catch (error) {
    console.error('Email failed to send:', error);
  }

  res.status(200).json(updatedApplication);
});


module.exports = {
  getApplications,
  createApplication,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats,
  getApplicationById,
  deleteApplication,
  updateOwnApplication,
};