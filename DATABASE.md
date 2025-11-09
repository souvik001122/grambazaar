# GramBazaar Database Summary

## 📊 Current Database Status

**Database Type:** MongoDB (In-Memory via mongodb-memory-server)
**Last Updated:** November 9, 2025

---

## 🏪 SHOPS COLLECTION

### Total Shops: 1

#### Shop #1: Kolkata Kirana (Dev)
- **ID:** `69105db471383ca70d8828cd`
- **Category:** Kirana
- **Description:** Dev shop
- **Location:** Kolkata
- **Rating:** ⭐ 4.2
- **Delivery Radius:** 10 km
- **Status:** ✅ Active
- **Products Count:** 2
- **Created:** 2025-11-09T09:24:04.753Z

---

## 📦 PRODUCTS COLLECTION

### Total Products: 2

#### Product #1: Atta 5kg (Dev)
- **ID:** `69105db471383ca70d8828d0`
- **Shop ID:** `69105db471383ca70d8828cd`
- **Price:** ₹200
- **Stock:** 20 units
- **Bengali Name:** আটা (Atta)
- **Status:** ✅ Available
- **Images:** None
- **Created:** 2025-11-09T09:24:04.760Z

#### Product #2: Sugar 1kg (Dev)
- **ID:** `69105db471383ca70d8828d2`
- **Shop ID:** `69105db471383ca70d8828cd`
- **Price:** ₹60
- **Stock:** 30 units
- **Bengali Name:** চিনি (Chini/Sugar)
- **Status:** ✅ Available
- **Images:** None
- **Created:** 2025-11-09T09:24:04.762Z

---

## 📋 ORDERS COLLECTION

### Total Orders: 0

No orders have been placed yet. Orders will appear here after users complete checkout.

---

## 🔍 Database Structure

### Shop Schema:
```
{
  _id: ObjectId,
  name: String,
  category: String (Kirana, Vegetables, Dairy, etc.),
  description: String,
  address: {
    city: String,
    ...
  },
  images: [String],
  rating: Number,
  deliveryRadius: Number,
  isActive: Boolean,
  products: [ObjectId] (references Product collection),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema:
```
{
  _id: ObjectId,
  shopId: ObjectId (references Shop),
  name: String,
  price: Number,
  images: [String],
  stock: Number,
  isAvailable: Boolean,
  regionalNames: {
    bengali: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema:
```
{
  _id: ObjectId,
  userId: String,
  shopId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number
  }],
  deliveryAddress: Object,
  deliveryOption: String (home_delivery, pickup),
  paymentMethod: String (cod, upi, card),
  status: String (Pending, Confirmed, Preparing, Ready, Delivered),
  total: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Database Statistics

| Metric | Count |
|--------|-------|
| Total Shops | 1 |
| Active Shops | 1 |
| Total Products | 2 |
| Available Products | 2 |
| Total Orders | 0 |
| Total Revenue | ₹0 |

---

## 🔗 API Endpoints

### Shops
- `GET /api/shops` - Get all shops (with populated products)
- `GET /api/shops/:id` - Get single shop
- `POST /api/shops` - Create new shop

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status

### Dev Tools
- `POST /dev/seed` - Seed database with sample data (idempotent)

---

## 💡 How to View Database

### Method 1: Visual Database Viewer (Recommended)
Open the file: `database-viewer.html` in your browser
- Beautiful UI with tables and statistics
- Real-time data refresh
- Auto-updates every 30 seconds
- View shops, products, and raw JSON

### Method 2: API Calls (PowerShell)
```powershell
# View all shops
Invoke-RestMethod -Uri 'http://localhost:5000/api/shops' | ConvertTo-Json -Depth 10

# View all products
Invoke-RestMethod -Uri 'http://localhost:5000/api/products' | ConvertTo-Json -Depth 5

# View specific shop
Invoke-RestMethod -Uri 'http://localhost:5000/api/shops/69105db471383ca70d8828cd'
```

### Method 3: Browser DevTools
1. Open http://localhost:5173 (your app)
2. Press F12 to open DevTools
3. Go to Network tab
4. Click on any shop or product
5. View the API responses

---

## 🚀 Adding More Data

### Option 1: Via API (POST requests)
Use Postman, Thunder Client, or PowerShell to POST new shops/products

### Option 2: Update seed.js
Edit `server/src/seed.js` to add more sample data

### Option 3: Create via UI
Once admin panel is built, manage data through the interface

---

## 📝 Notes

- Database is **in-memory** (mongodb-memory-server)
- Data will be **lost on server restart**
- For production, connect to real MongoDB instance
- Current data is for development/testing only
- Images arrays are empty (using gradient placeholders in UI)

---

**Last Generated:** November 9, 2025
**Server:** http://localhost:5000
**Client:** http://localhost:5173
