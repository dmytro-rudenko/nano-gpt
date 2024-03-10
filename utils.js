const retry = (maxCount, callback) => {
    return async (...args) => {
        let count = 0;
        while (count < maxCount) {
            console.log("retrying...", count);
            try {
                const res = await callback(...args);

                return res;
            } catch (e) {
                count++;
            }
        }
    };
}

const rmBreakLine = (message) => {
  return message.replace(/(\r\n|\n|\r)/gm, " ");
};


module.exports = {
    retry,
    rmBreakLine
}