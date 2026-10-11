import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import ShopPage from "@/pages/ShopPage";
import ProductDetail from "@/pages/ProductDetail";
import CheckoutPage from "@/pages/CheckoutPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "@/pages/NotFound";
import WelcomePage from "@/pages/WelcomePage";
import StoreSelectPage from "@/pages/StoreSelectPage";
import ConfettiPage from "@/pages/ConfettiPage";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AdminAuthProvider>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public storefront */}
                <Route path="/" element={<WelcomePage />} />
                <Route path="/stores" element={<StoreSelectPage />} />
                <Route element={<Layout />}>
                  <Route path="/home" element={<Index />} />
                  <Route path="/confetti" element={<ConfettiPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                {/* Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
