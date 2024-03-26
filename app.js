const { message } = require("telegraf/filters");
const { bot, startBot } = require("./services/bot.js");
const { handleTaskQueue, clearQueue } = require("./services/queue.js");

const main = async () => {
  startBot()
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

//  Enable graceful stop
  process.once("SIGINT", () => {
    console.log("Stopping...");
    bot.stop("SIGINT");
    clearQueue();
    process.exit(0);
  });
  process.once("SIGTERM", () => {
    console.log("Stopping...");
    bot.stop("SIGTERM");
    clearQueue();
    process.exit(0);
  });
};

main()
  // .then(() => {
  //   console.log("Bot init done");
  // })
  .catch((err) => console.log(err));
