const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }
});

const AddressSchema = new mongoose.Schema({
  fullAddress: String,
  phone: String,
  instructions: String,
  email: String
});

const OrderSchema = new mongoose.Schema({
  customerId: { type: String, default: null },
  customerEmail: { type: String, required: true },
  customerName: { type: String, default: '' },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [ItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  deliveryOption: { type: String, enum: ['home_delivery', 'pickup'], default: 'home_delivery' },
  address: AddressSchema,
  paymentMethod: { type: String, enum: ['cod', 'upi', 'card'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
