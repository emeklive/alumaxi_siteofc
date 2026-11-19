/**
 * INFORMAÇÕES DA EMPRESA — fonte única de verdade.
 *
 * Dados marcados como `verified` foram conferidos no perfil público do Google Maps
 * (consulta em 10/11/2026) e no cadastro público do CNPJ.
 * Campos `null` estão PENDENTES e devem ser preenchidos pela Alumaxi
 * (via variáveis de ambiente ou pelo painel administrativo).
 */

// Atenção: variáveis NEXT_PUBLIC_ precisam ser lidas de forma literal (process.env.NOME)
// para o Next.js incluí-las no código do navegador. Não use process.env[chave].
const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export type BusinessHours = { day: string; schemaDay: string; open: string | null; close: string | null };

export const siteConfig = {
  name: "Alumaxi",
  legalName: "Alumaxi Comércio de Alumínio, Ferragens, Acessórios e Vidros Ltda",
  slogan: "Qualidade e sofisticação em alumínio, vidro e espelhos.",
  description:
    "Alumaxi Fortaleza: vidros, alumínio, ferragens e acessórios para vidraceiros, serralheiros, construtoras e profissionais da construção civil. Solicite seu orçamento.",
  url:
    clean(process.env.NEXT_PUBLIC_SITE_URL) ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://www.alumaxi.com.br"),
  locale: "pt_BR",

  /** Logotipo oficial (arquivos em /public/brand: colorido, branco e símbolo). */
  logo: "/brand/alumaxi-logo.svg" as string | null,
  ogImage: "/brand/og-alumaxi.png",

  unit: {
    id: "fortaleza",
    label: "Alumaxi Fortaleza",
    cnpj: "44.108.849/0003-10",
    address: {
      street: "Av. Dep. Paulino Rocha, 1303",
      district: "Cajazeiras",
      city: "Fortaleza",
      state: "CE",
      zip: "60864-311",
      country: "BR",
      full: "Av. Dep. Paulino Rocha, 1303 - Cajazeiras, Fortaleza - CE, 60864-311",
      plusCode: "5FRR+HP Cajazeiras, Fortaleza - CE",
    },
    geo: { lat: -3.8085372, lng: -38.508204 },
    phone: "(85) 99809-0245",
    phoneE164: "+5585998090245",
    hours: [
      { day: "Segunda-feira", schemaDay: "Monday", open: "07:30", close: "17:30" },
      { day: "Terça-feira", schemaDay: "Tuesday", open: "07:30", close: "17:30" },
      { day: "Quarta-feira", schemaDay: "Wednesday", open: "07:30", close: "17:30" },
      { day: "Quinta-feira", schemaDay: "Thursday", open: "07:30", close: "17:30" },
      { day: "Sexta-feira", schemaDay: "Friday", open: "07:00", close: "16:00" },
      { day: "Sábado", schemaDay: "Saturday", open: null, close: null },
      { day: "Domingo", schemaDay: "Sunday", open: null, close: null },
    ] as BusinessHours[],
    hoursNote: "Horários podem variar em feriados.",
    googleMapsUrl:
      "https://www.google.com/maps/place/Alumaxi/@-3.8085372,-38.508204,17z/data=!4m6!3m5!1s0x7c74f7937cd5f33:0xeec24a673fef1554!8m2!3d-3.8085372!4d-38.508204!16s%2Fg%2F11zchjx1_x",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Alumaxi%2C%20Av.%20Dep.%20Paulino%20Rocha%2C%201303%20-%20Cajazeiras%2C%20Fortaleza%20-%20CE",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Alumaxi,+Av.+Dep.+Paulino+Rocha,+1303+-+Cajazeiras,+Fortaleza+-+CE&z=16&output=embed",
    googleRating: { value: 4.2, count: 5, checkedAt: "2026-11-10" },
    verified: true,
  },

  /** Outra unidade identificada em cadastro público — NÃO misturar contatos. */
  otherUnits: [
    {
      id: "cariri",
      label: "Alumaxi Cariri",
      city: "Juazeiro do Norte - CE",
      cnpj: "44.108.849/0002-30",
      note: "Unidade independente da loja de Fortaleza. Telefone e horários: PENDENTE (confirmar com a empresa).",
    },
  ],

  contact: {
    whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ?? "5585998090245",
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL), // PENDENTE
  },

  social: {
    instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL), // PENDENTE — não foi localizado perfil oficial verificável
    facebook: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL), // PENDENTE
  },

  analytics: {
    gaId: clean(process.env.NEXT_PUBLIC_GA_ID),
    gscVerification: clean(process.env.NEXT_PUBLIC_GSC_VERIFICATION),
  },

  staticPreview: process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1",
} as const;

export const mainNav = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  {
    label: "Produtos",
    href: "/produtos",
    children: [
      { label: "Vidros", href: "/vidros", description: "Vidro temperado e outros tipos sob consulta" },
      { label: "Alumínio", href: "/aluminio", description: "Lambris, perfis de reposição e kits" },
      { label: "Ferragens e acessórios", href: "/ferragens-e-acessorios", description: "Molas, puxadores, roldanas, ventosas e lixas" },
      { label: "Catálogo digital", href: "/catalogo", description: "Busque e filtre todos os itens" },
    ],
  },
  { label: "Conteúdos", href: "/conteudos" },
  { label: "Trabalhe conosco", href: "/trabalhe-conosco" },
  { label: "Contato", href: "/contato" },
] as const;
