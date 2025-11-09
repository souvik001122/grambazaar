import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){ 
    super(props); 
    this.state = { hasError: false, error: null } 
  }
  static getDerivedStateFromError(error){ 
    return { hasError: true, error } 
  }
  componentDidCatch(err, info){ 
    console.error('ErrorBoundary caught error:', err, info) 
  }
  render(){ 
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>⚠️ Something went wrong</h2>
          <p>Please check the browser console for details.</p>
          {this.state.error && (
            <pre style={{ background: '#f5f5f5', padding: '1rem', margin: '1rem', borderRadius: '8px', textAlign: 'left' }}>
              {this.state.error.toString()}
            </pre>
          )}
          <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

