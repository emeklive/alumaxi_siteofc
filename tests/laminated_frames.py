"""Captura a seção 'Vidro laminado, camada por camada' em várias posições de rolagem e testa o arraste."""
import sys, os
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
OUT = sys.argv[2] if len(sys.argv) > 2 else "test-results/laminado"
os.makedirs(OUT, exist_ok=True)
fails = []
def ok(n, c, d=""):
    print(("PASS " if c else "FAIL ") + n, d)
    if not c: fails.append(n)
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    for (w, h) in [(1920, 1080), (1440, 900), (1366, 768), (768, 1024), (390, 844), (360, 800)]:
        mobile = w < 768
        ctx = b.new_context(viewport={"width": w, "height": h}, is_mobile=mobile, has_touch=mobile)
        ctx.add_init_script("localStorage.setItem('alumaxi-cookie-consent','rejected')")
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(BASE + "/vidros", wait_until="networkidle")
        sec = pg.get_by_test_id("laminated-scroll")
        top = sec.evaluate("e => e.getBoundingClientRect().top + scrollY")
        travel = sec.evaluate("e => e.offsetHeight - innerHeight")
        seen = []
        for i, f in enumerate([0.0, 0.12, 0.27, 0.42, 0.57, 0.72, 0.86, 1.0]):
            pg.evaluate(f"window.scrollTo(0, {top + travel * f})")
            pg.wait_for_timeout(900)
            # nenhum texto visível cortado e o vidro dentro da tela
            st = pg.get_by_test_id("lg-stage").bounding_box()
            ok(f"[{w}x{h}] vidro dentro da tela p={f}", st["x"] >= 0 and st["x"] + st["width"] <= w and st["y"] >= 0 and st["y"] + st["height"] <= h)
            vis = pg.evaluate("""() => [...document.querySelectorAll('.lg-card')].map(c => +getComputedStyle(c).opacity)""")
            seen.append(max(range(len(vis)), key=lambda k: vis[k]))
            ok(f"[{w}x{h}] um texto em destaque p={f}", max(vis) > 0.95, str([round(v, 2) for v in vis]))
            over = pg.evaluate("""() => [...document.querySelectorAll('.lg-card')].filter(c => +getComputedStyle(c).opacity > .5).some(c => { const r = c.getBoundingClientRect(); return r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1 })""")
            ok(f"[{w}x{h}] texto não cortado p={f}", not over)
            if w in (1440, 390, 768):
                pg.screenshot(path=f"{OUT}/{w}_{i}_p{int(f*100)}.png")
        ok(f"[{w}x{h}] sequência intro→4 camadas→fechamento", seen[0] == 0 and seen[-1] == 5 and {1, 2, 3, 4} <= set(seen), str(seen))
        ok(f"[{w}x{h}] sem rolagem horizontal", pg.evaluate("document.documentElement.scrollWidth - innerWidth") <= 1)
        # arraste para girar
        pg.evaluate(f"window.scrollTo(0, {top + travel * 0.42})"); pg.wait_for_timeout(800)
        before = pg.evaluate("getComputedStyle(document.querySelector('.lg-scene')).transform")
        st = pg.get_by_test_id("lg-stage").bounding_box()
        cx, cy = st["x"] + st["width"] / 2, st["y"] + st["height"] / 2
        if mobile:
            pg.get_by_test_id("lg-stage").dispatch_event("pointerdown", {"clientX": cx, "clientY": cy, "pointerId": 1, "pointerType": "touch"})
            for k in range(1, 8):
                pg.get_by_test_id("lg-stage").dispatch_event("pointermove", {"clientX": cx + k * 15, "clientY": cy, "pointerId": 1, "pointerType": "touch"})
            pg.get_by_test_id("lg-stage").dispatch_event("pointerup", {"clientX": cx + 105, "clientY": cy, "pointerId": 1, "pointerType": "touch"})
        else:
            pg.mouse.move(cx, cy); pg.mouse.down(); pg.mouse.move(cx + 160, cy - 20, steps=12); pg.mouse.up()
        pg.wait_for_timeout(700)
        after = pg.evaluate("getComputedStyle(document.querySelector('.lg-scene')).transform")
        ok(f"[{w}x{h}] arrastar gira o vidro", before != after)
        ok(f"[{w}x{h}] dica some após arrastar", float(pg.get_by_test_id("lg-hint").evaluate("e => getComputedStyle(e).opacity")) < 0.2)
        if w in (1440, 390):
            pg.screenshot(path=f"{OUT}/{w}_arrastado.png")
        # botão de etapa leva à camada
        pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(300)
        pg.evaluate(f"window.scrollTo(0, {top})"); pg.wait_for_timeout(600)
        pg.get_by_role("navigation", name="Camadas do vidro laminado").get_by_role("button").nth(2).click()
        pg.wait_for_timeout(1800)
        ok(f"[{w}x{h}] atalho de etapa mostra a camada 3", float(pg.get_by_test_id("lg-step-2").evaluate("e => getComputedStyle(e).opacity")) > 0.9)
        ok(f"[{w}x{h}] sem erros JS", not errs, str(errs[:2]))
        ctx.close()
    # movimento reduzido: versão estática
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce"); pg = ctx.new_page()
    pg.goto(BASE + "/vidros", wait_until="networkidle")
    ok("movimento reduzido: versão estática com 4 serviços", pg.get_by_test_id("laminated-static").count() == 1 and pg.get_by_test_id("laminated-static").locator("li").count() == 4)
    pg.goto(BASE + "/produtos/vidro-laminado", wait_until="networkidle")
    ctx.close()
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); pg = ctx.new_page()
    pg.goto(BASE + "/produtos/vidro-laminado", wait_until="networkidle")
    ok("seção também na página do vidro laminado", pg.get_by_test_id("laminated-scroll").count() == 1)
    b.close()
print(f"\nFALHAS: {len(fails)}", fails)
