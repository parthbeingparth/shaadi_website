import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const shotDir = path.join(process.cwd(), "test-results", "screenshots");

async function shot(page: import("@playwright/test").Page, name: string) {
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({
    path: path.join(shotDir, `${name}.png`),
    fullPage: false,
  });
}

test.describe("The P Story visual QA", () => {
  test("home sections: no top garland, dense hero, door, events, closing", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Top wisteria removed
    await expect(page.locator(".top-garland")).toHaveCount(0);

    const card = page.locator(".invite-card");
    await expect(card).toBeVisible();
    const inviteImg = page.locator(".invite-card__art img");
    await expect(inviteImg).toHaveAttribute("src", /invite-peacocks\.jpg/);

    const cardBox = await card.boundingBox();
    expect(cardBox).toBeTruthy();
    expect(cardBox!.height).toBeGreaterThan(500);
    expect(cardBox!.width).toBeGreaterThan(400);

    await expect(page.getByRole("heading", { name: "The P Story" }).first()).toBeVisible();
    await expect(page.locator(".hero__names")).toContainText("Parth");
    await expect(page.locator(".hero__names")).toContainText("Prerna");

    await shot(page, "01-hero");

    await page.locator("#invitation").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const door = page.locator(".door-frame");
    await expect(door).toBeVisible();
    const doorBox = await door.boundingBox();
    expect(doorBox).toBeTruthy();
    expect(doorBox!.width).toBeGreaterThan(500);
    expect(doorBox!.height).toBeGreaterThan(500);
    await expect(page.locator(".peacock")).toHaveCount(0);

    await shot(page, "02-door-closed");

    await page.evaluate(() => {
      const scene = document.querySelector(".door-scene") as HTMLElement;
      const mid = scene.offsetTop + scene.offsetHeight * 0.45;
      window.scrollTo(0, mid);
    });
    await page.waitForTimeout(500);
    await shot(page, "03-door-open");

    await page.locator("#events").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.locator(".events__panel")).toBeVisible();
    await expect(page.getByText("Haldi & Sangeet")).toBeVisible();
    await expect(page.getByText("Vivah & Reception")).toBeVisible();
    await shot(page, "04-events");

    await page.locator("#blessing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.getByText("A blessing")).toBeVisible();
    await expect(page.getByText("Until we meet")).toBeVisible();
    await shot(page, "05-closing");
  });

  test("RSVP page: form sits high, no top garland", async ({ page }) => {
    await page.goto("/rsvp.html");
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".top-garland")).toHaveCount(0);

    const panel = page.locator(".rsvp__panel");
    await expect(panel).toBeVisible();
    await expect(page.getByRole("heading", { name: "RSVP" })).toBeVisible();

    const box = await panel.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.y).toBeLessThan(160);
    expect(box!.width).toBeGreaterThan(480);

    await expect(page.getByLabel("Your full name")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send RSVP" })).toBeVisible();

    await shot(page, "06-rsvp");
  });
});
