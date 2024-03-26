const Queue = require("bull");
const { smartQuery } = require("./smart-query.js");
const { bot } = require("./bot.js");

const useQueue = () => {
  const handleTaskQueue = new Queue("task-handler", {
    redis: {
      // host: "redis",
      port: 6379,
    },
  });

  handleTaskQueue.process(async (job, done) => {
    const { query, messageId } = job.data;

    console.log("start queue query", query, messageId);

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

    const result = await smartQuery({ query, messageId }).catch((error) => {
      // clearInterval(loaderAnimation);
      console.log("queue error", error);

      return "Sorry, the request could not be processed, please try again.";
    });

    if (messageId) {
      bot.telegram.editMessageText(100718421, messageId, undefined, result);
    }

    console.log("queue result", result);
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
