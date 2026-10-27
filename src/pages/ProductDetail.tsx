import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import NotFound from "@/pages/NotFound";
import ProductCard from "@/components/ProductCard";
import { findProduct, formatPrice } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const { allProducts, loading } = useProducts();
  const { addItem } = useCart();

  const product = allProducts.find((p) => p.slug === slug) ?? (slug ? findProduct(slug) : undefined);

  // ── ALL hooks at the top — before any early returns ──────────────────────
  const firstVariant = product?.variants?.[0];

  const [color,     setColor]     = useState<string>(firstVariant?.name ?? product?.color ?? "");
  const [size,      setSize]      = useState<string | null>(null);
  const [qty,       setQty]       = useState(1);
  const [error,     setError]     = useState<{ color?: boolean; size?: boolean }>({});
  const [activeImg, setActiveImg] = useState(0);

  // Reset all selections when the product changes
  useEffect(() => {
    if (product) {
      setColor(product.variants?.[0]?.name ?? product.color ?? "");
      setSize(null);
      setQty(1);
      setError({});
      setActiveImg(0);
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset active image when colour changes
  useEffect(() => { setActiveImg(0); }, [color]);

  // ── Early returns after all hooks ────────────────────────────────────────
  if (loading && !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!product) return <NotFound />;

  // ── Derived values ────────────────────────────────────────────────────────
  const hasVariants  = !!product.variants?.length;
  const activeVariant = product.variants?.find((v) => v.name === color);
  const stockFor     = (s: string) => activeVariant?.stock[s] ?? Infinity;

  const allImages = (() => {
    const base = product.images?.length ? product.images : [product.image].filter(Boolean);
    if (activeVariant?.image && !base.includes(activeVariant.image)) {
      return [activeVariant.image, ...base];
    }
    return base;
  })();

  const displayImage = allImages[activeImg] ?? allImages[0] ?? product.image;

  const related = allProducts
    .filter((p) => p.id !== product.id && p.store === product.store)
    .sort((a, b) =>
      a.category === product.category ? -1 : b.category === product.category ? 1 : 0
    )
    .slice(0, 4);

  const handleAdd = () => {
    const needsColor = hasVariants && !color;
    const needsSize  = !size;
    if (needsColor || needsSize) {
      setError({ color: needsColor, size: needsSize });
      return;
    }
    if (activeVariant && size && stockFor(size) === 0) return;
    setError({});
    addItem(product, color, size!, qty);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-[12px] uppercase tracking-luxe text-foreground/50 transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-20">

        {/* ── Image gallery ── */}
        <div className="flex gap-3">
          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex flex-col gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-12 shrink-0 overflow-hidden bg-muted transition-all duration-200 ${
                    activeImg === i
                      ? "ring-1 ring-foreground ring-offset-1"
                      : "opacity-50 hover:opacity-80"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1 overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={displayImage}
                src={displayImage}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="aspect-[4/5] w-full object-cover"
                width={1024}
                height={1280}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* ── Product details ── */}
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

          <p className="mt-8 max-w-lg leading-relaxed text-foreground/75">
            {product.description}
          </p>

          {/* Colour selection */}
          {hasVariants && (
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-luxe text-foreground/60">
                  Colour — <span className="text-foreground">{color}</span>
                </span>
                {error.color && (
                  <span className="text-xs text-destructive">Please choose a colour</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.variants!.map((v) => {
                  const totalStock = Object.values(v.stock).reduce((a, b) => a + b, 0);
                  const soldOut = totalStock === 0;
                  return (
                    <button
                      key={v.name}
                      onClick={() => { setColor(v.name); setSize(null); setError({}); }}
                      disabled={soldOut}
                      title={soldOut ? `${v.name} — sold out` : v.name}
                      className={`relative flex items-center gap-2.5 border px-4 py-2.5 text-sm transition-colors ${
                        color === v.name
                          ? "border-foreground bg-foreground text-background"
                          : soldOut
                            ? "cursor-not-allowed border-border opacity-40"
                            : "border-border hover:border-foreground/60"
                      }`}
                    >
                      {v.hex && (
                        <span className="h-3.5 w-3.5 rounded-full border border-foreground/20 shrink-0"
                          style={{ background: v.hex }} />
                      )}
                      {v.name}
                      {soldOut && <span className="ml-1 text-[10px] opacity-70">· Sold out</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selection */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-luxe text-foreground/60">Select size</span>
              {error.size && (
                <span className="text-xs text-destructive">Please choose a size</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.sizes.map((s) => {
                const stock = stockFor(s);
                const outOfStock = stock === 0;
                return (
                  <button
                    key={s}
                    onClick={() => { if (!outOfStock) { setSize(s); setError((e) => ({ ...e, size: false })); } }}
                    disabled={outOfStock}
                    className={`relative min-w-[3.5rem] border px-4 py-3 text-sm transition-colors ${
                      size === s
                        ? "border-foreground bg-foreground text-background"
                        : outOfStock
                          ? "cursor-not-allowed border-border opacity-35"
                          : "border-border hover:border-foreground/50"
                    }`}
                  >
                    {s}
                    {!outOfStock && stock > 0 && stock <= 3 && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
            {size && activeVariant && stockFor(size) > 0 && stockFor(size) <= 3 && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                Only {stockFor(size)} left in {color} / {size}
              </p>
            )}
          </div>

          {/* Qty + Add to bag */}
          <div className="mt-8 flex items-stretch gap-4">
            <div className="flex items-center border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-4 text-foreground/60 hover:text-foreground" aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}
                className="px-4 py-4 text-foreground/60 hover:text-foreground" aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={handleAdd}
              className="flex-1 bg-primary text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90">
              Add to Bag — {formatPrice(product.price * qty)}
            </button>
          </div>

          {/* Details */}
          {product.details.length > 0 && (
            <div className="mt-10 border-t border-border pt-8">
              <h2 className="text-[11px] uppercase tracking-luxe text-foreground/60">Details</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground/70">
                {product.details.map((d, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[0.55rem] h-px w-4 shrink-0 bg-foreground/40" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
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
      )}
    </div>
  );
}
