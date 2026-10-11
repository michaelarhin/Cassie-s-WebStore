import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  color: string;
  size: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, color: string, size: string, qty?: number) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQty: (productId: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "corporate-aura-cart";

const match = (i: CartItem, productId: string, color: string, size: string) =>
  i.product.id === productId && i.color === color && i.size === size;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* noop */ }
  }, [items]);

  const addItem = useCallback((product: Product, color: string, size: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => match(i, product.id, color, size));
      if (existing) {
        return prev.map((i) =>
          match(i, product.id, color, size) ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { product, color, size, qty }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, color: string, size: string) => {
    setItems((prev) => prev.filter((i) => !match(i, productId, color, size)));
  }, []);

  const updateQty = useCallback((productId: string, color: string, size: string, qty: number) => {
    if (qty <= 0) { removeItem(productId, color, size); return; }
    setItems((prev) =>
      prev.map((i) => match(i, productId, color, size) ? { ...i, qty } : i)
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart  = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count    = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.product.price, 0), [items]);

  const value = useMemo(() => ({
    items, isOpen, openCart, closeCart,
    addItem, removeItem, updateQty, clearCart, count, subtotal,
  }), [items, isOpen, openCart, closeCart, addItem, removeItem, updateQty, clearCart, count, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
