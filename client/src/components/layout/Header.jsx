import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaHome, FaGlobe, FaSignInAlt, FaSignOutAlt, FaCog, FaBars, FaTimes } from 'react-icons/fa'
import { useShops } from '../../context/ShopContext'
import { useCartState } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { bengali, setBengali } = useShops()
  const { items } = useCartState()
  const { user, logout, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const handleLogout = () => {
    logout()
    setMenuOpen(false)
  }
  
  const closeMenu = () => {
    setMenuOpen(false)
  }
  
  return (
    <header className="header" role="banner">
      <div className="header-container">
        <div className="brand">
          <Link to="/" onClick={closeMenu}>
            <span className="brand-name">GramBazaar</span>
            <span className="brand-tagline">গ্রাম বাজার</span>
          </Link>
        </div>

        {/* Mobile Quick Actions */}
        <div className="mobile-actions">
          <button 
            className="language-toggle mobile" 
            onClick={() => setBengali(!bengali)} 
            aria-pressed={bengali}
            title={bengali ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            <FaGlobe />
          </button>
          
          <Link to="/cart" className="cart-icon-mobile" onClick={closeMenu}>
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          <button 
            className="hamburger" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop & Mobile Menu */}
        <nav 
          className={`main-nav ${menuOpen ? 'active' : ''}`} 
          aria-label="Main navigation"
        >
          <Link to="/" className="nav-link" onClick={closeMenu}>
            <FaHome />
            <span>{bengali ? 'হোম' : 'Home'}</span>
          </Link>
          
          {user && isAdmin() && (
            <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
              <FaCog />
              <span>Admin</span>
            </Link>
          )}
          
          <Link to="/profile" className="nav-link" onClick={closeMenu}>
            <FaUser />
            <span>{bengali ? 'প্রোফাইল' : 'Profile'}</span>
          </Link>
          
          <Link to="/cart" className="nav-link cart-link desktop-only" onClick={closeMenu}>
            <FaShoppingCart />
            <span>{bengali ? 'কার্ট' : 'Cart'}</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="logout-link" title="Logout">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-link" onClick={closeMenu}>
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          )}
          
          <button 
            className="language-toggle desktop" 
            onClick={() => {setBengali(!bengali); closeMenu()}} 
            aria-pressed={bengali}
            title={bengali ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            <FaGlobe />
            <span>{bengali ? 'EN' : 'বাং'}</span>
          </button>
        </nav>
      </div>
      
      {/* Overlay for mobile menu */}
      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </header>
  )
}
