import { Paperclip } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { list } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { categories } from "@/data/categories";
import { setStatus } from "../actions";
import type { QuoteRecord } from "@/types";

export default async function Orcamentos() {
  const rows = await list<QuoteRecord>("quotes");
  return (
    <AdminShell title={`Orçamentos (${rows.length})`}>
      {rows.length === 0 && <p className="card p-6 text-ink-soft">Nenhuma solicitação recebida.</p>}
      <div className="space-y-4">
        {rows.map((q) => (
          <details key={q.id} className="card group p-0" data-testid="admin-quote">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-5">
              <span><strong>{q.protocol}</strong> — {q.name}{q.company && ` (${q.company})`} · {q.city}</span>
              <span className="flex items-center gap-3 text-sm text-ink-soft">{formatDateTime(q.createdAt)} <StatusBadge s={q.status} /></span>
            </summary>
            <div className="border-t border-line p-5 text-sm">
              <p><strong>WhatsApp:</strong> <a className="text-brand-petrol underline" href={`https://wa.me/55${q.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">{q.whatsapp}</a> · <strong>E-mail:</strong> <a className="text-brand-petrol underline" href={`mailto:${q.email}`}>{q.email}</a></p>
              <table className="mt-4 w-full text-left">
                <thead className="text-xs uppercase text-ink-soft"><tr><th className="py-2">Categoria</th><th>Produto</th><th>Qtd.</th><th>Medidas</th><th>Obs.</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {q.items.map((it, i) => <tr key={i}><td className="py-2">{categories.find((c) => c.id === it.category)?.name ?? it.category}</td><td>{it.product}</td><td>{it.quantity}</td><td>{it.measures}</td><td>{it.notes}</td></tr>)}
                </tbody>
              </table>
              {q.description && <p className="mt-4 whitespace-pre-line rounded bg-surface p-3">{q.description}</p>}
              {q.files.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {q.files.map((f) => <li key={f.path}><a href={`/api/admin/arquivo?k=${encodeURIComponent(f.path)}`} className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 hover:border-brand-petrol"><Paperclip className="h-3.5 w-3.5" /> {f.name}</a></li>)}
                </ul>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                {(["novo", "em-atendimento", "concluido"] as const).map((s) => (
                  <form key={s} action={setStatus.bind(null, "quotes", q.id, s)}><button disabled={q.status === s} className="btn-outline btn-sm disabled:opacity-40">Marcar: {s}</button></form>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </AdminShell>
  );
}
