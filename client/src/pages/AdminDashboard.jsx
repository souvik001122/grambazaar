import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { 
  FaStore, FaBox, FaShoppingCart, FaRupeeSign, FaUsers, 
  FaChartLine, FaChartBar, FaDatabase, FaCog, FaSignOutAlt 
} from 'react-icons/fa'

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState({
    shops: [],
    products: [],
    orders: []
  })
  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeShops: 0,
    availableProducts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/login')
      return
    }
    loadData()
  }, [user, isAdmin, navigate])

  const loadData = async () => {
    setLoading(true)
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      
      const [shopsRes, productsRes] = await Promise.all([
        axios.get(`${base}/api/shops`),
        axios.get(`${base}/api/products`)
      ])

      const shops = Array.isArray(shopsRes.data) ? shopsRes.data : []
      const products = Array.isArray(productsRes.data) ? productsRes.data : []

      setData({ shops, products, orders: [] })
      
      setStats({
        totalShops: shops.length,
        totalProducts: products.length,
        totalOrders: 0,
        totalRevenue: 0,
        activeShops: shops.filter(s => s.isActive).length,
        availableProducts: products.filter(p => p.isAvailable).length
      })
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="page admin-page">
        <Header />
        <main>
          <div className="loader">Loading admin dashboard...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page admin-page">
      <Header />
      <main>
        <div className="admin-container">
          <div className="admin-header">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {user?.name}!</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon"><FaStore /></div>
              <div className="stat-info">
                <h3>{stats.totalShops}</h3>
                <p>Total Shops</p>
                <span className="stat-sub">{stats.activeShops} active</span>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon"><FaBox /></div>
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
                <span className="stat-sub">{stats.availableProducts} available</span>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon"><FaShoppingCart /></div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
                <span className="stat-sub">All time</span>
              </div>
            </div>

            <div className="stat-card danger">
              <div className="stat-icon"><FaRupeeSign /></div>
              <div className="stat-info">
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p>Revenue</p>
                <span className="stat-sub">Total earnings</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button 
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartLine /> Overview
            </button>
            <button 
              className={activeTab === 'shops' ? 'active' : ''}
              onClick={() => setActiveTab('shops')}
            >
              <FaStore /> Shops
            </button>
            <button 
              className={activeTab === 'products' ? 'active' : ''}
              onClick={() => setActiveTab('products')}
            >
              <FaBox /> Products
            </button>
            <button 
              className={activeTab === 'analytics' ? 'active' : ''}
              onClick={() => setActiveTab('analytics')}
            >
              <FaChartBar /> Analytics
            </button>
            <button 
              className={activeTab === 'database' ? 'active' : ''}
              onClick={() => setActiveTab('database')}
            >
              <FaDatabase /> Database
            </button>
          </div>

          {/* Tab Content */}
          <div className="admin-content">
            {activeTab === 'overview' && <OverviewTab stats={stats} data={data} />}
            {activeTab === 'shops' && <ShopsTab shops={data.shops} onRefresh={loadData} />}
            {activeTab === 'products' && <ProductsTab products={data.products} onRefresh={loadData} />}
            {activeTab === 'analytics' && <AnalyticsTab data={data} stats={stats} />}
            {activeTab === 'database' && <DatabaseTab data={data} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Overview Tab
function OverviewTab({ stats, data }) {
  return (
    <div className="overview-tab">
      <div className="overview-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon success">✓</span>
            <div>
              <p><strong>Database initialized</strong></p>
              <small>System is running with in-memory MongoDB</small>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon primary">📦</span>
            <div>
              <p><strong>{stats.totalProducts} products available</strong></p>
              <small>Ready for customers to browse and purchase</small>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon warning">🏪</span>
            <div>
              <p><strong>{stats.activeShops} shops active</strong></p>
              <small>Currently accepting orders</small>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-section">
        <h2>Quick Stats</h2>
        <div className="quick-stats">
          <div className="quick-stat">
            <span>Average Shop Rating</span>
            <strong>⭐ {data.shops.length > 0 ? (data.shops.reduce((sum, s) => sum + (s.rating || 0), 0) / data.shops.length).toFixed(1) : 'N/A'}</strong>
          </div>
          <div className="quick-stat">
            <span>Average Product Price</span>
            <strong>₹{data.products.length > 0 ? (data.products.reduce((sum, p) => sum + p.price, 0) / data.products.length).toFixed(0) : 0}</strong>
          </div>
          <div className="quick-stat">
            <span>Total Stock Items</span>
            <strong>{data.products.reduce((sum, p) => sum + p.stock, 0)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

// Shops Tab
function ShopsTab({ shops, onRefresh }) {
  return (
    <div className="data-tab">
      <div className="tab-header">
        <h2>Shops Management</h2>
        <button onClick={onRefresh} className="refresh-btn">🔄 Refresh</button>
      </div>

      {shops.length === 0 ? (
        <div className="empty-state">
          <FaStore size={48} />
          <p>No shops found</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Products</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shops.map(shop => (
                <tr key={shop._id}>
                  <td>
                    <strong>{shop.name}</strong>
                    <br />
                    <small className="text-muted">{shop._id}</small>
                  </td>
                  <td><span className="badge badge-info">{shop.category}</span></td>
                  <td>{shop.address?.city || 'N/A'}</td>
                  <td>{shop.products?.length || 0} items</td>
                  <td>⭐ {shop.rating || 'N/A'}</td>
                  <td>
                    <span className={`badge ${shop.isActive ? 'badge-success' : 'badge-warning'}`}>
                      {shop.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Products Tab
function ProductsTab({ products, onRefresh }) {
  return (
    <div className="data-tab">
      <div className="tab-header">
        <h2>Products Catalog</h2>
        <button onClick={onRefresh} className="refresh-btn">🔄 Refresh</button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <FaBox size={48} />
          <p>No products found</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Bengali Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Shop ID</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <small className="text-muted">{product._id}</small>
                  </td>
                  <td>{product.regionalNames?.bengali || '-'}</td>
                  <td><strong>₹{product.price}</strong></td>
                  <td>{product.stock} units</td>
                  <td>
                    <span className={`badge ${product.isAvailable ? 'badge-success' : 'badge-warning'}`}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td><small className="text-muted">{product.shopId}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Analytics Tab with Charts
function AnalyticsTab({ data, stats }) {
  const categoryData = data.products.reduce((acc, product) => {
    const shop = data.shops.find(s => s._id === product.shopId)
    const category = shop?.category || 'Unknown'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const priceRanges = {
    '₹0-50': data.products.filter(p => p.price < 50).length,
    '₹50-100': data.products.filter(p => p.price >= 50 && p.price < 100).length,
    '₹100-200': data.products.filter(p => p.price >= 100 && p.price < 200).length,
    '₹200+': data.products.filter(p => p.price >= 200).length
  }

  return (
    <div className="analytics-tab">
      <h2>Analytics & Insights</h2>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Products by Category</h3>
          <div className="bar-chart">
            {Object.entries(categoryData).map(([category, count]) => (
              <div key={category} className="bar-item">
                <div className="bar-label">{category}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${(count / data.products.length) * 100}%` }}
                  >
                    <span>{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Price Distribution</h3>
          <div className="bar-chart">
            {Object.entries(priceRanges).map(([range, count]) => (
              <div key={range} className="bar-item">
                <div className="bar-label">{range}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill secondary" 
                    style={{ width: `${(count / data.products.length) * 100}%` }}
                  >
                    <span>{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Stock Levels</h3>
          <div className="stock-chart">
            {data.products.map(product => (
              <div key={product._id} className="stock-item">
                <div className="stock-label">{product.name}</div>
                <div className="stock-bar">
                  <div 
                    className={`stock-fill ${product.stock < 10 ? 'low' : product.stock < 20 ? 'medium' : 'high'}`}
                    style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                  >
                    {product.stock} units
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Database Tab
function DatabaseTab({ data }) {
  const [showJson, setShowJson] = useState(false)

  const dbData = {
    database: 'MongoDB (In-Memory)',
    timestamp: new Date().toISOString(),
    collections: {
      shops: data.shops,
      products: data.products,
      orders: data.orders
    },
    statistics: {
      totalShops: data.shops.length,
      totalProducts: data.products.length,
      totalOrders: data.orders.length
    }
  }

  return (
    <div className="database-tab">
      <div className="tab-header">
        <h2>Database View</h2>
        <button onClick={() => setShowJson(!showJson)} className="toggle-btn">
          {showJson ? '📊 Show Tables' : '📄 Show JSON'}
        </button>
      </div>

      {showJson ? (
        <div className="json-viewer">
          <pre>{JSON.stringify(dbData, null, 2)}</pre>
        </div>
      ) : (
        <div className="database-info">
          <div className="db-section">
            <h3>Database Information</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td><strong>Type:</strong></td>
                  <td>MongoDB (In-Memory)</td>
                </tr>
                <tr>
                  <td><strong>Collections:</strong></td>
                  <td>3 (shops, products, orders)</td>
                </tr>
                <tr>
                  <td><strong>Total Documents:</strong></td>
                  <td>{data.shops.length + data.products.length + data.orders.length}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td><span className="badge badge-success">Connected</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="db-section">
            <h3>Collection Details</h3>
            <div className="collections-grid">
              <div className="collection-card">
                <h4>Shops</h4>
                <p className="collection-count">{data.shops.length}</p>
                <p className="collection-desc">Store information and metadata</p>
              </div>
              <div className="collection-card">
                <h4>Products</h4>
                <p className="collection-count">{data.products.length}</p>
                <p className="collection-desc">Product catalog with prices</p>
              </div>
              <div className="collection-card">
                <h4>Orders</h4>
                <p className="collection-count">{data.orders.length}</p>
                <p className="collection-desc">Customer order records</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
