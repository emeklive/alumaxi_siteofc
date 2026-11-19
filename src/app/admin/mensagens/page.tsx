import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { list } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { setStatus } from "../actions";
import type { ContactRecord } from "@/types";

export default async function Mensagens() {
  const rows = await list<ContactRecord>("contacts");
  return (
    <AdminShell title={`Mensagens (${rows.length})`}>
      {rows.length === 0 && <p className="card p-6 text-ink-soft">Nenhuma mensagem recebida.</p>}
      <div className="space-y-4">
        {rows.map((m) => (
          <article key={m.id} className="card p-5 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2"><p><strong>{m.subject}</strong> — {m.name}</p><span className="flex items-center gap-3 text-ink-soft">{formatDateTime(m.createdAt)} <StatusBadge s={m.status} /></span></div>
            <p className="mt-1 text-ink-soft">{m.email}{m.phone && ` · ${m.phone}`} · {m.protocol}</p>
            <p className="mt-3 whitespace-pre-line">{m.message}</p>
            <div className="mt-4 flex gap-2">
              <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="btn-secondary btn-sm">Responder por e-mail</a>
              <form action={setStatus.bind(null, "contacts", m.id, m.status === "novo" ? "respondido" : "novo")}><button className="btn-outline btn-sm">{m.status === "novo" ? "Marcar respondido" : "Reabrir"}</button></form>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
