const aiService = require('../services/aiService');

// @desc    Ask AI assistant a question
// @route   POST /api/v1/ai/ask
// @access  Private
exports.askAssistant = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const responseText = await aiService.askAssistant(prompt, {
      id: req.user.id,
      role: req.user.role,
      societyId: req.user.societyId
    });

    res.status(200).json({ success: true, data: responseText });
  } catch (error) {
    next(error);
  }
};
