const noticeService = require('../services/noticeService');

// @desc    Create a notice
// @route   POST /api/v1/notices
// @access  Private (Society Admin)
exports.createNotice = async (req, res, next) => {
  try {
    req.body.societyId = req.user.societyId;
    req.body.authorId = req.user.id;
    
    const notice = await noticeService.createNotice(req.body);
    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active notices for a society
// @route   GET /api/v1/notices
// @access  Private (All roles in society)
exports.getNotices = async (req, res, next) => {
  try {
    const notices = await noticeService.getNoticesBySocietyId(req.user.societyId);
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notice
// @route   DELETE /api/v1/notices/:id
// @access  Private (Society Admin)
exports.deleteNotice = async (req, res, next) => {
  try {
    await noticeService.deleteNotice(req.params.id, req.user.societyId);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
