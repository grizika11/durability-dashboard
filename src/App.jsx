import { useState, createContext, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AthleteDetail from './pages/AthleteDetail'
import TeamAnalytics from './pages/TeamAnalytics'
import Layout from './components/Layout'

// Auth context - will be replaced with Supabase Auth later
const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

// Demo password - replace with Supabase Auth
const DEMO_PASSWORD = 'pilot2025'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('durability_auth') === 'true'
  })
  
  const [user] = useState({
    name: 'Coach Demo',
    email: 'coach@example.com',
    role: 'Coach',
    initials: 'CD',
  })
  
  const login = (password) => {
    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('durability_auth', 'true')
      return true
    }
    return false
  }
  
  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('durability_auth')
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        
        <Route element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/athlete/:id" element={<AthleteDetail />} />
          <Route path="/analytics" element={<TeamAnalytics />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}

export default App
