const axios = require("axios");

const getTranslatedText = async (params) => {
  // return params.text;
  try {
    const response = await axios.get(
      `https://translate.googleapis.com/translate_a/single`,
      {
        params: {
          client: "gtx",
          sl: params.from,
          tl: params.to,
          dt: "t",
          q: params.text,
        },
      }
    );

    if (response.data && response.data[0]) {
      const translatedTextArray = response.data[0];
      let fullTranslatedText = "";

      translatedTextArray.forEach((sentence) => {
        if (sentence && sentence[0] && typeof sentence[0] === "string") {
          fullTranslatedText += sentence[0] + " ";
        }
      });

      fullTranslatedText = fullTranslatedText.trim();
      return fullTranslatedText;
    } else {
      return ""; // or handle error as needed
    }
  } catch (error) {
    console.error(error);
    return ""; // or handle error as needed
  }
};

const test = async () => {
  const result = await getTranslatedText({
    from: "en",
    to: "uk",
    text: process.argv[2],
  });
  console.log("test result", result);
};

if (process.argv[2]) {
  test();
}

module.exports = {
  getTranslatedText,
};
