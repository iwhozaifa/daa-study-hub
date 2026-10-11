// The per-person progress tracker: saved only in the visitor's browser, no login.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const BASE = '/daa-study-hub';
const TOPIC_4 = `${BASE}/docs/topics/04-insertion-sort`;
const PROGRESS = `${BASE}/docs/progress`;

// Stub the Cloudflare Web Analytics beacon so test runs don't count as visits.
const ANALYTICS = /cloudflareinsights\.com/;
test.beforeEach(({ page }) => page.route(ANALYTICS, (r) => r.fulfill({ contentType: 'text/javascript', body: '' })));

async function masterTopic4(page: Page) {
  await page.goto(TOPIC_4);
  const card = page.getByTestId('mastery-tracker');
  const mastered = card.getByRole('radio', { name: 'Mastered' });
  await expect(mastered).toBeDisabled();
  const boxes = card.getByRole('checkbox');
  await expect(boxes).toHaveCount(6);
  for (let i = 0; i < 6; i++) {
    await boxes.nth(i).click();
    if (i < 5) await expect(mastered).toBeDisabled();
  }
  await expect(mastered).toBeEnabled();
  await mastered.click();
  await card.getByRole('radio', { name: 'Worked example' }).click();
  await expect(card.locator('[data-status="mastered"]')).toBeVisible();
}

test('mastering a topic needs all six steps, and survives a reload', async ({ page }) => {
  await masterTopic4(page);
  await page.reload();
  const card = page.getByTestId('mastery-tracker');
  await expect(card.locator('[data-status="mastered"]')).toBeVisible();
  await expect(card.getByRole('radio', { name: 'Worked example' })).toHaveAttribute('aria-checked', 'true');

  // unticking a step drops it back to "in progress"
  await card.getByRole('checkbox').nth(2).click();
  await expect(card.locator('[data-status="in-progress"]')).toBeVisible();
});

test('progress shows on the dashboard and on the home page', async ({ page }) => {
  await masterTopic4(page);
  await page.goto(PROGRESS);
  await expect(page.getByTestId('mastered-count')).toHaveText('1');
  await expect(page.locator('[data-topic="04-insertion-sort"] [data-status="mastered"]')).toBeVisible();
  await page.goto(`${BASE}/`);
  await expect(page.getByTestId('topic-grid').locator('[data-status="mastered"]')).toHaveCount(1);
});

test('mock scores and mistakes can be logged and deleted', async ({ page }) => {
  await page.goto(`${BASE}/docs/practice/mock-midterm-b`);
  await page.getByLabel('Score / 50').fill('42');
  await page.getByLabel('Weak questions (optional)').fill('Q2b');
  await page.getByRole('button', { name: 'Log my score' }).click();
  await expect(page.getByRole('status')).toContainText('Saved');

  await page.goto(PROGRESS);
  await expect(page.getByTestId('mock-list')).toContainText('42 / 50');
  await expect(page.getByTestId('mock-list')).toContainText('Q2b');

  await page.getByLabel('What I did wrong').fill('Multiplied log n by n for a halving loop');
  await page.getByLabel('Why').fill('The passes shrink');
  await page.getByRole('button', { name: 'Add mistake' }).click();
  await expect(page.getByTestId('mistake-list')).toContainText('halving loop');

  await page.getByRole('button', { name: /Delete mistake/ }).click();
  await expect(page.getByTestId('mistake-list')).toHaveCount(0);
  await page.getByRole('button', { name: /Delete paper B score/ }).click();
  await expect(page.getByTestId('mock-list')).toHaveCount(0);
});

test('export, then import into a fresh browser, restores progress', async ({ page, browser }) => {
  await masterTopic4(page);
  await page.goto(PROGRESS);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export progress' }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^daa-progress-\d{4}-\d{2}-\d{2}\.json$/);
  const file = await download.path();

  // a different person / device starts empty
  const other = await (await browser.newContext()).newPage();
  await other.goto(PROGRESS);
  await expect(other.getByTestId('mastered-count')).toHaveText('0');

  other.on('dialog', (d) => d.accept());
  await other.getByTestId('import-input').setInputFiles(file);
  await expect(other.getByRole('status')).toHaveText('Progress imported.');
  await expect(other.getByTestId('mastered-count')).toHaveText('1');
  await other.context().close();
});

test('a broken file is rejected and reset erases everything', async ({ page }) => {
  await masterTopic4(page);
  await page.goto(PROGRESS);
  await page.getByTestId('import-input').setInputFiles({
    name: 'nope.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version": 1, "topics": "lol"}'),
  });
  await expect(page.getByRole('status')).toContainText('Import failed');
  await expect(page.getByTestId('mastered-count')).toHaveText('1');

  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByTestId('mastered-count')).toHaveText('0');
});

test('nothing is sent to any server while using the tracker', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('http://localhost:4321/') && !ANALYTICS.test(r.url())) outside.push(r.url());
  });
  await masterTopic4(page);
  await page.goto(PROGRESS);
  await page.getByLabel('Score / 50').fill('30');
  await page.getByRole('button', { name: 'Log my score' }).click();
  expect(outside).toEqual([]);
});

test('forms fit on a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(PROGRESS);
  for (const id of ['mistake-form', 'mock-score-form']) {
    const overflow = await page.getByTestId(id).first().evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(overflow, id).toBeLessThanOrEqual(0);
  }
  await page.goto(TOPIC_4);
  const card = await page.getByTestId('mastery-tracker').evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(card).toBeLessThanOrEqual(0);
});

for (const scheme of ['dark', 'light'] as const) {
  test(`tracker and dashboard are accessible (${scheme})`, async ({ page }) => {
    await masterTopic4(page);
    if (scheme === 'light') await page.evaluate(() => localStorage.setItem('theme', 'light'));
    for (const url of [TOPIC_4, PROGRESS]) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page }).include('[data-testid]').exclude('.katex').analyze();
      const bad = results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      expect(bad, url).toEqual([]);
    }
  });
}
