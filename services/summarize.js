const { SummarizerManager } = require("node-summarizer");

const summarize = (text, count) => {
    const Summarizer = new SummarizerManager(text, count);
    return Summarizer.getSummaryByFrequency();
}

module.exports = {
    summarize
}