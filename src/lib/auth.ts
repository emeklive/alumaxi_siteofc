/**
 * Sessão administrativa: cookie assinado com HMAC-SHA256 (Web Crypto — funciona no middleware/edge).
 * O painel só é habilitado quando ADMIN_PASSWORD e ADMIN_SESSION_SECRET estão definidos.
 */
export const ADMIN_COOKIE = "alumaxi_admin";
const MAX_AGE_S = 60 * 60 * 8;

export const adminEnabled = () =>
  Boolean(process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);

const enc = new TextEncoder();

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(process.env.ADMIN_SESSION_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  let bin = "";
  for (const b of new Uint8Array(sig)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_S;
  const payload = `admin.${exp}`;
  return { token: `${payload}.${await hmac(payload)}`, maxAge: MAX_AGE_S };
}

export async function verifySessionToken(token?: string | null) {
  if (!token || !adminEnabled()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [who, exp, sig] = parts;
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = await hmac(`${who}.${exp}`);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export function safeEqual(a: string, b: string) {
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < Math.max(ab.length, bb.length); i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}
