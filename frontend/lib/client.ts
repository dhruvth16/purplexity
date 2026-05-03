import { createClient } from "@supabase/supabase-js";

const isSupabaseConfigured = !!(
  process.env.BUN_PUBLIC_SUPABASE_URL &&
  process.env.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

let supabase: ReturnType<typeof createClient> | any;

if (!isSupabaseConfigured) {
  // Don't throw here to avoid crashing the entire app during development.
  // Provide a minimal fake supabase client so the UI can render and show
  // a helpful banner. Components can check `isSupabaseConfigured`.
  console.warn(
    "frontend warning: Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or BUN_PUBLIC_* equivalents).",
  );

  const fakeSupabase = {
    auth: {
      async getUser() {
        return { data: { user: null } };
      },
      async getSession() {
        return { data: { session: null } };
      },
      async signInWithOAuth() {
        return { data: null, error: { message: "Supabase not configured" } };
      },
      async signOut() {
        return { error: null };
      },
    },
  } as const;

  supabase = fakeSupabase;
} else {
  supabase = createClient(
    process.env.BUN_PUBLIC_SUPABASE_URL!,
    process.env.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export { supabase, isSupabaseConfigured };
