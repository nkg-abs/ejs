const { existsSync, mkdirSync } = require('fs');
const { map } = require('@laufire/utils/collection');
const { write } = require('../templateManager');

const writeCode = ({ config: { content }}) =>
	map(content, ({ path, output, fileName }) => {
		existsSync(path) || mkdirSync(path);
		write(`${ path }/${ fileName }`, output);
	});

module.exports = writeCode;
