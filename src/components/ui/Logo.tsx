import { cn } from "@/lib/utils";

/**
 * Logotipo oficial da Alumaxi (vetorizado a partir do arquivo enviado pela empresa).
 * - variant "dark": logo laranja, para fundos claros.
 * - variant "light": logo branco, para fundos escuros (verde-petróleo, laranja).
 * - symbolOnly: apenas o símbolo "A" (ícones, espaços reduzidos).
 */
export function Logo({
  variant = "dark",
  symbolOnly = false,
  className,
}: {
  variant?: "dark" | "light";
  symbolOnly?: boolean;
  className?: string;
}) {
  const file = symbolOnly
    ? variant === "light"
      ? "/brand/alumaxi-simbolo-branco.svg"
      : "/brand/alumaxi-simbolo.svg"
    : variant === "light"
      ? "/brand/alumaxi-logo-branco.svg"
      : "/brand/alumaxi-logo.svg";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={file}
      alt="Alumaxi"
      width={symbolOnly ? 556 : 1446}
      height={564}
      className={cn("block w-auto select-none", className ?? "h-10")}
      draggable={false}
      data-logo="oficial"
    />
  );
}
