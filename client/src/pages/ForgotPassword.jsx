import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../context/ToastContext'
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa'
import '../styles/admin.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { success, error: showError } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      showError('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.post(`${base}/api/auth/forgot-password`, { email })
      
      setSent(true)
      success(res.data.message || 'Password reset link sent to your email!')
    } catch (err) {
      console.error('Forgot password error:', err)
      showError(err.response?.data?.error || 'Failed to send reset link')
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
              <h1>🔐 Forgot Password</h1>
              <p>Enter your email address and we'll send you a password reset link</p>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="form-footer">
                  <Link to="/login" className="back-link">
                    <FaArrowLeft /> Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h2>Email Sent!</h2>
                <p>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="help-text">
                  Please check your inbox and click the link to reset your password.
                  The link will expire in 1 hour.
                </p>
                <p className="help-text">
                  Don't see the email? Check your spam folder.
                </p>
                <Link to="/login" className="back-link">
                  <FaArrowLeft /> Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
