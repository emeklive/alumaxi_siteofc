"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Camada ligada à rolagem (parallax / zoom / giro), no espírito do device `parallax` do scroll-craft:
 * diferenças pequenas entre planos, apenas transform. Desligado com movimento reduzido.
 * y: deslocamento em px do momento em que entra na tela até sair. scale/rotate: idem.
 */
export function ScrollFx({
  children,
  className,
  y,
  scale,
  rotate,
  "aria-hidden": ariaHidden,
}: {
  children?: React.ReactNode;
  className?: string;
  y?: [number, number];
  scale?: [number, number];
  rotate?: [number, number];
  "aria-hidden"?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const ty = useTransform(p, [0, 1], y ?? [0, 0]);
  const sc = useTransform(p, [0, 1], scale ?? [1, 1]);
  const rt = useTransform(p, [0, 1], rotate ?? [0, 0]);
  if (reduce) return <div ref={ref} className={className} aria-hidden={ariaHidden}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} aria-hidden={ariaHidden} style={{ y: y ? ty : undefined, scale: scale ? sc : undefined, rotate: rotate ? rt : undefined }}>
      {children}
    </motion.div>
  );
}
