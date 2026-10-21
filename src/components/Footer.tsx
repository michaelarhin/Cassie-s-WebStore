import { Link } from "react-router-dom";
import logoAsset from "@/assets/logo.jpeg";

// ── Inline SVG icons ───────────────────────────────────────────────────────────

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.648 4.833 1.783 6.86L2 30l7.347-1.758A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm7.07 19.492c-.295.828-1.726 1.584-2.363 1.686-.607.096-1.375.137-2.218-.14a20.3 20.3 0 0 1-2.008-.742c-3.535-1.527-5.844-5.09-6.02-5.326-.174-.237-1.418-1.887-1.418-3.598 0-1.71.896-2.553 1.214-2.902.317-.348.694-.435.925-.435l.665.012c.213.01.5-.08.783.598.295.7 1.002 2.41 1.09 2.585.087.174.144.379.029.609-.116.232-.174.376-.348.579-.174.203-.366.453-.522.608-.174.174-.355.363-.153.712.203.348.9 1.484 1.933 2.404 1.328 1.183 2.447 1.55 2.795 1.724.348.174.55.145.754-.087.203-.232.87-.1017 1.16-1.395.29-.378.58-.316.975-.19.396.127 2.514 1.186 2.948 1.4.433.216.72.322.826.5.105.18.105 1.035-.19 1.863Z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

// ── Links ──────────────────────────────────────────────────────────────────────

const WA_URL        = "https://wa.me/233594908430";
const TIKTOK_URL    = "https://www.tiktok.com/@thecorporateaura.gh";
const INSTAGRAM_URL = "https://www.instagram.com/thecoporateaura.gh";
const FACEBOOK_URL  = "https://www.facebook.com/share/1J3CwfG5ma/";

const SOCIALS = [
  { label: "Instagram", href: INSTAGRAM_URL, icon: InstagramIcon, color: "hover:text-[#E1306C]" },
  { label: "TikTok",    href: TIKTOK_URL,    icon: TikTokIcon,    color: "hover:text-foreground" },
  { label: "Facebook",  href: FACEBOOK_URL,  icon: FacebookIcon,  color: "hover:text-[#1877F2]" },
  { label: "WhatsApp",  href: WA_URL,        icon: WhatsAppIcon,  color: "hover:text-[#25D366]" },
];

export default function Footer() {
  return (
    <>
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-12 md:grid-cols-3">

            {/* Brand */}
            <div>
              <img src={logoAsset} alt="The Corporate Aura monogram" className="h-16 w-16 rounded-sm" loading="lazy" />
              <p className="mt-6 max-w-xs font-display text-2xl leading-snug">
                Dress like the role you're stepping into.
              </p>
              {/* Social icons */}
              <div className="mt-6 flex items-center gap-4">
                {SOCIALS.map(({ label, href, icon: Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`opacity-60 transition-all duration-200 hover:opacity-100 ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Collection */}
            <div>
              <h3 className="text-[11px] uppercase tracking-luxe text-primary-foreground/60">Collection</h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li><Link to="/shop" className="opacity-80 transition-opacity hover:opacity-100">All Pieces</Link></li>
                <li><Link to="/shop?category=Tailoring" className="opacity-80 transition-opacity hover:opacity-100">Tailoring</Link></li>
                <li><Link to="/shop?category=Dresses" className="opacity-80 transition-opacity hover:opacity-100">Dresses</Link></li>
                <li><Link to="/shop?category=Shoes" className="opacity-80 transition-opacity hover:opacity-100">Shoes</Link></li>
                <li><Link to="/shop?category=Bags" className="opacity-80 transition-opacity hover:opacity-100">Bags</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-[11px] uppercase tracking-luxe text-primary-foreground/60">The House</h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li><Link to="/about" className="opacity-80 transition-opacity hover:opacity-100">Our Story</Link></li>
                <li>
                  <a href="mailto:thecorperateaura@gmail.com" className="opacity-80 transition-opacity hover:opacity-100">
                    thecorperateaura@gmail.com
                  </a>
                </li>
                <li>
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100">
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    Chat on WhatsApp
                  </a>
                </li>
                <li className="opacity-80">Mon – Fri, 9am – 6pm</li>
              </ul>

              {/* Follow us */}
              <div className="mt-8">
                <h3 className="text-[11px] uppercase tracking-luxe text-primary-foreground/60">Follow us</h3>
                <div className="mt-4 flex flex-col gap-2.5">
                  {[
                    { label: "Instagram",  href: INSTAGRAM_URL, icon: InstagramIcon },
                    { label: "TikTok",     href: TIKTOK_URL,    icon: TikTokIcon    },
                    { label: "Facebook",   href: FACEBOOK_URL,  icon: FacebookIcon  },
                  ].map(({ label, href, icon: Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 text-sm opacity-80 transition-opacity hover:opacity-100">
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-primary-foreground/15 pt-8 md:flex-row md:items-center">
            <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} The Corporate Aura. All rights reserved.</p>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50">Quiet Power. Radiant Presence.</p>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/40">Developed by</span>
              <img src="/mercantiva-logo.png" alt="Mercantiva Ghana Limited" className="h-8 w-auto brightness-0 invert opacity-70" loading="lazy" />
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp bubble */}
      <a href={WA_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]">
        <WhatsAppIcon className="h-7 w-7 text-white" />
      </a>

      {/* Floating social sidebar — desktop only */}
      <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {SOCIALS.map(({ label, href, icon: Icon, color }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground/50 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-md ${color}`}>
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </>
  );
}
