# webapp-state
A modern and small webapp utility with convenient sugar on top of the low-level online/offline events and the Page Visibility API

The compressed size of the library is < 0.7kB

## Install
Install using yarn or npm:

`yarn add webapp-state`

`npm install --save webapp-state`

## Browser support

All modern browsers are supported (IE11/edge/chrome/safari/firefox on desktop, as well as their mobile versions)
[http://caniuse.com/#feat=pagevisibility](http://caniuse.com/#feat=pagevisibility)
[http://caniuse.com/#feat=online-status](http://caniuse.com/#feat=online-status)

## Example usage

## API docs

### getState()
```
import { getState } from 'webapp-state';

console.log(getState('online')); // Prints either "online" or "offline"
console.log(getState('visible')); // Prints either "visible" or "invisible"
console.log(getState('active')); // Prints "active" if the app is online and visible, "inactive" otherwise
console.log(getState()); // Prints an object with al three states above { online, visible, active }
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
	console.log('Hello active app!'); // Will be printed every five second if the app is active (online and visible)
}, 5000);

setStateAwareInterval(() => {
	console.log('Hello connected app!'); // Will be printed immediately and then every five second if the app is online
}, 5000, { triggerOnSetup: true, state: 'online' });
```

### [Changelog](CHANGELOG.md)
