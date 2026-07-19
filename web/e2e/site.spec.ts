import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";

async function openDesktopUtilities(page: Page) {
  await page.getByRole("button", { name: "Abrir utilidades" }).click();
}

test("navega por la cabecera y conserva un único canvas", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Creo lo que una idea necesita");
  await expect(page.locator("canvas")).toHaveCount(1);
  const technologyLabel = page.getByTestId("technology-stage-label");
  await expect(technologyLabel).toContainText("Figma");
  await expect(technologyLabel).toContainText("Dirección visual");
  await page.locator("canvas").evaluate((canvas) => { canvas.dataset.e2ePersistent = "true"; });
  await page.getByRole("button", { name: "Construir", exact: true }).first().click();
  const transitionSamples = await page.locator('[data-particle-canvas="global"]').evaluate(async (field) => {
    const samples: { current: string; phase: string; targets: number }[] = [];
    for (let index = 0; index < 24; index += 1) {
      samples.push({
        current: field.getAttribute("data-particle-current") ?? "",
        phase: field.getAttribute("data-particle-phase") ?? "",
        targets: Number(field.getAttribute("data-particle-target-count") ?? "0"),
      });
      await new Promise((resolve) => window.setTimeout(resolve, 75));
    }
    return samples;
  });
  expect(transitionSamples.every(({ current }) => current.length > 0)).toBe(true);
  expect(transitionSamples.every(({ phase }) => phase !== "idle")).toBe(true);
  expect(transitionSamples.every(({ targets }) => targets >= 1 && targets <= 2)).toBe(true);
  await expect(page).toHaveURL(/\?modo=construir$/);
  await expect(technologyLabel).toContainText("Construir");
  await expect(page.locator('canvas[data-e2e-persistent="true"]')).toHaveCount(1);
  await expect(page.locator("a button")).toHaveCount(0);
  const systemsLink = page.locator('header a[href="/sistemas"]');
  await expect(systemsLink).toHaveAttribute("href", "/sistemas");
  await systemsLink.focus();
  await systemsLink.press("Enter");
  await expect(page).toHaveURL(/\/sistemas$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Conecto lo que hoy trabaja separado");
  await expect(page.locator('canvas[data-e2e-persistent="true"]')).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test("mantiene una navegación compacta y oculta redes no verificadas", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Trabajo" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Sistemas" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Estudio" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Hablemos" })).toHaveAttribute("href", "/aplicar");
  await expect(page.locator('a[href*="linkedin"], a[href*="github"]')).toHaveCount(0);

  const utilities = header.getByRole("button", { name: "Abrir utilidades" });
  await utilities.focus();
  await utilities.press("Enter");
  await expect(header.getByRole("link", { name: "Perfil" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(header.getByRole("link", { name: "Perfil" })).toHaveCount(0);
});

test("ofrece un único menú móvil con rutas, idioma, tema y CTA", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: BASE_URL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("button")).toHaveCount(1);
  await header.getByRole("button", { name: "Abrir menú" }).click();
  await expect(page.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link")).toHaveCount(4);
  await expect(page.locator("#mobile-menu").getByRole("link", { name: "Hablemos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "English" })).toBeVisible();
  await context.close();
});

test("controla el rail por flechas, teclado, arrastre y URL", async ({ page }) => {
  await page.goto("/");
  const rail = page.getByTestId("track-rail");
  await rail.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Modo siguiente" }).click();
  await expect(page).toHaveURL(/\?modo=construir$/);
  await expect(rail.locator('[data-track="build"]')).toHaveAttribute("aria-pressed", "true");

  await rail.focus();
  await rail.press("End");
  await expect(page).toHaveURL(/\?modo=escalar$/);
  await rail.press("Home");
  await expect(page).toHaveURL(/\?modo=crear$/);

  const box = await rail.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5, { steps: 8 });
    await page.mouse.up();
    await expect(page).toHaveURL(/\?modo=(construir|escalar)$/);
  }
});

test("mantiene rail, header y brief dentro de cuatro viewports", async ({ browser }) => {
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
      const rail = document.querySelector<HTMLElement>('[data-testid="track-rail"]');
      const header = document.querySelector<HTMLElement>('header > div');
      return {
        viewport: window.innerWidth,
        bodyOverflow: getComputedStyle(document.body).overflowX,
        railRight: rail?.getBoundingClientRect().right ?? 0,
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

test("prioriza capacidades en home y mantiene los casos en el archivo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('main a[href^="/casos-de-exito/"]')).toHaveCount(0);
  await expect(page.getByText("Trabajo que se puede abrir.").first()).toBeVisible();
  const manifesto = page.getByTestId("author-manifesto");
  await expect(manifesto).toHaveCount(1);
  await expect(manifesto.getByRole("heading", { level: 2 })).toContainText("Una sola dirección para todo");
  await expect(manifesto.locator("picture img")).toHaveCount(1);
  await expect(page.locator("[data-home-section]").evaluateAll((sections) => sections.map((section) => section.getAttribute("data-home-section")))).resolves.toEqual([
    "hero",
    "tracks",
    "manifesto",
    "method",
    "archive",
    "cta",
  ]);

  await page.goto("/casos-de-exito");
  await expect(page.getByRole("heading", { level: 1, name: "Trabajo que se puede abrir." })).toBeVisible();
  await expect(page.getByText("Seis casos principales")).toHaveCount(0);
  // Reel: seis destacados con visor de demo en vivo; archivo: siete casos con página propia.
  await expect(page.getByRole("button", { name: /Ver demo en vivo/ })).toHaveCount(6);
  await expect(page.locator('main a[href^="/casos-de-exito/"]')).toHaveCount(7);
});

test("rota secuencias lentas de tecnología en sistemas y estudio", async ({ page }) => {
  await page.goto("/sistemas");
  await expect(page.getByText("Tecnología contextual")).toBeVisible();
  await expect(page.getByText("n8n", { exact: true })).toBeVisible();
  await expect(page.locator('[data-particle-canvas="global"]')).toHaveAttribute("data-particle-current", /n8n|Cloud|PostgreSQL|HubSpot|Stripe|Multi-model AI/);

  await page.goto("/estudio");
  await expect(page.getByText("Figma", { exact: true })).toBeVisible();
  await expect(page.locator('[data-particle-canvas="global"]')).toHaveAttribute("data-particle-current", /Figma|Three.js|Blender|After Effects|DaVinci Resolve/);
});

test("cambia idioma y mantiene el modo elegido en la URL", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Construir", exact: true }).first().click();
  await expect(page).toHaveURL(/\?modo=construir$/);
  await openDesktopUtilities(page);
  await page.getByRole("button", { name: "en", exact: true }).click();
  await expect(page).toHaveURL(/\/en\?modo=construir$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I build what an idea needs");
  await expect(page.getByTestId("technology-stage-label")).toContainText("One practice");
  await expect(page.getByTestId("technology-stage-label")).toContainText("Build");
  await expect(page.getByTestId("author-manifesto").getByRole("heading", { level: 2 })).toContainText("One direction for everything");
});

test("controla la película personal en ambos sentidos sin añadir otro canvas", async ({ page }) => {
  await page.goto("/");
  const manifesto = page.getByTestId("author-manifesto");
  const visual = manifesto.getByRole("img");
  await manifesto.scrollIntoViewIfNeeded();
  await expect(visual).toHaveAttribute("data-film-status", "ready");
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>("[data-film-track]");
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.58);
  });
  const film = manifesto.locator("video[data-personal-film]");
  await expect(visual).toHaveAttribute("data-sequence-state", "scale");
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(8);
  const forwardTime = await film.evaluate((video) => (video as HTMLVideoElement).currentTime);
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>("[data-film-track]");
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.25);
  });
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeLessThan(forwardTime - 2);
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);
  await expect(page.locator("canvas")).toHaveCount(1);
});

