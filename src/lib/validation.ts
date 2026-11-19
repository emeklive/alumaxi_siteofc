import { z } from "zod";

const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

export const quoteItemSchema = z.object({
  category: z.string().min(1, "Selecione a categoria"),
  product: z.string().trim().min(2, "Informe o produto desejado").max(120),
  quantity: z.string().trim().min(1, "Informe a quantidade").max(40),
  measures: z.string().trim().max(120).optional().default(""),
  notes: z.string().trim().max(500).optional(),
});

export const quoteSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo").max(100),
  company: z.string().trim().max(120).optional(),
  whatsapp: z.string().trim().regex(phoneRegex, "WhatsApp inválido. Use (85) 99999-9999"),
  email: z.string().trim().email("E-mail inválido").max(160),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  description: z.string().trim().max(2000).optional(),
  items: z.array(quoteItemSchema).min(1, "Adicione pelo menos um item").max(20),
  consent: z.literal(true, { error: "É necessário autorizar o contato" }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(160),
  phone: z.union([z.literal(""), z.string().trim().regex(phoneRegex, "Telefone inválido")]).optional(),
  subject: z.string().trim().min(3, "Informe o assunto").max(120),
  message: z.string().trim().min(10, "Escreva uma mensagem com pelo menos 10 caracteres").max(3000),
  consent: z.literal(true, { error: "É necessário autorizar o contato" }),
});

export const applicationSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome").max(100),
  phone: z.string().trim().regex(phoneRegex, "Telefone inválido. Use (85) 99999-9999"),
  email: z.string().trim().email("E-mail inválido").max(160),
  role: z.string().trim().min(2, "Informe o cargo pretendido").max(100),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  consent: z.literal(true, { error: "É necessário o consentimento LGPD" }),
});

export const FILE_RULES = {
  quote: {
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    label: "JPG, PNG, WEBP ou PDF — até 5 arquivos de 10 MB",
  },
  resume: { maxFiles: 1, maxSize: 5 * 1024 * 1024, types: ["application/pdf"], label: "PDF até 5 MB" },
} as const;

export type QuoteInput = z.infer<typeof quoteSchema>;

export function flattenErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
