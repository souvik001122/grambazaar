const express = require('express');
const router = express.Router();
const { listShops, getShop } = require('../controllers/shopsController');

router.get('/', listShops);
router.get('/:id', getShop);

module.exports = router;
