const User = require('../models/User');

class UserService {
  async getUsersBySocietyId(societyId) {
    return await User.find({ societyId });
  }

  async updateUser(userId, updateData, currentUserId, currentUserSocietyId) {
    let user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Ensure society admin is updating user from their own society
    if (user.societyId.toString() !== currentUserSocietyId.toString()) {
      const error = new Error('Not authorized to update this user');
      error.statusCode = 403;
      throw error;
    }

    // Prevent society admin from making someone Super Admin
    if (updateData.role === 'Super Admin') {
      const error = new Error('Cannot assign Super Admin role');
      error.statusCode = 403;
      throw error;
    }

    user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });

    return user;
  }
}

module.exports = new UserService();
