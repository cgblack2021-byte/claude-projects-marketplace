import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin ?? false;
  }

  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Claude Projects
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-ink/70 hover:text-ink">
            Browse
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-ink/70 hover:text-ink">
                  Admin
                </Link>
              )}
              <Link href="/account" className="text-ink/70 hover:text-ink">
                Account
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="btn-secondary">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink/70 hover:text-ink">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
