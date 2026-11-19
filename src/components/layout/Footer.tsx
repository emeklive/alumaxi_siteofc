import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { Logo } from "@/components/ui/Logo";
import { HoursList } from "@/components/ui/HoursList";
import { whatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
}
function FacebookIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.7c0-.5.3-.7 1-.7Z" /></svg>;
}

export function Footer() {
  const u = siteConfig.unit;
  return (
    <footer className="relative isolate overflow-hidden bg-brand-petrol-deep text-white">
      <div aria-hidden className="absolute -right-16 top-0 -z-10 h-12 w-72 geo-slash bg-brand-orange" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Logo variant="light" className="h-12 sm:h-14" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">{siteConfig.slogan}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">Vidros, alumínio, ferragens e acessórios para profissionais da construção em Fortaleza e região.</p>
          <div className="mt-6 flex gap-3">
            <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full bg-white/10 p-2.5 hover:bg-brand-orange"><WhatsAppIcon /></a>
            {siteConfig.social.instagram && <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 hover:bg-brand-orange"><InstagramIcon /></a>}
            {siteConfig.social.facebook && <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 hover:bg-brand-orange"><FacebookIcon /></a>}
            <a href={u.googleMapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Google Maps" className="rounded-full bg-white/10 p-2.5 hover:bg-brand-orange"><MapPin className="h-5 w-5" /></a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange">Produtos</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}><Link href={c.page} className="text-white/75 hover:text-white">{c.name}</Link></li>
            ))}
            <li><Link href="/catalogo" className="text-white/75 hover:text-white">Catálogo digital</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange">Empresa</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              ["Sobre a Alumaxi", "/sobre"],
              ["Solicitar orçamento", "/orcamento"],
              ["Conteúdos e dicas", "/conteudos"],
              ["Trabalhe conosco", "/trabalhe-conosco"],
              ["Contato", "/contato"],
              ["Política de privacidade", "/privacidade"],
            ].map(([l, h]) => (
              <li key={h}><Link href={h} className="text-white/75 hover:text-white">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange">Alumaxi Fortaleza</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" /><a href={u.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">{u.address.full}</a></li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" /><a href={`tel:${u.phoneE164}`} className="hover:text-white">{u.phone}</a></li>
            {siteConfig.contact.email && <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" /><a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">{siteConfig.contact.email}</a></li>}
          </ul>
          <div className="mt-5"><HoursList light /></div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.legalName} · CNPJ {u.cnpj}</p>
          <p>Imagens ilustrativas.</p>
        </div>
      </div>
    </footer>
  );
}
