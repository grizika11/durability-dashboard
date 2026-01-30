import { useMemo } from 'react'
import { athletes, TEAMS, BODY_REGIONS, getScoreClass, getScoreColor } from '../data/mockData'

function TeamAnalytics() {
  const teamStats = useMemo(() => {
    return TEAMS.map(team => {
      const teamAthletes = athletes.filter(a => a.team.id === team.id)
      const avgScore = teamAthletes.length 
        ? Math.round(teamAthletes.reduce((sum, a) => sum + a.durabilityScore, 0) / teamAthletes.length)
        : 0
      const atRisk = teamAthletes.filter(a => a.durabilityScore < 60).length
      const improved = teamAthletes.filter(a => a.durabilityScore > a.baseline.durabilityScore).length
      
      return {
        ...team,
        athleteCount: teamAthletes.length,
        avgScore,
        atRisk,
        improved,
        athletes: teamAthletes,
      }
    })
  }, [])
  
  const bodyRegionStats = useMemo(() => {
    return BODY_REGIONS.map(region => {
      const scores = athletes.map(a => a.bodyRegions[region.id])
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      const lowest = Math.min(...scores)
      const highest = Math.max(...scores)
      return { ...region, avg, lowest, highest }
    }).sort((a, b) => a.avg - b.avg)
  }, [])
  
  const overallAvg = Math.round(athletes.reduce((sum, a) => sum + a.durabilityScore, 0) / athletes.length)
  const totalAtRisk = athletes.filter(a => a.durabilityScore < 60).length
  const totalImproved = athletes.filter(a => a.durabilityScore > a.baseline.durabilityScore).length
  
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1>Team Analytics</h1>
        <p>Overview of movement quality across all teams</p>
      </div>
      
      {/* Overall Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Athletes</div>
          <div className="stat-value">{athletes.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overall Average</div>
          <div className="stat-value" style={{ color: getScoreColor(overallAvg) }}>{overallAvg}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">At Risk (&lt;60)</div>
          <div className="stat-value" style={{ color: totalAtRisk > 0 ? 'var(--score-poor)' : 'inherit' }}>
            {totalAtRisk}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Improved vs Baseline</div>
          <div className="stat-value">
            {totalImproved}
            <span className="stat-change positive" style={{ marginLeft: '8px', fontSize: '0.875rem' }}>
              ({Math.round((totalImproved / athletes.length) * 100)}%)
            </span>
          </div>
        </div>
      </div>
      
      {/* Team Breakdown */}
      <div className="grid-2 mb-8">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Team Comparison</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {teamStats.map(team => (
              <div key={team.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '140px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{team.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {team.athleteCount} athletes
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    height: '24px', 
                    background: 'var(--bg)', 
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${team.avgScore}%`,
                      height: '100%',
                      background: getScoreColor(team.avgScore),
                      borderRadius: 'var(--radius-sm)',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
                <div style={{ width: '50px', textAlign: 'right' }}>
                  <span className={`score-badge ${getScoreClass(team.avgScore)}`}>
                    {team.avgScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Risk Distribution</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {teamStats.map(team => (
              <div key={team.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{ fontWeight: 500 }}>{team.name}</span>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--score-critical)', fontWeight: 600 }}>{team.atRisk}</span> at risk
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--score-excellent)', fontWeight: 600 }}>{team.improved}</span> improved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Body Region Analysis */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Body Region Analysis</div>
          <div className="card-subtitle">Average scores across all athletes (sorted by lowest)</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {bodyRegionStats.map((region, idx) => (
            <div key={region.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              padding: '16px',
              background: idx < 3 ? 'rgba(249, 115, 22, 0.05)' : 'var(--bg)',
              border: idx < 3 ? '1px solid rgba(249, 115, 22, 0.2)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: getScoreColor(region.avg) + '20',
                borderRadius: 'var(--radius-sm)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: getScoreColor(region.avg),
              }}>
                {region.avg}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{region.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Range: {region.lowest} – {region.highest}
                </div>
              </div>
              {idx < 3 && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--score-poor)',
                  fontWeight: 600,
                  padding: '4px 8px',
                  background: 'rgba(249, 115, 22, 0.1)',
                  borderRadius: 'var(--radius-full)',
                }}>
                  Focus area
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Score Distribution */}
      <div className="card mt-6">
        <div className="card-header">
          <div className="card-title">Score Distribution</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '200px', padding: '24px 0', justifyContent: 'center' }}>
          {[
            { label: '90+', min: 90, max: 100, color: 'var(--score-excellent)' },
            { label: '80-89', min: 80, max: 89, color: 'var(--score-good)' },
            { label: '70-79', min: 70, max: 79, color: 'var(--score-good)' },
            { label: '60-69', min: 60, max: 69, color: 'var(--score-moderate)' },
            { label: '50-59', min: 50, max: 59, color: 'var(--score-poor)' },
            { label: '<50', min: 0, max: 49, color: 'var(--score-critical)' },
          ].map(bucket => {
            const count = athletes.filter(a => a.durabilityScore >= bucket.min && a.durabilityScore <= bucket.max).length
            const height = count > 0 ? Math.max(40, count * 30) : 10
            return (
              <div key={bucket.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{count}</span>
                <div style={{
                  width: '60px',
                  height: `${height}px`,
                  background: bucket.color,
                  borderRadius: '4px 4px 0 0',
                  opacity: count > 0 ? 1 : 0.3,
                }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bucket.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TeamAnalytics
