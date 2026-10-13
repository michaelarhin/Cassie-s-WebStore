import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const active = params.get("category") ?? "All";
  const { products, loading } = useProducts();

  const visible =
    active === "All"
      ? products
      : products.filter((p) => p.category === active);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">
          The Collection
        </p>
        <h1 className="mt-4 font-display text-5xl font-medium md:text-6xl">
          Every piece, <span className="italic">considered</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-foreground/60">
          Nine essentials. Infinite combinations. A wardrobe engineered for
          the workweek and everything after it.
        </p>
      </motion.div>

      <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-b border-border pb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() =>
              setParams(c === "All" ? {} : { category: c }, { replace: true })
            }
            className={`text-[12px] uppercase tracking-luxe transition-colors ${
              active === c
                ? "text-foreground underline underline-offset-8"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      ) : (
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-3"
        >
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      )}

      {!loading && visible.length === 0 && (
        <p className="mt-20 text-center text-muted-foreground">
          No pieces in this category yet.
        </p>
      )}
    </div>
  );
}
