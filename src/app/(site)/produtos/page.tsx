import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { CtaBand } from "@/components/ui/CtaBand";
import { SmartImage } from "@/components/ui/SmartImage";
import { categories } from "@/data/categories";
import { images } from "@/data/images";
import { getAllProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Produtos: vidros, alumínio, ferragens e acessórios",
  description: "Conheça as linhas de vidros, alumínio, ferragens e acessórios da Alumaxi Fortaleza. Busque, filtre e solicite orçamento.",
  path: "/produtos",
});

export default async function ProdutosPage() {
  const products = await getAllProducts();
  return (
    <>
      <PageHero
        title="Produtos"
        text="Vidros, alumínio, ferragens e acessórios para profissionais da construção e clientes que buscam soluções completas."
        image={images.glassFacade.src}
        imageAlt={images.glassFacade.alt}
        crumbs={[{ name: "Produtos", path: "/produtos" }]}
        eyebrow="Linhas Alumaxi"
      />
      <section className="container-x py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.id} href={c.page} className="group flex items-center gap-4 rounded-xl border border-line bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-lift">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg"><SmartImage src={c.image} alt={c.imageAlt} fill sizes="64px" className="object-cover" /></span>
              <span className="flex-1"><span className="block font-bold group-hover:text-brand-petrol">{c.name}</span><span className="text-xs text-ink-soft">{c.subcategories.length} linhas</span></span>
              <ArrowRight className="mr-2 h-4 w-4 text-brand-orange transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <Suspense fallback={<p className="text-ink-soft">Carregando catálogo...</p>}>
            <CatalogBrowser products={products} categories={categories} />
          </Suspense>
        </div>
      </section>
      <CtaBand title="Não encontrou o item que procura?" text="Descreva o produto no orçamento: nossa equipe verifica a disponibilidade e retorna para você." />
    </>
  );
}
