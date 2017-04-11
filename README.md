# webapp-state [![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg)]() [![gzipped size](https://img.shields.io/badge/gzipped-0.7kb-brightgreen.svg)]()
A modern webapp utility with a small footprint that gives you convenient sugar on top of the low-level online/offline events and the Page Visibility API.

The compressed size of the library is < 0.7kB and exposes the following methods:

```javascript
appIs(state);
getState(state);
setupEventListener(type, callback, [options]);
setupStateAwareInterval(callback, timeout, [options]);
```

## Why?

Because we should be better at handling things in a smarter way when the app/site is not visible or offline. Maybe pause that network poller? Or pause that heavy computation?

## Browser support

All modern browsers are supported (IE11/edge/chrome/safari/firefox on desktop, as well as their mobile versions)

[http://caniuse.com/#feat=pagevisibility](http://caniuse.com/#feat=pagevisibility)

[http://caniuse.com/#feat=online-status](http://caniuse.com/#feat=online-status)

## Install

Install using yarn:

`yarn add webapp-state`

Or npm:

`npm install --save webapp-state`

If you're working with es-modules, import it:

```javascript
import { appIs, getState, setupEventListener, setupStateAwareInterval } from 'webapp-state';
```

If you're working with CommonJS-modules, require it:

```javascript
const webappState = require('webapp-state');
const { appIs, getState, setupEventListener, setupStateAwareInterval } = webappState;
```

### UMD or oldschool browser-global

```html
<script src="https://unpkg.com/webapp-state/dist/webappState.min.js"></script>
<script>
window.webappState.setupEventListener('app', function () {
	console.log(window.webappState.getState());
});
</script>
```

## Example usage

To do something cool, when the browser tab becomes visible:

```javascript
import { setupEventListener } from 'webapp-state';

const removeListener = setupEventListener('visibility', (visibility) => {
	if (visibility === 'visible') {
		theUserIsBackTimeToDoCoolStuff();
	}
});
// ...later on, if you decide you don't want to do this anymore
removeListener();
```

To do something when the users device/browser is disconnected/connected to the network:
```javascript
import { setupEventListener } from 'webapp-state';

const removeListener = setupEventListener('connectivity', (connectivity) => {
	if (connectivity === 'offline') {
		oopsTheUserLostConnectionLetsStoreThingsInMemory();
	} else if (connectivity === 'online') {
		connectionRestoredLetsPostCoolStuffToTheServer();
	}
});
// ...later on, if you decide you don't want to do this anymore
removeListener();
```

To do something when the users device/browser is active (connected and visible) or inactive (either disconnected or invisible):
```javascript
import { setupEventListener } from 'webapp-state';

const removeListener = setupEventListener('app', (appState) => {
	if (appState === 'active') {
		yayLetsRoll();
	} else if (appState === 'inactive') {
		darnWellHaveToWait();
	}
});
// ...later on, if you decide you don't want to do this anymore
removeListener();
```

To poll for updated content on a regular basis (and pause whenever the app/site is offline/invisible):
```javascript
import { setupStateAwareInterval } from 'webapp-state';

// This one will trigger every five seconds, if the app is online and visible (if not, it will pause)
const removeInterval = setupStateAwareInterval(() => {
	fetchNewContent();
}, 5000);
// ...later on, if you decide you don't want to do this anymore
removeInterval();
```

## Docs

### getState(state)

getState takes one argument, a string with the name of the state that you want to get current state of. It returns a string with the current state.

```javascript
import { getState } from 'webapp-state';

console.log(getState('visible')); // Prints either "visible" or "invisible"
console.log(getState('connectivity')); // Prints either "online" or "offline"
console.log(getState('active')); // Prints "active" if the app is online and visible, "inactive" otherwise
console.log(getState()); // Prints an object with all three states above { online, visible, active }
```

### appIs(state)

getState takes one argument, a string with the name of a state. It then returns true if the app is in that state, false otherwise.

```javascript
import { appIs, setupEventListener } from 'webapp-state';

setupEventListener('app', () => {
	if (appIs('online')) {
		console.log('App is online!');
	}
	if (appIs('offline')) {
		console.log('App is offline...');
	}
	if (appIs('visible')) {
		console.log('App is visible!');
	}
	if (appIs('invisible')) {
		console.log('App is invisible...');
	}
	if (appIs('active')) {
		console.log('App is active!');
	}
	if (appIs('inactive')) {
		console.log('App is inactive...');
	}
}, { triggerOnSetup: true });
```

### setupEventListener(type, callback, [options])

Listen to changes in visibility, connectivity or both (app)

If "type" is "visibility":  
The callback will be called with 'hidden' or 'visible' when the visibility-state changes

If "type" is "visibility":  
The callback will be called with 'offline' or 'online' when the online-state changes

If "type" is "app":
The callback will be called with 'inactive' if;  
the online-state, or the visible-state changes and one of the states are either 'offline' OR 'invisible'  
The callback will be called with 'active' if;  
The online-state, or the visible-state changes and the states are 'online' AND 'visible'

The options object has two optional options that defaults to { once: false, triggerOnSetup: false }  
Set "once" to true, to remove the listener after the first trigger.  
Set "triggerOnSetup" to true to trigger the listener immediately when it is setup.

```javascript
import { setupEventListener } from 'webapp-state';

setupEventListener('visibility', (visibility) => {
	console.log('Visibility changed to', visibility); // visibility = visible or invisible
});

setupEventListener('connectivity', (connectivity) => {
	console.log('Connectivity changed to', connectivity); // connectivity = online or offline
});

setupEventListener('app', (appState) => {
	console.log('App state changed to', appState); // appState = active or inactive
});
```

### setupStateAwareInterval(callback, timeout, [options])

Like the native setInterval but it will pause the interval when the app-state is not in the given options.state.
Default is that it sets the interval as long as the app is active (online and visible) and pauses it otherwise.

The options object has two optional options that defaults to { triggerOnSetup: false, state: 'active' }  
Set "triggerOnSetup" to true to trigger the callback immediately when it is set. (and when reset after a pause)  
Set "state" to the state that you want the interval to run on, visible/invisible/online/offline/active/inactive (default is active)

```javascript
import { setStateAwareInterval } from 'webapp-state';

setStateAwareInterval(() => {
	console.log('Hello active app!'); // Will be printed every five second when the app is active (online and visible)
}, 5000);

setStateAwareInterval(() => {
	console.log('Hello connected app!'); // Will be printed immediately and then every five second when the app is online
}, 5000, { triggerOnSetup: true, state: 'online' });

setStateAwareInterval(() => {
	console.log('Hello visible app!'); // Will be printed every third second when the app is visible
}, 3000, { state: 'visible' });
```

### [Changelog](CHANGELOG.md)
