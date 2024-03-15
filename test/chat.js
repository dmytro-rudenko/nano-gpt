const { makeQueryToLLM } = require("../services/gpt.js");

const test = async () => {
  console.log(await makeQueryToLLM({ message: "Where is Harry Potter leave when he was a child?" }));
};

test();