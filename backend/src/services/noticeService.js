const Notice = require('../models/Notice');

class NoticeService {
  async createNotice(noticeData) {
    return await Notice.create(noticeData);
  }

  async getNoticesBySocietyId(societyId) {
    // Only return notices for the user's society that haven't expired
    let query = { 
      societyId,
      $or: [
        { expiresAt: { $gte: Date.now() } },
        { expiresAt: null }
      ]
    };

    return await Notice.find(query).populate('authorId', 'name role').sort({ createdAt: -1 });
  }

  async deleteNotice(noticeId, societyId) {
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      const error = new Error('Notice not found');
      error.statusCode = 404;
      throw error;
    }

    if (notice.societyId.toString() !== societyId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    await notice.deleteOne();
  }
}

module.exports = new NoticeService();
