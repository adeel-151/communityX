const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
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
    enum: ['Open', 'InProgress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Usually Maintenance staff
  },
  category: {
    type: String,
    enum: ['Electrical', 'Plumbing', 'Cleaning', 'Security', 'Other'],
    default: 'Other',
  },
  attachment: {
    type: String // Cloudinary URL
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
