const { Telegraf } = require("telegraf");
const config = require("../config");
const { makeQueryToLlm } = require("./gpt");
const { getTranslatedText } = require("./translate");

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => ctx.reply("Привіт!"));

const start = async () => {
  bot.launch();
  //   const { response } = await makeQueryToLlm({
  //     message: "Who are you? Tell detailed information",
  //     options: {
  //         max_tokens: 10
  //     }
  //   });
  const response = "hello";

  bot.telegram.sendMessage(
    100718421,
    await getTranslatedText({
      from: "en",
      to: "uk",
      text: response,
    }),
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
