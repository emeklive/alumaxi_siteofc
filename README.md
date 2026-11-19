# Site institucional — Alumaxi Fortaleza

Site completo em **Next.js 15 + React 19 + TypeScript + Tailwind CSS 4 + Framer Motion + Lucide**, com catálogo, orçamento com vários itens, formulários protegidos, painel administrativo, SEO local e testes automatizados no navegador.

## Começar

```bash
npm install
cp .env.example .env.local      # preencha o que tiver
npm run dev                      # http://localhost:3000
```

Produção: `npm run build && npm start`.

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Hero, categorias, institucional, destaques (carrossel), seção para profissionais, aplicações, galeria com ampliação, avaliações do Google, mapa, CTA |
| `/sobre` | Quem somos, história (**pendente**), atuação, compromisso, valores, estrutura, mapa |
| `/produtos` | Catálogo com busca, filtros por categoria/linha, grade/lista |
| `/produtos/[slug]` | Página do produto: aplicações, características, orçamento, WhatsApp, compartilhamento, Schema Product |
| `/vidros`, `/aluminio`, `/ferragens-e-acessorios` | Páginas especializadas por linha |
| `/catalogo` | Catálogo digital + galeria + área de PDFs oficiais |
| `/orcamento` | Orçamento com múltiplos itens, máscara, validação, upload, resumo e envio pelo WhatsApp. Aceita `?produto=slug` |
| `/trabalhe-conosco` | Currículo em PDF, consentimento LGPD, anti-spam |
| `/contato` | Endereço, telefone, WhatsApp, horários, mapa, rota, formulário |
| `/conteudos`, `/conteudos/[slug]` | Blog com 3 artigos iniciais e Schema Article |
| `/privacidade` | Política de privacidade (LGPD) |
| `/admin` | Painel protegido (ver abaixo) |
| 404, `sitemap.xml`, `robots.txt`, `manifest.webmanifest` | Incluídos |

## Vidro laminado, camada por camada (rolagem + arraste para girar)

Seção interativa em `/vidros` e em `/produtos/vidro-laminado`, criada com o método do skill **scroll-craft** (ato fixado, linha do tempo pela rolagem, camadas com profundidade, composição própria para celular, verificação quadro a quadro).

- Ao rolar, o vidro laminado em 3D se separa em camadas: **lâmina externa → película intermediária → lâmina interna → ferragens**. Cada camada destacada (contorno laranja) apresenta um serviço; no fim o vidro se fecha e mostra o botão de orçamento.
- **Arraste para girar o vidro** com mouse ou dedo (no celular, o arraste horizontal gira e o vertical continua rolando a página). Setas do teclado também giram.
- Atalhos 01–04 levam direto a cada camada; barra de progresso acompanha a rolagem.
- Movimento reduzido: versão estática com as camadas e os 4 serviços.
- Textos editáveis em `src/data/laminated.ts` (**confirme os serviços com a empresa**).
- Teste próprio: `python3 tests/laminated_frames.py` (8 posições de rolagem × 6 resoluções + arraste + atalhos).

Além disso, todo o site reage à rolagem: imagens de topo das páginas com parallax e zoom, formas geométricas da marca deslizando em velocidades diferentes, imagens das seções com zoom ao entrar, animações de entrada, barra de progresso e cabeçalho que encolhe (`src/components/ui/ScrollFx.tsx`).

## Onde editar o conteúdo

