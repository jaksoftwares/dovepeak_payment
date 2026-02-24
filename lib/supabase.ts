import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// During build time, if these are not set, we don't want to crash the build.
// Next.js will often try to pre-render or collect page data.
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Fallback for build time if keys are missing
