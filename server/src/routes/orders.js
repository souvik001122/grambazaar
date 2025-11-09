const express = require('express');
const router = express.Router();
const { createOrder, getOrder, updateOrderStatus, getOrdersByEmail } = require('../controllers/ordersController');

router.post('/', createOrder);
router.get('/user/:email', getOrdersByEmail);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
