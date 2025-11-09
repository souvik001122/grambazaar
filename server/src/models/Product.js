const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  images: [String],
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  regionalNames: { bengali: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
