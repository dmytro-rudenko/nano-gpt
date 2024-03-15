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
      `{systemMessage}. \nYou can use only the following {answers}. \n{formatInstructions}. \nQUERY: {input}`
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

// const test = async () => {
//   try {
//     const classify = newClassifyBuilder(
//       "Determine type from the query whether it is a request for information or a task to be performed",
//       ["request", "task"]
//     );

//     const result = await classify("send a message to these people");

//     console.log("result", typeof result, result);
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// test();

module.exports = {
  classifyBuilder,
};
