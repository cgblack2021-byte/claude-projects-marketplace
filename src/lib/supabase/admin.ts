import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client that bypasses RLS with the service-role key.
// Never import this from a Client Component or expose it to the browser.
// Not parameterized with the Database generic — see lib/supabase/client.ts.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
