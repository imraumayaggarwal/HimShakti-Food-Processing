"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { Button, Input, Loader } from "../../components/ui";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Tone = "premium" | "traditional" | "health-focused";

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: "premium", label: "Premium", desc: "Artisanal, aspirational — for gifting and specialty retail" },
  { value: "traditional", label: "Traditional", desc: "Heritage storytelling — rooted in Kumaoni culture" },
  { value: "health-focused", label: "Health-Focused", desc: "Benefit-driven — for health-conscious Amazon buyers" },
];

const SAMPLE_PRODUCTS = [
  { name: "Himalayan Millet Flour", ingredients: "Finger millet (Ragi)", weight: "500g", features: "Gluten-free, Stone-ground, High calcium" },
  { name: "Kumaoni Apple Pickle", ingredients: "Himalayan apples, Mustard oil, Rock salt", weight: "250g", features: "No preservatives, Traditional recipe, Handmade" },
  { name: "Himalayan Herbal Tea", ingredients: "Tulsi, Brahmi, Ginger, Cardamom", weight: "100g", features: "Caffeine-free, Wildcrafted, Immunity boost" },
];

export default function GeneratePage() {
  const [form, setForm] = useState({
    productName: "", ingredients: "", weight: "", features: "", tone: "health-focused" as Tone,
  });
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const loadSample = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setForm((f) => ({ ...f, productName: sample.name, ingredients: sample.ingredients, weight: sample.weight, features: sample.features }));
    setDescription("");
  };

  const generate = async () => {
    if (!form.productName || !form.ingredients || !form.weight) return;
    setLoading(true);
    setEditing(false);
    try {
      const res = await fetch(`${API}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: form.productName,
          ingredients: form.ingredients,
          weight: form.weight,
          features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
          tone: form.tone,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDescription(data.description);
    } catch {
      toast.error("Failed to generate. Check the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(description);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Copy failed — select and copy manually");
    }
  };

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">AI-Powered</p>
          <h1 className="text-4xl font-semibold text-black dark:text-white">Description Generator</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 text-sm max-w-xl">
            Turn basic product details into keyword-rich Amazon listings in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ── Input Panel ── */}
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Load a sample</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PRODUCTS.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => loadSample(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:border-[#356C4C] hover:text-[#356C4C] transition-colors text-black/60 dark:text-white/60"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <Input label="Product Name *" placeholder="Himalayan Millet Flour" value={form.productName} onChange={set("productName")} />
            <Input label="Key Ingredients *" placeholder="Finger millet, Mountain spring water" value={form.ingredients} onChange={set("ingredients")} />
            <Input label="Net Weight / Volume *" placeholder="500g" value={form.weight} onChange={set("weight")} />
            <Input label="Key Features (comma-separated)" placeholder="Gluten-free, Stone-ground, No additives" value={form.features} onChange={set("features")} />

            <div>
              <p className="text-sm font-medium text-black/60 dark:text-white/60 mb-3">Tone</p>
              <div className="grid gap-2">
                {TONES.map((t) => (
                  <label
                    key={t.value}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      form.tone === t.value
                        ? "border-[#356C4C] bg-[#356C4C]/5"
                        : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={t.value}
                      checked={form.tone === t.value}
                      onChange={() => setForm((f) => ({ ...f, tone: t.value }))}
                      className="mt-0.5 accent-[#356C4C]"
                    />
                    <div>
                      <p className={`text-sm font-medium ${form.tone === t.value ? "text-[#356C4C]" : "text-black dark:text-white"}`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">{t.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={generate}
              disabled={loading || !form.productName || !form.ingredients || !form.weight}
              size="lg"
            >
              {loading ? "Generating…" : description ? "Regenerate" : "Generate Description"}
            </Button>
          </div>

          {/* ── Output Panel ── */}
          <div className="flex flex-col">
            <div className="flex-1 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 min-h-[420px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Loader />
                    <p className="text-sm text-black/40 dark:text-white/40 mt-4">Claude is writing your listing…</p>
                  </div>
                </div>
              ) : description ? (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#356C4C]" />
                      <span className="text-xs text-black/50 dark:text-white/50 uppercase tracking-widest">
                        Generated · {form.tone} · {wordCount} words
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing((e) => !e)}
                        className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-black/30 transition-colors"
                      >
                        {editing ? "Done" : "Edit"}
                      </button>
                      <button
                        onClick={copy}
                        className="text-xs px-3 py-1.5 rounded-full bg-[#356C4C] text-white hover:bg-[#2a5840] transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    {editing ? (
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-full min-h-[280px] bg-transparent text-black dark:text-white text-base leading-relaxed focus:outline-none resize-none"
                      />
                    ) : (
                      <p className="text-black dark:text-white text-base leading-relaxed">{description}</p>
                    )}
                  </div>

                  <div className="px-6 py-3 border-t border-black/5 dark:border-white/5">
                    <p className="text-xs text-black/30 dark:text-white/30">
                      {description.length} characters ·{" "}
                      {description.length <= 2000
                        ? "✓ Within Amazon 2000-char limit"
                        : "⚠ Exceeds Amazon 2000-char limit — trim before listing"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center px-8">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#356C4C]/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-[#356C4C] text-xl">✦</span>
                    </div>
                    <p className="text-black/40 dark:text-white/40 text-sm">
                      Fill in the product details and hit Generate.
                      <br />
                      Your listing will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}