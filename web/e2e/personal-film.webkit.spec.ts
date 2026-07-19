import { expect, test } from "@playwright/test";

test("Safari mÃ³vil presenta la pelÃ­cula completa y permite volver atrÃ¡s", async ({ page }) => {
  await page.goto("/");
  const manifesto = page.getByTestId("author-manifesto");
  const portrait = manifesto.getByRole("img");
  const film = manifesto.locator("video[data-personal-film]");

  await manifesto.scrollIntoViewIfNeeded();
  await expect(portrait).toHaveAttribute("data-sequence-mode", "mobile");
  await expect(manifesto.locator("video source[type='video/mp4']")).toHaveAttribute("src", /author-film-mobile\.mp4$/);
  await expect(manifesto.locator("video source[type^='video/webm']")).toHaveCount(0);
  await expect(portrait).toHaveAttribute("data-film-status", "ready", { timeout: 8_000 });

  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>("[data-film-track]");
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.965);
  });
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(13.9);
  await expect.poll(async () => Number(await portrait.getAttribute("data-film-rendered-time"))).toBeGreaterThan(13.9);

  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>("[data-film-track]");
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, trackTop + (track.offsetHeight - window.innerHeight) * 0.24);
  });
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeLessThan(4);
  await expect(portrait).toBeInViewport();
});
