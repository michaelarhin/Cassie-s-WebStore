import { createContext, useContext, useEffect, useState } from "react";
import { type Session } from "@supabase/supabase-js";
import { supabase, getAdminSession } from "@/lib/supabase";

interface AdminAuthContextValue {
  session: Session | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({ session: null, loading: true });

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminSession().then((s) => {
      setSession(s);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      const ADMIN = "thecorperateaura@gmail.com";
      setSession(s?.user?.email === ADMIN ? s : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ session, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
