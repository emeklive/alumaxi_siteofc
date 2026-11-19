import type { Category } from "@/types";
import { images } from "./images";

/**
 * Categorias confirmadas pela razão social da empresa
 * ("Comércio de Alumínio, Ferragens, Acessórios e Vidros").
 * Subcategorias: estrutura inicial a validar com o catálogo oficial.
 */
export const categories: Category[] = [
  {
    id: "vidros",
    name: "Vidros",
    slug: "vidros",
    page: "/vidros",
    short: "Vidros e espelhos para obras residenciais e comerciais.",
    description:
      "Linhas de vidro para esquadrias, boxes, portas, divisórias, fachadas e projetos de interiores, além de espelhos para decoração e banheiros.",
    image: images.glassFacade.src,
    imageAlt: images.glassFacade.alt,
    subcategories: [
      { id: "temperados", name: "Vidros temperados" },
    ],
  },
  {
    id: "aluminio",
    name: "Alumínio",
    slug: "aluminio",
    page: "/aluminio",
    short: "Lambris, perfis de reposição e kits.",
    description:
      "Perfis de alumínio, linhas para esquadrias e componentes complementares para serralheiros e fabricantes de esquadrias.",
    image: images.facadeWindows.src,
    imageAlt: images.facadeWindows.alt,
    subcategories: [
      { id: "lambris", name: "Lambris para portão" },
      { id: "reposicao", name: "Perfis de reposição" },
      { id: "kits", name: "Kits" },
    ],
  },
  {
    id: "ferragens",
    name: "Ferragens",
    slug: "ferragens",
    page: "/ferragens-e-acessorios",
    short: "Molas, puxadores, roldanas e suportes.",
    description:
      "Molas, puxadores, roldanas e suportes para portas, janelas e prateleiras de vidro.",
    image: images.glassDoors.src,
    imageAlt: images.glassDoors.alt,
    subcategories: [
      { id: "molas", name: "Molas" },
      { id: "puxadores", name: "Puxadores" },
      { id: "roldanas", name: "Roldanas e guias" },
      { id: "suportes", name: "Suportes para vidro" },
    ],
  },
  {
    id: "acessorios",
    name: "Acessórios",
    slug: "acessorios",
    page: "/ferragens-e-acessorios#acessorios",
    short: "Ventosas, lixas e itens de instalação.",
    description: "Ferramentas e itens de acabamento para o vidraceiro e o serralheiro.",
    image: images.tools.src,
    imageAlt: images.tools.alt,
    subcategories: [
      { id: "ferramentas", name: "Ferramentas para vidraceiro" },
      { id: "abrasivos", name: "Abrasivos" },
    ],
  },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const subcategoryName = (catId: string, subId: string) =>
  getCategory(catId)?.subcategories.find((s) => s.id === subId)?.name ?? subId;
