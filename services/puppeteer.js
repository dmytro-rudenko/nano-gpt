const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

let browser = null;

const init = async (options = {}) => {
  browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: [
      "--enable-automation",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--incognito",
    ],
    ...options,
  });

  return browser;
};

const goTo = async (url) => {
  const page = await browser.newPage();

  await page.goto(url);

  await page.setViewport({
    width: 1376,
    height: 980,
    deviceScaleFactor: 1,
  });

  return page;
};

const close = async (browser) => {
  await browser.close();
};

// const test = async () => {
//   const result = await goTo("https://www.google.com");
//   console.log("test result", result);
// };

module.exports = {
  browser,
  init,
  goTo,
  close,
};