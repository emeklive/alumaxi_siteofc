"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import { list, listOrNull, remove, replaceAll, upsert, type Collection } from "@/lib/store";
import { seedProducts } from "@/data/products";
import { seedArticles } from "@/data/articles";
import { slugify } from "@/lib/utils";
import type { Article, Product, CategoryId } from "@/types";

async function requireAdmin() {
  const ok = await verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}

async function ensureSeeded(c: "products" | "articles") {
  const rows = await listOrNull(c);
  if (!rows) await replaceAll(c, (c === "products" ? seedProducts : seedArticles) as { id: string }[]);
}

const lines = (s: FormDataEntryValue | null) => String(s ?? "").split("\n").map((x) => x.trim()).filter(Boolean);

export async function setStatus(collection: Collection, id: string, status: string) {
  await requireAdmin();
  const rows = await list<{ id: string; status: string }>(collection);
  const row = rows.find((r) => r.id === id);
  if (row) await upsert(collection, { ...row, status });
  revalidatePath("/admin", "layout");
}

export async function deleteRecord(collection: Collection, id: string) {
  await requireAdmin();
  if (collection === "products" || collection === "articles") await ensureSeeded(collection);
  await remove(collection, id);
  revalidatePath("/", "layout");
}

export async function saveProduct(fd: FormData) {
  await requireAdmin();
  await ensureSeeded("products");
  const name = String(fd.get("name") ?? "").trim();
  if (name.length < 2) throw new Error("Nome obrigatório");
  const id = String(fd.get("id") || slugify(name));
  const specs = lines(fd.get("specs")).map((l) => {
    const [label, ...v] = l.split(":");
    return { label: label.trim(), value: v.join(":").trim() };
  }).filter((s) => s.label && s.value);
  const product: Product = {
    id,
    slug: slugify(String(fd.get("slug") || name)),
    name,
    category: String(fd.get("category")) as CategoryId,
    subcategory: String(fd.get("subcategory") ?? ""),
    summary: String(fd.get("summary") ?? "").trim(),
    description: String(fd.get("description") ?? "").trim(),
    applications: lines(fd.get("applications")),
    specs,
    image: String(fd.get("image") ?? "").trim(),
    imageAlt: String(fd.get("imageAlt") ?? name).trim(),
    featured: fd.get("featured") === "on",
    validated: fd.get("validated") === "on",
    active: fd.get("active") === "on",
    updatedAt: new Date().toISOString(),
  };
  await upsert("products", product);
  revalidatePath("/", "layout");
  redirect("/admin/produtos?ok=1");
}

export async function saveArticle(fd: FormData) {
  await requireAdmin();
  await ensureSeeded("articles");
  const title = String(fd.get("title") ?? "").trim();
  if (title.length < 3) throw new Error("Título obrigatório");
  const id = String(fd.get("id") || slugify(title));
  const body = String(fd.get("body") ?? "");
  const article: Article = {
    id,
    slug: slugify(String(fd.get("slug") || title)),
    title,
    excerpt: String(fd.get("excerpt") ?? "").trim(),
    category: String(fd.get("category") ?? "Vidros"),
    image: String(fd.get("image") ?? "").trim(),
    imageAlt: String(fd.get("imageAlt") ?? title).trim(),
    publishedAt: String(fd.get("publishedAt") || new Date().toISOString().slice(0, 10)),
    readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    body,
    published: fd.get("published") === "on",
  };
  await upsert("articles", article);
  revalidatePath("/", "layout");
  redirect("/admin/artigos?ok=1");
}
