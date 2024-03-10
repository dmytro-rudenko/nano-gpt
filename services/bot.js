const { Telegraf } = require("telegraf");
// const { message } = require("telegraf/filters");
// replace the value below with the Telegram token you receive from @BotFather
const token = "6059954498:AAHKo5u9S7jgBxaMHIHbIPVJlnVljXfK4I8";

const bot = new Telegraf(token);
bot.start((ctx) => ctx.reply("Привіт!"));
bot.launch();

bot.telegram.sendMessage(100718421, 'Вітаємо', {
    parse_mode: "HTML",
});
module.exports = {
    bot,
}