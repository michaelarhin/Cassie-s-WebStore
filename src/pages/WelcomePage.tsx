import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import welcomeImage from "@/assets/coming-soon.jpg";
import ParallaxImage from "@/components/ParallaxImage";

export default function WelcomePage() {
  return (
    <main className="welcome-page relative isolate flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
      <ParallaxImage
        src={welcomeImage}
        alt="An ivory tailored blazer and a ribbon-wrapped gift in a sunlit studio"
        width={1920}
        height={1088}
        priority
        interactive
        className="absolute inset-0 -z-20"
        imageClassName="welcome-image object-[68%_center]"
      />
      <div className="welcome-shade absolute inset-0 -z-10" />
      <header className="flex flex-wrap items-start justify-between gap-4 px-7 py-8 md:px-14 md:py-12">
        <p className="font-display text-xl leading-tight md:text-2xl">The Corporate Aura<br /><span className="font-sans text-xs text-foreground/70">& The Confetti Corner</span></p>
        <span className="text-xs uppercase text-foreground/70">A new chapter</span>
      </header>
      <section className="flex flex-1 items-center px-7 py-20 md:px-14 lg:px-24">
        <div className="max-w-xl">
          <p className="mb-6 text-xs uppercase text-foreground/70">Style meets celebration</p>
          <h1 className="font-display text-7xl font-medium leading-[0.95] sm:text-8xl lg:text-9xl">Coming<br /><span className="italic">Soon.</span></h1>
          <p className="mt-8 max-w-xs text-base leading-relaxed text-foreground/80">Refined wardrobes. Thoughtful gifts.<br />Two worlds, one beautiful destination.</p>
          <div className="mt-10 h-px w-16 bg-foreground/40" />
        </div>
      </section>
      <footer className="flex items-end justify-between gap-6 px-7 pb-8 md:px-14 md:pb-12">
        <p className="max-w-48 text-xs leading-relaxed text-foreground/70">The Corporate Aura<br />The Confetti Corner</p>
        <Button asChild variant="ghost" className="group h-auto gap-3 rounded-none p-2 text-xs text-foreground hover:bg-background/60">
          <Link to="/stores" aria-label="Choose a shop" title="Choose a shop">
            <Sparkles className="h-4 w-4" strokeWidth={1.25} />
            <span>Step inside</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </Link>
        </Button>
      </footer>
    </main>
  );
}