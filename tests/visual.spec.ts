import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const shotDir = path.join(process.cwd(), "test-results", "screenshots");

async function shot(page: import("@playwright/test").Page, name: string) {
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({ path: path.join(shotDir, `${name}.png`), fullPage: false });
}

test.describe("The P Story royal redesign", () => {
  test("landing: Idha audio invite then go to invite", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /Special Invite from Our Little Idha/i })).toBeVisible();
    await expect(page.locator("#idha-audio")).toHaveCount(1);
    await expect(page.locator("#idha-unlock")).toBeVisible();
    await expect(page.locator("#idha-play")).toHaveText(/Hear Idha/i);
    await expect(page.getByText("Save the Date")).toBeVisible();
    await expect(page.getByText("12 December 2026")).toBeVisible();
    await expect(page.getByRole("link", { name: /^Go to Invite$/i })).toHaveAttribute("href", "/invite/");
    await shot(page, "00-landing");

    // Browsers block unmuted autoplay — dismiss tap-to-hear, then continue
    await page.locator("#idha-unlock").click();
    await expect(page.locator("#idha-unlock")).toBeHidden();
    await page.getByRole("link", { name: /^Go to Invite$/i }).click();
    await page.waitForURL(/\/invite\/?$/);
    await expect(page.locator(".door-scene--auto")).toBeVisible();
  });

  test("invite: doors, events, blessing, countdown", async ({ page }) => {
    await page.goto("/invite/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".top-garland")).toHaveCount(0);
    await expect(page.locator(".door-scene--auto")).toBeVisible();
    await expect(page.locator(".door-frame__fan")).toBeVisible();
    await expect(page.locator(".hero__names")).toContainText("Parth");
    await expect(page.locator(".hero__names")).toContainText("Prerna");
    await expect(page.locator(".hero__programme-link")).toHaveAttribute("href", "#events");
    await shot(page, "01-doors");

    await page.waitForTimeout(1600);
    await expect(page.locator(".door-scene--auto")).toHaveClass(/is-open/);
    await shot(page, "02-door-open");

    await expect(page.locator(".invite-frame--art-only")).toBeVisible();
    await expect(page.locator("footer.site-footer")).toHaveCount(0);

    await page.locator("#events").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(page.getByText(/satsang and get together in Jammu/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Satsang" })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Haldi" })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Sangeet & Mehandi" })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Saant" })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Reception of Barat" })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Dinner" })).toHaveCount(1);
    await expect(page.getByRole("link", { name: /View on map/i }).first()).toBeVisible();
    await expect(page.getByText(/Vilagio/i).first()).toBeVisible();
    await shot(page, "04-events");

    await page.locator("#blessing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.getByRole("heading", { name: "Blessings for a Beautiful Beginning" })).toBeVisible();
    await expect(page.locator("#blessing")).not.toContainText("Pushpa Rani");
    await expect(page.locator("#blessing a[href='../rsvp.html']")).toBeVisible();
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

  test("mobile landing + invite doors", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#idha-play")).toBeVisible();
    await shot(page, "09-mobile-landing");

    await page.goto("/invite/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".door-scene--auto")).toBeVisible();
    await expect(page.locator(".hero__names")).toBeVisible();
    await shot(page, "10-mobile-invite");
  });
});
