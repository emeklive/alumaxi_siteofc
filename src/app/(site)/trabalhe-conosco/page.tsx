import { Briefcase, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { CareersForm } from "@/components/forms/CareersForm";
import { images } from "@/data/images";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Trabalhe conosco",
  description: "Envie seu currículo para a Alumaxi Fortaleza e faça parte do nosso banco de talentos.",
  path: "/trabalhe-conosco",
});

export default function TrabalhePage() {
  return (
    <>
      <PageHero title="Trabalhe conosco" text="Quer fazer parte da equipe Alumaxi? Cadastre seu currículo em nosso banco de talentos." image={images.worker.src} imageAlt={images.worker.alt} crumbs={[{ name: "Trabalhe conosco", path: "/trabalhe-conosco" }]} eyebrow="Carreiras" />
      <section className="bg-surface py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-5">
            {[
              { i: Users, t: "Banco de talentos", d: "Seu currículo fica disponível para as próximas oportunidades compatíveis com o seu perfil." },
              { i: Briefcase, t: "Áreas diversas", d: "Atendimento, vendas, logística, estoque e administrativo, conforme as vagas abertas." },
              { i: ShieldCheck, t: "Seus dados protegidos", d: "Usamos seus dados apenas para recrutamento, conforme a LGPD." },
            ].map((x) => (
              <div key={x.t} className="card flex gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-petrol-light text-brand-petrol"><x.i className="h-5 w-5" /></span>
                <div><h2 className="text-base">{x.t}</h2><p className="mt-1 text-sm text-ink-soft">{x.d}</p></div>
              </div>
            ))}
          </aside>
          <CareersForm />
        </div>
      </section>
    </>
  );
}
