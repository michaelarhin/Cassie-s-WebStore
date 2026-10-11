import { Link } from "react-router-dom";
import logoAsset from "@/assets/logo.jpeg";

// WhatsApp SVG inline — no extra dependency needed
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.648 4.833 1.783 6.86L2 30l7.347-1.758A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm7.07 19.492c-.295.828-1.726 1.584-2.363 1.686-.607.096-1.375.137-2.218-.14a20.3 20.3 0 0 1-2.008-.742c-3.535-1.527-5.844-5.09-6.02-5.326-.174-.237-1.418-1.887-1.418-3.598 0-1.71.896-2.553 1.214-2.902.317-.348.694-.435.925-.435l.665.012c.213.01.5-.08.783.598.295.7 1.002 2.41 1.09 2.585.087.174.144.379.029.609-.116.232-.174.376-.348.579-.174.203-.366.453-.522.608-.174.174-.355.363-.153.712.203.348.9 1.484 1.933 2.404 1.328 1.183 2.447 1.55 2.795 1.724.348.174.55.145.754-.087.203-.232.87-.1017 1.16-1.395.29-.378.58-.316.975-.19.396.127 2.514 1.186 2.948 1.4.433.216.72.322.826.5.105.18.105 1.035-.19 1.863Z"/>
  </svg>
);

const WA_NUMBER = "233594908430";
const WA_URL = `https://wa.me/${WA_NUMBER}`;

export default function Footer() {
  return (
    <>
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
                <li>
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    Chat on WhatsApp
                  </a>
                </li>
                <li className="opacity-80">Mon – Fri, 9am – 6pm</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-primary-foreground/15 pt-8 md:flex-row md:items-center">
            <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} The Corporate Aura. All rights reserved.</p>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50">Quiet Power. Radiant Presence.</p>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/40">Developed by</span>
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

      {/* Floating WhatsApp bubble — visible on all pages */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        <WhatsAppIcon className="h-7 w-7 text-white" />
      </a>
    </>
  );
}
