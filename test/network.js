const axios = require("axios");

const test = async () => {
  const result = await axios.get("https://www.google.com").catch((err) => {
    console.log(err);
    return err.response;
  });

  console.log("google status", result.status);

  const ollamaResult = await axios.get("http://ollama:11434").catch((err) => {
    console.log(err);
    return err.response;
  })

  if (ollamaResult) {
    console.log("ollama status", ollamaResult.status);
    console.log("data", ollamaResult.data);
  }

  const result2 = await axios.get("http://127.0.0.1:11434").catch((err) => {
    //  console.log(err);
    console.log(err);
    return err.response;
  });

  if (result2) {
    console.log("127 status", result2.status);
    console.log("data", result2.data);
  }
};

test();
