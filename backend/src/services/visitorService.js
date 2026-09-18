const Visitor = require('../models/Visitor');

class VisitorService {
  async createVisitor(visitorData) {
    return await Visitor.create(visitorData);
  }

  async getVisitorsBySocietyId(societyId) {
    return await Visitor.find({ societyId }).populate('hostId', 'name unitNumber');
  }

  async updateVisitorStatus(visitorId, status, societyId, guardId) {
    let visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      const error = new Error('Visitor not found');
      error.statusCode = 404;
      throw error;
    }

    if (visitor.societyId.toString() !== societyId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    const updates = { status, guardId };
    
    if (status === 'CheckedIn') updates.entryTime = Date.now();
    if (status === 'CheckedOut') updates.exitTime = Date.now();

    visitor = await Visitor.findByIdAndUpdate(visitorId, updates, {
      new: true,
      runValidators: true
    });

    return visitor;
  }
}

module.exports = new VisitorService();
