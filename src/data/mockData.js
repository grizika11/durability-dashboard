// Mock data matching Durability assessment model
// 7 movements, 5 super metrics, 10 body regions

export const SUPER_METRICS = [
  { id: 'rom', name: 'Range of Motion', abbrev: 'ROM' },
  { id: 'flexibility', name: 'Flexibility', abbrev: 'Flex' },
  { id: 'mobility', name: 'Mobility', abbrev: 'Mob' },
  { id: 'functionalStrength', name: 'Functional Strength', abbrev: 'FS' },
  { id: 'asymmetry', name: 'Asymmetry', abbrev: 'Asym' },
];

export const BODY_REGIONS = [
  { id: 'neck', name: 'Neck' },
  { id: 'shoulders', name: 'Shoulders' },
  { id: 'upperBack', name: 'Upper Back' },
  { id: 'lowerBack', name: 'Lower Back' },
  { id: 'hips', name: 'Hips' },
  { id: 'glutes', name: 'Glutes' },
  { id: 'quadriceps', name: 'Quadriceps' },
  { id: 'hamstrings', name: 'Hamstrings' },
  { id: 'knees', name: 'Knees' },
  { id: 'ankles', name: 'Ankles' },
];

export const MOVEMENTS = [
  { id: 'overheadSquat', name: 'Overhead Squat' },
  { id: 'forwardFold', name: 'Forward Fold' },
  { id: 'pushUp', name: 'Push-Up' },
  { id: 'forwardLunge', name: 'Forward Lunge' },
  { id: 'shoulderAbduction', name: 'Shoulder Abduction' },
  { id: 'shoulderFlexion', name: 'Shoulder Flexion' },
  { id: 'backExtension', name: 'Back Extension' },
];

export const TEAMS = [
  { id: 'team-a', name: 'Academy Squad A' },
  { id: 'team-b', name: 'Academy Squad B' },
  { id: 'pt-clients', name: 'PT Clients' },
  { id: 'military', name: 'Tactical Unit' },
];

// Generate realistic score based on athlete profile
const generateScores = (profile) => {
  const baseScore = profile.baseScore;
  const variance = 15;
  
  const superMetrics = {};
  SUPER_METRICS.forEach(metric => {
    superMetrics[metric.id] = Math.min(100, Math.max(20, 
      baseScore + Math.floor(Math.random() * variance * 2) - variance
    ));
  });
  
  const bodyRegions = {};
  BODY_REGIONS.forEach(region => {
    bodyRegions[region.id] = Math.min(100, Math.max(20,
      baseScore + Math.floor(Math.random() * variance * 2) - variance
    ));
  });
  
  // Apply specific weaknesses
  if (profile.weakAreas) {
    profile.weakAreas.forEach(area => {
      if (bodyRegions[area]) {
        bodyRegions[area] = Math.max(20, bodyRegions[area] - 25);
      }
    });
  }
  
  // Calculate overall from body regions
  const regionScores = Object.values(bodyRegions);
  const overall = Math.round(regionScores.reduce((a, b) => a + b, 0) / regionScores.length);
  
  return { overall, superMetrics, bodyRegions };
};

// Generate focus areas based on low scores
const generateFocusAreas = (bodyRegions) => {
  const sorted = Object.entries(bodyRegions)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 3);
  
  const focusDescriptions = {
    neck: 'Limited cervical mobility affecting overhead positions',
    shoulders: 'Restricted shoulder ROM impacting pressing movements',
    upperBack: 'Thoracic stiffness limiting rotation and extension',
    lowerBack: 'Lumbar mobility constraints affecting hip hinge patterns',
    hips: 'Hip flexor tightness impacting squat depth and stride length',
    glutes: 'Glute activation weakness affecting power generation',
    quadriceps: 'Quad flexibility limiting knee flexion range',
    hamstrings: 'Hamstring tightness restricting forward fold and hip hinge',
    knees: 'Knee tracking issues during loaded movements',
    ankles: 'Ankle dorsiflexion limiting squat depth',
  };
  
  return sorted.map(([regionId, score]) => {
    const region = BODY_REGIONS.find(r => r.id === regionId);
    return {
      region: region.name,
      score,
      description: focusDescriptions[regionId] || 'Area needs attention',
      exercises: ['Mobility drill', 'Activation exercise', 'Strength work'],
    };
  });
};

