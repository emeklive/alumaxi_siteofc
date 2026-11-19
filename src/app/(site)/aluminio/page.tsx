import { CategoryLanding } from "@/components/sections/CategoryLanding";
import { categories } from "@/data/categories";
import { images } from "@/data/images";
import { getProductsByCategory } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Alumínio para esquadrias em Fortaleza",
  description: "Lambris para portão (liso, tubular triplo e cartola), perfis de reposição e kit pia em alumínio. Alumaxi Fortaleza.",
  path: "/aluminio",
  image: images.facadeWindows.src,
});

export default async function AluminioPage() {
  const cat = categories.find((c) => c.id === "aluminio")!;
  return (
    <CategoryLanding
      title="Alumínio"
      text="Lambris para portão, perfis de reposição e kits para serralheiros e fabricantes de esquadrias."
      heroImage={images.facadeBalconies.src}
      heroAlt={images.facadeBalconies.alt}
      path="/aluminio"
      intro={{
        title: "Lambris, reposição e kits",
        text: "Atendemos serralheiros e empresas de esquadrias com perfis e componentes de alumínio. Medidas, comprimentos e disponibilidade são confirmados no atendimento.",
        bullets: ["Lambri liso, tubular triplo e cartola para portões", "Lambris nas cores branco e preto", "Batedor 6,5 e 7,0 e PC 6,0 e 6,5 para reposição", "Kit pia com portas de correr em vidro"],
        image: "/products/lambri-tubular-triplo.webp",
        imageAlt: "Lambri tubular triplo — Alumaxi Fortaleza",
      }}
      groups={[{ category: cat, products: await getProductsByCategory("aluminio") }]}
    />
  );
}
