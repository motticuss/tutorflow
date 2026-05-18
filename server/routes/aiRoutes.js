const express = require('express');
const router = express.Router();
const { generateSummary } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-summary', protect, generateSummary);

module.exports = router;
