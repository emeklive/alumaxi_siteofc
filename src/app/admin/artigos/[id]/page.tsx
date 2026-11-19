import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAllArticles } from "@/lib/catalog";
import { saveArticle } from "../../actions";
import type { Article } from "@/types";

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "novo";
  const a: Partial<Article> | undefined = isNew ? { published: false } : (await getAllArticles(true)).find((x) => x.id === id);
  if (!a) notFound();
  return (
    <AdminShell title={isNew ? "Novo artigo" : "Editar artigo"}>
      <form action={saveArticle} className="card grid gap-5 p-6 sm:grid-cols-2">
        {!isNew && <input type="hidden" name="id" value={a.id} />}
        <div className="sm:col-span-2"><label className="label" htmlFor="title">Título *</label><input id="title" name="title" required defaultValue={a.title} className="input" /></div>
        <div><label className="label" htmlFor="slug">URL (slug)</label><input id="slug" name="slug" defaultValue={a.slug} className="input" /></div>
        <div><label className="label" htmlFor="category">Categoria</label>
          <select id="category" name="category" defaultValue={a.category} className="input">{["Vidros", "Alumínio", "Ferragens", "Instalação", "Arquitetura", "Construção civil", "Tendências"].map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="excerpt">Resumo (meta description)</label><input id="excerpt" name="excerpt" maxLength={170} defaultValue={a.excerpt} className="input" /></div>
        <div><label className="label" htmlFor="image">URL da imagem</label><input id="image" name="image" defaultValue={a.image} className="input" /></div>
        <div><label className="label" htmlFor="imageAlt">Texto alternativo</label><input id="imageAlt" name="imageAlt" defaultValue={a.imageAlt} className="input" /></div>
        <div><label className="label" htmlFor="publishedAt">Data</label><input id="publishedAt" name="publishedAt" type="date" defaultValue={a.publishedAt} className="input" /></div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold"><input type="checkbox" name="published" defaultChecked={a.published} className="h-4 w-4" /> Publicado</label>
        <div className="sm:col-span-2"><label className="label" htmlFor="body">Conteúdo (## para títulos, - para listas, **negrito**)</label><textarea id="body" name="body" rows={18} defaultValue={a.body} className="input font-mono text-sm" /></div>
        <div className="sm:col-span-2"><button className="btn-primary">Salvar artigo</button></div>
      </form>
    </AdminShell>
  );
}
