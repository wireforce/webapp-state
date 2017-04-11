/**
 * Resolves all statuses to either visibility, connectivity or app
 *
 * @param {String} state
 * @returns {String}
 */
function resolveType(state) {
	switch (state) {
	case 'visibility':
	case 'visible':
	case 'invisible':
		return 'visibility';
	case 'connectivity':
	case 'online':
	case 'offline':
		return 'connectivity';
	case 'app':
	case 'active':
	case 'inactive':
		return 'app';
	default:
		return '';
	}
}

/**
 * Returns the state as a string for the given state, or all states in an object if no state is given
 *
 * @param {String} [state]
 * @returns {String|Object}
 */
function getState(state) {
	switch (resolveType(state)) {
	case 'visibility':
		return document.hidden ? 'hidden' : 'visible';
	case 'connectivity':
		return typeof navigator.onLine !== 'undefined' && !navigator.onLine ? 'offline' : 'online';
	case 'app':
		return (getState('visibility') !== 'visible' || getState('connectivity') !== 'online') ? 'inactive' : 'active';
	default:
		return {
			visible: getState('visibility'),
			online: getState('connectivity'),
			active: getState('app')
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
 * If "type" is "visibility":
 * The callback will be called with 'hidden' or 'visible' when the visibility-state changes
 *
 * If "type" is "visibility":
 * The callback will be called with 'offline' or 'online' when the online-state changes
 *
 * If "type" is "app":
 * The callback will be called with 'inactive' if;
 * the online-state, or the visible-state changes and one of the states are either 'offline' OR 'invisible'
 * The callback will be called with 'active' if;
 * the online-state, or the visible-state changes and the states are 'online' AND 'visible'
 *
 * @param {String} type | visibility, connectivity, app
 * @param {Function} callback | will receive a single argument with the current state of "type", as a string
 * @param {Object} [options] | { triggerOnSetup: false, once: false }
 * @returns {function()}
 */
function setupEventListener(type, callback, options = { triggerOnSetup: false, once: false }) {
	let removeListener = () => {};

	const listener = () => {
		callback(getState(type));
		if (options.once) {
			removeListener();
		}
	};

	if (options.triggerOnSetup) {
		callback(getState(type));
	}

	if (type === 'visibility') {
		removeListener = () => {
			document.removeEventListener('visibilitychange', listener, false);
		};
		document.addEventListener('visibilitychange', listener, false);
	} else if (type === 'connectivity') {
		removeListener = () => {
			window.removeEventListener('offline', listener, false);
			window.removeEventListener('online', listener, false);
		};
		window.addEventListener('offline', listener, false);
		window.addEventListener('online', listener, false);
	} else if (type === 'app') {
		const removeVisibilityListener = setupEventListener('visibility', listener);
		const removeConnectivityListener = setupEventListener('connectivity', listener);
		removeListener = () => {
			removeVisibilityListener();
			removeConnectivityListener();
		};
	}

	return removeListener;
}

/**
 * Like the native setInterval but it will pause the interval when the current state is not in the given options.state
 * Default is that it sets the interval as long as the app is active (online and visible)
 *
 * @param {Function} callback
 * @param {Number} timeout
 * @param {Object} [options]
 * @returns {function()}
 */
function setupStateAwareInterval(callback, timeout, options = { triggerOnSetup: false, state: 'active' }) {
	const state = options.state || 'active';
	const setupInterval = () => {
		if (options.triggerOnSetup) {
			callback();
		}
		return setInterval(callback, timeout);
	};

	let interval;
	if (getState(state) === state) {
		interval = setupInterval();
	}

	const removeListener = setupEventListener(resolveType(state), (newState) => {
		if (newState === state) {
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
	setupEventListener,
	setupStateAwareInterval,
};
