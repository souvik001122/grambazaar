import React from 'react'
import { useShops } from '../context/ShopContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ShopGrid from '../components/shops/ShopGrid'
import SearchBar from '../components/products/SearchBar'
import HowItWorks from '../components/ui/HowItWorks'

export default function Home() {
  const { shops, loading } = useShops()
  return (
    <div className="page home">
      <Header />
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Your Local Shops, Now Online</h1>
            <p className="bengali">আপনার স্থানীয় দোকান, এখন অনলাইনে</p>
            <SearchBar />
          </div>
        </section>

        <section className="featured">
          <h2>Featured Shops</h2>
          {loading ? <p>Loading...</p> : <ShopGrid shops={shops} />}
        </section>

        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
