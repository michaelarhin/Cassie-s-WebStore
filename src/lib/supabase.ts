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

// ─── Types ────────────────────────────────────────────────────────────────────

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
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  region: string;
  country: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  items: OrderItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

export interface DbProduct {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  color: string;
  description: string;
  details: string[];
  sizes: string[];
  image_url: string;
  images: string[];       // all product images
  featured: boolean;
  store: "aura" | "confetti";
  active: boolean;
}

export type DbProductInsert = Omit<DbProduct, "id" | "created_at" | "updated_at">;

// ─── Auth helpers ─────────────────────────────────────────────────────────────

const ADMIN_EMAIL = "thecorperateaura@gmail.com";

export async function adminSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (data.user?.email !== ADMIN_EMAIL) {
    await supabase.auth.signOut();
    throw new Error("Unauthorized");
  }
  return data;
}

export async function adminSignOut() {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return data.session;
}
