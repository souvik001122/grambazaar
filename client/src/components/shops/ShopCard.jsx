import React from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaStore } from 'react-icons/fa'

function Rating({ value = 4 }) {
  return <div className="rating" aria-label={`Rating ${value} out of 5`}>{'★'.repeat(Math.round(value))}{'☆'.repeat(5-Math.round(value))}</div>
}

/**
 * ShopCard
 * @param {{shop: { _id: string, name: string, category: string, images?: string[], rating?: number, address?: { city?: string } } }} props
 */
export default function ShopCard({ shop }) {
  const hasImage = shop.images && shop.images[0]
  const shopImage = hasImage ? shop.images[0] : `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&size=400&background=2b6cb0&color=fff&bold=true`
  
  return (
    <article className="shop-card">
      <Link to={`/shop/${shop._id}`} aria-label={`Open ${shop.name}`}>
        <div className="shop-image-wrapper">
          {hasImage ? (
            <img src={shopImage} alt={`${shop.name}`} loading="lazy" />
          ) : (
            <div className="shop-placeholder">
              <FaStore />
              <span>{shop.name}</span>
            </div>
          )}
        </div>
        <div className="info">
          <h3>{shop.name}</h3>
          <p className="category">{shop.category}</p>
          <Rating value={shop.rating} />
          <p className="location"><FaMapMarkerAlt /> {shop.address && shop.address.city}</p>
        </div>
      </Link>
    </article>
  )
}
