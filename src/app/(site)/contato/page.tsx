import { Clock, Mail, MapPin, Phone, Navigation } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { HoursList } from "@/components/ui/HoursList";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { images } from "@/data/images";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Contato",
  description: "Fale com a Alumaxi Fortaleza: Av. Dep. Paulino Rocha, 1303 - Cajazeiras. Telefone e WhatsApp (85) 99809-0245.",
  path: "/contato",
});

export default function ContatoPage() {
  const u = siteConfig.unit;
  const cards = [
    { icon: MapPin, title: "Endereço", body: <a href={u.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-petrol">{u.address.full}</a> },
    { icon: Phone, title: "Telefone", body: <a href={`tel:${u.phoneE164}`} className="hover:text-brand-petrol" data-testid="contact-phone">{u.phone}</a> },
    { icon: WhatsAppIcon, title: "WhatsApp", body: <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-petrol">{u.phone}</a> },
    ...(siteConfig.contact.email ? [{ icon: Mail, title: "E-mail", body: <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brand-petrol">{siteConfig.contact.email}</a> }] : []),
  ];
  return (
    <>
      <PageHero title="Contato" text="Estamos prontos para atender você na loja, por telefone ou pelo WhatsApp." image={images.corridorGlass.src} imageAlt={images.corridorGlass.alt} crumbs={[{ name: "Contato", path: "/contato" }]} eyebrow="Fale com a Alumaxi" />
      <section className="container-x -mt-10 relative z-10">
        <div className={`grid gap-4 sm:grid-cols-2 ${cards.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {cards.map((c) => (
            <div key={c.title} className="card flex gap-4 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange text-white"><c.icon className="h-5 w-5" /></span>
              <div className="min-w-0"><h2 className="text-sm font-bold uppercase tracking-wider text-brand-petrol">{c.title}</h2><p className="mt-1 font-semibold text-ink">{c.body}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section className="container-x grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-3xl">Envie uma mensagem</h2>
          <p className="mt-2 text-ink-soft">Para orçamentos com medidas e anexos, use a <a href="/orcamento" className="font-semibold text-brand-petrol underline">página de orçamento</a>.</p>
          <div className="mt-6"><ContactForm /></div>
        </div>
        <div className="space-y-6">
          <MapEmbed className="h-[360px]" />
          <a href={u.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full" data-testid="route-button"><Navigation className="h-4 w-4" /> Abrir rota no Google Maps</a>
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg"><Clock className="h-5 w-5 text-brand-orange" /> Horário de atendimento</h2>
            <HoursList />
            <p className="mt-3 text-xs text-ink-soft">{u.hoursNote}</p>
          </div>
          {(siteConfig.social.instagram || siteConfig.social.facebook) && (
            <div className="card p-6">
              <h2 className="text-lg">Redes sociais</h2>
              <div className="mt-3 flex gap-3">
                {siteConfig.social.instagram && <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">Instagram</a>}
                {siteConfig.social.facebook && <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">Facebook</a>}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
