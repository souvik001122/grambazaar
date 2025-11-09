import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useCartState, useCartDispatch } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaStore, FaHeart, FaTags, FaArrowRight } from 'react-icons/fa'

export default function CartPage(){
  const { items } = useCartState()
  const dispatch = useCartDispatch()
  const { user } = useAuth()
  const { warning } = useToast()
  const navigate = useNavigate()

  function onRemove(productId){ dispatch({ type: 'remove', productId }) }
  function onUpdate(productId, quantity){ dispatch({ type: 'update', productId, quantity }) }

  function handleCheckout() {
    if (!user) {
      warning('Please login to place an order')
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div className="page cart-page">
      <Header />
      <main>
        {items.length === 0 ? (
          <div className="empty-cart-container">
            <div className="empty-cart-card">
              <div className="empty-cart-animation">
                <div className="cart-icon-wrapper">
                  <FaShoppingCart className="cart-icon" />
                  <div className="cart-pulse"></div>
                </div>
              </div>
              
              <h1 className="empty-cart-title">Your Cart is Empty</h1>
              <p className="empty-cart-subtitle">
                Looks like you haven't added anything to your cart yet
              </p>

              <div className="empty-cart-suggestions">
                <div className="suggestion-card">
                  <div className="suggestion-icon">
                    <FaStore />
                  </div>
                  <h3>Browse Shops</h3>
                  <p>Discover local stores in your area</p>
                </div>

                <div className="suggestion-card">
                  <div className="suggestion-icon">
                    <FaTags />
                  </div>
                  <h3>Best Deals</h3>
                  <p>Check out our special offers</p>
                </div>

                <div className="suggestion-card">
                  <div className="suggestion-icon">
                    <FaHeart />
                  </div>
                  <h3>Wishlist</h3>
                  <p>Save items for later</p>
                </div>
              </div>

              <Link to="/" className="continue-shopping-btn">
                <FaStore /> Start Shopping
                <FaArrowRight className="arrow-icon" />
              </Link>

              <div className="empty-cart-features">
                <div className="feature">
                  <span className="feature-icon">🚚</span>
                  <span>Free Delivery on orders above ₹500</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">💳</span>
                  <span>Multiple Payment Options</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1>Your Cart</h1>
            <div className="cart-layout">
              <div className="cart-list">
                {items.map(i => (
                  <CartItem key={i.productId} item={i} onRemove={onRemove} onUpdate={onUpdate} />
                ))}
              </div>
              <aside className="cart-summary">
                <CartSummary />
                {!user && (
                  <div className="login-prompt" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>🔐 Login Required</p>
                    <p style={{ margin: '0', fontSize: '0.9rem' }}>Please login to place your order</p>
                  </div>
                )}
                <button onClick={handleCheckout} style={{ width: '100%' }}>
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
