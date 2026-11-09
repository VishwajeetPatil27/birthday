import { createClient } from '@supabase/supabase-js';

// Precedence: Vite env vars -> localStorage overrides (configured via in-app UI)
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? (localStorage.getItem('supabase_custom_url') || '') : '';
  const localKey = typeof window !== 'undefined' ? (localStorage.getItem('supabase_custom_key') || '') : '';

  const url = (localUrl && localUrl.trim()) ? localUrl.trim() : envUrl.trim();
  const anonKey = (localKey && localKey.trim()) ? localKey.trim() : envKey.trim();

  return { url, anonKey, hasCustomOverride: Boolean(localUrl) };
};

let supabaseInstance = null;
let currentUrl = '';
let currentKey = '';

export const getSupabase = () => {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return null;
  }

  // Re-create instance only if configuration changed
  if (!supabaseInstance || currentUrl !== url || currentKey !== anonKey) {
    currentUrl = url;
    currentKey = anonKey;
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return supabaseInstance;
};

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
};

export const setSupabaseCredentials = (url, anonKey) => {
  if (url && anonKey) {
    localStorage.setItem('supabase_custom_url', url.trim());
    localStorage.setItem('supabase_custom_key', anonKey.trim());
  } else {
    localStorage.removeItem('supabase_custom_url');
    localStorage.removeItem('supabase_custom_key');
  }
  supabaseInstance = null; // force re-init
};

export const testSupabaseConnection = async () => {
  const client = getSupabase();
  if (!client) {
    return { ok: false, error: 'Supabase URL or Anon Key is missing.' };
  }

  try {
    // Attempt a light ping by querying the table (with limit 1)
    const { data, error } = await client
      .from('birthday_experiences')
      .select('id')
      .limit(1);

    if (error) {
      // If table doesn't exist yet, but credentials work
      if (error.code === '42P01') {
        return {
          ok: false,
          needsTable: true,
          error: 'Connected to Supabase! However, the "birthday_experiences" table does not exist yet. Please run the SQL setup script.',
        };
      }
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error reaching Supabase.' };
  }
};
