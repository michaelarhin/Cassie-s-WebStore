import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { supabase, type Order } from "@/lib/supabase";

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  region: string;
};

const EMPTY: FormState = {
  email: "", firstName: "", lastName: "", phone: "",
  address: "", address2: "", city: "", region: "",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);

  const shipping = subtotal >= 250 || subtotal === 0 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid =
    form.email.includes("@") &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.region.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    setLoading(true);
    setError(null);

    const order: Omit<Order, "id" | "created_at"> = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || undefined,
      address_line1: form.address.trim(),
      address_line2: form.address2.trim() || undefined,
      city: form.city.trim(),
      region: form.region.trim(),
      country: "Ghana",
      subtotal,
      shipping,
      tax,
      total,
      currency: "GHS",
      items: items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        slug: i.product.slug,
        size: i.size,
        qty: i.qty,
        unit_price: i.product.price,
        line_total: i.product.price * i.qty,
      })),
      status: "pending",
    };

    const { data, error: sbError } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (sbError) {
      setError("We couldn't save your order. Please try again.");
      setLoading(false);
      return;
    }

    setSavedOrder(data as Order);
    clearCart();
    setPlaced(true);
    window.scrollTo({ top: 0 });
    setLoading(false);
  };

  // ── Confirmation screen ────────────────────────────────────────────────────
  if (placed) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Check className="h-8 w-8" strokeWidth={1.5} />
        </motion.div>
        <h1 className="mt-8 font-display text-4xl font-medium">
          Thank you, {form.firstName || "beautiful"}.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/70">
          Your order has been confirmed and saved. A receipt is on its way to{" "}
          <span className="text-foreground">{form.email}</span>. Your pieces
          ship within two business days — pressed, wrapped, and ready.
        </p>
        {savedOrder?.id && (
          <p className="mt-3 text-xs text-foreground/40">
            Order ref: {savedOrder.id.split("-")[0].toUpperCase()}
          </p>
        )}
        <Link
          to="/shop"
          className="mt-10 bg-primary px-10 py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ── Empty bag ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-4xl font-medium">Your bag is empty</h1>
        <p className="mt-4 text-sm text-foreground/60">
          Add a piece to your bag before checking out.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-8 bg-primary px-10 py-4 text-[12px] uppercase tracking-luxe text-primary-foreground"
        >
          Shop the Collection
        </button>
      </div>
    );
  }

  // ── Checkout form ──────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-[12px] uppercase tracking-luxe text-foreground/50 transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Continue shopping
      </Link>
      <h1 className="mt-6 font-display text-4xl font-medium md:text-5xl">
        Checkout
      </h1>

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Contact */}
          <div>
            <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
              Contact
            </h2>
            <div className="mt-3 space-y-4">
              <input
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={set("email")}
                className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
              />
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={form.phone}
                onChange={set("phone")}
                className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
              />
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
              Shipping address
            </h2>
            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="First name"
                  value={form.firstName}
                  onChange={set("firstName")}
                  className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
                />
                <input
                  required
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={set("lastName")}
                  className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
                />
              </div>
              <input
                required
                placeholder="Street address"
                value={form.address}
                onChange={set("address")}
                className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
              />
              <input
                placeholder="Apartment, suite, etc. (optional)"
                value={form.address2}
                onChange={set("address2")}
                className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={set("city")}
                  className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
                />
                <input
                  required
                  placeholder="Region"
                  value={form.region}
                  onChange={set("region")}
                  className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
                />
              </div>
            </div>
          </div>

          {/* Payment placeholder */}
          <div>
            <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
              Payment
            </h2>
            <div className="mt-3 border border-border bg-secondary/50 px-4 py-5 text-sm text-foreground/70">
              Mobile Money, card, and payment gateway options will appear here
              once live payments are connected. Your order will be recorded now.
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={!valid || loading}
            className="w-full bg-primary py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-3"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Placing order…" : `Place Order — ${formatPrice(total)}`}
          </button>
        </form>

        {/* Order summary */}
        <aside className="h-fit border border-border bg-card p-8">
          <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
            Order summary
          </h2>
          <ul className="mt-6 divide-y divide-border">
            {items.map((i) => (
              <li key={`${i.product.id}-${i.size}`} className="flex gap-4 py-4">
                <img
                  src={i.product.image}
                  alt={i.product.name}
                  className="h-20 w-16 object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <p className="font-display text-base leading-tight">
                    {i.product.name}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {i.size} × {i.qty}
                  </p>
                </div>
                <span className="text-sm">{formatPrice(i.product.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2.5 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground/60">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/60">Shipping</dt>
              <dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/60">Estimated tax</dt>
              <dd>{formatPrice(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-base">
              <dt className="font-medium">Total</dt>
              <dd className="font-display text-2xl">{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
