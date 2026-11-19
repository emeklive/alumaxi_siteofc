import { siteConfig } from "@/config/site";

export function HoursList({ light = false }: { light?: boolean }) {
  return (
    <dl className={`space-y-1.5 text-sm ${light ? "text-white/80" : "text-ink-soft"}`}>
      {siteConfig.unit.hours.map((h) => (
        <div key={h.day} className="flex justify-between gap-6">
          <dt>{h.day}</dt>
          <dd className={`font-semibold ${light ? "text-white" : "text-ink"}`}>{h.open ? `${h.open} – ${h.close}` : "Fechado"}</dd>
        </div>
      ))}
    </dl>
  );
}