| Arquivo | O quê |
|---|---|
| `src/config/site.ts` | Dados da empresa, endereço, telefone, horários, links do Maps, logotipo, menu |
| `src/data/products.ts` | Catálogo inicial |
| `src/data/categories.ts` | Categorias e linhas |
| `src/data/images.ts` | Todas as fotos do site em um só lugar |
| `src/data/about.ts` | Textos institucionais (história pendente) |
| `src/data/articles.ts` | Artigos iniciais |
| `src/data/reviews.ts` | Trechos das avaliações públicas do Google |
| `src/data/catalogs.ts` | Catálogos PDF para download (arquivos em `public/catalogs`) |
| `src/app/globals.css` | Paleta (#F86820, #006868, #FFFFFF), tipografia Montserrat, componentes |

## Dados verificados (Google Maps, consulta em 10/11/2026)

- **Endereço:** Av. Dep. Paulino Rocha, 1303 - Cajazeiras, Fortaleza - CE, 60864-311
- **Telefone/WhatsApp:** (85) 99809-0245
- **Horário:** seg. a qui. 07:30–17:30 · sex. 07:00–16:00 · sáb. e dom. fechado
- **Avaliação:** 4,2 (5 avaliações)
- **Razão social / CNPJ da unidade (cadastro público):** Alumaxi Comércio de Alumínio, Ferragens, Acessórios e Vidros Ltda — 44.108.849/0003-10
- **Outra unidade identificada:** Juazeiro do Norte (Cariri), CNPJ 44.108.849/0002-30. Contatos **não** misturados com os de Fortaleza.

## ⚠️ Pendências que dependem da empresa

1. **Logotipo oficial.** Coloque o arquivo em `public/brand/` e defina `logo` em `src/config/site.ts`. Até lá, o site mostra o nome “ALUMAXI” em texto (não é uma recriação do logo).
2. **Imagem de referência “Boa Semana com Alumaxi.png”.** Não foi enviada. A paleta e a tipografia seguem o briefing; ajuste fino após receber a arte.
3. **E-mail, Instagram e Facebook oficiais.** Não foi possível confirmar perfis oficiais (os encontrados com o nome “Alumaxi” são de empresas do México e da Espanha). Preencha nas variáveis `NEXT_PUBLIC_*`; os ícones aparecem sozinhos quando preenchidos.
4. **Catálogo real.** Os 14 itens publicados são linhas compatíveis com o ramo registrado da empresa, todos marcados como `validated: false`, **sem especificações técnicas** (o site mostra “sob consulta”). Valide, edite ou oculte pelo painel.
5. **Fotos próprias.** As fotos atuais são ilustrativas (Unsplash, licença de uso comercial gratuita). Substitua por fotos da loja e dos produtos em `src/data/images.ts` / painel.
6. **História da empresa**, datas e diferenciais: `src/data/about.ts`.
7. **Catálogos PDF oficiais:** `public/catalogs` + `src/data/catalogs.ts`.
8. **Domínio oficial:** `NEXT_PUBLIC_SITE_URL` (usado em SEO, sitemap e Open Graph).
9. **Revisão jurídica** da Política de privacidade.

## Formulários e segurança

- Validação no navegador **e** no servidor (Zod), máscara de telefone, honeypot + tempo mínimo de preenchimento, limite de envios por IP, verificação de tipo e tamanho de arquivo (assinatura `%PDF` no currículo).
- Orçamentos, contatos e currículos são gravados e podem ser **encaminhados ao canal comercial** por `FORMS_WEBHOOK_URL` (Make, Zapier, n8n, e-mail…). O cliente também recebe um botão para enviar o resumo pelo WhatsApp.
- Nenhum preço é exibido automaticamente.
- Cabeçalhos de segurança, cookies de sessão `httpOnly`/`sameSite=strict`, nada sensível em variáveis `NEXT_PUBLIC_`.
- Google Analytics carrega **apenas após aceite** no banner de cookies (LGPD).

## Painel administrativo (`/admin`)

Desativado até definir `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` (32+ caracteres). Inclui: visão geral, orçamentos (status, anexos), mensagens, candidaturas (download e exclusão LGPD), cadastro/edição/exclusão de produtos, artigos e quadro de configurações/contatos.

### Armazenamento
- **Desenvolvimento / servidor próprio:** grava em `./.data`.
- **Vercel (recomendado):** o disco é somente leitura. Crie um projeto no Supabase, rode `supabase/schema.sql` e defina `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (somente no servidor).

## SEO

Metadados por página, URLs amigáveis, canonical, Open Graph/Twitter, `sitemap.xml`, `robots.txt`, Schema.org (`Store`/`HomeAndConstructionBusiness` com endereço, geo e horários, `BreadcrumbList`, `Product`, `Article`), alt text em todas as imagens e foco em SEO local (Fortaleza/Cajazeiras). Search Console por `NEXT_PUBLIC_GSC_VERIFICATION`.

## Testes

```bash
npm run build && npm start          # em outro terminal:
pip install playwright && npm run test:e2e
```

`tests/e2e_check.py` usa Playwright no Chrome. Ele navega como um cliente, com interações reais de navegador (não é controle físico do mouse): 15 páginas em 1920×1080, 1440×900, 1366×768, 768×1024, 390×844 e 360×800, rolagem horizontal, elementos cortados, erros de JavaScript, menus (hover e mobile), carrossel, galeria, mapa, busca e filtros, compartilhamento, os três formulários com upload, painel admin e links quebrados. Última execução: **928 verificações aprovadas, 0 falhas**. Screenshots (reduzidos) em `docs/screenshots`.

## Publicação

Guia completo em **[DEPLOY.md](DEPLOY.md)**: GitHub, Supabase, variáveis da Vercel, domínio próprio e checklist pós-deploy.

> Nada foi publicado, nenhum DNS foi alterado e nenhum serviço foi contratado.

## Logo e produtos (atualização de 19/11/2026)

- **Logo oficial** em `public/brand/`: `alumaxi-logo.svg` (laranja, para fundo claro), `alumaxi-logo-branco.svg` (fundo escuro), `alumaxi-simbolo.svg` e `alumaxi-simbolo-branco.svg` (só o "A"). Favicon (`src/app/icon.svg`), ícone da Apple (`src/app/apple-icon.png`), ícones do app (`public/icons/`) e imagem de compartilhamento (`public/brand/og-alumaxi.png`) foram gerados a partir dela. O componente `src/components/ui/Logo.tsx` escolhe a versão certa.
- **Catálogo**: 14 produtos confirmados nas artes oficiais, em `src/data/products.ts`. Fotos em `public/products/<slug>.webp` (recorte) e `<slug>-arte.webp` (arte completa).
- **Novo produto**: copie um bloco em `src/data/products.ts`, troque nome, categoria, linha e textos, e coloque as fotos em `public/products/` com o mesmo slug. As linhas de cada categoria ficam em `src/data/categories.ts`.
