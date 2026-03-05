import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://atvnjpwmydhqbxjgczti.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dm5qcHdteWRocWJ4amdjenRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NTUxMTAsImV4cCI6MjA3MDAzMTExMH0.9EAsCCf9kC5GreyOXJv0b0K4zH08jT14jaG-omzf2ww'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
