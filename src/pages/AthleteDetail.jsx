import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { athletes, SUPER_METRICS, BODY_REGIONS, getScoreClass, getScoreColor } from '../data/mockData'

function ScoreRing({ score, size = 160, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)
  
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="score-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="score-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={color}
        />
      </svg>
      <div className="score-ring-value">
        <div className="score-ring-number" style={{ color }}>{score}</div>
        <div className="score-ring-label">Durability Score</div>
      </div>
    </div>
  )
}

function AthleteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  
  const athlete = athletes.find(a => a.id === id)
  
  if (!athlete) {
    return (
      <div>
        <Link to="/" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
          Back to Athletes
        </Link>
        <div className="empty-state">
          <h3>Athlete not found</h3>
        </div>
      </div>
    )
  }
  
  const change = athlete.durabilityScore - athlete.baseline.durabilityScore
  
  return (
    <div>
      {/* Back link */}
      <Link to="/" className="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12,19 5,12 12,5"/>
        </svg>
        Back to Athletes
      </Link>
      
      {/* Header */}
      <div className="detail-header">
        <div className="detail-avatar">{athlete.initials}</div>
        <div className="detail-info">
          <h1>{athlete.name}</h1>
          <div className="detail-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              {athlete.team.name}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {athlete.assessmentCount} assessments
            </span>
            <span>
              Last: {new Date(athlete.lastAssessment).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className={`score-badge ${getScoreClass(athlete.durabilityScore)}`} style={{ fontSize: '1.25rem', padding: '10px 20px' }}>
            {athlete.durabilityScore}
          </span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </button>
        <button 
          className={`tab ${activeTab === 'focus' ? 'active' : ''}`}
          onClick={() => setActiveTab('focus')}
        >
          Focus Areas
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid-3">
          {/* Score Ring */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Durability Score</div>
              <span className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)} vs baseline
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
              <ScoreRing score={athlete.durabilityScore} />
            </div>
          </div>
          
          {/* Super Metrics */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Super Metrics</div>
            </div>
            <div className="super-metrics">
              {SUPER_METRICS.map(metric => {
                const score = athlete.superMetrics[metric.id]
                const color = getScoreColor(score)
                return (
                  <div key={metric.id} className="super-metric">
                    <div className="super-metric-label">{metric.name}</div>
                    <div className="super-metric-bar">
                      <div 
                        className="super-metric-fill" 
                        style={{ width: `${score}%`, background: color }}
                      />
                    </div>
                    <div className="super-metric-value" style={{ color }}>{score}</div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Body Regions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Body Regions</div>
            </div>
            <div className="body-regions-grid">
              {BODY_REGIONS.map(region => {
                const score = athlete.bodyRegions[region.id]
                const color = getScoreColor(score)
                return (
                  <div key={region.id} className="body-region">
                    <span className="body-region-name">{region.name}</span>
                    <span className="body-region-score" style={{ color }}>{score}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="grid-2">
          {/* Progress Chart Placeholder */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Score History</div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-dot baseline"></div>
                  Baseline
                </div>
                <div className="legend-item">
                  <div className="legend-dot current"></div>
                  Current
                </div>
              </div>
            </div>
            <div style={{ padding: '24px 0' }}>
              {/* Simple bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', justifyContent: 'center' }}>
                {athlete.assessments.map((assessment, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: `${assessment.score * 1.8}px`,
                        background: idx === athlete.assessments.length - 1 ? 'var(--lime-dark)' : 'var(--card-border)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Baseline Comparison */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Baseline vs Current</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {BODY_REGIONS.slice(0, 6).map(region => {
                const baseline = athlete.baseline.bodyRegions[region.id]
                const current = athlete.bodyRegions[region.id]
                const diff = current - baseline
                return (
                  <div key={region.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '100px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {region.name}
                    </span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '30px', textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                        {baseline}
                      </span>
                      <div style={{ flex: 1, height: '4px', background: 'var(--card-border)', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ 
                          position: 'absolute',
                          left: `${baseline}%`,
                          width: `${Math.abs(diff)}%`,
                          height: '100%',
                          background: diff >= 0 ? 'var(--score-excellent)' : 'var(--score-critical)',
                          borderRadius: '2px',
                          marginLeft: diff < 0 ? `-${Math.abs(diff)}%` : 0,
                        }} />
                      </div>
                      <span style={{ width: '30px', fontSize: '0.875rem', fontWeight: 600, color: getScoreColor(current) }}>
                        {current}
                      </span>
                    </div>
                    <span className={`stat-change ${diff >= 0 ? 'positive' : 'negative'}`} style={{ width: '50px', textAlign: 'right' }}>
                      {diff >= 0 ? '+' : ''}{diff}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Focus Areas Tab */}
      {activeTab === 'focus' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Priority Focus Areas</div>
              <div className="card-subtitle">Based on lowest scoring regions</div>
            </div>
            <div className="focus-areas">
              {athlete.focusAreas.map((area, idx) => (
                <div key={idx} className="focus-area">
                  <div className="focus-area-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div className="focus-area-content">
                    <div className="focus-area-title">
                      {area.region} 
                      <span className={`score-badge ${getScoreClass(area.score)}`} style={{ marginLeft: '8px', fontSize: '0.75rem', padding: '2px 8px' }}>
                        {area.score}
                      </span>
                    </div>
                    <div className="focus-area-description">{area.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recommended Exercises</div>
              <div className="card-subtitle">Based on focus areas</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {athlete.focusAreas.map((area, idx) => (
                <div key={idx} style={{ padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>{area.region}</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                    {area.exercises.map((ex, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AthleteDetail
