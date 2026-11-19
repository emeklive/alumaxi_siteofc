import { NextResponse } from "next/server";
import { readFile } from "@/lib/store";

export const runtime = "nodejs";

/** Download de anexos — protegido pelo middleware (/api/admin/*). */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("k") ?? "";
  if (!/^(orcamentos|curriculos)\/[\w\-]+\/[\w.\-]+$/.test(key)) return NextResponse.json({ message: "Arquivo inválido" }, { status: 400 });
  const f = await readFile(key);
  if (!f) return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  return new NextResponse(new Uint8Array(f.body), {
    headers: { "Content-Type": f.type, "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`, "Cache-Control": "private, no-store" },
  });
}
