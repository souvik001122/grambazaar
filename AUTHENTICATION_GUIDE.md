# 🔐 GramBazaar Authentication & Admin Guide

## Authentication System

### Features
- ✅ **Login/Logout** functionality
- ✅ **Guest checkout** (no login required)
- ✅ **Role-based access** (Admin, User, Guest)
- ✅ **Session persistence** (localStorage)
- ✅ **Protected routes** (Admin dashboard)

---

## How to Use

### 1. **Login as Admin**
**Credentials:**
- Email: `admin@grambazaar.com`
- Password: `admin123`

**Access:**
- Full admin dashboard
- Data visualization
- Database viewer
- Analytics

### 2. **Login as Regular User**
**Credentials:**
- Email: `user@grambazaar.com`
- Password: `user123`

**Access:**
- Browse shops
- Add to cart
- Checkout
- Track orders

### 3. **Continue as Guest**
- Click "Continue as Guest"
- Shop without login
- Cart works normally
- Checkout available

---

## Admin Dashboard Features

### 📊 Overview Tab
**Statistics Cards:**
- Total Shops (with active count)
- Total Products (with available count)
- Total Orders
- Revenue Tracking

**Recent Activity:**
- System status
- Product availability
- Shop activity

**Quick Stats:**
- Average Shop Rating
- Average Product Price
- Total Stock Items

### 🏪 Shops Tab
**Data Table showing:**
- Shop Name & ID
- Category
- Location (City)
- Number of Products
- Rating
- Status (Active/Inactive)

**Actions:**
- View all shops
- Refresh data
- Filter and sort

### 📦 Products Tab
**Data Table showing:**
- Product Name & ID
- Bengali Name (আটা, চিনি, etc.)
- Price
- Stock Levels
- Availability Status
- Shop Reference

**Actions:**
- View all products
- Refresh catalog
- Monitor inventory

### 📈 Analytics Tab
**Visual Charts:**

1. **Products by Category**
   - Bar chart showing distribution
   - Percentage breakdown
   - Category counts

2. **Price Distribution**
   - Price range analysis
   - ₹0-50, ₹50-100, ₹100-200, ₹200+
   - Visual comparison

3. **Stock Levels**
   - Color-coded stock bars
   - Red: Low stock (< 10 units)
   - Orange: Medium stock (10-19 units)
   - Green: High stock (20+ units)
   - Real-time inventory view

### 🗄️ Database Tab
**Two View Modes:**

**Table View:**
- Database information summary
- Connection status
- Collection details (Shops, Products, Orders)
- Document counts

**JSON View:**
- Complete raw database dump
- Formatted JSON with indentation
- All collections data
- Statistics included
- Copy-paste ready

---

## Navigation Flow

### For Regular Users:
```
Home → Shop → Product → Cart → Checkout → Order Tracking
       ↓
    Login (optional)
```

### For Admin Users:
```
Login → Admin Dashboard
         ├─ Overview
         ├─ Shops Management
         ├─ Products Catalog
         ├─ Analytics & Charts
         └─ Database Viewer
```

---

## UI Features

### Header Updates
**When Logged Out:**
- Shows "Login" button
- Guest shopping enabled

**When Logged In (User):**
- Shows user name
- Logout button
- Cart with badge
- Profile access

**When Logged In (Admin):**
- All user features +
- "Admin" button (gear icon)
- Quick access to dashboard

### Visual Indicators
- 🔵 Primary actions (Blue)
- 🟢 Success states (Green)
- 🟠 Warnings (Orange)
- 🔴 Danger/Logout (Red)

---

## Technical Details

### Authentication State
**Stored in:**
- `localStorage` → key: `gb_user`
- `AuthContext` → React Context API

**User Object:**
```javascript
{
  id: string,
  name: string,
  email: string,
  role: 'admin' | 'user' | 'guest'
}
```

### Protected Routes
- `/admin` → Requires admin role
- Redirects to `/login` if unauthorized
- Automatic role checking

### Session Management
- Persists across page refreshes
- Logout clears localStorage
- Automatic login restoration on app load

