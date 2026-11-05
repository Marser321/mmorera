import { expect, test, type Locator, type Page } from "@playwright/test";

/** Un toque real en el centro del elemento, como un dedo en la pantalla. */
async function tap(page: Page, target: Locator) {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
}

test.describe("Safari en iPad", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== "webkit", "estas fallas son propias de Safari con pantalla táctil");
  });

  const menus = [
    { menu: "Servicios", link: "Webs y landings", path: "/estudio" },
    { menu: "Servicios", link: "Agentes de IA", path: "/agentes" },
    { menu: "Servicios", link: "Automatización y CRM", path: "/sistemas" },
    { menu: "Servicios", link: "Contenido con IA", path: "/fabricas" },
    { menu: "Servicios", link: "Campañas con IA", path: "/campanas" },
    { menu: "Casos", link: "Casos de éxito", path: "/casos-de-exito" },
    { menu: "Casos", link: "Casos de uso", path: "/casos-de-uso" },
  ];

  for (const { menu, link, path } of menus) {
    test(`el menú ${menu} lleva a ${link} con un toque`, async ({ page }) => {
      await page.goto("/capacidades");
      const nav = page.getByRole("navigation", { name: "Navegación principal" });
      const item = nav.getByRole("link", { name: link });
      await expect(async () => {
        await tap(page, nav.getByRole("button", { name: menu }));
        await expect(item).toBeVisible({ timeout: 1_000 });
      }).toPass({ timeout: 20_000 });
      await tap(page, item);
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });
  }

  const doors = [
    { id: "web-ecommerce", path: "/estudio" },
    { id: "booking-payments", path: "/agentes" },
    { id: "crm-automation", path: "/sistemas" },
    { id: "ai-software", path: "/fabricas" },
  ];

  for (const { id, path } of doors) {
    test(`la puerta ${id} del home lleva a su servicio con un toque`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await page.locator("#servicios").scrollIntoViewIfNeeded();
      await tap(page, page.locator(`[data-door="${id}"]`));
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });
  }
});
