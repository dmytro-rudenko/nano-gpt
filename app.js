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
    console.log("ctx", ctx.update.message.chat);
    const message = await ctx.reply("...");

    console.log("message", message);

    handleTaskQueue.add({
      query: ctx.update.message.text,
      messageId: message.message_id,
    });
  });

  // Enable graceful stop
  process.once("SIGINT", () => {
    console.log("Stopping...");
    bot.stop("SIGINT");
  });
  process.once("SIGTERM", () => {
    console.log("Stopping...");
    bot.stop("SIGTERM");
  });
};

main()
  .catch((err) => console.log(err))
  .finally(() => {
    console.log("Bot stopped finally");
  });
