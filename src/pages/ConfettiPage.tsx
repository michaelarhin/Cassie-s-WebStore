import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ParallaxImage from "@/components/ParallaxImage";
import giftImg from "@/assets/gift-candle.jpg";

export default function ConfettiPage() {
  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
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
      <div className="welcome-shade absolute inset-0 -z-10" />

      <header className="flex items-center justify-between px-7 py-8 md:px-14 md:py-12">
        <Link
          to="/stores"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Choose a store
        </Link>
      </header>

      <section className="flex flex-1 items-center px-7 py-20 md:px-14 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <p className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-foreground/70">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.25} />
            Gifts & Celebrations
          </p>
          <h1 className="font-display text-6xl font-medium leading-[0.95] sm:text-7xl lg:text-8xl">
            The Confetti<br />
            <span className="italic">Corner</span>
          </h1>
          <p className="mt-8 max-w-xs text-base leading-relaxed text-foreground/75">
            Thoughtful gifts and joyful finds — coming soon to delight every occasion worth celebrating.
          </p>
          <div className="mt-10 h-px w-16 bg-foreground/40" />
        </motion.div>
      </section>

      <footer className="px-7 pb-8 md:px-14 md:pb-12">
        <p className="text-xs text-foreground/50">The Confetti Corner — part of The Corporate Aura family</p>
      </footer>
    </main>
  );
}
