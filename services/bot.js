const { Telegraf } = require("telegraf");
const config = require("../config");
// const { makeQueryToLLM } = require("./gpt");
const { getTranslatedText } = require("./translate");

const useBot = () => {
  const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

  const startBot = () => {
    bot.start((ctx) => {
      console.log("start ctx", ctx);
      ctx.reply("Привіт!");
    });

    bot.launch({}, () => {
      console.log("onLaunch");

      bot.telegram.sendMessage(
        100718421,
        'hello',
        // await getTranslatedText({
        //   from: "en",
        //   to: "uk",
        //   text: response,
        // }),
        {
          parse_mode: "HTML",
        }
      );
    });

    console.log("Bot started");
  };

  return {
    bot,
    startBot,
  };
};

module.exports = useBot();
