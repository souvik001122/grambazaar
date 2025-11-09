import React, { useState } from 'react'
import { FaBox, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa'
import { useShops } from '../../context/ShopContext'
import { useToast } from '../../context/ToastContext'

/**
 * ProductCard
 * @param {{product: { _id: string, name: string, price: number, images?: string[], stock?: number, isAvailable?: boolean, regionalNames?: { bengali?: string } }, onAdd: function}} props
 */
export default function ProductCard({ product, onAdd }) {
  const { bengali } = useShops()
  const { success } = useToast()
  const [quantity, setQuantity] = useState(1)
  const hasImage = product.images && product.images[0]
  const displayName = bengali && product.regionalNames?.bengali ? product.regionalNames.bengali : product.name
  
  function handleAdd() {
    onAdd(quantity)
    success(`Added ${quantity}x ${product.name} to cart`)
    setQuantity(1)
  }

  function increment() {
    if (quantity < product.stock) {
      setQuantity(q => q + 1)
    }
  }

  function decrement() {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        {hasImage ? (
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder">
            <FaBox />
          </div>
        )}
      </div>
      <div className="product-info">
        <h4>{displayName}</h4>
        {bengali && product.regionalNames?.bengali && (
          <p className="regional-alt">{product.name}</p>
        )}
        {!bengali && product.regionalNames?.bengali && (
          <p className="regional">{product.regionalNames.bengali}</p>
        )}
        <div className="price">₹{product.price}</div>
        <div className="actions" style={{ flexDirection: 'column', gap: '0.5rem' }}>
          <div className="quantity-controls">
            <button className="quantity-btn" onClick={decrement} disabled={quantity <= 1}>
              <FaMinus />
            </button>
            <span className="quantity-display">{quantity}</span>
            <button className="quantity-btn" onClick={increment} disabled={quantity >= product.stock}>
              <FaPlus />
            </button>
          </div>
          <button onClick={handleAdd} disabled={!product.isAvailable || product.stock <= 0} aria-disabled={!product.isAvailable} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <FaShoppingCart /> Add to cart
          </button>
          <div className="stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
        </div>
      </div>
    </article>
  )
}
