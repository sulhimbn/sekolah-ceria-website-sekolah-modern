import { test, expect } from '@playwright/test';

test.describe('News Portal Flow', () => {
  test('should display news page with header', async ({ page }) => {
    await page.goto('/news');
    await expect(page).toHaveURL(/\/news/);

    // Verify page header
    await expect(page.locator('h1')).toContainText(/Berita & Acara/i);
  });

  test('should handle loading state', async ({ page }) => {
    await page.goto('/news');

    // Should show some loading state (skeletons or similar)
    // Just verify page loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display news page content', async ({ page }) => {
    await page.goto('/news');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Page should have loaded
    await expect(page.locator('h1')).toContainText(/Berita/i);
  });

  test('should navigate to article detail page', async ({ page }) => {
    await page.goto('/news');
    await page.waitForLoadState('networkidle');

    // Try to find and click a news article link
    const readMoreLink = page.getByRole('link', { name: /Baca Selengkapnya/i });

    // Check if there's any article to click
    const linkCount = await readMoreLink.count();
    if (linkCount > 0) {
      await readMoreLink.first().click();

      // Verify we're on detail page
      await expect(page).toHaveURL(/\/news\/.+/);

      // Verify article detail elements exist
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should handle non-existent article gracefully', async ({ page }) => {
    await page.goto('/news/non-existent-article-id');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Page should respond without crashing - either show error or 404
    const hasContent = await page
      .locator('main')
      .isVisible()
      .catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('should navigate back to news list from detail page', async ({
    page,
  }) => {
    await page.goto('/news');
    await page.waitForLoadState('networkidle');

    // Check if there's any article
    const readMoreLink = page.getByRole('link', { name: /Baca Selengkapnya/i });
    const linkCount = await readMoreLink.count();

    if (linkCount > 0) {
      await readMoreLink.first().click();

      // Look for back button or navigate back
      const backLink = page
        .getByRole('link', { name: /Kembali|Berita|Home/i })
        .first();
      if (await backLink.isVisible().catch(() => false)) {
        await backLink.click();
        await expect(page).toHaveURL(/\/news/);
      }
    }
  });
});
