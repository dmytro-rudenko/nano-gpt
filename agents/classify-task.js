const { useGpt } = require("../services/gpt");

const tasksTypes = [
    "question",
    "task",
    "parse"
]

const classifyTask = async (query) => {
    const { pipeline } = await useGpt();
    const { response } = await pipeline(query, "You are a helpful assistant.");
    return response;
}