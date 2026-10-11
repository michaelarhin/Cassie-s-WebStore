import { Link } from "react-router-dom";
import logoAsset from "@/assets/logo.jpeg";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <img
              src={logoAsset}
              alt="The Corporate Aura monogram"
              className="h-16 w-16 rounded-sm"
              loading="lazy"
            />
            <p className="mt-6 max-w-xs font-display text-2xl leading-snug">
              Dress like the role you're stepping into.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-luxe text-primary-foreground/60">
              Collection
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/shop" className="opacity-80 transition-opacity hover:opacity-100">
                  All Pieces
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Tailoring" className="opacity-80 transition-opacity hover:opacity-100">
                  Tailoring
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Dresses" className="opacity-80 transition-opacity hover:opacity-100">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Outerwear" className="opacity-80 transition-opacity hover:opacity-100">
                  Outerwear
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-luxe text-primary-foreground/60">
              The House
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/about" className="opacity-80 transition-opacity hover:opacity-100">
                  Our Story
                </Link>
              </li>
              <li>
                <a href="mailto:thecorperateaura@gmail.com" className="opacity-80 transition-opacity hover:opacity-100">
                  thecorperateaura@gmail.com
                </a>
              </li>
              <li className="opacity-80">Mon – Fri, 9am – 6pm</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-primary-foreground/15 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} The Corporate Aura. All rights reserved.</p>
          <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50">Quiet Power. Radiant Presence.</p>
          {/* Mercantiva credit */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/40">Developed by</span>
            {/* Logo placeholder — replace src once mercantiva-logo.png is added to src/assets/ */}
            <img
              src="/mercantiva-logo.png"
              alt="Mercantiva Ghana Limited"
              className="h-8 w-auto brightness-0 invert opacity-70"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
