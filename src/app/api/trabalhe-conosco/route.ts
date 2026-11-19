import { randomUUID } from "crypto";
import { applicationSchema, flattenErrors, FILE_RULES } from "@/lib/validation";
import { guard, json } from "@/lib/api";
import { saveFile, upsert } from "@/lib/store";
import { forward } from "@/lib/notify";
import { makeProtocol } from "@/lib/utils";
import type { ApplicationRecord } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const g = await guard(req, "careers");
  if ("error" in g) return g.error;
  const parsed = applicationSchema.safeParse(g.payload);
  if (!parsed.success) return json({ message: "Revise os campos destacados.", errors: flattenErrors(parsed.error) }, 422);
  const resume = g.form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) return json({ message: "Anexe o currículo.", errors: { resume: "Anexe seu currículo em PDF." } }, 422);
  if (resume.type !== "application/pdf" || resume.size > FILE_RULES.resume.maxSize) return json({ message: "Currículo inválido.", errors: { resume: "Envie um PDF de até 5 MB." } }, 422);
  // Confere a assinatura do PDF (%PDF)
  const head = new Uint8Array(await resume.slice(0, 4).arrayBuffer());
  if (String.fromCharCode(...head) !== "%PDF") return json({ message: "Currículo inválido.", errors: { resume: "O arquivo não é um PDF válido." } }, 422);
  try {
    const protocol = makeProtocol("CV");
    const file = await saveFile(`curriculos/${protocol}`, resume);
    const { consent: _c, ...data } = parsed.data;
    const record: ApplicationRecord = { id: randomUUID(), protocol, createdAt: new Date().toISOString(), status: "novo", ...data, resume: file };
    await upsert("applications", record);
    await forward("candidatura", { ...record, resume: { name: file.name, size: file.size } });
    return json({ ok: true, protocol });
  } catch (e) {
    console.error("[trabalhe-conosco]", e);
    return json({ message: "Não foi possível enviar agora." }, 500);
  }
}
