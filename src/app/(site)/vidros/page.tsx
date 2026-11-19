import { CategoryLanding } from "@/components/sections/CategoryLanding";
import { categories } from "@/data/categories";
import { images } from "@/data/images";
import { getProductsByCategory } from "@/lib/catalog";
import { LaminatedGlassScroll } from "@/components/sections/LaminatedGlassScroll";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Vidros e espelhos em Fortaleza",
  description: "Vidros comuns, temperados, laminados e espelhos para obras residenciais e comerciais. Solicite orçamento na Alumaxi Fortaleza.",
  path: "/vidros",
  image: images.glassFacade.src,
});

export default async function VidrosPage() {
  const cat = categories.find((c) => c.id === "vidros")!;
  return (
    <CategoryLanding
      title="Vidros"
      text="Vidros e espelhos para esquadrias, boxes, portas, divisórias, fachadas e projetos de interiores."
      heroImage={images.heroAlt.src}
      heroAlt={images.heroAlt.alt}
      path="/vidros"
      intro={{
        title: "O vidro certo para cada aplicação",
        text: "Segurança, conforto e estética dependem da escolha correta do vidro. Informe a aplicação e as medidas no orçamento para receber a orientação da equipe comercial.",
        bullets: ["Vidro temperado sob medida para portas, boxes e divisórias", "Medidas, espessuras e furações definidas no pedido", "Outros tipos de vidro sob consulta", "Orientação conforme a aplicação e as normas técnicas"],
        image: "/products/vidro-temperado.webp",
        imageAlt: "Vidro temperado — Alumaxi Fortaleza",
      }}
      feature={<LaminatedGlassScroll />}
      groups={[{ category: cat, products: await getProductsByCategory("vidros") }]}
    />
  );
}
