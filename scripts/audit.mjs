import lighthouse from 'lighthouse';
import { launchBrowser } from './browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
const browser = await launchBrowser(['--remote-debugging-port=9222']);
mkdirSync('test-results', { recursive: true });
try {
  for (const formFactor of ['mobile', 'desktop']) {
    const result = await lighthouse(
      process.env.TEST_URL || 'http://localhost:4173',
      {
        port: 9222,
        output: 'html',
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
        ...(formFactor === 'desktop'
          ? {
              formFactor: 'desktop',
              screenEmulation: {
                mobile: false,
                width: 1440,
                height: 900,
                deviceScaleFactor: 1,
                disabled: false,
              },
              throttling: {
                rttMs: 40,
                throughputKbps: 10240,
                cpuSlowdownMultiplier: 1,
              },
            }
          : {}),
      },
    );
    writeFileSync(`test-results/lighthouse-${formFactor}.html`, result.report);
    const summary = {
      auditErrors: Object.values(result.lhr.audits)
        .filter((a) => a.scoreDisplayMode === 'error')
        .map((a) => ({ id: a.id, error: a.errorMessage })),
      environment:
        'Local production preview; headless Chromium with software WebGL',
      formFactor,
      scores: Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, v]) => [
          key,
          v.score === null ? null : Math.round(v.score * 100),
        ]),
      ),
      metrics: Object.fromEntries(
        [
          'first-contentful-paint',
          'largest-contentful-paint',
          'total-blocking-time',
          'cumulative-layout-shift',
        ].map((key) => [key, result.lhr.audits[key].displayValue]),
      ),
      diagnostics: Object.values(result.lhr.audits)
        .filter((a) => a.score !== null && a.score < 0.9)
        .map((a) => ({
          id: a.id,
          score: a.score,
          title: a.title,
          details: a.displayValue,
        })),
    };
    writeFileSync(
      `test-results/lighthouse-${formFactor}.json`,
      JSON.stringify(summary, null, 2),
    );
    console.log(JSON.stringify(summary, null, 2));
  }
} finally {
  await browser.close();
}
