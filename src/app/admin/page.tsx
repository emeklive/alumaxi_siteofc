import Link from "next/link";
import { Inbox, MessageSquare, Users, Package } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { list } from "@/lib/store";
import { getAllProducts } from "@/lib/catalog";
import { formatDateTime } from "@/lib/utils";
import type { ApplicationRecord, ContactRecord, QuoteRecord } from "@/types";

export default async function AdminHome() {
  const [quotes, contacts, apps, products] = await Promise.all([
    list<QuoteRecord>("quotes"), list<ContactRecord>("contacts"), list<ApplicationRecord>("applications"), getAllProducts(true),
  ]);
  const stats = [
    { label: "Orçamentos novos", value: quotes.filter((q) => q.status === "novo").length, total: quotes.length, href: "/admin/orcamentos", icon: Inbox },
    { label: "Mensagens novas", value: contacts.filter((q) => q.status === "novo").length, total: contacts.length, href: "/admin/mensagens", icon: MessageSquare },
    { label: "Currículos novos", value: apps.filter((q) => q.status === "novo").length, total: apps.length, href: "/admin/candidaturas", icon: Users },
    { label: "Produtos ativos", value: products.filter((p) => p.active).length, total: products.length, href: "/admin/produtos", icon: Package },
  ];
  return (
    <AdminShell title="Visão geral">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card flex items-center gap-4 p-5 hover:shadow-lift">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange text-white"><s.icon className="h-6 w-6" /></span>
            <div><p className="text-3xl font-extrabold">{s.value}</p><p className="text-sm text-ink-soft">{s.label} · {s.total} no total</p></div>
          </Link>
        ))}
      </div>
      <div className="card mt-8 overflow-hidden">
        <h2 className="border-b border-line p-5 text-lg">Últimos orçamentos</h2>
        {quotes.length === 0 ? <p className="p-5 text-ink-soft">Nenhum orçamento recebido ainda.</p> : (
          <ul className="divide-y divide-line">
            {quotes.slice(0, 6).map((q) => (
              <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                <span><strong>{q.protocol}</strong> · {q.name} · {q.items.length} item(ns)</span>
                <span className="flex items-center gap-3 text-ink-soft">{formatDateTime(q.createdAt)} <StatusBadge s={q.status} /></span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
