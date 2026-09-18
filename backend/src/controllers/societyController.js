const societyService = require('../services/societyService');

// @desc    Create new society
// @route   POST /api/v1/societies
// @access  Private/Super Admin
exports.createSociety = async (req, res, next) => {
  try {
    const society = await societyService.createSociety(req.body);
    res.status(201).json({ success: true, data: society });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all societies
// @route   GET /api/v1/societies
// @access  Private/Super Admin
exports.getSocieties = async (req, res, next) => {
  try {
    const societies = await societyService.getSocieties();
    res.status(200).json({ success: true, count: societies.length, data: societies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single society
// @route   GET /api/v1/societies/:id
// @access  Private (Super Admin or Society Admin/Resident of that society)
exports.getSociety = async (req, res, next) => {
  try {
    const society = await societyService.getSocietyById(
      req.params.id, 
      req.user.role, 
      req.user.societyId
    );
    res.status(200).json({ success: true, data: society });
  } catch (error) {
    next(error);
  }
};

// @desc    Update society
// @route   PUT /api/v1/societies/:id
// @access  Private (Super Admin or Society Admin of that society)
exports.updateSociety = async (req, res, next) => {
  try {
    const society = await societyService.updateSociety(
      req.params.id, 
      req.body, 
      req.user.role, 
      req.user.societyId
    );
    res.status(200).json({ success: true, data: society });
  } catch (error) {
    next(error);
  }
};
