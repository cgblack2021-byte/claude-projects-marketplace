import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Log in</h1>
      <AuthForm mode="login" />
      <p className="mt-4 text-sm text-ink/60">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-accent">
          Sign up
        </Link>
      </p>
    </div>
  );
}
