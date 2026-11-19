"use client";
/**
 * "Vidro laminado, camada por camada"
 * Assinatura interativa da página de vidros (método scroll-craft: ato fixado + linha do tempo
 * pela rolagem). A rolagem separa as camadas do vidro; cada camada destaca um serviço.
 * O visitante também pode arrastar (mouse ou dedo) para girar o vidro em 3D.
 * - Sem re-render por quadro: a rolagem escreve transform/opacity direto nos nós (rAF + lerp).
 * - Movimento reduzido: versão estática, com as camadas separadas e todos os serviços listados.
 * - Toque: `touch-action: pan-y` mantém a rolagem vertical; arrastar na horizontal gira.
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Hand, MessageCircle } from "lucide-react";
import { laminatedIntro, laminatedLayers, type LaminatedLayer } from "@/data/laminated";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Janela com patamar: sobe em [a, a+r], segura, desce em [b-r, b]. */
const windowOp = (p: number, a: number, b: number, r = 0.035, holdEnd = false) =>
  Math.min(smooth(a, a + r, p), holdEnd ? 1 : 1 - smooth(b - r, b, p));

// Linha do tempo (progresso 0..1 do ato fixado)
const T = { explodeIn: [0.05, 0.19], stepsStart: 0.2, stepLen: 0.15, explodeOut: [0.8, 0.9], closing: 0.8 } as const;
const stepWindow = (i: number) => [T.stepsStart + i * T.stepLen, T.stepsStart + (i + 1) * T.stepLen] as const;

// ---------- Peças do vidro ----------
function GlassSlab({ layer, thick }: { layer: LaminatedLayer; thick: number }) {
  const film = layer.kind === "film";
  return (
    <div className="lg-slab" data-kind={layer.kind} style={{ ["--t" as string]: `${thick}px` }}>
      <div className={cn("lg-face lg-front", film ? "lg-film" : "lg-glass")}>
        <span className="lg-shine" />
      </div>
      <div className={cn("lg-face lg-edge-r", film ? "lg-film-edge" : "lg-glass-edge")} />
      <div className={cn("lg-face lg-edge-t", film ? "lg-film-edge" : "lg-glass-edge")} />
    </div>
  );
}

function Hardware() {
  return (
    <div className="lg-slab" data-kind="hardware">
      {/* Perfil em U (alumínio) na base + quatro botões de fixação */}
      <div className="lg-profile" />
      {["lt", "rt", "lb", "rb"].map((c) => (
        <span key={c} className={`lg-fitting lg-fitting--${c}`} />
      ))}
    </div>
  );
}

