import React, { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCartState } from '../context/CartContext'
import { FaUser, FaEnvelope, FaShieldAlt, FaShoppingBag, FaMapMarkerAlt, FaPhone, FaEdit, FaSave, FaTimes, FaClock, FaCheckCircle, FaTruck, FaBox, FaCalendarAlt } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()
  const { success, error: showError } = useToast()
  const { items } = useCartState()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user?.email) return;
    
    setLoadingOrders(true)
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.get(`${base}/api/orders/user/${encodeURIComponent(user.email)}`)
      setOrders(res.data)
    } catch (err) {
      console.error('Error fetching orders:', err)
    }
    setLoadingOrders(false)
  }

  const handleLogout = () => {
    logout()
    success('Logged out successfully! See you soon 👋')
    navigate('/')
  }

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    success('Profile updated successfully!')
    setEditing(false)
  }

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    })
    setEditing(false)
  }

  // Get real join date
  const getJoinDate = () => {
    if (user?.joinDate) {
      return new Date(user.joinDate).getFullYear()
    }
    return new Date().getFullYear()
  }

  // Get total items in cart
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: FaShoppingBag, color: '#3b82f6' },
    { label: 'Cart Items', value: cartItemCount, icon: FaBox, color: '#f59e0b' },
    { label: 'Saved Addresses', value: profileData.address ? 1 : 0, icon: FaMapMarkerAlt, color: '#10b981' },
    { label: 'Member Since', value: getJoinDate(), icon: FaCalendarAlt, color: '#8b5cf6' }
  ]

  return (
    <div className="page profile-page">
      <Header />
      <main>
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header-card">
            <div className="profile-avatar">
              <FaUser />
            </div>
            <div className="profile-header-info">
              <h1>{user?.name || 'Guest User'}</h1>
              <p className="profile-email">
                <FaEnvelope /> {user?.email || 'Not logged in'}
              </p>
              {user?.role === 'admin' && (
                <span className="admin-badge">
                  <FaShieldAlt /> Administrator
                </span>
              )}
              {!user && (
                <p className="guest-status">
                  <FaClock /> Browsing as Guest
                </p>
              )}
            </div>
            <div className="profile-actions">
              {user && !editing && (
                <button className="btn-edit" onClick={() => setEditing(true)}>
                  <FaEdit /> Edit Profile
                </button>
              )}
              {user && editing && (
                <>
                  <button className="btn-save" onClick={handleSave}>
                    <FaSave /> Save Changes
                  </button>
                  <button className="btn-cancel" onClick={handleCancel}>
                    <FaTimes /> Cancel
                  </button>
                </>
              )}
              {user && (
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              )}
              {!user && (
                <button className="btn-login" onClick={() => navigate('/login')}>
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
                <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                  <stat.icon />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Profile Details & Order History */}
          <div className="profile-content-grid">
            {/* Profile Details Card */}
            <div className="profile-card">
              <div className="card-header">
                <h2>Profile Details</h2>
              </div>
              <div className="card-body">
                {!user ? (
                  <div className="guest-notice">
                    <FaUser style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem' }} />
                    <p>You're browsing as a guest</p>
                    <p className="text-muted">Login to save your preferences, view order history, and enjoy personalized shopping experience</p>
                    <button 
                      className="btn-guest-login"
                      onClick={() => navigate('/login')}
                      style={{
                        marginTop: '1.5rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      Login Now
                    </button>
                  </div>
                ) : (
                  <div className="profile-form">
                    <div className="form-group">
                      <label>
                        <FaUser /> Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!editing}
                        className={editing ? 'editing' : ''}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <FaEnvelope /> Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!editing}
                        className={editing ? 'editing' : ''}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <FaPhone /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!editing}
                        placeholder="Enter your phone number"
                        className={editing ? 'editing' : ''}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <FaMapMarkerAlt /> Delivery Address
                      </label>
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        disabled={!editing}
                        placeholder="Enter your delivery address"
                        className={editing ? 'editing' : ''}
                        rows="3"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order History Card */}
            <div className="profile-card">
              <div className="card-header">
                <h2>Order History</h2>
              </div>
              <div className="card-body">
                {!user ? (
                  <div className="empty-state">
                    <FaShoppingBag style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem' }} />
                    <p>Login to view your orders</p>
                    <p className="text-muted">Track your past orders and reorder your favorites</p>
                  </div>
                ) : loadingOrders ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <FaShoppingBag style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem' }} />
                    <p>No orders yet</p>
                    <p className="text-muted">Start shopping to see your orders here</p>
                    <button 
                      className="btn-start-shopping"
                      onClick={() => navigate('/')}
                      style={{
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      Browse Shops
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order._id} className="order-item">
                        <div className="order-header">
                          <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                          <div className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                            {order.status === 'Delivered' && <FaCheckCircle />}
                            {order.status === 'Pending' && <FaClock />}
                            {(order.status === 'Confirmed' || order.status === 'Out for Delivery') && <FaTruck />}
                            {order.status}
                          </div>
                        </div>
                        <div className="order-details">
                          <div className="order-info">
                            <span className="order-date">
                              <FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className="order-items">
                              <FaBox /> {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                          <div className="order-amount">₹{order.finalAmount.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
