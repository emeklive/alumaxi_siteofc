import type { Metadata, Viewport } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { localBusinessJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Alumaxi Fortaleza | Vidros, Alumínio, Ferragens e Acessórios",
    template: "%s | Alumaxi Fortaleza",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "vidros Fortaleza", "alumínio Fortaleza", "ferragens para vidro", "vidro temperado Fortaleza", "vidro laminado",
    "espelhos Fortaleza", "distribuidora de vidros Ceará", "vidraçaria Cajazeiras", "perfis de alumínio", "Alumaxi",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: "Alumaxi Fortaleza | Vidros, Alumínio, Ferragens e Acessórios",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Alumaxi — vidros, alumínio, ferragens e acessórios" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  ...(siteConfig.analytics.gscVerification ? { verification: { google: siteConfig.analytics.gscVerification } } : {}),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#006868", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <JsonLd data={localBusinessJsonLd()} />
        {children}
      </body>
    </html>
  );
}