export function LaminatedGlassScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // 0 = intro, 1..n = camadas, n+1 = fechamento
  const fillRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [reduced, setReduced] = useState(false);
  const drag = useRef({ on: false, x: 0, y: 0, rx: 0, ry: 0, trx: 0, try: 0, used: false });
  const n = laminatedLayers.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Laço único: progresso suavizado → transforms
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let cur = -1;
    let lastActive = -2;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const tick = () => {
      const el = sectionRef.current;
      const scene = sceneRef.current;
      if (el && scene) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const target = clamp(-r.top / Math.max(1, r.height - vh));
        cur = cur < 0 ? target : cur + (target - cur) * (coarse ? 0.22 : 0.12);
        if (Math.abs(target - cur) < 0.0005) cur = target;
        const p = cur;
        const onScreen = r.bottom > -vh * 0.25 && r.top < vh * 1.25;
        if (onScreen) {
          const d = drag.current;
          d.rx += (d.trx - d.rx) * 0.15;
          d.ry += (d.try - d.ry) * 0.15;
          const e = smooth(T.explodeIn[0], T.explodeIn[1], p) * (1 - smooth(T.explodeOut[0], T.explodeOut[1], p));
          const baseY = -34 + 22 * p - 14 * smooth(0.8, 1, p);
          const baseX = 14 - 6 * e;
          scene.style.transform = `rotateX(${baseX + d.rx}deg) rotateY(${baseY + d.ry}deg)`;
          scene.style.setProperty("--shine", `${(p * 260 - 60).toFixed(1)}%`);

          const w = scene.offsetWidth;
          const gap = w * 0.34;
          const stepIdx = p >= T.stepsStart && p < T.closing ? Math.min(n - 1, Math.floor((p - T.stepsStart) / T.stepLen)) : -1;
          layerRefs.current.forEach((node, i) => {
            if (!node) return;
            const z = ((n - 1) / 2 - i) * gap * e;
            const lift = i === stepIdx ? 18 * e : 0;
            node.style.transform = `translate3d(${lift}px, ${-lift * 0.6}px, ${z}px)`;
            node.style.opacity = String(stepIdx < 0 ? 1 : i === stepIdx ? 1 : 0.32 + 0.1 * (1 - e));
            node.dataset.active = String(i === stepIdx);
          });
          tagRefs.current.forEach((t, i) => {
            if (!t) return;
            t.style.opacity = String(e * (stepIdx < 0 || stepIdx === i ? 1 : 0.35));
          });

          // Textos: intro (saudação), camadas, fechamento (segura)
          const ops = [
            1 - smooth(0.13, 0.19, p),
            ...laminatedLayers.map((_, i) => windowOp(p, ...stepWindow(i))),
            smooth(T.closing + 0.01, T.closing + 0.06, p),
          ];
          cardRefs.current.forEach((c, i) => {
            if (!c) return;
            const o = ops[i] ?? 0;
            c.style.opacity = String(o);
            c.style.transform = `translate3d(0, ${(1 - o) * 18}px, 0)`;
            c.style.visibility = o < 0.01 ? "hidden" : "visible";
          });
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
          if (hintRef.current) hintRef.current.style.opacity = String(d.used ? 0 : 1 - smooth(0.85, 0.95, p));
          if (stepIdx !== lastActive) {
            lastActive = stepIdx;
            setActive(stepIdx);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, n]);

  // Arraste para girar
  const onDown = (e: React.PointerEvent) => {
    const d = drag.current;
    d.on = true;
    d.x = e.clientX;
    d.y = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.on) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.x = e.clientX;
    d.y = e.clientY;
    d.try = clamp(d.try + dx * 0.45, -70, 70);
    d.trx = clamp(d.trx - dy * 0.3, -22, 22);
    if (Math.abs(dx) > 2) d.used = true;
  };
  const onUp = () => {
    drag.current.on = false;
  };
  const onKey = (e: React.KeyboardEvent) => {
    const d = drag.current;
    const step = 8;
    if (e.key === "ArrowLeft") d.try = clamp(d.try - step, -70, 70);
    else if (e.key === "ArrowRight") d.try = clamp(d.try + step, -70, 70);
    else if (e.key === "ArrowUp") d.trx = clamp(d.trx + step, -22, 22);
    else if (e.key === "ArrowDown") d.trx = clamp(d.trx - step, -22, 22);
    else if (e.key === "0" || e.key === "Home") { d.try = 0; d.trx = 0; }
    else return;
    d.used = true;
    e.preventDefault();
  };

  /** Rola até o meio da janela de uma camada (controle útil, não decoração). */
  const goTo = useCallback((i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const [a, b] = i < 0 ? [0, 0.1] : i >= n ? [0.86, 0.9] : stepWindow(i);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((a + b) / 2), behavior: "smooth" });
  }, [n]);

  const thick = (l: LaminatedLayer) => (l.kind === "film" ? 4 : 12);

  // ---------- Versão estática (movimento reduzido) ----------
  if (reduced) {
    return (
      <section className="bg-brand-petrol-deep py-20 text-white" aria-labelledby="lg-title" data-testid="laminated-static">
        <div className="container-x">
          <span className="eyebrow eyebrow-light">{laminatedIntro.eyebrow}</span>
          <h2 id="lg-title" className="mt-3 max-w-2xl text-3xl text-white sm:text-4xl">{laminatedIntro.title}</h2>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {laminatedLayers.map((l, i) => (
              <li key={l.id} className="rounded-xl border border-white/15 bg-white/5 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">{i + 1}. {l.part}</p>
                <h3 className="mt-2 text-xl text-white">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{l.text}</p>
              </li>
            ))}
          </ol>
          <Link href="/orcamento?produto=vidro-laminado" className="btn-primary mt-10">Solicitar orçamento <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="lg-act relative bg-brand-petrol-deep text-white" aria-labelledby="lg-title" data-testid="laminated-scroll">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden lg:flex-row lg:items-center">
        {/* Fundo: grade técnica + faixa geométrica da marca */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] [background:linear-gradient(#fff_1px,transparent_1px)_0_0/56px_56px,linear-gradient(90deg,#fff_1px,transparent_1px)_0_0/56px_56px]" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-1/2 w-72 geo-slash bg-brand-orange/85 max-lg:hidden" />

        {/* Texto */}
        <div className="relative order-2 flex-1 px-5 pb-6 sm:px-8 lg:order-1 lg:max-w-[46%] lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-6">
          <div className="relative min-h-[15.5rem] sm:min-h-[14rem] lg:min-h-[24rem]">
            {/* Intro (já visível ao chegar) */}
            <div ref={(n) => { cardRefs.current[0] = n; }} className="lg-card">
              <span className="eyebrow eyebrow-light">{laminatedIntro.eyebrow}</span>
              <h2 id="lg-title" className="mt-3 text-[1.7rem] leading-tight text-white sm:text-4xl lg:text-5xl">{laminatedIntro.title}</h2>
              <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">{laminatedIntro.text}</p>
            </div>
            {laminatedLayers.map((l, i) => (
              <div key={l.id} ref={(n) => { cardRefs.current[i + 1] = n; }} className="lg-card" data-testid={`lg-step-${i}`}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">{l.part}</p>
                <h3 className="mt-2 text-2xl text-white sm:text-3xl lg:text-4xl">{l.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">{l.text}</p>
                <ul className="mt-4 space-y-1.5 max-sm:hidden">
                  {l.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-white/85"><Check className="h-4 w-4 text-brand-orange" /> {b}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div ref={(node) => { cardRefs.current[laminatedLayers.length + 1] = node; }} className="lg-card" data-testid="lg-closing">
              <h3 className="text-2xl text-white sm:text-4xl lg:text-5xl">{laminatedIntro.closingTitle}</h3>
              <p className="mt-3 max-w-md text-base text-white/80 sm:text-lg">{laminatedIntro.closingText}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/orcamento?produto=vidro-laminado" className="btn-primary">Solicitar orçamento <ArrowRight className="h-4 w-4" /></Link>
                <a href={whatsappLink("Olá, Alumaxi! Quero informações sobre vidro laminado.")} target="_blank" rel="noopener noreferrer" className="btn-ghost-light max-sm:hidden"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
            </div>
          </div>

          {/* Etapas: barra de progresso + atalhos para cada camada */}
          <nav aria-label="Camadas do vidro laminado" className="mt-4 lg:mt-10">
            <div className="h-0.5 w-full overflow-hidden bg-white/15"><div ref={fillRef} className="h-full origin-left bg-brand-orange" style={{ transform: "scaleX(0)" }} /></div>
            <ol className="mt-3 flex gap-1.5 sm:gap-2">
              {laminatedLayers.map((l, i) => (
                <li key={l.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active === i ? "step" : undefined}
                    className={cn("w-full rounded-md px-1.5 py-2 text-left text-[0.68rem] font-semibold leading-tight transition-colors sm:px-2.5 sm:text-xs", active === i ? "bg-brand-orange text-white" : "bg-white/8 text-white/70 hover:bg-white/15 hover:text-white")}
                  >
                    <span className="block opacity-70">0{i + 1}</span>
                    <span className="max-sm:hidden">{l.part}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Cena 3D: arraste para girar */}
        <div className="relative order-1 flex h-[54svh] items-center justify-center pt-20 pb-12 lg:order-2 lg:h-full lg:flex-1 lg:py-0">
          <div
            className="lg-stage"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
            tabIndex={0}
            role="img"
            aria-roledescription="modelo 3D interativo"
            aria-label="Vidro laminado em 3D: lâmina externa, película intermediária, lâmina interna e ferragens. Use as setas do teclado para girar."
            data-testid="lg-stage"
          >
            <div ref={sceneRef} className="lg-scene">
              {laminatedLayers.map((l, i) => (
                <div key={l.id} ref={(n) => { layerRefs.current[i] = n; }} className="lg-layer" data-testid={`lg-layer-${i}`}>
                  {l.kind === "hardware" ? <Hardware /> : <GlassSlab layer={l} thick={thick(l)} />}
                  <div ref={(n) => { tagRefs.current[i] = n; }} className="lg-tag" style={{ opacity: 0 }}>
                    <span>0{i + 1}</span> {l.part}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={hintRef} className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur lg:bottom-10" data-testid="lg-hint">
            <Hand className="h-4 w-4 text-brand-orange" /> Arraste para girar o vidro
          </div>
        </div>
      </div>
    </section>
  );
}
