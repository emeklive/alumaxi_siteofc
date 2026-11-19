import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { whatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { Reveal } from "./Reveal";
import { ScrollFx } from "./ScrollFx";

export function CtaBand({
  title = "Vamos tirar seu projeto do papel?",
  text = "Envie as medidas, fotos ou o projeto e receba o atendimento da equipe comercial da Alumaxi.",
}: { title?: string; text?: string }) {
  return (
    <section className="container-x py-16 sm:py-20">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-2xl bg-brand-orange px-6 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-14">
          <ScrollFx aria-hidden className="absolute -right-10 top-0 -z-10 h-full w-64" y={[0, 0]} rotate={[-4, 4]}><div className="h-full w-full geo-slash bg-white/12" /></ScrollFx>
          <ScrollFx aria-hidden className="absolute right-40 top-0 -z-10 h-full w-24" y={[40, -40]}><div className="h-full w-full geo-slash bg-brand-petrol/25" /></ScrollFx>
          <div className="max-w-2xl">
            <h2 className="text-3xl text-white sm:text-4xl">{title}</h2>
            <p className="mt-3 text-lg text-white/90">{text}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
            <Link href="/orcamento" className="btn bg-white text-brand-petrol-deep hover:-translate-y-0.5 hover:bg-brand-petrol-light">
              Solicitar orçamento <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn border-2 border-white text-white hover:bg-white/10">
              <WhatsAppIcon /> WhatsApp
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
