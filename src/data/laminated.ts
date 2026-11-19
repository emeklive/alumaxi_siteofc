/**
 * Seção "Vidro laminado, camada por camada" (rolagem + arraste para girar).
 * Cada camada do vidro apresenta um serviço. Os textos descrevem o atendimento
 * já informado no site; CONFIRME com a Alumaxi antes de publicar e ajuste aqui.
 */
export type LaminatedLayer = {
  id: string;
  part: string; // nome técnico da camada
  title: string; // serviço
  text: string;
  bullets: string[];
  kind: "glass" | "film" | "hardware";
};

export const laminatedIntro = {
  eyebrow: "Vidro laminado",
  title: "Camada por camada, do jeito que a sua obra precisa.",
  text: "Role a página para separar as camadas do vidro laminado e conhecer o atendimento da Alumaxi em cada etapa.",
  closingTitle: "Tudo junto, em um só pedido.",
  closingText: "Envie medidas, quantidades e fotos do projeto. A equipe comercial retorna com valores e disponibilidade.",
};

export const laminatedLayers: LaminatedLayer[] = [
  {
    id: "externo",
    part: "Lâmina externa",
    title: "Orientação na escolha do vidro",
    text: "Você informa a aplicação e a equipe indica o tipo de vidro adequado: guarda-corpo, cobertura, fachada ou vitrine.",
    bullets: ["Indicação conforme a aplicação", "Referência às normas técnicas"],
    kind: "glass",
  },
  {
    id: "pelicula",
    part: "Película intermediária",
    title: "Segurança em primeiro lugar",
    text: "No laminado, a película mantém os fragmentos presos se o vidro quebrar. Ajudamos a avaliar onde ele é a escolha certa.",
    bullets: ["Aplicações com risco de queda", "Conforto acústico e filtro UV, conforme a composição"],
    kind: "film",
  },
  {
    id: "interno",
    part: "Lâmina interna",
    title: "Orçamento com as medidas do seu projeto",
    text: "Monte o pedido online com vários itens, medidas em milímetros e anexos de fotos ou projetos.",
    bullets: ["Vários itens no mesmo pedido", "Fotos, PDFs e projetos anexados"],
    kind: "glass",
  },
  {
    id: "ferragens",
    part: "Ferragens e fixação",
    title: "Ferragens e acessórios para instalar",
    text: "Complete o pedido com ferragens, componentes de fixação e itens de instalação compatíveis com a espessura do vidro.",
    bullets: ["Ferragens para vidro", "Fixação e vedação"],
    kind: "hardware",
  },
];
