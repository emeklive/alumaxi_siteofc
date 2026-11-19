import Link from "next/link";
import { ArrowRight, Building2, Clock, FileText, MapPin, MessageCircle, Phone, Ruler, Store, Star, Quote } from "lucide-react";
import { HeroHome } from "@/components/sections/HeroHome";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollFx } from "@/components/ui/ScrollFx";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { Carousel } from "@/components/ui/Carousel";
import { Gallery } from "@/components/ui/Gallery";
import { seedProducts } from "@/data/products";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { HoursList } from "@/components/ui/HoursList";
import { CtaBand } from "@/components/ui/CtaBand";
import { ProductCard } from "@/components/catalog/ProductCard";
import { categories } from "@/data/categories";
import { images } from "@/data/images";
import { reviews } from "@/data/reviews";
import { siteConfig } from "@/config/site";
import { getAllProducts } from "@/lib/catalog";
import { whatsappLink } from "@/lib/whatsapp";

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = products.filter((p) => p.featured);
  const u = siteConfig.unit;

  const applications = [
    { title: "Esquadrias e reposição", img: images.facadeWindows, q: "esquadrias" },
    { title: "Boxes para banheiro", img: images.bathroomShower, q: "box" },
    { title: "Portões em alumínio", img: images.modernHouse, q: "portões" },
    { title: "Portas de vidro", img: images.glassDoors, q: "portas de vidro" },
    { title: "Prateleiras de vidro", img: images.interiorMirror, q: "prateleiras" },
    { title: "Cozinhas", img: images.kitchen, q: "cozinhas" },
  ];

  const highlights = [
    { icon: Store, title: "Loja física em Fortaleza", text: `${u.address.street}, ${u.address.district}.` },
    { icon: MessageCircle, title: "Atendimento pelo WhatsApp", text: `Fale direto com o comercial: ${u.phone}.` },
    { icon: FileText, title: "Orçamento online", text: "Envie vários itens, medidas, fotos e projetos em um só pedido." },
    { icon: Clock, title: "Segunda a sexta", text: "Seg. a qui. 7h30–17h30 · sex. 7h–16h." },
  ];

  return (
    <>
      <HeroHome />

      {/* Categorias */}
      <section className="relative z-10 -mt-16 sm:-mt-20" aria-labelledby="categorias-title">
        <h2 id="categorias-title" className="sr-only">Categorias de produtos</h2>
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <Link href={c.page} className="group relative block h-56 overflow-hidden rounded-xl bg-brand-petrol shadow-lift sm:h-64" data-testid={`category-${c.id}`}>
                <SmartImage src={c.image} alt={c.imageAlt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-petrol-deep via-brand-petrol-deep/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-3 block h-1 w-10 bg-brand-orange transition-all duration-500 group-hover:w-20" />
                  <h3 className="text-2xl text-white">{c.name}</h3>
                  <p className="mt-1 text-sm text-white/80">{c.short}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white opacity-90 group-hover:text-brand-orange">
                    Ver linha <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Institucional */}
      <section className="container-x grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/5]">
            <ScrollFx className="absolute inset-0" scale={[1.18, 1]}>
              <SmartImage src={images.whiteBuilding.src} alt={images.whiteBuilding.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </ScrollFx>
          </div>
          <ScrollFx y={[60, -60]} className="absolute -bottom-8 -right-2 w-48 overflow-hidden rounded-xl border-4 border-white shadow-lift sm:-right-8 sm:w-64">
            <div className="relative aspect-square"><SmartImage src={images.bathroomShower.src} alt={images.bathroomShower.alt} fill sizes="256px" className="object-cover" /></div>
          </ScrollFx>
          <div aria-hidden className="absolute -left-4 -top-4 -z-10 h-32 w-32 bg-brand-orange geo-slash" />
        </Reveal>
        <Reveal delay={0.1}>
          <SectionHeading
            eyebrow="Sobre a Alumaxi"
            title={<>Qualidade e sofisticação em <span className="text-brand-petrol">alumínio, vidro e espelhos.</span></>}
            text="A Alumaxi atende vidraceiros, serralheiros, instaladores, construtoras, arquitetos e clientes que buscam soluções em vidros e alumínio, com uma loja em Cajazeiras, Fortaleza."
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-petrol-light text-brand-petrol"><h.icon className="h-5 w-5" /></span>
                <div><p className="font-bold">{h.title}</p><p className="mt-1 text-sm text-ink-soft">{h.text}</p></div>
              </li>
            ))}
          </ul>
          <Link href="/sobre" className="btn-outline mt-10">Conheça a Alumaxi <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </section>

      {/* Destaques */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Destaques" title="Linhas em destaque" text="Uma seleção das linhas mais procuradas. Consulte a disponibilidade e as especificações com nossa equipe." />
            <Link href="/catalogo" className="btn-secondary shrink-0">Abrir catálogo digital <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-12">
            <Carousel label="Produtos em destaque">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Vidraceiros */}
      <section className="relative isolate overflow-hidden bg-brand-petrol py-20 text-white sm:py-28">
        <ScrollFx aria-hidden className="absolute -left-20 top-0 -z-10 h-full w-80" y={[-60, 60]}><div className="h-full w-full geo-slash bg-brand-petrol-dark" /></ScrollFx>
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Para profissionais"
              title="Feito para quem vive a rotina da obra."
              text="Vidraceiros, serralheiros, instaladores e empresas de esquadrias encontram na Alumaxi um parceiro para abastecer os projetos do dia a dia."
            />
            <ul className="mt-8 space-y-4">
              {[
                { icon: Ruler, t: "Envie medidas, quantidades e projetos pelo orçamento online, com vários itens em um mesmo pedido." },
                { icon: Building2, t: "Atendimento para obras residenciais, comerciais e de construtoras." },
                { icon: MessageCircle, t: "Canal direto pelo WhatsApp com a equipe comercial." },
              ].map((x) => (
                <li key={x.t} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-orange"><x.icon className="h-5 w-5" /></span><p className="pt-2 text-white/85">{x.t}</p></li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/orcamento" className="btn-primary">Enviar meu projeto <ArrowRight className="h-4 w-4" /></Link>
              <a href={whatsappLink("Olá, Alumaxi! Sou profissional (vidraceiro/serralheiro) e gostaria de atendimento.")} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">Falar com o comercial</a>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <ScrollFx className="absolute inset-0" scale={[1.15, 1]} y={[-20, 20]}><SmartImage src={images.constructionWorkers.src} alt={images.constructionWorkers.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" /></ScrollFx>
            </div>
            <figure className="relative -mt-14 ml-6 mr-6 rounded-xl bg-white p-6 text-ink shadow-lift sm:ml-12">
              <Quote className="h-7 w-7 text-brand-orange" />
              <blockquote className="mt-2 font-semibold leading-relaxed">“{reviews[1].text}”</blockquote>
              <figcaption className="mt-3 text-sm text-ink-soft">{reviews[1].author} · avaliação no Google</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Aplicações */}
      <section className="container-x py-20 sm:py-28">
        <SectionHeading align="center" eyebrow="Aplicações" title="Soluções para cada ambiente" text="Do banheiro à fachada, os materiais certos fazem a diferença no resultado final." />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 0.08}>
              <Link href={`/catalogo?busca=${encodeURIComponent(a.q)}`} className="group relative block aspect-[4/3] overflow-hidden rounded-xl">
                <SmartImage src={a.img.src} alt={a.img.alt} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-colors group-hover:from-brand-petrol-deep/90" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <h3 className="text-xl text-white">{a.title}</h3>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-brand-orange"><ArrowRight className="h-5 w-5" /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Galeria */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Galeria" title="Produtos Alumaxi" text="Fotos dos produtos disponíveis na loja. Clique nas imagens para ampliar." />
          <Gallery
            className="mt-12"
            items={["mola-action-pequena", "puxador-inox", "ventosa-dupla-tripla", "puxador-400x300", "lambri-tubular-triplo", "tucano", "roldana-guia-buzio-duplo", "vidro-temperado", "kit-pia"].map((slug) => {
              const prod = seedProducts.find((x) => x.slug === slug)!;
              return { src: prod.image, alt: prod.name };
            })}
          />
        </div>
      </section>

      {/* Avaliações */}
      <section className="container-x py-20 sm:py-28" aria-labelledby="avaliacoes">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <span className="eyebrow">Avaliações públicas</span>
            <h2 id="avaliacoes" className="mt-3 text-3xl sm:text-4xl">O que dizem no Google</h2>
            <div className="mt-8 flex items-end gap-4">
              <span className="text-7xl font-extrabold leading-none text-brand-petrol">{u.googleRating.value.toLocaleString("pt-BR")}</span>
              <div className="pb-1">
                <div className="flex">{[0, 1, 2, 3].map((i) => <Star key={i} className="h-5 w-5 fill-brand-orange text-brand-orange" />)}<Star className="h-5 w-5 text-brand-orange" /></div>
                <p className="mt-1 text-sm text-ink-soft">{u.googleRating.count} avaliações no Google Maps</p>
              </div>
            </div>
            <a href={u.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-8">Ver avaliações no Google <ArrowRight className="h-4 w-4" /></a>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.author} delay={i * 0.08}>
                <figure className="card flex h-full flex-col p-6">
                  <Quote className="h-6 w-6 text-brand-orange" />
                  <blockquote className="mt-3 flex-1 leading-relaxed text-ink">“{r.text}”</blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4 text-sm"><strong>{r.author}</strong><span className="block text-ink-soft">{r.when}</span></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading eyebrow="Localização" title="Visite nossa loja em Cajazeiras" />
            <ul className="mt-8 space-y-5">
              <li className="flex gap-4"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" /><div><p className="font-bold">Endereço</p><p className="text-ink-soft">{u.address.full}</p></div></li>
              <li className="flex gap-4"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" /><div><p className="font-bold">Telefone e WhatsApp</p><a href={`tel:${u.phoneE164}`} className="text-ink-soft hover:text-brand-petrol">{u.phone}</a></div></li>
              <li className="flex gap-4"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" /><div className="flex-1"><p className="mb-2 font-bold">Horário de atendimento</p><HoursList /><p className="mt-2 text-xs text-ink-soft">{u.hoursNote}</p></div></li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={u.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Como chegar</a>
              <Link href="/contato" className="btn-outline">Página de contato</Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}><MapEmbed className="h-[380px] lg:h-full lg:min-h-[480px]" /></Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
