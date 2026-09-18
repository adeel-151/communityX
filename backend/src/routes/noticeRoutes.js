const express = require('express');
const { createNotice, getNotices, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('Society Admin'), createNotice)
  .get(getNotices); // Open to all authenticated users in the society

router.route('/:id')
  .delete(authorize('Society Admin'), deleteNotice);

module.exports = router;
