"use client";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const KEY = "alumaxi-cookie-consent";

/** Banner LGPD. Google Analytics só é carregado após aceite. */
export function CookieConsent({ gaId }: { gaId: string | null }) {
  const [choice, setChoice] = useState<"accepted" | "rejected" | null | "unknown">("unknown");

  useEffect(() => {
    try { setChoice((localStorage.getItem(KEY) as "accepted" | "rejected" | null) ?? null); } catch { setChoice(null); }
  }, []);

  const save = (v: "accepted" | "rejected") => {
    try { localStorage.setItem(KEY, v); } catch { /* armazenamento indisponível */ }
    setChoice(v);
  };

  return (
    <>
      {choice === "accepted" && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script>
        </>
      )}
      {choice === null && (
        <div role="dialog" aria-label="Preferências de cookies" className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-xl border border-line bg-white p-5 shadow-lift sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:gap-6" data-testid="cookie-banner">
          <p className="text-sm text-ink-soft">
            Usamos cookies essenciais para o funcionamento do site e, com sua autorização, cookies de medição de audiência.
            Saiba mais na <Link href="/privacidade" className="font-semibold text-brand-petrol underline">Política de privacidade</Link>.
          </p>
          <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
            <button type="button" onClick={() => save("rejected")} className="btn-outline btn-sm">Recusar</button>
            <button type="button" onClick={() => save("accepted")} className="btn-primary btn-sm">Aceitar</button>
          </div>
        </div>
      )}
    </>
  );
}
