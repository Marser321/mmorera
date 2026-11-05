import { expect, test, type Page } from "@playwright/test";
import { resolve } from "node:path";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";

// Optional visual-preview clips are not versioned. Exercise playback with a
// real, tracked local MP4; the dedicated failure test still covers missing clips.
async function installPreviewVideoFixture(page: Page) {
  await page.route("**/motion/previews/*.mp4", (route) => route.fulfill({
    path: resolve(process.cwd(), "public/profile/author-film/author-film-desktop.mp4"),
    contentType: "video/mp4",
  }));
}

async function openDesktopUtilities(page: Page, keyboard = false) {
  const button = page.getByRole("button", { name: "Abrir utilidades" });
  await expect(async () => {
    if (await button.getAttribute("aria-expanded") !== "true") {
      if (keyboard) {
        await button.focus();
        await button.press("Enter");
      } else await button.click();
    }
    await expect(button).toHaveAttribute("aria-expanded", "true", { timeout: 1_000 });
  }).toPass({ timeout: 10_000 });
}

test("navega por la cabecera y conserva un único canvas", async ({ page }) => {
  // Two lazy routes may compile on their first visit in a fresh dev worktree.
  test.setTimeout(60_000);
  const pageErrors: Error[] = [];
  const keyWarnings: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  page.on("console", (message) => {
    if (/unique.*key|OuterLayoutRouter/.test(message.text())) keyWarnings.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Orquesto la tecnología de tu negocio");
  const field = page.locator('[data-particle-canvas="global"]');
  await expect(field.locator("canvas")).toHaveCount(1, { timeout: 15_000 });
  await field.locator("canvas").evaluate((canvas) => { canvas.dataset.e2ePersistent = "true"; });
  const chip = page.locator('#hero li a[href="#servicios"]').nth(2);
  await expect(async () => {
    await chip.focus();
    await expect(field).toHaveAttribute("data-particle-confirmed", "service:crm-automation", { timeout: 1_500 });
  }).toPass({ timeout: 15_000 });
  await expect(field).toHaveAttribute("data-particle-target-count", /^[12]$/);
  await expect(page.locator("a button")).toHaveCount(0);
  const servicesButton = page.locator('button[aria-controls="services-menu"]');
  await expect(async () => {
    if (await servicesButton.getAttribute("aria-expanded") !== "true") await servicesButton.click();
    await expect(servicesButton).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass({ timeout: 10000 });
  const systemsLink = page.locator('#services-menu a[href="/sistemas"]');
  await systemsLink.focus();
  await systemsLink.press("Enter");
  await expect(page).toHaveURL(/\/sistemas$/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Que ninguna consulta quede sin seguimiento.");
  await expect(page.locator('canvas[data-e2e-persistent="true"]')).toHaveCount(1);
  await expect(page.locator('[data-service-section="deliverables"] li')).toHaveCount(3);
  await page.goto("/en/sistemas");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("So no enquiry goes without follow-up.");
  await expect(page.locator('[data-service-section="deliverables"] li')).toHaveCount(3);
  expect(pageErrors).toEqual([]);
  expect(keyWarnings).toEqual([]);
});

test("mantiene el menú por servicios con teclado y oculta redes no verificadas", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Capacidades", exact: true })).toHaveAttribute("href", "/capacidades");
  await expect(header.getByRole("link", { name: "Sobre mí · CV", exact: true })).toHaveAttribute("href", "/sobre-mi");
  await expect(header.getByRole("link", { name: "Hablemos", exact: true })).toHaveAttribute("href", "#contacto");
  await expect(page.locator('a[href*="linkedin"], a[href*="github"]')).toHaveCount(0);
  const button = header.locator('button[aria-controls="services-menu"]');
  await expect(async () => {
    if (await button.getAttribute("aria-expanded") !== "true") { await button.focus(); await button.press("Enter"); }
    await expect(button).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass({ timeout: 10000 });
  const links = page.locator("#services-menu a");
  await expect(links).toHaveCount(4);
  await expect(links.first()).toBeFocused();
  await page.keyboard.press("ArrowUp"); await expect(links.last()).toBeFocused();
  await page.keyboard.press("ArrowDown"); await expect(links.first()).toBeFocused();
  await page.keyboard.press("End"); await expect(links.last()).toBeFocused();
  await page.keyboard.press("Home"); await expect(links.first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false"); await expect(button).toBeFocused();
  await expect(page.locator('#services-menu')).toHaveCount(0);
  const cases = header.locator('button[aria-controls="cases-menu"]');
  await expect(cases).toHaveText(/Casos/);
  await expect(async () => {
    if (await cases.getAttribute("aria-expanded") !== "true") { await cases.focus(); await cases.press("Enter"); }
    await expect(cases).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass({ timeout: 10000 });
  const caseLinks = page.locator("#cases-menu a");
  await expect(caseLinks).toHaveCount(2);
  await expect(caseLinks.first()).toHaveAttribute("href", "/casos-de-exito");
  await expect(caseLinks.last()).toHaveAttribute("href", "/casos-de-uso");
  await page.keyboard.press("Escape");
  await expect(cases).toHaveAttribute("aria-expanded", "false");
});

test("ofrece un único menú móvil con rutas, idioma, tema y CTA", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: BASE_URL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("button")).toHaveCount(1);
  const menuButton = header.locator('button[aria-controls="mobile-menu"]');
  await expect(async () => {
    if (await menuButton.getAttribute("aria-expanded") !== "true") await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true", { timeout: 1_000 });
  }).toPass({ timeout: 10_000 });
  await expect(page.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link")).toHaveCount(8);
  await expect(page.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link", { name: "Agentes de IA" })).toHaveAttribute("href", "/agentes");
  await expect(page.locator("#mobile-menu").getByRole("link", { name: "Hablemos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "English" })).toBeVisible();
  await context.close();
});

test("los cuatro chips responden al foco y enlazan a servicios", async ({ page }) => {
  await page.goto("/");
  const chips = page.locator('#hero li a[href="#servicios"]');
  await expect(chips).toHaveCount(4);
  const names = ["web-ecommerce", "booking-payments", "crm-automation", "ai-software"];
  for (let index = 0; index < names.length; index++) {
    await expect(async () => {
      await chips.nth(index).focus();
      await expect(chips.nth(index)).toHaveAttribute("aria-describedby", "hero-service-promise");
      await expect(page.locator('[data-particle-canvas="global"]')).toHaveAttribute("data-particle-confirmed", `service:${names[index]}`, { timeout: 1_500 });
    }).toPass({ timeout: 15_000 });
  }
  await chips.last().press("Enter");
  await expect(page).toHaveURL(/#servicios$/);
  await expect(page.locator("#servicios")).toBeInViewport();
});

test("la puerta de contenido muestra el trailer según la pantalla", async ({ browser }) => {
  test.setTimeout(90_000);
  for (const { viewport, format } of [
    { viewport: { width: 1440, height: 900 }, format: "landscape" },
    { viewport: { width: 1100, height: 800 }, format: "portrait" },
  ]) {
    const context = await browser.newContext({ baseURL: BASE_URL, viewport });
    const page = await context.newPage();
    await page.goto("/");
    const door = page.locator('[data-door="ai-software"]');
    await door.scrollIntoViewIfNeeded();
    await door.hover();
    await expect(door.locator("[data-trailer-format]")).toHaveAttribute("data-trailer-format", format, { timeout: 15_000 });
    await expect(door.locator("video")).toHaveAttribute("src", format === "landscape" ? /fabrica-trailer-es-16x9\.mp4$/ : /fabrica-trailer-es\.mp4$/);
    await context.close();
  }
});

test("/fabricas da el trailer horizontal a la pantalla ancha y el vertical al teléfono", async ({ browser }) => {
  test.setTimeout(90_000);
  for (const { viewport, file } of [
    { viewport: { width: 1280, height: 800 }, file: /fabrica-trailer-es-16x9\.mp4$/ },
    { viewport: { width: 390, height: 844 }, file: /fabrica-trailer-es\.mp4$/ },
  ]) {
    const context = await browser.newContext({ baseURL: BASE_URL, viewport });
    const page = await context.newPage();
    await page.goto("/fabricas");
    const gallery = page.locator("[data-video-gallery]");
    await gallery.getByRole("button", { name: /Ver el video/ }).first().click();
    await expect(gallery.locator("video source")).toHaveAttribute("src", file);
    await context.close();
  }
});

test("el muestrario de /fabricas enseña cada estilo en su formato", async ({ browser }) => {
  test.setTimeout(90_000);
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ baseURL: BASE_URL, viewport });
    const page = await context.newPage();
    await page.goto("/fabricas");
    const showcase = page.locator("[data-style-showcase]");
    await showcase.scrollIntoViewIfNeeded();
    const styles = showcase.getByRole("group", { name: "Elige un estilo" }).getByRole("button");
    await expect(styles).toHaveCount(7);
    for (const [name, id, ratio] of [["Persona", "persona", 4 / 5], ["Empresa", "empresa", 16 / 9], ["VSL", "vsl", 16 / 9], ["Reel", "reel", 9 / 16], ["Historia", "historia", 9 / 16], ["Cuadrado", "cuadrado", 1], ["Carrusel", "carrusel", 4 / 5]] as const) {
      await styles.filter({ hasText: name }).click();
      await expect(styles.filter({ hasText: name })).toHaveAttribute("aria-pressed", "true");
      const stage = showcase.locator(`[data-sample="${id}"]`);
      await expect(stage.locator("video")).toHaveAttribute("src", new RegExp(`/muestras/${id}-es\\.mp4$`));
      const box = await stage.boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.width / box!.height - ratio)).toBeLessThan(0.02);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    }
    await expect(showcase.locator("figcaption")).toContainText("no es una campaña publicada");
    await context.close();
  }
});

test("mantiene chips, header y brief dentro de cuatro viewports", async ({ browser }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    const context = await browser.newContext({ baseURL: BASE_URL, viewport });
    const page = await context.newPage();
    await page.goto("/");
    const homeMetrics = await page.evaluate(() => {
      const chips = [...document.querySelectorAll<HTMLElement>('#hero li a[href="#servicios"]')];
      const header = document.querySelector<HTMLElement>('header > div');
      return {
        viewport: window.innerWidth,
        bodyOverflow: getComputedStyle(document.body).overflowX,
        railRight: Math.max(...chips.map((chip) => chip.getBoundingClientRect().right)),
        headerRight: header?.getBoundingClientRect().right ?? 0,
      };
    });
    expect(["hidden", "clip"]).toContain(homeMetrics.bodyOverflow);
    expect(homeMetrics.railRight).toBeLessThanOrEqual(homeMetrics.viewport + 1);
    expect(homeMetrics.headerRight).toBeLessThanOrEqual(homeMetrics.viewport + 1);

    await page.goto("/aplicar");
    const applyMetrics = await page.evaluate(() => {
      const form = document.querySelector<HTMLFormElement>('form[name="project-brief"]')?.getBoundingClientRect();
      return { viewport: window.innerWidth, documentWidth: document.documentElement.scrollWidth, left: form?.left ?? -1, right: form?.right ?? Infinity };
    });
    expect(applyMetrics.documentWidth).toBeLessThanOrEqual(applyMetrics.viewport);
    expect(applyMetrics.left).toBeGreaterThanOrEqual(0);
    expect(applyMetrics.right).toBeLessThanOrEqual(applyMetrics.viewport + 1);
    await context.close();
  }
});

test("el home conserva el índice de casos y el archivo permite abrirlos", async ({ page }) => {
  await page.goto("/");
  const projects = page.locator("#proyectos");
  await expect(projects.getByRole("heading", { level: 2 })).toBeAttached();
  await expect(projects.locator('a[href="/casos-de-exito/fenix-medical-center"]')).toHaveCount(1);
  await expect(projects.locator('a[href="/casos-de-exito/lb-elite-wash-detail"]')).toHaveCount(1);
  await expect(projects.locator('a[href="/casos-de-exito/new-brothers-barberia"]')).toHaveCount(1);
  await projects.getByRole("link", { name: "Ver todos los casos", exact: true }).click();
  await expect(page).toHaveURL(/\/casos-de-exito$/);
  await expect(page.getByRole("heading", { level: 1, name: "Trabajo que se puede abrir." })).toBeVisible();
  const index = page.getByRole("navigation", { name: "Ir directo a un caso" });
  await expect(index.getByRole("link")).toHaveCount(15);
  await expect(page.getByRole("link", { name: /Ver el caso/ })).toHaveCount(15);
});

test("el rótulo contextual coincide con la formación visible", async ({ page }) => {
  for (const route of ["/sistemas", "/estudio"]) {
    await page.goto(route);
    const field = page.locator('[data-particle-canvas="global"]');
    await expect(field.locator("canvas")).toHaveCount(1);
    const caption = page.getByText("Tecnología contextual", { exact: true });
    await expect.poll(async () => {
      const name = await field.getAttribute("data-particle-confirmed");
      if (!name) return await caption.count() === 0;
      return await caption.locator("..").innerText().then((text) => text.includes(name));
    }).toBe(true);
  }
});

test("sistemas narra casos de uso con films interactivos", async ({ page }) => {
  await page.goto("/sistemas");
  await expect(page.getByRole("heading", { name: "De herramientas sueltas a un sistema." })).toBeVisible();
  await expect(page.locator('[data-film-stage="opening"]')).toHaveCount(1);

  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(3);
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("link", { name: /Ver el caso New Brothers/ })).toBeVisible();

  // Un flujo de ejemplo se rotula como tal y sus etapas abren el inspector.
  // La sala es un chunk propio: se reintenta el clic hasta que hidrata.
  const leadTab = page.getByRole("tab", { name: /El lead de las 23:45/ });
  await expect(async () => {
    await leadTab.click();
    await expect(leadTab).toHaveAttribute("aria-selected", "true", { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
  await expect(page.getByText("Flujo de ejemplo con datos de muestra")).toBeVisible();
  // Un ejemplo enlaza al caso real que resuelve algo parecido, en el capítulo de su film.
  await expect(page.getByRole("link", { name: "Visto en AD Media Solution" })).toHaveAttribute("href", /\/casos-de-exito\/ad-media-solution#film-speed-to-lead$/);
  await page.getByRole("button", { name: /01 · Edge Worker Ingesta/ }).click();
  const inspector = page.getByRole("dialog", { name: /Etapa 1/ });
  await expect(inspector).toBeVisible();
  await expect(inspector).toContainText("Next.js 16 Edge Route");
  await inspector.getByRole("button", { name: "Cerrar inspector" }).click();
  await expect(inspector).toHaveCount(0);

  // Los capítulos son texto real (subtítulos) y se pueden recorrer.
  await page.getByRole("button", { name: /Resultado/ }).click();
  await expect(page.getByText("En la muestra, el lead recibe respuesta en menos de un segundo", { exact: false })).toBeVisible();
});

test("sin movimiento, el film de apertura no fija el scroll", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: BASE_URL, viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/sistemas");
  const opening = page.locator('section[aria-labelledby="opening-film-title"]');
  await expect(opening).toHaveCount(1);
  await expect(opening).not.toHaveClass(/h-\[520vh\]/);
  await context.close();
});

test("cambia idioma y conserva los parámetros y el ancla", async ({ page }) => {
  await page.goto("/?origen=qa#hero");
  await openDesktopUtilities(page);
  await page.getByRole("button", { name: "en", exact: true }).click();
  await expect(page).toHaveURL(/\/en\?origen=qa#hero$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I orchestrate your business technology");
  await expect(page.locator('#hero li a[href="#servicios"]')).toHaveCount(4);
});

test("Cómo trabajo mantiene los tres pasos y el texto en ambos idiomas", async ({ page }) => {
  for (const language of ["es", "en"] as const) {
    await page.goto(language === "es" ? "/#perfil" : "/en#perfil");
    const profile = page.locator("#perfil");
    await expect(profile.getByRole("heading", { level: 2 })).toHaveText(language === "es" ? "Hablas conmigo y lo construyo yo." : "You talk to me, and I build it.");
    await expect(profile.locator("ol > li")).toHaveCount(3);
    await expect(profile.locator("h3")).toHaveText(language === "es" ? ["Diagnóstico", "Construcción", "Traspaso y mantenimiento"] : ["Diagnosis", "Build", "Handover and maintenance"]);
    expect(await profile.evaluate(e => e.getBoundingClientRect().height)).toBeLessThanOrEqual(1800);
  }
});

test("Pruébalo conserva rutas externas, notas y rótulos Demo", async ({ page }) => {
  await page.goto("/casos-de-exito");
  const cards = page.locator("[data-try-it-cards] article");
  await expect(cards).toHaveCount(3);
  await expect(cards.locator("h3")).toHaveText(["Fenix Medical Center", "L&B Elite Wash & Detail", "New Brothers Barbería"]);
  await expect(cards.nth(2).getByText("Demo", { exact: true })).toHaveCount(2);
  for (const link of await cards.locator('a[target="_blank"]').all()) {
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    const notice = await link.getAttribute("aria-describedby");
    await expect(page.locator(`[id="${notice}"]`)).toContainText("pestaña nueva");
  }
  await expect(cards.nth(0)).toContainText("no hace falta enviarlo");
  await expect(cards.nth(1)).toContainText("sin reservar");
});

test("el brief se revela con teclado y conserva el borrador al plegar", async ({ page }) => {
  await page.goto("/#contacto");
  const button = page.locator('button[aria-controls="brief"]');
  const panel = page.locator("#brief");
  await expect(panel).toBeHidden();
  expect(await panel.evaluate(e => e.getBoundingClientRect().height)).toBe(0);
  await expect(async () => {
    if (await button.getAttribute("aria-expanded") !== "true") { await button.focus(); await button.press("Enter"); }
    await expect(button).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass({ timeout: 10000 });
  await expect(page.locator("#brief-name")).toBeFocused();
  await page.locator("#brief-name").fill("Borrador sin enviar");
  await button.focus(); await button.press("Space"); await expect(panel).toBeHidden();
  await button.press("Space"); await expect(page.locator("#brief-name")).toBeFocused();
  await expect(page.locator("#brief-name")).toHaveValue("Borrador sin enviar");
});

test("un enlace directo a brief abre el formulario y enfoca el nombre", async ({ page }) => {
  for (const path of ["/#brief", "/en#brief"]) {
    await page.goto(path);
    await expect(page.locator('button[aria-controls="brief"]')).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#brief-name")).toBeFocused();
  }
});

test("mantiene Cómo trabajo y Pruébalo dentro de tablet y pantalla ancha", async ({ browser }) => {
  for (const viewport of [{ width: 768, height: 1024 }, { width: 1920, height: 1080 }]) {
    const context = await browser.newContext({ baseURL: BASE_URL, viewport });
    const page = await context.newPage(); await page.goto("/#perfil");
    for (const selector of ["#perfil", "#proyectos"]) {
      const metrics = await page.locator(selector).evaluate(e => {
        const r=e.getBoundingClientRect(); return {left:r.left,right:r.right,width:innerWidth,document:document.documentElement.scrollWidth};
      });
      expect(metrics.left).toBeGreaterThanOrEqual(0); expect(metrics.right).toBeLessThanOrEqual(metrics.width);
      expect(metrics.document).toBeLessThanOrEqual(metrics.width);
    }
    await context.close();
  }
});

test("una demo que no se deja embeber ofrece abrir el sitio en vez de un panel en blanco", async ({ page }) => {
  await page.goto("/casos-de-exito");
  const dialog = page.getByRole("dialog");
  await expect(async () => {
    await page.getByRole("button", { name: "Demo en vivo" }).first().click({ timeout: 2000 });
    await expect(dialog).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 10_000 });
  await expect(dialog.getByRole("heading", { name: "Fenix Medical Center" })).toBeVisible();
  await expect(dialog.getByText("Este sitio no permite vista embebida")).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Abrir sitio en vivo" })).toHaveAttribute("href", "https://fenixmedicalcenters.com");
  await expect(dialog.locator("iframe")).toHaveCount(0);
});

test("abre un caso profundo sin modal ni iframe", async ({ page }) => {
  await page.goto("/casos-de-exito");
  // La tarjeta del archivo (el índice de la cabecera lleva al mismo caso; lo cubre otro test).
  const caseLink = page.locator('#archive-work ~ * a[href="/casos-de-exito/autohub-360"], section[aria-labelledby="archive-work"] a[href="/casos-de-exito/autohub-360"]').first();
  await expect(caseLink).toHaveAttribute("href", "/casos-de-exito/autohub-360");
  await caseLink.focus();
  await caseLink.press("Enter");
  await expect(page).toHaveURL(/\/casos-de-exito\/autohub-360$/);
  await expect(page.getByRole("heading", { level: 1, name: "AutoHub 360" })).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);

  // AutoHub ahora tiene film insignia con capítulos propios.
  await expect(page.locator('[data-film-stage="flagship"]')).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Concesionaria/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Tour Interior/i })).toBeVisible();

  // El relato completo sigue disponible como texto.
  await page.getByText("Leer el caso en texto").click();
  await expect(page.getByText("El desafío")).toBeVisible();
});

// Cada film insignia: su primer capítulo y uno con medios o la escena
// protagonista. Saltar a ese capítulo ejercita la carga de medios: si el
// navegador no decodifica un clip, queda el póster en lugar de un error.
const FLAGSHIP_CASES = [
  { slug: "fenix-medical-center", name: "Fenix Medical Center", first: /Renacer/, jump: /Posicionamiento/ },
  { slug: "lb-elite-wash-detail", name: "L&B Elite Wash & Detail", first: /Flota/, jump: /Cotizador/ },
  { slug: "ad-media-solution", name: "AD Media Solution", first: /La alianza/, jump: /Speed-to-Lead/ },
  { slug: "america-tramites", name: "América Trámites", first: /Identidad/, jump: /Recorrido/ },
  { slug: "mr-studio-tattoo", name: "Mr. Studio Tattoo", first: /El estudio/, jump: /Zona del cuerpo/ },
  { slug: "truckers-choice", name: "Truckers Choice", first: /La ruta/, jump: /Dos idiomas/ },
  { slug: "new-brothers-barberia", name: "New Brothers Barbería", first: /El problema/, jump: /El panel/ },
  { slug: "rangel-oviedo-group", name: "Rangel Oviedo Group", first: /Identidad/, jump: /El Método/ },
  { slug: "evowrap", name: "EvoWrap", first: /Identidad/, jump: /Configurador/ },
  { slug: "autohub-360", name: "AutoHub 360", first: /Concesionaria/i, jump: /Tour Interior/i },
  { slug: "doge-sm", name: "DOGE.S.M LLC", first: /Estándar/i, jump: /Niveles/i },
  { slug: "punta-360", name: "Punta 360", first: /Estándar/i, jump: /Tour Inmersivo/i },
  { slug: "lnb-saas", name: "La Nueva Brasil", first: /Tradición/i, jump: /The Cake Studio/i },
  { slug: "hub-profesional-ai", name: "Hub Profesional", first: /Estándar/i, jump: /Selector/i },
];

for (const flagship of FLAGSHIP_CASES) {
  test(`el caso insignia de ${flagship.name} reproduce su film sin errores`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (message) => {
      if (message.type() === "error" && /remotion|MediaPlayback|player/i.test(message.text())) errors.push(message.text());
    });
    await page.goto(`/casos-de-exito/${flagship.slug}`);
    await expect(page.getByRole("heading", { level: 1, name: flagship.name })).toBeVisible();

    // El film insignia (no el genérico) con sus capítulos reales.
    const stage = page.locator('[data-film-stage="flagship"]');
    await expect(stage).toHaveCount(1);
    await stage.scrollIntoViewIfNeeded();
    await expect(page.getByRole("button", { name: flagship.first })).toBeVisible();

    await page.getByRole("button", { name: flagship.jump }).click();
    await page.waitForTimeout(3_000);
    expect(errors).toEqual([]);
  });
}

test("un enlace con #film-<capítulo> abre el film en ese capítulo y se puede compartir", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/casos-de-exito/mr-studio-tattoo#film-booking");
  const booking = page.getByRole("button", { name: /La reserva/ });
  await expect(booking).toHaveAttribute("aria-current", "step", { timeout: 30_000 });

  // Elegir un capítulo deja la URL lista para compartir, sin sumar historial.
  await page.getByRole("button", { name: /Consentimiento/ }).click();
  await expect(page).toHaveURL(/#film-consent$/);
  await page.getByRole("button", { name: /Compartir este capítulo/ }).click();
  await expect(page.getByText("Enlace copiado")).toBeVisible();
  expect(await page.evaluate("navigator.clipboard.readText()")).toMatch(/\/casos-de-exito\/mr-studio-tattoo#film-consent$/);
});

test("el riel de films del archivo abre el caso directo en su film", async ({ page }) => {
  await page.goto("/casos-de-exito");
  const rail = page.getByRole("region", { name: "Cada caso, contado como un film." });
  await rail.scrollIntoViewIfNeeded();
  await expect(rail.getByRole("link")).toHaveCount(FLAGSHIP_CASES.length);
  await rail.getByRole("link", { name: /L&B Elite Wash/ }).click();
  await expect(page).toHaveURL(/\/casos-de-exito\/lb-elite-wash-detail#film$/, { timeout: 30_000 });
  await expect(page.locator('[data-film-stage="flagship"]')).toBeInViewport({ timeout: 15_000 });
});

test.describe("con movimiento reducido", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("las páginas hidratan sin diferencias entre servidor y cliente", async ({ page }) => {
    // Cinco rutas en una sola prueba: en `next dev` la primera visita compila cada una.
    test.setTimeout(150_000);
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && /hydrat|did not match|server rendered|not hydrated/i.test(message.text())) errors.push(message.text().slice(0, 200));
    });
    page.on("pageerror", (error) => {
      if (/hydrat|not hydrated/i.test(String(error))) errors.push(String(error).slice(0, 200));
    });
    for (const route of ["/", "/casos-de-exito", "/casos-de-exito/fenix-medical-center", "/sistemas", "/en/casos-de-exito"]) {
      await page.goto(route, { waitUntil: "load" });
      await page.waitForTimeout(1500);
    }
    expect(errors).toEqual([]);
  });
});

test("el archivo de casos lleva a cada caso en un clic", async ({ page }) => {
  await page.goto("/casos-de-exito");
  const index = page.getByRole("navigation", { name: "Ir directo a un caso" });
  await expect(index.getByRole("link")).toHaveCount(15);
  await index.getByRole("link", { name: /AD Media Solution/ }).click();
  await expect(page).toHaveURL(/\/casos-de-exito\/ad-media-solution$/, { timeout: 30_000 });
  await expect(page.locator('[data-film-stage="flagship"]')).toHaveCount(1);
});

test("cada tarjeta del trabajo lleva un botón visible a su caso", async ({ page }) => {
  await page.goto("/casos-de-exito");
  // Seis del reel y nueve del archivo: cada uno con su botón "Ver el caso (y su film)".
  await expect(page.getByRole("link", { name: /Ver el caso/ })).toHaveCount(15);
  const archive = page.getByRole("region", { name: "Experiencias, productos y sistemas." });
  const card = archive.getByRole("link", { name: /La Nueva Brasil/ });
  await expect(card).toContainText("Ver el caso y su film");
  await card.click();
  await expect(page).toHaveURL(/\/casos-de-exito\/lnb-saas$/, { timeout: 30_000 });
});

test("cada caso termina con casos parecidos que abren su film", async ({ page }) => {
  await page.goto("/casos-de-exito/new-brothers-barberia");
  const related = page.getByRole("region", { name: "Otros casos que resuelven algo parecido." });
  await related.scrollIntoViewIfNeeded();
  const links = related.getByRole("link");
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) await expect(link).toHaveAttribute("href", /\/casos-de-exito\/[a-z0-9-]+#film$/);
});

test.describe("estudio con movimiento reducido", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("el selector de casos cambia el film con teclado y conserva la selección", async ({ page }) => {
    for (const language of ["es", "en"] as const) {
      await page.goto(language === "es" ? "/estudio" : "/en/estudio");
      const tabs = page.locator('[role="tablist"] [role="tab"]');
      await expect(tabs).toHaveText(["Mr. Studio Tattoo", "Truckers Choice", "L&B Elite Wash & Detail"]);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(language === "es" ? "Una web que explica lo que haces y hace que te escriban." : "A website that explains what you do and gets people to reach out.");
      await expect(page.locator('[data-service-section="deliverables"] li')).toHaveCount(3);
      await expect(async () => {
        await tabs.first().focus(); await page.keyboard.press("ArrowRight");
        await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true", { timeout: 1000 });
      }).toPass({ timeout: 10000 });
      await expect(tabs.nth(1)).toBeFocused();
      await expect(page).toHaveURL(/film=truckers-choice/);
      await expect(page.locator('#web-film-panel [data-film-stage="flagship"]')).toHaveCount(1);
      await page.reload();
      await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
      await tabs.nth(1).focus(); await page.keyboard.press("End");
      await expect(tabs.last()).toBeFocused(); await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Home"); await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
      await expectStudioClosing(page, language);
    }
  });
});

test("Cómo trabajo muestra una foto quieta y con alt en ambos idiomas", async ({ page }) => {
  for (const width of [390, 1440]) for (const language of ["es", "en"] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(language === "es" ? "/#perfil" : "/en#perfil");
    const photo = page.locator("#perfil img");
    await expect(photo).toHaveAttribute("alt", language === "es" ? "Mario Morera frente a una interfaz de diseño en su pantalla" : "Mario Morera in front of a design interface on his screen");
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.evaluate(e => (e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const style = await photo.evaluate(e => ({ animation: getComputedStyle(e).animationName, transform: getComputedStyle(e).transform }));
    expect(style).toEqual({ animation: "none", transform: "none" });
    await expect(page.locator("#perfil ol > li")).toHaveCount(3);
  }
});

async function completeBrief(page: Page) {
  await page.getByLabel("Nombre").fill("QA Mario");
  await page.getByLabel("Email", { exact: true }).fill("qa@example.com");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Proyecto o empresa (opcional)").fill("QA Studio");
  await page.getByText("Ya existe y necesita una nueva versión.", { exact: true }).click();
  await page.getByText("Hay un equipo pequeño involucrado.", { exact: true }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.locator("#brief-project").fill("Necesitamos conectar producto, CRM y seguimiento comercial.");
  await page.getByText("Estoy explorando.", { exact: true }).click();
}

test("muestra el estado exitoso del brief con una respuesta simulada", async ({ page }) => {
  // Respuesta Flight de la acción: interceptada antes de llegar al servidor.
  await page.route("**/aplicar", route => route.request().method() === "POST"
    ? route.fulfill({ contentType: "text/x-component", body: '0:{"a":"$@1","f":[],"b":"qa"}\n1:{"success":true}\n' })
    : route.continue());
  await page.goto("/aplicar");
  await completeBrief(page);
  await page.getByRole("button", { name: "Enviar contexto" }).click();
  await expect(page.getByRole("heading", { name: "Contexto recibido" })).toBeVisible();
});

test("valida el brief por pasos y enfoca el primer error", async ({ page }) => {
  await page.goto("/aplicar");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.locator("#brief-name-error")).toContainText(/nombre/i);
  await expect(page.locator("#brief-name")).toBeFocused();
  await page.getByLabel("Nombre").fill("QA Mario");
  await page.getByLabel("Email", { exact: true }).fill("qa@example.com");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByLabel("Proyecto o empresa (opcional)")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.locator("#brief-project-stage-idea-error")).toBeVisible();
  await expect(page.locator("#brief-project-stage-idea")).toBeFocused();
  await page.getByText("Es una idea que todavía no existe.", { exact: true }).click();
  await page.getByText("Lo lidero personalmente.", { exact: true }).click();
  await page.locator("#brief-team-context-solo").press("Enter");
  await expect(page.locator("#brief-project")).toBeVisible();
});

test("muestra un error recuperable si falla el envío", async ({ page }) => {
  await page.route("**/aplicar", async (route) => {
    if (route.request().method() === "POST") await route.abort("failed");
    else await route.continue();
  });
  await page.goto("/aplicar");
  await completeBrief(page);
  await page.getByRole("button", { name: "Enviar contexto" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No pude enviar el contexto" })).toBeVisible();
});

test("ofrece fallback estático con touch y reduced motion", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  const chip = page.locator('#hero li a[href="#servicios"]').first();
  await expect(async () => {
    await chip.focus();
    await expect(chip).toHaveAttribute("aria-describedby", "hero-service-promise", { timeout: 1_000 });
  }).toPass({ timeout: 10_000 });
  await expect(page.getByRole("button", { name: "Abrir menú" })).toBeVisible();
  const profile = page.locator("#perfil");
  await profile.scrollIntoViewIfNeeded();
  await expect(profile.locator("ol > li")).toHaveCount(3);
  const photo = profile.locator("img");
  await expect(photo).toHaveAttribute("alt", "Mario Morera frente a una interfaz de diseño en su pantalla");
  await expect.poll(() => photo.evaluate(e => (e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await photo.evaluate(e => getComputedStyle(e).animationName)).toBe("none");
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
  await context.close();
});

test("presenta el perfil y los proyectos con movimiento reducido en escritorio", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: BASE_URL, viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage(); await page.goto("/#perfil");
  await expect(page.locator("#perfil ol > li")).toHaveCount(3);
  await expect(page.locator("#proyectos li")).toHaveCount(6);
  expect(await page.locator("#proyectos").evaluate(e => e.getBoundingClientRect().height)).toBeLessThanOrEqual(1700);
  await expect(page.locator("#brief")).toBeHidden();
  await expect(page.locator("canvas")).toHaveCount(0);
  await context.close();
});

test("alterna al modo claro, lo persiste y mantiene la home legible", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  await page.goto("/");

  // Default de marca: dark, sin preferencia guardada.
  await expect(page.locator("html")).toHaveClass(/dark/);
  await openDesktopUtilities(page);
  const toggle = page.getByRole("button", { name: /Cambiar a modo claro/ });
  await toggle.click();

  await expect(page.locator("html")).toHaveClass(/light/);
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("mm-theme")))
    .toBe("light");
  // El fondo pasa al marfil de marca y el titular sigue legible (tinta sobre papel).
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
    .toBe("rgb(243, 240, 232)");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toContainText("Orquesto la tecnología de tu negocio");
  const headingColor = await heading.evaluate((node) => getComputedStyle(node).color);
  expect(headingColor).not.toBe("rgb(243, 240, 232)");

  // Anti-FOUC: tras recargar, la clase light ya está aplicada.
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
  await expect(page.locator("canvas")).toHaveCount(1);

  // Vuelta a oscuro desde el mismo control.
  await openDesktopUtilities(page);
  await page.getByRole("button", { name: /Cambiar a modo oscuro/ }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("mm-theme")))
    .toBe("dark");
  expect(pageErrors).toEqual([]);
});

async function expectStudioClosing(page: Page, language: "es" | "en" = "es") {
  const closing = page.locator('[data-service-section="closing"]');
  await expect(closing).toHaveClass(/banda-marfil/);
  await expect(closing.getByRole("heading", { level: 2 })).toHaveText(language === "es" ? "¿Tu web explica bien lo que haces?" : "Does your website explain what you do?");
  await expect(closing.getByRole("link", { name: language === "es" ? "Hablemos de tu web" : "Let's talk about your website" })).toHaveAttribute("href", language === "es" ? "/aplicar" : "/en/aplicar");
}

test("monta los MP4 de preview solo en las rutas que los usan", async ({ page }) => {
  await installPreviewVideoFixture(page);
  const integrations = [
    { path: "/", assets: [{ id: "apertura-protegida", source: "minimalist-desktop.mp4" }] },
    { path: "/estudio", assets: [] },
    { path: "/aplicar", assets: [{ id: "apertura-protegida", source: "minimalist-desktop.mp4" }] },
  ] as const;

  for (const integration of integrations) {
    await page.goto(integration.path);
    if (integration.path === "/estudio") await expectStudioClosing(page);
    for (const asset of integration.assets) {
      const backdrop = page.locator(`[data-motion-asset="${asset.id}"]`);
      await expect(backdrop).toHaveCount(1);
      await expect(backdrop).toHaveAttribute("data-motion-preview", "enabled");
      await backdrop.scrollIntoViewIfNeeded();
      await expect(backdrop).toHaveAttribute("data-motion-video-status", "ready");
      await expect(backdrop.locator("video source[type='video/mp4']")).toHaveAttribute("src", new RegExp(`${asset.source}$`));
    }
  }
});

test("cruza el fondo abstracto con el tema y mantiene Cómo trabajo legible", async ({ page }) => {
  await installPreviewVideoFixture(page);
  await page.goto("/aplicar");
  const nucleus = page.locator('[data-motion-asset="apertura-protegida"]');
  await nucleus.scrollIntoViewIfNeeded();
  await expect(nucleus).toHaveAttribute("data-motion-video-status", "ready");
  const previewVideo = nucleus.locator("video[data-motion-video-preview='true']");
  await expect(previewVideo).toHaveClass(/opacity-100/);
  const layers = nucleus.locator("picture").locator("..");
  await expect(layers.nth(0)).toHaveClass(/opacity-100/);
  await expect(layers.nth(1)).toHaveClass(/opacity-0/);

  await openDesktopUtilities(page);
  await page.getByRole("button", { name: /Cambiar a modo claro/ }).click();
  await expect(previewVideo).toHaveClass(/opacity-0/);
  await expect.poll(() => previewVideo.evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);
  await expect(layers.nth(0)).toHaveClass(/opacity-0/);
  await expect(layers.nth(1)).toHaveClass(/opacity-100/);

  await page.goto("/#perfil");
  await expect(page.locator("html")).toHaveClass(/light/);
  await expect(page.locator("#perfil h2")).toHaveText("Hablas conmigo y lo construyo yo.");
  // «Cómo trabajo» es la película de autor: queda en pared con texto blanco roto en los dos temas.
  const colors = await page.locator("#perfil").evaluate(e => ({ background: getComputedStyle(e).backgroundColor, heading: getComputedStyle(e.querySelector("h2")!).color }));
  expect(colors).toEqual({ background: "rgb(11, 11, 10)", heading: "rgb(236, 231, 221)" });
});

test("mantiene posters estaticos sin montar videos con movimiento reducido", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (const { path, asset } of [
    { path: "/", asset: "apertura-protegida" },
    { path: "/aplicar", asset: "apertura-protegida" },
  ]) {
    await page.goto(path);
    const backdrop = page.locator(`[data-motion-asset="${asset}"]`);
    await expect(async () => {
      await expect(backdrop).toHaveAttribute("data-motion-video-status", "reduced", { timeout: 1_000 });
      await backdrop.scrollIntoViewIfNeeded();
      await expect(backdrop.locator("img").first()).toBeAttached();
    }).toPass({ timeout: 10_000 });
    await expect(page.locator("[data-motion-video]")).toHaveCount(0);
  }

  await page.goto("/estudio");
  await expectStudioClosing(page);
  await expect(page.locator("[data-motion-video]")).toHaveCount(0);
  await context.close();
});

test("pausa el fondo al salir del viewport y limita la reproducción", async ({ page }) => {
  await installPreviewVideoFixture(page);
  await page.goto("/");
  const opening = page.locator('[data-motion-asset="apertura-protegida"]');
  await opening.scrollIntoViewIfNeeded();
  await expect(opening).toHaveAttribute("data-motion-video-status", "ready");
  const video = opening.locator("video[data-motion-video]");
  await expect.poll(() => video.evaluate((element) => !(element as HTMLVideoElement).paused)).toBe(true);
  const playingVideos = await page.locator("[data-motion-video]").evaluateAll((videos) => videos.filter((element) => !(element as HTMLVideoElement).paused).length);
  expect(playingVideos).toBe(1);
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused)).toBe(true);
});

