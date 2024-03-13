const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    OPENAI_KEY : process.env.OPENAI_KEY,
    TELEGRAM_BOT_TOKEN : process.env.TELEGRAM_BOT_TOKEN
}