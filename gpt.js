const { createCompletion, loadModel } = require("gpt4all/src/gpt4all.js");
const path = require("path");
const logger = require("./logger");

const DEFAULT_PROMPT_CONTEXT = {
  temp: 0.7,
  topK: 40,
  topP: 0.4,
  repeatPenalty: 1.18,
  repeatLastN: 64,
  nBatch: 8,
};

const useGpt = async () => {
  const model = await loadModel("mistral-7b-openorca.gguf2.Q4_0.gguf", {
    verbose: true,
    modelPath: path.join(__dirname, "models"),
  });

  const sendMessageToChat = async (message, systemPrompt) => {
    logger.log("send message:", message);

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

  return {
    model,
    sendMessageToChat,
  };
};

module.exports = {
    useGpt,
};
