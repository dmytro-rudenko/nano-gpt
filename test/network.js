const axios = require("axios");

const test = async () => {
  const result = await axios.get("https://www.google.com").catch((err) => {
    console.log(err);
    return err.response;
  });

  console.log("google status", result.status);

  const result2 = await axios.get("http://127.0.0.1:11434").catch((err) => {
    //  console.log(err);
    console.log(err);
    return err.response;
  });

  if (result2) {
    console.log("127 status", result2.status);
    console.log("data", result2.data);
  }

  const result3 = await axios.get("http://localhost:11434/").catch((err) => {
    console.log(err);
    return err.response;
  });

  if (result3) {
    console.log("localhost status", result3.status);
    console.log("data", result3.data);
  }

  const result4 = await axios.get("http://0.0.0.0:11434").catch((err) => {
    console.log(err);
    return err.response;
  });

  if (result4) {
    console.log("0.0.0.0 status", result4.status);
    console.log("data", result4.data);
  }
};

test();
