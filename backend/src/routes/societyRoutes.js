const express = require('express');
const {
  createSociety,
  getSocieties,
  getSociety,
  updateSociety
} = require('../controllers/societyController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('Super Admin'), getSocieties)
  .post(authorize('Super Admin'), createSociety);

router
  .route('/:id')
  .get(getSociety)
  .put(authorize('Super Admin', 'Society Admin'), updateSociety);

module.exports = router;
