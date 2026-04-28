const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      default: 'student',
    },
    // --- Add this new field for leave balances ---
    leaveQuotas: {
      sickLeave: {
        type: Number,
        default: 10,
      },
      casualLeave: {
        type: Number,
        default: 12,
      },
    },
    // ---------------------------------------------
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;