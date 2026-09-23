import { test, expect } from '@playwright/test';
import content from '../lib/generated-pages.json';
test('all routes hydrate without errors or overflow at each required width', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320,375,390,768,1024,1280,1440]) {
    await page.setViewportSize({ width, height:900 });
    for (const route of content.pages) {
      expect((await page.goto(route.path))?.status()).toBe(200);
      await expect(page.locator('.site-header')).toHaveClass(/enhanced/);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
test('navigation, filtering, mobile menu and reduced motion', async ({ page }) => {
  await page.goto('/technology');
  await page.getByLabel('Search technology').fill('SchoolView');
  await expect(page.locator('[data-library-item]:visible')).toHaveCount(1);
  await page.getByLabel('Search technology').fill('no-such-project');
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.getByRole('button',{name:'Clear filters'}).click();
  await expect(page.locator('[data-library-item]:visible')).toHaveCount(3);
  await page.getByRole('link',{name:'SchoolView',exact:true}).click();
  await expect(page).toHaveURL(/\/technology\/school-view$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/technology$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/technology\/school-view$/);
  await page.goBack();
  await page.setViewportSize({width:375,height:900});
  await page.getByRole('button',{name:/Menu/}).click();
  await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:/Menu/})).toBeFocused();
  await expect(page.getByRole('navigation',{name:'Main navigation'})).not.toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button',{name:/Menu/}).click();
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Mission',exact:true}).click();
  await expect(page).toHaveURL(/\/mission$/);
  await expect(page.locator('main')).toBeFocused();
});
for (const scenario of ['FIXTURE_RETRY','FIXTURE_TIMEOUT']) test('form preserves entries and safely retries '+scenario, async ({ page }) => {
  await page.goto('/apply');
  await page.getByRole('button',{name:'Send expression of interest'}).click();
  await expect(page.getByLabel('Full name')).toBeFocused();
  await page.getByLabel('Full name').fill('Synthetic Test');
  await page.getByLabel(/^Email/).fill('synthetic@example.com');
  await page.getByLabel('Your message').fill(scenario);
  const keys: string[] = [];
  page.on('request', request => { if (request.url().endsWith('/api/apply')) keys.push(request.headers()['idempotency-key']); });
  await page.getByRole('button',{name:'Send expression of interest'}).click();
  await expect(page.getByRole('status')).toContainText('could not confirm');
  await expect(page.getByLabel('Your message')).toHaveValue(scenario);
  await page.getByRole('button',{name:'Send expression of interest'}).click();
  await expect(page.getByRole('status')).toContainText('has been submitted');
  expect(keys).toHaveLength(2); expect(keys[0]).toBe(keys[1]);
});
test('prerendered content works without JavaScript; private files and unknown pages return 404', async ({ browser, request }) => {
  const context = await browser.newContext({javaScriptEnabled:false});
  const page = await context.newPage();
  for (const route of content.pages) {
    expect((await page.goto('http://127.0.0.1:5174' + route.path))?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).not.toBeEmpty();
  }
  await page.goto('http://127.0.0.1:5174/edplan');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('link', {name:'Open EdPlan.ai', exact:true})).toHaveAttribute('href','https://edplan.vercel.app/home');
  await expect(page.getByRole('link', {name:'Open EdPlan.ai', exact:true})).toBeVisible();
  await expect(page.locator('a[href="https://www.studentspace.ai/NNMC"]').first()).toBeVisible();
  for (const path of ['/not-a-route','/data/applications.json','/.env','/docs/release-checklist.md','/api/applications']) expect((await request.get(path)).status()).toBe(404);
  await context.close();
});
