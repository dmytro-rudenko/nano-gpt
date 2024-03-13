const { Telegraf } = require("telegraf");
const config = require("../config");

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => ctx.reply("Привіт!"));
bot.launch();

bot.telegram.sendMessage(100718421, 'Вітаємо', {
    parse_mode: "HTML",
});
module.exports = {
    bot,
}