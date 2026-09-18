const billService = require('../services/billService');

// @desc    Create a bill
// @route   POST /api/v1/bills
// @access  Private (Society Admin, Accountant)
exports.createBill = async (req, res, next) => {
  try {
    req.body.societyId = req.user.societyId;
    
    const bill = await billService.createBill(req.body);
    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bills for a society
// @route   GET /api/v1/bills
// @access  Private (Society Admin, Accountant, Resident)
exports.getBills = async (req, res, next) => {
  try {
    const bills = await billService.getBillsBySocietyId(req.user.societyId, req.user.role, req.user.id);
    res.status(200).json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bill (e.g. mark paid, upload receipt)
// @route   PUT /api/v1/bills/:id
// @access  Private (Society Admin, Accountant, Resident)
exports.updateBill = async (req, res, next) => {
  try {
    const bill = await billService.updateBill(
      req.params.id,
      req.body,
      req.user.role,
      req.user.societyId,
      req.file
    );

    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    next(error);
  }
};
