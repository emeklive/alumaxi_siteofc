import { PageHero } from "@/components/ui/PageHero";
import { Markdown } from "@/components/ui/Markdown";
import { images } from "@/data/images";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Política de privacidade", description: "Como a Alumaxi trata os dados pessoais coletados no site, conforme a LGPD.", path: "/privacidade" });

export default function PrivacidadePage() {
  const contact = siteConfig.contact.email ? `pelo e-mail ${siteConfig.contact.email} ou ` : "";
  const body = `Esta política explica como a **${siteConfig.legalName}** (CNPJ ${siteConfig.unit.cnpj}) trata os dados pessoais coletados neste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).

## Dados coletados

- Formulário de orçamento: nome, empresa, WhatsApp, e-mail, cidade, itens solicitados e arquivos anexados.
- Formulário de contato: nome, e-mail, telefone (opcional), assunto e mensagem.
- Trabalhe conosco: nome, telefone, e-mail, cargo pretendido, cidade e currículo.
- Dados de navegação: somente com o seu consentimento, por meio de ferramentas de medição de audiência (Google Analytics).

## Finalidades

- Responder solicitações de orçamento e contato e realizar o atendimento comercial.
- Conduzir processos de recrutamento e seleção.
- Melhorar a experiência de navegação no site, quando autorizado.

## Bases legais

O tratamento ocorre mediante **consentimento** do titular e para **procedimentos preliminares relacionados a contrato** solicitados por você.

## Compartilhamento

Os dados não são vendidos. Podem ser processados por fornecedores de tecnologia necessários à operação do site (hospedagem, armazenamento e ferramentas de comunicação), sob obrigações de confidencialidade.

## Retenção

- Orçamentos e contatos: pelo tempo necessário ao atendimento e às obrigações legais.
- Currículos: por até 12 meses, salvo nova autorização.

## Seus direitos

Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação dos dados e revogação do consentimento a qualquer momento, entrando em contato ${contact}pelo telefone ${siteConfig.unit.phone}.

## Cookies

Utilizamos cookies essenciais e, apenas com sua autorização no banner de cookies, cookies de medição de audiência. Você pode alterar sua escolha limpando os dados do navegador.

## Segurança

Adotamos medidas técnicas como conexão criptografada (HTTPS), validação dos dados enviados, proteção contra envios automatizados e acesso restrito às informações recebidas.`;
  return (
    <>
      <PageHero title="Política de privacidade" text="Transparência no tratamento dos seus dados pessoais." image={images.officeGlass.src} imageAlt={images.officeGlass.alt} crumbs={[{ name: "Privacidade", path: "/privacidade" }]} />
      <section className="container-x max-w-3xl py-14"><Markdown source={body} /><p className="mt-10 text-sm text-ink-soft">Documento de referência — recomenda-se revisão pelo jurídico da empresa antes da publicação.</p></section>
    </>
  );
}
