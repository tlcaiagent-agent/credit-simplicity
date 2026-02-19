import { createClient } from '@supabase/supabase-js'
import { isDemoMode } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Server-side client with service role (bypasses RLS) — use only in API routes
export function getServiceClient() {
  if (isDemoMode || !serviceRoleKey || serviceRoleKey.includes('placeholder')) {
    return null
  }
  return createClient(supabaseUrl, serviceRoleKey)
}
