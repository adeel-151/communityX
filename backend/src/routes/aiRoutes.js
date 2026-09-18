const express = require('express');
const { askAssistant } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/ask', askAssistant);

module.exports = router;
