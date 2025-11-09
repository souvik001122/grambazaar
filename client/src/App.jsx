import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ShopPage from './pages/ShopPage'
import CartPage from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import Profile from './pages/Profile'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import UsersAdmin from './pages/UsersAdmin'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { CartProvider } from './context/CartContext'
import { ShopProvider } from './context/ShopContext'
import { AuthProvider } from './context/AuthContext'
import Loader from './components/ui/Loader'
import ErrorBoundary from './components/ui/ErrorBoundary'

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <CartProvider>
          <Layout>
            <ErrorBoundary>
              <Suspense fallback={<Loader />}>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop/:id" element={<ShopPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/:id" element={<OrderTracking />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersAdmin />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          </Layout>
        </CartProvider>
      </ShopProvider>
    </AuthProvider>
  )
}
