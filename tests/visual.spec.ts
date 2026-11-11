import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const shotDir = path.join(process.cwd(), "test-results", "screenshots");

async function shot(page: import("@playwright/test").Page, name: string) {
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({ path: path.join(shotDir, `${name}.png`), fullPage: false });
}

test.describe("The P Story royal redesign", () => {
  test("home: hero, doors, events, blessing, countdown", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".top-garland")).toHaveCount(0);
    await expect(page.locator(".invite-frame")).toBeVisible();
    await expect(page.locator(".hero__names")).toContainText("Parth");
    await expect(page.locator(".hero__names")).toContainText("Prerna");
    await expect(page.locator(".hero__place")).toContainText("Jabalpur, Madhya Pradesh");
    await expect(page.locator(".wisteria-canopy").first()).toBeVisible();
    await shot(page, "01-hero");

    await page.locator("#invitation").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(page.locator(".door-frame")).toBeVisible();
    const door = await page.locator(".door-frame").boundingBox();
    expect(door!.width).toBeGreaterThan(480);
    await shot(page, "02-door-closed");

    await page.evaluate(() => {
      const scene = document.querySelector(".door-scene") as HTMLElement;
      window.scrollTo(0, scene.offsetTop + scene.offsetHeight * 0.5);
    });
    await page.waitForTimeout(500);
    await shot(page, "03-door-open");

    await page.locator("#events").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(page.getByText("Lagoon")).toBeVisible();
    await expect(page.getByText("Surya Resort").first()).toBeVisible();
    await expect(page.getByText("Phoolon Ki Haldi")).toBeVisible();
    await expect(page.getByText("Sangeet")).toBeVisible();
    await expect(page.getByText("Baraat & Vivah")).toBeVisible();
    await shot(page, "04-events");

    await page.locator("#blessing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.getByText("Blessings for a Beautiful Beginning")).toBeVisible();
    await shot(page, "05-blessing");

    await page.locator("#countdown-section").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.locator("[data-days]")).toBeVisible();
    await shot(page, "06-countdown");
  });

  test("rsvp + greeting pages", async ({ page }) => {
    await page.goto("/rsvp.html");
    await page.waitForLoadState("networkidle");
    const panel = page.locator(".rsvp__panel");
    await expect(panel).toBeVisible();
    expect((await panel.boundingBox())!.y).toBeLessThan(180);
    await expect(page.getByLabel("Your full name")).toBeVisible();
    await shot(page, "07-rsvp");

    await page.goto("/greeting.html");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "A Little Voice From The Past" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Tap to Hear/i })).toBeVisible();
    await expect(page.locator(".greeting__qr")).toBeVisible();
    await shot(page, "08-greeting");
  });

  test("mobile hero", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".invite-frame")).toBeVisible();
    await expect(page.locator(".hero__names")).toBeVisible();
    await shot(page, "09-mobile-hero");
  });
});
