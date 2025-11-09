import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const { loginWithAPI, registerWithAPI, loginGuest } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password || isLogin) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Weak', color: '#ef4444' },
      { strength: 2, label: 'Fair', color: '#f59e0b' },
      { strength: 3, label: 'Good', color: '#3b82f6' },
      { strength: 4, label: 'Strong', color: '#10b981' },
      { strength: 5, label: 'Very Strong', color: '#059669' }
    ]

    return levels[Math.min(strength, 5)]
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLogin) {
      // Login with API
      if (!formData.email || !formData.password) {
        showError('Please enter email and password')
        return
      }

      setLoading(true)
      const result = await loginWithAPI(formData.email, formData.password)
      setLoading(false)

      if (result.success) {
        success(`Welcome back${result.user.role === 'admin' ? ', Admin' : ''}!`)
        navigate(result.user.role === 'admin' ? '/admin' : '/')
      } else {
        showError(result.error)
      }
    } else {
      // Register with API
      if (!formData.name || !formData.email || !formData.password) {
        showError('Please fill all required fields')
        return
      }

      setLoading(true)
      const result = await registerWithAPI(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      )
      setLoading(false)

      if (result.success) {
        success('Account created successfully! Welcome to GramBazaar!')
        navigate('/')
      } else {
        showError(result.error)
      }
    }
  }

  const handleGuestLogin = () => {
    loginGuest({ name: 'Guest User' })
    success('Browsing as guest')
    navigate('/')
  }

  const quickFillDemo = (role) => {
    if (role === 'admin') {
      setFormData({
        ...formData,
        email: 'admin@grambazaar.com',
        password: 'admin123'
      })
      success('Demo admin credentials filled!')
    } else {
      setFormData({
        ...formData,
        email: 'user@grambazaar.com',
        password: 'user123'
      })
      success('Demo user credentials filled!')
    }
  }

  return (
    <div className="page login-page">
      <Header />
      <main>
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
              <p>{isLogin ? 'Sign in to your account' : 'Join GramBazaar community'}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && (
                <div className="form-group">
                  <label>
                    <FaUser />
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                      autoComplete="name"
                      name="name"
                    />
                  </label>
                </div>
              )}

              <div className="form-group">
                <label>
                  <FaEnvelope />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    autoComplete="email"
                    name="email"
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <FaLock />
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password *"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      name="password"
                    />
                    <button
                      type="button"
                      className={`password-toggle ${showPassword ? 'visible' : ''}`}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </label>
                {!isLogin && passwordStrength.strength > 0 && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span className="strength-label" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>
                    <FaPhone />
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      autoComplete="tel"
                      name="phone"
                    />
                  </label>
                </div>
              )}

              {isLogin && (
                <div className="remember-me">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkbox-custom"></span>
                    <span>Remember me for 30 days</span>
                  </label>
                </div>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>

              {isLogin && (
                <div className="form-links">
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>
              )}

              <button type="button" className="guest-btn" onClick={handleGuestLogin} disabled={loading}>
                Continue as Guest
              </button>
            </form>

            <div className="login-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => {
                  setIsLogin(!isLogin)
                  setShowPassword(false)
                }} className="toggle-btn" type="button">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
