const expect = require('chai').expect;
const sinon = require('sinon');
const PublishingService = require('../src/publishing-service');

describe('PublishingService', function () {
  const publishingService = new PublishingService('http://testUrl.com/unicorn');

  describe('#convertEvent()', function () {
    context('when flat event', function () {
      const exampleEvent = {
        key1: 'value1',
        key2: 'value2'
      };

      const exampleEventResult = [
        {key1: 'value1'},
        {key2: 'value2'}
      ];

      it('should return an array', function () {
        expect(publishingService.convertEvent(exampleEvent)).to.be.an('array');
      });

      it('should return a correctly structured object', function () {
        expect(publishingService.convertEvent(exampleEvent)).to.deep.equal(exampleEventResult);
      });
    });

    context('when nested event', function () {
      const exampleEvent = {
        key1: 'value1',
        nested1: {
          key2: 'value2',
          nested2: {
            key3: 'value3'
          }
        }
      };

      const exampleEventResult = [
        {key1: 'value1'},
        {
          nested1: [
            {key2: 'value2'},
            {
              nested2: [
                {key3: 'value3'}
              ]
            }
          ]
        }
      ];

      it('should return an array', function () {
        expect(publishingService.convertEvent(exampleEvent)).to.be.an('array');
      });

      it('should return a correctly structured object', function () {
        expect(publishingService.convertEvent(exampleEvent)).to.deep.equal(exampleEventResult);
      });
    });
  });

  describe('#generateChimeraEvent()', function () {
    afterEach(function () {
      sinon.restore();
    });

    const exampleEvent = {
      key1: 'value1',
      key2: 'value2'
    };

    const exampleEventType = 'exampleEvent';

    it('should add Chimera properties to event', function () {
      sinon.replace(publishingService, 'generateEvent', sinon.fake());
      publishingService.generateChimeraEvent(exampleEvent, exampleEventType);
      expect(publishingService.generateEvent.calledOnce).to.be.true;
      expect(publishingService.generateEvent.lastCall.args[0]).to.have.property('GeneratedTimestamp');
      expect(publishingService.generateEvent.lastCall.args[0]).to.have.property('DO_state');
    });
  });

  describe('static #generateEventXml()', function () {
    const exampleEvent = [
      {key1: 'value1'},
      {key2: 'value2'}
    ];
    const exampleEventType = 'exampleEvent';

    it('should return an xml with the correct xml declaration', function () {
      let result = PublishingService.generateEventXml(exampleEvent, exampleEventType);
      expect(result).to.have.string('<?xml version="1.0" encoding="UTF-8"?>');
    });

    it('should return an xml with all keys', function () {
      let result = PublishingService.generateEventXml(exampleEvent, exampleEventType);
      expect(result).to.have.string('<key1>value1</key1>');
      expect(result).to.have.string('<key2>value2</key2>');
    });

    it('should return an xml with the schema location specified', function () {
      let result = PublishingService.generateEventXml(exampleEvent, exampleEventType);
      expect(result).to.have.string(`xsi:noNamespaceSchemaLocation="${ exampleEventType }.xsd"`);
    });
  });
});