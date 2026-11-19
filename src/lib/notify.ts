import "server-only";

/** Encaminha o registro ao canal comercial configurado (webhook: Make, Zapier, n8n, e-mail etc.). */
export async function forward(kind: "orcamento" | "contato" | "candidatura", payload: unknown) {
  const url = process.env.FORMS_WEBHOOK_URL;
  if (!url) return { forwarded: false };
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, source: "site-alumaxi", payload }),
    });
    return { forwarded: r.ok };
  } catch {
    return { forwarded: false };
  }
}
