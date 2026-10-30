import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import { launchBrowser } from './browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('test-results/responsive', { recursive: true });
const output = [];
for (const config of [
  {
    name: 'phone',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'small-phone',
    viewport: { width: 360, height: 640 },
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'small-landscape',
    viewport: { width: 667, height: 375 },
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'landscape',
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'desktop-site-phone',
    viewport: { width: 980, height: 2121 },
    screen: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'desktop-site-landscape',
    viewport: { width: 980, height: 453 },
    screen: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
  },
  { name: 'tablet', viewport: { width: 768, height: 1024 } },
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
]) {
  const browser = await launchBrowser();
  const { name, ...options } = config;
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.goto(process.env.TEST_URL || 'http://localhost:4173', {
    waitUntil: 'networkidle',
  });
  await page.locator('.world-ready').waitFor({ timeout: 30000 });
  await expect(page.locator('.bag-fallback')).toHaveCSS('opacity', '0', {
    timeout: 20000,
  });
  await page.getByRole('button', { name: 'Pause ambient animation' }).click();
  for (const chapter of [0, 1, 2, 3, 4]) {
    if (chapter) await page.locator('.chapter-nav button').nth(chapter).click();
    await page.waitForFunction(
      (index) => {
        const canvas = document.querySelector('.commerce-canvas canvas');
        const target = index === 4 ? 0.96 : index / 4;
        return (
          Math.abs(Number(canvas?.dataset.sceneProgress) - target) < 0.02 &&
          Number(
            getComputedStyle(document.querySelectorAll('.journey-panel')[index])
              .opacity,
          ) > 0.98
        );
      },
      chapter,
      { timeout: 30000 },
    );
    const layout = await page.evaluate(() => {
      const rect = (el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.x,
          y: r.y,
          right: r.right,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
        };
      };
      const panel = document.querySelector(
        '.journey-panel[aria-hidden="false"]',
      );
      const stage = document.querySelector('.journey-stage');
      const scene = document.querySelector('.journey-scene');
      return {
        viewport: [innerWidth, innerHeight],
        documentWidth: document.documentElement.scrollWidth,
        stage: rect(stage),
        scene: rect(scene),
        panel: rect(panel),
        children: [...panel.children].map((el) => ({
          text: el.textContent.slice(0, 40),
          ...rect(el),
        })),
        canvasFrame: document.querySelector('canvas').dataset.modelFrame,
      };
    });
    output.push({ name, chapter, ...layout });
    const { panel, scene, stage, children } = layout;
    assert(
      layout.documentWidth <= layout.viewport[0] + 1,
      `${name}: horizontal overflow`,
    );
    assert(
      stage.height <= layout.viewport[1] + 1,
      `${name}: stage taller than viewport`,
    );
    assert(
      panel.right <= scene.x || panel.bottom <= scene.y,
      `${name}: copy/canvas overlap`,
    );
    assert(
      scene.x >= 0 &&
        scene.y >= 0 &&
        scene.right <= layout.viewport[0] + 1 &&
        scene.bottom <= layout.viewport[1] + 1,
      `${name}: canvas cropped`,
    );
    for (const child of children) {
      assert(
        child.y >= panel.y - 1 &&
          child.bottom <= panel.bottom + 1 &&
          child.right <= panel.right + 1,
        `${name} chapter ${chapter}: clipped ${child.text}`,
      );
    }
    assert(
      layout.canvasFrame &&
        layout.canvasFrame.split(',').every((n) => Number(n) <= 0.93),
      `${name}: model outside camera frame`,
    );
    if ([0, 2, 4].includes(chapter))
      await page.screenshot({
        path: `test-results/responsive/${name}-${chapter}.png`,
      });
  }
  await page.locator('.finale').scrollIntoViewIfNeeded();
  await page.locator('.finale-ready').waitFor({ timeout: 30000 });
  await page.waitForFunction(
    () => document.querySelector('.finale-scene canvas')?.dataset.modelFrame,
  );
  await expect(page.locator('.finale-bag')).toHaveCSS('opacity', '0');
  const finale = await page.evaluate(() => {
    const model = document
      .querySelector('.finale-scene')
      .getBoundingClientRect();
    return (
      [
        ...document.querySelectorAll(
          '.finale-content > h2,.finale-content > p,.finale-content > .hero-actions',
        ),
      ].every((el) => {
        const copy = el.getBoundingClientRect();
        return copy.right <= model.left + 1 || copy.bottom <= model.top + 1;
      }) &&
      document
        .querySelector('.finale-scene canvas')
        .dataset.modelFrame.split(',')
        .every((n) => Number(n) <= 0.93)
    );
  });
  assert(finale, `${name}: finale copy/canvas overlap or framing failure`);
  await page
    .locator('.finale')
    .screenshot({ path: `test-results/responsive/${name}-finale.png` });
  await browser.close();
  writeFileSync(
    'test-results/responsive/layouts.json',
    JSON.stringify(output, null, 2),
  );
  console.log(`${name}: all five chapters and finale passed`);
}
writeFileSync(
  'test-results/responsive/layouts.json',
  JSON.stringify(output, null, 2),
);
console.log(
  'Responsive composition checks passed; screenshots and measurements: test-results/responsive/',
);
