"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, MapPin, Menu, Phone, X, ArrowRight } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>("Produtos");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    document.body.dataset.menu = mobileOpen ? "open" : "closed";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setMobileOpen(false), setDropdown(null));
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const openDrop = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdown(label);
  };
  const closeDrop = () => {
    closeTimer.current = setTimeout(() => setDropdown(null), 140);
  };
  // Calculado no navegador (fuso de Fortaleza) para não congelar o dia do build na página estática
  const [today, setToday] = useState<(typeof siteConfig.unit.hours)[number] | null>(null);
  useEffect(() => {
    const wd = new Date().toLocaleDateString("en-US", { weekday: "short", timeZone: "America/Fortaleza" });
    const idx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(wd);
    setToday(siteConfig.unit.hours[idx >= 0 ? idx : 0]);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior */}
      <div className={cn("hidden bg-brand-petrol-deep text-white/85 transition-all duration-300 lg:block", scrolled ? "h-0 overflow-hidden" : "h-10")}>
        <div className="container-x flex h-10 items-center justify-between text-[0.8rem]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-brand-orange" /> {siteConfig.unit.address.street} – {siteConfig.unit.address.district}, Fortaleza/CE</span>
            <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-brand-orange" /> {today ? `Hoje: ${today.open ? `${today.open} às ${today.close}` : "fechado"}` : "Seg. a qui. 7h30–17h30 · sex. 7h–16h"}</span>
          </div>
          <a href={`tel:${siteConfig.unit.phoneE164}`} className="flex items-center gap-2 font-semibold text-white hover:text-brand-orange">
            <Phone className="h-3.5 w-3.5 text-brand-orange" /> {siteConfig.unit.phone}
          </a>
        </div>
      </div>

      {/* Barra principal */}
      <div className={cn("border-b bg-white/95 backdrop-blur transition-all duration-300", scrolled ? "border-line shadow-card" : "border-transparent")}>
        <div className={cn("container-x flex items-center justify-between gap-6 transition-all duration-300", scrolled ? "h-16" : "h-20")}>
          <Link href="/" aria-label="Alumaxi — página inicial" className="shrink-0">
            <Logo className={cn("w-auto transition-all duration-300", scrolled ? "h-10 sm:h-11" : "h-11 sm:h-14")} />
          </Link>

          <nav aria-label="Menu principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) =>
                "children" in item ? (
                  <li key={item.label} className="relative" onMouseEnter={() => openDrop(item.label)} onMouseLeave={closeDrop}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={cn("relative px-3 py-2 text-[0.92rem] font-semibold transition-colors hover:text-brand-petrol", isActive(item.href) || ["/vidros", "/aluminio", "/ferragens-e-acessorios", "/catalogo"].some((p) => pathname.startsWith(p)) ? "text-brand-petrol" : "text-ink")}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Abrir submenu ${item.label}`}
                        aria-expanded={dropdown === item.label}
                        onClick={() => setDropdown((d) => (d === item.label ? null : item.label))}
                        className="-ml-2 rounded p-1 text-ink hover:text-brand-petrol"
                      >
                        <ChevronDown className={cn("h-4 w-4 transition-transform", dropdown === item.label && "rotate-180")} />
                      </button>
                    </div>
                    <AnimatePresence>
                      {dropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-1/2 top-full w-[520px] -translate-x-1/2 pt-3"
                          data-testid="products-dropdown"
                        >
                          <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-white p-3 shadow-lift">
                            {item.children.map((c) => (
                              <Link key={c.href} href={c.href} className="group rounded-lg p-3 transition-colors hover:bg-brand-petrol-light">
                                <span className="flex items-center gap-2 font-bold text-ink group-hover:text-brand-petrol">
                                  <span className="h-2 w-2 bg-brand-orange" /> {c.label}
                                </span>
                                <span className="mt-1 block pl-4 text-sm text-ink-soft">{c.description}</span>
                              </Link>
                            ))}
                            <Link href="/produtos" className="col-span-2 mt-1 flex items-center justify-between rounded-lg bg-brand-petrol px-4 py-3 text-sm font-bold text-white hover:bg-brand-petrol-dark">
                              Ver todos os produtos <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "relative px-3 py-2 text-[0.92rem] font-semibold transition-colors hover:text-brand-petrol after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-orange after:transition-transform hover:after:scale-x-100",
                        isActive(item.href) ? "text-brand-petrol after:scale-x-100" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/orcamento" className="btn-primary btn-sm hidden sm:inline-flex">
              Solicitar orçamento
            </Link>
            <button
              type="button"
              className="rounded-md p-2 text-brand-petrol hover:bg-brand-petrol-light lg:hidden"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 z-40 overflow-y-auto bg-white lg:hidden"
            style={{ top: scrolled ? 64 : 80 }}
          >
            <nav aria-label="Menu mobile" className="container-x py-6">
              <ul className="divide-y divide-line">
                {mainNav.map((item) => (
                  <li key={item.label}>
                    {"children" in item ? (
                      <>
                        <div className="flex items-center justify-between">
                          <Link href={item.href} className="block py-4 text-lg font-bold text-ink">{item.label}</Link>
                          <button
                            type="button"
                            aria-label={`Expandir ${item.label}`}
                            aria-expanded={mobileSub === item.label}
                            onClick={() => setMobileSub((s) => (s === item.label ? null : item.label))}
                            className="rounded p-2 text-brand-petrol"
                          >
                            <ChevronDown className={cn("h-5 w-5 transition-transform", mobileSub === item.label && "rotate-180")} />
                          </button>
                        </div>
                        {mobileSub === item.label && (
                          <ul className="mb-3 space-y-1 border-l-2 border-brand-orange pl-4">
                            {item.children.map((c) => (
                              <li key={c.href}><Link href={c.href} className="block py-2 font-semibold text-ink-soft">{c.label}</Link></li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link href={item.href} className={cn("block py-4 text-lg font-bold", isActive(item.href) ? "text-brand-petrol" : "text-ink")}>{item.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-3">
                <Link href="/orcamento" className="btn-primary">Solicitar orçamento</Link>
                <a href={`tel:${siteConfig.unit.phoneE164}`} className="btn-outline"><Phone className="h-4 w-4" /> {siteConfig.unit.phone}</a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
