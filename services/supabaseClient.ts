import { createClient } from '@supabase/supabase-js';

// Helper to safely access process.env in browser environments
const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return '';
};

// NOTE: In a real production app, these should be in process.env
// For this environment, we assume the user will configure them or they are injected
const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

// Helper to determine if the URL is a valid configuration or a placeholder/empty
const isValidUrl = (url: string | undefined) => {
  return url && url.length > 0 && url.startsWith('http') && !url.includes('xyzcompany');
};

export const isSupabaseConfigured = isValidUrl(supabaseUrl) && !!supabaseAnonKey;

// Mock client to prevent crashes when config is missing
// This ensures the 'AuthClient' error doesn't happen during initialization
const createMockClient = () => {
  const mockFn = () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
  
  // Mock a filter builder that allows chaining (.eq, .single, etc.)
  const mockBuilder = {
    eq: () => mockBuilder,
    single: () => mockBuilder,
    order: () => mockBuilder,
    limit: () => mockBuilder,
    then: (resolve: any) => resolve({ data: [], error: null }) // Resolve with empty data
  };

  const mockFrom = () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Mock: Config missing' } }),
    update: () => mockBuilder,
    delete: () => mockBuilder,
  });

  return {
    from: mockFrom,
    storage: {
      from: () => ({
        upload: mockFn,
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    auth: {
        signInWithPassword: mockFn,
        signOut: mockFn,
        getSession: mockFn
    }
  } as any;
};

// Only initialize the real client if configuration is valid.
// Otherwise, use the mock client to allow the app to render in "offline/demo" mode.
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!) 
  : createMockClient();