const Product = require('../models/Product');

async function listProducts(req, res, next) {
  try {
    const { shopId, q, category } = req.query;
    const filter = { isAvailable: true };
    if (shopId) filter.shopId = shopId;
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    const products = await Product.find(filter).limit(100);
    res.json(products);
  } catch (err) { next(err); }
}

async function getProduct(req, res, next) {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) { next(err); }
}

async function updateStock(req, res, next) {
  try {
    const { productId, delta } = req.body;
    const p = await Product.findById(productId);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    p.stock = Math.max(0, p.stock + Number(delta));
    p.isAvailable = p.stock > 0;
    await p.save();
    res.json(p);
  } catch (err) { next(err); }
}

module.exports = { listProducts, getProduct, updateStock };
