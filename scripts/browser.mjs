import { chromium } from '@playwright/test';
import serverless from '@sparticuz/chromium';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
export async function launchBrowser(extraArgs = []) {
  if (!existsSync('/tmp/starterkart-chromium/lib/libnspr4.so')) {
    mkdirSync('/tmp/starterkart-chromium', { recursive: true });
    writeFileSync(
      '/tmp/starterkart-chromium/libs.tar',
      brotliDecompressSync(
        readFileSync(
          new URL(
            '../node_modules/@sparticuz/chromium/bin/al2023.tar.br',
            import.meta.url,
          ),
        ),
      ),
    );
    execFileSync('tar', [
      'xf',
      '/tmp/starterkart-chromium/libs.tar',
      '-C',
      '/tmp/starterkart-chromium',
    ]);
  }
  return chromium.launch({
    executablePath: await serverless.executablePath(),
    args: [...serverless.args, '--enable-unsafe-swiftshader', ...extraArgs],
    env: {
      ...process.env,
      LD_LIBRARY_PATH: `/tmp/starterkart-chromium/lib:${process.env.LD_LIBRARY_PATH || ''}`,
    },
    headless: true,
  });
}
