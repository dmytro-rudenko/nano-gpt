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

module.exports = {
    retry,
}