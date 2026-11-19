import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function Breadcrumbs({ items, light = false }: { items: { name: string; path: string }[]; light?: boolean }) {
  const all = [{ name: "Início", path: "/" }, ...items];
  return (
    <nav aria-label="Trilha de navegação" className="text-sm">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className={`flex flex-wrap items-center gap-1.5 ${light ? "text-white/75" : "text-ink-soft"}`}>
        {all.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
            {i === all.length - 1 ? (
              <span aria-current="page" className={light ? "font-semibold text-white" : "font-semibold text-ink"}>{it.name}</span>
            ) : (
              <Link href={it.path} className="hover:underline underline-offset-4">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
