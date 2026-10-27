import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Package, ShoppingBag, Plus, Pencil, Trash2,
  Loader2, ChevronDown, UploadCloud, X, Check, BarChart3, Palette,
} from "lucide-react";
import { supabase, adminSignOut, type DbProduct, type DbProductInsert, type Order } from "@/lib/supabase";
import { formatPrice, CATEGORIES } from "@/data/products";
import type { ColorVariant } from "@/data/products";

// ─── helpers ──────────────────────────────────────────────────────────────────
const SIZES_CLOTHING = ["XS", "S", "M", "L", "XL", "XXL"];
const SIZES_NUMERIC  = ["0", "2", "4", "6", "8", "10", "12"];
const SIZES_SHOES    = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
const SIZES_ONE      = ["One Size"];
const ALL_SIZES      = [...SIZES_CLOTHING, ...SIZES_NUMERIC, ...SIZES_SHOES, ...SIZES_ONE];

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  shipped:   "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyVariant = (): ColorVariant => ({ name: "", hex: "", stock: {} });

type DbProductWithVariants = DbProduct & { variants?: ColorVariant[] };

const emptyForm = (): Omit<DbProductInsert, "image_url"> & { image_url: string; variants: ColorVariant[] } => ({
  name: "", slug: "", category: "Tailoring", price: 0, color: "",
  description: "", details: [], sizes: [], image_url: "",
  featured: false, store: "aura", active: true, variants: [],
});

type Tab = "products" | "orders" | "add" | "sales";

interface SalesTotals {
  total_orders: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
  currency: string;
}

interface SalesDay {
  sale_date: string;
  order_count: number;
  revenue: number;
  avg_order_value: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");

  // products
  const [products, setProducts] = useState<DbProductWithVariants[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<DbProductWithVariants | null>(null);

  // orders
  const [orders, setOrders]       = useState<Order[]>([]);
  const [ordLoading, setOrdLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // form
  const [form, setForm]         = useState(emptyForm());
  const [detailInput, setDetailInput] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [imageFiles, setImageFiles]   = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // variant builder
  const [variantDraft, setVariantDraft] = useState<ColorVariant>(emptyVariant());

  // sales
  const [salesTotals, setSalesTotals] = useState<SalesTotals | null>(null);
  const [salesDays, setSalesDays]     = useState<SalesDay[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setProdLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as DbProductWithVariants[]) ?? []);
    setProdLoading(false);
  };

  const fetchOrders = async () => {
    setOrdLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setOrdLoading(false);
  };

  const fetchSales = async () => {
    setSalesLoading(true);
    const [{ data: totals }, { data: days }] = await Promise.all([
      supabase.from("sales_totals").select("*").single(),
      supabase.from("sales_summary").select("*").limit(30),
    ]);
    setSalesTotals(totals as SalesTotals);
    setSalesDays((days as SalesDay[]) ?? []);
    setSalesLoading(false);
  };

  useEffect(() => { fetchProducts(); fetchOrders(); fetchSales(); }, []);

  // ── sign out ───────────────────────────────────────────────────────────────
  const signOut = async () => { await adminSignOut(); navigate("/admin/login"); };

