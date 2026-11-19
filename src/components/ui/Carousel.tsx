"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Carrossel horizontal com scroll-snap, setas e indicadores. */
export function Carousel({ children, label }: { children: React.ReactNode[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    const first = el.children[0] as HTMLElement | undefined;
    const w = first ? first.offsetWidth + 24 : el.clientWidth;
    setIndex(Math.round(el.scrollLeft / w));
  };

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    el.scrollBy({ left: dir * (first ? first.offsetWidth + 24 : el.clientWidth), behavior: "smooth" });
  };
  const goTo = (i: number) => {
    const el = ref.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={label} data-testid="carousel">
      <div
        ref={ref}
        className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((c, i) => (
          <div key={i} className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            {c}
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-2" aria-label="Indicadores">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o item ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-brand-orange" : "w-3 bg-line hover:bg-brand-petrol/40"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Anterior" className="rounded-full border-2 border-brand-petrol p-2.5 text-brand-petrol transition hover:bg-brand-petrol hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-petrol">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Próximo" className="rounded-full border-2 border-brand-petrol p-2.5 text-brand-petrol transition hover:bg-brand-petrol hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-petrol">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
