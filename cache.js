const Cache = require("file-system-cache").default;

const cache = Cache({
  basePath: "./cache", // (optional) Path where cache files are stored (default).
  ns: "my-namespace", // (optional) A grouping namespace for items.
  hash: "sha1", // (optional) A hashing algorithm used within the cache key.
  ttl: 60, // (optional) A time-to-live (in secs) on how long an item remains cached.
})

const clearCache = async () => {
  await cache.clear();
};

if (process.argv[2] === "clear") {
  clearCache();
}


module.exports = {
  cache,
  clearCache,
};
