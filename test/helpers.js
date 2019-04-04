const expect = require('chai').expect;
const exponentialBackoff = require('../src/helpers').exponentialBackoff;

describe('#exponentialBackoff()', function () {
  let maxTries = 5, tries;
  let getSuccessfullAfterTriesFn = (successfulAfterTries) => {
    return function () {
      return new Promise(function (resolve, reject) {
        tries += 1;
        if (tries === successfulAfterTries) resolve(true);
        else reject(new Error('Blubber'));
      })
    }
  };

  context('when successful after less than maxTries', function () {
    beforeEach(function () {
      tries = 0;
    });

    it('should resolve eventually', function () {
      let $result = exponentialBackoff(1, 1, maxTries, getSuccessfullAfterTriesFn(3));
      return expect($result).to.eventually.be.true;
    });
  });

  context('when not successful after less than maxTries', function () {
    beforeEach(function () {
      tries = 0;
    });

    it('should throw an error', function () {
      let $result = exponentialBackoff(1, 1, 3, getSuccessfullAfterTriesFn(10));
      return expect($result).to.eventually.be.rejected;
    });
  });
});