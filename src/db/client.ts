import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
export const supabase = createClient(
  'https://yucyhkpmrdbucitpovyj.supabase.co',
  // This is an unauthenticated key, so it's safe to expose.
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1Y3loa3BtcmRidWNpdHBvdnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAyMDQyNDcsImV4cCI6MjAzNTc4MDI0N30.t5isXFR9-AgiZUQ5g45a7O2pXlds4S8Y7LulYi7bOio'
)
