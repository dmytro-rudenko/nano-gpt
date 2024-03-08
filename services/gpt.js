const { createCompletion, loadModel } = require("gpt4all/src/gpt4all.js");
const path = require("path");
const { logger } = require("./logger");

const DEFAULT_PROMPT_CONTEXT = {
  temp: 0.7,
  topK: 40,
  topP: 0.4,
  repeatPenalty: 1.18,
  repeatLastN: 64,
  nBatch: 8,
};

const symbols = [".", "?", "!"];

const useGpt = async () => {
  const model = await loadModel("mistral-7b-openorca.gguf2.Q4_0.gguf", {
    verbose: true,
    modelPath: path.join(__dirname, "models"),
  });

  const sendMessageToChat = async (message, systemPrompt) => {
    logger.log("sendMessage:", message);

    const sendStartTime = process.hrtime();

    const response = await createCompletion(
      model,
      [
        {
          role: "user",
          content: message,
        },
      ],
      {
        ...DEFAULT_PROMPT_CONTEXT,
        systemPromptTemplate: systemPrompt,
      }
    );

    logger.log("usage", response.usage);
    // console.log("response:\n", response.choices[0].message.content);

    const sendEndTime = process.hrtime(sendStartTime);
    // get process time in seconds
    console.log(`Time: ${(sendEndTime[0] + sendEndTime[1] / 1e9).toFixed(3)}s`);

    return response;
  };

  const cutIncompleteMessage = (message) => {
    let result = message;
    // if sentence ends without ".", "?", or "!", cut it
  
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
        result = message.substring(0, lastSymbolIndex + 1);
        break;
      }
    }
  
    result = message.trim()
  
    if (result.length === 0) {
      logger.log("empty-result", message);
  
      return message;
    }
  
    return result;
  };

  return {
    model,
    cutIncompleteMessage,
    sendMessageToChat,
  };
};

module.exports = {
  useGpt,
};
