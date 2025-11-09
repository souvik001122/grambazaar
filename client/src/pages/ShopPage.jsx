import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ProductGrid from '../components/products/ProductGrid'
import { useCartDispatch } from '../context/CartContext'

export default function ShopPage() {
  const { id } = useParams();
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useCartDispatch()

  useEffect(() => { 
    async function fetchShop() {
      setLoading(true)
      setError(null)
      try {
        const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
        const res = await axios.get(base + `/api/shops/${id}`)
        setShop(res.data)
      } catch (err) {
        console.error('Error fetching shop:', err)
        setError(err.message || 'Failed to load shop')
      }
      setLoading(false)
    }
    fetchShop()
  }, [id])

  function onAddToCart(product, quantity = 1) {
    dispatch({ type: 'add', item: { productId: product._id, shopId: shop._id, name: product.name, price: product.price, quantity } })
  }

  return (
    <div className="page shop">
      <Header />
      <main>
        {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>Error: {error}</p> : !shop ? <p>Shop not found</p> : (
          <>
            <header className="shop-header">
              <h1>{shop.name}</h1>
              <p>{shop.description}</p>
            </header>
            <ProductGrid products={shop.products || []} onAddToCart={onAddToCart} />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
