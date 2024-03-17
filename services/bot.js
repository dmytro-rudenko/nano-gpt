const { Telegraf } = require("telegraf");
const config = require("../config");
const { makeQueryToLLM } = require("./gpt");
const { getTranslatedText } = require("./translate");

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => ctx.reply("Привіт!"));

const start = () => {
  bot.launch({
    webhook: {
      domain: "https://api.telegram.org/bot6059954498:AAHKo5u9S7jgBxaMHIHbIPVJlnVljXfK4I8/setWebhook",
    },
  });
  //   const { response } = await makeQueryToLLM({
  //     message: "Who are you? Tell detailed information",
  //     options: {
  //         max_tokens: 10
  //     }
  //   });
  const response = "hello";

  bot.telegram.sendMessage(
    100718421,
    response,
    // await getTranslatedText({
    //   from: "en",
    //   to: "uk",
    //   text: response,
    // }),
    {
      parse_mode: "HTML",
    }
  );

  console.log("Bot started");
};

start();

module.exports = {
  bot,
};
