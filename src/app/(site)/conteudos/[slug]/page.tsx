import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SmartImage } from "@/components/ui/SmartImage";
import { Markdown } from "@/components/ui/Markdown";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { CtaBand } from "@/components/ui/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { getAllArticles, getArticle } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return { title: "Artigo não encontrado" };
  return buildMetadata({ title: a.title, description: a.excerpt, path: `/conteudos/${a.slug}`, image: a.image, type: "article" });
}

export default async function ArtigoPage({ params }: Props) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const path = `/conteudos/${a.slug}`;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt, image: a.image, datePublished: a.publishedAt, author: { "@type": "Organization", name: siteConfig.name }, publisher: { "@type": "Organization", name: siteConfig.name }, mainEntityOfPage: new URL(path, siteConfig.url).toString() }} />
      <article>
        <header className="container-x max-w-4xl pt-10">
          <Breadcrumbs items={[{ name: "Conteúdos", path: "/conteudos" }, { name: a.title, path }]} />
          <span className="eyebrow mt-8">{a.category}</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">{a.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{a.excerpt}</p>
          <p className="mt-4 flex items-center gap-4 text-sm text-ink-soft"><span>{formatDate(a.publishedAt)}</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {a.readingMinutes} min de leitura</span></p>
        </header>
        <div className="container-x mt-10 max-w-5xl"><div className="relative aspect-[21/9] overflow-hidden rounded-2xl"><SmartImage src={a.image} alt={a.imageAlt} fill priority sizes="100vw" className="object-cover" /></div></div>
        <div className="container-x max-w-3xl py-12">
          <Markdown source={a.body} />
          <div className="mt-12 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/conteudos" className="inline-flex items-center gap-2 font-semibold text-brand-petrol hover:underline"><ArrowLeft className="h-4 w-4" /> Todos os conteúdos</Link>
            <ShareButtons title={a.title} path={path} />
          </div>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
