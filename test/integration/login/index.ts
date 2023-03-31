/* eslint-disable @typescript-eslint/no-shadow */

import { createCommand, Inputs } from 'flik';
import fetch from 'node-fetch';

import type { LoginTarget } from '@src/index';

import FIXTURES from './fixtures.json';
import { initializePuppeteer, loadLocustScript, Page, waitForPageLoad } from '../puppeteer';
import { isValidUrl, symbols } from '../utils';

type TestCase = (typeof FIXTURES)[number];

// -------------------------------------------------------------------------- //

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
    if (expectedFields && expectedFields.submit) {
      const submitButton = document.querySelector(expectedFields.submit);
      if (target.submitButton !== submitButton) {
        throw new Error(`No submit button found matching query: ${expectedFields.submit}`);
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
async function executeOnDemandTest(url: string, page: Page) {
  await page.goto(url);
  await loadLocustScript(page);

  await waitForPageLoad(page);

  type FoundTargets = {
    username: boolean;
    password: boolean;
    submit: boolean;
  };

  const foundTargets = await page.evaluate(function () {
    if (!(window as any).Locust) {
      throw new Error('No global Locust variable found');
    }

    return new Promise<FoundTargets>((resolve, reject) => {
      // Check once per second for login targets on the page.
      const interval = setInterval(() => {
        const target = (window as any).Locust.getLoginTarget();

        if (!target) {
          return; // we'll try again next interval
        }

        const foundTargets: FoundTargets = {
          username: false,
          password: false,
          submit: false,
        };

        if (target.usernameField) {
          foundTargets.username = true;
        }
        if (target.passwordField) {
          foundTargets.password = true;
        }
        if (target.submitButton) {
          foundTargets.submit = true;
        }

        resolve(foundTargets);
      }, 1000);

      // If no login targets are found after 15s, we give up.
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('No login targets found after 30s'));
      }, 30_000);
    });
  });

  return foundTargets;
}

// -------------------------------------------------------------------------- //

export interface LoginArgs extends Inputs.PositionalArgData {
  url?: string;
}

export const positionalArgs: Inputs.PositionalArgCollection<LoginArgs> = {
  url: {
    required: false,
    description: 'An arbitrary URL to test login form detections against.',
    validate: (maybeURL) => {
      if (!isValidUrl(maybeURL)) {
        return `Invalid URL: ${maybeURL}`;
      }
    },
  },
};

export const loginCommand = createCommand(
  {
    command: 'login',
    description: 'Run integration tests against login forms',
    inputs: { positionalArgs },
  },

  /**
   * Run the integration test suite or a single, arbitrary
   * test based on the given command-line arguments.
   */
  async ({ data, addShutdownTask }) => {
    const browser = await initializePuppeteer();
    const page = await browser.newPage();
    await page.setBypassCSP(true);

    addShutdownTask(async () => {
      await browser.close();
    });

    if (data.url) {
      try {
        // Run an on-demand test if `url` parameter was received...
        console.log(`\n◌ Testing: ${data.url}`);
        const foundTargets = await executeOnDemandTest(data.url, page);
        Object.entries(foundTargets).forEach(([target, found]) => {
          console.log(`  ${found ? '✔' : symbols.x} ${target}`);
        });

        // Post a message with the results to Uno's
        // element-detection triage channel.
        if (process.env.DISCORD_WEBHOOK) {
          try {
            const content = [
              `Results for: **\`${data.url}\`**`,
              ...Object.entries(foundTargets).map(([target, found]) => {
                return `\`${found ? symbols.checkmark : symbols.x} ${target}\``;
              }),
            ].join(`\n`);

            await fetch(process.env.DISCORD_WEBHOOK, {
              method: `POST`,
              headers: { 'Content-Type': `application/json` },
              body: JSON.stringify({ content }),
            });

            console.log(`\n${symbols.checkmark} Posted test results to Discord.`);
          } catch {
            // Not the end of the world if the Discord hook fails...
          }
        }
      } catch (err) {
        console.error(`  ${symbols.x} Failure: ${err}`);

        // Post a message with info about test failure
        // to Uno's element-detection triage channel.
        if (process.env.DISCORD_WEBHOOK) {
          try {
            const content = [
              `Results for: **\`${data.url}\`**`,
              `\`${symbols.x} Test failed:\``,
              `\`\`\``,
              `${err.message}`,
              `\`\`\``,
            ].join(`\n`);

            await fetch(process.env.DISCORD_WEBHOOK, {
              method: `POST`,
              headers: { 'Content-Type': `application/json` },
              body: JSON.stringify({ content }),
            });

            console.log(`\n${symbols.checkmark} Posted error trace to Discord.`);
          } catch {
            // Not the end of the world if the Discord hook fails...
          }
        }
      }
      console.log(`${symbols.complete} Test complete.`);
    } else {
      // Otherwise, run the full pre-defined integration test suite...
      console.log(`\n◌ Running ${FIXTURES.length} integration tests:`);
      try {
        for (const test of FIXTURES) {
          console.log(`  - Testing: ${test.name}`);
          // eslint-disable-next-line no-await-in-loop
          await executeTestCase(test, page);
        }
      } catch (err) {
        console.error(`  ${symbols.x} Failure: ${err}`);
      }
      console.log(`${symbols.complete} Tests complete.`);
    }
  },
);
