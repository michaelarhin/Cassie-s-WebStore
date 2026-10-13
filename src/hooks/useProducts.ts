import { useEffect, useState } from "react";
import { supabase, type DbProduct } from "@/lib/supabase";
import { type Product, type ColorVariant } from "@/data/products";

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
        setDbProducts(
          data
            ? (data as (DbProduct & { variants?: ColorVariant[] })[]).map(dbToProduct)
            : []
        );
        setLoading(false);
      });
  }, []);

  const products     = dbProducts.filter((p) => p.store !== "confetti");
  const giftProducts = dbProducts.filter((p) => p.store === "confetti");

  return {
    products,
    giftProducts,
    allProducts: dbProducts,
    loading,
  };
}
