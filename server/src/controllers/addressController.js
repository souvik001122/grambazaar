const Address = require('../models/Address');

async function getAddresses(req, res, next) {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const addresses = await Address.find({ userEmail: email }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (err) { next(err); }
}

async function createAddress(req, res, next) {
  try {
    const { userEmail, fullAddress, phone, label, isDefault } = req.body;
    
    if (!userEmail || !fullAddress || !phone) {
      return res.status(400).json({ error: 'Email, address, and phone are required' });
    }

    const address = new Address({ userEmail, fullAddress, phone, label, isDefault });
    await address.save();
    
    res.status(201).json(address);
  } catch (err) { next(err); }
}

async function updateAddress(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const address = await Address.findByIdAndUpdate(id, updates, { new: true });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    
    res.json(address);
  } catch (err) { next(err); }
}

async function deleteAddress(req, res, next) {
  try {
    const { id } = req.params;
    const address = await Address.findByIdAndDelete(id);
    if (!address) return res.status(404).json({ error: 'Address not found' });
    
    res.json({ message: 'Address deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress };
