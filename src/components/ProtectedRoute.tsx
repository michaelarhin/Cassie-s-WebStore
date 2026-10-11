import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
