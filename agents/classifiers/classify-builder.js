const { StructuredOutputParser } = require("langchain/output_parsers");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RunnableSequence } = require("@langchain/core/runnables");
const { chatModel } = require("../../services/gpt");
const { logger } = require("../../services/logger");

// const TRY_LIMIT = 1;

const classifyBuilder = (systemMessage, answers, options) => {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    type: {
      type: "enum",
      options: answers,
      description: "type of the QUERY",
    },
  });

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `{systemMessage}. You can use only the following {answers}. {formatInstructions}. QUERY: {input}`
    ),
    chatModel,
    parser,
  ]);

  //   console.log("format instructions", parser.getFormatInstructions());

  const classify = async (input) => {
    logger.log("start classify", { input });
    let result = {};

    const stream = await chain.stream({
      systemMessage,
      answers: answers.join(", "),
      input,
      formatInstructions: parser.getFormatInstructions(),
    });

    // Stream a diff as JSON patch operations
    for await (const chunk of stream) {
      logger.log("chunk", chunk);
      result = { ...result, ...chunk };
    }

    logger.log("res", { result });

    return answers.includes(result.type) ? result.type : "unknown";
  };

  return classify;
};

module.exports = {
  classifyBuilder,
};
