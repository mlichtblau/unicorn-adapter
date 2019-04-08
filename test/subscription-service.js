const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('request-promise');
const SubscriptionService = require('../src/subscription-service');

describe('SubscriptionService', function () {
  const exampleUrl = 'https://example.com';
  const subscriptionService = new SubscriptionService(exampleUrl, 'http://exampleCallbackUrl');

  describe('#deleteNotificationRule()', function () {
    beforeEach(function () {
      sinon.stub(request, 'delete').resolvesArg(0);
    });

    afterEach(function () {
      sinon.restore();
    });

    const exampleNotificationId = 1;

    it('should call delete only once', function () {
      const $result = subscriptionService.deleteNotificationRule(exampleNotificationId);
      expect($result).to.be.fulfilled.then(result => {
        expect(request.delete.calledOnce);
      })
    });

    it('should generate right url', function () {
      const $result = subscriptionService.deleteNotificationRule(exampleNotificationId);
      return expect($result).to.eventually.equal(`${ exampleUrl }/${ exampleNotificationId }`);
    });
  });
});