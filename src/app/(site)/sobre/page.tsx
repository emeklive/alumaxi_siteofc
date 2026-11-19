import Link from "next/link";
import { ArrowRight, Camera, Handshake, MapPin, ShieldCheck, Store, Timer, Gem } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { CtaBand } from "@/components/ui/CtaBand";
import { about } from "@/data/about";
import { images } from "@/data/images";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sobre a Alumaxi",
  description: "Conheça a Alumaxi: vidros, alumínio, ferragens e acessórios em Fortaleza, com loja em Cajazeiras.",
  path: "/sobre",
  image: images.whiteBuilding.src,
});

const valueIcons = [ShieldCheck, Gem, Timer, Handshake];

export default function SobrePage() {
  const u = siteConfig.unit;
  return (
    <>
      <PageHero title="Sobre a Alumaxi" text={siteConfig.slogan} image={images.whiteBuilding.src} imageAlt={images.whiteBuilding.alt} crumbs={[{ name: "Sobre", path: "/sobre" }]} eyebrow="Institucional" />

      <section className="container-x grid items-center gap-14 py-20 lg:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow="Quem somos" title="Materiais para quem constrói com qualidade" />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{about.whoWeAre}</p>
          <h3 className="mt-10 text-xl">Nossa história</h3>
          <p className="mt-3 leading-relaxed text-ink-soft" data-pending={about.history ? undefined : "history"}>
            {about.history ?? "A trajetória da Alumaxi será contada aqui em breve. Enquanto isso, visite nossa loja em Cajazeiras e conheça nossa equipe."}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
          <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl"><SmartImage src={images.glassUnderConstruction.src} alt={images.glassUnderConstruction.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" /></div>
          <div className="relative aspect-square overflow-hidden rounded-2xl"><SmartImage src={images.blueprint.src} alt={images.blueprint.alt} fill sizes="22vw" className="object-cover" /></div>
          <div className="relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl bg-brand-orange p-6 text-white">
            <div aria-hidden className="absolute -right-6 -top-6 h-24 w-24 geo-slash bg-white/20" />
            <p className="text-sm font-semibold uppercase tracking-widest text-white/85">Nossa mensagem</p>
            <p className="mt-2 text-lg font-bold leading-snug">Qualidade e sofisticação em alumínio, vidro e espelhos.</p>
          </div>
        </Reveal>
      </section>

      <section className="bg-brand-petrol-deep py-20 text-white">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading light eyebrow="Nossa atuação" title="Presença no Ceará" text="Atendemos Fortaleza e região metropolitana a partir da nossa loja em Cajazeiras." />
            <ul className="mt-8 space-y-4">
              <li className="flex gap-4 rounded-xl bg-white/5 p-5">
                <Store className="h-6 w-6 shrink-0 text-brand-orange" />
                <div><p className="font-bold">{u.label}</p><p className="text-sm text-white/75">{u.address.full}</p></div>
              </li>
              {siteConfig.otherUnits.map((o) => (
                <li key={o.id} className="flex gap-4 rounded-xl bg-white/5 p-5">
                  <MapPin className="h-6 w-6 shrink-0 text-brand-orange" />
                  <div><p className="font-bold">{o.label}</p><p className="text-sm text-white/75">{o.city} · unidade com atendimento próprio</p></div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading light eyebrow="Nosso compromisso" title="Parceria do pedido à entrega do material" />
            <p className="mt-5 text-lg leading-relaxed text-white/80">{about.commitment}</p>
            <Link href="/orcamento" className="btn-primary mt-8">Solicitar orçamento <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHeading align="center" eyebrow="Valores" title="O que nos orienta" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v, i) => {
            const Icon = valueIcons[i % valueIcons.length];
            return (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="card group h-full p-7 transition hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-petrol-light text-brand-petrol transition group-hover:bg-brand-orange group-hover:text-white"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-5 text-xl">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Estrutura e localização" title="Venha conhecer a loja" text="Loja física em Cajazeiras, com atendimento de segunda a sexta-feira." />
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <p className="flex items-center gap-2 font-bold"><Camera className="h-5 w-5 text-brand-orange" /> Fotos da unidade</p>
              <p className="mt-2 text-sm text-ink-soft">Veja as fotos da loja publicadas no perfil da Alumaxi no Google Maps.</p>
              <a href={u.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm mt-4">Ver fotos no Google Maps</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><MapEmbed /></Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
