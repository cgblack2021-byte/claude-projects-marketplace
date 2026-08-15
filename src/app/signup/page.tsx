import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import Logo from "@/components/Logo";

export default function SignupPage() {
  return (
    <div className="-mx-4 -my-10 flex min-h-[calc(100vh-8.5rem)] items-center justify-center bg-hero-mesh px-4 py-16 sm:-mx-6 lg:-mx-8">
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <Logo className="h-9 w-9" />
        <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-ink/50">Sign up to buy and manage your projects.</p>
        <div className="mt-6">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-4 text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
