# Durability Coaching Dashboard

React-based coaching dashboard for viewing athlete movement assessments.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Demo Access

Password: `pilot2025`

## Features

- **Athletes List**: View all athletes with scores, filters, and search
- **Athlete Detail**: Full assessment breakdown with Durability Score, super metrics, body regions, and focus areas
- **Team Analytics**: Team comparisons, risk distribution, and body region analysis
- **Progress Tracking**: Baseline vs current comparison, assessment history

## Tech Stack

- React 18
- React Router 6
- Vite
- CSS (custom design system matching mydurability.ai)

## Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with sidebar
├── pages/
│   ├── Login.jsx           # Auth gate
│   ├── Dashboard.jsx       # Athletes list
│   ├── AthleteDetail.jsx   # Individual athlete view
│   └── TeamAnalytics.jsx   # Team overview
├── data/
│   └── mockData.js         # Mock athlete data
├── lib/
│   └── supabase.js         # Supabase client (stub)
├── App.jsx                 # Routes and auth context
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Deploying

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `/dashboard` (if in monorepo)
4. Deploy

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`

### Custom domain

Point `app.mydurability.ai` to your deployment.

## Supabase Integration

When ready to connect to real data:

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create `.env`:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Uncomment the code in `src/lib/supabase.js`

4. Update `App.jsx` to use Supabase Auth instead of demo password

5. Update pages to fetch from Supabase instead of mock data

## Data Model

### Super Metrics (5)
- Range of Motion (ROM)
- Flexibility (Flex)
- Mobility (Mob)
- Functional Strength (FS)
- Asymmetry (Asym)

### Body Regions (10)
- Neck, Shoulders, Upper Back, Lower Back, Hips
- Glutes, Quadriceps, Hamstrings, Knees, Ankles

### Movements (7)
- Overhead Squat, Forward Fold, Push-Up, Forward Lunge
- Shoulder Abduction, Shoulder Flexion, Back Extension
