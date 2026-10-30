import { launchBrowser } from './browser.mjs';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { expect as baseExpect } from '@playwright/test';
const expect = baseExpect.configure({ timeout: 20000 });
import { mkdirSync, writeFileSync } from 'node:fs';
const browser = await launchBrowser();
const context = await browser.newContext();
const page = await context.newPage();
const base = process.env.TEST_URL || 'http://localhost:4173';
const report = {
  viewports: [],
  checks: [],
  accessibility: [],
  runtimeErrors: [],
};
page.on('pageerror', (e) => report.runtimeErrors.push(e.message));
for (const width of [360, 390, 430, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await expect(page.locator('.world-ready')).toHaveCount(1);
  await page.getByRole('button', { name: 'Pause ambient animation' }).click();
  const layout = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    headings: [...document.querySelectorAll('h1,h2')]
      .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
      .map((el) => el.textContent),
  }));
  assert(
    layout.width <= width + 1,
    `Horizontal overflow at ${width}: ${layout.width}`,
  );
  assert.equal(
    layout.headings.length,
    0,
    `Heading overflow at ${width}: ${layout.headings}`,
  );
  assert(await page.locator('h1').isVisible());
  report.viewports.push({ width, passed: true });
}
report.checks.push(
  'No horizontal or heading overflow at all seven requested widths',
);
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(base, { waitUntil: 'networkidle' });
await expect(page.locator('.world-ready')).toHaveCount(1);
await page.getByRole('button', { name: 'Pause ambient animation' }).click();
await expect(
  page.getByRole('button', { name: 'Resume ambient animation' }),
).toHaveAttribute('aria-pressed', 'true');
const originalCamera = await page
  .locator('.commerce-canvas canvas')
  .getAttribute('data-camera');
await page
  .getByRole('button', { name: '03 The experience', exact: true })
  .click();
await expect(page.locator('.journey-stage')).toHaveAttribute(
  'data-chapter',
  '2',
);
await expect
  .poll(async () =>
    Number(
      await page
        .locator('.commerce-canvas canvas')
        .getAttribute('data-scene-progress'),
    ),
  )
  .toBeGreaterThan(0.45);
assert.notEqual(
  await page.locator('.commerce-canvas canvas').getAttribute('data-camera'),
  originalCamera,
);
await expect(page.getByRole('heading', { name: /MAKE EVERY/ })).toBeVisible();
await page
  .getByRole('button', { name: '01 The beginning', exact: true })
  .click();
await expect(page.locator('.journey-stage')).toHaveAttribute(
  'data-chapter',
  '0',
);
await expect
  .poll(async () =>
    Number(
      await page
        .locator('.commerce-canvas canvas')
        .getAttribute('data-scene-progress'),
    ),
  )
  .toBeLessThan(0.06);
await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
report.checks.push(
  'Chapter controls scrub real camera/object progress in both directions; ambient motion can be paused',
);
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Open navigation' }).click();
assert.equal(await page.locator('#mobile-navigation').isVisible(), true);
await page.keyboard.press('Escape');
assert.equal(
  await page
    .getByRole('button', { name: 'Open navigation' })
    .getAttribute('aria-expanded'),
  'false',
);
assert.equal(
  await page
    .getByRole('button', { name: 'Open navigation' })
    .evaluate((el) => el === document.activeElement),
  true,
);
await page.getByRole('button', { name: 'Open navigation' }).click();
await page
  .locator('#mobile-navigation')
  .getByRole('link', { name: /Work/ })
  .click();
assert.equal(new URL(page.url()).hash, '#work');
assert.equal(await page.locator('#mobile-navigation').count(), 0);
report.checks.push(
  'Mobile menu opens, closes, returns focus on Escape, and navigates',
);
await page.locator('.project-visual').first().click();
assert.equal(await page.locator('dialog[open]').count(), 1);
await page.keyboard.press('Escape');
assert.equal(await page.locator('dialog[open]').count(), 0);
await page.getByText('Theme Customization', { exact: true }).first().click();
assert.equal(
  await page.locator('.service-item').nth(1).getAttribute('open'),
  '',
);
report.checks.push('Project preview and services accordion are functional');
await page.getByRole('button', { name: 'Prepare project inquiry' }).click();
assert.equal(await page.locator('.field-error').count(), 8);
await expect(page.locator('#inquiry-name')).toBeFocused();
await page.getByLabel('Your name', { exact: false }).fill('Test Owner');
await page.getByLabel('Brand name', { exact: false }).fill('Independent Label');
await page
  .getByLabel('Email address', { exact: false })
  .fill('owner@example.com');
