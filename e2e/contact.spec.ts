import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/\/contact/);
  });

  test('should display contact page with form', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText(/Hubungi Kami/i);

    // Verify form fields exist
    await expect(page.getByLabel(/Nama Lengkap/i)).toBeVisible();
    await expect(page.getByLabel(/Alamat Email/i)).toBeVisible();
    await expect(page.getByLabel(/Pesan Anda/i)).toBeVisible();

    // Verify submit button
    await expect(
      page.getByRole('button', { name: /Kirim Pesan/i })
    ).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({
    page,
  }) => {
    // Click submit without filling fields
    await page.getByRole('button', { name: /Kirim Pesan/i }).click();

    // Check for validation error messages
    await expect(page.getByText(/Nama harus diisi/i)).toBeVisible();
    await expect(page.getByText(/email tidak valid/i)).toBeVisible();
    await expect(page.getByText(/Pesan harus diisi/i)).toBeVisible();
  });

  test('should show validation error for short name', async ({ page }) => {
    await page.getByLabel(/Nama Lengkap/i).fill('A');
    await page.getByLabel(/Alamat Email/i).fill('test@example.com');
    await page
      .getByLabel(/Pesan Anda/i)
      .fill('This is a valid test message that is long enough.');

    await page.getByRole('button', { name: /Kirim Pesan/i }).click();

    // Should show error for name being too short
    await expect(page.getByText(/minimal 2 karakter/i)).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel(/Nama Lengkap/i).fill('John Doe');
    await page.getByLabel(/Alamat Email/i).fill('not-an-email');
    await page
      .getByLabel(/Pesan Anda/i)
      .fill('This is a valid test message that is long enough.');

    await page.getByRole('button', { name: /Kirim Pesan/i }).click();

    // Should show error for invalid email
    await expect(page.getByText(/email tidak valid/i)).toBeVisible();
  });

  test('should show validation error for short message', async ({ page }) => {
    await page.getByLabel(/Nama Lengkap/i).fill('John Doe');
    await page.getByLabel(/Alamat Email/i).fill('test@example.com');
    await page.getByLabel(/Pesan Anda/i).fill('Short');

    await page.getByRole('button', { name: /Kirim Pesan/i }).click();

    // Should show error for message being too short
    await expect(page.getByText(/Pesan harus diisi/i)).toBeVisible();
  });

  test('should successfully submit valid form', async ({ page }) => {
    await page.getByLabel(/Nama Lengkap/i).fill('John Doe');
    await page.getByLabel(/Alamat Email/i).fill('john.doe@example.com');
    await page
      .getByLabel(/Pesan Anda/i)
      .fill(
        'This is a test message for the contact form. It should be long enough to pass validation.'
      );

    // Submit form
    await page.getByRole('button', { name: /Kirim Pesan/i }).click();

    // Should show loading state
    await expect(page.getByText(/Mengirim/i)).toBeVisible();

    // Should show success message (toast)
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({
      timeout: 10000,
    });
  });

  test('should display contact information', async ({ page }) => {
    // Check contact info is displayed
    await expect(page.getByText(/info@sekolahceria.sch.id/i).first()).toBeVisible();
    await expect(page.getByText(/\(021\) 123-4567/i).first()).toBeVisible();
    await expect(page.getByText(/Jl\. Pendidikan/i).first()).toBeVisible();

    // Check operational hours
    await expect(page.getByText(/Senin - Jumat/i)).toBeVisible();
  });
});
