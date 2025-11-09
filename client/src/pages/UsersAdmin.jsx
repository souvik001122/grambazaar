import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/admin.css'

export default function UsersAdmin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      console.log('Fetching users from:', `${base}/api/auth/users`)
      const res = await axios.get(`${base}/api/auth/users`)
      console.log('Users response:', res.data)
      setUsers(res.data.users || [])
      setError('')
    } catch (err) {
      console.error('Failed to fetch users:', err)
      console.error('Error response:', err.response)
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch users. Make sure the server is running on http://localhost:5000'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👥 All Registered Users</h1>
        <button onClick={fetchUsers} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Admin Users</h3>
          <p className="stat-number">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="stat-card">
          <h3>Regular Users</h3>
          <p className="stat-number">{users.filter(u => u.role === 'user').length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p className="stat-number">{users.filter(u => u.isActive).length}</p>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No users found. Register a new account to see it here.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.joinDate).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
