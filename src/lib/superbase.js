import { createClient } from "@supabase/supabase-js";

export const superbase = createClient(
  import.meta.env.VITE_SUPERBASE_URL,
  import.meta.env.VITE_SUPERBASE_KEY,
);