  // ── image upload ───────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    // reset input so same file can be re-added if needed
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    if (idx === 0) setForm((f) => ({ ...f, image_url: f.images?.[1] ?? "" }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext  = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  };

  // ── variant helpers ────────────────────────────────────────────────────────
  const addVariant = () => {
    if (!variantDraft.name.trim()) return;
    setForm((f) => ({ ...f, variants: [...f.variants, { ...variantDraft }] }));
    setVariantDraft(emptyVariant());
  };

  const removeVariant = (idx: number) =>
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));

  const updateVariantStock = (variantIdx: number, size: string, value: string) => {
    setForm((f) => {
      const variants = f.variants.map((v, i) =>
        i === variantIdx
          ? { ...v, stock: { ...v.stock, [size]: Math.max(0, parseInt(value) || 0) } }
          : v
      );
      return { ...f, variants };
    });
  };

  // ── edit ───────────────────────────────────────────────────────────────────
  const startEdit = (p: DbProductWithVariants) => {
    setEditTarget(p);
    setForm({ ...p, variants: p.variants ?? [] });
    setImagePreviews((p as any).images?.length ? (p as any).images : p.image_url ? [p.image_url] : []);
    setImageFiles([]);
    setFormError(null);
    setFormSuccess(false);
    setTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setImagePreviews([]);
    setImageFiles([]);
    setFormError(null);
    setVariantDraft(emptyVariant());
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      // Upload any new image files
      const uploadedUrls = await Promise.all(imageFiles.map(uploadImage));
      // Combine existing URL previews (not blob:) with newly uploaded
      const existingUrls = imagePreviews.filter((p) => !p.startsWith("blob:"));
      const allImages = [...existingUrls, ...uploadedUrls];
      const image_url = allImages[0] ?? form.image_url;

      // derive color from first variant name if variants exist
      const color = form.variants.length > 0 ? form.variants[0].name : form.color;

      const payload = {
        name:        form.name,
        slug:        form.slug || slugify(form.name),
        category:    form.category,
        price:       Number(form.price),
        color,
        description: form.description,
        details:     form.details,
        sizes:       form.sizes,
        image_url,
        images:      allImages,
        featured:    form.featured,
        store:       form.store,
        active:      form.active,
        variants:    form.variants,
      };

      if (editTarget) {
        const { error } = await supabase.from("products").update(payload).eq("id", editTarget.id);
        if (error) {
          // If images column doesn't exist yet, retry without it
          if (error.message?.includes("images")) {
            const { images: _omit, ...payloadWithout } = payload as typeof payload & { images?: string[] };
            const { error: e2 } = await supabase.from("products").update(payloadWithout).eq("id", editTarget.id);
            if (e2) throw e2;
          } else throw error;
        }
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) {
          // If images column doesn't exist yet, retry without it
          if (error.message?.includes("images")) {
            const { images: _omit, ...payloadWithout } = payload as typeof payload & { images?: string[] };
            const { error: e2 } = await supabase.from("products").insert(payloadWithout);
            if (e2) throw e2;
          } else throw error;
        }
      }

      setFormSuccess(true);
      cancelEdit();
      fetchProducts();
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Check the browser console for details.");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    fetchOrders();
    fetchSales();
  };

  // ────────────────────────────────────────────────────────────────────────────
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

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl gap-0 overflow-x-auto px-6">
          {([
            { id: "products", icon: Package,    label: "Products"  },
            { id: "orders",   icon: ShoppingBag,label: "Orders"    },
            { id: "add",      icon: Plus,        label: editTarget ? "Edit Product" : "Add Product" },
            { id: "sales",    icon: BarChart3,   label: "Sales"     },
          ] as { id: Tab; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id !== "add") cancelEdit(); }}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-[12px] uppercase tracking-luxe transition-colors ${
                tab === id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* ── PRODUCTS ── */}
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
              <div className="rounded border border-dashed border-border py-20 text-center text-muted-foreground">No products yet.</div>
            ) : (
              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/50">
                    <tr>
                      {["Product", "Category", "Price", "Colours", "Store", "Status", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-luxe text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.image_url && <img src={p.image_url} alt={p.name} className="h-12 w-10 object-cover rounded-sm" />}
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.color}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                        <td className="px-4 py-3">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(p.variants ?? []).map((v) => (
                              <span key={v.name} title={v.name} className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px]">
                                {v.hex && <span className="h-2.5 w-2.5 rounded-full border border-foreground/20" style={{ background: v.hex }} />}
                                {v.name}
                              </span>
                            ))}
                            {!p.variants?.length && <span className="text-muted-foreground text-xs">—</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">{p.store}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded px-2 py-0.5 text-[11px] uppercase tracking-wide ${p.active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                            {p.active ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEdit(p)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => deleteProduct(p.id)} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
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

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div>
            <h2 className="mb-6 font-display text-2xl font-medium">All Orders</h2>
            {ordLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : orders.length === 0 ? (
              <div className="rounded border border-dashed border-border py-20 text-center text-muted-foreground">No orders yet.</div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="rounded border border-border bg-card overflow-hidden">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id!)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-mono text-xs text-muted-foreground">#{o.id?.split("-")[0].toUpperCase()}</span>
                        <span className="font-medium">{o.first_name} {o.last_name}</span>
                        <span className="text-sm text-muted-foreground">{o.email}</span>
                        <span className="text-sm font-medium">{formatPrice(o.total)}</span>
                        <span className={`rounded px-2 py-0.5 text-[11px] uppercase tracking-wide ${STATUS_COLORS[o.status] ?? ""}`}>{o.status}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(o.created_at!).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandedOrder === o.id ? "rotate-180" : ""}`} />
                    </button>
                    {expandedOrder === o.id && (
                      <div className="border-t border-border px-5 py-5 space-y-5">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-luxe text-muted-foreground mb-2">Shipping</p>
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
                            {(o.items as unknown as Array<{product_name:string;color?:string;size:string;qty:number;line_total:number}>).map((item, i) => (
                              <li key={i} className="flex justify-between text-sm">
                                <span>{item.product_name}{item.color ? ` — ${item.color}` : ""} · {item.size} × {item.qty}</span>
                                <span>{formatPrice(item.line_total)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 border-t border-border pt-3 flex justify-between text-sm font-medium">
                            <span>Total</span><span>{formatPrice(o.total)}</span>
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

        {/* ── ADD / EDIT ── */}
        {tab === "add" && (
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-medium">{editTarget ? `Editing: ${editTarget.name}` : "Add New Product"}</h2>
              {editTarget && (
                <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" /> Cancel edit
                </button>
              )}
            </div>

            {formSuccess && (
              <div className="mb-5 flex items-center gap-2 rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                <Check className="h-4 w-4" /> Product {editTarget ? "updated" : "added"} successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Product name *</label>
                <input required value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground" />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Slug</label>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-border bg-card px-4 py-3 text-sm text-muted-foreground outline-none focus:border-foreground" />
              </div>

              {/* Category + Store */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Category *</label>
                  <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground">
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                    {["Gift Boxes","Home","Flowers","Stationery"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Store *</label>
                  <select value={form.store} onChange={(e) => setForm((f) => ({ ...f, store: e.target.value as "aura"|"confetti" }))}
                    className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground">
                    <option value="aura">The Corporate Aura</option>
                    <option value="confetti">The Confetti Corner</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Price (GHS) *</label>
                <input type="number" required min="0" step="0.01" value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground" />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full resize-none border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground" />
              </div>

              {/* Details bullets */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Details (bullet points)</label>
                <div className="flex gap-2">
                  <input value={detailInput} onChange={(e) => setDetailInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (detailInput.trim()) { setForm((f) => ({ ...f, details: [...f.details, detailInput.trim()] })); setDetailInput(""); }}}}
                    placeholder="Type and press Enter"
                    className="flex-1 border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground" />
                  <button type="button" onClick={() => { if (detailInput.trim()) { setForm((f) => ({ ...f, details: [...f.details, detailInput.trim()] })); setDetailInput(""); }}}
                    className="border border-border px-4 py-3 text-sm hover:bg-secondary transition-colors">Add</button>
                </div>
                {form.details.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {form.details.map((d, i) => (
                      <li key={i} className="flex items-center justify-between rounded bg-secondary/50 px-3 py-1.5 text-sm">
                        {d}
                        <button type="button" onClick={() => setForm((f) => ({ ...f, details: f.details.filter((_, j) => j !== i) }))} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sizes */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">Available sizes</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => (
                    <button key={s} type="button"
                      onClick={() => setForm((f) => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s] }))}
                      className={`border px-3 py-1.5 text-xs transition-colors ${form.sizes.includes(s) ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── COLOUR VARIANTS ── */}
              <div className="rounded border border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-[11px] uppercase tracking-luxe text-muted-foreground">Colour variants & stock</h3>
                </div>

                {/* Existing variants */}
                {form.variants.length > 0 && (
                  <div className="mb-4 space-y-4">
                    {form.variants.map((v, vi) => (
                      <div key={vi} className="rounded border border-border bg-secondary/30 p-3">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            {v.hex && <span className="h-4 w-4 rounded-full border border-foreground/20 shrink-0" style={{ background: v.hex }} />}
                            <span className="font-medium text-sm">{v.name}</span>
                          </div>
                          <button type="button" onClick={() => removeVariant(vi)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                        </div>
                        {/* Stock per size */}
                        {form.sizes.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {form.sizes.map((s) => (
                              <div key={s} className="flex flex-col items-center gap-1">
                                <label className="text-[10px] uppercase tracking-wide text-muted-foreground">{s}</label>
                                <input
                                  type="number" min="0"
                                  value={v.stock[s] ?? 0}
                                  onChange={(e) => updateVariantStock(vi, s, e.target.value)}
                                  className="w-16 border border-border bg-card px-2 py-1.5 text-center text-sm outline-none focus:border-foreground"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">Select sizes above to set stock quantities.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new variant */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">Colour name</label>
                      <input
                        value={variantDraft.name}
                        onChange={(e) => setVariantDraft((v) => ({ ...v, name: e.target.value }))}
                        placeholder="e.g. Ivory Cream"
                        className="w-full border border-border bg-card px-3 py-2 text-sm outline-none focus:border-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">Hex colour (swatch)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={variantDraft.hex || "#ffffff"}
                          onChange={(e) => setVariantDraft((v) => ({ ...v, hex: e.target.value }))}
                          className="h-10 w-12 cursor-pointer rounded border border-border bg-card p-1"
                        />
                        <input
                          value={variantDraft.hex || ""}
                          onChange={(e) => setVariantDraft((v) => ({ ...v, hex: e.target.value }))}
                          placeholder="#f5f0e8"
                          className="flex-1 border border-border bg-card px-3 py-2 text-sm outline-none focus:border-foreground"
                        />
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={addVariant}
                    className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    <Plus className="h-4 w-4" /> Add colour variant
                  </button>
                </div>
              </div>

              {/* Multi-image upload */}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-luxe text-muted-foreground">
                  Product images <span className="text-muted-foreground/60 normal-case tracking-normal">(first image is primary — drag to reorder)</span>
                </label>

                {/* Preview grid */}
                {imagePreviews.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt={`Image ${i + 1}`} className="h-24 w-20 rounded object-cover border border-border" />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 rounded bg-foreground/70 px-1 py-0.5 text-[9px] uppercase tracking-wide text-background">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add more button */}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded border-2 border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-[10px]">Add</span>
                    </button>
                  </div>
                )}

                {/* Empty state drop zone */}
                {imagePreviews.length === 0 && (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-border px-6 py-8 text-center hover:border-foreground transition-colors"
                  >
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload images</p>
                    <p className="text-xs text-muted-foreground/60">You can select multiple at once</p>
                  </div>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                {[{ key: "featured", label: "Featured on homepage" }, { key: "active", label: "Active (visible in store)" }].map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm">
                    <input type="checkbox" checked={!!form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                      className="h-4 w-4 accent-foreground" />
                    {label}
                  </label>
                ))}
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <button type="submit" disabled={formLoading}
                className="flex w-full items-center justify-center gap-2 bg-primary py-4 text-[12px] uppercase tracking-luxe text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {formLoading ? "Saving…" : editTarget ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        )}

        {/* ── SALES ── */}
        {tab === "sales" && (
          <div>
            <h2 className="mb-6 font-display text-2xl font-medium">Sales Overview</h2>
            {salesLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-8">
                {/* KPI cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Revenue",  value: formatPrice(salesTotals?.total_revenue ?? 0), sub: "excl. cancelled" },
                    { label: "Total Orders",   value: salesTotals?.total_orders ?? 0,                sub: "all time" },
                    { label: "Pending",        value: salesTotals?.pending ?? 0,                     sub: "awaiting action" },
                    { label: "Delivered",      value: salesTotals?.delivered ?? 0,                   sub: "fulfilled" },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="rounded border border-border bg-card p-5">
                      <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">{label}</p>
                      <p className="mt-2 font-display text-3xl font-medium">{value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Status breakdown */}
                <div className="rounded border border-border bg-card p-5">
                  <h3 className="mb-4 text-[11px] uppercase tracking-luxe text-muted-foreground">Order status breakdown</h3>
                  <div className="flex flex-wrap gap-3">
                    {(["pending","confirmed","shipped","delivered","cancelled"] as const).map((s) => (
                      <div key={s} className={`rounded px-3 py-2 text-sm ${STATUS_COLORS[s]}`}>
                        <span className="font-medium capitalize">{s}</span>
                        <span className="ml-2 font-mono">{salesTotals?.[s] ?? 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily sales table */}
                <div>
                  <h3 className="mb-4 text-[11px] uppercase tracking-luxe text-muted-foreground">Daily sales (last 30 days)</h3>
                  {salesDays.length === 0 ? (
                    <div className="rounded border border-dashed border-border py-12 text-center text-muted-foreground">No sales data yet.</div>
                  ) : (
                    <div className="overflow-x-auto rounded border border-border">
                      <table className="w-full text-sm">
                        <thead className="border-b border-border bg-secondary/50">
                          <tr>
                            {["Date", "Orders", "Revenue", "Avg. Order"].map((h) => (
                              <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-luxe text-muted-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {salesDays.map((d) => (
                            <tr key={d.sale_date} className="hover:bg-secondary/30 transition-colors">
                              <td className="px-4 py-3">
                                {new Date(d.sale_date).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td className="px-4 py-3">{d.order_count}</td>
                              <td className="px-4 py-3 font-medium">{formatPrice(d.revenue)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{formatPrice(d.avg_order_value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
