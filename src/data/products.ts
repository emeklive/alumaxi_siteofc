import type { Product } from "@/types";

/**
 * CATÁLOGO ALUMAXI
 * ----------------
 * Produtos confirmados nas artes oficiais enviadas pela Alumaxi (novembro de 2026).
 * Fotos: recortes das próprias artes (/public/products/<slug>.webp) e a arte completa
 * (/public/products/<slug>-arte.webp).
 *
 * Regra: `specs` só recebe o que está escrito nas artes (cores, tamanhos, medidas).
 * Capacidades, códigos, fabricantes e demais dados técnicos ficam "sob consulta"
 * até a empresa confirmar.
 *
 * Para incluir um produto: copie um bloco, troque os dados e coloque as imagens
 * em /public/products com o mesmo nome do slug.
 */
const img = (slug: string) => `/products/${slug}.webp`;
const art = (slug: string, name: string) => [{ src: `/products/${slug}-arte.webp`, alt: `Arte oficial Alumaxi: ${name}` }];

const p = (
  x: Omit<Product, "validated" | "active" | "specs" | "image" | "imageAlt" | "gallery"> &
    Partial<Pick<Product, "specs">> & { photo?: string },
): Product => {
  const photo = x.photo ?? x.slug;
  const { photo: _photo, ...rest } = x;
  void _photo;
  return {
    specs: [],
    validated: true,
    active: true,
    image: img(photo),
    imageAlt: `${x.name} — Alumaxi Fortaleza`,
    gallery: art(photo, x.name),
    updatedAt: "2026-11-19",
    ...rest,
  };
};

