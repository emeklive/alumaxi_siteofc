# Publicação: GitHub + Vercel

Passo a passo para colocar o site da Alumaxi no ar. Tempo estimado: 20 a 30 minutos.

> O repositório já vem com o primeiro commit feito. Nenhuma senha ou chave está no código.

---

## 1. Subir para o GitHub

> **Importante (erro "Couldn't find any `pages` or `app` directory"):** na Vercel, o `package.json`
> precisa estar na **raiz** do repositório, e não dentro de uma subpasta. Este zip já vem assim:
> ao descompactar, você vê direto `package.json`, `src/`, `public/` etc.
> Se em **Vercel → Settings → Build and Deployment → Root Directory** estiver preenchido
> (por exemplo `alumaxi`), **apague o campo** e salve.

### Opção A — pelo terminal (recomendado)

Descompacte o zip numa pasta (ex.: `alumaxi-site`), abra o terminal **dentro dela** e rode:

```bash
git remote add origin https://github.com/emeklive/alumaxi_site.git
git push -u origin main --force
```

O `--force` substitui o conteúdo antigo do repositório (que estava dentro da subpasta `alumaxi/`).
Se o `git remote add` disser que `origin` já existe, use `git remote set-url origin https://github.com/emeklive/alumaxi_site.git`.

### Opção B — pelo GitHub Desktop
*File → Add local repository →* escolha a pasta descompactada → **Publish repository**
(ou, se o repositório já existir, *Repository → Repository settings → Remote* e cole a URL; depois **Push origin** com *force push*).

> **Não use o botão "Upload files" do site do GitHub.** Ele aceita no máximo 100 arquivos por vez
> (o projeto tem mais de 200) e não envia pastas ocultas. Foi isso que deixou arquivos faltando nos
> deploys anteriores.

---

## 2. Preparar o Supabase (banco de dados e anexos)

Na Vercel o disco é somente leitura. Sem o Supabase, orçamentos, mensagens e currículos **somem** depois de alguns minutos.

1. Crie uma conta e um projeto em <https://supabase.com> (plano gratuito; região **São Paulo**).
2. Abra **SQL Editor → New query**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Project Settings → API**, copie:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Deploy na Vercel

1. Em <https://vercel.com>, entre com a conta do GitHub → **Add New… → Project** → importe `alumaxi-site`.
2. **Framework Preset:** Next.js (detectado sozinho). Build, Output e Install: deixe o padrão.
3. Abra **Environment Variables** e cadastre (os valores em branco podem ficar para depois):

| Variável | Obrigatória? | Valor |
|---|---|---|
| `SUPABASE_URL` | **Sim** | do passo 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | **Sim** | do passo 2 |
| `SUPABASE_STORAGE_BUCKET` | Sim | `uploads` |
| `ADMIN_PASSWORD` | Para usar o painel | senha forte |
| `ADMIN_SESSION_SECRET` | Para usar o painel | 32+ caracteres aleatórios |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Não | `5585998090245` (padrão) |
| `NEXT_PUBLIC_SITE_URL` | Quando houver domínio | `https://www.seudominio.com.br` |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `INSTAGRAM_URL` / `FACEBOOK_URL` | Não | quando confirmados |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GSC_VERIFICATION` | Não | Google Analytics / Search Console |
| `FORMS_WEBHOOK_URL` | Não | para receber os pedidos por e-mail/Make/Zapier |

4. Clique em **Deploy**. Em ~2 minutos o site estará em `https://alumaxi-site.vercel.app` (ou parecido).

> Variáveis `NEXT_PUBLIC_*` entram no código no momento do build. Depois de alterar alguma, faça **Redeploy** (Deployments → ⋯ → Redeploy).

---

## 4. Conferir depois do deploy

- [ ] Abrir o site no computador e no celular; conferir a logo no topo, no rodapé e no ícone da aba.
- [ ] Abrir **Ferragens e acessórios** e **Alumínio** e conferir os produtos.
- [ ] Enviar um orçamento de teste com um anexo → ver em `/admin/orcamentos`.
- [ ] Em `/admin/configuracoes`, o armazenamento deve aparecer como **Supabase**.
- [ ] Clicar no botão do WhatsApp e no "Abrir rota".
- [ ] Apagar os registros de teste no painel.

---

## 5. Domínio próprio (quando a Alumaxi definir)

1. Vercel → Project → **Settings → Domains → Add** → `www.dominio.com.br` (e o domínio sem www).
2. No provedor do domínio (Registro.br, Hostinger, etc.), crie os registros DNS que a Vercel mostrar (normalmente um `A` para `76.76.21.21` e um `CNAME` `www` → `cname.vercel-dns.com`).
3. O certificado SSL (https) é emitido automaticamente.
4. Atualize `NEXT_PUBLIC_SITE_URL` e faça Redeploy.
5. Envie o `https://www.dominio.com.br/sitemap.xml` no Google Search Console.

---

## Atualizações futuras

Cada `git push` na branch `main` publica sozinho uma nova versão. Pushes em outras branches geram um link de prévia, sem afetar o site no ar.
