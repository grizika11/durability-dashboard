import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { athletes, TEAMS, getTeamStats, getScoreClass } from '../data/mockData'

function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [teamFilter, setTeamFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  
  const stats = getTeamStats()
  
  const filteredAthletes = useMemo(() => {
    let result = [...athletes]
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.email.toLowerCase().includes(searchLower)
      )
    }
    
    // Team filter
    if (teamFilter !== 'all') {
      result = result.filter(a => a.team.id === teamFilter)
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'score-high':
          return b.durabilityScore - a.durabilityScore
        case 'score-low':
          return a.durabilityScore - b.durabilityScore
        case 'recent':
          return new Date(b.lastAssessment) - new Date(a.lastAssessment)
        default:
          return a.name.localeCompare(b.name)
      }
    })
    
    return result
  }, [search, teamFilter, sortBy])
  
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1>Athletes</h1>
        <p>Monitor and track your athletes' movement quality</p>
      </div>
      
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Athletes</div>
          <div className="stat-value">{stats.totalAthletes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Score</div>
          <div className="stat-value">{stats.avgScore}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">At Risk (&lt;60)</div>
          <div className="stat-value" style={{ color: stats.atRisk > 0 ? 'var(--score-poor)' : 'inherit' }}>
            {stats.atRisk}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Improved vs Baseline</div>
          <div className="stat-value">
            {stats.improvedPercent}%
            <span className="stat-change positive" style={{ marginLeft: '8px' }}>
              ↑ {stats.improved} athletes
            </span>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search athletes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="filter-select"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="all">All Teams</option>
          {TEAMS.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="score-high">Score: High to Low</option>
          <option value="score-low">Score: Low to High</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>
      
      {/* Athletes Table */}
      <div className="card">
        <table className="athletes-table">
          <thead>
            <tr>
              <th>Athlete</th>
              <th>Team</th>
              <th>Durability Score</th>
              <th>Top Focus Area</th>
              <th>Last Assessment</th>
              <th>vs Baseline</th>
            </tr>
          </thead>
          <tbody>
            {filteredAthletes.map(athlete => {
              const change = athlete.durabilityScore - athlete.baseline.durabilityScore
              return (
                <tr key={athlete.id} onClick={() => navigate(`/athlete/${athlete.id}`)}>
                  <td>
                    <div className="athlete-cell">
                      <div className="athlete-avatar">{athlete.initials}</div>
                      <div>
                        <div className="athlete-name">{athlete.name}</div>
                        <div className="athlete-team">{athlete.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{athlete.team.name}</td>
                  <td>
                    <span className={`score-badge ${getScoreClass(athlete.durabilityScore)}`}>
                      {athlete.durabilityScore}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {athlete.focusAreas[0]?.region || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {new Date(athlete.lastAssessment).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td>
                    <span className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(change)} pts
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {filteredAthletes.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <h3>No athletes found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
