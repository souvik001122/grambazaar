# GramBazaar Server

Requirements: Node.js 18+, MongoDB

Setup (Windows cmd.exe):

1. cd server
2. npm install
3. copy .env.example .env  (fill MONGODB_URI if needed)
4. npm run dev

Seed DB for testing:
node src/seed.js

Notes:
- If you don't have MongoDB installed, the server will automatically start an in-memory MongoDB using `mongodb-memory-server` for development when `MONGODB_URI` is not set.

Sample API calls:
GET /api/shops
POST /api/orders (JSON body: { shopId, items: [{productId,quantity}], deliveryOption, address, paymentMethod })

