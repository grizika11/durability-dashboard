import { useState } from 'react'
import { useAuth } from '../App'

function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!login(password)) {
      setError('Invalid access code')
      setPassword('')
    }
  }
  
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>Durability</div>
        </div>
        
        <h1 className="login-title">Coaching Dashboard</h1>
        <p className="login-subtitle">Enter your access code to continue</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="login-input"
            placeholder="Access code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          
          {error && <p className="login-error">{error}</p>}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>
        
        <p className="login-hint">
          Pilot partners: use the code provided in your welcome email
        </p>
      </div>
    </div>
  )
}

export default Login
