// const { getWikiSummary } = require("./wiki.js");
const { googleSearch } = require("./google-search.js");
// const { summarize } = require("./services/summarize.js");
const { useGpt } = require("./gpt.js");
// const { getKeysFromQuery } = require("./tokenizer.js");
const { logger } = require("./logger.js");
const { getTranslatedText } = require("./translate.js");
const { queryClassify } = require("../agents/classificators/query-classify.js");
const {
  requestClassify,
} = require("../agents/classificators/request-classify.js");

let memory = {
  lastQuery: null,
  lastResult: null,
  startMemoryAt: null,
};

const smartQuery = async (query, model) => {
  logger.log("query", query);

  const { cutIncompleteMessage, pipeline } = await useGpt(model);

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

  if (queryType === "request") {
    let requestType = await requestClassify(query);
    let pipe;
    logger.log("requestType", requestType);

    memory.active = memory.startMemoryAt > new Date().getTime() - 2 * 60 * 1000;

    if (!memory.active) {
      if (requestType === "abstract") {
        pipe = await pipeline({
          message: query,
          systemPrompt: "You are a helpful assistant.",
        });
      } else if (requestType === "precisely") {
        const googleData = await googleSearch(query);

        logger.log("googleDataInformation", googleData);

        const message = `This is my query: "${query}". This is provided information from Google search: "${googleData}". Write an answer to the request using(optional) the provided information.`;

        pipe = await pipeline({
          message,
          systemPrompt: "You are a helpful assistant.",
        });
      }

      console.log("pipeline", pipe);

      memory.active = true;
      memory.lastQuery = query;
      memory.send = pipe.send;
      response = pipe.response;

      memory.startMemoryAt = new Date().getTime();
    } else {
      const res = await memory.send(query);
      response = res.response;
    }

    logger.log("response:\n", response);
    logger.log("Response:");

    result = cutIncompleteMessage(response.choices[0].message.content);
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

//   const keys = getKeysFromQuery(query);

//   logger.log("keys", keys.keywords);

//   if (keys.keywords.length === 0) {
//     retryCounter++;

//     if (retryCounter < MAX_RETRY) {
//       logger.log("retrying...", retryCounter);
//       return main();
//     } else {
//       logger.log("retry limit reached");
//       return;
//     }
//   }

//   const startTime = process.hrtime();

//   let keyswordsSenceStore = {};

//   for (const keyword of keys.keywords) {
//     const summary = await getWikiSummary(keyword);
//     keyswordsSenceStore[keyword] = summary;
//     logger.log("summary", keyword, false, "completed");
//   }

//   let keywordsSenceMessage = "";
//   for (const keyword in keyswordsSenceStore) {
//     // console.log("sence", keyswordsSenceStore[keyword])

//     const info = rmBreakLine(
//       keyswordsSenceStore[keyword]["description"].trim()
//     );

//     console.log("info", info);

//     keywordsSenceMessage += `Info about "${keyword}" - ${info}. `;
//   }

//   logger.log("keywordsSenceMessage", keywordsSenceMessage);

//   endTime = process.hrtime(startTime);

//   // get process time in seconds
//   console.log(`WikiTime: ${(endTime[0] + endTime[1] / 1e9).toFixed(3)}s`);
