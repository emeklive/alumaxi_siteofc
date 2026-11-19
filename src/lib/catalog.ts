import { seedProducts } from "@/data/products";
import { seedArticles } from "@/data/articles";
import type { Article, Product } from "@/types";

/**
 * Repositório de catálogo/artigos.
 * Em modo servidor, lê alterações feitas no painel (store). Na prévia estática, usa os dados-semente.
 */
async function fromStore<T extends { id: string }>(c: "products" | "articles"): Promise<T[] | null> {
  if (process.env.STATIC_PREVIEW === "1") return null;
  const { listOrNull } = await import("./store");
  return listOrNull<T>(c).catch(() => null);
}

export async function getAllProducts(includeInactive = false): Promise<Product[]> {
  const rows = (await fromStore<Product>("products")) ?? seedProducts;
  return includeInactive ? rows : rows.filter((p) => p.active);
}

export async function getProduct(slug: string) {
  return (await getAllProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(cat: string) {
  return (await getAllProducts()).filter((p) => p.category === cat);
}

export async function getAllArticles(includeDrafts = false): Promise<Article[]> {
  const rows = (await fromStore<Article>("articles")) ?? seedArticles;
  const list = includeDrafts ? rows : rows.filter((a) => a.published);
  return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getArticle(slug: string) {
  return (await getAllArticles()).find((a) => a.slug === slug) ?? null;
}
