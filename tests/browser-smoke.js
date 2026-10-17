async (page) => {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const previewUrl = page.url().startsWith("http://127.0.0.1:")
    ? page.url()
    : "http://127.0.0.1:5173";
  const futureDate = (days) =>
    new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
  const checkIn = futureDate(30),
    checkOut = futureDate(32),
    laterCheckIn = futureDate(35);
  await page.goto(previewUrl);
  await page.locator(".stay-card").first().waitFor();
  assert((await page.locator(".stay-card").count()) === 4, "Initial room list");
  await page
    .getByRole("button", { name: "Save Oceanfront Villa", exact: true })
    .click();
  assert(
    (await page
      .getByRole("button", { name: "Save Oceanfront Villa", exact: true })
      .getAttribute("aria-pressed")) === "true",
    "Favorite toggles",
  );
  await page.reload();
  assert(
    (await page
      .getByRole("button", { name: "Save Oceanfront Villa", exact: true })
      .getAttribute("aria-pressed")) === "true",
    "Favorite persists",
  );
  await page.locator("#show-saved").click();
  assert((await page.locator(".stay-card").count()) === 1, "Saved filter");
  await page.locator("#show-saved").click();
  await page.locator('[data-category="family"]').click();
  assert((await page.locator(".stay-card").count()) === 1, "Family filter");
  await page.locator('[data-category="all"]').click();
  await page.locator("#open-filters").click();
  await page.locator("#max-price").fill("5000");
  await page
    .locator("#filter-form")
    .getByRole("button", { name: "Show stays" })
    .click();
  assert((await page.locator(".stay-card").count()) === 2, "Price filter");
  await page.locator("#open-filters").click();
  await page.locator("#clear-filter-dialog").click();
  await page
    .locator("#filter-form")
    .getByRole("button", { name: "Show stays" })
    .click();
  await page
    .getByRole("button", { name: "Explore Oceanfront Villa", exact: true })
    .click();
  assert(await page.locator("#stay-dialog").isVisible(), "Room details open");
  await page.locator("#prepare-inquiry").click();
  await page.locator("#inquiry-in").fill(checkIn);
  await page.locator("#inquiry-out").fill(checkOut);
  await page.locator("#inquiry-guests").fill("2");
  await page
    .locator("#inquiry-form")
    .getByRole("button", { name: "Preview my stay" })
    .click();
  assert(
    (await page.locator("#inquiry-summary").innerText()).includes("₱13,000"),
    "Sample subtotal",
  );
  assert(
    await page
      .locator("#summary-heading")
      .evaluate((el) => el === document.activeElement),
    "Summary receives focus",
  );
  const downloadEvent = page.waitForEvent("download");
  await page.locator("#download-inquiry").click();
  const download = await downloadEvent;
  assert(
    download.suggestedFilename() === "hansys-sample-stay-plan.txt",
    "Download plan",
  );
  await page.locator("#edit-inquiry").click();
  await page.locator("#inquiry-in").fill(laterCheckIn);
  await page.locator("#inquiry-in").press("Tab");
  assert(
    (await page.locator("#inquiry-out").inputValue()) === "",
    "Changing check-in clears stale checkout",
  );
  await page.keyboard.press("Escape");
  await page.locator("#check-in").fill(checkIn);
  await page.locator("#check-out").fill(checkOut);
  await page.locator("#guests").selectOption("6");
  await page
    .locator("#booking")
    .getByRole("button", { name: "Search stays" })
    .click();
  assert(
    (await page.locator(".stay-card").count()) === 1,
    "Guest capacity search",
  );
  await page.locator("#open-gallery").click();
  assert(
    (await page.locator("#gallery-grid figure").count()) === 5,
    "Gallery opens",
  );
  await page.keyboard.press("Escape");
  await page.reload();
  await page
    .getByRole("button", { name: "Save Oceanfront Villa", exact: true })
    .click();
  await page.reload();
  await page
    .getByRole("heading", { name: "A little escape. A lot to love." })
    .click();
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.screenshot({
    path: "output/playwright/desktop.png",
    fullPage: true,
  });
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No page overflow at ${width}px`,
    );
    if (width === 390)
      await page.screenshot({
        path: "output/playwright/mobile.png",
        fullPage: true,
      });
  }
  assert(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every((img) => img.complete && img.naturalWidth > 0),
      ),
    "All local images load",
  );
  await page.setViewportSize({ width: 1440, height: 1050 });
  return "PASS: categories, price filters, favorites persistence, room details, inquiry subtotal, focus, download, date change, guest search, gallery, images, and responsive widths 320/390/768/1440.";
};
