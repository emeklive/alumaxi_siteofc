"use client";
import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window !== "undefined" ? new URL(path, window.location.origin).toString() : path);

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url: url() }); } catch { /* cancelado */ }
    } else copy();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
    } catch {
      const t = document.createElement("textarea"); t.value = url(); document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="share">
      <span className="mr-1 text-sm font-semibold text-ink-soft">Compartilhar:</span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${typeof window !== "undefined" ? url() : ""}`)}`}
        target="_blank" rel="noopener noreferrer"
        onClick={(e) => { (e.currentTarget as HTMLAnchorElement).href = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url()}`)}`; }}
        className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink hover:border-[#1FAF54] hover:text-[#178f44]"
      >
        <WhatsAppIcon className="h-4 w-4" /> WhatsApp
      </a>
      <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink hover:border-brand-petrol hover:text-brand-petrol">
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />} {copied ? "Link copiado!" : "Copiar link"}
      </button>
      <button type="button" onClick={nativeShare} className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink hover:border-brand-petrol hover:text-brand-petrol">
        <Share2 className="h-4 w-4" /> Mais
      </button>
    </div>
  );
}
