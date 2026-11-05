import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseUrl ?? "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: "**/._*",
  outputDir: "/tmp/mmorera-playwright-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "line",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: "chromium",
      testIgnore: ["**/._*", "**/tablet.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Safari en iPad: motor WebKit, sin mouse y con ancho de escritorio. Las
      // fallas de toque de T51 solo aparecían con esta combinación.
      name: "ipad",
      testMatch: "**/tablet.spec.ts",
      use: { ...devices["Desktop Safari"], viewport: { width: 1180, height: 820 }, hasTouch: true },
    },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "env RESEND_API_KEY= TELEGRAM_BOT_TOKEN= TELEGRAM_CHAT_ID= NEXT_PUBLIC_INSFORGE_URL= NEXT_PUBLIC_INSFORGE_ANON_KEY= npm run dev -- --webpack -p 3100",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
