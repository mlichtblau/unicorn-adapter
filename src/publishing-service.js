const request = require('request-promise');
const xml = require('xml');

class PublishingService {
  constructor(eventUrl) {
    this.eventUrl = eventUrl;
  }

  convertEvent(event) {
    if (typeof event !== 'object') return event;
    return Object.keys(event).map(key => {
      return {[key]: this.convertEvent(event[key])};
    });
  }

  generateEvent(event, eventType, dataObjectState) {
    const convertedEvent = this.convertEvent(event);
    const eventXml = PublishingService.generateEventXml(convertedEvent, eventType, dataObjectState);
    return this.sendEvent(eventXml);
  }

  generateChimeraEvent(event, eventType, dataObjectState) {
    event['GeneratedTimestamp'] = '';
    event['DO_state'] = dataObjectState;
    return this.generateEvent(event, eventType);
  }

  static generateEventXml(event, eventType) {
    const xmlDocument = {};
    xmlDocument[eventType] = [...event, {
      _attr: {
        'xmlns': "",
        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
        'xsi:noNamespaceSchemaLocation': `${ eventType }.xsd`
      }
    }];
    return xml(xmlDocument, {declaration: true});
  }

  sendEvent(eventXml) {
    return request.post(this.eventUrl, {
      headers: {'Content-Type': 'application/xml'},
      body: eventXml
    });
  }
}

module.exports = PublishingService;