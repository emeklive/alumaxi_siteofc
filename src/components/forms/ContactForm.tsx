"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { contactSchema, flattenErrors } from "@/lib/validation";
import { whatsappLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";
import { Field, PhoneInput, SpamGuard, Consent } from "./Fields";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function ContactForm() {
  const [startedAt] = useState(() => Date.now());
  const [d, setD] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [protocol, setProtocol] = useState("");
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const set = (k: keyof typeof d) => (v: string) => setD((x) => ({ ...x, [k]: v }));
  const waText = `Olá, Alumaxi! ${d.subject ? `Assunto: ${d.subject}. ` : ""}${d.message}`;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse({ ...d, consent });
    if (!parsed.success) {
      setErrors(flattenErrors(parsed.error));
      requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    setErrors({});
    setStatus("sending");
    if (siteConfig.staticPreview) { setStatus("done"); return; }
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("payload", JSON.stringify(parsed.data));
      const r = await fetch("/api/contato", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { if (j.errors) setErrors(j.errors); setMsg(j.message ?? "Não foi possível enviar."); setStatus("error"); return; }
      setProtocol(j.protocol);
      setStatus("done");
    } catch {
      setMsg("Falha de conexão. Tente novamente ou use o WhatsApp.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="card p-8" role="status" data-testid="contact-success">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
        <h2 className="mt-4 text-2xl">Mensagem enviada!</h2>
        <p className="mt-2 text-ink-soft">{siteConfig.staticPreview ? "Prévia do site: conclua o envio pelo WhatsApp." : <>Protocolo <strong className="text-ink">{protocol}</strong>. Retornaremos pelo contato informado.</>}</p>
        <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn mt-6 bg-[#1FAF54] text-white hover:bg-[#178f44]"><WhatsAppIcon /> Continuar pelo WhatsApp</a>
      </div>
    );
  }

  return (
    <form ref={ref} onSubmit={submit} noValidate className="card relative space-y-5 p-6 sm:p-8" data-testid="contact-form">
      <SpamGuard startedAt={startedAt} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Nome" required error={errors.name}><input id="c-name" autoComplete="name" className="input" value={d.name} onChange={(e) => set("name")(e.target.value)} aria-invalid={Boolean(errors.name)} /></Field>
        <Field id="c-email" label="E-mail" required error={errors.email}><input id="c-email" type="email" autoComplete="email" className="input" value={d.email} onChange={(e) => set("email")(e.target.value)} aria-invalid={Boolean(errors.email)} /></Field>
        <Field id="c-phone" label="Telefone / WhatsApp" error={errors.phone}><PhoneInput id="c-phone" name="phone" value={d.phone} onChange={set("phone")} error={errors.phone} /></Field>
        <Field id="c-subject" label="Assunto" required error={errors.subject}><input id="c-subject" className="input" value={d.subject} onChange={(e) => set("subject")(e.target.value)} aria-invalid={Boolean(errors.subject)} /></Field>
      </div>
      <Field id="c-message" label="Mensagem" required error={errors.message}><textarea id="c-message" rows={5} className="input resize-y" value={d.message} onChange={(e) => set("message")(e.target.value)} aria-invalid={Boolean(errors.message)} /></Field>
      <Consent checked={consent} onChange={setConsent} error={errors.consent} text={<>Autorizo o uso dos meus dados para retorno deste contato, conforme a <Link href="/privacidade" className="font-semibold text-brand-petrol underline">Política de privacidade</Link>.</>} />
      {status === "error" && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{msg}</p>}
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "sending"} data-testid="contact-submit">
        {status === "sending" ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando...</> : <><Send className="h-5 w-5" /> Enviar mensagem</>}
      </button>
    </form>
  );
}
