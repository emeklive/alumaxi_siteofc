import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminEnabled, createSessionToken, safeEqual } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!adminEnabled()) return NextResponse.json({ message: "Painel desativado: configure ADMIN_PASSWORD e ADMIN_SESSION_SECRET." }, { status: 503 });
  if (!rateLimit(`login:${clientIp(req.headers)}`, 8, 15 * 60 * 1000)) return NextResponse.json({ message: "Muitas tentativas. Aguarde 15 minutos." }, { status: 429 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !safeEqual(password, process.env.ADMIN_PASSWORD!)) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ message: "Senha incorreta." }, { status: 401 });
  }
  const { token, maxAge } = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge });
  return res;
}
