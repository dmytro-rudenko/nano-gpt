const { createCompletion } = require("gpt4all/src/gpt4all.js");
const { OpenAI } = require("openai");
const { logger } = require("./logger");

const DEFAULT_PROMPT_CONTEXT = {
  temp: 0.7,
  topK: 40,
  topP: 0.4,
  repeatPenalty: 1.18,
  repeatLastN: 64,
  nBatch: 8,
};

const API_KEY = "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";

const openai = new OpenAI({
  apiKey: API_KEY,
});

const MODEL_TYPE = "chatgpt";
const symbols = [".", "?", "!"];

const useGpt = async (model) => {
  const sendToLocalModel = async (messages, opts) => {
    // rm first message
    messages.shift();
    const response = await createCompletion(model, messages, opts);
    return response;
  };

  const sendToChatGpt = async (messages, opts, options) => {
    // console.log("opts", opts);
    const promptMessages = [
      {
        role: "system",
        content: opts.systemPromptTemplate,
      },
    ].concat(messages);
    // logger.log("messages", promptMessages);
    const config = {
      temperature: 1.0,
      max_tokens: 512,
      model: "gpt-3.5-turbo-0613",
      messages: promptMessages,
      ...options,
    };

    // console.log("config", JSON.stringify(config, null, 2));

    const completion = await openai.chat.completions.create(config);

    // logger.log("completion", completion);

    return completion;
  };

  const sendGpt = async (messages, opts, type, openai) => {
    if (type === "local") {
      return sendToLocalModel(messages, opts);
    } else if (type === "chatgpt") {
      return sendToChatGpt(messages, opts, openai);
    }
  };

  const sendMessageToChat = async ({ message, systemPrompt, options }) => {
    logger.log("sendMessage:", message);

    const sendStartTime = process.hrtime();

    const response = await sendGpt(
      [
        {
          role: "user",
          content: message,
        },
      ],
      {
        ...DEFAULT_PROMPT_CONTEXT,
        systemPromptTemplate: systemPrompt,
      },
      MODEL_TYPE,
      options
    );

    // logger.log("usage", response.usage);
    // logger.log("response:\n", response);

    const sendEndTime = process.hrtime(sendStartTime);
    // get process time in seconds
    // logger.log(`Time: ${(sendEndTime[0] + sendEndTime[1] / 1e9).toFixed(3)}s`);

    return { response };
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

    result = message.trim();

    if (result.length === 0) {
      // logger.log("empty-result", message);

      return message;
    }

    return result;
  };

  const pipeline = async ({ message, systemPrompt }) => {
    let messages = [];

    // logger.log("pipeline", message);
    const send = async (msg) => {
      messages.push({
        role: "user",
        content: msg,
      });

      const response = await sendGpt(
        messages,
        {
          ...DEFAULT_PROMPT_CONTEXT,
          systemPromptTemplate: systemPrompt,
        },
        MODEL_TYPE
      );

      if (!messages[0].role === "system") {
        messages = [
          {
            role: "system",
            content: systemPrompt,
          },
        ].concat(messages);
      }

      messages.push({
        role: "assistant",
        content: response.choices[0].message.content,
      });

      // logger.log("dialog", JSON.stringify(messages, null, 2));

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
    model,
    pipeline,
    cutIncompleteMessage,
    sendMessageToChat,
  };
};

module.exports = {
  useGpt,
};
