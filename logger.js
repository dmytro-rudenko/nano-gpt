module.exports = {
    log: (key, value, ...args) => {
        const logObject = {
            [key]: value
        }

        if (args.length > 0) {
            logObject.args = args
        }

        console.log(JSON.stringify(logObject, null, 2));
    }
}