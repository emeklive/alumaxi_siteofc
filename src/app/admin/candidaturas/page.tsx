import { FileText } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { list } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { deleteRecord, setStatus } from "../actions";
import type { ApplicationRecord } from "@/types";

export default async function Candidaturas() {
  const rows = await list<ApplicationRecord>("applications");
  return (
    <AdminShell title={`Candidaturas (${rows.length})`}>
      {rows.length === 0 && <p className="card p-6 text-ink-soft">Nenhum currículo recebido.</p>}
      <div className="card overflow-x-auto">
        {rows.length > 0 && (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase text-ink-soft"><tr><th className="p-4">Candidato</th><th>Cargo</th><th>Cidade</th><th>Recebido</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody className="divide-y divide-line">
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="p-4"><strong>{a.name}</strong><span className="block text-ink-soft">{a.email} · {a.phone}</span></td>
                  <td>{a.role}</td><td>{a.city}</td><td>{formatDateTime(a.createdAt)}</td><td><StatusBadge s={a.status} /></td>
                  <td className="space-x-2 whitespace-nowrap pr-4">
                    {a.resume && <a className="inline-flex items-center gap-1 text-brand-petrol underline" href={`/api/admin/arquivo?k=${encodeURIComponent(a.resume.path)}`}><FileText className="h-4 w-4" /> CV</a>}
                    <form className="inline" action={setStatus.bind(null, "applications", a.id, a.status === "arquivado" ? "novo" : "arquivado")}><button className="text-ink-soft underline">{a.status === "arquivado" ? "Reabrir" : "Arquivar"}</button></form>
                    <form className="inline" action={deleteRecord.bind(null, "applications", a.id)}><ConfirmSubmit label="Excluir" message="Excluir os dados deste candidato (LGPD)?" className="text-red-600 underline" /></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
