"use client";

import { useAuth } from "./AuthProvider";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <nav className="group overflow-hidden w-[180px] hover:w-[760px] transition-all duration-500 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl px-8 py-4 flex items-center shadow-sm hover:shadow-lg">
        <Link href="/" className="font-semibold whitespace-nowrap tracking-tight text-black dark:text-white">
          HimShakti
        </Link>

        <div className="ml-auto flex items-center gap-6 opacity-0 translate-x-8 transition-all duration-300 delay-150 group-hover:opacity-100 group-hover:translate-x-0 text-black dark:text-white whitespace-nowrap">
          <Link href="/" className="text-sm hover:text-[#356C4C] transition-colors">
            Home
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-[#356C4C] transition-colors">
                Dashboard
              </Link>
              <Link href="/generate" className="text-sm hover:text-[#356C4C] transition-colors">
                Generate
              </Link>
              <span className="text-sm text-black/40 dark:text-white/40">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:border-red-300 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:text-[#356C4C] transition-colors">
                Login
              </Link>
              <Link
                href="/login?tab=signup"
                className="text-sm hover:text-[#356C4C] transition-colors py-4"
              >
                Sign Up
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}