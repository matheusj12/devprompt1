import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Only create client if both URL and key are provided
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: typeof window !== 'undefined' ? localStorage : undefined,
            persistSession: true,
            autoRefreshToken: true,
        }
    })
    : null;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
