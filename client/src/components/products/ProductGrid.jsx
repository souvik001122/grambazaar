import React from 'react'
import ProductCard from './ProductCard'

export default function ProductGrid({ products = [], onAddToCart = () => {} }) {
  return (
    <div className="product-grid">
      {products.map(p => <ProductCard key={p._id} product={p} onAdd={(quantity) => onAddToCart(p, quantity)} />)}
    </div>
  )
}
