const express = require('express');
const { createBill, getBills, updateBill } = require('../controllers/billController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('Society Admin', 'Accountant'), createBill)
  .get(authorize('Society Admin', 'Accountant', 'Resident'), getBills);

router.route('/:id')
  .put(authorize('Society Admin', 'Accountant', 'Resident'), upload.single('paymentReceipt'), updateBill);

module.exports = router;
