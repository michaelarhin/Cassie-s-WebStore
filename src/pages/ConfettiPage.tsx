import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ParallaxImage from "@/components/ParallaxImage";
import giftImg from "@/assets/gift-candle.jpg";
import giftBouquet from "@/assets/gift-bouquet.jpg";
import giftBox from "@/assets/gift-box.jpg";

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 32 },
  animate:   { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function ConfettiPage() {
  const [email, setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-background text-foreground">

      {/* ── Full-bleed hero image ── */}
      <ParallaxImage
        src={giftImg}
        alt="A glowing candle and ribbon-wrapped gift in warm amber light"
        className="absolute inset-0 -z-20"
        imageClassName="object-center"
        width={1200}
        height={1600}
        priority
        interactive
      />

      {/* Dark gradient overlay — heavier at bottom */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />

      {/* ── Back link ── */}
      <header className="relative flex items-center justify-between px-7 py-8 md:px-14 md:py-12">
        <Link
          to="/stores"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Choose a store
        </Link>
      </header>

      {/* ── Hero content ── */}
      <section className="relative flex min-h-[80svh] flex-col items-center justify-center px-6 pb-20 pt-10 text-center">

        {/* Eyebrow */}
        <motion.p {...fadeUp(0.1)} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe text-foreground/60">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.25} />
          Gifts &amp; Celebrations
        </motion.p>

        {/* Big headline */}
        <motion.h1
          {...fadeUp(0.25)}
          className="mt-6 font-display text-[clamp(4rem,14vw,11rem)] font-medium leading-[0.88] tracking-tight"
        >
          The Confetti<br />
          <em className="not-italic italic">Corner</em>
        </motion.h1>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 h-px w-24 origin-left bg-foreground/30"
        />

        {/* Subtitle */}
        <motion.p {...fadeUp(0.45)} className="mt-8 max-w-md text-base leading-relaxed text-foreground/70 md:text-lg">
          Thoughtful gifts, joyful finds, and every occasion worth celebrating —
          beautifully curated and on their way to you.
        </motion.p>

        {/* Coming soon badge */}
        <motion.div {...fadeUp(0.55)} className="mt-8">
          <span className="inline-block border border-foreground/20 bg-background/40 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-foreground/60 backdrop-blur-sm">
            Opening soon
          </span>
        </motion.div>

        {/* Notify form */}
        <motion.div {...fadeUp(0.65)} className="mt-10 w-full max-w-sm">
          {submitted ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-sm text-foreground/70"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.25} />
              You're on the list — we'll be in touch.
            </motion.p>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-0">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 border border-border bg-background/60 px-4 py-3.5 text-sm outline-none backdrop-blur-sm placeholder:text-foreground/40 focus:border-foreground"
              />
              <button
                type="submit"
                className="group flex items-center gap-2 border border-l-0 border-foreground bg-foreground px-5 py-3.5 text-[11px] uppercase tracking-luxe text-background transition-opacity hover:opacity-80"
              >
                Notify me
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          )}
          <p className="mt-3 text-[11px] text-foreground/40">
            Be the first to know when we open. No spam, ever.
          </p>
        </motion.div>
      </section>

      {/* ── Preview strip — 3 gift images ── */}
      <section className="relative px-6 pb-20 md:px-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-center text-[11px] uppercase tracking-luxe text-foreground/40"
        >
          A glimpse of what's coming
        </motion.p>
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 md:gap-5">
          {[
            { src: giftBox,     alt: "Ribbon-wrapped gift box",       delay: 0    },
            { src: giftImg,     alt: "Ceramic candle in amber light",  delay: 0.1 },
            { src: giftBouquet, alt: "Blush rose bouquet",             delay: 0.2 },
          ].map(({ src, alt, delay }) => (
            <motion.div
              key={alt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay }}
              className="overflow-hidden"
            >
              <img
                src={src}
                alt={alt}
                className="aspect-[3/4] w-full object-cover opacity-80 transition-transform duration-700 hover:scale-[1.04]"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer note ── */}
      <footer className="relative border-t border-foreground/10 px-7 py-6 text-center md:px-14">
        <p className="text-xs text-foreground/40">
          The Confetti Corner — part of{" "}
          <Link to="/home" className="underline underline-offset-2 hover:text-foreground/60 transition-colors">
            The Corporate Aura
          </Link>{" "}
          family
        </p>
      </footer>
    </main>
  );
}
