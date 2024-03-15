// const { getWikiSummary } = require("./wiki.js");
const { googleSearch } = require("./google-search.js");
// const { summarize } = require("./services/summarize.js");
// const { useGpt } = require("./gpt.js");
const { cutIncompleteMessage, pipeline } = require("./gpt.js");
// const { getKeysFromQuery } = require("./tokenizer.js");
const { logger } = require("./logger.js");
const { getTranslatedText } = require("./translate.js");
const { queryClassify } = require("../agents/classificators/query-classify.js");
const {
  requestClassify,
} = require("../agents/classificators/request-classify.js");
const memory = require("./memory.js");
// let memory = {
//   lastQuery: null,
//   lastResult: null,
//   startMemoryAt: null,
// };

const smartQuery = async ({ query, messageId }) => {
  logger.log("query", query);

  // const { cutIncompleteMessage, pipeline } = await useGpt(model);

  query = await getTranslatedText({
    from: "uk",
    to: "en",
    text: query,
  });

  let result = "";

  const queryType = await queryClassify(query);

  logger.log("queryType", queryType);

  //  return queryType
  if (queryType === "task") {
    result = "I still do not know how to perform tasks";
  }

  let response;

  if (queryType === "request" || queryType === "unknown") {
    let requestType = await requestClassify(query);
    let pipe;
    logger.log("requestType", requestType);

    const isMemoryActive =
      memory.get("startMemoryAt") > new Date().getTime() - 10 * 60 * 1000;

    if (!isMemoryActive) {
      if (requestType === "abstract" || requestType === "unknown") {
        pipe = await pipeline({
          message: query,
          systemPrompt: "You are a helpful assistant.",
          options: {
            messageId,
          }
        });
      } else if (requestType === "precisely") {
        const googleData = await googleSearch(query);

        logger.log("googleDataInformation", googleData);

        const message = `This is my query: "${query}". This is provided information from Google search: "${googleData}". Write an answer to the request using(optional) the provided information.`;

        pipe = await pipeline({
          message,
          systemPrompt: "You are a helpful assistant.",
          options: {
            messageId,
          },
        });
      }

      console.log("pipeline", pipe);

      memory.set("lastQuery", query);
      memory.send = pipe.send;
      response = pipe.response;

      memory.set("startMemoryAt", new Date().getTime());
    } else {
      const res = await memory.send(query);
      response = res.response;
    }

    logger.log("response:", response);

    result = cutIncompleteMessage(response);
  }

  result = await getTranslatedText({
    from: "en",
    to: "uk",
    text: result,
  });

  // logger.log(result);

  return result;
};

module.exports = {
  smartQuery,
};
