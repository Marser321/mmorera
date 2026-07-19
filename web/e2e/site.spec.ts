import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";

test("navega por la cabecera y conserva un único canvas", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Convierto ideas con carácter");
  await expect(page.locator("canvas")).toHaveCount(1);
  const technologyLabel = page.getByTestId("technology-stage-label");
  await expect(technologyLabel).toContainText("Figma");
  await expect(technologyLabel).toContainText("Dirección visual");
  await page.locator("canvas").evaluate((canvas) => { canvas.dataset.e2ePersistent = "true"; });
  await page.getByRole("button", { name: /Construir 02/ }).click();
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
  await expect(technologyLabel).toContainText("Next.js");
  await expect(technologyLabel).toContainText("Construir");
  await expect(page.locator('canvas[data-e2e-persistent="true"]')).toHaveCount(1);
  await expect(page.locator("a button")).toHaveCount(0);
  const systemsLink = page.locator('header a[href="/sistemas"]');
  await expect(systemsLink).toHaveAttribute("href", "/sistemas");
  await systemsLink.focus();
  await systemsLink.press("Enter");
  await expect(page).toHaveURL(/\/sistemas$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("continuidad operativa");
  await expect(page.locator('canvas[data-e2e-persistent="true"]')).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test("prioriza capacidades en home y mantiene los casos en el archivo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('main a[href^="/casos-de-exito/"]')).toHaveCount(0);
  await expect(page.getByText("Los mejores casos todavía están entrando.")).toBeVisible();
  const manifesto = page.getByTestId("author-manifesto");
  await expect(manifesto).toHaveCount(1);
  await expect(manifesto.getByRole("heading", { level: 2 })).toContainText("No elegí entre crear");
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
  await expect(page.getByText("Demos de capacidad")).toBeVisible();
  await expect(page.getByText("Seis casos principales")).toHaveCount(0);
  // Reel: seis destacados con visor de demo en vivo; archivo: siete casos con página propia.
  await expect(page.getByRole("button", { name: /Ver demo en vivo/ })).toHaveCount(6);
  await expect(page.locator('main a[href^="/casos-de-exito/"]')).toHaveCount(7);
});

test("bloquea una tecnología contextual en sistemas y estudio", async ({ page }) => {
  await page.goto("/sistemas");
  await expect(page.getByText("Tecnología contextual")).toBeVisible();
  await expect(page.getByText("n8n", { exact: true })).toBeVisible();

  await page.goto("/estudio");
  await expect(page.getByText("Figma", { exact: true })).toBeVisible();
});

test("cambia idioma y mantiene el modo elegido en la URL", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Construir 02/ }).click();
  await expect(page).toHaveURL(/\?modo=construir$/);
  await page.getByRole("button", { name: "en", exact: true }).click();
  await expect(page).toHaveURL(/\/en\?modo=construir$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I turn ideas with character");
  await expect(page.getByTestId("technology-stage-label")).toContainText("One practice");
  await expect(page.getByTestId("technology-stage-label")).toContainText("Build");
  await expect(page.getByTestId("author-manifesto").getByRole("heading", { level: 2 })).toContainText("I didn’t choose between creating");
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
    window.scrollTo(0, section.offsetTop);
  });
  await expect(portrait).toHaveAttribute("data-sequence-mode", "mobile");
  await expect(portrait).toHaveAttribute("data-film-status", "ready");
  await expect(manifesto.locator("video source[type^='video/webm']")).toHaveAttribute("src", /author-film-mobile\.webm$/);
  await expect.poll(async () => {
    await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>("[data-film-track]");
      if (!track) return;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.98);
    });
    return Number(await portrait.getAttribute("data-film-time"));
  }).toBeGreaterThan(13.9);
  await expect(portrait).toHaveAttribute("data-sequence-state", "closing");
  await expect(portrait).toBeInViewport();
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
  await page.getByLabel("Nombre Completo").fill("QA Mario");
  await page.getByLabel("Correo Electrónico").fill("qa@example.com");
  await page.getByRole("button", { name: /NEXT/ }).click();
  await page.getByLabel("Nombre de la Empresa").fill("QA Studio");
  await page.getByRole("button", { name: "Pre-revenue / Early Stage" }).click();
  await page.getByRole("button", { name: /NEXT/ }).click();
  await page.getByLabel("¿Cuál es tu mayor cuello de botella operativo?").fill("Necesitamos conectar producto, CRM y seguimiento comercial.");
  await page.getByRole("button", { name: /NEXT/ }).click();
  await page.getByRole("button", { name: "Solo explorando opciones" }).click();
}

test("muestra el estado exitoso del brief", async ({ page }) => {
  await page.goto("/aplicar");
  await completeBrief(page);
  await page.getByRole("button", { name: /ENVIAR BRIEF/ }).click();
  await expect(page.getByRole("heading", { name: "Brief Recibido" })).toBeVisible();
});

test("muestra un error recuperable si falla el envío", async ({ page }) => {
  await page.route("**/aplicar", async (route) => {
    if (route.request().method() === "POST") await route.abort("failed");
    else await route.continue();
  });
  await page.goto("/aplicar");
  await completeBrief(page);
  await page.getByRole("button", { name: /ENVIAR BRIEF/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No pude enviar el brief" })).toBeVisible();
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
  const manifesto = page.getByTestId("author-manifesto");
  await manifesto.scrollIntoViewIfNeeded();
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-sequence-mode", "reduced");
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-film-status", "reduced");
  await expect(manifesto.getByRole("img")).toHaveAttribute("data-sequence-state", "closing");
  await expect(manifesto.locator("video[data-personal-film]")).toHaveCount(0);
  await expect(manifesto.getByRole("heading", { level: 2 })).toBeVisible();
  await expect(manifesto.getByText("Después de años convirtiendo visiones", { exact: false })).toBeVisible();
  await expect(manifesto.getByText("Trabajo con ideas que tienen algo que proteger", { exact: false })).toBeVisible();
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
  await expect(manifesto.getByText("Después de años convirtiendo visiones", { exact: false })).toBeVisible();
  await expect(manifesto.getByText("Trabajo con ideas que tienen algo que proteger", { exact: false })).toBeVisible();
  await expect.poll(async () => manifesto.evaluate((section) => {
    const heading = section.querySelector("h2")?.getBoundingClientRect();
    const body = [...section.querySelectorAll("p")]
      .find((paragraph) => paragraph.textContent?.startsWith("Después de años"))
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
  const toggle = page.getByRole("button", { name: "Cambiar a modo claro" });
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
  await expect(heading).toContainText("Convierto ideas con carácter");
  const headingColor = await heading.evaluate((node) => getComputedStyle(node).color);
  expect(headingColor).not.toBe("rgb(243, 240, 232)");

  // Anti-FOUC: tras recargar, la clase light ya está aplicada.
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
  await expect(page.locator("canvas")).toHaveCount(1);

  // Vuelta a oscuro desde el mismo control.
  await page.getByRole("button", { name: "Cambiar a modo oscuro" }).click();
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

  await page.getByRole("button", { name: "Cambiar a modo claro" }).click();
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
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://mmorera.agency/en");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Mario Morera");
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(jsonLd["@type"]).toBe("Person");
  expect(jsonLd.url).toBe("https://mmorera.agency");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  await expect(sitemap.text()).resolves.toContain("https://mmorera.agency/en/casos-de-exito/autohub-360");
});
