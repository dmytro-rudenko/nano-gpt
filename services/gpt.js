const { ChatOllama } = require("@langchain/community/chat_models/ollama");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { logger } = require("./logger");
const { bot } = require("./bot.js");

const DEFAULT_PROMPT_CONTEXT = {
  temp: 0.7,
  topK: 40,
  topP: 0.4,
  repeatPenalty: 1.18,
  repeatLastN: 64,
  nBatch: 8,
  maxTokens: 1028,
};

const SYMBOLS = [".", "?", "!"];

const MODEL = 'mistral';

const MODEL_SETTINGS = {
  // baseUrl: "http://ollama:11434",
  // model: "qwen:0.5b-chat",
  // model: "tinyllama:chat",
  // model: "gemma:2b",
  // model: 'llama2:7b',
  // model: "mistral",
  model: MODEL
};

const getModel = (modelParams) => {
  const model = new ChatOllama(MODEL_SETTINGS);

  return modelParams ? model.bind(modelParams) : model;
};

const useGpt = () => {
  const controller = new AbortController();

  const chatModel = getModel({
    signal: controller.signal,
  });

//  abort requests if process is killed
    process.on("SIGINT", () => {
      controller.abort();
      process.exit(0);
    });

  const sendGpt = async (messages, options) => {
    const randomID = Math.floor(Math.random() * 1000000);
    const id = options.messageId || randomID;
    console.log("STARTED ID:" + id, {
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

    const streamInfo = setInterval(async () => {
      if (options.messageId && result !== "") {
        bot.telegram.editMessageText(
          100718421,
          options.messageId,
          undefined,
          result + "... "
        );
      }
      if (options.logToBot && !options.messageId && result !== "") {
        const message = await bot.telegram.sendMessage(100718421, result + "... ");
        console.log("message", message);
        options.messageId = message.message_id;
      }

    }, 3000);

    for await (const chunk of stream) {
      if (chunk.content) {
        // console.log("chunk", chunk);
        result += chunk.content;
        logger.log(`processing ID:${id} `, result);
      }
    }

    clearInterval(streamInfo);
    console.log("FINISHED ID:" + id, result);

    return result;
  };

  const makeQueryToLLM = async ({ message, options }) => {
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
        ...options,
      }
    );

    // logger.log("usage", response.usage);
    // logger.log("response:\n", response);

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
    makeQueryToLLM,
  };
};

module.exports = useGpt();
