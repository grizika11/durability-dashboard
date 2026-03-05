import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
        <pre style={{ fontSize: 12, color: "#71717a", whiteSpace: "pre-wrap" }}>
          {this.state.error.message}
        </pre>
        <button onClick={() => { this.setState({ error: null }); window.location.reload(); }}
          style={{ marginTop: 16, padding: "8px 16px", background: "#c8e64e", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
          Reload
        </button>
      </div>
    )
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
