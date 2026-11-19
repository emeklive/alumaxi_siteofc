import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { images } from "@/data/images";

type MetaInput = { title: string; description?: string; path: string; image?: string; type?: "website" | "article" };

export function buildMetadata({ title, description, path, image, type = "website" }: MetaInput): Metadata {
  const desc = description ?? siteConfig.description;
  const url = new URL(path, siteConfig.url).toString();
  const img = image ?? siteConfig.ogImage;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description: desc, images: [img] },
  };
}

export function localBusinessJsonLd() {
  const u = siteConfig.unit;
  const sameAs = [siteConfig.social.instagram, siteConfig.social.facebook, u.googleMapsUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "HomeAndConstructionBusiness"],
    "@id": `${siteConfig.url}/#fortaleza`,
    name: u.label,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: u.phoneE164,
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    image: images.hero.src,
    ...(siteConfig.logo ? { logo: new URL(siteConfig.logo, siteConfig.url).toString() } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: u.address.street,
      addressLocality: u.address.city,
      addressRegion: u.address.state,
      postalCode: u.address.zip,
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: u.geo.lat, longitude: u.geo.lng },
    hasMap: u.googleMapsUrl,
    areaServed: [{ "@type": "City", name: "Fortaleza" }, { "@type": "State", name: "Ceará" }],
    openingHoursSpecification: u.hours
      .filter((h) => h.open)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.schemaDay, opens: h.open, closes: h.close })),
    sameAs,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.path, siteConfig.url).toString(),
    })),
  };
}
