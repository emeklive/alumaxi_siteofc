import type { Article } from "@/types";
import { images } from "./images";

/** Artigos educativos iniciais (conteúdo técnico geral, sem afirmações comerciais). */
export const seedArticles: Article[] = [
  {
    id: "temperado-x-laminado",
    slug: "vidro-temperado-ou-laminado",
    title: "Vidro temperado ou laminado: qual usar em cada aplicação?",
    excerpt:
      "Os dois são vidros de segurança, mas se comportam de forma diferente na quebra. Entenda onde cada um costuma ser indicado.",
    category: "Vidros",
    image: images.glassDoors.src,
    imageAlt: images.glassDoors.alt,
    publishedAt: "2026-11-10",
    readingMinutes: 4,
    published: true,
    body: `Temperado e laminado são as duas famílias de vidro de segurança mais usadas na construção civil. A escolha depende principalmente de **como o vidro deve se comportar se quebrar**.

## Vidro temperado

O temperado passa por aquecimento e resfriamento controlados, o que aumenta sua resistência mecânica. Quando quebra, fragmenta-se em pequenos pedaços com menor risco de cortes profundos.

- Indicado para boxes, portas, janelas de correr e divisórias.
- Não pode ser cortado nem furado depois de temperado: as medidas e furações precisam estar definidas antes.

## Vidro laminado

O laminado une lâminas de vidro com uma película intermediária. Se quebrar, os fragmentos ficam presos à película e o painel tende a permanecer no lugar.

- Indicado onde a queda de fragmentos é um risco: guarda-corpos, coberturas, claraboias e fachadas.
- Também contribui para isolamento acústico e filtragem de radiação UV, conforme a composição.

## Normas e projeto

A definição do vidro deve seguir as normas técnicas aplicáveis (como a ABNT NBR 7199) e o projeto do profissional responsável. Na dúvida, envie as medidas e a aplicação na solicitação de orçamento para orientação da equipe comercial.`,
  },
  {
    id: "medir-vao",
    slug: "como-medir-o-vao-para-orcamento",
    title: "Como medir o vão para pedir um orçamento de vidro",
    excerpt:
      "Medidas corretas evitam retrabalho, principalmente com vidro temperado. Veja um passo a passo simples para enviar seu pedido.",
    category: "Instalação",
    image: images.blueprint.src,
    imageAlt: images.blueprint.alt,
    publishedAt: "2026-11-10",
    readingMinutes: 3,
    published: true,
    body: `Um orçamento preciso começa com uma medição bem feita. Isso é ainda mais importante para o vidro temperado, que não pode ser recortado depois de pronto.

## Passo a passo

- Meça a largura em três pontos (em cima, no meio e embaixo) e anote a menor medida.
- Meça a altura em três pontos (esquerda, centro e direita) e anote a menor medida.
- Confira o esquadro medindo as duas diagonais do vão.
- Use milímetros e indique sempre largura × altura.

## O que informar no pedido

- Tipo de vidro e espessura desejada, se já definidos.
- Aplicação (box, janela, porta, espelho, guarda-corpo etc.).
- Quantidade de peças e se há furos, recortes ou acabamentos.
- Fotos do local ou o projeto, se houver.

No formulário de orçamento da Alumaxi você pode adicionar vários itens e anexar fotos e projetos.`,
  },
  {
    id: "cuidados-aluminio",
    slug: "cuidados-com-esquadrias-de-aluminio",
    title: "Cuidados para conservar esquadrias de alumínio",
    excerpt:
      "Limpeza correta e atenção aos trilhos e vedações ajudam a manter o funcionamento e a aparência das esquadrias.",
    category: "Alumínio",
    image: images.facadeWindows.src,
    imageAlt: images.facadeWindows.alt,
    publishedAt: "2026-11-10",
    readingMinutes: 3,
    published: true,
    body: `O alumínio é um material durável, mas alguns cuidados simples preservam o acabamento e o bom funcionamento das esquadrias, especialmente em cidades litorâneas.

## Limpeza

- Use pano macio, água e detergente neutro.
- Evite palha de aço, produtos abrasivos, solventes e ácidos.
- Em regiões próximas ao mar, a limpeza periódica ajuda a remover resíduos de maresia.

## Trilhos e roldanas

- Mantenha os trilhos livres de poeira e areia.
- Verifique se os drenos estão desobstruídos para evitar acúmulo de água.

## Vedações

- Observe borrachas e escovas de vedação; quando ressecadas ou soltas, devem ser substituídas.

Se precisar de componentes de reposição, consulte a equipe comercial informando a linha da esquadria.`,
  },
];
