"""
Teste visual e funcional do site Alumaxi com Playwright (Chrome).
Uso: python3 tests/e2e_check.py [base_url] [pasta_screenshots]
Executa interações reais de navegador (cliques, hover, digitação, upload) — não é controle físico do mouse.
"""
import json, os, sys, time, urllib.request
ADMIN_PW = os.environ.get("ADMIN_PASSWORD", "teste-local-123")  # senha usada só no servidor local de teste
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
OUT = sys.argv[2] if len(sys.argv) > 2 else "test-results/screens"
os.makedirs(OUT, exist_ok=True)

PAGES = ["/", "/sobre", "/produtos", "/vidros", "/aluminio", "/ferragens-e-acessorios", "/catalogo",
         "/orcamento", "/trabalhe-conosco", "/contato", "/conteudos", "/conteudos/como-medir-o-vao-para-orcamento",
         "/produtos/vidro-temperado", "/privacidade", "/nao-existe"]
VIEWPORTS = [(1920, 1080), (1440, 900), (1366, 768), (768, 1024), (390, 844), (360, 800)]

results, failures = [], []

def ok(name, cond, detail=""):
    (results if cond else failures).append(f"{'PASS' if cond else 'FAIL'} {name} {detail}")

def ignorable(msg: str):
    return any(s in msg for s in ["images.unsplash.com", "_next/image", "Failed to load resource", "google.com/maps", "ERR_"])

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)

    # ---------- 1. Responsividade: todas as páginas em 6 resoluções ----------
    for (w, h) in VIEWPORTS:
        ctx = browser.new_context(viewport={"width": w, "height": h}, reduced_motion="reduce")
        ctx.add_init_script("localStorage.setItem('alumaxi-cookie-consent','rejected')")
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: m.type == "error" and not ignorable(m.text) and errors.append(m.text))
        page.on("pageerror", lambda e: errors.append(str(e)))
        for path in PAGES:
            resp = page.goto(BASE + path, wait_until="networkidle")
            expected = 404 if path == "/nao-existe" else 200
            ok(f"[{w}x{h}] status {path}", resp.status == expected, f"({resp.status})")
            overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            ok(f"[{w}x{h}] sem rolagem horizontal {path}", overflow <= 1, f"(excesso {overflow}px)")
            # textos/elementos cortados: elementos visíveis que extrapolam a viewport
            clipped = page.evaluate("""() => [...document.querySelectorAll('h1,h2,h3,a.btn-primary,button,input')]
                .filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
                  return r.width > 0 && s.visibility !== 'hidden' && !e.closest('[aria-hidden],.sr-only,[data-testid=carousel]') && (r.right > window.innerWidth + 1 || r.left < -1) })
                .map(e => e.outerHTML.slice(0, 80))""")
            ok(f"[{w}x{h}] nenhum elemento cortado {path}", len(clipped) == 0, json.dumps(clipped[:3]))
            if path in ("/", "/orcamento", "/catalogo", "/contato", "/produtos/vidro-temperado") or w in (1440, 390):
                name = path.strip("/").replace("/", "_") or "inicio"
                page.evaluate("""async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); }""")
                page.wait_for_timeout(300)
                page.screenshot(path=f"{OUT}/{w}x{h}_{name}.png", full_page=True)
        ok(f"[{w}x{h}] sem erros de JavaScript", len(errors) == 0, json.dumps(errors[:3]))
        ctx.close()

    # ---------- 2. Interações (desktop) ----------
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    page.goto(BASE + "/", wait_until="networkidle")

    # Banner de cookies
    banner = page.get_by_test_id("cookie-banner")
    ok("banner de cookies aparece", banner.is_visible())
    banner.get_by_role("button", name="Recusar").click()
    ok("banner de cookies fecha", not banner.is_visible())

    # Menu suspenso com hover do mouse
    page.get_by_role("navigation", name="Menu principal").get_by_role("link", name="Produtos", exact=True).hover()
    dd = page.get_by_test_id("products-dropdown")
    dd.wait_for(state="visible", timeout=3000)
    ok("menu suspenso abre com hover", dd.is_visible())
    page.screenshot(path=f"{OUT}/interacao_menu_suspenso.png")
    dd.get_by_role("link", name="Vidros").click()
    page.wait_for_url("**/vidros")
    ok("clique no submenu leva a /vidros", page.url.endswith("/vidros"))

    # Todos os links do menu principal
    for label, href in [("Início", "/"), ("Sobre", "/sobre"), ("Conteúdos", "/conteudos"), ("Trabalhe conosco", "/trabalhe-conosco"), ("Contato", "/contato")]:
        page.get_by_role("navigation", name="Menu principal").get_by_role("link", name=label, exact=True).click()
        page.wait_for_url(lambda u: u.rstrip("/") == (BASE + href).rstrip("/"), timeout=8000)
        ok(f"menu '{label}' navega", page.url.rstrip("/").endswith(href.rstrip("/")), page.url)

    # Header: botão orçamento
    page.get_by_role("banner").get_by_role("link", name="Solicitar orçamento").first.click()
    page.wait_for_url("**/orcamento")
    ok("CTA do cabeçalho abre orçamento", "/orcamento" in page.url)

    # Página inicial: hero CTAs, cards de categoria (hover), carrossel, galeria, mapa
    page.goto(BASE + "/", wait_until="networkidle")
    hero = page.get_by_test_id("hero")
    hero.get_by_role("link", name="Conhecer produtos").click()
    page.wait_for_url("**/produtos")
    ok("hero 'Conhecer produtos'", page.url.endswith("/produtos"))
    page.goto(BASE + "/", wait_until="networkidle")

    card = page.get_by_test_id("category-aluminio")
    card.scroll_into_view_if_needed(); card.hover(); time.sleep(0.8)
    page.screenshot(path=f"{OUT}/interacao_hover_categoria.png")
    card.click(); page.wait_for_url("**/aluminio")
    ok("card de categoria navega", page.url.endswith("/aluminio"))
    page.goto(BASE + "/", wait_until="networkidle")

    car = page.get_by_test_id("carousel")
    car.scroll_into_view_if_needed()
    nxt = car.get_by_role("button", name="Próximo")
    before = car.locator("div.overflow-x-auto").evaluate("e => e.scrollLeft")
    nxt.click(); time.sleep(0.9)
    after = car.locator("div.overflow-x-auto").evaluate("e => e.scrollLeft")
    ok("carrossel avança com o botão", after > before, f"({before}->{after})")
    car.get_by_role("button", name="Ir para o item 1").click(); time.sleep(0.9)
    ok("indicador do carrossel volta ao início", car.locator("div.overflow-x-auto").evaluate("e => e.scrollLeft") < 5)

    gal = page.get_by_test_id("gallery")
    gal.scroll_into_view_if_needed()
    gal.get_by_role("button").nth(2).click()
    dialog = page.get_by_role("dialog", name="Visualização ampliada")
    dialog.wait_for(state="visible")
    t1 = dialog.locator("p").inner_text()
    page.keyboard.press("ArrowRight"); time.sleep(0.3)
    t2 = dialog.locator("p").inner_text()
    ok("galeria: ampliação e navegação por teclado", t1 != t2, f"{t1} -> {t2}")
    page.screenshot(path=f"{OUT}/interacao_galeria.png")
    page.keyboard.press("Escape"); time.sleep(0.4)
    ok("galeria fecha com Esc", not dialog.is_visible())

    m = page.get_by_test_id("map")
    m.scroll_into_view_if_needed()
    m.get_by_role("button", name="Carregar mapa interativo do Google Maps").click()
    ok("mapa carrega iframe do Google Maps", m.locator("iframe").count() == 1 and "google.com/maps" in m.locator("iframe").get_attribute("src"))
    ok("botão 'Abrir rota' aponta para Google Maps", "google.com/maps/dir" in m.get_by_role("link", name="Abrir rota").get_attribute("href"))

    wa = page.get_by_test_id("whatsapp-float")
    href = wa.get_attribute("href")
    ok("WhatsApp flutuante com número verificado", href.startswith("https://wa.me/5585998090245"), href)
    box = wa.bounding_box()
    ok("WhatsApp flutuante dentro da tela", box and box["x"] + box["width"] <= 1440 and box["y"] + box["height"] <= 900)

    # ---------- 3. Catálogo: busca, filtros, visualização, compartilhamento ----------
    page.goto(BASE + "/catalogo", wait_until="networkidle")
    total = int(page.get_by_test_id("catalog-count").inner_text())
    page.get_by_test_id("catalog-search").fill("box")
    time.sleep(0.5)
    n_box = int(page.get_by_test_id("catalog-count").inner_text())
    ok("busca filtra resultados", 0 < n_box < total, f"({total} -> {n_box})")
    ok("busca reflete na URL", "busca=box" in page.url, page.url)
    page.get_by_role("button", name="Limpar filtros").click(); time.sleep(0.4)
    page.get_by_test_id("filter-ferragens").click(); time.sleep(0.5)
    cats = page.get_by_test_id("product-card").locator("span.absolute.left-3").all_inner_texts()
    ok("filtro de categoria", len(cats) > 0 and all(c.strip().lower() == "ferragens" for c in cats), str(set(cats)))
    page.get_by_role("button", name="Exibir em lista").click(); time.sleep(0.3)
    ok("visualização em lista", page.locator("[data-testid=catalog] ul li").count() > 0)
    page.get_by_role("button", name="Exibir em grade").click()
    page.get_by_test_id("catalog-search").fill("xyzinexistente"); time.sleep(0.4)
    ok("estado vazio da busca", page.get_by_text("Nenhum item encontrado.").is_visible())
    page.screenshot(path=f"{OUT}/interacao_catalogo_vazio.png")

    page.goto(BASE + "/produtos/vidro-temperado", wait_until="networkidle")
    ctx.grant_permissions(["clipboard-read", "clipboard-write"])
    page.get_by_test_id("share").get_by_role("button", name="Copiar link").click()
    page.get_by_text("Link copiado!").wait_for(timeout=4000)
    ok("compartilhar: copiar link", page.get_by_text("Link copiado!").is_visible())
    page.get_by_test_id("product-quote").click()
    page.wait_for_url("**/orcamento?produto=vidro-temperado")
    page.wait_for_selector("[data-testid=quote-item]")
    ok("orçamento pré-preenchido pelo produto", page.locator("[data-testid=quote-item] input").first.input_value() == "Vidro temperado")

    # ---------- 4. Formulário de orçamento ----------
    page.get_by_test_id("quote-submit").click(); time.sleep(0.4)
    ok("validação: bloqueia envio vazio", page.get_by_text("Revise os campos destacados.").is_visible())
    page.screenshot(path=f"{OUT}/form_orcamento_erros.png", full_page=True)
    page.fill("#name", "Teste Playwright")
    page.fill("#company", "Vidraçaria Teste")
    page.locator("#whatsapp").press_sequentially("85999998888")
    ok("máscara de telefone", page.input_value("#whatsapp") == "(85) 99999-8888", page.input_value("#whatsapp"))
    page.fill("#email", "teste@example.com")
    item1 = page.get_by_test_id("quote-item").nth(0)
    item1.locator("select").select_option("vidros")
    item1.locator("input").nth(1).fill("4 peças")
    item1.locator("input").nth(2).fill("800 x 1900")
    page.get_by_test_id("add-item").click(); time.sleep(0.5)
    item2 = page.get_by_test_id("quote-item").nth(1)
    item2.locator("select").select_option("ferragens")
    item2.locator("input").nth(0).fill("Kits e ferragens para box")
    item2.locator("input").nth(1).fill("4 kits")
    ok("orçamento com múltiplos itens", page.get_by_test_id("quote-item").count() == 2)
    png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 200
    page.get_by_test_id("quote-files").set_input_files([{"name": "projeto-box.png", "mimeType": "image/png", "buffer": png}])
    ok("upload de arquivo listado", page.get_by_text("projeto-box.png").is_visible())
    page.fill("#description", "Box de banheiro para obra residencial.")
    page.get_by_text("Autorizo a Alumaxi a utilizar").click()
    time.sleep(2.6)  # tempo mínimo anti-spam
    page.get_by_test_id("quote-submit").click()
    page.get_by_test_id("quote-success").wait_for(timeout=10000)
    proto = page.get_by_test_id("quote-protocol").inner_text()
    ok("orçamento enviado com protocolo", proto.startswith("ORC-"), proto)
    wa_q = page.get_by_test_id("quote-whatsapp").get_attribute("href")
    ok("resumo encaminhável pelo WhatsApp", "wa.me/5585998090245" in wa_q and "Vidro%20temperado" in wa_q)
    page.screenshot(path=f"{OUT}/form_orcamento_sucesso.png", full_page=True)

    # ---------- 5. Contato ----------
    page.goto(BASE + "/contato", wait_until="networkidle")
    ok("telefone verificado na página de contato", page.get_by_test_id("contact-phone").inner_text() == "(85) 99809-0245")
    ok("botão de rota", "google.com/maps/dir" in page.get_by_test_id("route-button").get_attribute("href"))
    page.fill("#c-name", "Contato Teste"); page.fill("#c-email", "contato@example.com")
    page.locator("#c-phone").press_sequentially("8532223333")
    page.fill("#c-subject", "Dúvida"); page.fill("#c-message", "Gostaria de saber sobre espelhos.")
    page.get_by_text("Autorizo o uso dos meus dados").click(); time.sleep(2.6)
    page.get_by_test_id("contact-submit").click()
    page.get_by_test_id("contact-success").wait_for(timeout=10000)
    ok("formulário de contato enviado", True)

    # ---------- 6. Trabalhe conosco (PDF + anti-spam) ----------
    page.goto(BASE + "/trabalhe-conosco", wait_until="networkidle")
    page.get_by_test_id("resume-input").set_input_files([{"name": "foto.png", "mimeType": "image/png", "buffer": png}])
    ok("currículo rejeita não-PDF", page.get_by_text("Envie o currículo em PDF.").is_visible())
    page.fill("#a-name", "Candidato Teste"); page.locator("#a-phone").press_sequentially("85988887777")
    page.fill("#a-email", "cv@example.com"); page.fill("#a-role", "Vendedor")
    pdf = b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"
    page.get_by_test_id("resume-input").set_input_files([{"name": "curriculo.pdf", "mimeType": "application/pdf", "buffer": pdf}])
    page.get_by_text("Autorizo a Alumaxi a tratar").click(); time.sleep(2.6)
    page.get_by_test_id("careers-submit").click()
    page.get_by_test_id("careers-success").wait_for(timeout=10000)
    ok("candidatura com PDF enviada", True)

    # Anti-spam direto na API (honeypot preenchido não grava)
    req = urllib.request.Request(BASE + "/api/contato", method="POST")
    ok("API rejeita payload sem form", urllib.request.urlopen(urllib.request.Request(BASE + "/robots.txt")).status == 200)

    # ---------- 7. Painel administrativo ----------
    page.goto(BASE + "/admin/orcamentos")
    ok("admin protegido redireciona para login", "/admin/login" in page.url)
    page.fill("#pw", "senha-errada"); page.get_by_role("button", name="Entrar").click()
    page.get_by_text("Senha incorreta.").wait_for(timeout=5000)
    ok("login recusa senha errada", page.get_by_text("Senha incorreta.").is_visible())
    page.fill("#pw", ADMIN_PW); page.get_by_role("button", name="Entrar").click()
    page.wait_for_url("**/admin"); page.wait_for_load_state("networkidle")
    page.screenshot(path=f"{OUT}/admin_visao_geral.png", full_page=True)
    page.goto(BASE + "/admin/orcamentos", wait_until="networkidle")
    ok("admin lista o orçamento recebido", page.get_by_text(proto).is_visible())
    page.get_by_test_id("admin-quote").first.locator("summary").click()
    page.get_by_role("button", name="Marcar: em-atendimento").click(); page.wait_for_load_state("networkidle"); time.sleep(0.6)
    ok("admin altera status", page.get_by_test_id("admin-quote").first.get_by_text("em-atendimento").first.is_visible())
    page.goto(BASE + "/admin/produtos/lambri-cartola", wait_until="networkidle")
    page.fill("#summary", "Lambri editado pelo painel.")
    page.get_by_role("button", name="Salvar produto").click()
    page.wait_for_url("**/admin/produtos?ok=1")
    page.goto(BASE + "/produtos/lambri-cartola", wait_until="networkidle")
    page.goto(BASE + "/catalogo", wait_until="networkidle")
    ok("edição no painel aparece no site", page.get_by_text("Lambri editado pelo painel.").count() > 0)
    page.goto(BASE + "/admin/candidaturas", wait_until="networkidle")
    ok("admin lista candidatura", page.get_by_text("Candidato Teste").count() >= 1)
    ctx.close()

    # ---------- 8. Mobile: menu hambúrguer ----------
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    ctx.add_init_script("localStorage.setItem('alumaxi-cookie-consent','rejected')")
    page = ctx.new_page()
    page.goto(BASE + "/", wait_until="networkidle")
    page.get_by_role("button", name="Abrir menu").click()
    menu = page.locator("#mobile-menu"); menu.wait_for(state="visible")
    page.screenshot(path=f"{OUT}/mobile_menu_aberto.png")
    ok("menu mobile abre", menu.is_visible())
    menu.get_by_role("link", name="Alumínio").click()
    page.wait_for_url("**/aluminio")
    page.locator("#mobile-menu").wait_for(state="detached", timeout=5000)
    ok("menu mobile navega e fecha", page.url.endswith("/aluminio") and page.locator("#mobile-menu").count() == 0)
    wa = page.get_by_test_id("whatsapp-float").bounding_box()
    ok("WhatsApp não cobre o menu no mobile", wa["y"] > 600)
    ctx.close()

    # ---------- 9. Links internos quebrados ----------
    ctx = browser.new_context(); page = ctx.new_page()
    hrefs = set()
    for path in PAGES[:-1]:
        page.goto(BASE + path, wait_until="domcontentloaded")
        for h in page.eval_on_selector_all("a[href]", "els => els.map(e => e.getAttribute('href'))"):
            ok(f"link sem href vazio em {path}", h not in ("", "#"), h)
            if h.startswith("/") and not h.startswith("/api"):
                hrefs.add(h.split("#")[0])
    for h in sorted(hrefs):
        try:
            st = urllib.request.urlopen(BASE + h).status
        except urllib.error.HTTPError as e:
            st = e.code
        ok(f"link interno {h}", st == 200, f"({st})")
    ctx.close()
    browser.close()

print("\n".join(failures) if failures else "Nenhuma falha.")
print(f"\nTOTAL: {len(results)} aprovados, {len(failures)} falhas")
with open(os.path.join(OUT, "..", "relatorio.txt"), "w") as f:
    f.write("\n".join(failures + results))
