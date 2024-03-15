const { classifyBuilder } = require("./classify-builder");

const queryClassify = async (query) =>
  classifyBuilder(
    "Determine from the text whether it is a request for information or a task to be performed.",
    ["request", "task"]
  )(query);

module.exports = {
  queryClassify,
};
