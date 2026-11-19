import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import type { Category, Product } from "@/types";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaBand } from "@/components/ui/CtaBand";
import { ScrollFx } from "@/components/ui/ScrollFx";
import { whatsappLink, productWhatsappMessage } from "@/lib/whatsapp";

export function CategoryLanding({
  title, text, heroImage, heroAlt, path, groups, intro, feature,
}: {
  feature?: React.ReactNode;
  title: string;
  text: string;
  heroImage: string;
  heroAlt: string;
  path: string;
  intro: { title: string; text: string; bullets: string[]; image: string; imageAlt: string };
  groups: { category: Category; products: Product[] }[];
}) {
  return (
    <>
      <PageHero title={title} text={text} image={heroImage} imageAlt={heroAlt} crumbs={[{ name: "Produtos", path: "/produtos" }, { name: title, path }]} eyebrow="Linha de produtos">
        <Link href="/orcamento" className="btn-primary">Solicitar orçamento</Link>
        <Link href="/catalogo" className="btn-ghost-light">Catálogo digital</Link>
      </PageHero>

      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow">Visão geral</span>
          <h2 className="mt-3 text-3xl sm:text-4xl">{intro.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro.text}</p>
          <ul className="mt-6 space-y-3">
            {intro.bullets.map((b) => (
              <li key={b} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" /><span className="text-ink">{b}</span></li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <ScrollFx className="absolute inset-0" scale={[1.18, 1]}><SmartImage src={intro.image} alt={intro.imageAlt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" /></ScrollFx>
          <div aria-hidden className="absolute -bottom-1 -right-1 h-24 w-40 geo-slash bg-brand-orange" />
        </Reveal>
      </section>

      {feature}

      {groups.map(({ category, products }) => (
        <section key={category.id} id={category.id} className="scroll-mt-28 border-t border-line bg-surface py-20">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="eyebrow">{category.name}</span>
                <h2 className="mt-3 text-3xl">{category.description}</h2>
              </div>
              <Link href={`/catalogo?categoria=${category.id}`} className="btn-outline btn-sm shrink-0">Filtrar no catálogo <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 2) * 0.08}>
                  <article className="group grid h-full overflow-hidden rounded-xl border border-line bg-white shadow-card transition hover:shadow-lift sm:grid-cols-[0.9fr_1.1fr]" data-testid="line-card">
                    <Link href={`/produtos/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden sm:aspect-auto">
                      <SmartImage src={p.image} alt={p.imageAlt} fill sizes="(min-width:768px) 22vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </Link>
                    <div className="flex flex-col p-6">
                      <h3 className="text-xl"><Link href={`/produtos/${p.slug}`} className="hover:text-brand-petrol">{p.name}</Link></h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.summary}</p>
                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-petrol">Aplicações</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {p.applications.map((a) => <li key={a} className="rounded bg-brand-petrol-light px-2 py-1 text-xs font-semibold text-brand-petrol">{a}</li>)}
                      </ul>
                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-petrol">Características</p>
                      {p.specs.length ? (
                        <ul className="mt-2 space-y-1 text-sm">{p.specs.map((s) => <li key={s.label}><strong>{s.label}:</strong> {s.value}</li>)}</ul>
                      ) : (
                        <p className="mt-1 text-sm text-ink-soft">Especificações técnicas sob consulta.</p>
                      )}
                      <div className="mt-auto flex flex-wrap gap-2 pt-6">
                        <Link href={`/orcamento?produto=${p.slug}`} className="btn-primary btn-sm">Solicitar orçamento</Link>
                        <a href={whatsappLink(productWhatsappMessage(p.name))} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm"><MessageCircle className="h-4 w-4" /> Informações</a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
      <CtaBand />
    </>
  );
}
