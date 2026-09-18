const userService = require('../services/userService');

// @desc    Get all users in a society
// @route   GET /api/v1/users
// @access  Private (Society Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsersBySocietyId(req.user.societyId);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role/status
// @route   PUT /api/v1/users/:id
// @access  Private (Society Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user.id, req.user.societyId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
