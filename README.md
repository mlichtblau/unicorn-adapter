# Unicorn Adapter
![npm](https://img.shields.io/npm/v/unicorn-adapter.svg)
![NPM](https://img.shields.io/npm/l/unicorn-adapter.svg)
![Twitter Follow](https://img.shields.io/twitter/follow/lichtblau.svg?style=popout)

Unicorn Adapter is a node library to help subscribe to events in the event processing platform [Unicorn](https://github.com/bptlab/Unicorn).

## Getting started

`npm install unicorn-adapter` to install the package

```Javascript
const UnicornAdapter = require('unicorn-adapter');

let unicornAdapter = new UnicornAdapter("Your Unicorn Url", "Your callback Url", options);
let uuid;

unicornAdapter.subscribeToEvent('EventType').then(subscriptionId => {
    uuid = subscriptionUuid;
    console.log(`Subscription UUID: ${ subscriptionId }`);
});

unicornAdapter.unsubscribeFromEvent(uuid);
```

Available options:
* `maxTries` - Number of retries

## Authors

* **Marius Lichtblau** - [mlichtblau](https://github.com/mlichtblau) - [lichtblau.io](https://lichtblau.io) - [@lichtblau](https://twitter.com/lichtblau)
