import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
  test('should navigate from Home to About page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sekolah Ceria/i);

    // Click on "Tentang Kami" (About) link
    await page.click('text=Tentang Kami');

    // Verify URL changed
    await expect(page).toHaveURL(/\/about/);

    // Verify page content loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate from Home to Academics page', async ({ page }) => {
    await page.goto('/');

    // Click on "Akademik" (Academics) link
    await page.click('text=Akademik');

    // Verify URL changed
    await expect(page).toHaveURL(/\/academics/);

    // Verify page content loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate from Home to Admissions page', async ({ page }) => {
    await page.goto('/');

    // Click on "Pendaftaran" (Admissions) link
    await page.click('text=Pendaftaran');

    // Verify URL changed
    await expect(page).toHaveURL(/\/admissions/);

    // Verify page content loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate through full navigation flow', async ({ page }) => {
    // Start at Home
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Navigate to About
    await page.click('text=Tentang Kami');
    await expect(page).toHaveURL(/\/about/);

    // Navigate to Academics
    await page.click('text=Akademik');
    await expect(page).toHaveURL(/\/academics/);

    // Navigate to Admissions
    await page.click('text=Pendaftaran');
    await expect(page).toHaveURL(/\/admissions/);

    // Navigate to News
    await page.click('text=Berita');
    await expect(page).toHaveURL(/\/news/);

    // Navigate to Contact
    await page.click('text=Kontak');
    await expect(page).toHaveURL(/\/contact/);
  });

  test('should navigate back to Home via logo', async ({ page }) => {
    await page.goto('/about');

    // Click on logo to go back home
    await page.click('a[href="/"]');

    // Verify we're at home
    await expect(page).toHaveURL('/');
  });
});
