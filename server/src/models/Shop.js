const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  pincode: String,
  location: { lat: Number, lng: Number }
});


const ShopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  ownerName: String,
  phone: String,
  email: String,
  address: AddressSchema,
  images: [String],
  rating: { type: Number, default: 4.0 },
  deliveryRadius: { type: Number, default: 5 },
  businessHours: { open: String, close: String },
  isActive: { type: Boolean, default: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Shop', ShopSchema);
