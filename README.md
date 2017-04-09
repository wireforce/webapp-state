# webapp-state [![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg)]() [![gzipped size](https://img.shields.io/badge/gzipped-0.7kb-brightgreen.svg)]()
A modern and small webapp utility with convenient sugar on top of the low-level online/offline events and the Page Visibility API

The compressed size of the library is < 0.7kB and exposes the following methods:

```
appIs(state);
getState(state);
addVisibilityChangeListener(callback, [options]);
addOnlineChangeListener(callback, [options]);
addAppStateChangeListener(callback, [options]);
setStateAwareInterval(callback, timeout, [options]);
```

## Browser support

All modern browsers are supported (IE11/edge/chrome/safari/firefox on desktop, as well as their mobile versions)

[http://caniuse.com/#feat=pagevisibility](http://caniuse.com/#feat=pagevisibility)

[http://caniuse.com/#feat=online-status](http://caniuse.com/#feat=online-status)

## Install
Install using yarn or npm:

`yarn add webapp-state`

`npm install --save webapp-state`

## Example usage

To check if there is a new version available of your SPA, when the browser tab becomes visible:
```
import { addVisibilityChangeListener } from 'webapp-state';

const removeListener = addVisibilityChangeListener((visibility) => {
	if (visibility === 'visible') {
		doNewVersionCheck();
	}
});
// ...later on, if you decide you don't want to do this anymore
removeListener();
```

To poll for updated content on a regular basis (and pause whenever the app/site is offline/invisible):
```
import { setStateAwareInterval } from 'webapp-state';

// This one will trigger every five seconds, if the app is online and visible (if not, it will pause)
// You can pass { triggerOnSetup: true } as a third parameter if you want it to trigger immediately on setup
const removeInterval = setStateAwareInterval(() => {
	fetchNewContent();
}, 5000);
// ...later on, if you decide you don't want to do this anymore
removeInterval();
```

## Docs

### getState(state)

getState takes one argument, a string with the name of the state that you want to get current state of. It returns a string with the current state.

```
import { getState } from 'webapp-state';

console.log(getState('online')); // Prints either "online" or "offline"
console.log(getState('visible')); // Prints either "visible" or "invisible"
console.log(getState('active')); // Prints "active" if the app is online and visible, "inactive" otherwise
console.log(getState()); // Prints an object with all three states above { online, visible, active }
```

### appIs(state)

getState takes one argument, a string with the name of a state. It then returns true if the app is in that state, false otherwise.

```
import { appIs, addAppStateChangeListener } from 'webapp-state';

addAppStateChangeListener(() => {
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
});
```

### addVisibilityChangeListener(callback, [options])

Listen to changes in visibility. Fires the callback with a string, visible or invisible, when the state changes.
The options object has two optional options that defaults to { once: false, triggerOnSetup: false }
Set "once" to true, to remove the listener after the first trigger.
Set "triggerOnSetup" to true to trigger the listener immediately when it is set.

```
import { addVisibilityChangeListener } from 'webapp-state';

addVisibilityChangeListener((visibility) => {
	console.log('Visibility changed to', visibility); // visibility = visible or invisible
});
```

### addOnlineChangeListener(callback, [options])

Listen to changes in connectivity. Fires the callback with a string, online or offline, when the state changes.
The options object has two optional options that defaults to { once: false, triggerOnSetup: false }
Set "once" to true, to remove the listener after the first trigger.
Set "triggerOnSetup" to true to trigger the listener immediately when it is set.

```
import { addOnlineChangeListener } from 'webapp-state';

addOnlineChangeListener((connectivity) => {
	console.log('Connectivity changed to', connectivity); // connectivity = online or offline
});
```

### addAppStateChangeListener(callback, [options])

Listen to changes in visibility and connectivity. Fires the callback with a string, active (both online and visible) or inactive, when the state changes.
The options object has two optional options that defaults to { once: false, triggerOnSetup: false }
Set "once" to true, to remove the listener after the first trigger.
Set "triggerOnSetup" to true to trigger the listener immediately when it is set.

```
import { addAppStateChangeListener } from 'webapp-state';

addAppStateChangeListener((appState) => {
	console.log('App state changed to', appState); // appState = online or offline
});
```

### setStateAwareInterval(callback, timeout, [options])

Like the native setInterval but it will pause the interval when the app-state is not in the given options.state.
Default is that it sets the interval as long as the app is active (online and visible) and pauses it otherwise.
The options object has two optional options that defaults to { triggerOnSetup: false, state: 'active' }
Set "triggerOnSetup" to true to trigger the callback immediately when it is set.
Set "state" to the state that you want the interval to run on, visible/invisible/online/offline/active/inactive (default is active)

```
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
