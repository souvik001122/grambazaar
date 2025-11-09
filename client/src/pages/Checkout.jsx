import React, { useState, useEffect } from 'react'
import { useCartState, useCartDispatch } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { calculateDelivery } from '../utils/deliveryCalculator'
import axios from 'axios'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaMapMarkerAlt, FaTrash, FaStar } from 'react-icons/fa'

export default function Checkout() {
  const { items } = useCartState()
  const dispatch = useCartDispatch()
  const { user } = useAuth()
  const { success, error: showError, warning } = useToast()
  const navigate = useNavigate()

  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [address, setAddress] = useState({ fullAddress: '', phone: '', instructions: '', label: 'Home' })
  const [deliveryOption, setDeliveryOption] = useState('home_delivery')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(false)

  // Require login to checkout
  useEffect(() => {
    if (!user) {
      warning('Please login to place an order')
      navigate('/login')
    } else {
      fetchSavedAddresses()
    }
  }, [user, navigate, warning])

  const fetchSavedAddresses = async () => {
    if (!user?.email) return;
    
    setLoadingAddresses(true)
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.get(`${base}/api/addresses/user/${encodeURIComponent(user.email)}`)
      setSavedAddresses(res.data)
      
      // Auto-select default address
      const defaultAddr = res.data.find(a => a.isDefault)
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id)
        setAddress({
          fullAddress: defaultAddr.fullAddress,
          phone: defaultAddr.phone,
          instructions: '',
          label: defaultAddr.label
        })
      } else if (res.data.length > 0) {
        // Select first address if no default
        const firstAddr = res.data[0]
        setSelectedAddressId(firstAddr._id)
        setAddress({
          fullAddress: firstAddr.fullAddress,
          phone: firstAddr.phone,
          instructions: '',
          label: firstAddr.label
        })
      } else {
        setShowNewAddressForm(true)
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
    }
    setLoadingAddresses(false)
  }

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr._id)
    setAddress({
      fullAddress: addr.fullAddress,
      phone: addr.phone,
      instructions: '',
      label: addr.label
    })
    setShowNewAddressForm(false)
  }

  const handleSaveNewAddress = async () => {
    if (!address.fullAddress || !address.phone) {
      warning('Please enter address and phone number')
      return
    }

    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.post(`${base}/api/addresses`, {
        userEmail: user.email,
        fullAddress: address.fullAddress,
        phone: address.phone,
        label: address.label,
        isDefault: savedAddresses.length === 0 // First address becomes default
      })
      
      setSavedAddresses([...savedAddresses, res.data])
      setSelectedAddressId(res.data._id)
      setShowNewAddressForm(false)
      success('Address saved successfully!')
    } catch (err) {
      console.error('Error saving address:', err)
      showError('Failed to save address')
    }
  }

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Delete this address?')) return;
    
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      await axios.delete(`${base}/api/addresses/${addrId}`)
      
      const updatedAddresses = savedAddresses.filter(a => a._id !== addrId)
      setSavedAddresses(updatedAddresses)
      
      if (selectedAddressId === addrId) {
        if (updatedAddresses.length > 0) {
          handleSelectAddress(updatedAddresses[0])
        } else {
          setSelectedAddressId(null)
          setAddress({ fullAddress: '', phone: '', instructions: '', label: 'Home' })
          setShowNewAddressForm(true)
        }
      }
      
      success('Address deleted successfully!')
    } catch (err) {
      console.error('Error deleting address:', err)
      showError('Failed to delete address')
    }
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  // naive distance guess (later: integrate map/address geocode)
  const distanceKm = 3
  const estimatedDelivery = deliveryOption === 'home_delivery' ? calculateDelivery(total, distanceKm) : 0

  async function submit() {
    if (!user) {
      warning('Please login to place an order')
      navigate('/login')
      return
    }

    if (!address.fullAddress || !address.phone) {
      warning('Please enter address and phone number')
      return
    }

    setLoading(true)
    try {
      const shopId = items.length && items[0].shopId ? items[0].shopId : null
      if (!shopId) {
        showError('Cart items missing shop information')
        setLoading(false)
        return
      }
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.post(base + '/api/orders', { 
        shopId, 
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })), 
        deliveryOption, 
        address: {
          ...address,
          email: user.email
        }, 
        paymentMethod,
        customerName: user.name,
        customerEmail: user.email
      })
      const order = res.data
      dispatch({ type: 'clear' })
      success('Order placed successfully!')
      navigate(`/order/${order._id}`)
    } catch (err) { 
      console.error('Order error:', err)
      showError('Order failed: ' + (err.response?.data?.error || err.message))
    }
    setLoading(false)
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="page checkout">
      <Header />
      <main>
        <div className="checkout-form">
          <h1>Checkout</h1>
          
          <section>
            <div className="section-header">
              <h2>Delivery Address</h2>
              {!showNewAddressForm && savedAddresses.length > 0 && (
                <button 
                  type="button" 
                  className="btn-add-address"
                  onClick={() => {
                    setShowNewAddressForm(true)
                    setSelectedAddressId(null)
                    setAddress({ fullAddress: '', phone: '', instructions: '', label: 'Home' })
                  }}
                >
                  <FaPlus /> Add New Address
                </button>
              )}
            </div>

            {loadingAddresses ? (
              <div className="loading-addresses">Loading addresses...</div>
            ) : (
              <>
                {/* Saved Addresses */}
                {!showNewAddressForm && savedAddresses.length > 0 && (
                  <div className="saved-addresses">
                    {savedAddresses.map(addr => (
                      <div 
                        key={addr._id} 
                        className={`address-card ${selectedAddressId === addr._id ? 'selected' : ''}`}
                        onClick={() => handleSelectAddress(addr)}
                      >
                        <div className="address-card-header">
                          <div className="address-label">
                            <FaMapMarkerAlt />
                            <span>{addr.label}</span>
                            {addr.isDefault && <FaStar className="default-icon" title="Default Address" />}
                          </div>
                          <button 
                            type="button"
                            className="btn-delete-address"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAddress(addr._id)
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="address-details">
                          <p>{addr.fullAddress}</p>
                          <p className="address-phone">📞 {addr.phone}</p>
                        </div>
                        {selectedAddressId === addr._id && (
                          <div className="selected-badge">✓ Selected</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* New Address Form */}
                {showNewAddressForm && (
                  <div className="new-address-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Address Label</label>
                        <select 
                          value={address.label}
                          onChange={e => setAddress({ ...address, label: e.target.value })}
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Address *</label>
                        <input 
                          type="text"
                          placeholder="123 Main St, City, State, PIN"
                          value={address.fullAddress} 
                          onChange={e => setAddress({ ...address, fullAddress: e.target.value })} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone *</label>
                        <input 
                          type="tel"
                          placeholder="9876543210"
                          value={address.phone} 
                          onChange={e => setAddress({ ...address, phone: e.target.value })} 
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Delivery Instructions (Optional)</label>
                      <input 
                        type="text"
                        placeholder="e.g., Ring the bell twice, Leave at door"
                        value={address.instructions} 
                        onChange={e => setAddress({ ...address, instructions: e.target.value })} 
                      />
                    </div>
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn-save-address"
                        onClick={handleSaveNewAddress}
                      >
                        Save Address
                      </button>
                      {savedAddresses.length > 0 && (
                        <button 
                          type="button" 
                          className="btn-cancel"
                          onClick={() => {
                            setShowNewAddressForm(false)
                            if (savedAddresses.length > 0) {
                              handleSelectAddress(savedAddresses[0])
                            }
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Instructions for selected address */}
                {!showNewAddressForm && selectedAddressId && (
                  <div className="form-group">
                    <label>Delivery Instructions (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g., Ring the bell twice, Leave at door"
                      value={address.instructions} 
                      onChange={e => setAddress({ ...address, instructions: e.target.value })} 
                    />
                  </div>
                )}
              </>
            )}
          </section>

          <section>
            <h2>Delivery</h2>
            <div className="radio-group">
              <label>
                <input 
                  type="radio" 
                  name="delivery"
                  checked={deliveryOption==='home_delivery'} 
                  onChange={() => setDeliveryOption('home_delivery')} 
                />
                Home Delivery
              </label>
              <label>
                <input 
                  type="radio" 
                  name="delivery"
                  checked={deliveryOption==='pickup'} 
                  onChange={() => setDeliveryOption('pickup')} 
                />
                Shop Pickup
              </label>
            </div>
          </section>

          <section>
            <h2>Payment</h2>
            <div className="radio-group">
              <label>
                <input 
                  type="radio" 
                  name="payment"
                  checked={paymentMethod==='cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                />
                Cash on Delivery
              </label>
              <label>
                <input 
                  type="radio" 
                  name="payment"
                  checked={paymentMethod==='upi'} 
                  onChange={() => setPaymentMethod('upi')} 
                />
                UPI (simulate)
              </label>
              <label>
                <input 
                  type="radio" 
                  name="payment"
                  checked={paymentMethod==='card'} 
                  onChange={() => setPaymentMethod('card')} 
                />
                Card (simulate)
              </label>
            </div>
          </section>

          <section>
            <h2>Order Summary</h2>
            <div className="summary">
              <div>
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </div>
              <div>
                <span>Estimated delivery:</span>
                <span>₹{estimatedDelivery}</span>
              </div>
              <div>
                <span>Final estimate:</span>
                <span>₹{total + estimatedDelivery}</span>
              </div>
            </div>
            <button type="submit" onClick={submit} disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
