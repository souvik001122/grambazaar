const express = require('express');
const router = express.Router();
const { seedDev } = require('../controllers/devController');

// Seed endpoint enabled - will be restricted after initial production seed
router.post('/seed', seedDev);

module.exports = router;
