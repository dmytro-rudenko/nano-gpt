const { classifyBuilder } = require("./classify-builder");

const requestClassify = async (query) =>
  classifyBuilder(
    "Determine from the query whether this is an abstract query that does not require information from the Internet, or whether it is a query that can be found with an exact answer on the Internet.",
    ["abstract", "precisely"],
  )(query);

module.exports = {
  requestClassify,
};
