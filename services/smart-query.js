// const { getWikiSummary } = require("./wiki.js");
const { googleSearch } = require("./google-search.js");
// const { summarize } = require("./services/summarize.js");
const { useGpt } = require("./gpt.js");
// const { getKeysFromQuery } = require("./tokenizer.js");
const { logger } = require("./logger.js");
const { getTranslatedText } = require("./translate.js");

// const rmBreakLine = (message) => {
//   return message.replace(/(\r\n|\n|\r)/gm, " ");
// };

// let retryCounter = 0;
// const MAX_RETRY = 3;
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



  memory.active = memory.startMemoryAt > (new Date()).getTime() - 2 * 60 * 1000;

  let response = "";

  if (!memory.active) {
    const googleData = await googleSearch(query);
    // logger.log("googleData:\n", googleData.length, true);
  
    logger.log("googleDataInformation", googleData);
  
    const message = `This is my query: "${query}". This is provided information from Google search: "${googleData}". Write an answer to the request using(optional) the provided information.`;

    const pipe = await pipeline(
      message,
      "You are a helpful assistant."
    );

    memory.active = true;
    memory.lastQuery = query;
    memory.send = pipe.send;
    response = pipe.response

    memory.startMemoryAt = (new Date()).getTime();
  } else {
    const res = await memory.send(query);
    response = res.response
  }

  console.log("response:\n", response);
  logger.log("Response:");
  let result = cutIncompleteMessage(response.choices[0].message.content);

  result = await getTranslatedText({
    from: "en",
    to: "uk",
    text: result,
  });

  logger.log(result);

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

