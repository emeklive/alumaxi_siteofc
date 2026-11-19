"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { SmartImage } from "./SmartImage";

type Img = { src: string; alt: string };

export function Gallery({ items, className = "" }: { items: Img[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, go]);

  return (
    <>
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 ${className}`} data-testid="gallery">
        {items.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-lg bg-brand-petrol-light ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
            aria-label={`Ampliar imagem: ${img.alt}`}
          >
            <SmartImage src={img.src} alt={img.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 flex items-center justify-center bg-brand-petrol-deep/0 transition-colors group-hover:bg-brand-petrol-deep/45">
              <ZoomIn className="h-8 w-8 scale-75 text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100" />
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Visualização ampliada"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              key={open}
              className="relative h-[75vh] w-full max-w-5xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage src={items[open].src.replace(/w=\d+/, "w=2000")} alt={items[open].alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/80">
              {items[open].alt} · {open + 1}/{items.length}
            </p>
            <button type="button" onClick={close} aria-label="Fechar" className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"><X /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Imagem anterior" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-brand-orange"><ChevronLeft /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Próxima imagem" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-brand-orange"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
