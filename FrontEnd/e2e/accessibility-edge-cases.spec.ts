import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { screenRegistry } from '../src/data/screenRegistry';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const businessScreens = screenRegistry.filter(({ code }) => !code.startsWith('ACC-'));

test('identity entry and context selection are keyboard operable and pass WCAG A/AA checks', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  await expectNoAccessibilityViolations(page, 'ACC-LOGIN');

  const email = page.getByLabel('Email');
  const password = page.getByLabel('Password');
  await email.fill('admin.user@qtfoods.local');
  await password.fill('prototype');
  await password.press('Enter');

  await expect(page.getByRole('heading', { name: 'Choose where you are working' })).toBeVisible();
  await expectNoAccessibilityViolations(page, 'ACC-CTX');

  const context = page.getByRole('button', { name: /Training Plant/ });
  await context.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.content .crumb')).toContainText('WRK-HOME');
});

test('every routed administrator screen passes automated WCAG A/AA checks', async ({ page }) => {
  test.setTimeout(420_000);
  await loginAndSelect(page, 'admin.user@qtfoods.local');

  const navigation = page.getByRole('navigation', { name: 'Authorised ERP modules' });
  await expect(navigation.locator('button')).toHaveCount(businessScreens.length);
  await expectNoAccessibilityViolations(page, 'application shell');

  for (const screen of businessScreens) {
    await page.evaluate((code) => { window.location.hash = code; }, screen.code);
    await expect(page.locator('.content .crumb')).toContainText(screen.code);
    await page.waitForLoadState('networkidle');
    await expectNoAccessibilityViolations(page, screen.code, '.content');
  }
});

test('unauthorised deep links stay fail closed and context cancellation preserves valid work', async ({ page }) => {
  await loginAndSelect(page, 'demo.user@qtfoods.local');
  const adminRequests: string[] = [];
  page.on('request', (request) => {
    if (/\/api\/v1\/admin\/(?:roles|permissions)/.test(request.url())) adminRequests.push(request.url());
  });

  await page.evaluate(() => { window.location.hash = 'ADM-ROLE?record=00000000-0000-4000-8000-000000000000'; });
  await expect(page).toHaveURL(/#WRK-HOME$/);
  await expect(page.getByRole('navigation', { name: 'Authorised ERP modules' }).getByRole('button', { name: /ADM-ROLE/ })).toHaveCount(0);
  expect(adminRequests).toEqual([]);

  await page.getByRole('navigation', { name: 'Authorised ERP modules' }).getByRole('button', { name: /CRM-LEAD/ }).click();
  await expect(page.locator('.content .crumb')).toContainText('CRM-LEAD');
  await page.locator('.context-button').click();
  await expect(page.getByRole('heading', { name: 'Choose where you are working' })).toBeVisible();
  await page.getByRole('button', { name: 'Return to workspace' }).click();
  await expect(page).toHaveURL(/#CRM-LEAD$/);
  await expect(page.locator('.content .crumb')).toContainText('CRM-LEAD');
});

test('responsive navigation and account-security dialog preserve keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAndSelect(page, 'admin.user@qtfoods.local');
  await expectNoAccessibilityViolations(page, 'compact application shell');

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');
  await expect(page.locator('#erp-main-content')).toBeFocused();

  const menu = page.getByRole('button', { name: 'Toggle navigation' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByLabel('Search authorised modules')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();

  const security = page.getByRole('button', { name: 'Account security' });
  await security.click();
  const dialog = page.getByRole('dialog', { name: 'Identity & devices' });
  await expect(dialog).toBeVisible();
  const closeDialog = page.getByRole('button', { name: 'Close account security' });
  await expect(closeDialog).toBeFocused();
  await expectNoAccessibilityViolations(page, 'account-security dialog', '.security-overlay');
  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(security).toBeFocused();
});

async function loginAndSelect(page: Page, email: string): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('prototype');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: /Training Plant/ }).click();
  await expect(page.locator('.content .crumb')).toContainText('WRK-HOME');
}

async function expectNoAccessibilityViolations(page: Page, label: string, include?: string): Promise<void> {
  const builder = new AxeBuilder({ page }).withTags(wcagTags);
  if (include) builder.include(include);
  const results = await builder.analyze();
  const violations = results.violations.map((violation) => [
    `${violation.id} (${violation.impact ?? 'unclassified'}): ${violation.help}`,
    ...violation.nodes.map((node) => `  ${node.target.join(' ')}`),
  ].join('\n'));

  expect.soft(violations, `${label} has automated accessibility violations`).toEqual([]);
}
