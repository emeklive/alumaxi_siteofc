import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/ui/Reveal";
import { images } from "@/data/images";
import { getAllArticles } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Conteúdos e dicas",
  description: "Dicas sobre vidros, alumínio, ferragens, instalação e tendências do mercado vidreiro.",
  path: "/conteudos",
});

const topics = ["Vidros", "Alumínio", "Ferragens", "Instalação", "Arquitetura", "Construção civil", "Tendências"];

export default async function ConteudosPage() {
  const articles = await getAllArticles();
  const [first, ...rest] = articles;
  return (
    <>
      <PageHero title="Conteúdos e dicas" text="Informação técnica e prática para quem trabalha com vidros, alumínio e construção civil." image={images.plans.src} imageAlt={images.plans.alt} crumbs={[{ name: "Conteúdos", path: "/conteudos" }]} eyebrow="Blog Alumaxi" />
      <section className="container-x py-14">
        <div className="flex flex-wrap gap-2">{topics.map((t) => <span key={t} className="rounded-full bg-brand-petrol-light px-4 py-1.5 text-sm font-semibold text-brand-petrol">{t}</span>)}</div>
        {first && (
          <Reveal className="mt-10">
            <Link href={`/conteudos/${first.slug}`} className="group grid overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:shadow-lift lg:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto"><SmartImage src={first.image} alt={first.imageAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <span className="eyebrow">{first.category}</span>
                <h2 className="mt-3 text-3xl group-hover:text-brand-petrol">{first.title}</h2>
                <p className="mt-4 text-ink-soft">{first.excerpt}</p>
                <p className="mt-6 flex items-center gap-4 text-sm text-ink-soft"><span>{formatDate(first.publishedAt)}</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {first.readingMinutes} min</span></p>
                <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-petrol">Ler artigo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          </Reveal>
        )}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08}>
              <Link href={`/conteudos/${a.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift" data-testid="article-card">
                <div className="relative aspect-[16/10] overflow-hidden"><SmartImage src={a.image} alt={a.imageAlt} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-petrol">{a.category}</span>
                  <h3 className="mt-2 text-xl group-hover:text-brand-petrol">{a.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">{a.excerpt}</p>
                  <p className="mt-4 text-xs text-ink-soft">{formatDate(a.publishedAt)} · {a.readingMinutes} min de leitura</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
