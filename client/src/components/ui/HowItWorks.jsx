import React from 'react'
import { FaSearch, FaShoppingCart, FaTruck } from 'react-icons/fa'
import { useShops } from '../../context/ShopContext'

export default function HowItWorks() {
  const { bengali } = useShops()
  
  const content = {
    en: {
      title: 'How it works',
      steps: [
        { icon: FaSearch, title: 'Find', desc: 'Search local shops and products' },
        { icon: FaShoppingCart, title: 'Order', desc: 'Add items and checkout with COD or online' },
        { icon: FaTruck, title: 'Receive', desc: 'Home delivery or pickup from shop' }
      ]
    },
    bn: {
      title: 'এটা কিভাবে কাজ করে',
      steps: [
        { icon: FaSearch, title: 'খুঁজুন', desc: 'স্থানীয় দোকান এবং পণ্য খুঁজুন' },
        { icon: FaShoppingCart, title: 'অর্ডার করুন', desc: 'পণ্য যোগ করুন এবং COD বা অনলাইনে চেকআউট করুন' },
        { icon: FaTruck, title: 'গ্রহণ করুন', desc: 'হোম ডেলিভারি বা দোকান থেকে পিকআপ' }
      ]
    }
  }
  
  const t = bengali ? content.bn : content.en
  
  return (
    <section className="how-it-works">
      <h2>{t.title}</h2>
      <ol>
        {t.steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <li key={idx}>
              <div className="step-icon">
                <Icon />
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
