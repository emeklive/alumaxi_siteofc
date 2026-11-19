import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { getAllArticles } from "@/lib/catalog";
import { formatDate } from "@/lib/utils";
import { deleteRecord } from "../actions";

export default async function AdminArtigos({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const rows = await getAllArticles(true);
  const { ok } = await searchParams;
  return (
    <AdminShell title={`Artigos (${rows.length})`} actions={<Link href="/admin/artigos/novo" className="btn-primary btn-sm"><Plus className="h-4 w-4" /> Novo artigo</Link>}>
      {ok && <p className="mb-4 rounded-md bg-green-50 p-3 text-sm font-semibold text-green-700">Artigo salvo.</p>}
      <div className="card divide-y divide-line">
        {rows.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <span><strong>{a.title}</strong><span className="block text-ink-soft">{a.category} · {formatDate(a.publishedAt)} · {a.published ? "publicado" : "rascunho"}</span></span>
            <span className="space-x-3">
              <Link href={`/admin/artigos/${a.id}`} className="font-semibold text-brand-petrol underline">Editar</Link>
              <form className="inline" action={deleteRecord.bind(null, "articles", a.id)}><ConfirmSubmit label="Excluir" message={`Excluir "${a.title}"?`} className="text-red-600 underline" /></form>
            </span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
