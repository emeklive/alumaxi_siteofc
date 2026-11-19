import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAllProducts } from "@/lib/catalog";
import { categories } from "@/data/categories";
import { saveProduct } from "../../actions";
import type { Product } from "@/types";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "novo";
  const p: Partial<Product> | undefined = isNew ? { active: true, applications: [], specs: [] } : (await getAllProducts(true)).find((x) => x.id === id);
  if (!p) notFound();
  return (
    <AdminShell title={isNew ? "Novo produto" : `Editar: ${p.name}`}>
      <form action={saveProduct} className="card grid gap-5 p-6 sm:grid-cols-2" data-testid="product-editor">
        {!isNew && <input type="hidden" name="id" value={p.id} />}
        <div><label className="label" htmlFor="name">Nome *</label><input id="name" name="name" required defaultValue={p.name} className="input" /></div>
        <div><label className="label" htmlFor="slug">URL (slug)</label><input id="slug" name="slug" defaultValue={p.slug} className="input" placeholder="gerado a partir do nome" /></div>
        <div><label className="label" htmlFor="category">Categoria *</label>
          <select id="category" name="category" defaultValue={p.category ?? "vidros"} className="input">{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="label" htmlFor="subcategory">Linha</label>
          <select id="subcategory" name="subcategory" defaultValue={p.subcategory} className="input">{categories.map((c) => <optgroup key={c.id} label={c.name}>{c.subcategories.map((s) => <option key={c.id + s.id} value={s.id}>{s.name}</option>)}</optgroup>)}</select></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="summary">Resumo</label><input id="summary" name="summary" defaultValue={p.summary} className="input" /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="description">Descrição</label><textarea id="description" name="description" rows={4} defaultValue={p.description} className="input" /></div>
        <div><label className="label" htmlFor="applications">Aplicações (uma por linha)</label><textarea id="applications" name="applications" rows={5} defaultValue={p.applications?.join("\n")} className="input" /></div>
        <div><label className="label" htmlFor="specs">Características técnicas confirmadas (Rótulo: valor, uma por linha)</label><textarea id="specs" name="specs" rows={5} defaultValue={p.specs?.map((s) => `${s.label}: ${s.value}`).join("\n")} className="input" placeholder="Espessura: 8 mm" /></div>
        <div><label className="label" htmlFor="image">URL da fotografia</label><input id="image" name="image" defaultValue={p.image} className="input" placeholder="/products/arquivo.jpg ou https://..." /></div>
        <div><label className="label" htmlFor="imageAlt">Texto alternativo da foto</label><input id="imageAlt" name="imageAlt" defaultValue={p.imageAlt} className="input" /></div>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="active" defaultChecked={p.active} className="h-4 w-4" /> Publicado</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" defaultChecked={p.featured} className="h-4 w-4" /> Destaque na página inicial</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="validated" defaultChecked={p.validated} className="h-4 w-4" /> Validado no catálogo oficial</label>
        </div>
        <div className="sm:col-span-2"><button className="btn-primary">Salvar produto</button></div>
      </form>
    </AdminShell>
  );
}
