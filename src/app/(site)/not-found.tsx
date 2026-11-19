import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute -right-20 top-0 -z-10 h-full w-80 geo-slash bg-brand-orange/90" />
      <div aria-hidden className="absolute right-56 top-0 -z-10 h-2/3 w-28 geo-slash bg-brand-petrol/15" />
      <div className="container-x flex min-h-[70vh] flex-col justify-center py-20">
        <p className="text-8xl font-extrabold text-brand-petrol sm:text-9xl">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl">Página não encontrada</h1>
        <p className="mt-3 max-w-lg text-lg text-ink-soft">O endereço pode ter mudado ou não existe mais. Que tal continuar por um destes caminhos?</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary"><ArrowLeft className="h-4 w-4" /> Voltar ao início</Link>
          <Link href="/catalogo" className="btn-outline"><Search className="h-4 w-4" /> Buscar produtos</Link>
          <Link href="/contato" className="btn-outline">Falar com a Alumaxi</Link>
        </div>
      </div>
    </section>
  );
}
