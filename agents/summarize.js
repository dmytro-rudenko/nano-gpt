const { makeQueryToLLM } = require("../services/gpt.js");
const { getTranslatedText } = require("../services/translate.js");

const summarize = async ({ text }) => {
  const result = await makeQueryToLLM({
    message: `${text}`,
    options: {
      systemPrompt: `Your task is to read the provided text carefully and generate a concise summary that captures the key points and most important information from the original text. 2-3 sentences are enough.

      The summary should:
      - Be clear, coherent, and easy to understand
      - Capture the main ideas, topics, and key details from the original text
      - Omit unnecessary details or redundant information
      - Be an objective summary, without adding your own opinions or interpretations
      
      Your response should be formatted as a JSON object with one key:
      
      "summarizedText" - Your concise summary of the key points and most important information
      
      The JSON response should look like this:
      
      {{
        "summarizedText": "(insert your summarized text here)"
      }}`,
      temp: 0,
      maxTokens: 100,
    },
  });

  try {
    const res = JSON.parse(result.response);

    console.log("Summarize:", res);
    console.log(
      "Summarize result",
      await getTranslatedText({
        from: "en",
        to: "uk",
        text: res.summarizedText,
      })
    );
  } catch (error) {
    console.log("Summarize error:", error);
  }
};

const test = async () => {
  await summarize({
    text: await getTranslatedText({
      from: "uk",
      to: "en",
      text: `JavaScript - це мова програмування, яка робить веб-сайти інтерактивними. Коли ви відвідуєте веб-сайт і бачите речі, такі як анімовані кнопки, форми, які перевіряють ваш ввід або зображення, які змінюються, коли ви на них клацнете, то часто це завдяки JavaScript. 

      У веб-браузерах JavaScript складається з трьох основних частин:
      
      ECMAScript надає основну функціональність.
      Об'єктна модель документу (DOM) надає інтерфейси для взаємодії з елементами на веб-сторінках.
      Об'єктна модель браузера (BOM) надає API браузера для взаємодії з веб-браузером.
      
      JavaScript дозволяє додавати інтерактивність на веб-сторінку. Зазвичай ви використовуєте JavaScript разом з HTML і CSS, щоб покращити функціональність веб-сторінки, таку як перевірка форм, створення інтерактивних карт та відображення анімованих графіків.
      
      Коли веб-сторінка завантажується, тобто після завантаження HTML і CSS, мотор JavaScript у веб-браузері виконує JavaScript-код. Потім JavaScript-код модифікує HTML і CSS, щоб динамічно оновити інтерфейс користувача.
      
      Мотор JavaScript - це програма, яка виконує JavaScript-код. Спочатку мотори JavaScript були реалізовані як інтерпретатори.
      
      Однак сучасні мотори JavaScript, як правило, реалізовані як компілятори "під час виконання" (just-in-time compilers), які компілюють JavaScript-код в байткод для покращення продуктивності.`,
    }),
  });
};

test();
