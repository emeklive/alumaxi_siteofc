import { siteConfig } from "@/config/site";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const defaultWhatsappMessage = "Olá, Alumaxi! Vim pelo site e gostaria de atendimento.";

export function productWhatsappMessage(productName: string) {
  return `Olá, Alumaxi! Vim pelo site e gostaria de informações sobre: ${productName}.`;
}
