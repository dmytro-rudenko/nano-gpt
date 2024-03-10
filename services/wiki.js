const axios = require("axios");
const { cache } = require("./cache");

const SORRY_DESCRIPTION = "Sorry, there is no information about this topic";

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
      data.extract.includes("may refer to:"),
      data.description.includes("may refer to:"),
    ];

    if (errorExceptions.includes(true)) {
      return {
        title: word,
        description: SORRY_DESCRIPTION,
      };
    }

    const description = isManyTerms ? data.extract : data.description;

    const result = {
      title: data.title || word,
      description: description || SORRY_DESCRIPTION
    };

    await cache.set(cacheKey, result);

    return result;
  } catch (err) {
    console.log(err.message);
    return {
      title: word,
      description: SORRY_DESCRIPTION
    };;
  }
};

module.exports = {
  getWikiSummary,
};
