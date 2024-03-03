const axios = require("axios");
const { cache } = require("./cache");

const googleSearch = async (prompt) => {
  try {
    const cacheKey = `google-search-${prompt}`;
    const cachedResponse = await cache.get(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    console.log("google search:", prompt);
    const response = await axios.post("http://127.0.0.1:3000/ask", {
      prompt,
      site: "google",
      model: "search",
    });

    const result = JSON.parse(response.data.content)
      .map(({ description, title }) => ({
        title,
        description,
      }))
      .filter((item) => item.description !== "N/A");

    await cache.set(cacheKey, result);

    return result
  } catch (error) {
    console.log("Error", error);
    return false;
  }
};

// const test = async () => {
//   const result = await googleSearch("Who is Steve Jobs?");
//   console.log("test result", result);
// };

// test();

module.exports = {
  googleSearch,
};
