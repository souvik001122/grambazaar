import React from 'react'
import ShopCard from './ShopCard'

export default function ShopGrid({ shops = [] }) {
  return (
    <div className="shop-grid">
      {shops.map(s => <ShopCard key={s._id} shop={s} />)}
    </div>
  )
}
