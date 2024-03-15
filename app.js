const { message } = require("telegraf/filters");
const { bot } = require("./services/bot.js");
const { handleTaskQueue, clearQueue } = require("./services/queue.js");

const main = async () => {
  await clearQueue();

  // bot.help(async (ctx) =>
  //   ctx.reply(
  //     await makeQueryToLLM({
  //       message: "Who are you? Tell detailed information",
  //     })
  //   )
  // );

  bot.on(message("text"), async (ctx) => {
    // console.log("ctx", ctx.update.message.chat);
    const message = await ctx.reply('...')

    console.log("message", message);

    handleTaskQueue.add({ query: ctx.update.message.text, messageId: message.message_id });
  });

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};

main();
