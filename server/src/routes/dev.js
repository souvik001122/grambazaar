const express = require('express');
const router = express.Router();
const { seedDev } = require('../controllers/devController');

// Only allow dev seeding when not in production
router.post('/seed', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Forbidden in production' });
  return seedDev(req, res, next);
});

module.exports = router;