test("recupera el póster final si falla la película personal", async ({ page }) => {
  await page.route("**/profile/author-film/author-film-desktop.*", (route) => route.abort("failed"));
  await page.goto("/");
  const manifesto = page.getByTestId("author-manifesto");
  await manifesto.scrollIntoViewIfNeeded();
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-film-status", "fallback");
  await expect(manifesto.locator("video[data-personal-film]")).toHaveCount(0);
  await expect.poll(() => manifesto.locator("picture img").evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test("completa la película móvil mientras el retrato sigue visible", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  const manifesto = page.getByTestId("author-manifesto");
  const portrait = manifesto.getByRole("img");
  await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>('[data-testid="author-manifesto"]');
    if (!section) return;
    section.scrollIntoView();
  });
  await expect(portrait).toHaveAttribute("data-sequence-mode", "mobile");
  await expect(portrait).toHaveAttribute("data-film-status", "ready");
  const film = manifesto.locator("video[data-personal-film]");
  await expect(manifesto.locator("video source[type='video/mp4']")).toHaveAttribute("src", /author-film-mobile\.mp4$/);
  await expect(manifesto.locator("video source[type^='video/webm']")).toHaveCount(0);
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentSrc)).toMatch(/author-film-mobile\.mp4$/);
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>("[data-film-track]");
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.5);
  });
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(6.8);
  await expect.poll(async () => Number(await portrait.getAttribute("data-film-rendered-time"))).toBeGreaterThan(6.8);
  await expect.poll(async () => {
    await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>("[data-film-track]");
      if (!track) return;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.965);
    });
    return film.evaluate((video) => (video as HTMLVideoElement).currentTime);
  }).toBeGreaterThan(13.9);
  await expect.poll(async () => Number(await portrait.getAttribute("data-film-rendered-time"))).toBeGreaterThan(13.9);
  await expect(portrait).toHaveAttribute("data-sequence-state", "closing");
  await expect(portrait).toBeInViewport();
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>("[data-film-track]");
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.2);
  });
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeLessThan(3.5);
  await context.close();
});

