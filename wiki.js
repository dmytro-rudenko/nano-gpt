const axios = require("axios");
const { cache } = require("./cache");

const getWikiSummary = async (word) => {
  try {
    const cacheKey = `wiki-summary-${word}`;
    const cachedResponse = await cache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    const summary = `https://en.wikipedia.org/api/rest_v1/page/summary/${word}`;
    const { data } = await axios.get(summary);

    // console.log("wikidata", data)

    const isManyTerms =
      data.description === "Topics referred to by the same term";

    const errorExceptions = [
      typeof data === "string",
      data.title === "Not found",
    ];

    if (errorExceptions.includes(true)) {
      return false;
    }

    const shortDescription = isManyTerms ? data.extract : data.description;

    const result = {
      title: data.title || word,
      description: shortDescription || "",
      // description: data.extract || "",
    };

    await cache.set(cacheKey, result);

    return result;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

module.exports = {
  getWikiSummary,
};
