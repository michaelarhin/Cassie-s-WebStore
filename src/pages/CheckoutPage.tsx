import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    zip: "",
  });

  const shipping = subtotal >= 250 || subtotal === 0 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid =
    form.email.includes("@") &&
    form.name.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.zip.trim();

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
          Thank you, {form.name.split(" ")[0] || "beautiful"}.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/70">
          Your order is confirmed and a receipt is on its way to{" "}
          <span className="text-foreground">{form.email}</span>. Your pieces
          ship within two business days — pressed, wrapped, and ready.
        </p>
        <Link
          to="/shop"
          className="mt-10 bg-primary px-10 py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) {
              setPlaced(true);
              clearCart();
              window.scrollTo({ top: 0 });
            }
          }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
              Contact
            </h2>
            <input
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={set("email")}
              className="mt-3 w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
            />
          </div>
          <div>
            <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
              Shipping address
            </h2>
            <div className="mt-3 space-y-4">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={set("name")}
                className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
              />
              <input
                required
                placeholder="Street address"
                value={form.address}
                onChange={set("address")}
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
                  placeholder="ZIP code"
                  value={form.zip}
                  onChange={set("zip")}
                  className="w-full border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors focus:border-foreground"
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
              Payment
            </h2>
            <div className="mt-3 border border-border bg-secondary/50 px-4 py-5 text-sm text-foreground/70">
              Card, Apple Pay and PayPal options appear here once live payments
              are connected. Your order will be recorded as a demonstration
              order for now.
            </div>
          </div>
          <button
            type="submit"
            disabled={!valid}
            className="w-full bg-primary py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Place Order — {formatPrice(total)}
          </button>
        </form>

        <aside className="h-fit border border-border bg-card p-8">
          <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
            Order summary
          </h2>
          <ul className="mt-6 divide-y divide-border">
            {items.map((i) => (
              <li
                key={`${i.product.id}-${i.size}`}
                className="flex gap-4 py-4"
              >
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
                <span className="text-sm">
                  {formatPrice(i.product.price * i.qty)}
                </span>
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
