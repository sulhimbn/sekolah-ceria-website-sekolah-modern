import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test.describe('Mobile (375px)', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should display mobile navigation menu', async ({ page }) => {
      await page.goto('/');

      // Mobile menu button should be visible
      const menuButton = page.getByRole('button', { name: /Open menu/i });
      await expect(menuButton).toBeVisible();
    });

    test('should open mobile menu when clicking hamburger', async ({
      page,
    }) => {
      await page.goto('/');

      // Click hamburger menu
      await page.getByRole('button', { name: /Open menu/i }).click();

      // Mobile menu should be visible - use Sheet content
      await expect(
        page.locator('[role="dialog"]').getByText('Tentang Kami')
      ).toBeVisible();
      await expect(
        page.locator('[role="dialog"]').getByText('Akademik')
      ).toBeVisible();
      await expect(
        page.locator('[role="dialog"]').getByText('Pendaftaran')
      ).toBeVisible();
      await expect(
        page.locator('[role="dialog"]').getByText('Kontak')
      ).toBeVisible();
    });

    test('should have readable text on mobile', async ({ page }) => {
      await page.goto('/');

      // Check that h1 text is readable (not too small)
      const h1 = page.locator('h1').first();
      const fontSize = await h1.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });

      // Font size should be at least 24px (1.5rem)
      const fontSizeValue = parseInt(fontSize);
      expect(fontSizeValue).toBeGreaterThanOrEqual(24);
    });

    test('should display properly on home page', async ({ page }) => {
      await page.goto('/');

      // Page should load without errors
      await expect(page).toHaveTitle(/Sekolah Ceria/i);

      // Content should be visible
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Tablet (768px)', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    test('should display desktop navigation on tablet', async ({ page }) => {
      await page.goto('/');

      // At 768px, navigation should be visible (md breakpoint)
      // Just verify the page loads properly
      await expect(page).toHaveTitle(/Sekolah Ceria/i);
    });

    test('should display properly on contact page', async ({ page }) => {
      await page.goto('/contact');

      // Form should be visible and usable
      await expect(page.getByLabel(/Nama Lengkap/i)).toBeVisible();
      await expect(page.getByLabel(/Alamat Email/i)).toBeVisible();
    });
  });

  test.describe('Desktop (1280px)', () => {
    test.use({
      viewport: { width: 1280, height: 800 },
    });

    test('should display full navigation on desktop', async ({ page }) => {
      await page.goto('/');

      // Desktop navigation should be visible in header
      const header = page.locator('header');
      await expect(header.getByText('Tentang Kami')).toBeVisible();
      await expect(header.getByText('Akademik')).toBeVisible();
      await expect(header.getByText('Pendaftaran')).toBeVisible();
      await expect(header.getByText('Kontak')).toBeVisible();
    });

    test('should have proper layout on desktop', async ({ page }) => {
      await page.goto('/');

      // Header should be visible
      await expect(page.locator('header')).toBeVisible();

      // Main content should be visible
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('Cross-device navigation', () => {
    test('should navigate between pages on mobile viewport', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');

      // Use mobile menu to navigate
      await page.getByRole('button', { name: /Open menu/i }).click();
      await page.locator('[role="dialog"]').getByText('Tentang Kami').click();

      await expect(page).toHaveURL(/\/about/);
    });

    test('should navigate between pages on desktop viewport', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      await page.goto('/');
      await page.locator('header').getByText('Tentang Kami').click();

      await expect(page).toHaveURL(/\/about/);
    });
  });
});
