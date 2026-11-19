export type CategoryId = "vidros" | "aluminio" | "ferragens" | "acessorios";

export type Category = {
  id: CategoryId;
  name: string;
  slug: string;
  page: string;
  short: string;
  description: string;
  image: string;
  imageAlt: string;
  subcategories: { id: string; name: string }[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  summary: string;
  description: string;
  applications: string[];
  /** Somente características confirmadas pela empresa. Vazio = "sob consulta". */
  specs: { label: string; value: string }[];
  image: string;
  imageAlt: string;
  gallery?: { src: string; alt: string }[];
  featured?: boolean;
  /** false = linha prevista pelo ramo de atividade, aguardando validação no catálogo oficial */
  validated: boolean;
  active: boolean;
  updatedAt?: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  readingMinutes: number;
  /** Markdown simples: parágrafos, ## títulos, - listas */
  body: string;
  published: boolean;
};

export type QuoteItem = {
  category: string;
  product: string;
  quantity: string;
  measures: string;
  notes?: string;
};

export type StoredFile = { name: string; size: number; type: string; path: string };

export type QuoteRecord = {
  id: string;
  protocol: string;
  createdAt: string;
  status: "novo" | "em-atendimento" | "concluido";
  name: string;
  company?: string;
  whatsapp: string;
  email: string;
  city: string;
  description?: string;
  items: QuoteItem[];
  files: StoredFile[];
};

export type ContactRecord = {
  id: string;
  protocol: string;
  createdAt: string;
  status: "novo" | "respondido";
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export type ApplicationRecord = {
  id: string;
  protocol: string;
  createdAt: string;
  status: "novo" | "em-analise" | "arquivado";
  name: string;
  phone: string;
  email: string;
  role: string;
  city: string;
  resume: StoredFile | null;
};
