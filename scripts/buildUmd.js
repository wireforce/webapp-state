const fs = require('fs');
const path = require('path');

const src = `
	(function (root, factory) {
		if (typeof define === "function" && define.amd) {
			define([], factory);
		} else {
			root.webappState = factory();
		}
	}(this, function () {
		var exports = {};
		${fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.js'))}
		return exports;
	}));
`.replace(/[\t\n]/g, '');

fs.writeFileSync(path.join(__dirname, '..', 'dist', 'webappState.min.js'), src);
