import { useEffect, useState } from "react";
import { supabase, type DbProduct } from "@/lib/supabase";
import { products as staticProducts, giftProducts as staticGifts, type Product, type ColorVariant } from "@/data/products";

// Convert a Supabase DbProduct row into the Product shape used by the UI
function dbToProduct(p: DbProduct & { variants?: ColorVariant[] }): Product {
  return {
    id:          p.id,
    slug:        p.slug,
    name:        p.name,
    category:    p.category,
    price:       p.price,
    image:       p.image_url,
    color:       p.color,
    description: p.description,
    details:     p.details ?? [],
    sizes:       p.sizes ?? [],
    variants:    p.variants ?? [],
    featured:    p.featured,
    store:       p.store,
  };
}

interface UseProductsResult {
  products: Product[];       // aura store only
  giftProducts: Product[];   // confetti store only
  allProducts: Product[];    // both combined
  loading: boolean;
}

export function useProducts(): UseProductsResult {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDbProducts((data as (DbProduct & { variants?: ColorVariant[] })[]).map(dbToProduct));
        }
        setLoading(false);
      });
  }, []);

  // Merge: Supabase products take precedence; static ones fill the rest
  // Deduplicate by slug so a static product replaced by a DB one doesn't appear twice
  const merge = (dbList: Product[], staticList: Product[]) => {
    const dbSlugs = new Set(dbList.map((p) => p.slug));
    const staticFallback = staticList.filter((p) => !dbSlugs.has(p.slug));
    return [...dbList, ...staticFallback];
  };

  const dbAura     = dbProducts.filter((p) => p.store !== "confetti");
  const dbConfetti = dbProducts.filter((p) => p.store === "confetti");

  const products     = merge(dbAura,     staticProducts);
  const giftProducts = merge(dbConfetti, staticGifts);

  return {
    products,
    giftProducts,
    allProducts: [...products, ...giftProducts],
    loading,
  };
}
