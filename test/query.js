const { smartQuery } = require("../services/smart-query.js");

const test = async () => {
    const result = await smartQuery({
        query: "What is the meaning of life?",
    })
    console.log("test result", result);

    // const result2 = await smartQuery("Поясни детальніше")

    // console.log("test result2", result2);
}

test()