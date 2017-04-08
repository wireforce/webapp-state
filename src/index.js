/**
 * Returns the state as a string for the given state, or all states in an object if no state is given
 *
 * @param {String} state
 * @returns {String|Object}
 */
function getState(state) {
	switch (state) {
	case 'visibility':
	case 'visible':
	case 'invisible':
		return document.hidden ? 'hidden' : 'visible';
	case 'online':
	case 'offline':
		return typeof navigator.onLine !== 'undefined' && !navigator.onLine ? 'offline' : 'online';
	case 'appState':
	case 'active':
	case 'inactive':
		return (getState('visible') !== 'visible' || getState('online') !== 'online') ? 'inactive' : 'active';
	default:
		return {
			visible: getState('visible'),
			online: getState('online'),
			active: getState('active')
		};
	}
}

/**
 * Returns boolean indicating if the app is in the given state
 *
 * @param {String} state
 * @returns {Boolean}
 */
function appIs(state) {
	return getState(state) === state;
}

/**
 * Add a callback that will receive 'hidden' or 'visible' when the visibility-state changes
 *
 * @param {Function} callback
 * @param {Object} [options]
 * @returns {function()}
 */
function addVisibilityChangeListener(callback, options = {}) {
	const listener = () => {
		callback(getState('visible'));
		if (options.once) {
			removeListener(); // eslint-disable-line
		}
	};
	const removeListener = () => {
		document.removeEventListener('visibilitychange', listener, false);
	};
	document.addEventListener('visibilitychange', listener, false);
	return removeListener;
}

/**
 * Add a callback the will receive 'offline' or 'online' when the online-state changes
 *
 * @param {Function} callback
 * @param {Object} [options]
 * @returns {function()}
 */
function addOnlineChangeListener(callback, options = {}) {
	const listener = () => {
		callback(getState('online'));
		if (options.once) {
			removeListener(); // eslint-disable-line
		}
	};
	const removeListener = () => {
		window.removeEventListener('offline', listener, false);
		window.removeEventListener('online', listener, false);
	};
	window.addEventListener('offline', listener, false);
	window.addEventListener('online', listener, false);
	return removeListener;
}

/**
 * Listen to the app state.
 * The callback will be called with 'inactive' if:
 * the online-state, or the visible-state changes and one of the states are either 'offline' OR 'invisible'
 *
 * The callback will be called with 'active' if:
 * the online-state, or the visible-state changes and the states are 'online' AND 'visible'
 *
 * @param {Function} callback
 * @returns {function()}
 */
function addAppStateChangeListener(callback) {
	const emit = () => {
		callback(getState('active'));
	};
	const removeVisibilityListener = addVisibilityChangeListener(emit);
	const removeOnlineListener = addOnlineChangeListener(emit);
	return () => {
		removeVisibilityListener();
		removeOnlineListener();
	};
}

/**
 * Like the native setInterval but it will pause the interval when the app-state is not in the given options.state
 * Default is that it sets the interval as long as the app is active (online and visible)
 *
 * @param {Function} callback
 * @param {Number} timeout
 * @param {Object} options
 * @returns {function()}
 */
function setStateAwareInterval(callback, timeout, options = { triggerOnSetup: false, state: 'active' }) {
	let interval;
	let listener = addAppStateChangeListener;
	if (options.state === 'visible') {
		listener = addVisibilityChangeListener;
	} else if (options.state === 'online') {
		listener = addOnlineChangeListener;
	}

	const setupInterval = () => {
		if (options.triggerOnSetup) {
			callback();
		}
		return setInterval(callback, timeout);
	};

	if (getState(options.state) === options.state) {
		interval = setupInterval();
	}

	const removeListener = listener((newState) => {
		if (newState === options.state) {
			interval = setupInterval();
		} else {
			clearInterval(interval);
		}
	});

	return () => {
		removeListener();
		clearInterval(interval);
	};
}

export {
	appIs,
	getState,
	addVisibilityChangeListener,
	addOnlineChangeListener,
	addAppStateChangeListener,
	setStateAwareInterval,
};
