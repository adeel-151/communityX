const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add visitor name'],
  },
  phone: {
    type: String,
    required: [true, 'Please add visitor phone'],
  },
  purpose: {
    type: String,
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // The resident hosting the visitor
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Denied', 'CheckedIn', 'CheckedOut'],
    default: 'Pending',
  },
  entryTime: {
    type: Date,
  },
  exitTime: {
    type: Date,
  },
  guardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Visitor', visitorSchema);
