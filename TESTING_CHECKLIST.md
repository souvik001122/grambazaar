# GramBazaar Testing Checklist

## Pre-Testing Setup
✅ **Both servers must be running:**
- Terminal 1: `cd server && npm run dev` (runs on port 5000)
- Terminal 2: `cd client && npm run dev` (runs on port 5173)

✅ **Seed the database:**
- Open in browser or Postman: `http://localhost:5000/dev/seed` (POST request)
- OR use PowerShell: `Invoke-RestMethod -Uri 'http://localhost:5000/dev/seed' -Method POST`
- Should return: `{"seeded": true}` or `{"seeded": false}` if already seeded

---

## Test Cases

### 1. Homepage Load ✓
**Steps:**
1. Open browser to `http://localhost:5173`
2. Verify you see:
   - Header with "GramBazaar" logo, navigation links (Home, Profile, Cart)
   - Hero section: "Your Local Shops, Now Online" with Bengali subtitle
   - Search bar with category dropdown
   - "Featured Shops" section showing "Kolkata Kirana (Dev)" shop card
   - "How It Works" section with Find, Order, Receive steps
   - Footer with copyright

**Expected Result:** All sections render correctly, no console errors

---

### 2. Shop Navigation ✓
**Steps:**
1. Click on the "Kolkata Kirana (Dev)" shop card from homepage
2. Verify URL changes to `/shop/[some-id]`
3. Verify you see:
   - Shop name "Kolkata Kirana (Dev)"
   - Product grid showing 2 products:
     - "Atta 5kg (Dev)" - ₹200 - 20 in stock
     - "Sugar 1kg (Dev)" - ₹60 - 30 in stock
   - Each product shows Bengali name (আটা, চিনি)
   - "Add to cart" button on each product

**Expected Result:** Shop page loads with products, no errors

---

### 3. Add to Cart ✓
**Steps:**
1. On shop page, click "Add to cart" for "Atta 5kg (Dev)"
2. Verify alert appears: "Added Atta 5kg (Dev) to cart!"
3. Check header cart link shows "(1)" badge
4. Click "Add to cart" for "Sugar 1kg (Dev)"
5. Verify alert appears and header shows "(2)"

**Expected Result:** 
- Alert confirms item added
- Cart badge updates to show total quantity
- No console errors

---

### 4. View Cart ✓
**Steps:**
1. Click "Cart" link in header
2. Verify URL changes to `/cart`
3. Verify you see:
   - "Your Cart" heading
   - 2 cart items listed:
     - Atta 5kg (Dev) - ₹200 x 1 = ₹200
     - Sugar 1kg (Dev) - ₹60 x 1 = ₹60
   - Each item has quantity controls and remove button
   - Cart summary showing "Subtotal: ₹260"
   - "Proceed to Checkout" button

**Expected Result:** Cart shows correct items with prices and totals

---

### 5. Update Cart Quantity ✓
**Steps:**
1. In cart, change quantity of "Atta 5kg" from 1 to 3 using quantity controls
2. Verify subtotal updates to ₹200×3 + ₹60 = ₹660
3. Verify header cart badge updates to "(4)" (3 + 1)

**Expected Result:** Quantities update correctly, totals recalculate

---

### 6. Remove from Cart ✓
**Steps:**
1. Click remove button on "Sugar 1kg (Dev)"
2. Verify item disappears from cart
3. Verify subtotal updates to ₹600 (3 × ₹200)
4. Verify header cart badge shows "(3)"

**Expected Result:** Item removed, totals update correctly

---

### 7. Checkout - Validation ✓
**Steps:**
1. Click "Proceed to Checkout"
2. Verify URL changes to `/checkout`
3. Try clicking "Place Order" without filling any fields
4. Verify alert shows: "Please fill in your address and phone number"
5. Fill only phone number, leave address empty
6. Try "Place Order" again
7. Verify validation fails again

**Expected Result:** Form validation prevents submission without required fields

---

### 8. Checkout - Success ✓
**Steps:**
1. Fill in form:
   - Full Address: "123 Main St, Kolkata, West Bengal 700001"
   - Phone: "9876543210"
   - Delivery Option: Select "Standard" or "Express"
   - Payment Method: Select "Cash on Delivery"
