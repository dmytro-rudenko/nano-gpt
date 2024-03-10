const { useGpt } = require("../../services/gpt");

const classifyBuilder = (prompt, answers, openai) => {
  const classify = async (query) => {
    const { sendMessageToChat } = await useGpt();
    const { response } = await sendMessageToChat({
      message: query,
      systemPrompt: `${prompt} You can answer only ${answers.join(
        ", "
      )}. (Pay attention to this condition, it depends on whether the others will work normally).`,
      openai,
    });

    const answer = response.choices[0].message.content.trim();
    if (answers.includes(answer)) {
      return answer;
    } else {
      throw new Error("Incorrect classification");
    }
  };

  return classify;
};

module.exports = {
  classifyBuilder,
};
