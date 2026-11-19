"use client";
import { maskPhone } from "@/lib/utils";

export function Field({ id, label, error, required, children, hint }: { id: string; label: string; error?: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required && <span className="text-brand-orange-dark"> *</span>}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
      {error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export function PhoneInput({ id, name, value, onChange, error, placeholder = "(85) 99999-9999" }: { id: string; name: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string }) {
  return (
    <input
      id={id}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      value={value}
      onChange={(e) => onChange(maskPhone(e.target.value))}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className="input"
    />
  );
}

/** Campos anti-spam: honeypot invisível + carimbo de tempo. */
export function SpamGuard({ startedAt }: { startedAt: number }) {
  return (
    <>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
    </>
  );
}

export function Consent({ checked, onChange, error, text }: { checked: boolean; onChange: (v: boolean) => void; error?: string; text: React.ReactNode }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
        <input type="checkbox" name="consent" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-brand-petrol)]" aria-invalid={Boolean(error)} />
        <span>{text}</span>
      </label>
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export function formatBytes(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`;
}
