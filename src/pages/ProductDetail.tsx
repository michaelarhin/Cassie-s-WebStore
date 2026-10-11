import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import NotFound from "@/pages/NotFound";
import ProductCard from "@/components/ProductCard";
import { findProduct, formatPrice, storeProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = slug ? findProduct(slug) : undefined;
  const { addItem } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);

  if (!product) return <NotFound />;

  const related = storeProducts(product)
    .filter((p) => p.id !== product.id)
    .sort((a, b) =>
      a.category === product.category ? -1 : b.category === product.category ? 1 : 0
    )
    .slice(0, 4);

  const handleAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    setError(false);
    addItem(product, size, qty);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-[12px] uppercase tracking-luxe text-foreground/50 transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden bg-muted"
        >
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover"
            width={1024}
            height={1280}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-xl tracking-wide">{formatPrice(product.price)}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Colour · {product.color}
          </p>

          <p className="mt-8 max-w-lg leading-relaxed text-foreground/75">
            {product.description}
          </p>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-luxe text-foreground/60">
                Select size
              </span>
              {error && (
                <span className="text-xs text-destructive">
                  Please choose a size
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    setError(false);
                  }}
                  className={`min-w-[3.5rem] border px-4 py-3 text-sm transition-colors ${
                    size === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-stretch gap-4">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-4 text-foreground/60 hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-4 text-foreground/60 hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 bg-primary text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
            >
              Add to Bag — {formatPrice(product.price * qty)}
            </button>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">
              Details
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/70">
              {product.details.map((d) => (
                <li key={d} className="flex gap-3">
                  <span className="mt-[0.55rem] h-px w-4 shrink-0 bg-foreground/40" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <section className="mt-28">
        <h2 className="font-display text-3xl font-medium md:text-4xl">
          Completes the <span className="italic">look</span>
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
