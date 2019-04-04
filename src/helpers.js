const exponentialBackoff = function (iteration, initialIntervalTime, maxTries, cb) {
  const delay = Math.pow(2, iteration) * initialIntervalTime;
  return cb().catch(error => {
    if (iteration < maxTries) {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          exponentialBackoff(iteration + 1, initialIntervalTime, maxTries, cb)
            .then(result => resolve(result))
            .catch(error => reject(error));
        }, delay);
      });
    } else {
      throw error;
    }
  });
};

module.exports = {
  exponentialBackoff
};