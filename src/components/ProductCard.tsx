import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice, type Product } from "@/data/products";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: "easeOut" }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="relative overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
            width={1024}
            height={1280}
          />
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-card/95 py-3 text-center text-[11px] uppercase tracking-luxe transition-transform duration-300 group-hover:translate-y-0">
            View Piece
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg leading-tight">
              {product.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {product.color}
            </p>
          </div>
          <span className="text-sm tracking-wide">{formatPrice(product.price)}</span>
        </div>
      </Link>
    </motion.div>
  );
}
