import { SmartImage } from "./SmartImage";
import { Breadcrumbs } from "./Breadcrumbs";
import { ScrollFx } from "./ScrollFx";

export function PageHero({
  title,
  text,
  image,
  imageAlt,
  crumbs,
  eyebrow,
  children,
}: {
  title: string;
  text?: string;
  image: string;
  imageAlt: string;
  crumbs: { name: string; path: string }[];
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-petrol-deep">
      <ScrollFx className="absolute inset-x-0 -top-16 -bottom-16 -z-10" y={[-60, 90]} scale={[1.08, 1]}>
        <SmartImage src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover opacity-45" />
      </ScrollFx>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-petrol-deep via-brand-petrol-deep/85 to-brand-petrol-deep/30" />
      <ScrollFx aria-hidden className="absolute -right-16 bottom-0 -z-10 hidden h-full w-72 md:block" y={[30, -70]}><div className="h-full w-full geo-slash bg-brand-orange/90" /></ScrollFx>
      <ScrollFx aria-hidden className="absolute right-44 bottom-0 -z-10 hidden h-2/3 w-24 md:block" y={[10, -140]}><div className="h-full w-full geo-slash bg-white/10" /></ScrollFx>
      <div className="container-x py-16 sm:py-20 lg:py-24">
        <Breadcrumbs items={crumbs} light />
        {eyebrow && <span className="eyebrow eyebrow-light mt-8">{eyebrow}</span>}
        <h1 className={`${eyebrow ? "mt-3" : "mt-8"} max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl lg:leading-[1.08]`}>{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{text}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
