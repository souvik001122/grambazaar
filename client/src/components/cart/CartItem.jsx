import React from 'react'

export default function CartItem({ item, onRemove, onUpdate }){
  return (
    <div className="cart-item" role="group" aria-label={item.name}>
      <div className="cart-item-left">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">₹{item.price}</div>
      </div>
      <div className="cart-item-right">
        <label>Qty
          <input type="number" min="1" value={item.quantity} onChange={e => onUpdate(item.productId, Number(e.target.value))} />
        </label>
        <button onClick={() => onRemove(item.productId)} aria-label={`Remove ${item.name}`}>Remove</button>
      </div>
    </div>
  )
}
