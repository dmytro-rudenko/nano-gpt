const { getWikiSummary } = require("./services/wiki.js");
const { googleSearch } = require("./services/google-search.js");
const { summarize } = require("./services/summarize.js");
const { useGpt } = require("./services/gpt.js");
const { getKeysFromQuery } = require("./services/tokenizer.js");
const { logger } = require("./services/logger.js");
let retryCounter = 0;
const MAX_RETRY = 3;

const rmBreakLine = (message) => {
  return message.replace(/(\r\n|\n|\r)/gm, " ");
};

const main = async () => {
  const { sendMessageToChat, cutIncompleteMessage } = await useGpt();

  let query = `Who is Steve Jobs?`;

  if (process.argv.length > 2) {
    query = process.argv[2];
  }

  logger.log("query", query);

  const keys = getKeysFromQuery(query);

  logger.log("keys", keys.keywords);

  if (keys.keywords.length === 0) {
    retryCounter++;

    if (retryCounter < MAX_RETRY) {
      logger.log("retrying...", retryCounter);
      return main();
    } else {
      logger.log("retry limit reached");
      return;
    }
  }

  const startTime = process.hrtime();

  let keyswordsSenceStore = {};

  for (const keyword of keys.keywords) {
    const summary = await getWikiSummary(keyword);
    keyswordsSenceStore[keyword] = summary;
    logger.log("summary", keyword, false, "completed");
  }

  let keywordsSenceMessage = "";
  for (const keyword in keyswordsSenceStore) {
    // console.log("sence", keyswordsSenceStore[keyword])

    const info = rmBreakLine(
      keyswordsSenceStore[keyword]["description"].trim()
    );

    keywordsSenceMessage += `Info about "${keyword}" - ${info}. `;
  }

  logger.log("keywordsSenceMessage", keywordsSenceMessage);

  endTime = process.hrtime(startTime);

  // get process time in seconds
  console.log(`WikiTime: ${(endTime[0] + endTime[1] / 1e9).toFixed(3)}s`);

  const googleData = await googleSearch(query);
  // logger.log("googleData:\n", googleData.length, true);

  let googleDataInformation = "";

  for (const item of googleData) {
    googleDataInformation += `"${item.title}" - ${item.description}. `;
  }

  logger.log("googleDataInformation", googleDataInformation);

  const summaryData = await summarize(googleDataInformation, 2);
  logger.log("summary", summaryData.summary);

  const message = `This is my query: "${query}". This is provided information about words in my query: "${keywordsSenceMessage}". This is provided information from Google search: "${summaryData.summary}". Write an answer to the request using(optional) the provided information.`;

  const response = await sendMessageToChat(
    message,
    "You are a helpful assistant."
  );

  //  console.log("response:\n", response.choices[0].message.content);
  logger.log("Response:");
  logger.log(cutIncompleteMessage(response.choices[0].message.content));
};

main();
