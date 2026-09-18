const Complaint = require('../models/Complaint');

class ComplaintService {
  async createComplaint(complaintData) {
    return await Complaint.create(complaintData);
  }

  async getComplaints(societyId, userRole, userId) {
    let query = { societyId };

    // If resident, only show their own complaints
    if (userRole === 'Resident') {
      query.residentId = userId;
    }
    // If maintenance, only show assigned to them
    if (userRole === 'Maintenance') {
      query.assignedTo = userId;
    }

    return await Complaint.find(query).populate('residentId', 'name unitNumber').populate('assignedTo', 'name');
  }

  async updateComplaint(complaintId, updateData, userRole, userId, societyId) {
    let complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      const error = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    if (complaint.societyId.toString() !== societyId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    if (userRole === 'Maintenance' && complaint.assignedTo?.toString() !== userId.toString()) {
      const error = new Error('Not assigned to this complaint');
      error.statusCode = 403;
      throw error;
    }

    complaint = await Complaint.findByIdAndUpdate(complaintId, updateData, {
      new: true,
      runValidators: true
    });

    return complaint;
  }
}

module.exports = new ComplaintService();
