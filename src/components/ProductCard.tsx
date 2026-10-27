import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, type Product } from "@/data/products";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [hovered, setHovered] = useState(false);

  // Use second image on hover if available
  const primaryImg  = product.image;
  const secondaryImg = product.images?.[1] ?? null;
  const showSecondary = hovered && !!secondaryImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: "easeOut" }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden bg-muted">
          {/* Primary image — always rendered, fades out when secondary shows */}
          <img
            src={primaryImg}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover"
            style={{
              transition: "opacity 0.5s ease, transform 0.7s ease",
              opacity: showSecondary ? 0 : 1,
              transform: hovered && !secondaryImg ? "scale(1.04)" : "scale(1)",
            }}
            loading="lazy"
            width={1024}
            height={1280}
          />

          {/* Secondary image — crossfades in on hover */}
          {secondaryImg && (
            <AnimatePresence>
              {showSecondary && (
                <motion.img
                  key="secondary"
                  src={secondaryImg}
                  alt={`${product.name} — alternate view`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="absolute inset-0 aspect-[4/5] w-full object-cover"
                  loading="lazy"
                  width={1024}
                  height={1280}
                />
              )}
            </AnimatePresence>
          )}

          {/* "View Piece" bar */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-card/95 py-3 text-center text-[11px] uppercase tracking-luxe transition-transform duration-300 group-hover:translate-y-0">
            View Piece
          </div>

          {/* Image count dot indicator */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {product.images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    (showSecondary ? 1 : 0) === i
                      ? "w-4 bg-primary-foreground"
                      : "w-1 bg-primary-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg leading-tight">{product.name}</h3>
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