// Athlete profiles
const athleteProfiles = [
  { id: '1', firstName: 'Marcus', lastName: 'Johnson', team: 'team-a', baseScore: 78, weakAreas: ['ankles', 'hips'] },
  { id: '2', firstName: 'Sarah', lastName: 'Chen', team: 'team-a', baseScore: 85, weakAreas: ['shoulders'] },
  { id: '3', firstName: 'James', lastName: 'Williams', team: 'team-a', baseScore: 62, weakAreas: ['hamstrings', 'lowerBack', 'hips'] },
  { id: '4', firstName: 'Emily', lastName: 'Rodriguez', team: 'team-b', baseScore: 91, weakAreas: [] },
  { id: '5', firstName: 'Michael', lastName: 'Thompson', team: 'team-b', baseScore: 55, weakAreas: ['ankles', 'knees', 'hips'] },
  { id: '6', firstName: 'Jessica', lastName: 'Lee', team: 'team-b', baseScore: 73, weakAreas: ['upperBack', 'shoulders'] },
  { id: '7', firstName: 'David', lastName: 'Martinez', team: 'pt-clients', baseScore: 68, weakAreas: ['lowerBack', 'hamstrings'] },
  { id: '8', firstName: 'Ashley', lastName: 'Brown', team: 'pt-clients', baseScore: 82, weakAreas: ['neck'] },
  { id: '9', firstName: 'Chris', lastName: 'Garcia', team: 'military', baseScore: 76, weakAreas: ['shoulders', 'upperBack'] },
  { id: '10', firstName: 'Amanda', lastName: 'Wilson', team: 'military', baseScore: 88, weakAreas: [] },
  { id: '11', firstName: 'Ryan', lastName: 'Anderson', team: 'military', baseScore: 71, weakAreas: ['ankles', 'hips'] },
  { id: '12', firstName: 'Nicole', lastName: 'Taylor', team: 'pt-clients', baseScore: 59, weakAreas: ['glutes', 'hamstrings', 'lowerBack'] },
];

// Generate full athlete data
export const athletes = athleteProfiles.map(profile => {
  const scores = generateScores(profile);
  const team = TEAMS.find(t => t.id === profile.team);
  
  // Generate baseline (slightly lower) and assessment history
  const baselineScores = generateScores({ ...profile, baseScore: profile.baseScore - 8 });
  
  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    name: `${profile.firstName} ${profile.lastName}`,
    initials: `${profile.firstName[0]}${profile.lastName[0]}`,
    email: `${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}@example.com`,
    team: team,
    
    // Current assessment
    durabilityScore: scores.overall,
    superMetrics: scores.superMetrics,
    bodyRegions: scores.bodyRegions,
    focusAreas: generateFocusAreas(scores.bodyRegions),
    
    // Baseline (first assessment)
    baseline: {
      date: '2024-11-15',
      durabilityScore: baselineScores.overall,
      superMetrics: baselineScores.superMetrics,
      bodyRegions: baselineScores.bodyRegions,
    },
    
    // Assessment history
    assessments: [
      { date: '2024-11-15', score: baselineScores.overall },
      { date: '2024-12-01', score: Math.round((baselineScores.overall + scores.overall) / 2 - 2) },
      { date: '2024-12-15', score: Math.round((baselineScores.overall + scores.overall) / 2 + 3) },
      { date: '2025-01-05', score: scores.overall - 3 },
      { date: '2025-01-20', score: scores.overall },
    ],
    
    lastAssessment: '2025-01-20',
    assessmentCount: 5,
  };
});

// Helper to get score color class
export const getScoreClass = (score) => {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'moderate';
  if (score >= 40) return 'poor';
  return 'critical';
};

// Helper to get score color
export const getScoreColor = (score) => {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#84cc16';
  if (score >= 55) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

// Team summary stats
export const getTeamStats = () => {
  const totalAthletes = athletes.length;
  const avgScore = Math.round(athletes.reduce((sum, a) => sum + a.durabilityScore, 0) / totalAthletes);
  
  const atRisk = athletes.filter(a => a.durabilityScore < 60).length;
  
  const recentAssessments = athletes.filter(a => {
    const lastDate = new Date(a.lastAssessment);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastDate >= weekAgo;
  }).length;
  
  const improved = athletes.filter(a => {
    return a.durabilityScore > a.baseline.durabilityScore;
  }).length;
  
  return {
    totalAthletes,
    avgScore,
    atRisk,
    recentAssessments,
    improved,
    improvedPercent: Math.round((improved / totalAthletes) * 100),
  };
};
