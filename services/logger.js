const logger = {
  log: (key, value, json, ...args) => {
    if (!value && !json && args.length === 0) {
      console.log(key);
      return
    }

    const logObject = {
      [key]: value,
    };

    if (args.length > 0) {
      logObject.args = args;
    }

    if (json) {
      console.log(JSON.stringify(logObject, null, 2));
      return
    }

    console.log(logObject);
  },
};

module.exports = {
  logger,
};
