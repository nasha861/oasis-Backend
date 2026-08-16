const express = require('express');
const { getEnergyUsage } = require('../controllers/energyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/usage', protect, getEnergyUsage);

module.exports = router;
