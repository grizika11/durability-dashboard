import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Temporary diagnostic — remove after confirming fix
console.log('Supabase env check:', { hasUrl: !!url, hasKey: !!key, urlPrefix: url?.substring(0, 30) })

export const supabase = url && key ? createClient(url, key) : null