2. Click "Place Order"
3. Verify:
   - Alert/success message appears OR
   - Redirect to order tracking page `/order/[order-id]`

**Expected Result:** Order created successfully, redirects to order tracking

---

### 9. Order Tracking ✓
**Steps:**
1. After checkout, verify you're on `/order/[some-id]`
2. Verify page shows:
   - Order ID
   - Order status (likely "Pending" or "Confirmed")
   - Delivery address
   - Order items list
   - Total amount
   - Estimated delivery info

**Expected Result:** Order tracking page displays order details

---

### 10. Bengali Language Toggle ✓
**Steps:**
1. Go back to homepage
2. Click "BN" button in header
3. Verify Bengali text appears where regionalNames exist
4. Click "EN" to switch back

**Expected Result:** Language toggle works (limited to product names in current implementation)

---

### 11. Empty Cart State ✓
**Steps:**
1. Go to cart page
2. Remove all items
3. Verify you see:
   - "Your cart is empty" message
   - "Continue shopping" link

**Expected Result:** Empty state displays correctly

---

## Common Issues & Fixes

### Issue: API calls fail with 404
**Fix:** Ensure server is running on port 5000. Check `http://localhost:5000/api/shops` returns JSON.

### Issue: Shop page shows no products
**Fix:** Run the seed endpoint. Products should be populated in shop response.

### Issue: "Shop not found" on shop page
**Fix:** Check that you clicked a valid shop card from homepage. Verify shop ID in URL matches seeded data.

### Issue: Checkout doesn't redirect
**Fix:** Open browser DevTools (F12) → Console tab. Look for error messages. Check Network tab for failed POST to `/api/orders`.

### Issue: Cart doesn't persist after refresh
**Fix:** This is expected! Cart uses localStorage. Check browser DevTools → Application tab → Local Storage → http://localhost:5173 → look for "grambazaar-cart" key.

---

## Browser DevTools Tips

### Check Console Errors
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for red error messages
4. Common errors:
   - CORS errors → server CORS middleware issue
   - 404 errors → route not found
   - Network errors → server not running
   - React errors → component issues

### Check Network Requests
1. F12 → Network tab
2. Reload page or perform action
3. Look for failed requests (red status codes)
4. Click on request to see:
   - Request URL
   - Response data
   - Status code
   - Headers

### Check React State
1. Install React Developer Tools extension
2. F12 → Components tab
3. Select component (e.g., CartProvider)
4. Inspect state on right panel

---

## API Endpoints Reference

### GET /api/shops
Returns array of all shops with populated products.

### GET /api/shops/:id
Returns single shop with populated products array.

### GET /api/products
Returns array of all products.

### POST /api/orders
Creates new order. Requires:
```json
{
  "userId": "guest",
  "shopId": "shop-id-here",
  "items": [{"productId": "product-id", "quantity": 1}],
  "deliveryAddress": {...},
  "deliveryOption": "standard",
  "paymentMethod": "cod"
}
```

### GET /api/orders/:id
Returns single order with populated items.

### POST /dev/seed
Seeds database with sample shop and products (dev only).

---

## Success Criteria
- ✅ All pages load without console errors
- ✅ Shop navigation works
- ✅ Add to cart updates cart state and badge
- ✅ Cart page shows correct items and totals
- ✅ Checkout validation prevents invalid submissions
- ✅ Checkout success creates order and redirects
- ✅ Order tracking shows order details
- ✅ Bengali toggle changes visible text
- ✅ Cart persists across page refreshes (localStorage)

---

## Next Steps After Testing

Once basic flow works:
1. ✅ Implement order status auto-progression (Pending → Confirmed → Preparing → Ready → Delivered)
2. ✅ Add Google Maps integration for real distance calculation
3. ✅ Create admin dashboard for shop owners
4. ✅ Add multi-shop cart handling (currently assumes single shop per cart)
5. ✅ Implement real-time inventory updates with WebSocket
6. ✅ Add product images (currently uses placeholder URLs)
7. ✅ Add shop images and banners
8. ✅ Implement user authentication (currently guest-only)
9. ✅ Add payment gateway integration (Razorpay/Stripe)
10. ✅ Deploy to production

---

**Happy Testing! 🎉**
