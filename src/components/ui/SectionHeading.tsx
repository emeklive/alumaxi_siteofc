import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  className,
}: { eyebrow?: string; title: React.ReactNode; text?: React.ReactNode; align?: "left" | "center"; light?: boolean; className?: string }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <span className={cn("eyebrow", light && "eyebrow-light", align === "center" && "justify-center")}>{eyebrow}</span>}
      <h2 className={cn("mt-3 text-3xl sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]", light && "text-white")}>{title}</h2>
      {text && <p className={cn("mt-4 text-lg leading-relaxed", light ? "text-white/80" : "text-ink-soft")}>{text}</p>}
    </div>
  );
}
