import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ParallaxImage from "@/components/ParallaxImage";
import heroImg from "@/assets/hero.jpg";
import giftImg from "@/assets/gift-bouquet.jpg";

const panel = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function StoreSelectPage() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground md:flex-row">
      {/* ── The Corporate Aura ── */}
      <motion.div
        variants={panel}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="group relative flex flex-1 flex-col overflow-hidden"
      >
        <ParallaxImage
          src={heroImg}
          alt="Woman in an ivory tailored suit"
          className="absolute inset-0"
          imageClassName="object-[70%_center] transition-transform duration-700 group-hover:scale-[1.03]"
          width={1920}
          height={1080}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity duration-500 group-hover:from-foreground/80" />

        <Link
          to="/home"
          aria-label="Enter The Corporate Aura"
          className="absolute inset-0 z-10 flex flex-col justify-end p-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground md:p-12"
        >
          <p className="text-[11px] uppercase tracking-luxe text-primary-foreground/60">
            Workwear & Tailoring
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            The Corporate<br />
            <span className="italic">Aura</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/75">
            Impeccably tailored pieces for the woman who runs the room.
          </p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 border border-primary-foreground/40 px-7 py-3 text-[11px] uppercase tracking-luxe text-primary-foreground transition-colors duration-300 group-hover:border-primary-foreground group-hover:bg-primary-foreground/10">
            Shop now
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </motion.div>

      {/* Divider — visible on desktop only */}
      <div className="hidden w-px bg-border md:block" aria-hidden="true" />

      {/* ── The Confetti Corner ── */}
      <motion.div
        variants={panel}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
        className="group relative flex flex-1 flex-col overflow-hidden"
      >
        <ParallaxImage
          src={giftImg}
          alt="Ribbon-wrapped gift bouquet in soft warm light"
          className="absolute inset-0"
          imageClassName="object-center transition-transform duration-700 group-hover:scale-[1.03]"
          width={1200}
          height={900}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity duration-500 group-hover:from-foreground/80" />

        <Link
          to="/confetti"
          aria-label="Enter The Confetti Corner"
          className="absolute inset-0 z-10 flex flex-col justify-end p-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground md:p-12"
        >
          <p className="text-[11px] uppercase tracking-luxe text-primary-foreground/60">
            Gifts & Celebrations
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            The Confetti<br />
            <span className="italic">Corner</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/75">
            Thoughtful gifts and joyful finds for every occasion worth celebrating.
          </p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 border border-primary-foreground/40 px-7 py-3 text-[11px] uppercase tracking-luxe text-primary-foreground transition-colors duration-300 group-hover:border-primary-foreground group-hover:bg-primary-foreground/10">
            Explore gifts
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </motion.div>

      {/* Back link */}
      <Link
        to="/"
        aria-label="Back to coming soon"
        className="absolute left-7 top-7 z-20 text-[11px] uppercase tracking-luxe text-primary-foreground/60 transition-colors hover:text-primary-foreground md:left-10 md:top-10"
      >
        ← Back
      </Link>
    </main>
  );
}
