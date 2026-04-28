const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
    },
    reason: {
      type: String,
      required: [true, 'Please add a reason'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    documentUrl: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    // --- This is the new field to add ---
    staffComment: {
      type: String,
      default: '',
    },
    // ------------------------------------
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);