const { useGpt } = require("../services/gpt");

const tasksTypes = ["request", "task"];

const retry = (maxCount, callback) => {
    return async (...args) => {
        let count = 0;
        while (count < maxCount) {
            console.log("retrying...", count);
            try {
                const res = await callback(...args);

                return res;
            } catch (e) {
                count++;
            }
        }
    };
}

const queryClassify = async (query) => {
  const { pipeline } = await useGpt();
  const { response } = await pipeline(
    query,
    'You are a classification specialist. Your task is to determine from the text whether it is a request for information or a task to be performed. You can answer only "request" or "task".'
  );

  const type = response.choices[0].message.content
  if (tasksTypes.includes(type)) {
    return type
  } else {
    throw new Error("Incorrect classification");
  }
};

const test = async () => {
  const result = await retry(3, queryClassify)("send a message to these people")
  console.log("test result", result);

  const result2 = await retry(3, queryClassify)("What is the meaning of life?");
  console.log("test result2", result2);

  const result3 = await retry(3, queryClassify)("Who is Steve Jobs?");
  console.log("test result3", result3);

  const result4 = await retry(3, queryClassify)("Write a poem about cats");
  console.log("test result4", result4);
};

test();
