const Society = require('../models/Society');

class SocietyService {
  async createSociety(societyData) {
    return await Society.create(societyData);
  }

  async getSocieties() {
    return await Society.find().populate('adminId', 'name email');
  }

  async getSocietyById(societyId, userRole, userSocietyId) {
    const society = await Society.findById(societyId).populate('adminId', 'name email');
    if (!society) {
      const error = new Error('Society not found');
      error.statusCode = 404;
      throw error;
    }

    // Tenant check: if not Super Admin, ensure they belong to this society
    if (userRole !== 'Super Admin' && userSocietyId.toString() !== societyId.toString()) {
      const error = new Error('Not authorized to access this society');
      error.statusCode = 403;
      throw error;
    }

    return society;
  }

  async updateSociety(societyId, updateData, userRole, userSocietyId) {
    let society = await Society.findById(societyId);

    if (!society) {
      const error = new Error('Society not found');
      error.statusCode = 404;
      throw error;
    }

    // Tenant check
    if (userRole !== 'Super Admin' && userSocietyId.toString() !== societyId.toString()) {
      const error = new Error('Not authorized to update this society');
      error.statusCode = 403;
      throw error;
    }

    society = await Society.findByIdAndUpdate(societyId, updateData, {
      new: true,
      runValidators: true
    });

    return society;
  }
}

module.exports = new SocietyService();
