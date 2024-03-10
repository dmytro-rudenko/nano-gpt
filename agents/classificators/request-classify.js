const { retry } = require("../../utils");
const { classifyBuilder } = require("./classify-builder");

const requestClassify = async (query) =>
  classifyBuilder(
    "You are a query classification expert. Your task is to determine from the text whether this is an abstract query that does not require information from the Internet, or whether it is a query that can be found with an exact answer on the Internet.",
    ["abstract", "precisely"],
    {
      max_tokens: 10,
    }
  )(query);

// const test = async () => {
//   const result = await retry(1, requestClassify)("What is the meaning of life?");
//   console.log("test result", result);

//   // const result2 = await retry(3, requestClassify)("Who is Steve Jobs?");
//   // console.log("test result", result2);
// };

// test();

module.exports = {
  requestClassify: retry(3, requestClassify),
};
