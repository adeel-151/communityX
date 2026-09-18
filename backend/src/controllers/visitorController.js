const visitorService = require('../services/visitorService');

// @desc    Create visitor pass
// @route   POST /api/v1/visitors
// @access  Private (Resident, Society Admin)
exports.createVisitor = async (req, res, next) => {
  try {
    req.body.hostId = req.user.id;
    req.body.societyId = req.user.societyId;
    
    const visitor = await visitorService.createVisitor(req.body);
    res.status(201).json({ success: true, data: visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get visitors for a society
// @route   GET /api/v1/visitors
// @access  Private (Security Guard, Society Admin)
exports.getVisitors = async (req, res, next) => {
  try {
    const visitors = await visitorService.getVisitorsBySocietyId(req.user.societyId);
    res.status(200).json({ success: true, count: visitors.length, data: visitors });
  } catch (error) {
    next(error);
  }
};

// @desc    Update visitor status (check-in/check-out)
// @route   PUT /api/v1/visitors/:id/status
// @access  Private (Security Guard)
exports.updateVisitorStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const visitor = await visitorService.updateVisitorStatus(
      req.params.id, 
      status, 
      req.user.societyId, 
      req.user.id
    );

    res.status(200).json({ success: true, data: visitor });
  } catch (error) {
    next(error);
  }
};