---

## Data Visualization

### Chart Types
1. **Horizontal Bar Charts**
   - Category distribution
   - Price ranges
   - Animated fills
   - Percentage-based widths

2. **Stock Level Bars**
   - Color-coded by quantity
   - Real-time updates
   - Visual inventory alerts

3. **Stat Cards**
   - Large number displays
   - Icon indicators
   - Color-coded borders
   - Hover effects

### Real-time Updates
- Auto-refresh capability
- Manual refresh buttons
- Live data synchronization
- Instant stats recalculation

---

## Styling & Design

### Color Scheme
```css
Primary (Admin): #2b6cb0 (Blue)
Success: #38a169 (Green)
Warning: #dd6b20 (Orange)
Danger: #e53e3e (Red)
```

### Responsive Design
**Desktop (> 768px):**
- Multi-column grids
- Side-by-side charts
- Full data tables

**Mobile (< 768px):**
- Single column layout
- Stacked stats
- Scrollable tables
- Touch-friendly buttons

### Animations
- Slide-up login form
- Pulse cart badge
- Hover lift effects
- Bar chart transitions
- Stat card scaling

---

## API Endpoints Used

### Admin Dashboard Calls:
```javascript
GET /api/shops        // Fetch all shops
GET /api/products     // Fetch all products
GET /api/orders       // Fetch all orders (future)
```

### Authentication (Frontend Only):
- No backend auth yet
- Demo credentials hardcoded
- Ready for backend integration

---

## Future Enhancements

### Phase 1 (Backend Auth):
- [ ] JWT token authentication
- [ ] Password hashing (bcrypt)
- [ ] User registration API
- [ ] Session expiry

### Phase 2 (Admin Features):
- [ ] Add/Edit/Delete shops
- [ ] Add/Edit/Delete products
- [ ] Order management
- [ ] User management

### Phase 3 (Advanced Analytics):
- [ ] Sales trends over time
- [ ] Revenue charts
- [ ] Customer analytics
- [ ] Inventory forecasting

### Phase 4 (Notifications):
- [ ] Low stock alerts
- [ ] New order notifications
- [ ] Email notifications
- [ ] SMS integration

---

## Testing Checklist

### ✅ Login Flow:
1. Go to `/login`
2. Enter admin credentials
3. Click "Sign In"
4. Redirects to `/admin`
5. See admin dashboard

### ✅ Guest Flow:
1. Homepage (no login)
2. Add items to cart
3. Checkout as guest
4. Order created

### ✅ Admin Dashboard:
1. Login as admin
2. View all 5 tabs
3. Check stats accuracy
4. Test refresh buttons
5. View charts
6. Toggle JSON view

### ✅ Logout:
1. Click logout button
2. Redirects to login
3. Session cleared
4. Cart persists

---

## Screenshots Reference

### Login Page:
- Clean, centered card
- Email/Password fields with icons
- "Continue as Guest" option
- Demo credentials shown

### Admin Dashboard:
- 4 stat cards at top
- Tab navigation
- Data tables with sorting
- Visual charts
- Database JSON view

### Header (Admin):
- User name displayed
- Admin button (gear icon)
- Logout button (red)
- Cart badge

---

## Troubleshooting

### Issue: Can't access admin dashboard
**Solution:** Make sure you're logged in with admin credentials

### Issue: Stats showing 0
**Solution:** Run `POST /dev/seed` to populate database

### Issue: Charts not displaying
**Solution:** Refresh the page, check browser console

### Issue: Logout not working
**Solution:** Clear localStorage manually if needed

---

## Security Notes

⚠️ **Current Implementation:**
- Demo credentials (not production-ready)
- Frontend-only authentication
- No password encryption
- No session timeout

✅ **For Production:**
- Implement JWT backend
- Use bcrypt for passwords
- Add HTTPS
- Session expiry
- Rate limiting
- CSRF protection

---

**Access the Admin Dashboard:** http://localhost:5173/admin

**Login Page:** http://localhost:5173/login

**Made with ❤️ for GramBazaar**
