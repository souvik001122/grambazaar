import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { FaCheckCircle, FaClock, FaBox, FaTruck, FaHome, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaReceipt, FaCreditCard, FaArrowLeft, FaStore } from 'react-icons/fa'

export default function OrderTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { 
    async function fetch() { 
      setLoading(true)
      setError(null)
      try {
        const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
        const res = await axios.get(base + '/api/orders/' + id)
        setOrder(res.data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError(err.response?.data?.error || 'Failed to load order')
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  const orderStatuses = [
    { key: 'Pending', label: 'Order Placed', icon: FaReceipt, description: 'Your order has been received' },
    { key: 'Confirmed', label: 'Confirmed', icon: FaCheckCircle, description: 'Shop confirmed your order' },
    { key: 'Preparing', label: 'Preparing', icon: FaBox, description: 'Your order is being prepared' },
    { key: 'Ready', label: 'Ready', icon: FaTruck, description: 'Out for delivery' },
    { key: 'Delivered', label: 'Delivered', icon: FaHome, description: 'Order delivered successfully' }
  ]

  const getStatusIndex = (status) => {
    return orderStatuses.findIndex(s => s.key === status)
  }

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1

  const getPaymentMethodLabel = (method) => {
    const methods = {
      'cod': 'Cash on Delivery',
      'upi': 'UPI Payment',
      'card': 'Card Payment'
    }
    return methods[method] || method
  }

  return (
    <div className="page order-tracking-page">
      <Header />
      <main>
        {loading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading order details...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Order Not Found</h2>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              <FaArrowLeft /> Back to Home
            </button>
          </div>
        ) : !order ? (
          <div className="error-container">
            <div className="error-icon">🔍</div>
            <h2>Order Not Found</h2>
            <p>The order you're looking for doesn't exist</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              <FaArrowLeft /> Back to Home
            </button>
          </div>
        ) : (
          <div className="order-tracking-container">
            {/* Header Section */}
            <div className="tracking-header">
              <button className="btn-back" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
              </button>
              <div className="order-header-info">
                <h1>Order Tracking</h1>
                <p className="order-id">Order ID: <span>#{order._id.slice(-8).toUpperCase()}</span></p>
              </div>
              <div className="order-status-badge" style={{
                background: currentStatusIndex === 4 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                           currentStatusIndex >= 3 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
                           currentStatusIndex >= 1 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                           'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
              }}>
                {order.status}
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="tracking-timeline-card">
              <h2>Order Status</h2>
              <div className="timeline">
                {orderStatuses.map((status, index) => (
                  <div 
                    key={status.key} 
                    className={`timeline-item ${index <= currentStatusIndex ? 'completed' : ''} ${index === currentStatusIndex ? 'active' : ''}`}
                  >
                    <div className="timeline-connector">
                      {index < orderStatuses.length - 1 && (
                        <div className={`timeline-line ${index < currentStatusIndex ? 'filled' : ''}`}></div>
                      )}
                    </div>
                    <div className="timeline-icon">
                      <status.icon />
                    </div>
                    <div className="timeline-content">
                      <h3>{status.label}</h3>
                      <p>{status.description}</p>
                      {index <= currentStatusIndex && (
                        <span className="timeline-timestamp">
                          <FaClock /> {new Date(order.updatedAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="order-details-grid">
              {/* Items Card */}
              <div className="details-card">
                <div className="card-header">
                  <FaBox />
                  <h3>Order Items</h3>
                </div>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <h4>{item.productId?.name || 'Product'}</h4>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery Charges</span>
                      <span>{order.deliveryCharge > 0 ? `₹${order.deliveryCharge.toFixed(2)}` : 'FREE'}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>₹{order.finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info Card */}
              <div className="details-card">
                <div className="card-header">
                  <FaMapMarkerAlt />
                  <h3>Delivery Information</h3>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <div className="info-label">
                      <FaMapMarkerAlt /> Delivery Address
                    </div>
                    <div className="info-value">
                      {order.address?.fullAddress || 'Not provided'}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <FaPhone /> Contact Number
                    </div>
                    <div className="info-value">
                      {order.address?.phone || 'Not provided'}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <FaTruck /> Delivery Type
                    </div>
                    <div className="info-value">
                      {order.deliveryOption === 'home_delivery' ? 'Home Delivery' : 'Shop Pickup'}
                    </div>
                  </div>
                  {order.address?.instructions && (
                    <div className="info-item">
                      <div className="info-label">
                        📝 Special Instructions
                      </div>
                      <div className="info-value">
                        {order.address.instructions}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Shop Info Card */}
              <div className="details-card">
                <div className="card-header">
                  <FaCreditCard />
                  <h3>Payment Details</h3>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <div className="info-label">
                      <FaCreditCard /> Payment Method
                    </div>
                    <div className="info-value">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      💰 Payment Status
                    </div>
                    <div className="info-value">
                      <span className={`payment-status ${order.paymentStatus}`}>
                        {order.paymentStatus === 'completed' ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <FaCalendarAlt /> Order Date
                    </div>
                    <div className="info-value">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="tracking-actions">
              <button className="btn-secondary" onClick={() => navigate('/')}>
                <FaStore /> Continue Shopping
              </button>
              <button className="btn-primary" onClick={() => window.print()}>
                🖨️ Print Invoice
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
