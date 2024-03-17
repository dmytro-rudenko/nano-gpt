const Queue = require("bull");
const { smartQuery } = require("./smart-query.js");
const { bot } = require("./bot.js");

const useQueue = (model) => {
  const handleTaskQueue = new Queue("task-handler");

  handleTaskQueue.process(async (job, done) => {
    const { query, messageId } = job.data;

    let dots = "";

    const loaderAnimation = setInterval(() => {
      if (dots.length === 3) {
        dots = "";
      }

      dots += ".";

      // bot.telegram.sendMessage(100718421, result, {
      //   parse_mode: "HTML",
      // });
    }, 1000);

    const result = await smartQuery({ query, messageId }).catch(() => {
      clearInterval(loaderAnimation);

      return "Sorry, the request could not be processed, please try again.";
    });

    bot.telegram.sendMessage(100718421, result, {
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

module.exports = useQueue();
