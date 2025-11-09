const express = require('express');
const router = express.Router();
const { listProducts, getProduct, updateStock } = require('../controllers/productsController');

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/stock', updateStock);

module.exports = router;
