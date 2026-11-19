import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SmartImage } from "@/components/ui/SmartImage";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Gallery } from "@/components/ui/Gallery";
import { JsonLd } from "@/components/ui/JsonLd";
import { LaminatedGlassScroll } from "@/components/sections/LaminatedGlassScroll";
import { getCategory, subcategoryName } from "@/data/categories";
import { getAllProducts, getProduct } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink, productWhatsappMessage } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Produto não encontrado" };
  return buildMetadata({ title: p.name, description: `${p.summary} Solicite orçamento na Alumaxi Fortaleza.`, path: `/produtos/${p.slug}`, image: p.image });
}

export default async function ProdutoPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const related = (await getAllProducts()).filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const path = `/produtos/${p.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.description,
          image: p.image,
          category: cat.name,
          brand: { "@type": "Brand", name: siteConfig.name },
          url: new URL(path, siteConfig.url).toString(),
        }}
      />
      <section className="border-b border-line bg-surface">
        <div className="container-x py-5"><Breadcrumbs items={[{ name: "Produtos", path: "/produtos" }, { name: cat.name, path: cat.page }, { name: p.name, path }]} /></div>
      </section>
      <section className="container-x grid gap-12 py-14 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-petrol-light lg:sticky lg:top-28 lg:self-start">
          <SmartImage src={p.image} alt={p.imageAlt} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <span className="absolute left-4 top-4 rounded bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-petrol">{cat.name}</span>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-petrol">{subcategoryName(p.category, p.subcategory)}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{p.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{p.description}</p>

          <h2 className="mt-8 text-lg">Aplicações</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {p.applications.map((a) => <li key={a} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-orange" /> {a}</li>)}
          </ul>

          <h2 className="mt-8 text-lg">Características técnicas</h2>
          {p.specs.length ? (
            <dl className="mt-3 divide-y divide-line rounded-lg border border-line">
              {p.specs.map((s) => <div key={s.label} className="flex justify-between gap-4 px-4 py-3 text-sm"><dt className="text-ink-soft">{s.label}</dt><dd className="font-semibold">{s.value}</dd></div>)}
            </dl>
          ) : (
            <p className="mt-3 flex gap-2 rounded-lg bg-brand-petrol-light p-4 text-sm text-brand-petrol-dark"><Info className="h-5 w-5 shrink-0" /> Espessuras, dimensões, cores e acabamentos são confirmados pela equipe comercial conforme a disponibilidade.</p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/orcamento?produto=${p.slug}`} className="btn-primary" data-testid="product-quote">Solicitar orçamento <ArrowRight className="h-4 w-4" /></Link>
            <a href={whatsappLink(productWhatsappMessage(p.name))} target="_blank" rel="noopener noreferrer" className="btn-outline"><MessageCircle className="h-4 w-4" /> Solicitar informações</a>
          </div>
          <div className="mt-8 border-t border-line pt-6"><ShareButtons title={`${p.name} — Alumaxi`} path={path} /></div>
        </div>
      </section>
      {p.slug === "vidro-laminado" && <LaminatedGlassScroll />}
      {p.gallery && p.gallery.length > 0 && (
        <section className="container-x pb-14"><h2 className="mb-6 text-2xl">Galeria</h2><Gallery items={p.gallery} /></section>
      )}
      {related.length > 0 && (
        <section className="bg-surface py-16">
          <div className="container-x">
            <h2 className="text-2xl sm:text-3xl">Outros itens de {cat.name.toLowerCase()}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
