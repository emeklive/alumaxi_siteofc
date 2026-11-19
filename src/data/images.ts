/**
 * Banco de imagens do site.
 * As fotos padrão são do Unsplash (licença gratuita para uso comercial — https://unsplash.com/license)
 * e servem como ilustração até a Alumaxi fornecer fotos próprias da loja e dos produtos.
 * Para trocar: coloque o arquivo em /public/images (ou /public/products) e altere o `src`.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export type SiteImage = { src: string; alt: string };

export const images = {
  hero: { src: u("1486406146926-c627a92ad1ab", 2200), alt: "Edifícios com fachadas de vidro vistos de baixo" },
  heroAlt: { src: u("1431576901776-e539bd916ba2", 2000), alt: "Fachada de vidro com caixilhos metálicos iluminada" },
  glassFacade: { src: u("1449157291145-7efd050a4d0e", 1600), alt: "Torres envidraçadas em perspectiva" },
  whiteBuilding: { src: u("1487958449943-2429e8be8625", 1600), alt: "Edifício contemporâneo com vidro e estrutura metálica" },
  modernHouse: { src: u("1600585154340-be6161a56a0c", 1600), alt: "Residência moderna com grandes panos de vidro" },
  houseAluminum: { src: u("1600566753190-17f0baa2a6c3", 1600), alt: "Casa contemporânea com esquadrias e portas de vidro" },
  villaPool: { src: u("1512917774080-9991f1c4c750", 1600), alt: "Residência com fachada envidraçada e piscina" },
  houseDusk: { src: u("1494526585095-c41746248156", 1600), alt: "Casa com janelas de alumínio ao entardecer" },
  housePool: { src: u("1564013799919-ab600027ffc6", 1600), alt: "Residência com portas de vidro voltadas para a piscina" },
  houseFacade: { src: u("1600047509807-ba8f99d2cdde", 1600), alt: "Fachada residencial com esquadrias de alumínio" },
  facadeWindows: { src: u("1545324418-cc1a3fa10c00", 1600), alt: "Prédio residencial com janelas e sacadas de alumínio e vidro" },
  facadeBalconies: { src: u("1460317442991-0ec209397118", 1600), alt: "Fachada com guarda-corpos e janelas de alumínio" },
  glassUnderConstruction: { src: u("1565008447742-97f6f38c985c", 1600), alt: "Edifício envidraçado em construção" },
  corridorGlass: { src: u("1497366216548-37526070297c", 1600), alt: "Corredor corporativo com divisórias de vidro" },
  officeGlass: { src: u("1497366811353-6870744d04b2", 1600), alt: "Escritório amplo com fachada de vidro" },
  glassDoors: { src: u("1600573472550-8090b5e0745e", 1600), alt: "Ambiente com portas de vidro e escada com guarda-corpo" },
  interiorLiving: { src: u("1600607687939-ce8a6c25118c", 1600), alt: "Sala de estar moderna com iluminação natural" },
  interiorMirror: { src: u("1600210492486-724fe5c67fb0", 1600), alt: "Sala com parede decorada e espelhos" },
  archMirror: { src: u("1616047006789-b7af5afb8c20", 1600), alt: "Sala com espelho em arco" },
  livingWindow: { src: u("1618221195710-dd6b41faaea6", 1600), alt: "Sala com janela horizontal em fita" },
  bathroomShower: { src: u("1584622650111-993a426fbf0a", 1600), alt: "Banheiro com box de vidro temperado" },
  bathroomBright: { src: u("1552321554-5fefe8c9ef14", 1600), alt: "Banheiro claro com espelho e janela" },
  bathroomTub: { src: u("1620626011761-996317b8d101", 1600), alt: "Banheiro com banheira e vidro" },
  bathroomDark: { src: u("1600566752355-35792bedcfea", 1600), alt: "Banheiro com box de vidro e acabamento escuro" },
  kitchen: { src: u("1507089947368-19c1da9775ae", 1600), alt: "Cozinha moderna com janela ampla" },
  blueprint: { src: u("1503387762-592deb58ef4e", 1600), alt: "Profissional analisando projeto arquitetônico" },
  plans: { src: u("1581092160562-40aa08e78837", 1600), alt: "Mesa de trabalho com projetos e ferramentas" },
  constructionSite: { src: u("1541888946425-d81bb19240f5", 1600), alt: "Equipe em canteiro de obras" },
  constructionWorkers: { src: u("1504307651254-35680f356dfd", 1600), alt: "Profissionais trabalhando em obra" },
  worker: { src: u("1621905252507-b35492cc74b4", 1600), alt: "Profissional da construção com capacete" },
  tools: { src: u("1530124566582-a618bc2615dc", 1600), alt: "Ferramentas profissionais organizadas" },
  drill: { src: u("1504148455328-c376907d081c", 1600), alt: "Furadeira para instalação" },
  lock: { src: u("1558002038-1055907df827", 1600), alt: "Fechadura instalada em porta" },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
