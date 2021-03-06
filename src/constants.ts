export const BASE_URL = "https://example.com";

export const LOGIN_ID = process.env.LOGIN_URL as string;

export const LOGIN_PASS = process.env.LOGIN_PASS as string;

export const DD_API_KEY = process.env.DD_API_KEY as string;

export const CHROME_OPTIONS = {
  logLevel: "info",
  chromeFlags: ["--headless", "--no-sandbox"],
};

export const TARGET_METRICS = [
  "first-contentful-paint",
  "interactive",
  "largest-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "max-potential-fid",
];

export const LIGHTHOUSE_OPTIONS = {
  extends: "lighthouse:default",
  settings: {
    formFactor: "desktop",
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    onlyAudits: TARGET_METRICS,
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    headless: true,
  },
};

export const TARGET_URLS = [
  `${BASE_URL}/dashboard`,
  `${BASE_URL}/job_descriptions`,
  `${BASE_URL}/recommends`,
  `${BASE_URL}/talent_pool`,
  `${BASE_URL}/mailbox`,
];
