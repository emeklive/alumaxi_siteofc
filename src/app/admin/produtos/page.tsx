import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { getAllProducts } from "@/lib/catalog";
import { categories } from "@/data/categories";
import { deleteRecord } from "../actions";

export default async function AdminProdutos({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const products = await getAllProducts(true);
  const { ok } = await searchParams;
  return (
    <AdminShell title={`Produtos (${products.length})`} actions={<Link href="/admin/produtos/novo" className="btn-primary btn-sm"><Plus className="h-4 w-4" /> Novo produto</Link>}>
      {ok && <p className="mb-4 rounded-md bg-green-50 p-3 text-sm font-semibold text-green-700">Produto salvo.</p>}
      <div className="card mb-6 p-5 text-sm">
        <h2 className="text-base">Categorias</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => <span key={c.id} className="rounded bg-brand-petrol-light px-3 py-1 font-semibold text-brand-petrol">{c.name}: {c.subcategories.map((s) => s.name).join(", ")} · {products.filter((p) => p.category === c.id).length} itens</span>)}
        </div>
        <p className="mt-3 text-ink-soft">Categorias e linhas são definidas em <code>src/data/categories.ts</code>.</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-ink-soft"><tr><th className="p-4">Produto</th><th>Categoria</th><th>Situação</th><th>Validado</th><th className="pr-4 text-right">Ações</th></tr></thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4"><strong>{p.name}</strong><span className="block text-ink-soft">/produtos/{p.slug}</span></td>
                <td>{categories.find((c) => c.id === p.category)?.name}</td>
                <td>{p.active ? <span className="font-semibold text-green-700">Publicado</span> : <span className="text-ink-soft">Oculto</span>}{p.featured && " · destaque"}</td>
                <td>{p.validated ? "Sim" : <span className="font-semibold text-brand-orange-dark">Pendente</span>}</td>
                <td className="space-x-3 whitespace-nowrap pr-4 text-right">
                  <Link href={`/produtos/${p.slug}`} target="_blank" className="text-ink-soft underline">Ver</Link>
                  <Link href={`/admin/produtos/${p.id}`} className="font-semibold text-brand-petrol underline">Editar</Link>
                  <form className="inline" action={deleteRecord.bind(null, "products", p.id)}><ConfirmSubmit label="Excluir" message={`Excluir "${p.name}"?`} className="text-red-600 underline" /></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
