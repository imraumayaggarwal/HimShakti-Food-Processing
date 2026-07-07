"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { Button, Input, Loader } from "../../components/ui";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

type Tone = "premium" | "traditional" | "health-focused";

type Product = {
  id: string;
  name: string;
  ingredients: string;
  weight: string;
  category: string;
  features: string[];
  description?: string;
};

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: "premium", label: "Premium", desc: "Artisanal, aspirational — for gifting and specialty retail" },
  { value: "traditional", label: "Traditional", desc: "Heritage storytelling — rooted in Kumaoni culture" },
  { value: "health-focused", label: "Health-Focused", desc: "Benefit-driven — for health-conscious Amazon buyers" },
];

export default function GeneratePage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [form, setForm] = useState({ productName: "", ingredients: "", weight: "", features: "", tone: "health-focused" as Tone });
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/generate");
    }
  }, [user, authLoading, router]);

  // Fetch live dashboard products to fill up selection list
  useEffect(() => {
    const fetchUserInventory = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API}/api/products`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch {
        console.error("Failed loading inventory maps into dropdown filter selections.");
      }
    };
    if (user && token) fetchUserInventory();
  }, [user, token]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Trigger auto-filling layout parameters on selection change
  const handleSelectProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedProductId(pId);
    
    if (!pId) {
      setForm({ productName: "", ingredients: "", weight: "", features: "", tone: "health-focused" });
      setDescription("");
      return;
    }

    const match = products.find((p) => p.id === pId);
    if (match) {
      setForm({
        productName: match.name,
        ingredients: match.ingredients,
        weight: match.weight,
        features: match.features.join(", "),
        tone: "health-focused"
      });
      setDescription(match.description || "");
    }
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
      toast.error("Failed to generate description text output.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(description);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Copy operation failed.");
    }
  };

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">AI-Powered</p>
          <h1 className="text-4xl font-semibold text-black dark:text-white">Description Generator</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 text-sm max-w-xl">
            Select an existing inventory product layout to instantly process clean optimization metrics.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            {/* Dynamic Dropdown Select Input Mapping */}
            <div>
              <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-1.5">Select Dashboard Product</label>
              <select value={selectedProductId} onChange={handleSelectProductChange}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#356C4C]/30">
                <option value="">-- Choose an item to auto-populate fields --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.weight})</option>
                ))}
              </select>
            </div>

            <Input label="Product Name *" placeholder="Himalayan Millet Flour" value={form.productName} onChange={set("productName")} />
            <Input label="Key Ingredients *" placeholder="Finger millet, Mountain spring water" value={form.ingredients} onChange={set("ingredients")} />
            <Input label="Net Weight / Volume *" placeholder="500g" value={form.weight} onChange={set("weight")} />
            <Input label="Key Features (comma-separated)" placeholder="Gluten-free, Stone-ground, No additives" value={form.features} onChange={set("features")} />

            <div>
              <p className="text-sm font-medium text-black/60 dark:text-white/60 mb-3">Tone</p>
              <div className="grid gap-2">
                {TONES.map((t) => (
                  <label key={t.value}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${form.tone === t.value ? "border-[#356C4C] bg-[#356C4C]/5" : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"}`}>
                    <input type="radio" name="tone" value={t.value} checked={form.tone === t.value}
                      onChange={() => setForm((f) => ({ ...f, tone: t.value }))} className="mt-0.5 accent-[#356C4C]" />
                    <div>
                      <p className={`text-sm font-medium ${form.tone === t.value ? "text-[#356C4C]" : "text-black dark:text-white"}`}>{t.label}</p>
                      <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">{t.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={generate} disabled={loading || !form.productName || !form.ingredients || !form.weight} size="lg">
              {loading ? "Generating…" : description ? "Regenerate" : "Generate Description"}
            </Button>
          </div>

          <div className="flex flex-col">
            <div className="flex-1 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 min-h-[420px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Loader />
                    <p className="text-sm text-black/40 dark:text-white/40 mt-4">Gemini is writing your listing…</p>
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
                      <button onClick={() => setEditing((e) => !e)}
                        className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-black/30 transition-colors">
                        {editing ? "Done" : "Edit"}
                      </button>
                      <button onClick={copy}
                        className="text-xs px-3 py-1.5 rounded-full bg-[#356C4C] text-white hover:bg-[#2a5840] transition-colors">
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    {editing ? (
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-full min-h-[280px] bg-transparent text-black dark:text-white text-base leading-relaxed focus:outline-none resize-none" />
                    ) : (
                      <p className="text-black dark:text-white text-base leading-relaxed">{description}</p>
                    )}
                  </div>

                  <div className="px-6 py-3 border-t border-black/5 dark:border-white/5">
                    <p className="text-xs text-black/30 dark:text-white/30">
                      {description.length} characters
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
                      Choose an inventory selection option to test AI logic tracking templates.
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