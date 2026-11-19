import { CategoryLanding } from "@/components/sections/CategoryLanding";
import { categories } from "@/data/categories";
import { images } from "@/data/images";
import { getProductsByCategory } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ferragens e acessórios para vidro",
  description: "Mola Action, puxadores, roldanas, suporte tucano, ventosas e lixas Norton em Fortaleza. Solicite orçamento na Alumaxi.",
  path: "/ferragens-e-acessorios",
  image: images.glassDoors.src,
});

export default async function FerragensPage() {
  const fer = categories.find((c) => c.id === "ferragens")!;
  const ace = categories.find((c) => c.id === "acessorios")!;
  return (
    <CategoryLanding
      title="Ferragens e acessórios"
      text="Componentes para montar, fixar e finalizar portas, janelas, boxes e divisórias com segurança."
      heroImage={images.corridorGlass.src}
      heroAlt={images.corridorGlass.alt}
      path="/ferragens-e-acessorios"
      intro={{
        title: "Os detalhes que garantem o resultado",
        text: "Ferragens e acessórios adequados são essenciais para o funcionamento e a durabilidade da instalação. Informe o modelo e a espessura do vidro para a indicação correta.",
        bullets: ["Mola de piso Action para portas de vidro", "Puxadores inox e puxador curvo 400 x 300 mm", "Roldana guia e suporte tucano", "Ventosas dupla e tripla e lixas Norton"],
        image: "/products/puxador-inox.webp",
        imageAlt: "Puxador inox — Alumaxi Fortaleza",
      }}
      groups={[
        { category: fer, products: await getProductsByCategory("ferragens") },
        { category: ace, products: await getProductsByCategory("acessorios") },
      ]}
    />
  );
}
