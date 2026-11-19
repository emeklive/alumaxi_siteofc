"use client";
import { useEffect, useState } from "react";
import { whatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <a
      href={whatsappLink(defaultWhatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Alumaxi pelo WhatsApp"
      data-testid="whatsapp-float"
      className={`group fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#1FAF54] p-3.5 text-white shadow-lift transition-all duration-500 hover:bg-[#178f44] sm:bottom-7 sm:right-7 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 lg:inline">
        Fale conosco
      </span>
    </a>
  );
}
