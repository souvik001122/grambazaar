import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    try { 
      const savedUser = localStorage.getItem('gb_user')
      const savedToken = localStorage.getItem('gb_token')
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
      }
    } catch {}
  }, [])

  async function loginWithAPI(email, password) {
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.post(`${base}/api/auth/login`, { email, password })
      
      const { user: userData, token: authToken } = res.data
      
      setUser(userData)
      setToken(authToken)
      localStorage.setItem('gb_user', JSON.stringify(userData))
      localStorage.setItem('gb_token', authToken)
      
      return { success: true, user: userData }
    } catch (err) {
      console.error('Login error:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Login failed' 
      }
    }
  }

  async function registerWithAPI(name, email, password, phone = '') {
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.post(`${base}/api/auth/register`, { 
        name, 
        email, 
        password, 
        phone 
      })
      
      const { user: userData, token: authToken } = res.data
      
      setUser(userData)
      setToken(authToken)
      localStorage.setItem('gb_user', JSON.stringify(userData))
      localStorage.setItem('gb_token', authToken)
      
      return { success: true, user: userData }
    } catch (err) {
      console.error('Registration error:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Registration failed' 
      }
    }
  }

  // Backward compatibility - for hardcoded demo login
  function login(profile) { 
    const u = { id: profile.id || 'user_' + Date.now(), ...profile }
    setUser(u)
    localStorage.setItem('gb_user', JSON.stringify(u))
  }

  function loginGuest(profile) { 
    const u = { id: 'guest_' + Date.now(), role: 'guest', ...profile }
    setUser(u)
    localStorage.setItem('gb_user', JSON.stringify(u))
  }

  function logout() { 
    setUser(null)
    setToken(null)
    localStorage.removeItem('gb_user')
    localStorage.removeItem('gb_token')
  }

  function isAdmin() {
    return user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      loginGuest, 
      loginWithAPI,
      registerWithAPI,
      logout, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { 
  return useContext(AuthContext) 
}
