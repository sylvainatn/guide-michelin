import { test, expect } from '@playwright/test';

test('test de base', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const title = await page.title();
    expect(title).toBe('Titre de l\'application');
});