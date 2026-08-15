import { createBrowserClient } from "@supabase/ssr";

// Not parameterized with the Database generic: our hand-written types
// (src/types/database.ts) describe row shapes for the app to use at call
// sites, but don't match the full generated-schema shape the Supabase
// client's generic inference expects (Views/Functions/Enums/etc.), which
// makes joined/embedded selects resolve to `never`. Cast at call sites
// with the types from "@/types/database" instead.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
