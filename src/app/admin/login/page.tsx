import { adminEnabled } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const enabled = adminEnabled();
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-petrol-deep p-5">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lift">
        <Logo className="h-12" />
        <h1 className="mt-6 text-xl">Acesso administrativo</h1>
        {enabled ? (
          <LoginForm />
        ) : (
          <p className="mt-4 rounded-md bg-brand-orange-light p-4 text-sm text-ink">
            O painel está <strong>desativado</strong>. Defina as variáveis <code>ADMIN_PASSWORD</code> e <code>ADMIN_SESSION_SECRET</code> (32+ caracteres) no servidor para habilitá-lo.
          </p>
        )}
      </div>
    </div>
  );
}
