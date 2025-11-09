const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { calculateDelivery } = require('../utils/deliveryCalculator');
const { sendEmailSim, sendSmsSim } = require('../utils/notify');

async function createOrder(req, res, next) {
  try {
    const { shopId, items, deliveryOption, address, paymentMethod, customerEmail, customerName } = req.body;
    
    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });

    // fetch product prices and validate stock
    let total = 0;
    const itemDocs = [];
    for (const it of items) {
      const p = await Product.findById(it.productId);
      if (!p) return res.status(400).json({ error: 'Product not found: ' + it.productId });
      if (p.stock < it.quantity) return res.status(400).json({ error: `Insufficient stock for ${p.name}` });
      itemDocs.push({ productId: p._id, quantity: it.quantity, price: p.price });
      total += p.price * it.quantity;
    }

    // distance estimation: naive - use shop.address.location and provided address? fallback 3km
    const distanceKm = (shop.address && shop.address.location && address && address.location)
      ? getDistanceKm(shop.address.location, address.location) : 3;

    const deliveryCharge = deliveryOption === 'home_delivery' ? calculateDelivery(total, distanceKm) : 0;
    const finalAmount = total + deliveryCharge;

    const order = new Order({ 
      shopId, 
      items: itemDocs, 
      totalAmount: total, 
      deliveryCharge, 
      finalAmount, 
      deliveryOption, 
      address, 
      paymentMethod, 
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      customerEmail,
      customerName: customerName || ''
    });
    await order.save();

    // reduce stock
    for (const it of items) {
      await Product.findByIdAndUpdate(it.productId, { $inc: { stock: -it.quantity } });
    }

    // simulate notification
    sendSmsSim(address.phone || shop.phone || 'unknown', `Order ${order._id} created. Total: ₹${finalAmount}`);
    sendEmailSim(order.address && order.address.email ? order.address.email : shop.email || 'no-reply@example.com', 'Order Created', `Order ${order._id} created`);

    res.status(201).json(order);
  } catch (err) { next(err); }
}

function getDistanceKm(loc1, loc2) {
  // Haversine formula
  function toRad(v) { return v * Math.PI / 180; }
  const R = 6371; // km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(loc1.lat))*Math.cos(toRad(loc2.lat))*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    if (status === 'Delivered') order.paymentStatus = 'completed';
    await order.save();
    sendSmsSim(order.address.phone || 'unknown', `Order ${order._id} status: ${status}`);
    res.json(order);
  } catch (err) { next(err); }
}

async function getOrdersByEmail(req, res, next) {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const orders = await Order.find({ customerEmail: email })
      .populate('items.productId')
      .populate('shopId')
      .sort({ createdAt: -1 }); // Most recent first
    
    res.json(orders);
  } catch (err) { next(err); }
}

module.exports = { createOrder, getOrder, updateOrderStatus, getOrdersByEmail };
