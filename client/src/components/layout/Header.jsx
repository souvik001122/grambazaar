import React from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaHome, FaGlobe, FaSignInAlt, FaSignOutAlt, FaCog } from 'react-icons/fa'
import { useShops } from '../../context/ShopContext'
import { useCartState } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { bengali, setBengali } = useShops()
  const { items } = useCartState()
  const { user, logout, isAdmin } = useAuth()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const handleLogout = () => {
    logout()
  }
  
  return (
    <header className="header" role="banner">
      <div className="brand">
        <Link to="/">
          <span className="brand-name">GramBazaar</span>
          <span className="brand-tagline">গ্রাম বাজার</span>
        </Link>
      </div>
      <nav aria-label="Main navigation">
        <Link to="/" className="nav-link">
          <FaHome />
          <span>{bengali ? 'হোম' : 'Home'}</span>
        </Link>
        
        {user && isAdmin() && (
          <Link to="/admin" className="nav-link admin-link">
            <FaCog />
            <span>Admin</span>
          </Link>
        )}
        
        <Link to="/profile" className="nav-link">
          <FaUser />
          <span>{bengali ? 'প্রোফাইল' : 'Profile'}</span>
        </Link>
        
        <Link to="/cart" className="nav-link cart-link">
          <FaShoppingCart />
          <span>{bengali ? 'কার্ট' : 'Cart'}</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        
        {user ? (
          <div className="user-menu">
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="logout-link" title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-link login-link">
            <FaSignInAlt />
            <span>Login</span>
          </Link>
        )}
        
        <button 
          className="language-toggle" 
          onClick={() => setBengali(!bengali)} 
          aria-pressed={bengali}
          title={bengali ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
        >
          <FaGlobe />
          <span>{bengali ? 'EN' : 'বাং'}</span>
        </button>
      </nav>
    </header>
  )
}
