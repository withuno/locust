import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export { Page };

export async function initializePuppeteer() {
  puppeteer.use(StealthPlugin());

  return puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ['--disable-web-security', '--allow-running-insecure-content'],
  });
}

/**
 * A custom "page-loaded" heuristic which waits for all assets to be ready.
 *
 * We use this to target integration tests are arbitrary domains
 * which aren't already marshalled in `test-form.json`.
 *
 * @param page A Puppeteer `Page` to wait for a "loaded" state.
 */
export async function waitForPageLoad(page: Page) {
  // Wait until all images and fonts have loaded
  await page.evaluate(function () {
    const selectors = Array.from(document.querySelectorAll('img'));
    return Promise.all([
      document.fonts.ready,
      ...selectors.map((img) => {
        // Image has already finished loading, let’s see if it worked...
        if (img.complete) {
          if (img.naturalHeight !== 0) return;
          throw new Error('Image failed to load');
        }

        // Image hasn’t loaded yet, add an event listener to know when it does...
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', reject);
        });
      }),
    ]);
  });
}
