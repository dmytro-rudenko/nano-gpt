const { smartQuery } = require("../services/smart-query.js");

const test = async () => {
    const result = await smartQuery("В чому сенс життя?")
    console.log("test result", result);

    // const result2 = await smartQuery("Поясни детальніше")

    // console.log("test result2", result2);
}

test()