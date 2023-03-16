import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from "path";

import TESTS from "./test-forms.json";

type TestCase = typeof TESTS[number];

const LOCUST_PATH = path.resolve(__dirname, "../../dist/iife/index.js");

async function executeTestCase(config: TestCase, page: Page) {
    const { name, url, expectedFields } = config;
    console.log(` - Testing: ${name}`);
    if (!expectedFields) {
        throw new Error(`Invalid test: No expected fields provided`);
    }
    const waitForUsernameQuery = expectedFields.username || "body";
    const waitForPasswordQuery = expectedFields.password || "body";
    await page.goto(url);
    await page.setBypassCSP(true);
    await page.addScriptTag({ path: LOCUST_PATH });
    await page.waitForSelector(waitForUsernameQuery);
    await page.waitForSelector(waitForPasswordQuery);
    await page.evaluate(function (expectedFields) {
        if (!(window as any).Locust) {
            throw new Error("No global Locust variable found");
        }
        const target = (window as any).Locust.getLoginTarget();
        if (!target) {
            throw new Error("No login targets found");
        }
        if (expectedFields && expectedFields.username) {
            const usernameField = document.querySelector(expectedFields.username);
            if (target.usernameField !== usernameField) {
                throw new Error(
                    `No username field found matching query: ${expectedFields.username}`
                );
            }
        }
        if (expectedFields && expectedFields.password) {
            const passwordField = document.querySelector(expectedFields.password);
            if (target.passwordField !== passwordField) {
                throw new Error(
                    `No password field found matching query: ${expectedFields.password}`
                );
            }
        }
    }, expectedFields);
}

async function main() {
    console.log("Running integration tests:");

    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: ['--disable-web-security', '--allow-running-insecure-content']
    });
    const page = await browser.newPage();

    try {
        for (const test of TESTS) {
            await executeTestCase(test, page);
        }
    } catch(err) {
        console.log(err);
    } finally {
        await browser.close();
    }

    console.log("Tests complete.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
