const Queue = require("bull");
const { smartQuery } = require("./smart-query.js");
const { bot } = require("./bot.js");

const useQueue = async (model) => {
  const handleTaskQueue = new Queue("task-handler");

  handleTaskQueue.process(async (job, done) => {
    const { query } = job.data;
    const result = await smartQuery(query, model);
    // send result to bot
    let message = `Ось відповідь на ваш запит:\n\n"${query}"\n\n`;

    if (result) {
      message += result;
    }

    bot.telegram.sendMessage(100718421, message, {
      parse_mode: "HTML",
    });
    done(null, result);
  });

  // clear queue
  const clearQueue = async () => {
    await handleTaskQueue.empty();
  };

  return {
    handleTaskQueue,
    clearQueue,
  };
};

module.exports = {
    useQueue
};