test("usa Camera solo para Apertura móvil", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await installPreviewVideoFixture(page);

  await page.goto("/aplicar");
  const opening = page.locator('[data-motion-asset="apertura-protegida"]');
  await opening.scrollIntoViewIfNeeded();
  await expect(opening).toHaveAttribute("data-motion-video-status", "ready");
  await expect(opening.locator("video source[type='video/mp4']")).toHaveAttribute("src", /camera-mobile\.mp4$/);

  await page.goto("/estudio");
  await expectStudioClosing(page);
  await expect(page.locator('video[data-motion-video-preview="true"]')).toHaveCount(0);
  await context.close();
});

test("recupera el poster si falla un MP4 local", async ({ page }) => {
  await page.route("**/motion/previews/minimalist-desktop.mp4", (route) => route.abort("failed"));
  await page.goto("/aplicar");
  const nucleus = page.locator('[data-motion-asset="apertura-protegida"]');
  await nucleus.scrollIntoViewIfNeeded();
  await expect(nucleus).toHaveAttribute("data-motion-video-status", "fallback");
  await expect(nucleus.locator("[data-motion-video]")).toHaveCount(0);
  await expect(nucleus.locator("picture img").first()).toBeAttached();
});

test("publica las cabeceras de seguridad en el build de producción", async ({ request }) => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL, "next dev no las aplica: necesita eval y sockets para la recarga en caliente");
  const response = await request.get("/");
  const headers = response.headers();
  const csp = headers["content-security-policy"];
  for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'self'"]) expect(csp).toContain(directive);
  expect(csp).not.toContain("unsafe-eval");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
});

