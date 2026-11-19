import { Clock, FileText, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { categories } from "@/data/categories";
import { images } from "@/data/images";
import { siteConfig } from "@/config/site";
import { getAllProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";
import { PreselectQuote } from "./PreselectQuote";

export const metadata = buildMetadata({
  title: "Solicitar orçamento",
  description: "Peça seu orçamento de vidros, alumínio, ferragens e acessórios. Adicione vários itens, medidas, fotos e projetos.",
  path: "/orcamento",
});

export default async function OrcamentoPage() {
  const products = await getAllProducts();
  const u = siteConfig.unit;
  return (
    <>
      <PageHero
        title="Solicitar orçamento"
        text="Monte seu pedido com quantos itens precisar, informe medidas e anexe fotos ou projetos. A equipe comercial retorna com os valores e a disponibilidade."
        image={images.blueprint.src}
        imageAlt={images.blueprint.alt}
        crumbs={[{ name: "Orçamento", path: "/orcamento" }]}
        eyebrow="Atendimento comercial"
      />
      <section className="bg-surface py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_320px]">
          <PreselectQuote products={products} categories={categories} />
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h2 className="text-lg">Como funciona</h2>
              <ol className="mt-4 space-y-4 text-sm">
                {[
                  { i: FileText, t: "Preencha seus dados e os itens desejados." },
                  { i: MessageCircle, t: "A equipe comercial analisa o pedido." },
                  { i: Phone, t: "Você recebe o retorno pelo WhatsApp ou e-mail." },
                ].map((s, n) => (
                  <li key={n} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-petrol-light text-brand-petrol"><s.i className="h-4 w-4" /></span><span className="pt-1.5 text-ink-soft">{s.t}</span></li>
                ))}
              </ol>
            </div>
            <div className="card p-6">
              <h2 className="text-lg">Prefere conversar?</h2>
              <p className="mt-2 text-sm text-ink-soft">Fale direto com o comercial pelo WhatsApp {u.phone}.</p>
              <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn mt-4 w-full bg-[#1FAF54] text-white hover:bg-[#178f44]"><WhatsAppIcon /> Abrir WhatsApp</a>
              <p className="mt-4 flex items-center gap-2 text-xs text-ink-soft"><Clock className="h-4 w-4" /> Seg. a qui. 7h30–17h30 · sex. 7h–16h</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
