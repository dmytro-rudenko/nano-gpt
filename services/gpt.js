// const { createCompletion } = require("gpt4all/src/gpt4all.js");
const { ChatOllama } = require("@langchain/community/chat_models/ollama");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
// const { ChatOpenAI } = require("@langchain/openai");
const { logger } = require("./logger");
// const config = require("../config");

const DEFAULT_PROMPT_CONTEXT = {
  temp: 0.7,
  topK: 40,
  topP: 0.4,
  repeatPenalty: 1.18,
  repeatLastN: 64,
  nBatch: 8,
};

// const API_KEY = config.OPENAI_KEY;
// const MODEL_TYPE = "local";
const SYMBOLS = [".", "?", "!"];
const MODEL_SETTINGS = {
  baseUrl: "http://localhost:11434",
  model: "gemma:2b",
  // model: 'llama2:7b',
  // model: "mistral",
};

const useGpt = () => {
  const getModel = (modelParams) => {
    const model = new ChatOllama(MODEL_SETTINGS);

    return modelParams ? model.bind(modelParams) : model;
  };

  const chatModel = getModel();

  // if (MODEL_TYPE === "chatgpt") {
  //   chatModel = new ChatOpenAI({
  //     openAIApiKey: API_KEY,
  //     modelName: "gpt-3.5-turbo",
  //   })
  // }

  const sendGpt = async (messages, options) => {
    const randomID = Math.floor(Math.random() * 1000000);
    console.log("STARTED ID: " + options.messageId, {
      messages,
      options,
    });

    let promptMessages = [];

    if (options.systemPrompt) {
      promptMessages.push(["system", options.systemPrompt]);
    }

    messages.forEach(({ role, content }) => {
      promptMessages.push([role, content]);
    });

    const prompt = ChatPromptTemplate.fromMessages(promptMessages);

    const chain = prompt.pipe(chatModel);
    const stream = await chain.stream();

    let result = "";

    for await (const chunk of stream) {
      if (chunk.content) {
        result += chunk.content;
        bot.telegram.editMessageText(100718421, options.messageId, undefined, result);
        console.log(`processing ID${randomID}: `, chunk.content);
      }
    }

    console.log("FINISHED ID" + options.messageId, result);

    return result;
  };

  const makeQueryToLlm = async ({ message, options }) => {
    logger.log("sendMessage:", {
      message,
      options,
    });

    // const sendStartTime = process.hrtime();

    const response = await sendGpt(
      [
        {
          role: "user",
          content: message,
        },
      ],
      {
        temp: 0,
        // ...DEFAULT_PROMPT_CONTEXT,
        ...options,
      }
    );

    // logger.log("usage", response.usage);
    // logger.log("response:\n", response);

    // const sendEndTime = process.hrtime(sendStartTime);
    // get process time in seconds
    // logger.log(`Time: ${(sendEndTime[0] + sendEndTime[1] / 1e9).toFixed(3)}s`);

    return { response };
  };

  const cutIncompleteMessage = (message) => {
    let result = message;
    // if sentence ends without ".", "?", or "!", cut it

    if (SYMBOLS.every((symbol) => message.endsWith(symbol))) {
      return result;
    }

    // if in message only one sentence, without ".", "?", or "!" - send message
    if (SYMBOLS.every((symbol) => !message.includes(symbol))) {
      return result;
    }

    for (const symbol of SYMBOLS) {
      if (!message.endsWith(symbol)) {
        const lastSymbolIndex = message.lastIndexOf(symbol);
        result = message.substring(0, lastSymbolIndex + 1);
        break;
      }
    }

    result = message.trim();

    if (result.length === 0) {
      // logger.log("empty-result", message);

      return message;
    }

    return result;
  };

  const pipeline = async ({ message, systemPrompt, options }) => {
    let messages = [];

    // logger.log("pipeline", message);
    const send = async (msg) => {
      messages.push({
        role: "user",
        content: msg,
      });

      const response = await sendGpt(messages, {
        // ...DEFAULT_PROMPT_CONTEXT,
        systemPromptTemplate: systemPrompt,
        ...options,
      });

      messages.push({
        role: "assistant",
        content: response,
      });

      return {
        response,
        messages,
      };
    };

    const clearPipeline = () => {
      messages.length = 0;
    };

    const { response } = await send(message);

    return {
      response,
      messages,
      send,
      clearPipeline,
    };
  };

  return {
    chatModel,
    getModel,
    pipeline,
    cutIncompleteMessage,
    makeQueryToLlm,
  };
};

// const test = async () => {
//   const { makeQueryToLlm } = useGpt();

//   console.log(await makeQueryToLlm({ message: "Who are you? Tell detailed information" }));
// };

// test();

module.exports = useGpt();
