/* eslint-disable @typescript-eslint/no-shadow */

import fs from 'fs';
import path from 'path';

import { forwardPageConsole, initializePuppeteer, Page, waitForPageLoad } from './puppeteer';
import TESTS from './test-forms.json';
import type { LoginTarget } from '../../src';

type TestCase = (typeof TESTS)[number];
const LOCUST_PATH = path.resolve(__dirname, '../dist/iife/index.js');

/**
 * Loads the Locust JS script into the given `page`.
 *
 * @param page A Puppeteer `Page` instance.
 */
async function loadLocustScript(page: Page) {
  const locustScript = (await fs.promises.readFile(LOCUST_PATH)).toString();
  await page.evaluate(locustScript);
}

/**
 * Executes a single, pre-defined integration test case.
 *
 * @param config A single `TestCase` config.
 * @param page A Puppeteer `Page` instance.
 */
async function executeTestCase(config: TestCase, page: Page) {
  const { url, expectedFields } = config;

  if (!expectedFields) {
    throw new Error(`Invalid test: No expected fields provided`);
  }

  const waitForUsernameQuery = expectedFields.username || 'body';
  const waitForPasswordQuery = expectedFields.password || 'body';

  await page.goto(url);
  await loadLocustScript(page);

  await page.waitForSelector(waitForUsernameQuery);
  await page.waitForSelector(waitForPasswordQuery);

  await page.evaluate(function (expectedFields) {
    if (!(window as any).Locust) {
      throw new Error('No global Locust variable found');
    }

    const target: LoginTarget = (window as any).Locust.getLoginTarget();

    if (!target) {
      throw new Error('No login targets found');
    }

    if (expectedFields && expectedFields.username) {
      const usernameField = document.querySelector(expectedFields.username);
      if (target.usernameField !== usernameField) {
        throw new Error(`No username field found matching query: ${expectedFields.username}`);
      }
    }
    if (expectedFields && expectedFields.password) {
      const passwordField = document.querySelector(expectedFields.password);
      if (target.passwordField !== passwordField) {
        throw new Error(`No password field found matching query: ${expectedFields.password}`);
      }
    }
  }, expectedFields);
}

/**
 * Executes a single, arbitrarily-defined integration test.
 *
 * @param url The target URL for this test.
 * @param page A Puppeteer `Page` instance.
 */
async function executeAdHocTest(url: string, page: Page) {
  await page.goto(url);
  await loadLocustScript(page);

  await waitForPageLoad(page);

  await page.evaluate(function () {
    if (!(window as any).Locust) {
      throw new Error('No global Locust variable found');
    }

    return new Promise((resolve, reject) => {
      // Check once per second for login targets on the page.
      const interval = setInterval(() => {
        const target = (window as any).Locust.getLoginTarget();

        if (!target) {
          return; // we'll try again next internal
        }

        if (target.usernameField) {
          console.log(`[__uno_locust__]  - found username field`);
        }
        if (target.passwordField) {
          console.log(`[__uno_locust__]  - found password field`);
        }
        if (target.submitButton) {
          console.log(`[__uno_locust__]  - found submit button`);
        }

        resolve(true);
      }, 1000);

      // If no login targets are found after 15s, we give up.
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('No login targets found'));
      }, 15000);
    });
  });
}

/**
 * Run the integration test suite or a single, arbitrary
 * test based on the given command-line arguments.
 */
async function main() {
  const [url] = process.argv.slice(2);

  const browser = await initializePuppeteer();
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  forwardPageConsole(page);

  try {
    if (url) {
      console.log(`\n□ Testing: ${url}`);
      await executeAdHocTest(url, page);
      console.log(`■ Test complete.`);
    } else {
      console.log(`\n□ Running ${TESTS.length} integration tests:`);
      try {
        for (const test of TESTS) {
          console.log(`  - Testing: ${test.name}`);
          // eslint-disable-next-line no-await-in-loop
          await executeTestCase(test, page);
        }
      } catch (err) {
        console.error(`  × Failure: ${err}`);
      }
      console.log(`■ Tests complete.`);
    }
  } finally {
    await browser.close();
  }
}

// Here we go!
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
