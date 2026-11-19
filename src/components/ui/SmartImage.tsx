"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** next/image com fallback gráfico na paleta da marca se a foto não carregar. */
export function SmartImage({ className, alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 bg-[linear-gradient(135deg,var(--color-brand-petrol-dark),var(--color-brand-petrol)_55%,var(--color-brand-petrol-dark))]",
          className,
        )}
      >
        <div className="absolute inset-0 opacity-25 [background:repeating-linear-gradient(115deg,transparent_0_38px,rgb(255_255_255/0.35)_38px_40px)]" />
        <div className="absolute -right-10 bottom-0 h-1/2 w-1/3 geo-slash bg-brand-orange/80" />
      </div>
    );
  }
  return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
