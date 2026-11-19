import "server-only";
import { NextResponse } from "next/server";
import { clientIp, isSpam, rateLimit } from "./rate-limit";

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

/** Verificações comuns de segurança para os formulários públicos. */
export async function guard(req: Request, bucket: string) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`${bucket}:${ip}`)) return { error: json({ message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." }, 429) };
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > 55 * 1024 * 1024) return { error: json({ message: "Envio muito grande." }, 413) };
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return { error: json({ message: "Requisição inválida." }, 400) };
  }
  // Spam: responde como sucesso para não dar pistas ao robô, mas não grava nada.
  if (isSpam(form)) return { error: json({ ok: true, protocol: "OK" }, 200) };
  let payload: unknown;
  try {
    payload = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return { error: json({ message: "Dados inválidos." }, 400) };
  }
  return { form, payload };
}
