# webapp-state
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

## API docs

### getState()
```
import { getState } from 'webapp-state';

console.log(getState('online')); // Prints either "online" or "offline"
console.log(getState('visible')); // Prints either "visible" or "invisible"
console.log(getState('active')); // Prints "active" if the app is online and visible, "inactive" otherwise
console.log(getState()); // Prints an object with all three states above { online, visible, active }
```

### appIs()
```
import { appIs } from 'webapp-state';

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
```

### addVisibilityChangeListener()
```
import { addVisibilityChangeListener } from 'webapp-state';

addVisibilityChangeListener((visibility) => {
	console.log('Visibility changed to', visibility); // visibility = visible or invisible
});
```

### addOnlineChangeListener()
```
import { addOnlineChangeListener } from 'webapp-state';

addOnlineChangeListener((connectivity) => {
	console.log('Connectivity changed to', connectivity); // connectivity = online or offline
});
```

### addAppStateChangeListener()
```
import { addAppStateChangeListener } from 'webapp-state';

addAppStateChangeListener((appState) => {
	console.log('App state changed to', appState); // appState = online or offline
});
```

### setStateAwareInterval()
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
