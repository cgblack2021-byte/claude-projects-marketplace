import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import Logo from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="-mx-4 -my-10 flex min-h-[calc(100vh-8.5rem)] items-center justify-center bg-hero-mesh px-4 py-16 sm:-mx-6 lg:-mx-8">
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <Logo className="h-9 w-9" />
        <h1 className="mt-4 text-2xl font-bold">Log in</h1>
        <p className="mt-1 text-sm text-ink/50">Welcome back.</p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <p className="mt-4 text-sm text-ink/60">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
