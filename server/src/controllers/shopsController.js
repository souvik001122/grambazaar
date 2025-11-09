const Shop = require('../models/Shop');
const Product = require('../models/Product');

async function listShops(req, res, next) {
  try {
    const { category, q } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const shops = await Shop.find(filter).populate('products').limit(50);
    res.json(shops);
  } catch (err) { next(err); }
}

async function getShop(req, res, next) {
  try {
    const shop = await Shop.findById(req.params.id).populate({ path: 'products', model: 'Product' });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    res.json(shop);
  } catch (err) { next(err); }
}

module.exports = { listShops, getShop };
