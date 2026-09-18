const express = require('express');
const { createVisitor, getVisitors, updateVisitorStatus } = require('../controllers/visitorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('Resident', 'Society Admin'), createVisitor)
  .get(authorize('Security Guard', 'Society Admin'), getVisitors);

router.route('/:id/status')
  .put(authorize('Security Guard'), updateVisitorStatus);

module.exports = router;
