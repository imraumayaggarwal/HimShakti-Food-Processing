"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { Button, Input, Loader } from "../../components/ui";

type Product = {
  id: string;
  name: string;
  ingredients: string;
  weight: string;
  category: string;
  features: string[];
  description?: string;
  tone?: string;
  price?: number;
  stock?: number;
  created_at: string;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const CATEGORY_COLORS: Record<string, string> = {
  flour:  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  pickle: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  tea:    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  juice:  "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  snack:  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  other:  "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl p-6">
      <p className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">{label}</p>
      <p className="text-4xl font-semibold text-black dark:text-white">{value}</p>
      {sub && <p className="text-sm text-black/50 dark:text-white/50 mt-1">{sub}</p>}
    </div>
  );
}

function ProductCard({ product, onDelete, onEditClick }: { product: Product; onDelete: (id: string) => void; onEditClick: (p: Product) => void }) {
  const catColor = CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS.other;
  return (
    <div onClick={() => onEditClick(product)} className="cursor-pointer bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white leading-tight">{product.name}</h3>
          <p className="text-sm text-black/50 dark:text-white/50 mt-0.5">{product.weight}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize whitespace-nowrap ${catColor}`}>
          {product.category}
        </span>
      </div>

      {product.description && (
        <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed line-clamp-3">
          {product.description}
        </p>
      )}

      {product.features.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {product.features.slice(0, 3).map((f) => (
            <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60">
              {f}
            </span>
          ))}
          {product.features.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40">
              +{product.features.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 mt-auto">
        <div className="flex gap-4">
          {product.price != null && <span className="text-sm font-semibold text-[#356C4C]">₹{product.price}</span>}
          {product.stock != null && <span className="text-sm text-black/40 dark:text-white/40">{product.stock} in stock</span>}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Avoid opening the edit modal concurrently
            onDelete(product.id);
          }}
          className="text-xs text-red-400 hover:text-red-600 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function AddProductModal({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (p: Omit<Product, "id" | "created_at">) => Promise<void>;
}) {
  const [form, setForm] = useState({ name: "", ingredients: "", weight: "", category: "other", features: "", price: "", stock: "", description: "" });
  const [saving, setSaving] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.ingredients || !form.weight) return;
    setSaving(true);
    await onAdd({
      name: form.name, ingredients: form.ingredients, weight: form.weight,
      category: form.category,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
      price: form.price ? parseFloat(form.price) : undefined,
      stock: form.stock ? parseInt(form.stock) : 0,
      description: form.description || undefined,
    });
    setSaving(false);
    setForm({ name: "", ingredients: "", weight: "", category: "other", features: "", price: "", stock: "", description: "" });
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Add Product</h2>
        <div className="space-y-4">
          <Input label="Product Name *" placeholder="Himalayan Honey" value={form.name} onChange={set("name")} />
          <Input label="Ingredients *" placeholder="Raw honey, wildflowers" value={form.ingredients} onChange={set("ingredients")} />
          <Input label="Weight / Volume *" placeholder="500g" value={form.weight} onChange={set("weight")} />
          <div>
            <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-1.5">Category</label>
            <select value={form.category} onChange={set("category")} className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#356C4C]/30">
              {["flour", "pickle", "tea", "juice", "snack", "other"].map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <Input label="Key Features (comma-separated)" placeholder="Gluten-free, No preservatives" value={form.features} onChange={set("features")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹)" placeholder="150" value={form.price} onChange={set("price")} />
            <Input label="Stock (units)" placeholder="50" value={form.stock} onChange={set("stock")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-1.5">Description (optional)</label>
            <textarea value={form.description} onChange={set("description")} placeholder="Leave blank — generate it with AI" rows={3}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#356C4C]/30 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white text-sm hover:bg-black/5 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !form.name || !form.ingredients || !form.weight}
            className="flex-1 py-3 rounded-full bg-[#356C4C] text-white text-sm font-medium hover:bg-[#2a5840] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {saving ? "Adding…" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EDIT PRODUCT MODAL COMPONENT ─────────────────────────────────────────────
function EditProductModal({
  open, onClose, product, onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (id: string, updatedData: Partial<Product>) => Promise<void>;
}) {
  const [form, setForm] = useState({ name: "", ingredients: "", weight: "", category: "other", features: "", price: "", stock: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        ingredients: product.ingredients,
        weight: product.weight,
        category: product.category,
        features: product.features.join(", "),
        price: product.price ? product.price.toString() : "",
        stock: product.stock ? product.stock.toString() : "0",
        description: product.description || "",
      });
    }
  }, [product]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!product || !form.name || !form.ingredients || !form.weight) return;
    setSaving(true);
    await onUpdate(product.id, {
      name: form.name,
      ingredients: form.ingredients,
      weight: form.weight,
      category: form.category,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
      price: form.price ? parseFloat(form.price) : undefined,
      stock: form.stock ? parseInt(form.stock) : 0,
      description: form.description || undefined,
    });
    setSaving(false);
    onClose();
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Modify Product Details</h2>
        <div className="space-y-4">
          <Input label="Product Name *" value={form.name} onChange={set("name")} />
          <Input label="Ingredients *" value={form.ingredients} onChange={set("ingredients")} />
          <Input label="Weight / Volume *" value={form.weight} onChange={set("weight")} />
          <div>
            <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-1.5">Category</label>
            <select value={form.category} onChange={set("category")} className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#356C4C]/30">
              {["flour", "pickle", "tea", "juice", "snack", "other"].map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <Input label="Key Features (comma-separated)" value={form.features} onChange={set("features")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹)" value={form.price} onChange={set("price")} />
            <Input label="Stock (units)" value={form.stock} onChange={set("stock")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={3}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#356C4C]/30 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white text-sm hover:bg-black/5 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !form.name || !form.ingredients || !form.weight}
            className="flex-1 py-3 rounded-full bg-[#356C4C] text-white text-sm font-medium hover:bg-[#2a5840] transition-colors">
            {saving ? "Saving Updates…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/dashboard");
    }
  }, [user, authLoading, router]);

  const fetchProducts = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/products`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setError("Failed to sync data with the backend API pipeline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) fetchProducts();
  }, [user, token]);

  const handleAdd = async (product: Omit<Product, "id" | "created_at">) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
      toast.success("Product added successfully");
    } catch {
      toast.error("Failed to add product");
    }
  };

  // PUT update function handler logic
  const handleUpdate = async (id: string, updatedData: Partial<Product>) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => p.id === id ? updated : p));
      toast.success("Product updated successfully!");
    } catch {
      toast.error("Failed to execute database entity updates.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status !== 204) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product removed");
    } catch {
      toast.error("Failed to remove product");
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowEdit(true);
  };

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const totalStock = products.reduce((s, p) => s + (p.stock ?? 0), 0);
  const totalValue = products.reduce((s, p) => s + (p.price ?? 0) * (p.stock ?? 0), 0);

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-black dark:text-white">Dashboard</h1>
            <p className="text-black/50 dark:text-white/50 mt-1 text-sm">
              Welcome back, {user?.name}. Manage your products and inventory.
            </p>
          </div>
          <Button onClick={() => setShowAdd(true)}>+ Add Product</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Products" value={products.length} />
          <StatCard label="Total Stock" value={totalStock} sub="units" />
          <StatCard label="Inventory Value" value={`₹${totalValue.toLocaleString("en-IN")}`} />
          <StatCard label="Categories" value={categories.length - 1} sub="product types" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1">
            <input type="text" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-black dark:text-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#356C4C]/30" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${categoryFilter === cat ? "bg-[#356C4C] text-white" : "border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchProducts}>Retry</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-black/40 dark:text-white/40 text-lg">
              {search || categoryFilter !== "all" ? "No products match your search." : "No products yet — add your first one!"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} onDelete={handleDelete} onEditClick={handleEditClick} />)}
          </div>
        )}
      </main>

      <AddProductModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      
      {/* Edit Modal Binder Interface */}
      <EditProductModal open={showEdit} onClose={() => setShowEdit(false)} product={selectedProduct} onUpdate={handleUpdate} />
    </>
  );
}