import React, { useState, useEffect } from 'react'
import { useShops } from '../../context/ShopContext'

const CATEGORIES = ['Medical','Kirana','Vegetables','Stationery','Bakery']

export default function SearchBar() {
  const { fetchShops } = useShops()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const t = setTimeout(() => fetchShops({ q, category }), 400)
    return () => clearTimeout(t)
  }, [q, category])

  return (
    <div className="search-bar" role="search">
      <input placeholder="Search shops or products" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
      <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Category">
        <option value="">All</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  )
}
