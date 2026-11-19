"use client";
import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Mapa do Google carregado sob demanda (melhor desempenho e privacidade/LGPD). */
export function MapEmbed({ className = "h-[420px]" }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const u = siteConfig.unit;
  return (
    <div className={`relative overflow-hidden rounded-xl border border-line bg-brand-petrol-light ${className}`} data-testid="map">
      {loaded ? (
        <iframe
          title="Mapa da Alumaxi Fortaleza no Google Maps"
          src={u.mapEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
          aria-label="Carregar mapa interativo do Google Maps"
        >
          <div aria-hidden className="absolute inset-0 opacity-60 [background:linear-gradient(var(--color-line)_1px,transparent_1px)_0_0/40px_40px,linear-gradient(90deg,var(--color-line)_1px,transparent_1px)_0_0/40px_40px]" />
          <div aria-hidden className="absolute left-0 top-1/2 h-6 w-full -rotate-6 bg-white/80" />
          <div aria-hidden className="absolute left-1/3 top-0 h-full w-5 rotate-12 bg-white/80" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange text-white shadow-lift transition-transform group-hover:scale-110">
            <MapPin className="h-8 w-8" />
          </span>
          <span className="relative max-w-xs font-semibold text-ink">{u.address.full}</span>
          <span className="relative btn-secondary btn-sm">Carregar mapa interativo</span>
        </button>
      )}
      <a
        href={u.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-bold text-brand-petrol shadow-card hover:bg-brand-petrol hover:text-white"
      >
        <Navigation className="h-4 w-4" /> Abrir rota
      </a>
    </div>
  );
}
