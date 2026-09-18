const express = require('express');
const { createComplaint, getComplaints, updateComplaint } = require('../controllers/complaintController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('Resident'), upload.single('attachment'), createComplaint)
  .get(authorize('Society Admin', 'Maintenance', 'Resident'), getComplaints);

router.route('/:id')
  .put(authorize('Society Admin', 'Maintenance'), updateComplaint);

module.exports = router;
