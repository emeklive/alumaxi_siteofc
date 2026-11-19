import Link from "next/link";
import { FileText, Inbox, LayoutDashboard, LogOut, MessageSquare, Package, Settings, Users, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { storageMode } from "@/lib/store";

const nav = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/orcamentos", label: "Orçamentos", icon: Inbox },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/admin/candidaturas", label: "Candidaturas", icon: Users },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/artigos", label: "Artigos", icon: FileText },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminShell({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[250px_1fr]">
      <aside className="bg-brand-petrol-deep p-5 text-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin"><Logo variant="light" className="h-9" /></Link>
          <p className="mt-1 text-xs text-white/60 lg:mb-8">Painel administrativo</p>
        </div>
        <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-0 lg:flex-col">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">
              <n.icon className="h-4 w-4 text-brand-orange" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden space-y-2 border-t border-white/10 pt-6 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-white/70 hover:text-white"><ExternalLink className="h-4 w-4" /> Ver site</Link>
          <form action="/api/admin/logout" method="post"><button className="flex items-center gap-2 text-sm text-white/70 hover:text-white"><LogOut className="h-4 w-4" /> Sair</button></form>
          <p className="pt-2 text-[0.7rem] text-white/40">Armazenamento: {storageMode}</p>
        </div>
      </aside>
      <main className="p-5 sm:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl">{title}</h1>
          <div className="flex gap-2">{actions}<form action="/api/admin/logout" method="post" className="lg:hidden"><button className="btn-outline btn-sm">Sair</button></form></div>
        </div>
        {children}
      </main>
    </div>
  );
}

export function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = { novo: "bg-brand-orange-light text-brand-orange-dark", "em-atendimento": "bg-brand-petrol-light text-brand-petrol", "em-analise": "bg-brand-petrol-light text-brand-petrol", concluido: "bg-green-100 text-green-700", respondido: "bg-green-100 text-green-700", arquivado: "bg-gray-100 text-gray-600" };
  return <span className={`rounded px-2 py-0.5 text-xs font-bold ${map[s] ?? "bg-gray-100"}`}>{s}</span>;
}
