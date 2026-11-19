import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllArticles, getAllProducts } from "@/lib/catalog";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const pages = ["", "/sobre", "/produtos", "/vidros", "/aluminio", "/ferragens-e-acessorios", "/catalogo", "/orcamento", "/contato", "/conteudos", "/trabalhe-conosco", "/privacidade"];
  const products = await getAllProducts();
  const articles = await getAllArticles();
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : p === "/orcamento" ? 0.9 : 0.7 })),
    ...products.map((p) => ({ url: `${base}/produtos/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${base}/conteudos/${a.slug}`, lastModified: new Date(a.publishedAt), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
