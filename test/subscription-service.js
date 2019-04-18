const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('request-promise');
const SubscriptionService = require('../src/subscription-service');

describe('SubscriptionService', function () {
  const exampleUrl = 'https://example.com';
  const exampleCallbackUrl = 'http://exampleCallbackUrl';
  const subscriptionService = new SubscriptionService(exampleUrl, exampleCallbackUrl);

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

    it('should generate the right url', function () {
      const $result = subscriptionService.deleteNotificationRule(exampleNotificationId);
      return expect($result).to.eventually.equal(`${ exampleUrl }/${ exampleNotificationId }`);
    });
  });

  describe('#createNotificationRule', function () {
    beforeEach(function () {
      sinon.stub(request, 'post').resolvesArg(1);
    });

    afterEach(function () {
      sinon.restore();
    });

    const exampleQuery = 'SELECT * FROM exampleEventType';

    it('should have a Content-Type header', function () {
      const $result = subscriptionService.createNotificationRule(exampleQuery, subscriptionService.callbackUrl);
      return expect($result).to.eventually.have.property('headers').that.has.property('Content-Type', 'application/json');
    });

    it('should have an Accept header', function () {
      const $result = subscriptionService.createNotificationRule(exampleQuery, subscriptionService.callbackUrl);
      return expect($result).to.eventually.have.property('headers').that.has.property('Accept', 'text/plain');
    });

    it('should have body with query string', function () {
      const $result = subscriptionService.createNotificationRule(exampleQuery, subscriptionService.callbackUrl);
      return expect($result).to.eventually.have.property('body').that.has.property('queryString', exampleQuery);
    });

    it('should have body with notification path', function () {
      const $result = subscriptionService.createNotificationRule(exampleQuery, subscriptionService.callbackUrl);
      return expect($result).to.eventually.have.property('body').that.has.property('notificationPath').that.has.string(exampleCallbackUrl);
    });
  });

  describe('#subscribeToEvent()', function () {
    beforeEach(function () {
      sinon.stub(subscriptionService, 'createNotificationRule').resolvesArg(0);
    });

    afterEach(function () {
      sinon.restore();
    });

    const exampleEventType = 'exampleEventType';
    const exampleAttributes = ['att1', 'att2'];

    it('should create right esper query', function () {
      const $result = subscriptionService.subscribeToEvent(exampleEventType, exampleAttributes, {}, subscriptionService.callbackUrl);
      return expect($result).to.eventually.equal('SELECT att1, att2 FROM exampleEventType');
    });
  });

  describe('#unsubscribeFromEvent()', function () {
    beforeEach(function () {
      sinon.stub(subscriptionService, 'deleteNotificationRule').resolvesArg(0);
    });

    afterEach(function () {
      sinon.restore();
    });

    it('should delete notification rule', function () {
      const $result = subscriptionService.unsubscribeFromEvent(1);
      return expect($result).to.eventually.equal(1);
    });
  });
});