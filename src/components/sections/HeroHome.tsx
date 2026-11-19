"use client";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { useRef } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { images } from "@/data/images";
import { siteConfig } from "@/config/site";

export function HeroHome() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-brand-petrol-deep lg:min-h-[calc(100svh-7.5rem)]" data-testid="hero">
      <motion.div style={{ y }} className="absolute inset-0 -z-20">
        <SmartImage src={images.hero.src} alt={images.hero.alt} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-petrol-deep/95 via-brand-petrol-deep/75 to-brand-petrol-deep/20" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-brand-petrol-deep/70 to-transparent" />
      {/* Elementos geométricos da marca */}
      <div aria-hidden style={{ animationDelay: "0.3s" }} className="slide-in absolute -right-24 bottom-0 -z-10 hidden h-[70%] w-[22rem] geo-slash bg-brand-orange md:block" />
      <div aria-hidden style={{ animationDelay: "0.45s" }} className="slide-in absolute right-60 bottom-0 -z-10 hidden h-[45%] w-32 geo-slash bg-white/15 md:block" />

      <div className="container-x py-20">
        <span className="hero-in eyebrow eyebrow-light" style={{ animationDelay: "0.05s" }}>Alumaxi Fortaleza</span>
        <h1 className="hero-in mt-5 max-w-4xl text-[2.6rem] leading-[1.05] text-white sm:text-6xl lg:text-7xl" style={{ animationDelay: "0.15s" }}>
          Seu projeto começa com os <span className="text-brand-orange">materiais certos.</span>
        </h1>
        <p className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl" style={{ animationDelay: "0.3s" }}>
          Vidros, alumínio, ferragens e acessórios para profissionais que buscam qualidade e confiança.
        </p>
        <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.45s" }}>
          <Link href="/orcamento" className="btn-primary text-base">Solicitar orçamento <ArrowRight className="h-5 w-5" /></Link>
          <Link href="/produtos" className="btn-ghost-light text-base">Conhecer produtos</Link>
        </div>
        <div className="hero-in mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/80" style={{ animationDelay: "0.6s" }}>
          <a href={siteConfig.unit.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
            <span className="flex">{[0, 1, 2, 3].map((i) => <Star key={i} className="h-4 w-4 fill-brand-orange text-brand-orange" />)}<Star className="h-4 w-4 text-brand-orange" /></span>
            <strong className="text-white">{siteConfig.unit.googleRating.value.toLocaleString("pt-BR")}</strong> no Google
          </a>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-orange" /> Loja em Cajazeiras · Fortaleza/CE</span>
        </div>
      </div>
    </section>
  );
}
