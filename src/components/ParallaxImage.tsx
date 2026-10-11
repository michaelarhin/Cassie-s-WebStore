import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  interactive?: boolean;
  priority?: boolean;
};

export default function ParallaxImage({ src, alt, className, imageClassName = "", width, height, interactive = false, priority = false }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 55, damping: 25 });
  const pointerOffset = useSpring(pointerY, { stiffness: 55, damping: 25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollOffset = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const y = useTransform(() => scrollOffset.get() + pointerOffset.get());

  useEffect(() => {
    if (!interactive || reducedMotion) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !ref.current) return;
      const bounds = ref.current.getBoundingClientRect();
      const horizontal = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
      const vertical = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
      pointerX.set(horizontal * -20);
      pointerY.set(vertical * -20);
    };
    const reset = () => { pointerX.set(0); pointerY.set(0); };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [interactive, reducedMotion, pointerX, pointerY]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} data-parallax>
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
        style={reducedMotion ? undefined : { x, y, scale: 1.14 }}
      />
    </div>
  );
}