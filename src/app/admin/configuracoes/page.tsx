import { AdminShell } from "@/components/admin/AdminShell";
import { siteConfig } from "@/config/site";
import { storageMode } from "@/lib/store";

const Row = ({ k, v, env }: { k: string; v: string | null; env?: string }) => (
  <tr><td className="p-3 font-semibold">{k}</td><td className="p-3">{v ?? <span className="font-semibold text-brand-orange-dark">PENDENTE</span>}</td><td className="p-3 font-mono text-xs text-ink-soft">{env ?? "src/config/site.ts"}</td></tr>
);

export default function Config() {
  const u = siteConfig.unit;
  return (
    <AdminShell title="Configurações e contatos">
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-ink-soft"><tr><th className="p-3">Campo</th><th className="p-3">Valor atual</th><th className="p-3">Onde alterar</th></tr></thead>
          <tbody className="divide-y divide-line">
            <Row k="Endereço" v={u.address.full} />
            <Row k="Telefone" v={u.phone} />
            <Row k="WhatsApp comercial" v={siteConfig.contact.whatsappNumber} env="NEXT_PUBLIC_WHATSAPP_NUMBER" />
            <Row k="E-mail" v={siteConfig.contact.email} env="NEXT_PUBLIC_CONTACT_EMAIL" />
            <Row k="Instagram" v={siteConfig.social.instagram} env="NEXT_PUBLIC_INSTAGRAM_URL" />
            <Row k="Facebook" v={siteConfig.social.facebook} env="NEXT_PUBLIC_FACEBOOK_URL" />
            <Row k="Logotipo" v={siteConfig.logo} />
            <Row k="Google Analytics" v={siteConfig.analytics.gaId} env="NEXT_PUBLIC_GA_ID" />
            <Row k="Search Console" v={siteConfig.analytics.gscVerification} env="NEXT_PUBLIC_GSC_VERIFICATION" />
            <Row k="Encaminhamento de formulários" v={process.env.FORMS_WEBHOOK_URL ? "Webhook configurado" : null} env="FORMS_WEBHOOK_URL" />
            <Row k="Armazenamento" v={storageMode === "supabase" ? "Supabase" : storageMode === "temporario-vercel" ? "TEMPORÁRIO na Vercel: configure o Supabase para não perder dados" : "Local (.data) — use Supabase em produção"} env="SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY" />
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-ink-soft">Por segurança, contatos e chaves ficam em variáveis de ambiente do servidor (Vercel → Settings → Environment Variables). Após alterar, faça um novo deploy.</p>
    </AdminShell>
  );
}
