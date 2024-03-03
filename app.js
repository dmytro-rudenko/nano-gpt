const { getWikiSummary } = require("./wiki.js");
const { googleSearch } = require("./google-search.js");
const { summarize } = require("./summarize.js");
const { useGpt } = require("./gpt.js");
const { getKeysFromQuery } = require("./tokenizer.js");
const logger = require("./logger.js");
let retryCounter = 0;
const MAX_RETRY = 3;

const cutIncompleteMessage = (message) => {
  let result = message;
  // if sentence ends without ".", "?", or "!", cut it
  const symbols = [".", "!", "?"];

  if (symbols.every((symbol) => message.endsWith(symbol))) {
    return result;
  }

  // if in message only one sentence, without ".", "?", or "!" - send message
  if (symbols.every((symbol) => !message.includes(symbol))) {
    return result;
  }

  for (const symbol of symbols) {
    if (!message.endsWith(symbol)) {
      const lastSymbolIndex = message.lastIndexOf(symbol);
      message = message.substring(0, lastSymbolIndex + 1);
      break;
    }
  }

  result = message;

  return result.trim()
};

const rmBreakLine = (message) => {
  return message.replace(/(\r\n|\n|\r)/gm, "");
};

const main = async () => {
  const { sendMessageToChat } = await useGpt();

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
    logger.log("summary", keyword, "completed");
  }

  let keywordsSenceMessage = "";
  for (const keyword in keyswordsSenceStore) {
    // console.log("sence", keyswordsSenceStore[keyword])

    const info = rmBreakLine(keyswordsSenceStore[
        keyword
      ]["description"].trim())

    keywordsSenceMessage += `Info about "${keyword}" - ${info}. `;
  }

  logger.log("keywordsSenceMessage", keywordsSenceMessage);

  endTime = process.hrtime(startTime);

  // get process time in seconds
  console.log(`WikiTime: ${(endTime[0] + endTime[1] / 1e9).toFixed(3)}s`);

  const googleData = await googleSearch(query);
  logger.log("googleData:\n", googleData.length);

  let googleDataInformation = "";

  for (const item of googleData) {
    googleDataInformation += `"${item.title}" - ${item.description}. `;
  }

  logger.log("googleDataInformation", googleDataInformation);

  const summaryData = await summarize(googleDataInformation, 2);
  logger.log("summary", summaryData);

  const message = `This is my query: "${query}". This is provided information about words in my query: "${keywordsSenceMessage}". This is provided information from Google search: "${summaryData.summary}". Write an answer to the request using the information I provided.`;

  const response = await sendMessageToChat(
    message,
    "You are a helpful assistant."
  );

  console.log("response:\n", response.choices[0].message.content);
  logger.log(
    "result",
    cutIncompleteMessage(response.choices[0].message.content)
  );
};

main();
