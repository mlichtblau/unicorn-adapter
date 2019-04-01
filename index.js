const request = require('request-promise');

const exponentialBackoff = function (iteration, initialIntervalTime, maxTries, cb) {
  const delay = Math.pow(2, iteration) * initialIntervalTime;
  return cb().catch(error => {
    if (iteration < maxTries) {
      return setTimeout(() => exponentialBackoff(iteration + 1, initialIntervalTime, maxTries, cb), delay);
    }
  });
};


class UnicornAdapter {
  static get unicornHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    }
  };

  constructor(unicornUrl, callbackUrl, options) {
    this.unicornUrl = unicornUrl;
    this.callbackUrl = callbackUrl;
    if (options) {
      this.maxTries = options.maxTries || 7;
    } else {
      this.maxTries = 7;
    }
  }

  get notificationUrl() {
    return `${this.unicornUrl}/webapi/REST/EventQuery/REST`
  }

  subscribeToEvent(eventName, attributes = ['*'], callbackUrl) {
    callbackUrl = callbackUrl || this.callbackUrl;
    const attributesString = attributes.join(", ");
    const esperQuery = `SELECT ${ attributesString } FROM ${ eventName }`;
    return exponentialBackoff(1, 1000, this.maxTries, () => {
      return this.createNotificationRule(esperQuery, callbackUrl)
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
      headers: UnicornAdapter.unicornHeaders,
      json: true,
      body
    });
  }

  deleteNotificationRule(uuid) {
    return request.delete(`${ this.notificationUrl }/${ uuid }`);
  }
}

module.exports = UnicornAdapter;