const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  fullAddress: { type: String, required: true },
  phone: { type: String, required: true },
  label: { type: String, default: 'Home' }, // Home, Work, Other
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure only one default address per user
AddressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userEmail: this.userEmail, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('Address', AddressSchema);
