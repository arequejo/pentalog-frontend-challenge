import { test, expect } from '@playwright/test';

test('Search for an artist and their releases', async ({ page }) => {
  await page.goto('/');

  // Search for a band
  const searchBar = page.locator('input[name="search"]');
  await searchBar.type('ghost');
  await searchBar.press('Enter');
  const cover = await page.locator('img').first();
  await expect(cover).toHaveAttribute('alt', /ghost/i);

  // Check releases before and after clicking "Load more"
  const releases = await page.locator('[data-testid="releases"]');
  const covers = await releases.locator('img');
  await expect(covers).toHaveCount(5);
  const loadMore = await page.locator('button:has-text("Load more")');
  await loadMore.click();
  await expect(covers).toHaveCount(10);

  // Search for a different artist
  await searchBar.selectText();
  await searchBar.press('Backspace');
  await searchBar.type('iron maiden');
  await searchBar.press('Enter');
  await expect(cover).toHaveAttribute('alt', /iron maiden/i);

  // Refresh page to check history and select first entry
  await page.reload();
  const history = page.locator('button:has-text("ghost")');
  await history.click();
  await expect(searchBar).toHaveValue('ghost');
  await expect(cover).toHaveAttribute('alt', /ghost/i);
});
