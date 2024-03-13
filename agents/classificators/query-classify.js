const { classifyBuilder } = require("./classify-builder");

const queryClassify = async (query) =>
  classifyBuilder(
    "You are a classification specialist. Your task is to determine from the text whether it is a request for information or a task to be performed.",
    ["request", "task"]
  )(query);

// const test = async () => {
//   const result = await queryClassify("send a message to these people")
//   console.log("test result", result);

//   const result2 = await queryClassify("What is the meaning of life?");
//   console.log("test result2", result2);

//   const result3 = await queryClassify("Who is Steve Jobs?");
//   console.log("test result3", result3);

//   const result4 = await queryClassify("Write a poem about cats");
//   console.log("test result4", result4);
// };

// test();

module.exports = {
  queryClassify,
};
