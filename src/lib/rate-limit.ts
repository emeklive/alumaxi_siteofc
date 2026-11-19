/** Limitador simples em memória (por instância). Em produção serverless, complementar com WAF/Vercel Firewall. */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return false;
  arr.push(now);
  hits.set(key, arr);
  return true;
}

/** Honeypot + tempo mínimo de preenchimento. */
export function isSpam(form: FormData) {
  if ((form.get("website") as string | null)?.trim()) return true;
  const started = Number(form.get("startedAt") ?? 0);
  if (!started || Date.now() - started < 2500) return true;
  return false;
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local";
}
