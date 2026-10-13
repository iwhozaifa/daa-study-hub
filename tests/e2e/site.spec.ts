// Clicks through the built site in a real browser, the way a student uses it.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { mdxFiles, urlOf } from '../helpers';

const BASE = '/daa-study-hub';
const TOPIC_4 = `${BASE}/docs/topics/04-insertion-sort`;
const TOPIC_6 = `${BASE}/docs/topics/06-asymptotic-notation`;

// Stub the Cloudflare Web Analytics beacon so test runs don't count as visits.
const ANALYTICS = /cloudflareinsights\.com/;
test.beforeEach(({ page }) => page.route(ANALYTICS, (r) => r.fulfill({ contentType: 'text/javascript', body: '' })));

/** Collects uncaught errors and console errors on a page. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

test.describe('home page', () => {
  test('shows the hero, countdown, four modes and nine topics', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(`${BASE}/`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Design & Analysis');
    await expect(page.getByTestId('days-left')).toHaveText(/days to midterm|Midterm (tomorrow|today|done)/);
    for (const mode of ['Visual', 'Worked example', 'Guided questions', 'Explanation & drill']) {
      await expect(page.getByText(mode, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByTestId('topic-grid').getByRole('link')).toHaveCount(9);
    expect(errors).toEqual([]);
  });

  test('"Start with Topic 0" opens the first topic', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.getByRole('link', { name: /Start with Topic 0/ }).click();
    await expect(page).toHaveURL(/00-math-toolkit/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Math toolkit');
  });
});

test.describe('flashcards', () => {
  test('the home toolbox opens the flashcards page', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.getByRole('link', { name: /Flashcards/ }).click();
    await expect(page).toHaveURL(/docs\/flashcards/);
  });

  test('cards flip, move, and filter by topic', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(`${BASE}/docs/flashcards`);
    const card = page.getByTestId('flashcard');
    const count = page.getByTestId('flashcard-count');
    await expect(count).toHaveText('Card 1 / 70');
    await expect(card).toContainText('log_b(x) = y means');
    await expect(card).toHaveAttribute('data-flipped', 'false');

    await card.click();
    await expect(card).toHaveAttribute('data-flipped', 'true');
    await expect(page.getByText('Answer: b^y = x', { exact: false })).toBeAttached();

    await page.getByRole('button', { name: /Next/ }).click();
    await expect(count).toHaveText('Card 2 / 70');
    await expect(card).toHaveAttribute('data-flipped', 'false');
    await page.keyboard.press('ArrowLeft'); // focus is inside the deck after the click
    await expect(count).toHaveText('Card 1 / 70');

    await page.getByRole('radio', { name: 'Topic 4' }).click();
    await expect(count).toHaveText('Card 1 / 6');
    await expect(card).toContainText('t4');

    await page.getByRole('button', { name: /Shuffle/ }).click();
    await expect(count).toHaveText('Card 1 / 6');
    expect(errors).toEqual([]);
  });

  test('has no accessibility violations', async ({ page }) => {
    await page.goto(`${BASE}/docs/flashcards`);
    await page.getByTestId('flashcard').click();
    const { violations } = await new AxeBuilder({ page }).include('[data-testid="flashcards"]').analyze();
    expect(violations).toEqual([]);
  });
});

test.describe('every note page', () => {
  for (const file of mdxFiles()) {
    test(`${file} loads without errors`, async ({ page }) => {
      const errors = watchErrors(page);
      const res = await page.goto(BASE + urlOf(file));
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});

test.describe('topic pages', () => {
  test('the chosen study mode is remembered on the next topic', async ({ page }) => {
    await page.goto(TOPIC_6);
    const guided = page.getByRole('tab', { name: 'Guided questions' });
    await guided.click();
    await expect(guided).toHaveAttribute('aria-selected', 'true');

    await page.goto(TOPIC_4);
    await expect(page.getByRole('tab', { name: 'Guided questions' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Visual' })).toHaveAttribute('aria-selected', 'false');
  });

  test('answers stay hidden until clicked', async ({ page }) => {
    await page.goto(TOPIC_6);
    const mastery = page.locator('#mastery-check ~ *').getByRole('button', { name: /Answers?/ }).first();
    const answerText = page.getByText('19n^3', { exact: false }).first();
    await expect(mastery).toHaveAttribute('aria-expanded', 'false');
    await mastery.click();
    await expect(mastery).toHaveAttribute('aria-expanded', 'true');
    await expect(answerText).toBeAttached();
  });

  test('maths is rendered by KaTeX', async ({ page }) => {
    await page.goto(TOPIC_6);
    expect(await page.locator('.katex').count()).toBeGreaterThan(20);
    await expect(page.getByText('$O$')).toHaveCount(0); // no raw dollar-sign maths left
  });

  test('Mermaid diagrams render as SVG', async ({ page }) => {
    await page.goto(`${BASE}/docs/topics/07-divide-and-conquer`);
    await page.getByRole('tab', { name: 'Visual' }).click();
    await expect(page.locator('.mermaid-diagram svg').first()).toBeVisible();
  });
});

test.describe('site features', () => {
  test('search finds insertion sort', async ({ page }) => {
    await page.goto(`${BASE}/docs`);
    await page.keyboard.press('Control+k');
    await page.getByRole('dialog', { name: 'Search' }).getByRole('combobox').fill('insertion');
    const hit = page.getByRole('dialog').getByText(/Insertion sort/).first();
    await expect(hit).toBeVisible();
  });

  test('dark mode is the default and can be switched to light', async ({ page }) => {
    await page.goto(`${BASE}/docs`);
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.getByRole('button', { name: 'Toggle Theme' }).first().click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  for (const path of ['/', '/docs/topics/04-insertion-sort', '/docs/practice/mock-midterm', '/docs/flashcards']) {
    test(`no sideways scrolling on a phone: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(BASE + path);
      const [scroll, client] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]);
      expect(scroll).toBeLessThanOrEqual(client);
    });
  }
});

test.describe('accessibility (axe)', () => {
  for (const [name, path, scheme] of [
    ['home, dark', '/', 'dark'],
    ['home, light', '/', 'light'],
    ['topic page, dark', '/docs/topics/06-asymptotic-notation', 'dark'],
    ['topic page, light', '/docs/topics/06-asymptotic-notation', 'light'],
  ] as const) {
    test(`no serious or critical issues: ${name}`, async ({ page }) => {
      await page.goto(BASE + path);
      if (scheme === 'light') {
        await page.evaluate(() => localStorage.setItem('theme', 'light'));
        await page.reload();
      }
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page }).exclude('.katex').analyze();
      const bad = results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 5).join(' | ')}`);
      expect(bad).toEqual([]);
    });
  }
});
