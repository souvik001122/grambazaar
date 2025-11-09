const Shop = require('../models/Shop');
const Product = require('../models/Product');
const User = require('../models/User');

async function seedDev(req, res, next) {
  try {
    // Clear existing data and seed fresh
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create demo users
    await User.create({
      name: 'Admin User',
      email: 'admin@grambazaar.com',
      password: 'admin123', // Will be hashed automatically
      phone: '9876543210',
      role: 'admin'
    });

    await User.create({
      name: 'Regular User',
      email: 'user@grambazaar.com',
      password: 'user123', // Will be hashed automatically
      phone: '9876543211',
      role: 'user'
    });

    const shops = [];
    const products = [];

    // Shop 1: Kirana Store
    const shop1 = await Shop.create({ 
      name: 'Saha Kirana Store', 
      category: 'Kirana', 
      description: 'Your trusted neighborhood grocery store with fresh daily essentials', 
      address: { fullAddress: 'Main Bazaar, Sonarpur, Kolkata', city: 'Kolkata', state: 'West Bengal', pin: '700150' }, 
      phone: '9876543210',
      email: 'saha.kirana@example.com',
      images: [], 
      rating: 4.5, 
      deliveryRadius: 15 
    });
    const p1_1 = await Product.create({ shopId: shop1._id, name: 'Atta (Wheat Flour) 5kg', category: 'Groceries', price: 250, stock: 50, images: [], regionalNames: { bengali: 'আটা ৫ কেজি' } });
    const p1_2 = await Product.create({ shopId: shop1._id, name: 'Sugar 1kg', category: 'Groceries', price: 60, stock: 80, images: [], regionalNames: { bengali: 'চিনি ১ কেজি' } });
    const p1_3 = await Product.create({ shopId: shop1._id, name: 'Rice (Basmati) 10kg', category: 'Groceries', price: 800, stock: 30, images: [], regionalNames: { bengali: 'বাসমতী চাল ১০ কেজি' } });
    const p1_4 = await Product.create({ shopId: shop1._id, name: 'Cooking Oil 1L', category: 'Groceries', price: 150, stock: 60, images: [], regionalNames: { bengali: 'রান্নার তেল ১ লিটার' } });
    const p1_5 = await Product.create({ shopId: shop1._id, name: 'Dal (Moong) 1kg', category: 'Groceries', price: 120, stock: 40, images: [], regionalNames: { bengali: 'মুগ ডাল ১ কেজি' } });
    shop1.products = [p1_1._id, p1_2._id, p1_3._id, p1_4._id, p1_5._id];
    await shop1.save();

    // Shop 2: Vegetable & Fruit Shop
    const shop2 = await Shop.create({ 
      name: 'Fresh Harvest Vegetables', 
      category: 'Vegetables', 
      description: 'Farm-fresh vegetables and fruits delivered daily', 
      address: { fullAddress: 'Market Road, Baruipur, Kolkata', city: 'Kolkata', state: 'West Bengal', pin: '700144' }, 
      phone: '9876543211',
      email: 'freshharvest@example.com',
      images: [], 
      rating: 4.7, 
      deliveryRadius: 12 
    });
    const p2_1 = await Product.create({ shopId: shop2._id, name: 'Tomato 1kg', category: 'Vegetables', price: 40, stock: 100, images: [], regionalNames: { bengali: 'টমেটো ১ কেজি' } });
    const p2_2 = await Product.create({ shopId: shop2._id, name: 'Potato 5kg', category: 'Vegetables', price: 150, stock: 80, images: [], regionalNames: { bengali: 'আলু ৫ কেজি' } });
    const p2_3 = await Product.create({ shopId: shop2._id, name: 'Onion 2kg', category: 'Vegetables', price: 80, stock: 70, images: [], regionalNames: { bengali: 'পেঁয়াজ ২ কেজি' } });
    const p2_4 = await Product.create({ shopId: shop2._id, name: 'Banana (Dozen)', category: 'Fruits', price: 60, stock: 50, images: [], regionalNames: { bengali: 'কলা (ডজন)' } });
    const p2_5 = await Product.create({ shopId: shop2._id, name: 'Apple 1kg', category: 'Fruits', price: 180, stock: 40, images: [], regionalNames: { bengali: 'আপেল ১ কেজি' } });
    const p2_6 = await Product.create({ shopId: shop2._id, name: 'Cauliflower 1pc', category: 'Vegetables', price: 35, stock: 60, images: [], regionalNames: { bengali: 'ফুলকপি ১টি' } });
    shop2.products = [p2_1._id, p2_2._id, p2_3._id, p2_4._id, p2_5._id, p2_6._id];
    await shop2.save();

    // Shop 3: Dairy Products
    const shop3 = await Shop.create({ 
      name: 'Milk & More Dairy', 
      category: 'Dairy', 
      description: 'Pure and fresh dairy products from local farms', 
      address: { fullAddress: 'Station Para, Diamond Harbour, Kolkata', city: 'Kolkata', state: 'West Bengal', pin: '743331' }, 
      phone: '9876543212',
      email: 'milkmore@example.com',
      images: [], 
      rating: 4.6, 
      deliveryRadius: 10 
    });
    const p3_1 = await Product.create({ shopId: shop3._id, name: 'Fresh Milk 1L', category: 'Dairy', price: 60, stock: 100, images: [], regionalNames: { bengali: 'তাজা দুধ ১ লিটার' } });
    const p3_2 = await Product.create({ shopId: shop3._id, name: 'Curd (Doi) 500g', category: 'Dairy', price: 40, stock: 50, images: [], regionalNames: { bengali: 'দই ৫০০ গ্রাম' } });
    const p3_3 = await Product.create({ shopId: shop3._id, name: 'Paneer 200g', category: 'Dairy', price: 80, stock: 30, images: [], regionalNames: { bengali: 'পনির ২০০ গ্রাম' } });
    const p3_4 = await Product.create({ shopId: shop3._id, name: 'Butter 100g', category: 'Dairy', price: 50, stock: 40, images: [], regionalNames: { bengali: 'মাখন ১০০ গ্রাম' } });
    const p3_5 = await Product.create({ shopId: shop3._id, name: 'Ghee 500ml', category: 'Dairy', price: 400, stock: 25, images: [], regionalNames: { bengali: 'ঘি ৫০০ মিলি' } });
    shop3.products = [p3_1._id, p3_2._id, p3_3._id, p3_4._id, p3_5._id];
    await shop3.save();

    // Shop 4: Bakery
    const shop4 = await Shop.create({ 
      name: 'Golden Crust Bakery', 
      category: 'Bakery', 
      description: 'Fresh breads, cakes and snacks baked daily', 
      address: { fullAddress: 'College Street, Barasat, Kolkata', city: 'Kolkata', state: 'West Bengal', pin: '700124' }, 
      phone: '9876543213',
      email: 'goldencrust@example.com',
      images: [], 
      rating: 4.4, 
      deliveryRadius: 8 
    });
    const p4_1 = await Product.create({ shopId: shop4._id, name: 'White Bread (Large)', category: 'Bakery', price: 45, stock: 50, images: [], regionalNames: { bengali: 'সাদা রুটি (বড়)' } });
    const p4_2 = await Product.create({ shopId: shop4._id, name: 'Brown Bread (Large)', category: 'Bakery', price: 55, stock: 40, images: [], regionalNames: { bengali: 'বাদামী রুটি (বড়)' } });
    const p4_3 = await Product.create({ shopId: shop4._id, name: 'Chocolate Cake 500g', category: 'Bakery', price: 300, stock: 20, images: [], regionalNames: { bengali: 'চকলেট কেক ৫০০ গ্রাম' } });
    const p4_4 = await Product.create({ shopId: shop4._id, name: 'Cookies (Mixed) 200g', category: 'Bakery', price: 80, stock: 60, images: [], regionalNames: { bengali: 'মিশ্র কুকিজ ২০০ গ্রাম' } });
    const p4_5 = await Product.create({ shopId: shop4._id, name: 'Puff Pastry (6pc)', category: 'Bakery', price: 120, stock: 35, images: [], regionalNames: { bengali: 'পাফ পেস্ট্রি (৬টি)' } });
    shop4.products = [p4_1._id, p4_2._id, p4_3._id, p4_4._id, p4_5._id];
    await shop4.save();

    // Shop 5: Fish & Meat
    const shop5 = await Shop.create({ 
      name: 'Ocean Fresh Fish Market', 
      category: 'Fish & Meat', 
      description: 'Fresh fish and quality meat daily', 
      address: { fullAddress: 'Fish Market, Budge Budge, Kolkata', city: 'Kolkata', state: 'West Bengal', pin: '700137' }, 
      phone: '9876543214',
      email: 'oceanfresh@example.com',
      images: [], 
      rating: 4.8, 
      deliveryRadius: 10 
    });
    const p5_1 = await Product.create({ shopId: shop5._id, name: 'Rohu Fish 1kg', category: 'Fish', price: 320, stock: 40, images: [], regionalNames: { bengali: 'রুই মাছ ১ কেজি' } });
    const p5_2 = await Product.create({ shopId: shop5._id, name: 'Hilsa Fish 1kg', category: 'Fish', price: 800, stock: 15, images: [], regionalNames: { bengali: 'ইলিশ মাছ ১ কেজি' } });
    const p5_3 = await Product.create({ shopId: shop5._id, name: 'Chicken (Whole) 1kg', category: 'Meat', price: 250, stock: 50, images: [], regionalNames: { bengali: 'মুরগি (সম্পূর্ণ) ১ কেজি' } });
    const p5_4 = await Product.create({ shopId: shop5._id, name: 'Mutton 1kg', category: 'Meat', price: 650, stock: 20, images: [], regionalNames: { bengali: 'মাংস ১ কেজি' } });
    const p5_5 = await Product.create({ shopId: shop5._id, name: 'Prawns (Large) 500g', category: 'Fish', price: 450, stock: 30, images: [], regionalNames: { bengali: 'বড় চিংড়ি ৫০০ গ্রাম' } });
    shop5.products = [p5_1._id, p5_2._id, p5_3._id, p5_4._id, p5_5._id];
    await shop5.save();

    // Shop 6: Sweets & Snacks
    const shop6 = await Shop.create({ 
      name: 'Bengal Sweets Corner', 
      category: 'Sweets', 
      description: 'Authentic Bengali sweets and savory snacks', 
      address: { fullAddress: 'Thakurpukur Road, Kolkata', city: 'Kolkata', state: 'West Bengal', pin: '700063' }, 
      phone: '9876543215',
      email: 'bengalsweets@example.com',
      images: [], 
      rating: 4.9, 
      deliveryRadius: 12 
    });
    const p6_1 = await Product.create({ shopId: shop6._id, name: 'Rasgulla (12pc)', category: 'Sweets', price: 150, stock: 50, images: [], regionalNames: { bengali: 'রসগোল্লা (১২টি)' } });
    const p6_2 = await Product.create({ shopId: shop6._id, name: 'Sandesh 500g', category: 'Sweets', price: 200, stock: 40, images: [], regionalNames: { bengali: 'সন্দেশ ৫০০ গ্রাম' } });
    const p6_3 = await Product.create({ shopId: shop6._id, name: 'Mishti Doi 250g', category: 'Sweets', price: 60, stock: 60, images: [], regionalNames: { bengali: 'মিষ্টি দই ২৫০ গ্রাম' } });
    const p6_4 = await Product.create({ shopId: shop6._id, name: 'Singara (6pc)', category: 'Snacks', price: 40, stock: 80, images: [], regionalNames: { bengali: 'সিঙ্গাড়া (৬টি)' } });
    const p6_5 = await Product.create({ shopId: shop6._id, name: 'Jilipi 250g', category: 'Sweets', price: 80, stock: 45, images: [], regionalNames: { bengali: 'জিলিপি ২৫০ গ্রাম' } });
    const p6_6 = await Product.create({ shopId: shop6._id, name: 'Luchi (10pc)', category: 'Snacks', price: 50, stock: 70, images: [], regionalNames: { bengali: 'লুচি (১০টি)' } });
    shop6.products = [p6_1._id, p6_2._id, p6_3._id, p6_4._id, p6_5._id, p6_6._id];
    await shop6.save();

    // Shop 7: Medicine & Healthcare
    const shop7 = await Shop.create({ 
      name: 'HealthPlus Pharmacy', 
      category: 'Medicine', 
      description: 'Trusted pharmacy with medicines and health products', 
      address: { fullAddress: 'New Market Area, Garia, Kolkata', city: 'Kolkata', state: 'West Bengal', pin: '700084' }, 
      phone: '9876543216',
      email: 'healthplus@example.com',
      images: [], 
      rating: 4.5, 
      deliveryRadius: 15 
    });
    const p7_1 = await Product.create({ shopId: shop7._id, name: 'Paracetamol 500mg (10 Tablets)', category: 'Medicine', price: 20, stock: 200, images: [], regionalNames: { bengali: 'প্যারাসিটামল ৫০০ মিগ্রা (১০ ট্যাবলেট)' } });
    const p7_2 = await Product.create({ shopId: shop7._id, name: 'Hand Sanitizer 200ml', category: 'Healthcare', price: 80, stock: 100, images: [], regionalNames: { bengali: 'হ্যান্ড স্যানিটাইজার ২০০ মিলি' } });
    const p7_3 = await Product.create({ shopId: shop7._id, name: 'Face Mask (Pack of 10)', category: 'Healthcare', price: 50, stock: 150, images: [], regionalNames: { bengali: 'ফেস মাস্ক (১০টির প্যাক)' } });
    const p7_4 = await Product.create({ shopId: shop7._id, name: 'Vitamin C Tablets (30 Count)', category: 'Supplements', price: 120, stock: 80, images: [], regionalNames: { bengali: 'ভিটামিন সি ট্যাবলেট (৩০টি)' } });
    const p7_5 = await Product.create({ shopId: shop7._id, name: 'First Aid Kit', category: 'Healthcare', price: 350, stock: 40, images: [], regionalNames: { bengali: 'প্রাথমিক চিকিৎসা কিট' } });
    shop7.products = [p7_1._id, p7_2._id, p7_3._id, p7_4._id, p7_5._id];
    await shop7.save();

    // Shop 8: Electronics & Mobile
    const shop8 = await Shop.create({ 
      name: 'TechWorld Electronics', 
      category: 'Electronics', 
      description: 'Mobile phones, accessories and electronics', 
      address: { fullAddress: 'Electronics Hub, Behala, Kolkata', city: 'Kolkata', state: 'West Bengal', pin: '700034' }, 
      phone: '9876543217',
      email: 'techworld@example.com',
      images: [], 
      rating: 4.3, 
      deliveryRadius: 20 
    });
    const p8_1 = await Product.create({ shopId: shop8._id, name: 'Mobile Charger (Type-C)', category: 'Accessories', price: 250, stock: 100, images: [], regionalNames: { bengali: 'মোবাইল চার্জার (টাইপ-সি)' } });
    const p8_2 = await Product.create({ shopId: shop8._id, name: 'Earphones (Wired)', category: 'Accessories', price: 200, stock: 80, images: [], regionalNames: { bengali: 'ইয়ারফোন (তারযুক্ত)' } });
    const p8_3 = await Product.create({ shopId: shop8._id, name: 'Power Bank 10000mAh', category: 'Accessories', price: 800, stock: 50, images: [], regionalNames: { bengali: 'পাওয়ার ব্যাংক ১০০০০ এমএএইচ' } });
    const p8_4 = await Product.create({ shopId: shop8._id, name: 'Phone Cover (Universal)', category: 'Accessories', price: 150, stock: 120, images: [], regionalNames: { bengali: 'ফোন কভার (ইউনিভার্সাল)' } });
    const p8_5 = await Product.create({ shopId: shop8._id, name: 'Bluetooth Speaker', category: 'Electronics', price: 1200, stock: 30, images: [], regionalNames: { bengali: 'ব্লুটুথ স্পিকার' } });
    shop8.products = [p8_1._id, p8_2._id, p8_3._id, p8_4._id, p8_5._id];
    await shop8.save();

    const shopCount = await Shop.countDocuments();
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();

    return res.json({ 
      seeded: true, 
      shops: shopCount,
      products: productCount,
      users: userCount,
      message: '✅ Database seeded successfully!',
      demoAccounts: [
        { email: 'admin@grambazaar.com', password: 'admin123', role: 'admin' },
        { email: 'user@grambazaar.com', password: 'user123', role: 'user' }
      ]
    });
  } catch (err) { next(err); }
}

module.exports = { seedDev };
