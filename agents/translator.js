const { makeQueryToLLM } = require("../services/gpt.js");

const translator = async ({ text, from, to }) => {
  const result = await makeQueryToLLM({
    message: `Please translate this text: ${text}`,
    options: {
      systemPrompt: `Translate the following text from ${from} to ${to}. You are best translator in the world. The response should be in JSON format and include the original text and the translated text. And here's how the response should look like: {{ "originalText": "${text}", "translatedText": "translated_text"}}`,
      temp: 0,
    },
  });

  try {
    const res = JSON.parse(result.response)

    console.log("translator result", res.translatedText);
  } catch (error) {
    console.log("translator error", error);
  }
};

const test = async () => {
  await translator({
    text: "Hello, my name is John and I'm 25 years old.",
    from: "en",
    to: "ukr",
  });

  await translator({
    text: "I love Ukraine. I live in London. I am 25 years old.",
    from: "en",
    to: "ru",
  })

  await translator({
    text: "What we drink today? We drink coffee.",
    from: "en",
    to: "de",
  })
}

test()