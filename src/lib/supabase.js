import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://atvnjpwmydhqbxjgczti.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_ANON_KEY is not set — dashboard will use fallback data')
}

export const supabase = (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 0)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null
