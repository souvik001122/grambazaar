import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const ShopContext = createContext()

export function ShopProvider({ children }) {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bengali, setBengali] = useState(false)

  useEffect(() => { fetchShops() }, [])

  async function fetchShops(params = {}) {
    setLoading(true); setError(null)
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await axios.get(base + '/api/shops', { params })
      setShops(res.data)
    } catch (err) {
      console.error('Error fetching shops:', err)
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <ShopContext.Provider value={{ shops, loading, error, fetchShops, bengali, setBengali }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShops() { return useContext(ShopContext) }
