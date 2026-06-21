"use client";

import Navbar from "../../components/Navbar";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-40">
        <h1 className="text-5xl font-semibold mb-10">
          Settings
        </h1>

        <div className="border border-black/10 rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-4">
            Appearance
          </h2>

          <button
            className="border border-black/10 px-6 py-3 rounded-full"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            Toggle Theme
          </button>
        </div>
      </main>
    </>
  );
}