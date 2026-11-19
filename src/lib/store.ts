import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { StoredFile } from "@/types";

/**
 * Armazenamento genérico por coleção.
 * - Com SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY: usa a tabela `records` (ver supabase/schema.sql).
 * - Sem isso: grava em ./.data/<colecao>.json (apenas desenvolvimento / servidor próprio).
 */
export type Collection = "quotes" | "contacts" | "applications" | "products" | "articles" | "settings";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
const useSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);
// Na Vercel o disco do projeto é somente leitura: sem Supabase, usa /tmp (TEMPORÁRIO, apagado entre execuções).
const DATA_DIR = process.env.VERCEL ? "/tmp/alumaxi-data" : path.join(process.cwd(), ".data");

const sbHeaders = () => ({
  apikey: SUPABASE_KEY!,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

async function readLocal<T>(c: Collection): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, `${c}.json`), "utf8")) as T[];
  } catch {
    return [];
  }
}

async function writeLocal<T>(c: Collection, rows: T[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, `${c}.json`), JSON.stringify(rows, null, 2), "utf8");
}

export async function list<T extends { id: string }>(c: Collection): Promise<T[]> {
  if (useSupabase) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/records?collection=eq.${c}&select=data&order=created_at.desc`, {
      headers: sbHeaders(),
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`Supabase list ${c}: ${r.status}`);
    return ((await r.json()) as { data: T }[]).map((x) => x.data);
  }
  return readLocal<T>(c);
}

/** Retorna null se a coleção nunca foi gravada (permite usar dados-semente). */
export async function listOrNull<T extends { id: string }>(c: Collection): Promise<T[] | null> {
  if (useSupabase) {
    const rows = await list<T>(c).catch(() => null);
    return rows && rows.length ? rows : null;
  }
  try {
    await fs.access(path.join(DATA_DIR, `${c}.json`));
    return readLocal<T>(c);
  } catch {
    return null;
  }
}

export async function upsert<T extends { id: string }>(c: Collection, row: T) {
  if (useSupabase) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/records?on_conflict=collection,id`, {
      method: "POST",
      headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ collection: c, id: row.id, data: row }),
    });
    if (!r.ok) throw new Error(`Supabase upsert ${c}: ${r.status}`);
    return;
  }
  const rows = await readLocal<T>(c);
  const i = rows.findIndex((x) => x.id === row.id);
  if (i >= 0) rows[i] = row;
  else rows.unshift(row);
  await writeLocal(c, rows);
}

export async function replaceAll<T extends { id: string }>(c: Collection, rows: T[]) {
  if (useSupabase) {
    for (const row of rows) await upsert(c, row);
    return;
  }
  await writeLocal(c, rows);
}

export async function remove(c: Collection, id: string) {
  if (useSupabase) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/records?collection=eq.${c}&id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: sbHeaders(),
    });
    if (!r.ok) throw new Error(`Supabase delete ${c}: ${r.status}`);
    return;
  }
  const rows = await readLocal<{ id: string }>(c);
  await writeLocal(
    c,
    rows.filter((x) => x.id !== id),
  );
}

const safeName = (n: string) => n.normalize("NFD").replace(/[^\w.\-]+/g, "_").slice(-80);

export async function saveFile(folder: string, file: File): Promise<StoredFile> {
  const name = `${Date.now()}-${safeName(file.name)}`;
  const key = `${folder}/${name}`;
  const buf = Buffer.from(await file.arrayBuffer());
  if (useSupabase) {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": file.type },
      body: buf,
    });
    if (!r.ok) throw new Error(`Supabase upload: ${r.status}`);
  } else {
    const dir = path.join(DATA_DIR, "uploads", folder);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), buf);
  }
  return { name: file.name, size: file.size, type: file.type, path: key };
}

export async function readFile(key: string): Promise<{ body: Buffer; type: string } | null> {
  if (key.includes("..")) return null;
  if (useSupabase) {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
      headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!r.ok) return null;
    return { body: Buffer.from(await r.arrayBuffer()), type: r.headers.get("content-type") ?? "application/octet-stream" };
  }
  try {
    const body = await fs.readFile(path.join(DATA_DIR, "uploads", key));
    const ext = key.split(".").pop()?.toLowerCase();
    const type =
      ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return { body, type };
  } catch {
    return null;
  }
}

export const storageMode = useSupabase ? "supabase" : process.env.VERCEL ? "temporario-vercel" : "local";
