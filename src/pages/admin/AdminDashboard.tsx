import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Package, ShoppingBag, Plus, Pencil, Trash2,
  Loader2, ChevronDown, UploadCloud, X, Check,
} from "lucide-react";
import { supabase, adminSignOut, type DbProduct, type DbProductInsert, type Order } from "@/lib/supabase";
import { formatPrice } from "@/data/products";
import { CATEGORIES } from "@/data/products";

// ─── helpers ──────────────────────────────────────────────────────────────────
const SIZES_CLOTHING = ["XS", "S", "M", "L", "XL", "XXL"];
const SIZES_NUMERIC  = ["0", "2", "4", "6", "8", "10", "12"];
const SIZES_ONE      = ["One Size"];

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  shipped:   "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─── empty form ───────────────────────────────────────────────────────────────
const emptyForm = (): Omit<DbProductInsert, "image_url"> & { image_url: string } => ({
  name: "", slug: "", category: "Tailoring", price: 0, color: "",
  description: "", details: [], sizes: [], image_url: "",
  featured: false, store: "aura", active: true,
});

type Tab = "products" | "orders" | "add";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");

  // products state
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<DbProduct | null>(null);

  // orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordLoading, setOrdLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState(emptyForm());
  const [detailInput, setDetailInput] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── fetch data ───────────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setProdLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as DbProduct[]) ?? []);
    setProdLoading(false);
  };

  const fetchOrders = async () => {
    setOrdLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setOrdLoading(false);
  };

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  // ── sign out ──────────────────────────────────────────────────────────────────
  const signOut = async () => { await adminSignOut(); navigate("/admin/login"); };

  // ── image upload ─────────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  // ── populate form for editing ─────────────────────────────────────────────────
  const startEdit = (p: DbProduct) => {
    setEditTarget(p);
    setForm({ ...p });
    setImagePreview(p.image_url);
    setImageFile(null);
    setFormError(null);
    setFormSuccess(false);
    setTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setImagePreview("");
    setImageFile(null);
    setFormError(null);
  };

  // ── submit product ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      let image_url = form.image_url;
      if (imageFile) image_url = await uploadImage(imageFile);

      const payload: DbProductInsert = {
        ...form,
        slug: form.slug || slugify(form.name),
        image_url,
        price: Number(form.price),
      };

      if (editTarget) {
        const { error } = await supabase.from("products").update(payload).eq("id", editTarget.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }

      setFormSuccess(true);
      cancelEdit();
      fetchProducts();
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── delete product ────────────────────────────────────────────────────────────
  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // ── update order status ───────────────────────────────────────────────────────
  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    fetchOrders();
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <span className="font-display text-xl font-medium">Admin Dashboard</span>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl gap-0 px-6">
          {([
            { id: "products", icon: Package,     label: "Products" },
            { id: "orders",   icon: ShoppingBag, label: "Orders"   },
            { id: "add",      icon: Plus,        label: editTarget ? "Edit Product" : "Add Product" },
          ] as { id: Tab; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id !== "add") cancelEdit(); }}
              className={`inline-flex items-center gap-2 border-b-2 px-5 py-4 text-[12px] uppercase tracking-luxe transition-colors ${
                tab === id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-medium">All Products</h2>
              <button onClick={() => { cancelEdit(); setTab("add"); }} className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[11px] uppercase tracking-luxe text-primary-foreground hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>

            {prodLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : products.length === 0 ? (
              <div className="rounded border border-dashed border-border py-20 text-center text-muted-foreground">
                No products yet. Add your first one.
              </div>
            ) : (
              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-luxe text-muted-foreground">Product</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-luxe text-muted-foreground">Category</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-luxe text-muted-foreground">Price</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-luxe text-muted-foreground">Store</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-luxe text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-[11px] uppercase tracking-luxe text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.image_url && (
                              <img src={p.image_url} alt={p.name} className="h-12 w-10 object-cover rounded-sm" />
                            )}
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.color}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                        <td className="px-4 py-3">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">{p.store}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded px-2 py-0.5 text-[11px] uppercase tracking-wide ${p.active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                            {p.active ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEdit(p)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Edit">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div>
            <h2 className="mb-6 font-display text-2xl font-medium">All Orders</h2>

            {ordLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : orders.length === 0 ? (
              <div className="rounded border border-dashed border-border py-20 text-center text-muted-foreground">
                No orders yet.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="rounded border border-border bg-card overflow-hidden">
                    {/* Order header */}
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id!)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-mono text-xs text-muted-foreground">#{o.id?.split("-")[0].toUpperCase()}</span>
                        <span className="font-medium">{o.first_name} {o.last_name}</span>
                        <span className="text-sm text-muted-foreground">{o.email}</span>
                        <span className="text-sm font-medium">{formatPrice(o.total)}</span>
                        <span className={`rounded px-2 py-0.5 text-[11px] uppercase tracking-wide ${STATUS_COLORS[o.status] ?? ""}`}>
                          {o.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(o.created_at!).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandedOrder === o.id ? "rotate-180" : ""}`} />
                    </button>

                    {/* Order detail */}
                    {expandedOrder === o.id && (
                      <div className="border-t border-border px-5 py-5 space-y-5">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-luxe text-muted-foreground mb-2">Shipping address</p>
                            <p className="text-sm">{o.first_name} {o.last_name}</p>
                            <p className="text-sm text-muted-foreground">{o.address_line1}{o.address_line2 ? `, ${o.address_line2}` : ""}</p>
                            <p className="text-sm text-muted-foreground">{o.city}, {o.region}, {o.country}</p>
                            {o.phone && <p className="text-sm text-muted-foreground">{o.phone}</p>}
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-luxe text-muted-foreground mb-2">Update status</p>
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.id!, e.target.value as Order["status"])}
                              className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                            >
                              {["pending","confirmed","shipped","delivered","cancelled"].map((s) => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-luxe text-muted-foreground mb-3">Items</p>
                          <ul className="space-y-2">
                            {(o.items as unknown as Array<{product_name:string;size:string;qty:number;line_total:number}>).map((item, i) => (
                              <li key={i} className="flex justify-between text-sm">
                                <span>{item.product_name} — {item.size} × {item.qty}</span>
                                <span>{formatPrice(item.line_total)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 border-t border-border pt-3 flex justify-between text-sm font-medium">
                            <span>Total</span>
                            <span>{formatPrice(o.total)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADD / EDIT PRODUCT TAB ── */}
        {tab === "add" && (
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-medium">
                {editTarget ? `Editing: ${editTarget.name}` : "Add New Product"}
              </h2>
              {editTarget && (
                <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" /> Cancel edit
                </button>
              )}
            </div>

            {formSuccess && (
              <div className="mb-5 flex items-center gap-2 rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                <Check className="h-4 w-4" /> Product {editTarget ? "updated" : "added"} successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Product name *</label>
                <input
                  required value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Slug (auto-generated)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-border bg-card px-4 py-3 text-sm text-muted-foreground outline-none focus:border-foreground"
                />
              </div>

              {/* Category + Store */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Category *</label>
                  <select
                    required value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Gift Boxes">Gift Boxes</option>
                    <option value="Home">Home</option>
                    <option value="Flowers">Flowers</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Store *</label>
                  <select
                    value={form.store}
                    onChange={(e) => setForm((f) => ({ ...f, store: e.target.value as "aura"|"confetti" }))}
                    className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground"
                  >
                    <option value="aura">The Corporate Aura</option>
                    <option value="confetti">The Confetti Corner</option>
                  </select>
                </div>
              </div>

              {/* Price + Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Price (GHS) *</label>
                  <input
                    type="number" required min="0" step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Colour</label>
                  <input
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Description</label>
                <textarea
                  rows={3} value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground resize-none"
                />
              </div>

              {/* Details */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Details (bullet points)</label>
                <div className="flex gap-2">
                  <input
                    value={detailInput}
                    onChange={(e) => setDetailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (detailInput.trim()) {
                          setForm((f) => ({ ...f, details: [...f.details, detailInput.trim()] }));
                          setDetailInput("");
                        }
                      }
                    }}
                    placeholder="Type a detail and press Enter"
                    className="flex-1 border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground"
                  />
                  <button type="button" onClick={() => { if (detailInput.trim()) { setForm((f) => ({ ...f, details: [...f.details, detailInput.trim()] })); setDetailInput(""); }}}
                    className="border border-border px-4 py-3 text-sm hover:bg-secondary transition-colors">
                    Add
                  </button>
                </div>
                {form.details.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {form.details.map((d, i) => (
                      <li key={i} className="flex items-center justify-between rounded bg-secondary/50 px-3 py-1.5 text-sm">
                        {d}
                        <button type="button" onClick={() => setForm((f) => ({ ...f, details: f.details.filter((_, j) => j !== i) }))} className="text-muted-foreground hover:text-destructive">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sizes */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {[...SIZES_CLOTHING, ...SIZES_NUMERIC, ...SIZES_ONE].map((s) => (
                    <button
                      key={s} type="button"
                      onClick={() => setForm((f) => ({
                        ...f,
                        sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
                      }))}
                      className={`border px-3 py-1.5 text-xs transition-colors ${
                        form.sizes.includes(s)
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Product image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-border px-6 py-8 text-center transition-colors hover:border-foreground"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="max-h-40 rounded object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload an image</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {imagePreview && (
                  <button type="button" onClick={() => { setImagePreview(""); setImageFile(null); setForm((f) => ({ ...f, image_url: "" })); }}
                    className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors">
                    Remove image
                  </button>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                {[
                  { key: "featured", label: "Featured on homepage" },
                  { key: "active",   label: "Active (visible in store)" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                      className="h-4 w-4 accent-foreground"
                    />
                    {label}
                  </label>
                ))}
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <button
                type="submit" disabled={formLoading}
                className="flex w-full items-center justify-center gap-2 bg-primary py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {formLoading ? "Saving…" : editTarget ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