test("publica canonical, hreflang, OG, JSON-LD y sitemap canónicos", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mmorera.agency");
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute("href", "https://mmorera.agency");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://mmorera.agency/en");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Mario Morera");
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", "https://mmorera.agency");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://mmorera.agency/og/inicio-es.jpg");
  const [jsonLd, sitio] = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((s) => JSON.parse(s.textContent ?? "{}")));
  expect(jsonLd["@type"]).toBe("Person");
  expect(jsonLd.url).toBe("https://mmorera.agency");
  expect(jsonLd.homeLocation).toBeUndefined();
  expect(jsonLd.sameAs).toBeUndefined();
  expect(sitio["@type"]).toBe("WebSite");
  expect(sitio.publisher["@id"]).toBe(jsonLd["@id"]);
  expect(await page.content()).not.toMatch(/Uruguay|es-UY|es_UY/);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  expect(xml).toContain("https://mmorera.agency/en/casos-de-exito/autohub-360");
  for (const route of ["/sobre-mi", "/agentes", "/capacidades/ia-aplicada", "/casos-de-uso/lead-de-las-23-45", "/lab/bandeja"]) expect(xml).toContain(`https://mmorera.agency${route}<`);
  expect(xml).not.toContain("https://mmorera.agency/cv<");
});

