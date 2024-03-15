const {
  classifyBuilder,
  queryClassify,
  requestClassify,
} = require("../agents/classifiers");

const mainTest = async () => {
  const test = async () => {
    try {
      const classify = classifyBuilder(
        "Determine type from the query whether it is a request for information or a task to be performed",
        ["request", "task"]
      );

      const result = await classify("send a message to these people");

      console.log("result", typeof result, result);
    } catch (error) {
      console.log("error", error);
    }
  };

  await test();

  const test2 = async () => {
    const result2 = await queryClassify("What is the meaning of life?");
    console.log("test result2", result2);

    const result3 = await queryClassify("Who is Steve Jobs?");
    console.log("test result3", result3);

    const result4 = await queryClassify("Write a poem about cats");
    console.log("test result4", result4);
  };

  await test2();

  const test3 = async () => {
    const result = await requestClassify("What is the meaning of life?");
    console.log("test result", result);

    const result2 = await requestClassify("Who is Steve Jobs?");
    console.log("test result", result2);
  };

  await test3();
};

mainTest();
