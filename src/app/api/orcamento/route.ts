import { randomUUID } from "crypto";
import { quoteSchema, flattenErrors, FILE_RULES } from "@/lib/validation";
import { guard, json } from "@/lib/api";
import { saveFile, upsert } from "@/lib/store";
import { forward } from "@/lib/notify";
import { makeProtocol } from "@/lib/utils";
import type { QuoteRecord, StoredFile } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const g = await guard(req, "quote");
  if ("error" in g) return g.error;
  const parsed = quoteSchema.safeParse(g.payload);
  if (!parsed.success) return json({ message: "Revise os campos destacados.", errors: flattenErrors(parsed.error) }, 422);

  const files = g.form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > FILE_RULES.quote.maxFiles) return json({ message: "Máximo de 5 arquivos." }, 422);
  for (const f of files) {
    if (!(FILE_RULES.quote.types as readonly string[]).includes(f.type) || f.size > FILE_RULES.quote.maxSize)
      return json({ message: `Arquivo não permitido: ${f.name}` }, 422);
  }

  try {
    const protocol = makeProtocol("ORC");
    const stored: StoredFile[] = [];
    for (const f of files) stored.push(await saveFile(`orcamentos/${protocol}`, f));
    const { consent: _c, ...data } = parsed.data;
    const record: QuoteRecord = {
      id: randomUUID(),
      protocol,
      createdAt: new Date().toISOString(),
      status: "novo",
      ...data,
      files: stored,
    };
    await upsert("quotes", record);
    await forward("orcamento", record);
    return json({ ok: true, protocol });
  } catch (e) {
    console.error("[orcamento]", e);
    return json({ message: "Não foi possível registrar agora. Tente novamente ou use o WhatsApp." }, 500);
  }
}
