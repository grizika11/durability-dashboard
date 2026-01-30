// Supabase client stub - replace with real client when ready
// 
// To enable Supabase:
// 1. npm install @supabase/supabase-js
// 2. Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// 3. Uncomment the code below

/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Data helpers
export const getAthletes = async (teamId = null) => {
  let query = supabase
    .from('athletes')
    .select('*, team:teams(*), assessments(*)')
    .order('name')
  
  if (teamId) {
    query = query.eq('team_id', teamId)
  }
  
  const { data, error } = await query
  return { data, error }
}

export const getAthlete = async (id) => {
  const { data, error } = await supabase
    .from('athletes')
    .select('*, team:teams(*), assessments(*)')
    .eq('id', id)
    .single()
  
  return { data, error }
}

export const getTeams = async () => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name')
  
  return { data, error }
}
*/

// Placeholder exports for now
export const supabase = null
export const signIn = async () => ({ data: null, error: 'Not implemented' })
export const signOut = async () => ({ error: null })
export const getSession = async () => null
export const getAthletes = async () => ({ data: [], error: null })
export const getAthlete = async () => ({ data: null, error: null })
export const getTeams = async () => ({ data: [], error: null })
