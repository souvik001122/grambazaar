const express = require('express');
const router = express.Router();
const { seedDev } = require('../controllers/devController');

// Allow seeding in all environments (temporary - remove after first use in production)
router.post('/seed', seedDev);

module.exports = router;
