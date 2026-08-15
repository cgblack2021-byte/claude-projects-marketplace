import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use inside Server Components, Route Handlers, and Server Actions.
// In a Server Component, cookie writes are no-ops (Next.js forbids them there);
// the middleware is what actually keeps the session cookie fresh.
//
// Not parameterized with the Database generic — see the comment in
// lib/supabase/client.ts for why; cast at call sites with the types from
// "@/types/database" instead.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // called from a Server Component; middleware handles refresh instead
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // called from a Server Component; middleware handles refresh instead
          }
        },
      },
    }
  );
}