test("abre las ramas: capacidades, casos de uso y Lab", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  // Cada escena del home termina en la puerta de su rama.
  const doors = page.locator("main [data-explore-door]");
  await expect(doors).toHaveCount(4);
  expect(await doors.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual(["/capacidades", "/casos-de-uso", "/lab", "/sobre-mi"]);
  await expect(page.getByRole("navigation", { name: "Barra de navegación flotante" }).getByRole("button", { name: "Casos" })).toBeVisible();

  await page.goto("/capacidades");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nueve capacidades que se conectan entre sí.");
  const families = page.locator('section[aria-labelledby="capacidades-todas"] a');
  await expect(families).toHaveCount(9);
  await families.filter({ hasText: "CRM & operación" }).click();
  await expect(page).toHaveURL(/\/capacidades\/crm-y-operacion$/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("CRM & operación");
  await expect(page.locator('section[aria-labelledby="familia-servicio"] a')).toHaveAttribute("href", "/sistemas");
  await page.goto("/en/capacidades/ia-aplicada");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Applied AI");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mmorera.agency/en/capacidades/ia-aplicada");

  await page.goto("/casos-de-uso");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Problemas reales, contados de punta a punta.");
  await expect(page.locator('main a[href^="/casos-de-uso/"]')).toHaveCount(3);
  await page.goto("/casos-de-uso/lead-de-las-23-45");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("El lead de las 23:45");
  await expect(page.getByRole("tab")).toHaveCount(0);
  await expect(page.locator('section[aria-labelledby="caso-texto"] li')).toHaveCount(4);
  await expect(page.getByRole("link", { name: "Visto en AD Media Solution" })).toHaveAttribute("href", /\/casos-de-exito\/ad-media-solution#film-speed-to-lead$/);
  await expect(page.locator('section[aria-labelledby="caso-servicio"] a')).toHaveAttribute("href", "/agentes");

  await page.goto("/lab");
  await expect(page.locator('main a[href^="/lab/"]')).toHaveCount(2);
  await page.goto("/lab/bandeja");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bandeja con agente");
  await expect(page.getByText("Datos de ejemplo", { exact: true })).toBeVisible();
  await page.goto("/en/lab/identidad-visual");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Visual identity studio");
});

test("las ramas largas se recorren por capítulos desde la barra flotante", async ({ page }) => {
  for (const { path, chapters, jump } of [
    { path: "/sistemas", chapters: ["Para quién", "Cómo funciona", "Casos", "Contratar", "Hablemos"], jump: { name: "Contratar", id: "contratar" } },
    { path: "/casos-de-exito", chapters: ["Pruébalo", "Destacados", "Films", "Archivo", "Hablemos"], jump: { name: "Archivo", id: "archivo" } },
  ]) {
    await page.goto(path);
    const dock = page.getByRole("navigation", { name: "Barra de navegación flotante" });
    await expect(dock.getByRole("button")).toHaveText([...chapters, ""]);
    // WhatsApp va dentro de la barra: no queda el botón suelto.
    await expect(page.getByRole("link", { name: "Escribir por WhatsApp" })).toHaveCount(0);
    await dock.getByRole("button", { name: jump.name }).click();
    await expect(page.locator(`#${jump.id}`)).toBeInViewport({ timeout: 10_000 });
  }
  // En las páginas sin barra sigue el acceso directo a WhatsApp.
  await page.goto("/capacidades");
  await expect(page.getByRole("link", { name: "Escribir por WhatsApp" })).toHaveCount(1);
});

test("la demo guiada del agente responde, reconoce su límite y pasa a una persona", async ({ page }) => {
  await page.goto("/agentes");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Un agente que atiende, responde y agenda por ti, con una persona cuando hace falta.");
  await expect(page.getByText("Demo guiada · respuestas escritas de antemano · datos de muestra")).toBeVisible();
  const log = page.getByRole("log", { name: "Conversación de ejemplo" });
  await expect(log).toContainText("Hola, soy el asistente de la barbería.");
  await page.getByRole("button", { name: "¿Abren el sábado?" }).click();
  await expect(log).toContainText("el sábado abrimos de 9:00 a 14:00");
  await page.getByRole("button", { name: "Prefiero hablar con alguien." }).click();
  await expect(log).toContainText("La conversación pasó a una persona del equipo, con todo el contexto.");
  await expect(page.getByRole("button", { name: "¿Cuánto sale un corte con barba?" })).toHaveCount(0);
  await page.getByRole("button", { name: "Volver a empezar" }).click();
  await expect(page.getByRole("button", { name: "¿Abren el sábado?" })).toBeVisible();
  await expect(log).not.toContainText("La conversación pasó a una persona");
});

test("el CV vive en «Sobre mí», con la película de autor arriba", async ({ page }) => {
  await page.goto("/cv");
  await expect(page).toHaveURL(/\/sobre-mi#cv$/);
  await expect(page.locator("#cv")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await page.goto("/en/cv");
  await expect(page).toHaveURL(/\/en\/sobre-mi#cv$/);
});