test("desbloquea la pelÃ­cula mÃ³vil sin abandonar el control por scroll", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const originalPlay = HTMLMediaElement.prototype.play;
    let userActivated = false;
    window.addEventListener("pointerdown", () => { userActivated = true; }, { capture: true });
    HTMLMediaElement.prototype.play = function play() {
      if (this instanceof HTMLVideoElement && this.hasAttribute("data-personal-film") && !userActivated) {
        return Promise.reject(new DOMException("Playback requires activation", "NotAllowedError"));
      }
      return originalPlay.call(this);
    };
  });
  await page.goto("/");
  const manifesto = page.getByTestId("author-manifesto");
  await page.evaluate(() => document.querySelector('[data-testid="author-manifesto"]')?.scrollIntoView());
  const activation = page.getByRole("button", { name: "Activar secuencia" });
  await expect(activation).toBeVisible({ timeout: 5_000 });
  await activation.click();
  const portrait = manifesto.getByRole("img");
  const film = manifesto.locator("video[data-personal-film]");
  await expect(portrait).toHaveAttribute("data-film-status", "ready");
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>("[data-film-track]");
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.62);
  });
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(8.5);
  await expect(activation).toHaveCount(0);
  await context.close();
});

test("mantiene la composición sin desborde en tablet y pantalla ancha", async ({ browser }) => {
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 1920, height: 1080 },
  ]) {
    const context = await browser.newContext({
      baseURL: BASE_URL,
      viewport,
    });
    const page = await context.newPage();
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));
    await page.goto("/#perfil");
    if (viewport.width >= 1024) await page.evaluate(() => window.scrollBy(0, 120));
    const metrics = await page.getByTestId("author-manifesto").evaluate((section) => {
      const portrait = section.querySelector<HTMLElement>('[role="img"]')?.getBoundingClientRect();
      return {
        bodyWidth: document.body.scrollWidth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        portrait: portrait
          ? { top: portrait.top, right: portrait.right, bottom: portrait.bottom, left: portrait.left }
          : null,
      };
    });
    const cinematicOverscan = 32;
    expect(metrics.bodyWidth).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.portrait).not.toBeNull();
    expect(metrics.portrait?.left ?? -Infinity).toBeGreaterThanOrEqual(-cinematicOverscan);
    expect(metrics.portrait?.right ?? Infinity).toBeLessThanOrEqual(metrics.viewportWidth + cinematicOverscan);
    if (viewport.width >= 1024) {
      expect(metrics.portrait?.top ?? -Infinity).toBeGreaterThanOrEqual(-cinematicOverscan);
      expect(metrics.portrait?.bottom ?? Infinity).toBeLessThanOrEqual(metrics.viewportHeight + cinematicOverscan);
    }
    expect(pageErrors).toEqual([]);
    await context.close();
  }
});

test("abre un caso profundo sin modal ni iframe", async ({ page }) => {
  await page.goto("/casos-de-exito");
  const caseLink = page.locator('main a[href="/casos-de-exito/autohub-360"]');
  await expect(caseLink).toHaveAttribute("href", "/casos-de-exito/autohub-360");
  await caseLink.focus();
  await caseLink.press("Enter");
  await expect(page).toHaveURL(/\/casos-de-exito\/autohub-360$/);
  await expect(page.getByRole("heading", { level: 1, name: "AutoHub 360" })).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByText("El desafío")).toBeVisible();
  await expect(page.getByText("Resultado")).toBeVisible();
});

