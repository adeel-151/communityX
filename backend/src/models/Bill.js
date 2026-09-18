const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a bill title'],
  },
  amount: {
    type: Number,
    required: [true, 'Please add amount'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add due date'],
  },
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue'],
    default: 'Pending',
  },
  paymentReceipt: {
    type: String, // URL to cloudinary
  },
  paymentDate: {
    type: Date,
  },
  type: {
    type: String,
    enum: ['Maintenance', 'Electricity', 'Water', 'Other'],
    default: 'Maintenance'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);
