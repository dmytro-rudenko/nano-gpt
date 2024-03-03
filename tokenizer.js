const natural = require("natural");
const stopword = require("stopword");
const tokenizer = new natural.WordTokenizer();

const getKeysFromQuery = (userQuery) => {
  let keywords = tokenizer.tokenize(userQuery);

  keywords =  stopword.removeStopwords(keywords)
  
  // rm duplicates
  keywords = [...new Set(keywords)];

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
