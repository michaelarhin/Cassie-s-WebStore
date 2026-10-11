import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import logoAsset from "@/assets/logo.jpeg";

const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=Tailoring", label: "Tailoring" },
  { to: "/shop?category=Dresses", label: "Dresses" },
  { to: "/about", label: "Our Story" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const { resolved, mode, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="flex justify-center gap-px border-b border-border/70 text-[11px] uppercase tracking-luxe">
        {[
          { to: "/home", label: "The Corporate Aura", on: !location.pathname.startsWith("/confetti") },
          { to: "/confetti", label: "The Confetti Corner", on: location.pathname.startsWith("/confetti") },
        ].map((s) => (
          <Link key={s.to} to={s.to} className={`px-5 py-2 transition-colors ${s.on ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"}`}>
            {s.label}
          </Link>
        ))}
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <button
          className="lg:hidden p-2 -ml-2 text-foreground"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/home" className="flex items-center gap-3 lg:gap-4">
          <img
            src={logoAsset}
            alt="The Corporate Aura monogram"
            className="h-11 w-11 rounded-sm object-cover shadow-sm"
            loading="lazy"
          />
          <span className="font-display text-xl md:text-2xl font-medium tracking-[0.08em] uppercase">
            The Corporate Aura
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[13px] uppercase tracking-luxe transition-colors hover:text-foreground/70 ${
                  isActive && l.to === location.pathname + location.search
                    ? "text-foreground"
                    : "text-foreground/60"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={mode === "auto" ? "Auto (time-based) — click to override" : `Manual ${resolved} — click to restore auto`}
            className="relative p-2 text-foreground/60 hover:text-foreground transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {resolved === "dark" ? (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  <Moon className="h-4 w-4" strokeWidth={1.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  <Sun className="h-4 w-4" strokeWidth={1.5} />
                </motion.span>
              )}
            </AnimatePresence>
            {/* Dot indicator when auto mode is active */}
            {mode === "auto" && (
              <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-foreground/40" aria-hidden="true" />
            )}
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2 -mr-2 text-foreground transition-transform hover:scale-105"
            aria-label="Open shopping bag"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/70 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm uppercase tracking-luxe text-foreground/70 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
