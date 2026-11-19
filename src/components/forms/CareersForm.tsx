"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Loader2, Send, X } from "lucide-react";
import { applicationSchema, flattenErrors, FILE_RULES } from "@/lib/validation";
import { siteConfig } from "@/config/site";
import { Field, PhoneInput, SpamGuard, Consent, formatBytes } from "./Fields";

export function CareersForm() {
  const [startedAt] = useState(() => Date.now());
  const [d, setD] = useState({ name: "", phone: "", email: "", role: "", city: "Fortaleza" });
  const [resume, setResume] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [protocol, setProtocol] = useState("");
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const set = (k: keyof typeof d) => (v: string) => setD((x) => ({ ...x, [k]: v }));

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf") { setErrors((e) => ({ ...e, resume: "Envie o currículo em PDF." })); return; }
    if (f.size > FILE_RULES.resume.maxSize) { setErrors((e) => ({ ...e, resume: "O arquivo deve ter até 5 MB." })); return; }
    setErrors(({ resume: _r, ...rest }) => rest);
    setResume(f);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = applicationSchema.safeParse({ ...d, consent });
    const errs = parsed.success ? {} : flattenErrors(parsed.error);
    if (!resume) errs.resume = "Anexe seu currículo em PDF.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    setErrors({});
    setStatus("sending");
    if (siteConfig.staticPreview) { setStatus("done"); return; }
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("payload", JSON.stringify(parsed.data));
      fd.set("resume", resume!);
      const r = await fetch("/api/trabalhe-conosco", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { if (j.errors) setErrors(j.errors); setMsg(j.message ?? "Não foi possível enviar."); setStatus("error"); return; }
      setProtocol(j.protocol);
      setStatus("done");
    } catch {
      setMsg("Falha de conexão. Tente novamente.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="card p-8" role="status" data-testid="careers-success">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
        <h2 className="mt-4 text-2xl">Currículo recebido!</h2>
        <p className="mt-2 text-ink-soft">{siteConfig.staticPreview ? "Prévia do site: na versão publicada, o currículo é enviado à empresa." : <>Protocolo <strong className="text-ink">{protocol}</strong>. Se houver uma vaga compatível com seu perfil, entraremos em contato.</>}</p>
      </div>
    );
  }

  return (
    <form ref={ref} onSubmit={submit} noValidate className="card relative space-y-5 p-6 sm:p-8" data-testid="careers-form">
      <SpamGuard startedAt={startedAt} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="a-name" label="Nome completo" required error={errors.name}><input id="a-name" autoComplete="name" className="input" value={d.name} onChange={(e) => set("name")(e.target.value)} aria-invalid={Boolean(errors.name)} /></Field>
        <Field id="a-phone" label="Telefone" required error={errors.phone}><PhoneInput id="a-phone" name="phone" value={d.phone} onChange={set("phone")} error={errors.phone} /></Field>
        <Field id="a-email" label="E-mail" required error={errors.email}><input id="a-email" type="email" autoComplete="email" className="input" value={d.email} onChange={(e) => set("email")(e.target.value)} aria-invalid={Boolean(errors.email)} /></Field>
        <Field id="a-role" label="Cargo pretendido" required error={errors.role}><input id="a-role" className="input" value={d.role} onChange={(e) => set("role")(e.target.value)} placeholder="Ex.: vendedor(a), estoquista, motorista" aria-invalid={Boolean(errors.role)} /></Field>
        <Field id="a-city" label="Cidade" required error={errors.city}><input id="a-city" className="input" value={d.city} onChange={(e) => set("city")(e.target.value)} aria-invalid={Boolean(errors.city)} /></Field>
        <Field id="a-resume" label="Currículo (PDF até 5 MB)" required error={errors.resume}>
          {resume ? (
            <div className="flex items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 py-3 text-sm">
              <span className="flex min-w-0 items-center gap-2"><FileText className="h-4 w-4 shrink-0 text-brand-petrol" /><span className="truncate">{resume.name}</span><span className="text-ink-soft">{formatBytes(resume.size)}</span></span>
              <button type="button" onClick={() => setResume(null)} aria-label="Remover currículo" className="rounded p-1 hover:text-red-600"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <input id="a-resume" type="file" accept="application/pdf,.pdf" onChange={(e) => pick(e.target.files?.[0])} aria-invalid={Boolean(errors.resume)} className="input file:mr-3 file:rounded file:border-0 file:bg-brand-petrol file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white" data-testid="resume-input" />
          )}
        </Field>
      </div>
      <Consent checked={consent} onChange={setConsent} error={errors.consent} text={<>Autorizo a Alumaxi a tratar meus dados pessoais e meu currículo exclusivamente para fins de recrutamento, pelo prazo de até 12 meses, conforme a <Link href="/privacidade" className="font-semibold text-brand-petrol underline">Política de privacidade</Link> (LGPD).</>} />
      {status === "error" && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{msg}</p>}
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "sending"} data-testid="careers-submit">
        {status === "sending" ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando...</> : <><Send className="h-5 w-5" /> Enviar candidatura</>}
      </button>
    </form>
  );
}
