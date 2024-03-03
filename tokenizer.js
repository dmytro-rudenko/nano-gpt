const natural = require("natural");
const stopword = require("stopword");
const tokenizer = new natural.WordTokenizer();

const getKeysFromQuery = (userQuery) => {
  const keywords = tokenizer.tokenize(userQuery);

  return {
    keywords: stopword.removeStopwords(keywords),
  };
};

// const test = () => {
//   const result = getKeysFromQuery("Who is Steve Jobs?");
//   console.log("test result", result);
// };

// test();

module.exports = {
  getKeysFromQuery,
};
