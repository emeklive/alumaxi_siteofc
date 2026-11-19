"use client";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Search, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import type { Product, Category } from "@/types";
import { ProductCard } from "./ProductCard";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function CatalogBrowser({ products, categories, initialCategory = "todos", lockCategory = false }: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  lockCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("busca") ?? "");
  const [cat, setCat] = useState(lockCategory ? initialCategory : params.get("categoria") ?? initialCategory);
  const [sub, setSub] = useState(params.get("linha") ?? "todas");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Sincroniza filtros com a URL (links compartilháveis)
  useEffect(() => {
    if (lockCategory) return;
    const sp = new URLSearchParams();
    if (q) sp.set("busca", q);
    if (cat !== "todos") sp.set("categoria", cat);
    if (sub !== "todas") sp.set("linha", sub);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [q, cat, sub, lockCategory, pathname, router]);

  const activeCat = categories.find((c) => c.id === cat);
  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    return products.filter((p) => {
      if (cat !== "todos" && p.category !== cat) return false;
      if (sub !== "todas" && p.subcategory !== sub) return false;
      if (!nq) return true;
      return norm([p.name, p.summary, p.description, ...p.applications].join(" ")).includes(nq);
    });
  }, [products, q, cat, sub]);

  const clear = () => { setQ(""); if (!lockCategory) setCat("todos"); setSub("todas"); };

  return (
    <div data-testid="catalog">
      <div className="rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Buscar produtos</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por produto ou aplicação (ex.: box, guarda-corpo, perfil)"
              className="input !pl-12"
              data-testid="catalog-search"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-semibold text-ink-soft sm:inline">Exibição:</span>
            <button type="button" aria-label="Exibir em grade" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={cn("rounded-md border p-2.5", view === "grid" ? "border-brand-petrol bg-brand-petrol text-white" : "border-line text-ink-soft hover:border-brand-petrol")}><LayoutGrid className="h-5 w-5" /></button>
            <button type="button" aria-label="Exibir em lista" aria-pressed={view === "list"} onClick={() => setView("list")} className={cn("rounded-md border p-2.5", view === "list" ? "border-brand-petrol bg-brand-petrol text-white" : "border-line text-ink-soft hover:border-brand-petrol")}><List className="h-5 w-5" /></button>
          </div>
        </div>

        {!lockCategory && (
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
            {[{ id: "todos", name: "Todos" }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.id}
                onClick={() => { setCat(c.id); setSub("todas"); }}
                className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition", cat === c.id ? "border-brand-orange bg-brand-orange text-white" : "border-line text-ink hover:border-brand-orange hover:text-brand-orange-dark")}
                data-testid={`filter-${c.id}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {activeCat && (
          <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por linha">
            <SlidersHorizontal className="h-4 w-4 text-ink-soft" />
            {[{ id: "todas", name: "Todas as linhas" }, ...activeCat.subcategories].map((s) => (
              <button key={s.id} type="button" aria-pressed={sub === s.id} onClick={() => setSub(s.id)}
                className={cn("rounded-md px-3 py-1.5 text-sm font-semibold transition", sub === s.id ? "bg-brand-petrol text-white" : "bg-surface text-ink-soft hover:bg-brand-petrol-light hover:text-brand-petrol")}>
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-ink-soft" aria-live="polite">
        <p><strong className="text-ink" data-testid="catalog-count">{filtered.length}</strong> {filtered.length === 1 ? "item encontrado" : "itens encontrados"}</p>
        {(q || (!lockCategory && cat !== "todos") || sub !== "todas") && (
          <button type="button" onClick={clear} className="inline-flex items-center gap-1 font-semibold text-brand-petrol hover:underline"><X className="h-4 w-4" /> Limpar filtros</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="text-lg font-bold">Nenhum item encontrado.</p>
          <p className="mt-2 text-ink-soft">Não encontrou o que procura? Descreva o item no orçamento que nossa equipe verifica a disponibilidade.</p>
          <Link href="/orcamento" className="btn-primary mt-6">Solicitar orçamento</Link>
        </div>
      ) : view === "grid" ? (
        <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}>
                <ProductCard product={p} priority={i < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {filtered.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-4 transition hover:bg-surface">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-brand-petrol-light sm:w-32">
                <SmartImage src={p.image} alt={p.imageAlt} fill sizes="128px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-petrol">{categories.find((c) => c.id === p.category)?.name}</p>
                <Link href={`/produtos/${p.slug}`} className="font-bold hover:text-brand-petrol">{p.name}</Link>
                <p className="hidden truncate text-sm text-ink-soft sm:block">{p.summary}</p>
              </div>
              <Link href={`/orcamento?produto=${p.slug}`} className="btn-primary btn-sm shrink-0 !px-3 text-xs">Orçamento</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
