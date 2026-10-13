import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { editorial } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import logoAsset from "@/assets/logo.jpeg";
import heroImg from "@/assets/hero.jpg";
import ParallaxImage from "@/components/ParallaxImage";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function Index() {
  const { products, loading } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[88vh] w-full">
          <ParallaxImage
            src={heroImg}
            alt="Woman in an ivory tailored suit"
            className="absolute inset-0"
            imageClassName="object-[70%_center]"
            priority
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
          <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 lg:px-10">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-[11px] uppercase tracking-luxe text-foreground/60"
              >
                New Season · The Tailoring Edit
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mt-6 font-display text-5xl font-medium leading-[1.05] md:text-7xl"
              >
                Quiet power,
                <span className="block italic text-primary">radiant presence.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.22 }}
                className="mt-6 max-w-md text-base leading-relaxed text-foreground/70"
              >
                Impeccably tailored workwear for the woman who runs the room —
                cut in chocolate, cream and camel, finished with intention.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.34 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-3 bg-primary px-10 py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Shop the Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center border border-foreground/25 px-10 py-4 text-[12px] uppercase tracking-luxe transition-colors hover:border-foreground"
                >
                  Our Story
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <section className="border-y border-border bg-secondary/60 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-3 px-6 text-[11px] uppercase tracking-[0.22em] text-foreground/50">
          <span>Complimentary shipping over GH₵250</span>
          <span className="hidden md:inline">·</span>
          <span>Ethically tailored</span>
          <span className="hidden md:inline">·</span>
          <span>30-day easy returns</span>
          <span className="hidden md:inline">·</span>
          <span>Designed for the long game</span>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">
              The Essentials
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium md:text-5xl">
              Pieces that <span className="italic">carry</span> the day
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-2 text-[12px] uppercase tracking-luxe text-foreground/60 transition-colors hover:text-foreground md:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] w-full bg-muted" />
                <div className="mt-4 h-4 w-3/4 bg-muted rounded" />
                <div className="mt-2 h-3 w-1/2 bg-muted rounded" />
              </div>
            ))
          ) : (
            featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))
          )}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Link to="/shop" className="text-[12px] uppercase tracking-luxe underline underline-offset-4">
            View all pieces
          </Link>
        </div>
      </section>

      {/* Editorial band */}
      <section className="relative">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">
                Our Philosophy
              </p>
              <h2 className="mt-5 font-display text-4xl font-medium leading-tight md:text-5xl">
                The suit is never <span className="italic">just</span> a suit.
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-foreground/70">
                Every Corporate Aura piece begins with a question: how should
                she feel at 9 a.m., walking into the room that matters? We
                answer in chocolate and cream — sharp shoulders, honest fabrics,
                silhouettes that never shout.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-luxe border-b border-foreground/30 pb-1 transition-colors hover:border-foreground"
              >
                Read our story <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <ParallaxImage
                src={editorial}
                alt="Woman in a chocolate suit walking through a bright office"
                className="relative aspect-[16/10] w-full"
                width={1600}
                height={1000}
              />
              <img
                src={logoAsset}
                alt="The Corporate Aura monogram"
                className="absolute -bottom-8 -left-8 hidden h-28 w-28 rounded-sm shadow-xl lg:block"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <motion.h2 {...fadeUp} transition={{ duration: 0.6 }} className="text-center font-display text-4xl font-medium md:text-5xl">
          Shop by <span className="italic">mood</span>
        </motion.h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Tailoring",       category: "Tailoring"       },
            { label: "Dresses",         category: "Dresses"         },
            { label: "Blouses & Knits", category: "Blouses & Knits" },
            { label: "Outerwear",       category: "Outerwear"       },
            { label: "Shoes",           category: "Shoes"           },
            { label: "Bags",            category: "Bags"            },
          ].map((c, i) => {
            // Use the first product image from that category, fall back to first product
            const img = products.find((p) => p.category === c.category)?.image
              ?? products[0]?.image;
            if (!img) return null;
            return (
              <motion.div
                key={c.category}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(c.category)}`}
                  className="group relative block overflow-hidden"
                >
                  <ParallaxImage
                    src={img}
                    alt={c.label}
                    className="relative aspect-[3/4] w-full"
                  />
                  <div className="absolute inset-0 bg-foreground/20 transition-colors group-hover:bg-foreground/30" />
                  <span className="absolute inset-x-0 bottom-6 text-center font-display text-2xl text-primary-foreground">
                    {c.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