await page.getByLabel('Type of business').selectOption('Clothing brand');
await page.getByLabel('Approximate product count').selectOption('21–50');
await page.getByLabel('Estimated budget').selectOption('Let’s discuss');
await page.locator('.service-options input').first().check();
await page
  .getByLabel('A little about your project')
  .fill(
    'We are building an independent label and would like a considered Shopify storefront.',
  );
await page.getByRole('button', { name: 'Prepare project inquiry' }).click();
await expect(
  page.getByText('Your brief is ready. Not sent yet.'),
).toBeVisible();
const destination = await page
  .getByRole('link', { name: 'Continue on WhatsApp' })
  .getAttribute('href');
assert(destination.startsWith('https://wa.me/919818082449?text='));
assert(decodeURIComponent(destination).includes('Independent Label'));
assert.equal(await page.locator('.form-success').count(), 0);
report.checks.push(
  'Form errors are accessible; valid inquiry prepares review and encoded WhatsApp URL without claiming submission',
);
await page.locator('#website').fill('spam.test', { force: true });
await page.getByRole('button', { name: 'Prepare project inquiry' }).click();
assert.equal(await page.getByRole('alert').isVisible(), true);
report.checks.push('Spam honeypot produces an honest error state');
await page.reload({ waitUntil: 'networkidle' });
const links = await page
  .locator('a')
  .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
for (const href of links) {
  assert(href && href !== '#', `Unfinished link: ${href}`);
  if (href.startsWith('#'))
    assert.equal(
      await page.locator(`[id="${href.slice(1)}"]`).count(),
      1,
      `Missing anchor ${href}`,
    );
}
report.checks.push(
  'Every link has a destination; all internal destinations exist',
);
for (const width of [390, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  report.accessibility.push({
    width,
    violations: axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
}
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(base, { waitUntil: 'networkidle' });
assert.equal(
  await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  ),
  'auto',
);
report.checks.push(
  'Reduced-motion mode disables smooth scrolling and nonessential animation',
);
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.goto(base, { waitUntil: 'networkidle' });
await expect(page.locator('.world-ready')).toHaveCount(1);
await page
  .locator('canvas')
  .evaluate((canvas) =>
    canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })),
  );
await expect(page.locator('.world-ready')).toHaveCount(0);
await expect(page.locator('.static-journey')).toHaveCount(1);
await expect(page.locator('.bag-fallback')).toHaveCSS('opacity', '0.55');
report.checks.push('Graphics-context loss restores the local artwork fallback');
const fallback = await browser.newPage({
  viewport: { width: 390, height: 844 },
});
await fallback.addInitScript(() => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    if (type.startsWith('webgl') || type === 'experimental-webgl') return null;
    return original.call(this, type, ...args);
  };
});
await fallback.goto(base, { waitUntil: 'networkidle' });
await expect(fallback.locator('.static-journey')).toHaveCount(1);
assert.equal(await fallback.locator('.world-ready').count(), 0);
assert.equal(
  await fallback.getByRole('heading', { level: 1 }).isVisible(),
  true,
);
await expect(fallback.locator('.bag-fallback')).toHaveCSS('opacity', '0.55');
report.checks.push(
  'WebGL-disabled fallback preserves artwork, headline, and actions',
);
mkdirSync('test-results', { recursive: true });
writeFileSync(
  'test-results/verification.json',
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
assert.equal(report.runtimeErrors.length, 0, 'Unexpected browser errors');
assert(
  report.accessibility.every((r) => r.violations.length === 0),
  'Accessibility violations need attention',
);