async function completeBrief(page: Page) {
  await page.getByLabel("Nombre").fill("QA Mario");
  await page.getByLabel("Email", { exact: true }).fill("qa@example.com");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Proyecto o empresa (opcional)").fill("QA Studio");
  await page.getByText("Ya existe y necesita una nueva versión.", { exact: true }).click();
  await page.getByText("Hay un equipo pequeño involucrado.", { exact: true }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("¿Qué querés cambiar, construir o hacer posible?").fill("Necesitamos conectar producto, CRM y seguimiento comercial.");
  await page.getByText("Estoy explorando.", { exact: true }).click();
}

test("muestra el estado exitoso del brief", async ({ page }) => {
  await page.goto("/aplicar");
  await completeBrief(page);
  await page.getByRole("button", { name: "Enviar contexto" }).click();
  await expect(page.getByRole("heading", { name: "Contexto recibido" })).toBeVisible();
});

test("valida el brief por pasos y enfoca el primer error", async ({ page }) => {
  await page.goto("/aplicar");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Ingresá tu nombre.")).toBeVisible();
  await expect(page.locator("#brief-name")).toBeFocused();
  await page.getByLabel("Nombre").fill("QA Mario");
  await page.getByLabel("Email", { exact: true }).fill("qa@example.com");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByLabel("Proyecto o empresa (opcional)")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Elegí el momento del proyecto.")).toBeVisible();
  await expect(page.locator("#brief-project-stage-idea")).toBeFocused();
  await page.getByText("Es una idea que todavía no existe.", { exact: true }).click();
  await page.getByText("Lo lidero personalmente.", { exact: true }).click();
  await page.locator("#brief-team-context-solo").press("Enter");
  await expect(page.getByLabel("¿Qué querés cambiar, construir o hacer posible?")).toBeVisible();
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
  await expect(page.getByTestId("technology-stage-label")).toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir menú" })).toBeVisible();
  const rail = page.getByTestId("track-rail");
  await rail.scrollIntoViewIfNeeded();
  await expect.poll(() => rail.locator('[data-track="create"]').evaluate((card) => getComputedStyle(card).transform)).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
  const manifesto = page.getByTestId("author-manifesto");
  await manifesto.scrollIntoViewIfNeeded();
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-sequence-mode", "reduced");
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-film-status", "reduced");
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-sequence-state", "closing");
  await expect(manifesto.locator("video[data-personal-film]")).toHaveCount(0);
  await expect(manifesto.getByRole("heading", { level: 2 })).toBeVisible();
  await expect(manifesto.getByText("Trabajo entre diseño, producto y sistemas", { exact: false })).toBeVisible();
  await expect(manifesto.getByText("Proyectos con algo propio que proteger", { exact: false })).toBeVisible();
  expect(pageErrors).toEqual([]);
  await context.close();
});

test("presenta movimiento reducido en escritorio sin superponer el manifiesto", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  await page.goto("/#perfil");
  const manifesto = page.getByTestId("author-manifesto");
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-film-status", "reduced");
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-sequence-state", "closing");
  await expect(manifesto.locator("video[data-personal-film]")).toHaveCount(0);
  await expect(manifesto.getByRole("heading", { level: 2 })).toBeVisible();
  await expect(manifesto.getByText("Trabajo entre diseño, producto y sistemas", { exact: false })).toBeVisible();
  await expect(manifesto.getByText("Proyectos con algo propio que proteger", { exact: false })).toBeVisible();
  await expect.poll(async () => manifesto.evaluate((section) => {
    const heading = section.querySelector("h2")?.getBoundingClientRect();
    const body = [...section.querySelectorAll("p")]
      .find((paragraph) => paragraph.textContent?.startsWith("Trabajo entre diseño"))
      ?.getBoundingClientRect();
    return Boolean(heading && body && heading.bottom <= body.top);
  })).toBe(true);
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
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
  await expect(heading).toContainText("Creo lo que una idea necesita");
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

test("monta los MP4 locales de forma diferida en las cinco escenas", async ({ page }) => {
  const integrations = [
    { path: "/", assets: [{ id: "nucleo-decision", source: "graphite-desktop.mp4" }, { id: "apertura-protegida", source: "minimalist-desktop.mp4" }] },
    { path: "/sistemas", assets: [{ id: "cinta-continuidad", source: "minimalist-desktop.mp4" }] },
    { path: "/estudio", assets: [{ id: "telar-pulso", source: "graphite-desktop.mp4" }] },
    { path: "/casos-de-exito", assets: [{ id: "archivo-estratos", source: "minimalist-desktop.mp4" }] },
    { path: "/aplicar", assets: [{ id: "apertura-protegida", source: "minimalist-desktop.mp4" }] },
  ] as const;

  for (const integration of integrations) {
    await page.goto(integration.path);
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

test("cruza el fondo abstracto con el tema y mantiene Perfil oscuro", async ({ page }) => {
  await page.goto("/");
  const nucleus = page.locator('[data-motion-asset="nucleo-decision"]');
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
  const manifesto = page.getByTestId("author-manifesto");
  await expect.poll(() => manifesto.evaluate((section) => getComputedStyle(section).backgroundColor)).toBe("rgb(5, 6, 7)");
  await expect.poll(() => manifesto.evaluate((section) => getComputedStyle(section).color)).toBe("rgb(243, 240, 232)");
});

test("mantiene posters estaticos sin montar videos con movimiento reducido", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (const { path, asset } of [
    { path: "/", asset: "nucleo-decision" },
    { path: "/sistemas", asset: "cinta-continuidad" },
    { path: "/estudio", asset: "telar-pulso" },
    { path: "/casos-de-exito", asset: "archivo-estratos" },
    { path: "/aplicar", asset: "apertura-protegida" },
  ]) {
    await page.goto(path);
    const backdrop = page.locator(`[data-motion-asset="${asset}"]`);
    await expect(backdrop).toHaveCount(1);
    await backdrop.scrollIntoViewIfNeeded();
    await expect(backdrop.locator("img").first()).toBeAttached();
    await expect(page.locator("[data-motion-video]")).toHaveCount(0);
  }

  await context.close();
});

test("pausa fuera del viewport y conserva una sola reproducción simultánea", async ({ page }) => {
  await page.goto("/");
  const nucleus = page.locator('[data-motion-asset="nucleo-decision"]');
  await nucleus.scrollIntoViewIfNeeded();
  const nucleusVideo = nucleus.locator("video[data-motion-video]");
  await expect(nucleus).toHaveAttribute("data-motion-video-status", "ready");
  await expect.poll(() => nucleusVideo.evaluate((video) => !(video as HTMLVideoElement).paused)).toBe(true);

  const opening = page.locator('[data-motion-asset="apertura-protegida"]');
  await opening.scrollIntoViewIfNeeded();
  await expect(opening).toHaveAttribute("data-motion-video-status", "ready");
  await expect.poll(() => nucleusVideo.evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);
  const playingVideos = await page.locator("[data-motion-video]").evaluateAll((videos) =>
    videos.filter((video) => !(video as HTMLVideoElement).paused).length,
  );
  expect(playingVideos).toBeLessThanOrEqual(1);
});

test("usa Camera solo para Apertura móvil", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto("/aplicar");
  const opening = page.locator('[data-motion-asset="apertura-protegida"]');
  await opening.scrollIntoViewIfNeeded();
  await expect(opening).toHaveAttribute("data-motion-video-status", "ready");
  await expect(opening.locator("video source[type='video/mp4']")).toHaveAttribute("src", /camera-mobile\.mp4$/);

  await page.goto("/estudio");
  const pulse = page.locator('[data-motion-asset="telar-pulso"]');
  await pulse.scrollIntoViewIfNeeded();
  await expect(pulse).toHaveAttribute("data-motion-video-status", "ready");
  await expect(pulse.locator("video source[type='video/mp4']")).toHaveAttribute("src", /graphite-mobile\.mp4$/);
  await context.close();
});

test("recupera el poster si falla un MP4 local", async ({ page }) => {
  await page.route("**/motion/previews/graphite-desktop.mp4", (route) => route.abort("failed"));
  await page.goto("/");
  const nucleus = page.locator('[data-motion-asset="nucleo-decision"]');
  await nucleus.scrollIntoViewIfNeeded();
  await expect(nucleus).toHaveAttribute("data-motion-video-status", "fallback");
  await expect(nucleus.locator("[data-motion-video]")).toHaveCount(0);
  await expect(nucleus.locator("picture img").first()).toBeAttached();
});

test("publica canonical, hreflang, OG, JSON-LD y sitemap canónicos", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mmorera.agency");
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute("href", "https://mmorera.agency");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://mmorera.agency/en");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Mario Morera");
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(jsonLd["@type"]).toBe("Person");
  expect(jsonLd.url).toBe("https://mmorera.agency");
  expect(jsonLd.homeLocation).toBeUndefined();
  expect(jsonLd.sameAs).toBeUndefined();
  expect(await page.content()).not.toMatch(/Uruguay|es-UY|es_UY/);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  await expect(sitemap.text()).resolves.toContain("https://mmorera.agency/en/casos-de-exito/autohub-360");
});
