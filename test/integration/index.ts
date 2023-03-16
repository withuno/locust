/* eslint-disable @typescript-eslint/no-shadow */

import path from 'path';

import { initializePuppeteer, Page, waitForPageLoad } from './puppeteer';
import TESTS from './test-forms.json';

type TestCase = (typeof TESTS)[number];

const LOCUST_PATH = path.resolve(__dirname, '../../dist/iife/index.js');

async function executeTestCase(config: TestCase, page: Page) {
  const { url, expectedFields } = config;

  if (!expectedFields) {
    throw new Error(`Invalid test: No expected fields provided`);
  }

  const waitForUsernameQuery = expectedFields.username || 'body';
  const waitForPasswordQuery = expectedFields.password || 'body';

  await page.goto(url);
  await page.setBypassCSP(true);
  await page.addScriptTag({ path: LOCUST_PATH });

  await page.waitForSelector(waitForUsernameQuery);
  await page.waitForSelector(waitForPasswordQuery);

  await page.evaluate(function (expectedFields) {
    if (!(window as any).Locust) {
      throw new Error('No global Locust variable found');
    }
    const target = (window as any).Locust.getLoginTarget();
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

async function executeAdHocTest(url: string, page: Page) {
  await page.goto(url);
  await page.setBypassCSP(true);
  await page.addScriptTag({ path: LOCUST_PATH });

  await waitForPageLoad(page);

  await page.evaluate(function () {
    if (!(window as any).Locust) {
      throw new Error('No global Locust variable found');
    }
    const target = (window as any).Locust.getLoginTarget();
    if (!target) {
      throw new Error('No login targets found');
    }
  });
}

async function main() {
  const [url] = process.argv.slice(2);

  const browser = await initializePuppeteer();
  const page = await browser.newPage();

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
