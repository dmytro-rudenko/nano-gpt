const { classifyBuilder } = require("./new-classify-builder");

const requestClassify = async (query) =>
  classifyBuilder(
    "Determine from the query whether this is an abstract query that does not require information from the Internet, or whether it is a query that can be found with an exact answer on the Internet.",
    ["abstract", "precisely"],
  )(query);

// const test = async () => {
//   const result = await requestClassify("What is the meaning of life?");
//   console.log("test result", result);

//   const result2 = await requestClassify("Who is Steve Jobs?");
//   console.log("test result", result2);
// };

// test();

module.exports = {
  requestClassify,
};
