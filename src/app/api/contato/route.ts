import { randomUUID } from "crypto";
import { contactSchema, flattenErrors } from "@/lib/validation";
import { guard, json } from "@/lib/api";
import { upsert } from "@/lib/store";
import { forward } from "@/lib/notify";
import { makeProtocol } from "@/lib/utils";
import type { ContactRecord } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const g = await guard(req, "contact");
  if ("error" in g) return g.error;
  const parsed = contactSchema.safeParse(g.payload);
  if (!parsed.success) return json({ message: "Revise os campos destacados.", errors: flattenErrors(parsed.error) }, 422);
  try {
    const { consent: _c, ...data } = parsed.data;
    const record: ContactRecord = { id: randomUUID(), protocol: makeProtocol("CTT"), createdAt: new Date().toISOString(), status: "novo", ...data, phone: data.phone || undefined };
    await upsert("contacts", record);
    await forward("contato", record);
    return json({ ok: true, protocol: record.protocol });
  } catch (e) {
    console.error("[contato]", e);
    return json({ message: "Não foi possível enviar agora." }, 500);
  }
}
