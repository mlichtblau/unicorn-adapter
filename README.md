# Unicorn Adapter
[![Travis (.org)](https://img.shields.io/travis/mlichtblau/unicorn-adapter.svg)](https://travis-ci.org/mlichtblau/unicorn-adapter)
[![Coverage Status](https://coveralls.io/repos/github/mlichtblau/unicorn-adapter/badge.svg?branch=master)](https://coveralls.io/github/mlichtblau/unicorn-adapter?branch=master)
[![npm](https://img.shields.io/npm/v/unicorn-adapter.svg)](https://www.npmjs.com/package/unicorn-adapter)
![NPM](https://img.shields.io/npm/l/unicorn-adapter.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/lichtblau.svg?style=popout)](https://twitter.com/lichtblau)

Unicorn Adapter is a node library to help subscribe to events in the event processing platform [Unicorn](https://github.com/bptlab/Unicorn).

## Getting started

`npm install unicorn-adapter` to install the package

```Javascript
const UnicornAdapter = require('unicorn-adapter');

let unicornAdapter = new UnicornAdapter("Your Unicorn Url", "Your callback Url", options);
```

Available options:
* `maxTries` - Number of retries

### Subscribe to events
```Javascript
let uuid;
unicornAdapter.subscribeToEvent('EventType').then(subscriptionId => {
    uuid = subscriptionUuid;
    console.log(`Subscription UUID: ${ subscriptionId }`);
});

unicornAdapter.unsubscribeFromEvent(uuid);
```

### Publish events
```Javascript
const exampleEventType = 'exampleEventType';
const exampleEvent = {
  key1: 'value1',
  key2: 'value2'
};

// Sent event to Unicorn
unicornAdapter.generateEvent(exampleEvent, exampleEventType).then(eventId => {
  console.log(`EventId: ${ eventId }`);
});

// Adds TimeStamp and DO_state to event before sending event to Unicorn
unicornAdapter.generateChimeraEvent(exampleEvent, exampleEventType, 'state1').then(eventId => {
  console.log(`EventId: ${ eventId }`);
});
```

## Authors

* **Marius Lichtblau** - [mlichtblau](https://github.com/mlichtblau) - [lichtblau.io](https://lichtblau.io) - [@lichtblau](https://twitter.com/lichtblau)
