"use client";
import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-x flex min-h-[60vh] flex-col justify-center py-20">
      <h1 className="text-3xl">Algo deu errado</h1>
      <p className="mt-3 text-ink-soft">Tente novamente. Se o problema continuar, fale conosco pelo WhatsApp.</p>
      <div className="mt-6 flex gap-3"><button onClick={reset} className="btn-primary">Tentar novamente</button><Link href="/" className="btn-outline">Início</Link></div>
    </section>
  );
}
