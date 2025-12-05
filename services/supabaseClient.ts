import { createClient } from '@supabase/supabase-js';

// Helper to safely access process.env in browser environments
const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore error
  }
  return '';
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

// Check if valid credentials exist (not empty, not placeholders)
const hasValidConfig = 
  supabaseUrl && 
  supabaseUrl !== '' && 
  supabaseUrl !== 'https://xyzcompany.supabase.co' &&
  supabaseAnonKey && 
  supabaseAnonKey !== '' && 
  supabaseAnonKey !== 'public-anon-key';

export const isSupabaseConfigured = !!hasValidConfig;

let client;

if (hasValidConfig) {
  try {
    // We disable autoRefreshToken and persistSession in this context to avoid
    // 'AuthClient' errors that can occur in some sandboxed/CDN environments.
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
  } catch (error) {
    console.warn("Supabase client failed to initialize (using mock):", error);
  }
}

// Fallback Mock Client to prevent "Cannot read properties of null" crashes in App.tsx
// This object mimics the structure of the Supabase client so calls don't fail, they just return null/error.
if (!client) {
  const mockPromise = async () => ({ data: [], error: null });
  
  // Chainable mock function that returns itself or a promise
  const createMockChain = () => {
    return {
      select: () => ({ eq: createMockChain, ...createMockChain() }),
      insert: mockPromise,
      update: () => ({ eq: mockPromise }),
      delete: () => ({ eq: mockPromise }),
      eq: createMockChain,
      then: (resolve: any) => Promise.resolve({ data: [], error: null }).then(resolve) // Allow await
    };
  };

  client = {
    from: () => createMockChain(),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: "Storage not configured" } }),
        getPublicUrl: () => ({ data: { publicUrl: "" } })
      })
    },
    auth: {
      signInWithPassword: async () => ({ data: null, error: { message: "Auth not configured" } })
    }
  };
}

// Force cast to any to satisfy TS strictness for the mock
export const supabase = client as any;