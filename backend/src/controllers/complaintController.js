const complaintService = require('../services/complaintService');

// @desc    Create a complaint
// @route   POST /api/v1/complaints
// @access  Private (Resident)
exports.createComplaint = async (req, res, next) => {
  try {
    req.body.residentId = req.user.id;
    req.body.societyId = req.user.societyId;
    
    if (req.file) {
      req.body.attachment = req.file.path; // Cloudinary URL
    }

    const complaint = await complaintService.createComplaint(req.body);
    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints for a society
// @route   GET /api/v1/complaints
// @access  Private (Society Admin, Maintenance, Resident)
exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getComplaints(req.user.societyId, req.user.role, req.user.id);
    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status/assignment
// @route   PUT /api/v1/complaints/:id
// @access  Private (Society Admin, Maintenance)
exports.updateComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.updateComplaint(
      req.params.id, 
      req.body, 
      req.user.role, 
      req.user.id, 
      req.user.societyId
    );
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};
