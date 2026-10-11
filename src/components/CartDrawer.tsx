import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal } =
    useCart();

  const freeShippingAt = 250;
  const progress = Math.min(100, (subtotal / freeShippingAt) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-8 py-6">
              <h2 className="font-display text-2xl font-medium">
                Your Bag{" "}
                <span className="text-muted-foreground text-lg">
                  ({items.length})
                </span>
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-foreground/60 hover:text-foreground"
                aria-label="Close bag"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/50" strokeWidth={1} />
                <p className="font-display text-2xl">Your bag is empty</p>
                <p className="text-sm text-muted-foreground max-w-[26ch]">
                  Pieces that command the room are waiting for you.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="mt-2 inline-block bg-primary px-10 py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Shop the Collection
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-border px-8 py-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {subtotal >= freeShippingAt
                      ? "Complimentary shipping unlocked"
                      : `${formatPrice(freeShippingAt - subtotal)} away from complimentary shipping`}
                  </p>
                  <div className="mt-3 h-px bg-border">
                    <motion.div
                      className="h-px bg-foreground"
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.5 }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8">
                  <ul className="divide-y divide-border">
                    {items.map((item) => (
                      <li
                        key={`${item.product.id}-${item.size}`}
                        className="flex gap-5 py-6"
                      >
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="shrink-0"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-28 w-22 w-[88px] object-cover"
                            loading="lazy"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <Link
                              to={`/product/${item.product.slug}`}
                              onClick={closeCart}
                              className="font-display text-lg leading-snug hover:opacity-70"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() =>
                                removeItem(item.product.id, item.size)
                              }
                              className="text-muted-foreground hover:text-foreground"
                              aria-label={`Remove ${item.product.name}`}
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                            {item.product.color} · Size {item.size}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() =>
                                  updateQty(
                                    item.product.id,
                                    item.size,
                                    item.qty - 1
                                  )
                                }
                                className="p-2 text-foreground/60 hover:text-foreground"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm">
                                {item.qty}
                              </span>
                              <button
                                onClick={() =>
                                  updateQty(
                                    item.product.id,
                                    item.size,
                                    item.qty + 1
                                  )
                                }
                                className="p-2 text-foreground/60 hover:text-foreground"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-sm">
                              {formatPrice(item.product.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border px-8 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-luxe text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-display text-2xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="mt-5 block bg-primary py-4 text-center text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
