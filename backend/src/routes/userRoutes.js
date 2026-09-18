const express = require('express');
const { getUsers, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('Society Admin')); // Only society admins manage users via this route

router.route('/')
  .get(getUsers);

router.route('/:id')
  .put(updateUser);

module.exports = router;
