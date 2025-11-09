import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../context/ToastContext'
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'
import '../styles/admin.css'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')
    
    if (!tokenParam || !emailParam) {
      showError('Invalid password reset link')
      navigate('/login')
      return
    }
    
    setToken(tokenParam)
    setEmail(emailParam)
  }, [searchParams, navigate, showError])

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#059669']

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.password || !formData.confirmPassword) {
      showError('Please fill all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      showError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.post(`${base}/api/auth/reset-password`, {
        email,
        token,
        newPassword: formData.password
      })
      
      success(res.data.message || 'Password reset successful!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      console.error('Reset password error:', err)
      showError(err.response?.data?.error || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <main>
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>🔑 Reset Password</h1>
              <p>Enter your new password for <strong>{email}</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock /> New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className={`password-toggle ${showPassword ? 'visible' : ''}`}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: strengthColors[passwordStrength]
                        }}
                      />
                    </div>
                    <span 
                      className="strength-label"
                      style={{ color: strengthColors[passwordStrength] }}
                    >
                      {strengthLabels[passwordStrength]}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FaLock /> Confirm New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className={`password-toggle ${showConfirmPassword ? 'visible' : ''}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="error-text">Passwords do not match</span>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading || formData.password !== formData.confirmPassword}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="form-footer">
                <Link to="/login" className="back-link">
                  <FaArrowLeft /> Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
