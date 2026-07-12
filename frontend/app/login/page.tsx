"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Input, Button } from "../../components/ui";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { loginSchema, signupSchema } from "@/utils/schemas";
// ── IMPORT NEXT-AUTH SIGNIN CONTROLLER ───────────────────────────────
import { signIn } from "next-auth/react";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, login, signup, loading } = useAuth();

  const [tab, setTab] = useState<"login" | "signup">(
    searchParams.get("tab") === "signup" ? "signup" : "login"
  );
  const [submitting, setSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", confirm: "" });

  // Already logged in → redirect
  useEffect(() => {
    if (!loading && user) {
      const next = searchParams.get("next") ?? "/dashboard";
      router.replace(next);
    }
  }, [user, loading, router, searchParams]);

  const handleLogin = async () => {
    const validation = loginSchema.safeParse(loginForm);
    if (!validation.success) {
      // FIX: Changed from .errors to Zod-standard .issues array syntax
      toast.error(validation.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      await login(loginForm.email, loginForm.password);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async () => {
    const validation = signupSchema.safeParse(signupForm);
    if (!validation.success) { 
      // FIX: Changed from .errors to Zod-standard .issues array syntax
      toast.error(validation.error.issues[0].message);
      return;
    }

    if (signupForm.password !== signupForm.confirm) {
      toast.error("Passwords don't match");
      return;
    }

    setSubmitting(true);
    try {
      await signup(signupForm.name, signupForm.email, signupForm.password);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#356C4C]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#4A6FA5]/8 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="block mb-8">
          <span className="font-semibold text-black dark:text-white">HimShakti</span>
          <span className="text-black/40 dark:text-white/40 text-sm ml-2">Food Processing</span>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-black/5 dark:bg-white/5 rounded-full p-1">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  tab === t
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                    : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                }`}
              >
                {t === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-black dark:text-white">Welcome back</h2>
                <p className="text-sm text-black/50 dark:text-white/50 mt-1">
                  Sign in to manage your products and generate descriptions.
                </p>
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              />

              <Button
                onClick={handleLogin}
                disabled={submitting}
                size="lg"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </Button>

              {/* ── SEPARATOR INTERFACE DIVIDER ──────────────────────────────── */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-zinc-900 px-2 text-black/40 dark:text-white/40">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="w-full">
                <Button
                  onClick={() => signIn("google")}
                  variant="outline"
                  size="lg"
                >
                  Sign in with Google
                </Button>
              </div>

              <p className="text-center text-sm text-black/50 dark:text-white/50">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setTab("signup")}
                  className="text-[#356C4C] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-black dark:text-white">Create account</h2>
                <p className="text-sm text-black/50 dark:text-white/50 mt-1">
                  Start generating AI-powered product descriptions today.
                </p>
              </div>

              <Input
                label="Full Name"
                placeholder="John Doe"
                value={signupForm.name}
                onChange={(e) => setSignupForm((f) => ({ ...f, name: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={signupForm.email}
                onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                value={signupForm.password}
                onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                value={signupForm.confirm}
                onChange={(e) => setSignupForm((f) => ({ ...f, confirm: e.target.value }))}
              />

              <Button
                onClick={handleSignup}
                disabled={submitting}
                size="lg"
              >
                {submitting ? "Creating account…" : "Create Account"}
              </Button>

              <p className="text-center text-sm text-black/50 dark:text-white/50">
                Already have an account?{" "}
                <button
                  onClick={() => setTab("login")}
                  className="text-[#356C4C] hover:underline"
                >
                  Log in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}