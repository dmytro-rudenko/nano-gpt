const axios = require("axios");
const { cache } = require("./cache");
const { init, goTo } = require("./puppeteer");

const googleSearch = async (prompt) => {
  try {
    await init();

    const cacheKey = `google-search-${prompt}`;
    const cachedResponse = await cache.get(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const page = await goTo(
      `https://www.google.com/search?q=${prompt}+&hl=en-EN`
    );

    // get text of div with aria-label About
    let result = await page.evaluate(() => {
      const divs = document.querySelectorAll("div");

      for (const div of divs) {
        if (div.getAttribute("data-attrid") === "description") {
          return div.textContent;
        }
        if (div.getAttribute("data-attrid") === "wa:/description") {
          return div.textContent;
        }
      }

      return "";
    });

    if (result.startsWith("Description")) {
      result = result.slice("Description".length);
    }

    // await cache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.log("Error", error);
    return false;
  }
};

const main = async () => {
  console.log(await googleSearch(process.argv[2]));
};

if (process.argv[2]) {
  main();
}

module.exports = {
  googleSearch,
};
