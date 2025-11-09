import React from 'react'
import { useCartState } from '../../context/CartContext'

export default function CartSummary() {
  const { items } = useCartState()
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  return (
    <div className="cart-summary" aria-live="polite">
      <div>Subtotal: ₹{subtotal}</div>
    </div>
  )
}
