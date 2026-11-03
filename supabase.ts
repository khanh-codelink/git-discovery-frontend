import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/^["']|["']$/g, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim().replace(/^["']|["']$/g, '');

if (!supabaseUrl) {
	throw new Error('VITE_SUPABASE_URL is required.')
}

if (!supabaseAnonKey) {
	throw new Error('VITE_SUPABASE_ANON_KEY is required.')
}

let parsedSupabaseUrl: URL

try {
	parsedSupabaseUrl = new URL(supabaseUrl)
} catch {
	throw new Error('VITE_SUPABASE_URL must be a valid URL.')
}

if (parsedSupabaseUrl.protocol !== 'https:' && parsedSupabaseUrl.protocol !== 'http:') {
	throw new Error('VITE_SUPABASE_URL must use HTTP or HTTPS.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)