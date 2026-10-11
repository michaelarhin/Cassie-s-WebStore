import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. " +
    "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types matching the database schema ───────────────────────────────────────

export interface OrderItem {
  product_id: string;
  product_name: string;
  slug: string;
  size: string;
  qty: number;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id?: string;
  created_at?: string;
  // Customer
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  // Shipping
  address_line1: string;
  address_line2?: string;
  city: string;
  region: string;
  country: string;
  // Financials
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  // Items snapshot
  items: OrderItem[];
  // Status
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}
