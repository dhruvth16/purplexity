import { createClient } from "@supabase/supabase-js";

const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
const processEnv =
  typeof process !== "undefined" && process?.env
    ? (process.env as Record<string, string | undefined>)
    : undefined;

const SUPABASE_URL =
  env?.BUN_PUBLIC_SUPABASE_URL ?? processEnv?.BUN_PUBLIC_SUPABASE_URL;

const SUPABASE_PUBLISHABLE_KEY =
  env?.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  processEnv?.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!);
