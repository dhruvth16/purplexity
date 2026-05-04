// supabase.ts
import { createClient } from "@supabase/supabase-js";
import { ENV } from "../src/config/env";

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY);
