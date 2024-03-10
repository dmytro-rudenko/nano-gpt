const { message } = require("telegraf/filters");
const { bot } = require("./services/bot.js");
const { useQueue } = require("./services/queue.js");
const path = require("path");
const { loadModel } = require("gpt4all");
const main = async () => {
  const model = await loadModel("mistral-7b-openorca.gguf2.Q4_0.gguf", {
    verbose: true,
    modelPath: path.join(__dirname, "models"),
  });

  const { handleTaskQueue, clearQueue } = await useQueue(model);
  await clearQueue();
  
  bot.help((ctx) => ctx.reply("Вітаємо!"));
  bot.on(message("text"), async (ctx) => {
    console.log("ctx", ctx.update.message.chat);
    handleTaskQueue.add({ query: ctx.update.message.text });
    ctx.reply("Трішки часу... Думаю над відповідю...");
  });

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};

main();
