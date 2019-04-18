const request = require('request-promise');
const queryString = require('esper-language').createEsperQueryForEventType;

const exponentialBackoff = require('./helpers').exponentialBackoff;

class SubscriptionService {
  constructor(notificationUrl, callbackUrl, maxTries) {
    this.notificationUrl = notificationUrl;
    this.callbackUrl = callbackUrl;
    this.maxTries = maxTries;
  }

  subscribeToEvent(eventName, attributes, filter, callbackUrl) {
    callbackUrl = callbackUrl || this.callbackUrl;
    return exponentialBackoff(1, 1000, this.maxTries, () => {
      return this.createNotificationRule(queryString(eventName, attributes, filter), callbackUrl)
    })
  }

  unsubscribeFromEvent(uuid) {
    return this.deleteNotificationRule(uuid);
  }

  createNotificationRule(queryString, callbackUrl) {
    const body = {
      notificationPath: callbackUrl,
      queryString
    };
    return request.post(this.notificationUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      },
      json: true,
      body
    });
  }

  deleteNotificationRule(uuid) {
    return request.delete(`${ this.notificationUrl }/${ uuid }`);
  }
}

module.exports = SubscriptionService;