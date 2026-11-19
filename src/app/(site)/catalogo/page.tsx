import { Suspense } from "react";
import { Download, FileText } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { Gallery } from "@/components/ui/Gallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { categories } from "@/data/categories";
import { catalogs } from "@/data/catalogs";
import { images } from "@/data/images";
import { getAllProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Catálogo digital",
  description: "Catálogo digital da Alumaxi: busque e filtre vidros, alumínio, ferragens e acessórios e solicite orçamento online.",
  path: "/catalogo",
});

export default async function CatalogoPage() {
  const products = await getAllProducts();
  return (
    <>
      <PageHero
        title="Catálogo digital"
        text="Pesquise por produto ou aplicação, filtre por categoria e linha, compartilhe e solicite orçamento em poucos cliques."
        image={images.officeGlass.src}
        imageAlt={images.officeGlass.alt}
        crumbs={[{ name: "Catálogo digital", path: "/catalogo" }]}
        eyebrow="Explore"
      />
      <section className="container-x py-14">
        <Suspense fallback={<p className="text-ink-soft">Carregando catálogo...</p>}>
          <CatalogBrowser products={products} categories={categories} />
        </Suspense>
      </section>

      <section className="bg-surface py-16">
        <div className="container-x">
          <SectionHeading eyebrow="Galeria de produtos" title="Visualize as aplicações" text="Clique para ampliar." />
          <Gallery className="mt-10" items={products.slice(0, 9).map((p) => ({ src: p.image, alt: `${p.name} — ${p.imageAlt}` }))} />
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid items-center gap-10 rounded-2xl border border-line p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="eyebrow">Catálogos em PDF</span>
            <h2 className="mt-3 text-3xl">Precisa do catálogo completo?</h2>
            <p className="mt-3 text-ink-soft">
              {catalogs.length ? "Baixe os catálogos oficiais disponibilizados pela Alumaxi." : "Solicite os catálogos e tabelas técnicas atualizados diretamente com a equipe comercial."}
            </p>
            {catalogs.length > 0 && (
              <ul className="mt-6 space-y-3">
                {catalogs.map((c) => (
                  <li key={c.file} className="flex items-center justify-between gap-4 rounded-lg border border-line p-4">
                    <span className="flex items-center gap-3"><FileText className="h-6 w-6 text-brand-orange" /><span><strong>{c.title}</strong>{c.size && <span className="block text-xs text-ink-soft">PDF · {c.size}</span>}</span></span>
                    <span className="flex gap-2">
                      <a href={c.file} target="_blank" rel="noopener" className="btn-outline btn-sm">Visualizar</a>
                      <a href={c.file} download className="btn-primary btn-sm"><Download className="h-4 w-4" /> Baixar</a>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex lg:justify-end">
            <a href={whatsappLink("Olá, Alumaxi! Gostaria de receber o catálogo de produtos.")} target="_blank" rel="noopener noreferrer" className="btn bg-[#1FAF54] text-white hover:bg-[#178f44]"><WhatsAppIcon /> Pedir catálogo pelo WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
