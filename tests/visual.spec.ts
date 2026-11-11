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
  test("home sections: garland once, dense hero, door, events, closing", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Exactly one top garland
    const garlands = page.locator(".top-garland");
    await expect(garlands).toHaveCount(1);
    await expect(garlands.first()).toBeVisible();

    const garlandBox = await garlands.first().boundingBox();
    expect(garlandBox).toBeTruthy();
    expect(garlandBox!.width).toBeGreaterThan(1000);
    expect(garlandBox!.y).toBeLessThanOrEqual(2);

    // Invite card fills most of first viewport — peacocks asset (no full floral sheet)
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

    // Door section — large frame
    await page.locator("#invitation").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const door = page.locator(".door-frame");
    await expect(door).toBeVisible();
    const doorBox = await door.boundingBox();
    expect(doorBox).toBeTruthy();
    expect(doorBox!.width).toBeGreaterThan(500);
    expect(doorBox!.height).toBeGreaterThan(500);

    // No floating peacock corner crops
    await expect(page.locator(".peacock")).toHaveCount(0);

    await shot(page, "02-door-closed");

    // Mid-open doors via scroll through sticky scene
    await page.evaluate(() => {
      const scene = document.querySelector(".door-scene") as HTMLElement;
      const mid = scene.offsetTop + scene.offsetHeight * 0.45;
      window.scrollTo(0, mid);
    });
    await page.waitForTimeout(500);
    await shot(page, "03-door-open");

    // Events packed panel
    await page.locator("#events").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const panel = page.locator(".events__panel");
    await expect(panel).toBeVisible();
    await expect(page.getByText("Haldi & Sangeet")).toBeVisible();
    await expect(page.getByText("Vivah & Reception")).toBeVisible();
    await shot(page, "04-events");

    // Closing / blessing + countdown
    await page.locator("#blessing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.getByText("A blessing")).toBeVisible();
    await expect(page.getByText("Until we meet")).toBeVisible();
    await shot(page, "05-closing");
  });

  test("RSVP page: form sits high, single garland, no empty void", async ({
    page,
  }) => {
    await page.goto("/rsvp.html");
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".top-garland")).toHaveCount(1);

    const panel = page.locator(".rsvp__panel");
    await expect(panel).toBeVisible();
    await expect(page.getByRole("heading", { name: "RSVP" })).toBeVisible();

    const box = await panel.boundingBox();
    expect(box).toBeTruthy();
    // Panel should start near top (under nav), not mid-page empty cream
    expect(box!.y).toBeLessThan(160);
    expect(box!.width).toBeGreaterThan(480);

    await expect(page.getByLabel("Your full name")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send RSVP" })).toBeVisible();

    await shot(page, "06-rsvp");
  });
});
