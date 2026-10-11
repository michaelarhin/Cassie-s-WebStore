import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { editorial, products } from "@/data/products";
import logoAsset from "@/assets/logo.jpeg";

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src={logoAsset}
            alt="The Corporate Aura monogram"
            className="mx-auto h-24 w-24 rounded-sm shadow-md"
            loading="lazy"
          />
          <p className="mt-8 text-[11px] uppercase tracking-luxe text-muted-foreground">
            Our Story
          </p>
          <h1 className="mt-5 font-display text-5xl font-medium leading-tight md:text-6xl">
            Born from the belief that <span className="italic">presence</span>{" "}
            is tailor-made.
          </h1>
          <p className="mx-auto mt-8 max-w-xl leading-relaxed text-foreground/70">
            The Corporate Aura began with a simple frustration: workwear that
            asked women to choose between authority and elegance. We design for
            neither compromise — sharp tailoring in chocolate, cream and camel,
            cut for boardrooms, pitches and the quiet moments in between.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.img
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          src={editorial}
          alt="Woman in a chocolate suit walking through a bright office"
          className="aspect-[16/10] w-full object-cover"
          loading="lazy"
          width={1600}
          height={1000}
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-3 lg:px-10">
        {[
          {
            title: "Cut with intention",
            body: "Every seam is placed to flatter a working body — sculpted waists, honest shoulders, hems that clear the floor but not the standard.",
          },
          {
            title: "Made to last seasons",
            body: "Structured crepes, double-faced gabardine, sandwashed silk. We choose fabrics that keep their line long after the trend moves on.",
          },
          {
            title: "Quiet, always",
            body: "No logos shouting, no gimmicks. Our pieces announce you — not the brand on your label.",
          },
        ].map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <span className="font-display text-4xl text-accent-foreground/60">
              0{i + 1}
            </span>
            <h2 className="mt-4 font-display text-2xl font-medium">{v.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              {v.body}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="border-t border-border bg-secondary/50 py-20 text-center">
        <h2 className="font-display text-3xl font-medium md:text-4xl">
          Ready to meet your <span className="italic">aura</span>?
        </h2>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-primary px-10 py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
        >
          Shop the Collection
        </Link>
      </section>
    </div>
  );
}
