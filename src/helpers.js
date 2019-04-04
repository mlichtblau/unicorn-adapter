const exponentialBackoff = function (iteration, initialIntervalTime, maxTries, cb) {
  const delay = Math.pow(2, iteration) * initialIntervalTime;
  return cb().catch(error => {
    if (iteration < maxTries) {
      return setTimeout(() => exponentialBackoff(iteration + 1, initialIntervalTime, maxTries, cb), delay);
    }
  });
};

module.exports = {
  exponentialBackoff
};