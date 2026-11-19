"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileUp, Loader2, Plus, Send, Trash2, X, Paperclip, Copy } from "lucide-react";
import type { Product, Category } from "@/types";
import { quoteSchema, flattenErrors, FILE_RULES } from "@/lib/validation";
import { whatsappLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";
import { Field, PhoneInput, SpamGuard, Consent, formatBytes } from "./Fields";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type Item = { key: number; category: string; product: string; quantity: string; measures: string; notes: string };
let k = 1;
const emptyItem = (category = "", product = ""): Item => ({ key: k++, category, product, quantity: "", measures: "", notes: "" });

export function QuoteForm({ products, categories, preselect }: { products: Product[]; categories: Category[]; preselect?: Product | null }) {
  const [startedAt] = useState(() => Date.now());
  const [data, setData] = useState({ name: "", company: "", whatsapp: "", email: "", city: "Fortaleza", description: "" });
  const [items, setItems] = useState<Item[]>(() => [emptyItem(preselect?.category ?? "", preselect?.name ?? "")]);
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [protocol, setProtocol] = useState("");
  const [serverMsg, setServerMsg] = useState("");
  const [fileError, setFileError] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof typeof data) => (v: string) => setData((d) => ({ ...d, [k]: v }));
  const setItem = (key: number, patch: Partial<Item>) => setItems((arr) => arr.map((it) => (it.key === key ? { ...it, ...patch } : it)));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFileError("");
    const next = [...files];
    for (const f of Array.from(list)) {
      if (!(FILE_RULES.quote.types as readonly string[]).includes(f.type)) { setFileError(`"${f.name}" não é um formato aceito.`); continue; }
      if (f.size > FILE_RULES.quote.maxSize) { setFileError(`"${f.name}" ultrapassa 10 MB.`); continue; }
      if (next.length >= FILE_RULES.quote.maxFiles) { setFileError("Limite de 5 arquivos."); break; }
      next.push(f);
    }
    setFiles(next);
  };

  const summaryText = useMemo(() => {
    const lines = [
      `*Solicitação de orçamento${protocol ? ` ${protocol}` : ""} — site Alumaxi*`,
      `Nome: ${data.name}${data.company ? ` (${data.company})` : ""}`,
      `WhatsApp: ${data.whatsapp} · E-mail: ${data.email}`,
      `Cidade: ${data.city}`,
      "",
      ...items.map((it, i) => `${i + 1}. ${it.product} — ${categories.find((c) => c.id === it.category)?.name ?? it.category} · Qtd: ${it.quantity}${it.measures ? ` · Medidas: ${it.measures}` : ""}${it.notes ? ` · Obs.: ${it.notes}` : ""}`),
      ...(data.description ? ["", `Descrição: ${data.description}`] : []),
      ...(files.length ? ["", `Anexos enviados pelo site: ${files.length}`] : []),
    ];
    return lines.join("\n");
  }, [data, items, files.length, protocol, categories]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { ...data, items: items.map(({ key: _k, ...rest }) => rest), consent };
    const parsed = quoteSchema.safeParse(payload);
    if (!parsed.success) {
      const errs = flattenErrors(parsed.error);
      setErrors(errs);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    setErrors({});
    setStatus("sending");
    setServerMsg("");

    if (siteConfig.staticPreview) {
      setProtocol("PRÉVIA");
      setStatus("done");
      return;
    }
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("payload", JSON.stringify(parsed.data));
      fd.delete("files");
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/orcamento", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors) setErrors(json.errors);
        setServerMsg(json.message ?? "Não foi possível enviar agora. Tente novamente ou use o WhatsApp.");
        setStatus("error");
        return;
      }
      setProtocol(json.protocol);
      setStatus("done");
      window.scrollTo({ top: (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120, behavior: "smooth" });
    } catch {
      setServerMsg("Falha de conexão. Verifique sua internet ou envie pelo WhatsApp.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-10" data-testid="quote-success" role="status">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-10 w-10 shrink-0 text-green-600" />
          <div>
            <h2 className="text-2xl">Solicitação registrada!</h2>
            {siteConfig.staticPreview ? (
              <p className="mt-2 text-ink-soft">Esta é uma <strong>prévia do site</strong>: para concluir, envie o resumo abaixo pelo WhatsApp.</p>
            ) : (
              <p className="mt-2 text-ink-soft">Protocolo <strong className="text-ink" data-testid="quote-protocol">{protocol}</strong>. Nossa equipe comercial vai analisar seu pedido e retornar pelo WhatsApp ou e-mail informado. Os valores serão informados no atendimento.</p>
            )}
          </div>
        </div>
        <div className="mt-8 rounded-lg bg-surface p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-petrol">Resumo do pedido</h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div><dt className="text-ink-soft">Nome</dt><dd className="font-semibold">{data.name}{data.company && ` · ${data.company}`}</dd></div>
            <div><dt className="text-ink-soft">Contato</dt><dd className="font-semibold">{data.whatsapp} · {data.email}</dd></div>
            <div><dt className="text-ink-soft">Cidade</dt><dd className="font-semibold">{data.city}</dd></div>
            <div><dt className="text-ink-soft">Anexos</dt><dd className="font-semibold">{files.length || "Nenhum"}</dd></div>
          </dl>
          <ol className="mt-4 space-y-2 text-sm">
            {items.map((it, i) => (
              <li key={it.key} className="rounded-md border border-line bg-white p-3"><strong>{i + 1}. {it.product}</strong> — {categories.find((c) => c.id === it.category)?.name} · Qtd: {it.quantity}{it.measures && ` · ${it.measures}`}</li>
            ))}
          </ol>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink(summaryText)} target="_blank" rel="noopener noreferrer" className="btn bg-[#1FAF54] text-white hover:bg-[#178f44]" data-testid="quote-whatsapp">
            <WhatsAppIcon /> {siteConfig.staticPreview ? "Enviar pelo WhatsApp" : "Agilizar pelo WhatsApp"}
          </a>
          <button type="button" className="btn-outline" onClick={async () => { await navigator.clipboard?.writeText(summaryText).catch(() => {}); setCopied(true); }}>
            <Copy className="h-4 w-4" /> {copied ? "Resumo copiado" : "Copiar resumo"}
          </button>
          <Link href="/produtos" className="btn-outline">Voltar aos produtos</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative space-y-10" data-testid="quote-form" encType="multipart/form-data">
      <SpamGuard startedAt={startedAt} />

      <fieldset className="card p-6 sm:p-8">
        <legend className="sr-only">Seus dados</legend>
        <h2 className="flex items-center gap-3 text-xl"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-petrol text-sm text-white">1</span> Seus dados</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Nome completo" required error={errors.name}>
            <input id="name" name="name" autoComplete="name" className="input" value={data.name} onChange={(e) => set("name")(e.target.value)} aria-invalid={Boolean(errors.name)} />
          </Field>
          <Field id="company" label="Empresa" hint="Opcional">
            <input id="company" name="company" autoComplete="organization" className="input" value={data.company} onChange={(e) => set("company")(e.target.value)} />
          </Field>
          <Field id="whatsapp" label="WhatsApp" required error={errors.whatsapp}>
            <PhoneInput id="whatsapp" name="whatsapp" value={data.whatsapp} onChange={set("whatsapp")} error={errors.whatsapp} />
          </Field>
          <Field id="email" label="E-mail" required error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" className="input" value={data.email} onChange={(e) => set("email")(e.target.value)} aria-invalid={Boolean(errors.email)} />
          </Field>
          <Field id="city" label="Cidade" required error={errors.city}>
            <input id="city" name="city" autoComplete="address-level2" className="input" value={data.city} onChange={(e) => set("city")(e.target.value)} aria-invalid={Boolean(errors.city)} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="card p-6 sm:p-8">
        <legend className="sr-only">Itens do orçamento</legend>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-3 text-xl"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-petrol text-sm text-white">2</span> Itens do orçamento</h2>
          <span className="text-sm text-ink-soft">{items.length} {items.length === 1 ? "item" : "itens"}</span>
        </div>
        {errors.items && <p className="field-error">{errors.items}</p>}
        <div className="mt-6 space-y-5">
          <AnimatePresence initial={false}>
            {items.map((it, i) => {
              const opts = products.filter((p) => !it.category || p.category === it.category);
              return (
                <motion.div key={it.key} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden" data-testid="quote-item">
                  <div className="rounded-lg border border-line bg-surface p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-bold text-brand-petrol">Item {i + 1}</p>
                      {items.length > 1 && (
                        <button type="button" onClick={() => setItems((a) => a.filter((x) => x.key !== it.key))} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:underline" aria-label={`Remover item ${i + 1}`}>
                          <Trash2 className="h-4 w-4" /> Remover
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Field id={`cat-${it.key}`} label="Categoria" required error={errors[`items.${i}.category`]}>
                        <select id={`cat-${it.key}`} className="input" value={it.category} onChange={(e) => setItem(it.key, { category: e.target.value })} aria-invalid={Boolean(errors[`items.${i}.category`])}>
                          <option value="">Selecione</option>
                          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </Field>
                      <Field id={`prod-${it.key}`} label="Produto desejado" required error={errors[`items.${i}.product`]}>
                        <input id={`prod-${it.key}`} list={`prod-list-${it.key}`} className="input" value={it.product} onChange={(e) => setItem(it.key, { product: e.target.value })} placeholder="Ex.: vidro temperado" aria-invalid={Boolean(errors[`items.${i}.product`])} />
                        <datalist id={`prod-list-${it.key}`}>{opts.map((p) => <option key={p.id} value={p.name} />)}</datalist>
                      </Field>
                      <Field id={`qty-${it.key}`} label="Quantidade" required error={errors[`items.${i}.quantity`]}>
                        <input id={`qty-${it.key}`} className="input" value={it.quantity} onChange={(e) => setItem(it.key, { quantity: e.target.value })} placeholder="Ex.: 4 peças / 12 m²" aria-invalid={Boolean(errors[`items.${i}.quantity`])} />
                      </Field>
                      <Field id={`meas-${it.key}`} label="Medidas (mm)">
                        <input id={`meas-${it.key}`} className="input" value={it.measures} onChange={(e) => setItem(it.key, { measures: e.target.value })} placeholder="Largura × altura" />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <label htmlFor={`notes-${it.key}`} className="label">Observações do item</label>
                      <input id={`notes-${it.key}`} className="input" value={it.notes} onChange={(e) => setItem(it.key, { notes: e.target.value })} placeholder="Espessura, cor, acabamento, furos..." />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <button type="button" onClick={() => setItems((a) => [...a, emptyItem()])} disabled={items.length >= 20} className="btn-outline btn-sm mt-5" data-testid="add-item">
          <Plus className="h-4 w-4" /> Adicionar outro item
        </button>
      </fieldset>

      <fieldset className="card p-6 sm:p-8">
        <legend className="sr-only">Detalhes e anexos</legend>
        <h2 className="flex items-center gap-3 text-xl"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-petrol text-sm text-white">3</span> Detalhes e anexos</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Field id="description" label="Descrição do projeto" hint="Conte a aplicação, prazos desejados e outras informações úteis.">
            <textarea id="description" name="description" rows={6} className="input resize-y" value={data.description} onChange={(e) => set("description")(e.target.value)} />
          </Field>
          <div>
            <span className="label">Imagens ou projetos</span>
            <label
              htmlFor="files"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-petrol/30 bg-brand-petrol-light/40 px-4 py-8 text-center transition hover:border-brand-petrol hover:bg-brand-petrol-light"
            >
              <FileUp className="h-8 w-8 text-brand-petrol" />
              <span className="font-semibold text-ink">Clique ou arraste os arquivos aqui</span>
              <span className="text-xs text-ink-soft">{FILE_RULES.quote.label}</span>
            </label>
            <input id="files" name="files" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} data-testid="quote-files" />
            {fileError && <p className="field-error" role="alert">{fileError}</p>}
            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <li key={f.name + i} className="flex items-center justify-between gap-3 rounded-md border border-line bg-white px-3 py-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2"><Paperclip className="h-4 w-4 shrink-0 text-brand-petrol" /><span className="truncate">{f.name}</span><span className="shrink-0 text-ink-soft">{formatBytes(f.size)}</span></span>
                    <button type="button" aria-label={`Remover ${f.name}`} onClick={() => setFiles((a) => a.filter((_, j) => j !== i))} className="rounded p-1 text-ink-soft hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </fieldset>

      <div className="card space-y-6 p-6 sm:p-8">
        <Consent
          checked={consent}
          onChange={setConsent}
          error={errors.consent}
          text={<>Autorizo a Alumaxi a utilizar meus dados para responder a esta solicitação, conforme a <Link href="/privacidade" className="font-semibold text-brand-petrol underline">Política de privacidade</Link> (LGPD).</>}
        />
        {status === "error" && serverMsg && <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">{serverMsg}</p>}
        {Object.keys(errors).length > 0 && <p className="text-sm font-semibold text-red-600" role="alert">Revise os campos destacados.</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">Os valores são informados pela equipe comercial após a análise do pedido.</p>
          <button type="submit" className="btn-primary text-base" disabled={status === "sending"} data-testid="quote-submit">
            {status === "sending" ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando...</> : <><Send className="h-5 w-5" /> Enviar solicitação</>}
          </button>
        </div>
      </div>
    </form>
  );
}
