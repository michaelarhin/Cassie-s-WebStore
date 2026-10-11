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
                <a href="mailto:hello@corporateaura.com" className="opacity-80 transition-opacity hover:opacity-100">
                  hello@corporateaura.com
                </a>
              </li>
              <li className="opacity-80">Mon – Fri, 9am – 6pm</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-primary-foreground/15 pt-8 text-xs text-primary-foreground/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} The Corporate Aura. All rights reserved.</p>
          <p className="uppercase tracking-[0.2em]">Quiet Power. Radiant Presence.</p>
        </div>
      </div>
    </footer>
  );
}