export const seedProducts: Product[] = [
  // ---------------- VIDROS ----------------
  p({
    id: "vidro-temperado",
    slug: "vidro-temperado",
    name: "Vidro temperado",
    category: "vidros",
    subcategory: "temperados",
    summary: "Vidro de segurança para portas, boxes, janelas de correr, divisórias e tampos.",
    description:
      "Obtido por tratamento térmico, o vidro temperado tem resistência mecânica superior ao vidro comum e, em caso de quebra, fragmenta-se em pequenos pedaços. Como não pode ser cortado ou furado depois da têmpera, é produzido a partir das medidas finais do projeto. Informe medidas, espessura, cor e furações no pedido de orçamento.",
    applications: ["Boxes para banheiro", "Portas e janelas de correr", "Divisórias", "Tampos e prateleiras"],
    specs: [{ label: "Espessuras e cores", value: "Sob consulta" }],
    featured: true,
  }),

  // ---------------- ALUMÍNIO ----------------
  p({
    id: "lambri-liso-portao",
    slug: "lambri-liso-portao",
    name: "Lambri liso para portão",
    category: "aluminio",
    subcategory: "lambris",
    summary: "Lambri de alumínio de superfície lisa para fechamento de portões.",
    description:
      "Perfil lambri liso para o fechamento de portões e painéis em alumínio. Disponível nas cores branco e preto. Consulte medidas e comprimentos com a equipe comercial.",
    applications: ["Portões", "Fechamentos", "Painéis em alumínio"],
    specs: [{ label: "Cores", value: "Branco e preto" }],
    featured: true,
  }),
  p({
    id: "lambri-tubular-triplo",
    slug: "lambri-tubular-triplo",
    name: "Lambri tubular triplo",
    category: "aluminio",
    subcategory: "lambris",
    summary: "Lambri de alumínio tubular com três câmaras internas.",
    description:
      "Perfil lambri tubular de três câmaras para portões e fechamentos em alumínio. Disponível nas cores branco e preto. Consulte medidas e comprimentos com a equipe comercial.",
    applications: ["Portões", "Fechamentos", "Painéis em alumínio"],
    specs: [{ label: "Cores", value: "Branco e preto" }],
    featured: true,
  }),
  p({
    id: "lambri-cartola",
    slug: "lambri-cartola",
    name: "Lambri cartola",
    category: "aluminio",
    subcategory: "lambris",
    summary: "Lambri de alumínio modelo cartola para portões e fechamentos.",
    description:
      "Perfil lambri modelo cartola para portões e fechamentos em alumínio. Disponível nas cores branco e preto. Consulte medidas e comprimentos com a equipe comercial.",
    applications: ["Portões", "Fechamentos", "Painéis em alumínio"],
    specs: [{ label: "Cores", value: "Branco e preto" }],
  }),
  p({
    id: "batedor-reposicao",
    slug: "batedor-reposicao",
    name: "Batedor de 6,5 e 7,0 (reposição)",
    category: "aluminio",
    subcategory: "reposicao",
    summary: "Perfil batedor de alumínio para reposição, nas versões 6,5 e 7,0.",
    description:
      "Perfil batedor de alumínio para reposição em esquadrias, nas versões 6,5 e 7,0. Disponível nas cores branco e preto. Confirme a linha da sua esquadria com a equipe comercial antes do pedido.",
    applications: ["Reposição em esquadrias", "Manutenção"],
    specs: [
      { label: "Versões", value: "6,5 e 7,0" },
      { label: "Cores", value: "Branco e preto" },
    ],
  }),
  p({
    id: "pc-reposicao",
    slug: "pc-reposicao",
    name: "PC de 6,0 e 6,5 (reposição)",
    category: "aluminio",
    subcategory: "reposicao",
    summary: "Perfil PC de alumínio para reposição, nas versões 6,0 e 6,5.",
    description:
      "Perfil PC de alumínio para reposição em esquadrias, nas versões 6,0 e 6,5. Disponível nas cores branco e preto. Confirme a linha da sua esquadria com a equipe comercial antes do pedido.",
    applications: ["Reposição em esquadrias", "Manutenção"],
    specs: [
      { label: "Versões", value: "6,0 e 6,5" },
      { label: "Cores", value: "Branco e preto" },
    ],
  }),
  p({
    id: "kit-pia",
    slug: "kit-pia",
    name: "Kit pia",
    category: "aluminio",
    subcategory: "kits",
    summary: "Kit para gabinete de pia com portas de correr em vidro.",
    description:
      "Kit para montagem de gabinete de pia com portas de correr em vidro, como mostrado na foto. Composição, medidas, cores e acabamentos sob consulta com a equipe comercial.",
    applications: ["Cozinhas", "Áreas de serviço", "Gabinetes sob medida"],
    featured: true,
  }),

  // ---------------- FERRAGENS ----------------
  p({
    id: "mola-action-pequena",
    slug: "mola-action-pequena",
    name: "Mola Action pequena",
    category: "ferragens",
    subcategory: "molas",
    summary: "Mola de piso Action, tamanho pequeno, para portas de vidro.",
    description:
      "Mola de piso Action no tamanho pequeno, instalada no piso para controlar o fechamento de portas de vidro. Capacidade de carga, dimensões da porta e acessórios compatíveis sob consulta com a equipe comercial.",
    applications: ["Portas de vidro temperado", "Entradas comerciais"],
    specs: [{ label: "Tamanho", value: "Pequena" }],
    featured: true,
  }),
  p({
    id: "puxador-400x300",
    slug: "puxador-400x300",
    name: "Puxador 400 mm x 300 mm entre furos",
    category: "ferragens",
    subcategory: "puxadores",
    summary: "Puxador curvo de 400 mm de comprimento e 300 mm entre furos.",
    description:
      "Puxador curvo duplo com 400 mm de comprimento total e 300 mm entre furos, conforme o desenho técnico da arte. Cor branca. Consulte a espessura de vidro ou porta compatível com a equipe comercial.",
    applications: ["Portas de vidro", "Portas de alumínio"],
    specs: [
      { label: "Comprimento", value: "400 mm" },
      { label: "Distância entre furos", value: "300 mm" },
      { label: "Cota indicada no desenho", value: "38 mm" },
      { label: "Cor", value: "Branco" },
    ],
    featured: true,
  }),
  p({
    id: "puxador-inox",
    slug: "puxador-inox",
    name: "Puxador inox",
    category: "ferragens",
    subcategory: "puxadores",
    summary: "Puxador duplo tubular em inox para portas.",
    description:
      "Puxador duplo tubular em aço inox, com hastes de fixação nas duas faces da porta. Medidas disponíveis sob consulta com a equipe comercial.",
    applications: ["Portas de vidro", "Portas de alumínio", "Entradas comerciais"],
    specs: [{ label: "Material", value: "Inox" }],
    featured: true,
  }),
  p({
    id: "roldana-guia-buzio-duplo",
    slug: "roldana-guia-buzio-duplo",
    name: "Roldana guia búzio duplo deslizante",
    category: "ferragens",
    subcategory: "roldanas",
    summary: "Roldana guia com búzio duplo para sistemas de correr.",
    description:
      "Roldana guia com búzio duplo deslizante, usada para guiar folhas de correr. Consulte a linha de esquadria compatível com a equipe comercial.",
    applications: ["Janelas de correr", "Portas de correr", "Manutenção de esquadrias"],
  }),
  p({
    id: "tucano",
    slug: "tucano",
    name: "Suporte tucano",
    category: "ferragens",
    subcategory: "suportes",
    summary: "Suporte tucano para prateleiras de vidro.",
    description:
      "Suporte modelo tucano, com acabamento cromado como na foto, para fixar prateleiras de vidro na parede. Espessuras de vidro compatíveis sob consulta.",
    applications: ["Prateleiras de vidro", "Banheiros", "Lojas e vitrines"],
  }),

  // ---------------- ACESSÓRIOS ----------------
  p({
    id: "ventosa-dupla-tripla",
    slug: "ventosa-dupla-tripla",
    name: "Ventosa dupla e tripla",
    category: "acessorios",
    subcategory: "ferramentas",
    summary: "Ventosas para levantar e transportar chapas de vidro, em versão dupla e tripla.",
    description:
      "Ventosas manuais para segurar, levantar e posicionar chapas de vidro e outras superfícies lisas, disponíveis nas versões dupla e tripla. Capacidade de carga sob consulta.",
    applications: ["Transporte de vidro", "Instalação de vidros", "Vidraçarias"],
    specs: [{ label: "Versões", value: "Dupla e tripla" }],
    featured: true,
  }),
  p({
    id: "lixa-norton",
    slug: "lixa-norton",
    name: "Lixa Norton",
    category: "acessorios",
    subcategory: "abrasivos",
    summary: "Discos de lixa da marca Norton.",
    description:
      "Discos de lixa da marca Norton para acabamento e preparação de superfícies. Granulações e diâmetros disponíveis sob consulta.",
    applications: ["Acabamento", "Serralheria", "Manutenção"],
    specs: [{ label: "Marca", value: "Norton" }],
  }),
];
