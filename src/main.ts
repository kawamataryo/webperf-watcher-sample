import * as puppeteer from "puppeteer";
import { AuditsResult } from "./@types/lighthouse";
import * as lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import * as reportGenerator from "lighthouse/lighthouse-core/report/report-generator";
import { DDClient } from "./lib/ddClient";
import {
  BASE_URL,
  LOGIN_ID,
  LOGIN_PASS,
  CHROME_OPTIONS,
  DD_API_KEY,
  LIGHTHOUSE_OPTIONS,
  TARGET_METRICS,
  TARGET_URLS,
} from "./constants";

const login = async (browser: puppeteer.Browser) => {
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/login`);
  const navigationPromise = page.waitForNavigation();

  await page.type("input#id", LOGIN_ID);
  await page.type("input#password", LOGIN_PASS);
  await page.click(".login-button");

  await navigationPromise;
};

const metricsName = (url: string, data: AuditsResult) => {
  const pageName = url.replace(BASE_URL, "").replace("-", "_");
  const dataName = data.id.replace("-", "_");
  return `application.example.${pageName}.${dataName}`;
};

const main = async () => {
  // puppeteer を chrome-launcher に接続
  const chrome = await chromeLauncher.launch(CHROME_OPTIONS);
  const res = await fetch(`http://localhost:${chrome.port}/json/version`, {
    method: "GET",
  });
  const { webSocketDebuggerUrl } = await res.json();
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });

  // ログインの実行
  await login(browser);

  const ddClient = new DDClient(DD_API_KEY);

  for (const url of TARGET_URLS) {
    // lighthouseの実効（直列実効でないと落ちるので注意）
    const { lhr } = await lighthouse(
      url,
      { ...CHROME_OPTIONS, port: chrome.port },
      LIGHTHOUSE_OPTIONS
    );
    const json = reportGenerator.generateReport(lhr, "json");

    const audits = JSON.parse(json as string).audits;

    // Datadogへの送信
    await Promise.all(
      TARGET_METRICS.map(async (metrics) => {
        await ddClient.sendMetrics(
          metricsName(url, audits[metrics]),
          audits[metrics]
        );
      })
    );
  }

  await browser.disconnect();
  await chrome.kill();
};

main();
