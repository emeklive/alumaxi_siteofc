import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { getCategory, subcategoryName } from "@/data/categories";
import { SmartImage } from "@/components/ui/SmartImage";
import { whatsappLink, productWhatsappMessage } from "@/lib/whatsapp";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const cat = getCategory(product.category);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift" data-testid="product-card">
      <Link href={`/produtos/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-brand-petrol-light" aria-label={`Ver detalhes: ${product.name}`}>
        <SmartImage src={product.image} alt={product.imageAlt} fill priority={priority} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded bg-white/95 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-brand-petrol">{cat?.name}</span>
        <span className="absolute bottom-0 right-0 flex h-12 w-12 translate-x-2 translate-y-2 items-center justify-center bg-brand-orange text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-ink-soft">{subcategoryName(product.category, product.subcategory)}</p>
        <h3 className="mt-1 text-lg"><Link href={`/produtos/${product.slug}`} className="hover:text-brand-petrol">{product.name}</Link></h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">{product.summary}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <a href={whatsappLink(productWhatsappMessage(product.name))} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm !px-2 text-xs">
            <MessageCircle className="h-4 w-4" /> Informações
          </a>
          <Link href={`/orcamento?produto=${product.slug}`} className="btn-primary btn-sm !px-2 text-xs">Orçamento</Link>
        </div>
      </div>
    </article>
  );
}
