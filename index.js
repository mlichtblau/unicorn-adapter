const SubscriptionService = require('./src/subscription-service');
const PublishingService = require('./src/publishing-service');

class UnicornAdapter {
  constructor(unicornUrl, callbackUrl, options) {
    let maxTries;
    if (options) {
      maxTries = options.maxTries || 7;
    } else {
      maxTries = 7;
    }
    this.subscriptionService = new SubscriptionService(UnicornAdapter.notificationUrl(unicornUrl), callbackUrl, maxTries);
    this.publishingService = new PublishingService(UnicornAdapter.eventUrl(unicornUrl));
  }

  static notificationUrl(unicornUrl) {
    return `${unicornUrl}/webapi/REST/EventQuery/REST`
  }

  static eventUrl(unicornUrl) {
    return `${unicornUrl}/webapi/REST/Event`
  }

  subscribeToEvent(eventName, attributes = ['*'], callbackUrl) {
    return this.subscriptionService.subscribeToEvent(eventName, attributes, callbackUrl);
  }

  unsubscribeFromEvent(uuid) {
    return this.subscriptionService.unsubscribeFromEvent(uuid);
  }

  generateEvent(event, eventType, dataObjectState = '') {
    return this.publishingService.generateChimeraEvent(event, eventType, dataObjectState);
  }

  generateChimeraEvent(event, eventType, dataObjectState = '') {
    return this.publishingService.generateChimeraEvent(event, eventType, dataObjectState);
  }
}

module.exports = UnicornAdapter;