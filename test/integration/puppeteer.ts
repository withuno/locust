import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export { Page };

/**
 * Initializes and returns a Puppeteer browser instance.
 */
export async function initializePuppeteer() {
  puppeteer.use(StealthPlugin());

  return puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    ignoreHTTPSErrors: true,
    args: ['--disable-web-security', '--allow-running-insecure-content'],
  });
}

/**
 * Hooks into the `console.log` stream from the given `page`.
 *
 * Note: messages must be prefixed with "[__uno_locust__]" to be evaluated here.
 *
 * @param page A Puppeteer `Page` instance.
 */
export function forwardPageConsole(page: Page) {
  page.on('console', async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      // eslint-disable-next-line no-await-in-loop
      const jsonValue = await msgArgs[i].jsonValue();
      if (i === 0 && typeof jsonValue === 'string' && jsonValue.startsWith('[__uno_locust__]')) {
        console.log(jsonValue.replace('[__uno_locust__]', ''));
      } else {
        break;
      }
    }
  });
}

/**
 * A custom "page-loaded" heuristic which waits for all assets to be ready.
 *
 * We use this to target integration tests are arbitrary domains
 * which aren't already marshalled in `test-form.json`.
 *
 * @param page A Puppeteer `Page` instance.
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
